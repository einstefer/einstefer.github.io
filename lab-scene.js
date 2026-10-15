/* Original illustrative geometry. No network requests, dependencies, or tracking. */
(() => {
  "use strict";

  const canvas = document.getElementById("lab-canvas");
  const scene = document.getElementById("lab-scene");
  if (!canvas || !scene) return;

  const modeButtons = [...document.querySelectorAll("[data-lab-mode]")];
  const motionButton = document.getElementById("lab-motion");
  const modeLabel = document.getElementById("lab-mode-label");
  const labels = {
    systems: "Systems",
    signals: "Signals",
    reasoning: "Reasoning",
  };
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let context;
  try {
    context = canvas.getContext("2d", { alpha: false });
  } catch {
    /* Use the fallback below. */
  }
  if (!context) {
    canvas.hidden = true;
    const fallback = document.createElement("p");
    fallback.className = "lab-scene-fallback";
    fallback.setAttribute("role", "status");
    fallback.textContent =
      "The interactive sculpture is unavailable in this browser.";
    canvas.after(fallback);
    [...modeButtons, motionButton].filter(Boolean).forEach((button) => {
      button.disabled = true;
    });
    return;
  }

  canvas.style.touchAction = "pan-y";
  if (!canvas.hasAttribute("tabindex")) canvas.tabIndex = 0;
  if (!canvas.hasAttribute("aria-label")) {
    canvas.setAttribute(
      "aria-label",
      "Interactive mathematical sculpture. Drag with a mouse or use the arrow keys to rotate. Home resets the view.",
    );
  }

  const COUNT = 480;
  const TAU = Math.PI * 2;
  const FRAME_TIME = 1000 / 30;
  const CAMERA_DISTANCE = 8.5;
  const colors = {
    background: "#111314",
    lilac: [187, 183, 248],
    lime: [214, 245, 117],
  };
  const geometries = {};

  // A twisted, triangulated architectural shell; adjacency is known up front.
  function buildSystems() {
    const points = [],
      edges = [];
    const rows = 20,
      columns = 24;
    for (let row = 0; row < rows; row++) {
      const t = row / (rows - 1);
      const radius = 0.64 + 1.52 * Math.pow(Math.sin(Math.PI * t), 0.72);
      for (let column = 0; column < columns; column++) {
        const a = (column / columns) * TAU + t * 1.1;
        const facet = 0.87 + 0.13 * Math.cos(a * 3 - t * 1.5);
        points.push([
          Math.cos(a) * radius * facet + 0.32 * Math.sin(t * TAU),
          (t - 0.5) * 4.9,
          Math.sin(a) * radius * 0.84 * facet,
        ]);
        const index = row * columns + column;
        edges.push([index, row * columns + ((column + 1) % columns)]);
        if (row < rows - 1) {
          edges.push([index, index + columns]);
          if ((column + row) % 3 === 0)
            edges.push([index, (row + 1) * columns + ((column + 1) % columns)]);
        }
      }
    }
    return { points, edges };
  }

  // Twelve phase-shifted ribbons weave into a spatial waveform.
  function buildSignals() {
    const points = [],
      edges = [];
    const ribbons = 12,
      samples = 40;
    for (let ribbon = 0; ribbon < ribbons; ribbon++) {
      const spread = ribbon / (ribbons - 1) - 0.5;
      for (let sample = 0; sample < samples; sample++) {
        const u = sample / (samples - 1);
        const x = (u - 0.5) * 5.7;
        const phase = x * 1.45 + spread * 1.5;
        points.push([
          x,
          Math.sin(phase) * (1.18 + 0.22 * Math.cos(u * TAU)) + spread * 0.8,
          spread * 2.4 + 0.65 * Math.cos(phase * 0.83),
        ]);
        const index = ribbon * samples + sample;
        if (sample < samples - 1) edges.push([index, index + 1]);
        if (ribbon < ribbons - 1 && sample % 4 === 0)
          edges.push([index, index + samples]);
      }
    }
    return { points, edges };
  }

  // A finite reasoning lattice surrounded by four intersecting orbit planes.
  function buildReasoning() {
    const points = [],
      edges = [];
    const side = 6;
    for (let x = 0; x < side; x++) {
      for (let y = 0; y < side; y++) {
        for (let z = 0; z < side; z++) {
          const index = x * side * side + y * side + z;
          points.push([(x - 2.5) * 0.43, (y - 2.5) * 0.43, (z - 2.5) * 0.43]);
          if (x < side - 1) edges.push([index, index + side * side]);
          if (y < side - 1) edges.push([index, index + side]);
          if (z < side - 1) edges.push([index, index + 1]);
        }
      }
    }
    for (let orbit = 0; orbit < 4; orbit++) {
      const start = points.length;
      const tilt = 0.45 + orbit * 0.75;
      const turn = (orbit * Math.PI) / 4;
      for (let step = 0; step < 66; step++) {
        const a = (step / 66) * TAU;
        const x = Math.cos(a) * (2.25 + orbit * 0.12);
        const y = Math.sin(a) * 2.0;
        const ry = y * Math.cos(tilt),
          rz = y * Math.sin(tilt);
        points.push([
          x * Math.cos(turn) - ry * Math.sin(turn),
          x * Math.sin(turn) + ry * Math.cos(turn),
          rz,
        ]);
        edges.push([start + step, start + ((step + 1) % 66)]);
      }
    }
    return { points, edges };
  }

  geometries.systems = buildSystems();
  geometries.signals = buildSignals();
  geometries.reasoning = buildReasoning();

  let mode = "systems";
  let points = geometries[mode].points.map((point) => [...point]);
  let transitionFrom = null,
    transitionStart = 0;
  let previousEdges = null;
  let width = 0,
    height = 0,
    needsResize = true;
  let visible = true,
    paused = preference.matches,
    dragging = false;
  let yaw = -0.45,
    pitch = -0.16,
    spin = 0;
  let pointerX = 0,
    pointerY = 0,
    tiltX = 0,
    tiltY = 0;
  let lastPointerX = 0,
    lastPointerY = 0,
    activePointer = null;
  let frame = 0,
    lastDraw = 0,
    lastStep = 0,
    drawRequested = true;
  let glow = null;
  const projected = Array.from({ length: COUNT }, (_, index) => ({
    index,
    x: 0,
    y: 0,
    z: 0,
    scale: 1,
  }));
  const depthOrder = [...projected];

  function updateControls() {
    modeButtons.forEach((button) => {
      const selected = button.dataset.labMode === mode;
      button.setAttribute("aria-pressed", String(selected));
      button.classList.toggle("is-active", selected);
    });
    if (modeLabel) modeLabel.textContent = labels[mode];
    if (motionButton) {
      motionButton.textContent = paused ? "Play motion" : "Pause motion";
      motionButton.setAttribute(
        "aria-label",
        paused ? "Play sculpture animation" : "Pause sculpture animation",
      );
      motionButton.setAttribute("aria-pressed", String(!paused));
    }
    scene.dataset.mode = mode;
  }

  function measure() {
    needsResize = false;
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    if (!width || !height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    glow = context.createRadialGradient(
      width * 0.5,
      height * 0.49,
      0,
      width * 0.5,
      height * 0.49,
      Math.min(width, height) * 0.5,
    );
    glow.addColorStop(0, "#bbb7f80b");
    glow.addColorStop(0.62, "#bbb7f804");
    glow.addColorStop(1, "#bbb7f800");
  }

  function strokeEdges(edges, opacity) {
    if (!edges || opacity <= 0.001) return;
    // Four depth bands keep draw calls bounded without pairwise distance searches.
    for (let band = 0; band < 4; band++) {
      context.beginPath();
      edges.forEach(([a, b]) => {
        const first = projected[a],
          second = projected[b];
        const depth = Math.max(
          0,
          Math.min(3, Math.floor(((first.z + second.z) * 0.5 + 3.8) / 1.9)),
        );
        if (depth !== band) return;
        context.moveTo(first.x, first.y);
        context.lineTo(second.x, second.y);
      });
      context.strokeStyle = `rgba(187,183,248,${(0.055 + band * 0.043) * opacity})`;
      context.lineWidth = 0.62 + band * 0.1;
      context.stroke();
    }
    context.beginPath();
    for (let index = 0; index < edges.length; index += 29) {
      const [a, b] = edges[index];
      context.moveTo(projected[a].x, projected[a].y);
      context.lineTo(projected[b].x, projected[b].y);
    }
    context.strokeStyle = `rgba(214,245,117,${0.2 * opacity})`;
    context.lineWidth = 0.8;
    context.stroke();
  }

  function render(transitionProgress = 1) {
    if (!width || !height) return;
    context.fillStyle = colors.background;
    context.fillRect(0, 0, width, height);
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    const rotation = yaw + spin + tiltX;
    const elevation = pitch + tiltY;
    const cy = Math.cos(rotation),
      sy = Math.sin(rotation);
    const cp = Math.cos(elevation),
      sp = Math.sin(elevation);
    const scale = Math.min(width, height) * 0.142;
    points.forEach(([x, y, z], index) => {
      const rx = x * cy + z * sy;
      const rz = z * cy - x * sy;
      const ry = y * cp - rz * sp;
      const depth = y * sp + rz * cp;
      const perspective = CAMERA_DISTANCE / (CAMERA_DISTANCE - depth);
      const target = projected[index];
      target.x = width * 0.5 + rx * scale * perspective;
      target.y = height * 0.5 + ry * scale * perspective;
      target.z = depth;
      target.scale = perspective;
    });

    strokeEdges(previousEdges, 1 - transitionProgress);
    strokeEdges(geometries[mode].edges, transitionProgress);
    depthOrder.sort((a, b) => a.z - b.z);
    depthOrder.forEach((point) => {
      const front = Math.max(0, Math.min(1, (point.z + 3.2) / 6.4));
      const highlighted =
        point.index % 17 === 0 ||
        (mode === "reasoning" && point.index >= 216 && point.index % 11 === 0);
      const rgb = highlighted ? colors.lime : colors.lilac;
      const radius = (highlighted ? 1.7 : 0.85) * point.scale;
      if (highlighted && front > 0.35) {
        context.fillStyle = `rgba(${rgb},${0.055 + front * 0.045})`;
        context.beginPath();
        context.arc(point.x, point.y, radius * 3.8, 0, TAU);
        context.fill();
      }
      context.fillStyle = `rgba(${rgb},${0.28 + front * 0.67})`;
      context.beginPath();
      context.arc(point.x, point.y, radius, 0, TAU);
      context.fill();
    });
  }

  function shouldAnimate() {
    return !paused || Boolean(transitionFrom);
  }

  function tick(time) {
    frame = 0;
    if (!visible || document.hidden) return;
    if (time - lastDraw < FRAME_TIME && !needsResize) {
      frame = requestAnimationFrame(tick);
      return;
    }
    if (needsResize) measure();
    const elapsed = lastStep ? Math.min(time - lastStep, 75) : FRAME_TIME;
    lastDraw = time;
    lastStep = time;
    if (!paused && !dragging) spin += elapsed * 0.000075;
    if (!paused) {
      const smoothing = 1 - Math.exp(-elapsed / 180);
      tiltX += (pointerX - tiltX) * smoothing;
      tiltY += (pointerY - tiltY) * smoothing;
    }

    let progress = 1;
    if (transitionFrom) {
      progress = Math.min(1, (time - transitionStart) / 1050);
      const eased = progress * progress * (3 - 2 * progress);
      const destination = geometries[mode].points;
      points.forEach((point, index) => {
        for (let axis = 0; axis < 3; axis++)
          point[axis] =
            transitionFrom[index][axis] +
            (destination[index][axis] - transitionFrom[index][axis]) * eased;
      });
      if (progress === 1) {
        transitionFrom = null;
        previousEdges = null;
      }
    }
    render(progress);
    drawRequested = false;
    if (shouldAnimate()) frame = requestAnimationFrame(tick);
  }

  function requestDraw() {
    drawRequested = true;
    if (!frame && visible && !document.hidden)
      frame = requestAnimationFrame(tick);
  }

  function stopLoop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastStep = 0;
  }

  function finishTransition() {
    points = geometries[mode].points.map((point) => [...point]);
    transitionFrom = null;
    previousEdges = null;
  }

  function selectMode(next) {
    if (!geometries[next] || next === mode) return;
    const oldMode = mode;
    mode = next;
    if (!paused && !preference.matches && visible && !document.hidden) {
      transitionFrom = points.map((point) => [...point]);
      previousEdges = geometries[oldMode].edges;
      transitionStart = performance.now();
    } else finishTransition();
    updateControls();
    requestDraw();
  }

  modeButtons.forEach((button) =>
    button.addEventListener("click", () => selectMode(button.dataset.labMode)),
  );
  motionButton?.addEventListener("click", () => {
    paused = !paused;
    if (paused) finishTransition();
    updateControls();
    requestDraw();
  });

  // Touch remains ordinary page scrolling; mouse and pen can rotate the object.
  canvas.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch" || event.button !== 0) return;
    dragging = true;
    activePointer = event.pointerId;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    canvas.setPointerCapture?.(event.pointerId);
    scene.classList.add("is-dragging");
  });
  canvas.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    if (dragging && activePointer === event.pointerId) {
      yaw += (event.clientX - lastPointerX) * 0.007;
      pitch = Math.max(
        -1.35,
        Math.min(1.35, pitch + (event.clientY - lastPointerY) * 0.007),
      );
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      requestDraw();
    } else if (!paused && !preference.matches) {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.22;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.16;
    }
  });
  function endDrag(event) {
    if (activePointer !== event.pointerId) return;
    dragging = false;
    activePointer = null;
    if (canvas.hasPointerCapture?.(event.pointerId))
      canvas.releasePointerCapture(event.pointerId);
    scene.classList.remove("is-dragging");
    requestDraw();
  }
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener("lostpointercapture", endDrag);
  canvas.addEventListener("pointerleave", () => {
    pointerX = 0;
    pointerY = 0;
  });
  canvas.addEventListener("keydown", (event) => {
    const amount = event.shiftKey ? 0.3 : 0.12;
    if (event.key === "ArrowLeft") yaw -= amount;
    else if (event.key === "ArrowRight") yaw += amount;
    else if (event.key === "ArrowUp") pitch = Math.max(-1.35, pitch - amount);
    else if (event.key === "ArrowDown") pitch = Math.min(1.35, pitch + amount);
    else if (event.key === "Home") {
      yaw = -0.45;
      pitch = -0.16;
      spin = 0;
      tiltX = 0;
      tiltY = 0;
      pointerX = 0;
      pointerY = 0;
    } else return;
    event.preventDefault();
    requestDraw();
  });

  function preferenceChanged(event) {
    paused = event.matches;
    if (paused) {
      finishTransition();
      tiltX = 0;
      tiltY = 0;
      pointerX = 0;
      pointerY = 0;
    }
    updateControls();
    requestDraw();
  }
  if (preference.addEventListener)
    preference.addEventListener("change", preferenceChanged);
  else preference.addListener(preferenceChanged);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopLoop();
      finishTransition();
    } else if (shouldAnimate() || drawRequested) requestDraw();
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (visible) requestDraw();
        else {
          stopLoop();
          finishTransition();
        }
      },
      { threshold: 0 },
    ).observe(canvas);
  }
  function resize() {
    needsResize = true;
    requestDraw();
  }
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas);
  window.addEventListener("resize", resize, { passive: true });

  updateControls();
  requestDraw();
})();
