(() => {
  const config = window.SUPABASE_CONFIG || {};
  const loginView = document.querySelector('#login-view');
  const dashboardView = document.querySelector('#dashboard-view');
  const loginForm = document.querySelector('#login-form');
  const loginStatus = document.querySelector('#login-status');
  const dashboardStatus = document.querySelector('#dashboard-status');
  const sessionKey = 'yiwucommerce-admin-session';
  let session = null;

  const setStatus = (target, message, isError = false) => {
    target.textContent = message;
    target.classList.toggle('is-error', isError);
  };
  const configured = () => Boolean(config.url && config.anonKey);
  const headers = () => ({ apikey: config.anonKey, Authorization: `Bearer ${session.access_token}` });
  const formatDate = value => value ? new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Unknown';
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));

  async function supabaseRequest(path) {
    const response = await fetch(`${config.url.replace(/\/$/, '')}/rest/v1/${path}`, { headers: headers() });
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    return response.json();
  }

  function showDashboard() {
    loginView.hidden = true;
    dashboardView.hidden = false;
    document.querySelector('#admin-user').textContent = session.user?.email || 'Signed-in administrator';
    loadDashboard();
  }

  function showLogin() {
    loginView.hidden = false;
    dashboardView.hidden = true;
    session = null;
  }

  async function signIn(email, password) {
    const response = await fetch(`${config.url.replace(/\/$/, '')}/auth/v1/token?grant_type=password`, {
      method: 'POST', headers: { apikey: config.anonKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error_description || result.msg || 'Unable to sign in');
    session = result;
    sessionStorage.setItem(sessionKey, JSON.stringify(session));
    showDashboard();
  }

  function metric(label, value, accent) { return `<div class="metric"><span>${label}</span><strong class="${accent}">${value}</strong></div>`; }
  function emptyRow(message) { return `<tr><td colspan="4" class="empty-cell">${message}</td></tr>`; }
  function renderRows(selector, rows, type) {
    document.querySelector(selector).innerHTML = rows.length ? rows.map(row => type === 'inquiry'
      ? `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.company || '-')}</td><td><span class="status status-${escapeHtml(row.status)}">${escapeHtml(row.status)}</span></td><td>${formatDate(row.created_at)}</td></tr>`
      : `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.email)}</td><td><span class="status status-${escapeHtml(row.status)}">${escapeHtml(row.status)}</span></td><td>${formatDate(row.created_at)}</td></tr>`).join('') : emptyRow('No records found');
  }

  async function loadDashboard() {
    setStatus(dashboardStatus, 'Updating dashboard...');
    try {
      const [inquiries, messages, products] = await Promise.all([
        supabaseRequest('inquiries?select=name,company,status,created_at&order=created_at.desc&limit=8'),
        supabaseRequest('contact_messages?select=name,email,status,created_at&order=created_at.desc&limit=8'),
        supabaseRequest('products?select=id&is_active=eq.true')
      ]);
      const pending = inquiries.filter(item => item.status === 'pending').length;
      document.querySelector('#metrics').innerHTML = metric('Active products', products.length, 'green') + metric('Total inquiries', inquiries.length, 'blue') + metric('Pending review', pending, pending ? 'amber' : 'green') + metric('Contact messages', messages.length, 'blue');
      document.querySelector('#inquiry-count').textContent = `${inquiries.length} shown`;
      document.querySelector('#message-count').textContent = `${messages.length} shown`;
      renderRows('#inquiries', inquiries, 'inquiry');
      renderRows('#messages', messages, 'message');
      setStatus(dashboardStatus, `Last updated ${formatDate(new Date())}`);
    } catch (error) {
      setStatus(dashboardStatus, error.message, true);
    }
  }

  loginForm.addEventListener('submit', event => { event.preventDefault(); if (!configured()) { setStatus(loginStatus, 'Add the Supabase URL and anon key in data/admin-config.js before signing in.', true); return; } setStatus(loginStatus, 'Signing in...'); signIn(new FormData(loginForm).get('email'), new FormData(loginForm).get('password')).catch(error => setStatus(loginStatus, error.message, true)); });
  document.querySelector('#refresh-button').addEventListener('click', loadDashboard);
  document.querySelector('#signout-button').addEventListener('click', () => { sessionStorage.removeItem(sessionKey); showLogin(); });
  try { session = JSON.parse(sessionStorage.getItem(sessionKey) || 'null'); } catch (error) { session = null; }
  if (session?.access_token && configured()) showDashboard(); else if (!configured()) setStatus(loginStatus, 'Dashboard is ready. Configure Supabase credentials to enable live monitoring.');
})();
