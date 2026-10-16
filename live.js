/* D&S — "Open Bay" live environment
   One shared wind + daylight model drives every moving part of the storefront:
   the WebGL flag on its pole, the light shafts and dust inside the service bay,
   the cloud shadows crossing the facade, and the neon OPEN sign.
   Nothing is tied to scrolling or the pointer. Motion stops for
   prefers-reduced-motion and for the on-page "Pause motion" control. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const env = { t: 0, wind: 0.7, running: !reduceQuery.matches, visible: true };
  window.DSLive = env;

  // Slow, layered gusts. 0.35 = calm, 1.0 = strong breeze.
  const windAt = t => 0.66 + 0.2 * Math.sin(t * 0.17) + 0.1 * Math.sin(t * 0.47 + 1.3) + 0.05 * Math.sin(t * 1.31 + 0.4);

  /* ---------------------------------------------------------------- Flag */
  function Flag(canvas) {
    const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true });
    if (!gl) { canvas.classList.add('no-webgl'); return null; }
    const NU = 84, NV = 44;
    const vs = `
      attribute vec2 a_uv;
      uniform float u_t, u_wind;
      uniform vec2 u_canvas;   // canvas size in px
      uniform vec3 u_frame;    // flag height px, left pad px, top pad px
      varying vec2 v_p; varying vec3 v_n; varying float v_z;
      const float ASPECT = 1.9;
      vec3 P(vec2 uv){
        float u = uv.x, v = uv.y;
        float amp = pow(u, 0.8) * (0.075 + 0.12 * u_wind);
        float speed = 2.4 + 2.4 * u_wind;
        float ph = u * 7.2 - u_t * speed;
        float z = amp * (sin(ph + v * 2.6) * 0.74
                       + sin(u * 14.0 - u_t * speed * 1.6 - v * 3.4) * 0.16
                       + sin(u * 3.1 - u_t * 1.1 + v * 3.4) * 0.3);
        float droop = u * u * 0.14 * (1.0 - u_wind);
        float y = v + droop + amp * 0.18 * sin(ph * 0.5 + v * 2.1);
        // fabric can't stretch: folds pull the fly end back toward the pole
        float x = u * ASPECT * (1.0 - 0.06 * (0.6 + u_wind * 0.4));
        return vec3(x, y, z);
      }
      void main(){
        vec3 p = P(a_uv);
        float e = 0.003;
        vec3 du = P(a_uv + vec2(e, 0.0)) - p;
        vec3 dv = P(a_uv + vec2(0.0, e)) - p;
        v_n = normalize(cross(du, dv));
        v_z = p.z;
        v_p = vec2(a_uv.x * ASPECT, a_uv.y);
        // view the cloth slightly from the side and below, so folds read in the silhouette
        vec2 q = vec2(p.x * 0.96 + p.z * 0.5, p.y - p.z * 0.2);
        vec2 px = vec2(u_frame.y + q.x * u_frame.x, u_frame.z + q.y * u_frame.x);
        vec2 clip = vec2(px.x / u_canvas.x * 2.0 - 1.0, 1.0 - px.y / u_canvas.y * 2.0);
        // gentle perspective: cloth closer to the viewer reads larger
        float w = 1.0 - p.z * 0.12;
        gl_Position = vec4(clip * w, 0.0, w);
      }`;
    const fs = `
      precision highp float;
      varying vec2 v_p; varying vec3 v_n; varying float v_z;
      uniform float u_px;      // one CSS pixel in flag-height units
      uniform float u_t;
      const vec3 RED = vec3(0.698, 0.133, 0.204);   // Old Glory Red  #B22234
      const vec3 BLUE = vec3(0.075, 0.153, 0.369);  // deep Old Glory blue #13275E
      const vec3 WHITE = vec3(0.985, 0.982, 0.972);
      float star(vec2 p, float r, float rf){
        const vec2 k1 = vec2(0.809016994375, -0.587785252292);
        const vec2 k2 = vec2(-0.809016994375, -0.587785252292);
        p.x = abs(p.x);
        p -= 2.0 * max(dot(k1, p), 0.0) * k1;
        p -= 2.0 * max(dot(k2, p), 0.0) * k2;
        p.x = abs(p.x);
        p.y -= r;
        vec2 ba = rf * vec2(-k1.y, k1.x) - vec2(0.0, 1.0);
        float h = clamp(dot(p, ba) / dot(ba, ba), 0.0, r);
        return length(p - ba * h) * sign(p.y * ba.x - p.x * ba.y);
      }
      void main(){
        vec2 p = v_p;
        float aa = u_px * 1.2;
        // 13 stripes, red on top
        float s = fract(p.y * 6.5);
        float edge = smoothstep(0.5 - aa * 6.5, 0.5 + aa * 6.5, s);
        vec3 col = mix(RED, WHITE, edge);
        // canton: 0.76 wide x 7/13 tall (U.S. Code, Title 4)
        const float CW = 0.76; const float CH = 0.5384615;
        float inCanton = (1.0 - smoothstep(CW - aa, CW + aa, p.x)) * (1.0 - smoothstep(CH - aa, CH + aa, p.y));
        // 50 stars: 9 rows alternating 6 and 5
        float gx = CW / 12.0, gy = CH / 10.0;
        float fk = p.x / gx - 1.0, fj = p.y / gy - 1.0;
        float d = 1.0;
        for (int dj = -1; dj <= 1; dj++) {
          for (int dk = -1; dk <= 1; dk++) {
            float k = floor(fk + 0.5) + float(dk);
            float j = floor(fj + 0.5) + float(dj);
            if (k < 0.0 || k > 10.0 || j < 0.0 || j > 8.0) continue;
            if (mod(k + j, 2.0) > 0.5) continue;
            vec2 c = vec2((k + 1.0) * gx, (j + 1.0) * gy);
            vec2 q = p - c; q.y = -q.y;
            d = min(d, star(q, 0.0308, 0.38));
          }
        }
        float starMask = 1.0 - smoothstep(-aa, aa, d);
        vec3 canton = mix(BLUE, WHITE, starMask);
        col = mix(col, canton, inCanton);
        // satin cloth lighting
        vec3 n = normalize(v_n); if (n.z < 0.0) n = -n;
        vec3 L = normalize(vec3(-0.62, -0.42, 0.62));
        float diff = clamp(dot(n, L), 0.0, 1.0);
        vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
        float spec = pow(max(dot(n, H), 0.0), 36.0);
        float shade = 0.3 + 0.82 * diff;
        col = col * shade + vec3(spec * 0.08);
        // woven texture + soft shadow in the folds
        float weave = 0.985 + 0.015 * sin(p.x / u_px * 1.9) * sin(p.y / u_px * 1.9);
        col *= weave * (1.0 - clamp(-v_z * 1.4, 0.0, 0.12));
        gl_FragColor = vec4(col, 1.0);
      }`;
    function sh(type, src) {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);

    const uv = [];
    for (let j = 0; j <= NV; j++) for (let i = 0; i <= NU; i++) uv.push(i / NU, j / NV);
    const idx = [];
    for (let j = 0; j < NV; j++) for (let i = 0; i < NU; i++) {
      const a = j * (NU + 1) + i, b = a + 1, c = a + NU + 1, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
    const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
    const ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a_uv');
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = n => gl.getUniformLocation(prog, n);
    const uT = U('u_t'), uWind = U('u_wind'), uCanvas = U('u_canvas'), uFrame = U('u_frame'), uPx = U('u_px');

    let dpr = 1, W = 0, H = 0, fh = 0, padL = 0, padT = 0;
    function resize() {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(r.width * dpr)); H = Math.max(1, Math.round(r.height * dpr));
      canvas.width = W; canvas.height = H;
      // the flag fills the canvas, leaving room for the wave to travel
      padL = 2 * dpr; padT = H * 0.13;
      fh = Math.min((W - padL - W * 0.06) / 1.9, H * 0.72);
      gl.viewport(0, 0, W, H);
    }
    function draw(t, wind) {
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uT, t); gl.uniform1f(uWind, wind);
      gl.uniform2f(uCanvas, W, H); gl.uniform3f(uFrame, fh, padL, padT);
      gl.uniform1f(uPx, dpr / fh);
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
    }
    resize();
    return { resize, draw };
  }

  /* ------------------------------------------------- Bay light + dust */
  function BayLight(canvas) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = 1, cones = null;
    // Light fixtures, in normalized bay coordinates (match the ceiling lights in the photo)
    const sources = [
      { x: 0.36, w0: 0.06, w1: 0.66, a: 0.62, ph: 0.0 },
      { x: 0.74, w0: 0.05, w1: 0.52, a: 0.46, ph: 1.7 },
    ];
    const N = 170, motes = [];
    for (let i = 0; i < N; i++) motes.push({
      x: Math.random(), y: Math.random(), z: Math.random(),
      ph: Math.random() * Math.PI * 2, sp: 0.4 + Math.random() * 0.8,
    });
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 32;
    {
      const s = sprite.getContext('2d');
      const g = s.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0, 'rgba(255,248,236,1)');
      g.addColorStop(0.35, 'rgba(255,244,228,.45)');
      g.addColorStop(1, 'rgba(255,240,220,0)');
      s.fillStyle = g; s.fillRect(0, 0, 32, 32);
    }
    function renderCones() {
      cones = sources.map(src => {
        const c = document.createElement('canvas'); c.width = W; c.height = H;
        const x = c.getContext('2d');
        if ('filter' in x) x.filter = `blur(${Math.round(12 * dpr)}px)`;
        const g = x.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, 'rgba(255,250,240,0.95)');
        g.addColorStop(0.5, 'rgba(255,246,232,0.5)');
        g.addColorStop(1, 'rgba(255,244,230,0.04)');
        x.fillStyle = g;
        x.beginPath();
        x.moveTo((src.x - src.w0 / 2) * W, -10);
        x.lineTo((src.x + src.w0 / 2) * W, -10);
        x.lineTo((src.x + src.w1 / 2) * W, H);
        x.lineTo((src.x - src.w1 / 2) * W, H);
        x.closePath(); x.fill();
        return c;
      });
    }
    function coneAt(x, y) {
      let v = 0;
      for (const s of sources) {
        const half = (s.w0 + (s.w1 - s.w0) * y) / 2;
        const dx = Math.abs(x - s.x) / half;
        if (dx < 1) v += (1 - dx * dx) * (1 - y * 0.7) * s.a * 3;
      }
      return Math.min(1, v);
    }
    function resize() {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(r.width * dpr)); H = Math.max(1, Math.round(r.height * dpr));
      canvas.width = W; canvas.height = H;
      renderCones();
    }
    let last = 0;
    function draw(t, wind) {
      const dt = Math.min(0.05, last ? t - last : 0.016); last = t;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      sources.forEach((s, i) => {
        // fluorescent "breathing" plus a rare tiny flutter
        const hum = 0.86 + 0.1 * Math.sin(t * 0.6 + s.ph) + 0.04 * Math.sin(t * 2.3 + s.ph * 3);
        ctx.globalAlpha = s.a * hum;
        ctx.drawImage(cones[i], 0, 0);
      });
      for (const m of motes) {
        const drift = 0.006 + 0.01 * wind;
        m.x += (Math.sin(t * 0.21 * m.sp + m.ph) * 0.004 + drift * (0.4 + m.z)) * dt;
        m.y += (Math.cos(t * 0.17 * m.sp + m.ph) * 0.006 - 0.0025 * m.sp) * dt;
        if (m.x > 1.02) m.x = -0.02; if (m.x < -0.02) m.x = 1.02;
        if (m.y < -0.02) m.y = 1.02; if (m.y > 1.02) m.y = -0.02;
        const lit = coneAt(m.x, m.y);
        const tw = 0.6 + 0.4 * Math.sin(t * 1.3 * m.sp + m.ph);
        const a = (0.08 + lit * 1.1) * tw * (0.4 + m.z * 0.6);
        if (a < 0.02) continue;
        const size = (1.2 + m.z * m.z * 4.2) * dpr;
        ctx.globalAlpha = Math.min(1, a);
        ctx.drawImage(sprite, m.x * W - size, m.y * H - size, size * 2, size * 2);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
    resize();
    return { resize, draw };
  }

  /* --------------------------------------------------------- Wiring */
  const parts = [];
  function mount() {
    document.querySelectorAll('canvas[data-live="flag"]').forEach(c => {
      try { const f = Flag(c); if (f) parts.push(f); } catch (e) { console.warn('[DS live] flag', e); c.classList.add('no-webgl'); }
    });
    document.querySelectorAll('canvas[data-live="bay"]').forEach(c => parts.push(BayLight(c)));
  }

  let raf = 0, t0 = performance.now(), paused_at = 0;
  function frame(now) {
    env.t = (now - t0) / 1000;
    env.wind = windAt(env.t);
    root.style.setProperty('--wind', env.wind.toFixed(3));
    for (const p of parts) p.draw(env.t, env.wind);
    raf = env.running && env.visible ? requestAnimationFrame(frame) : 0;
  }
  function start() {
    if (raf || !env.running || !env.visible) return;
    t0 += performance.now() - paused_at;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0; paused_at = performance.now();
  }
  function renderStill() {
    // a composed still frame for reduced motion / paused state
    env.wind = 0.82;
    for (const p of parts) p.draw(env.t || 2.4, env.wind);
  }
  function setRunning(on) {
    env.running = on;
    root.classList.toggle('motion-off', !on);
    document.querySelectorAll('[data-motion-toggle]').forEach(b => {
      b.setAttribute('aria-pressed', String(!on));
      const l = b.querySelector('[data-motion-label]'); if (l) l.textContent = on ? 'Pause motion' : 'Play motion';
    });
    if (on) start(); else { stop(); renderStill(); }
  }

  function openBay() {
    document.querySelectorAll('.bay').forEach(b => b.classList.add('is-open'));
    root.classList.add('is-lit');
  }

  window.addEventListener('DOMContentLoaded', () => {
    mount();
    paused_at = performance.now();
    if (!env.running) { root.classList.add('motion-off'); renderStill(); }
    setRunning(env.running);
    document.querySelectorAll('[data-motion-toggle]').forEach(b => b.addEventListener('click', () => setRunning(!env.running)));
    reduceQuery.addEventListener?.('change', e => setRunning(!e.matches));
    const img = document.querySelector('.bay img');
    const go = () => setTimeout(openBay, env.running ? 450 : 0);
    if (!img || img.complete) go(); else { img.addEventListener('load', go, { once: true }); img.addEventListener('error', go, { once: true }); }
    let rt = 0;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { parts.forEach(p => p.resize()); if (!env.running) renderStill(); }, 120); });
    document.addEventListener('visibilitychange', () => { env.visible = !document.hidden; env.visible ? start() : stop(); });
    // Neon sign: occasional short flicker, like a real tube
    const neon = document.querySelector('.neon');
    if (neon) (function flick() {
      setTimeout(() => {
        if (env.running) { neon.classList.add('flicker'); setTimeout(() => neon.classList.remove('flicker'), 700); }
        flick();
      }, 7000 + Math.random() * 9000);
    })();
  });
})();
