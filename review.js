(() => {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  let frame = document.getElementById('preview');
  const panel = document.getElementById('preview-panel');
  const loading = document.getElementById('loading');
  const error = document.getElementById('load-error');
  const labels = ['сине-зелёный', 'глубокий бордовый', 'синий', 'насыщенный красный'];
  let current = '1';
  let timer;
  const readHash = () => tabs.find(tab => location.hash === `#variant-${tab.dataset.variant}`)?.dataset.variant || '1';
  function pending() {
    clearTimeout(timer);
    panel.setAttribute('aria-busy', 'true');
    loading.hidden = false;
    error.hidden = true;
    timer = setTimeout(() => { loading.hidden = true; error.hidden = false; panel.setAttribute('aria-busy','false'); }, 15000);
  }
  function loaded() {
    clearTimeout(timer);
    loading.hidden = true;
    error.hidden = true;
    panel.setAttribute('aria-busy', 'false');
  }
  function select(value, updateUrl = false, force = false) {
    const changed = current !== value;
    current = value;
    tabs.forEach(tab => {
      const active = tab.dataset.variant === value;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    const path = `variant-${value}/index.html?v=20261113-red-palettes`;
    panel.setAttribute('aria-labelledby', `tab-${value}`);
    frame.title = `Вариант ${value} — ${labels[Number(value)-1]}`;
    document.getElementById('open-variant').href = path;
    document.getElementById('fallback-link').href = path;
    document.title = `Согласование экранов — вариант ${value}`;
    document.getElementById('selection-status').textContent = frame.title;
    if (changed || force) {
      pending();
      const next = frame.cloneNode(false);
      next.src = path;
      bindFrame(next);
      frame.replaceWith(next);
      frame = next;
    }
    if (updateUrl && location.hash !== `#variant-${value}`) location.hash = `variant-${value}`;
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab.dataset.variant, true));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); tabs[next].focus(); select(tabs[next].dataset.variant, true); }
    });
  });
  function bindFrame(target) {
    target.addEventListener('load', () => { if (target === frame) loaded(); });
    target.addEventListener('error', () => { if (target !== frame) return; clearTimeout(timer); loading.hidden = true; error.hidden = false; panel.setAttribute('aria-busy','false'); });
  }
  bindFrame(frame);
  document.getElementById('retry').addEventListener('click', () => select(current, false, true));
  window.addEventListener('hashchange', () => select(readHash()));
  pending();
  select(readHash());
  try { if(frame.contentDocument?.readyState === 'complete' && frame.contentDocument.querySelector('.stage')) loaded(); } catch (_) { /* Local file previews have separate origins. */ }
})();
