// ═══════════════════════════════════════════════
// Content Script - Bridge between web page & extension
// Injected on localhost pages
// ═══════════════════════════════════════════════

// Listen for messages from the web page
window.addEventListener('message', async (event) => {
  if (event.source !== window) return;

  // Ping: web page checking if extension exists
  if (event.data && event.data.type === 'NETFLIX_CL_PING') {
    window.postMessage({ type: 'NETFLIX_CL_PONG' }, '*');
    return;
  }

  // Inject: web page sending cookies to inject
  if (event.data && event.data.type === 'NETFLIX_CL_INJECT') {
    try {
      const result = await chrome.runtime.sendMessage({
        type: 'INJECT_COOKIES',
        cookies: event.data.cookies
      });
      window.postMessage({
        type: 'NETFLIX_CL_RESULT',
        ...result
      }, '*');
    } catch (err) {
      window.postMessage({
        type: 'NETFLIX_CL_RESULT',
        success: false,
        error: err.message
      }, '*');
    }
  }
});

// Announce presence on load
window.postMessage({ type: 'NETFLIX_CL_PONG' }, '*');
console.log('[Netflix Cookie Login] Extension content script loaded ✓');

