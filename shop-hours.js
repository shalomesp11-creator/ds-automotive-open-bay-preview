/* Pure time-zone-aware schedule calculation, plus a lightweight browser binding. */
(function (root) {
  'use strict';
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const formatters = new Map();
  const time = value => {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) throw new Error('Invalid schedule time');
    const [h, m] = value.split(':').map(Number);
    return h * 60 + m;
  };
  const label = minutes => `${Math.floor(minutes / 60) % 12 || 12}:${String(minutes % 60).padStart(2, '0')} ${minutes < 720 ? 'AM' : 'PM'}`;
  function localDate(now, zone) {
    if (!formatters.has(zone)) formatters.set(zone, new Intl.DateTimeFormat('en-US', {
      timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }));
    const p = Object.fromEntries(formatters.get(zone).formatToParts(now).map(x => [x.type, x.value]));
    return { calendar: new Date(Date.UTC(+p.year, +p.month - 1, +p.day)), minute: +p.hour * 60 + +p.minute };
  }
  function intervals(calendar, config) {
    const date = calendar.toISOString().slice(0, 10);
    const value = Object.prototype.hasOwnProperty.call(config.exceptions || {}, date)
      ? config.exceptions[date] : config.weekly[days[calendar.getUTCDay()]];
    if (value == null) return null;
    if (!Array.isArray(value)) throw new Error('Invalid schedule day');
    let end = -1;
    return value.map(pair => {
      if (!Array.isArray(pair) || pair.length !== 2) throw new Error('Invalid schedule interval');
      const start = time(pair[0]), close = time(pair[1]);
      if (start >= close || start < end) throw new Error('Intervals must be ordered within one day');
      end = close;
      return [start, close];
    });
  }
  const unknown = (closed = false) => ({ state: closed ? 'closed' : 'unknown',
    text: closed ? 'Closed Today — Next opening unconfirmed' : 'Hours unconfirmed — Check Google Maps' });
  function calculate(now, config) {
    try {
      const { calendar, minute } = localDate(now, config.timeZone);
      const today = intervals(calendar, config);
      if (today === null) return unknown();
      const active = today.find(([start, end]) => minute >= start && minute < end);
      if (active) return { state: 'open', text: `Open Today — ${label(active[0])} – ${label(active[1])}` };
      const later = today.find(([start]) => start > minute);
      if (later) return { state: 'closed', text: `Closed Now — Opens Today at ${label(later[0])}` };
      const prefix = today.length ? 'Closed Now' : 'Closed Today';
      // Calendar arithmetic avoids 23/25-hour-day errors around DST.
      // Stop at unknown days: a later confirmed opening may not be the NEXT one.
      for (let offset = 1; offset <= 370; offset++) {
        const next = new Date(calendar);
        next.setUTCDate(next.getUTCDate() + offset);
        const slots = intervals(next, config);
        if (slots === null) return { state: 'closed', text: `${prefix} — Next opening unconfirmed` };
        if (slots.length) return { state: 'closed', text: `${prefix} — Opens ${days[next.getUTCDay()]} at ${label(slots[0][0])}` };
      }
      return { state: 'closed', text: `${prefix} — No upcoming hours confirmed` };
    } catch (_) {
      return unknown(); // Invalid/missing configuration must never imply OPEN.
    }
  }
  function mount(element, config) {
    let timer;
    const text = element.querySelector('[data-hours-text]');
    function refresh() {
      const status = calculate(new Date(), config);
      element.dataset.state = status.state;
      if (text.textContent !== status.text) text.textContent = status.text;
    }
    function tick() {
      clearTimeout(timer);
      refresh();
      // One calculation at each minute boundary; opening/closing times use minutes.
      if (!document.hidden) timer = setTimeout(tick, 60000 - Date.now() % 60000);
    }
    document.addEventListener('visibilitychange', tick);
    root.addEventListener('focus', tick);
    root.addEventListener('pageshow', tick);
    tick();
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', tick);
      root.removeEventListener('focus', tick);
      root.removeEventListener('pageshow', tick);
    };
  }
  const api = { calculate, mount };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.ShopHours = api;
    const element = document.querySelector('[data-shop-hours]');
    if (element) mount(element, root.SHOP_HOURS_CONFIG);
  }
})(globalThis);
