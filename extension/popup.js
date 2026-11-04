// ═══════════════════════════════════════════════
// Extension Popup - Quick cookie inject
// ═══════════════════════════════════════════════

let parsedCookies = [];

// File input
document.getElementById('fileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    const cookies = parseCookies(ev.target.result);
    if (!cookies || !cookies.length) {
      showStatus('error', '❌ Cookie không hợp lệ!');
      return;
    }
    parsedCookies = cookies;
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileCount').textContent = cookies.length + ' cookies';
    document.getElementById('fileBadge').classList.add('show');
    document.getElementById('uploadZone').classList.add('has-file');
    document.querySelector('.upload-icon').textContent = '✅';
    document.querySelector('.upload-text').textContent = 'File đã tải!';

    const btn = document.getElementById('btnInject');
    btn.className = 'btn ready';
    showStatus('success', `✅ Đã đọc ${cookies.length} cookie`);
  };
  reader.readAsText(file);
});

function removeFile() {
  parsedCookies = [];
  document.getElementById('fileInput').value = '';
  document.getElementById('fileBadge').classList.remove('show');
  document.getElementById('uploadZone').classList.remove('has-file');
  document.querySelector('.upload-icon').textContent = '📤';
  document.querySelector('.upload-text').textContent = 'Click để chọn file cookie';
  document.getElementById('btnInject').className = 'btn disabled';
  document.getElementById('status').className = 'status';
}

async function inject() {
  if (!parsedCookies.length) return;

  const btn = document.getElementById('btnInject');
  btn.innerHTML = '⏳ Đang inject...';

  try {
    const result = await chrome.runtime.sendMessage({
      type: 'INJECT_COOKIES',
      cookies: parsedCookies
    });

    if (result.success) {
      btn.className = 'btn success';
      btn.innerHTML = '✅ Thành công!';
      showStatus('success', `🎉 Đã inject ${result.count}/${result.total} cookie. Netflix đang mở...`);
    } else {
      btn.className = 'btn ready';
      btn.innerHTML = '🚀 Inject & Đăng Nhập';
      showStatus('error', `❌ ${result.error || 'Lỗi không rõ'}`);
    }
  } catch (err) {
    btn.className = 'btn ready';
    btn.innerHTML = '🚀 Inject & Đăng Nhập';
    showStatus('error', `❌ ${err.message}`);
  }
}

// ═══════════════════════════════════════════════
// Cookie parser
// ═══════════════════════════════════════════════
function parseCookies(raw) {
  raw = raw.trim();
  if (!raw) return null;

  // JSON array
  if (raw[0] === '[') {
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length) return arr;
    } catch(e) {}
  }

  // JSON object
  if (raw[0] === '{') {
    try { return [JSON.parse(raw)]; } catch(e) {}
  }

  // Netscape
  if (raw.includes('\t')) {
    const cookies = [];
    raw.split('\n').forEach(line => {
      line = line.trim();
      if (!line || line.startsWith('#')) return;
      const parts = line.split('\t');
      if (parts.length >= 7) {
        cookies.push({
          domain: parts[0],
          httpOnly: parts[1].toUpperCase() === 'TRUE',
          path: parts[2],
          secure: parts[3].toUpperCase() === 'TRUE',
          expirationDate: parseInt(parts[4]) || undefined,
          name: parts[5],
          value: parts[6]
        });
      }
    });
    if (cookies.length) return cookies;
  }

  // Raw string
  const cookies = [];
  raw.split(';').forEach(pair => {
    const idx = pair.indexOf('=');
    if (idx > 0) {
      cookies.push({
        name: pair.slice(0, idx).trim(),
        value: pair.slice(idx + 1).trim(),
        domain: '.netflix.com',
        path: '/'
      });
    }
  });
  return cookies.length ? cookies : null;
}

function showStatus(type, msg) {
  const el = document.getElementById('status');
  el.className = 'status show ' + type;
  el.textContent = msg;
}

