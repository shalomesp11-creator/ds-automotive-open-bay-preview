/* D&S — service menu, search, and the Repair Order request dialog. */
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const data = window.CATALOG || [];

  /* ------------------------------------------------------------ Icons */
  // Original line icons on a 24px grid, one per service category.
  const ICONS = {
    '01': '<path d="M4 11h8l2 2h3.5l3.4-3 .6 1.1-3.4 4.4H6.6L4 13.2z"/><path d="M7.5 11V8.6h3V11"/><path d="M20.6 17.2c0 .8-.6 1.4-1.3 1.4s-1.3-.6-1.3-1.4c0-.8 1.3-2.4 1.3-2.4s1.3 1.6 1.3 2.4z"/>',
    '02': '<path d="M6.5 9h9.5l2 2h2V9.2h1.5v7.6H20V15h-2l-2 2H9.6l-3.1-3z"/><path d="M9 9V7h5v2"/><path d="M2.5 10v6M2.5 13h4"/>',
    '03': '<circle cx="11" cy="13" r="8"/><circle cx="11" cy="13" r="2.6"/><path d="M14.2 4.6a9.6 9.6 0 0 1 6.2 5.8l-2.8 1.1a6.6 6.6 0 0 0-4.4-4.2z"/><path d="M11 7.6v.01M16.4 13h.01M11 18.4v.01M5.6 13h.01"/>',
    '04': '<rect x="6" y="2.8" width="12" height="7.4" rx="1.2"/><path d="M6 5.3h12M6 7.6h12"/><circle cx="12" cy="13.2" r="1.5"/><path d="M10.4 10.2l-.4 2.4 1 6M13.6 10.2l.4 2.4-1 6"/><circle cx="12" cy="19.6" r="2.4"/>',
    '05': '<path d="M7 3.8a3.6 3.6 0 0 0-3 5.6l10.3 9a3.6 3.6 0 1 0 5.1-5L9.6 4.7A3.6 3.6 0 0 0 7 3.8z"/><circle cx="7" cy="7.4" r="1.2"/><circle cx="16.8" cy="15.8" r="1.2"/>',
    '06': '<path d="M12 2.8a2 2 0 0 1 2 2v8.1a4 4 0 1 1-4 0V4.8a2 2 0 0 1 2-2z"/><path d="M12 8.5v7.2"/><path d="M2.5 20.5c1.6-1.1 3.2-1.1 4.8 0M16.7 20.5c1.6-1.1 3.2-1.1 4.8 0"/>',
    '07': '<path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6"/><path d="M9.6 3.9L12 6l2.4-2.1M9.6 20.1L12 18l2.4 2.1M3.4 10.4l3.1-.6-1-3M20.6 13.6l-3.1.6 1 3M3.4 13.6l3.1.6-1 3M20.6 10.4l-3.1-.6 1-3"/>',
    '08': '<path d="M5 20.5V5a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 14 5v15.5M3.5 20.5h12"/><path d="M7 6.5h5v4H7z"/><path d="M14 9h2.3l2.2 2.2v6.3a1.5 1.5 0 0 1-3 0V14H14M18.5 11.2V6.4L16.6 4.5"/>',
    '09': '<path d="M6 6v12M12 6v6M18 6v6M6 12h12"/><circle cx="6" cy="4.6" r="1.6"/><circle cx="12" cy="4.6" r="1.6"/><circle cx="18" cy="4.6" r="1.6"/><circle cx="6" cy="19.4" r="1.6"/><path d="M12 12v8"/><circle cx="12" cy="20.6" r="0.2"/>',
    '10': '<path d="M5 12h4.5M14.5 12H19"/><rect x="1.8" y="6" width="3.2" height="12" rx="1"/><rect x="19" y="6" width="3.2" height="12" rx="1"/><circle cx="12" cy="12" r="2.6"/><path d="M6.6 10l1.3 2-1.3 2M17.4 10l-1.3 2 1.3 2"/>',
    '11': '<rect x="3" y="7" width="18" height="12.5" rx="1.5"/><path d="M6.5 7V5h3v2M14.5 7V5h3v2M6.5 13h3.2M8.1 11.4v3.2M14.4 13h3.2"/>',
    '12': '<path d="M12 2.5v3M12 18.5v3"/><path d="M7.5 5.5h9M7.5 18.5h9"/><path d="M8 7.5l8 1.6-8 1.6 8 1.6-8 1.6 8 1.6-8 1.6"/>',
    '13': '<path d="M2 15h3"/><rect x="5" y="10" width="11" height="9" rx="4.5"/><path d="M16 14.5h3.5l1.8-2"/><path d="M19 8.2a1.6 1.6 0 1 1 2.6-1.4M15.2 6.4a1.3 1.3 0 1 1 2.2-.8"/>',
    '14': '<rect x="5" y="7" width="14" height="14" rx="3.5"/><path d="M10 7V4.2h4V7M8.5 4.2h7M5 14h14"/>',
    '15': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>',
    '16': '<path d="M18.5 12.5a6.5 6.5 0 1 1-6.5-6.5h9.5v6.5z"/><circle cx="12" cy="12.5" r="2.6"/><path d="M12 9.9V6M14.6 12.5h3.9"/>',
  };
  const icon = (id, cls = 'icn') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[id] || ''}</svg>`;
  $$('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });

  const BLURB = {
    '01': 'Oil changes, filters, fluid checks, and the scheduled service your owner’s manual calls for.',
    '02': 'Check engine light on? Brake or ABS warning? Buying a used car? Find out exactly what’s going on.',
    '03': 'Pads, rotors, drums, calipers, lines, and fluid — brakes that stop straight and quiet.',
    '04': 'From oil leaks and engine sensors to head gaskets, rebuilds, and full engine replacement.',
    '05': 'Timing belt and chain service on schedule, before a failure turns into engine damage.',
    '06': 'Radiators, water pumps, thermostats, hoses, and fans that keep the temperature gauge where it belongs.',
    '07': 'Leak detection, recharges, and compressor and condenser work to get your A/C blowing cold again.',
    '08': 'Fuel pumps, injectors, lines, and cleaning for easy starts and steady power.',
    '09': 'Clutch kits, flywheels, transmission fluid service, repair, and replacement.',
    '10': 'CV axles, joints, and boots, plus wheel bearings and hubs.',
    '11': 'Batteries, alternators, starters, sensors, wiring, and accessory installation.',
    '12': 'Shocks, struts, control arms, ball joints, tie rods, and steering racks for a straight, solid ride.',
    '13': 'Mufflers, catalytic converters, oxygen sensors, flex pipes, and exhaust leak repair.',
    '14': 'Diagnostics, maintenance, and component service for propane autogas (LPG) vehicles.',
    '15': 'Wheel installation, balancing, seasonal tire changeovers, and tire repair.',
    '16': 'Turbocharger diagnostics, replacement, oil leak repair, and boost system inspection.',
  };
  const SHORT = { '01': 'Maintenance', '02': 'Diagnostics & Inspections', '03': 'Brakes', '04': 'Engine Repair', '05': 'Timing Belt & Chain', '06': 'Cooling System', '07': 'A/C Service', '08': 'Fuel System', '09': 'Transmission & Clutch', '10': 'Drivetrain & Axles', '11': 'Electrical System', '12': 'Steering & Suspension', '13': 'Exhaust System', '14': 'Propane Autogas (LPG)', '15': 'Tires & Wheels', '16': 'Turbochargers' };
  const title = s => s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
    .replace(/A\/c/g, 'A/C').replace(/\(Lpg\)/g, '(LPG)').replace(/\bAnd\b/g, 'and').replace(/ & /g, ' & ');
  const nameOf = c => SHORT[c.id] || title(c.name).replace(/ Services$/, '');

  /* ------------------------------------------------------ Service menu */
  const list = $('#cats'), panel = $('#panel'), search = $('#search');
  let current = '01';
  data.forEach(c => {
    const li = document.createElement('li');
    li.innerHTML = `<button type="button" class="cat" data-id="${c.id}"><span class="cat__no">${c.id}</span><span class="cat__name">${nameOf(c)}</span><span class="cat__dots" aria-hidden="true"></span><span class="cat__n">${c.services.length}</span></button>`;
    list.append(li);
  });
  list.addEventListener('click', e => { const b = e.target.closest('.cat'); if (b) setCat(b.dataset.id); });

  function setCat(id) { current = id; search.value = ''; render(); }

  const SYN = {
    'check': ['diagnostic', 'inspection'], 'engine light': ['diagnostic'], 'ac': ['a/c'], 'air': ['a/c', 'air'],
    'conditioning': ['a/c'], 'tune': ['maintenance', 'scheduled'], 'squeal': ['brake'], 'squeak': ['brake'], 'grinding': ['brake', 'bearing'],
    'shocks': ['shock'], 'struts': ['strut'], 'tires': ['tire'], 'alignment': ['suspension', 'tie rod'], 'oil': ['oil'],
    'overheating': ['cooling', 'coolant', 'radiator', 'thermostat', 'water pump'], 'leak': ['leak'], 'noise': ['diagnostic'],
    'battery': ['battery'], 'cat': ['catalytic'], 'o2': ['oxygen'], 'lpg': ['propane'], 'turbo': ['turbocharger'], 'clutch': ['clutch'],
    'trans': ['transmission'], 'inspection': ['inspection'], 'pre-purchase': ['pre-purchase'], 'won\'t': ['starter', 'battery'],
  };
  function matches(hay, q) {
    const tokens = q.toLowerCase().split(/[\s,]+/).filter(Boolean);
    return tokens.every(t => {
      const alts = [t.replace(/s$/, ''), ...(SYN[t] || [])];
      return alts.some(a => hay.includes(a));
    });
  }
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function hl(name, q) {
    let out = esc(name);
    q.toLowerCase().split(/\s+/).filter(t => t.length > 1).forEach(t => {
      const re = new RegExp('(' + t.replace(/s$/, '').replace(/[.*+?^${}()|[\]\\/]/g, '\\$&') + ')', 'ig');
      out = out.replace(re, '<mark>$1</mark>');
    });
    return out;
  }
  const row = (s, q) => `<li><button type="button" class="svc" data-service="${esc(s.name)}"><span class="svc__id">${s.id}</span><span class="svc__name">${q ? hl(s.name, q) : esc(s.name)}</span><span class="svc__go">Request<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg></span></button></li>`;

  function render() {
    const q = search.value.trim();
    $$('.cat', list).forEach(b => b.setAttribute('aria-pressed', String(!q && b.dataset.id === current)));
    const on = $('.cat[aria-pressed="true"]', list); if (on && list.scrollWidth > list.clientWidth) list.scrollLeft = on.offsetLeft - 16;
    if (!q) {
      const c = data.find(x => x.id === current);
      panel.innerHTML = `
        <header class="panel__head">
          <span class="panel__icon">${icon(c.id)}</span>
          <div>
            <p class="panel__kicker">Category ${c.id} · ${c.services.length} services</p>
            <h3>${nameOf(c)}</h3>
            <p class="panel__blurb">${BLURB[c.id] || ''}</p>
          </div>
        </header>
        <ul class="svcs">${c.services.map(s => row(s)).join('')}</ul>
        <footer class="panel__foot"><span>Not sure what your vehicle needs?</span><button type="button" class="link" data-service="Computerized Vehicle Diagnostics">Start with a diagnostic<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg></button></footer>`;
      return;
    }
    const groups = data.map(c => ({ c, hits: c.services.filter(s => matches((s.name + ' ' + c.name).toLowerCase(), q)) })).filter(g => g.hits.length);
    const n = groups.reduce((a, g) => a + g.hits.length, 0);
    panel.innerHTML = `
      <header class="panel__head panel__head--search">
        <span class="panel__icon"><svg class="icn" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg></span>
        <div><p class="panel__kicker">Search results</p><h3>${n} ${n === 1 ? 'service' : 'services'} for “${esc(q)}”</h3></div>
      </header>
      ${n ? groups.map(g => `<p class="svcs__group">${icon(g.c.id)}${nameOf(g.c)}</p><ul class="svcs">${g.hits.map(s => row(s, q)).join('')}</ul>`).join('')
          : `<div class="empty"><p><strong>No exact match.</strong> Try “brake,” “oil,” or “diagnostics” — or just describe the problem and we'll sort it out.</p><button type="button" class="btn btn--red" data-service="">Describe the problem</button></div>`}`;
  }
  search.addEventListener('input', render);
  $$('.finder__chips button').forEach(b => b.addEventListener('click', () => { search.value = b.dataset.q; render(); search.focus(); }));
  panel.addEventListener('click', e => { const b = e.target.closest('[data-service]'); if (b) openRO(b.dataset.service); });
  $$('[data-cat]').forEach(a => a.addEventListener('click', () => { setCat(a.dataset.cat); closeMenu(); }));
  $$('.quick__item--all, .nav a[href="#services"]:not([data-cat])').forEach(a => a.addEventListener('click', () => { search.value = ''; render(); closeMenu(); }));
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !ro.open && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); search.focus(); }
  });
  render();

  /* --------------------------------------------------- Mobile menu */
  const menuBtn = $('[data-menu]');
  function closeMenu() { document.body.classList.remove('menu-open'); menuBtn?.setAttribute('aria-expanded', 'false'); }
  menuBtn?.addEventListener('click', () => {
    const open = !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', open); menuBtn.setAttribute('aria-expanded', String(open));
  });
  $$('.nav a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---------------------------------------------- Repair Order dialog */
  const ro = $('#ro'), form = $('#ro-form'), picked = $('#picked');
  const all = data.flatMap(c => c.services.map(s => s.name));
  const yearSel = form.elements.year;
  for (let y = 2027; y >= 1980; y--) yearSel.add(new Option(String(y), String(y)));
  $('#makes').innerHTML = ['Acura', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 'Dodge', 'Ford', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jeep', 'Kia', 'Lexus', 'Lincoln', 'Mazda', 'Mitsubishi', 'Nissan', 'Ram', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'].map(m => `<option value="${m}">`).join('');
  $('#all-services').innerHTML = all.map(n => `<option value="${esc(n)}">`).join('');
  let services = [];

  function chips() {
    picked.innerHTML = services.length
      ? services.map(n => `<span class="pick">${esc(n)}<button type="button" aria-label="Remove ${esc(n)}" data-remove="${esc(n)}">×</button></span>`).join('')
      : `<span class="pick pick--empty">No service selected — add one below, or check the box if you're not sure.</span>`;
    progress();
  }
  picked.addEventListener('click', e => { const b = e.target.closest('[data-remove]'); if (b) { services = services.filter(s => s !== b.dataset.remove); chips(); } });
  const add = $('#add-service');
  function tryAdd() {
    const v = all.find(n => n.toLowerCase() === add.value.trim().toLowerCase());
    if (v && !services.includes(v)) { services.push(v); add.value = ''; chips(); }
  }
  add.addEventListener('change', tryAdd);
  add.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); tryAdd(); } });

  function progress() {
    const f = form.elements;
    const done = {
      vehicle: f.year.value && f.make.value.trim() && f.model.value.trim(),
      service: services.length || f.unsure.checked,
      issue: $$('[name=sym]:checked', form).length || f.notes.value.trim(),
      time: f.date.value,
      contact: f.name.value.trim() && f.phone.value.replace(/\D/g, '').length >= 10,
    };
    $$('.ro__steps li', form).forEach(li => li.classList.toggle('done', !!done[li.dataset.step]));
    const veh = [f.year.value, f.make.value.trim(), f.model.value.trim()].filter(Boolean).join(' ');
    const svc = services.length ? `${services.length} ${services.length === 1 ? 'service' : 'services'}` : (f.unsure.checked ? 'Diagnosis needed' : 'No service selected yet');
    $('#ro-summary').innerHTML = `<strong>${esc(svc)}</strong>${veh ? ' · ' + esc(veh) : ''}`;
  }
  form.addEventListener('input', progress);
  form.addEventListener('change', progress);

  function openRO(service) {
    form.reset(); services = []; $('#ro-err').textContent = '';
    $$('[aria-invalid]', form).forEach(el => el.removeAttribute('aria-invalid'));
    if (service) services.push(service);
    $('#ro-no').textContent = 'DS-' + String(Math.floor(10000 + Math.random() * 89999));
    $('#ro-done').hidden = true; form.classList.remove('is-done');
    const d = form.elements.date; const t = new Date(); t.setDate(t.getDate() + 1); d.min = t.toISOString().slice(0, 10);
    chips();
    ro.showModal();
    document.body.classList.add('ro-open');
    $('.ro__body', form).scrollTop = 0;
  }
  window.openRequest = openRO;
  $$('[data-request]').forEach(b => b.addEventListener('click', () => openRO('')));
  const close = () => ro.close();
  $$('[data-close]', ro).forEach(b => b.addEventListener('click', close));
  ro.addEventListener('close', () => document.body.classList.remove('ro-open'));
  ro.addEventListener('click', e => { if (e.target === ro) close(); });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = form.elements, bad = [];
    const need = [[f.year, !f.year.value], [f.make, !f.make.value.trim()], [f.model, !f.model.value.trim()],
      [f.name, !f.name.value.trim()], [f.phone, f.phone.value.replace(/\D/g, '').length < 10]];
    need.forEach(([el, isBad]) => { el.toggleAttribute('aria-invalid', isBad); if (isBad) bad.push(el); });
    const noSvc = !services.length && !f.unsure.checked;
    picked.classList.toggle('is-bad', noSvc);
    if (bad.length || noSvc) {
      $('#ro-err').textContent = noSvc && !bad.length ? 'Add a service, or check “I’m not sure.”' : 'Please complete the highlighted fields.';
      (bad[0] || add).focus();
      return;
    }
    $('#ro-done-no').textContent = $('#ro-no').textContent;
    $('#ro-done').hidden = false; form.classList.add('is-done');
    $('#ro-done .btn').focus();
  });

  // Deep links used by the preview pages: #request or #request=Service%20Name
  const h = decodeURIComponent(location.hash || '');
  if (h.startsWith('#request')) openRO(h.split('=')[1] || '');
  if (h.startsWith('#cat=')) { setCat(h.slice(5)); document.getElementById('services').scrollIntoView(); }
})();
