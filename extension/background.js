// ═══════════════════════════════════════════════
// Background Service Worker - Netflix Cookie Login
// Handles cookie injection via chrome.cookies API
// ═══════════════════════════════════════════════

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'INJECT_COOKIES') {
    injectCookies(message.cookies)
      .then(result => sendResponse(result))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true; // keep channel open for async
  }
});

async function injectCookies(cookies) {
  let count = 0;
  const errors = [];

  for (const ck of cookies) {
    try {
      const cookieDetails = {
        url: 'https://www.netflix.com',
        name: ck.name,
        value: ck.value,
        domain: ck.domain || '.netflix.com',
        path: ck.path || '/',
        secure: ck.secure !== undefined ? ck.secure : true,
        httpOnly: ck.httpOnly !== undefined ? ck.httpOnly : false,
        sameSite: ck.sameSite || 'no_restriction'
      };

      // Set expiration (1 year from now if not specified)
      if (ck.expirationDate) {
        cookieDetails.expirationDate = ck.expirationDate;
      } else {
        cookieDetails.expirationDate = Math.floor(Date.now() / 1000) + 365 * 24 * 3600;
      }

      // Normalize sameSite
      const sameSiteMap = {
        'no_restriction': 'no_restriction',
        'lax': 'lax',
        'strict': 'strict',
        'none': 'no_restriction',
        'unspecified': 'no_restriction',
        'Lax': 'lax',
        'None': 'no_restriction',
        'Strict': 'strict'
      };
      cookieDetails.sameSite = sameSiteMap[cookieDetails.sameSite] || 'no_restriction';

      await chrome.cookies.set(cookieDetails);
      count++;
    } catch (err) {
      errors.push(`${ck.name}: ${err.message}`);
    }
  }

  // Open Netflix in a new tab
  if (count > 0) {
    await chrome.tabs.create({ url: 'https://www.netflix.com/browse' });
  }

  return {
    success: count > 0,
    count,
    total: cookies.length,
    errors: errors.length ? errors : undefined
  };
}

