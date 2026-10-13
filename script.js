/* No framework, no tracking, and no build step. */
'use strict';

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

$('#year').textContent = new Date().getFullYear();

// Small-screen navigation.
const menuButton = $('.menu-button');
const navigation = $('#main-nav');
function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
$$('a', navigation).forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});

// The project text stays factual; the illustrations are original visual metaphors.
const projects = {
  vexta: {
    eyebrow: 'VEXTA / DEVELOPER TOOLS / PRIVATE BETA',
    title: 'API changes, repaired.',
    paragraphs: [
      'Vexta monitors external API changes and traces their impact into TypeScript and JavaScript integrations. It prepares focused repairs, validates them in isolated sandboxes, and opens GitHub pull requests for human review.',
      'The repair loop covers OpenAPI specifications, npm packages, and changelogs, then connects breaking changes to affected code. Candidate fixes include regression tests and are validated before a pull request is opened.',
      'Vexta is in private beta. Repairs stay reviewable: it does not automatically merge changes.'
    ],
    tags: ['TypeScript', 'API monitoring', 'OpenAPI', 'GitHub integration', 'Isolated validation'],
    links: [['Explore Vexta', 'https://vextaapi.com']]
  },
  eeg: {
    eyebrow: 'IEEE ICIIBMS 2026 / SOLE-AUTHOR PAPER ACCEPTED',
    title: 'P300 EEG classification.',
    image: 'assets/project-eeg.svg',
    paragraphs: [
      'As a research assistant to Dr. Xiucai Ding in the UC Davis Department of Statistics, I analyzed high-dimensional biomedical and EEG datasets for a brain-computer interface project backed by a UC Davis medical team and supported by an NSF grant.',
      'I evaluated 11 machine learning methods for P300 EEG classification across 110 subjects, applying statistical learning, dimensionality reduction, and deep learning techniques.',
      'My sole-author research paper was accepted to IEEE ICIIBMS 2026.'
    ],
    tags: ['P300 EEG', 'Brain-computer interfaces', 'Statistical learning', 'Deep learning'],
    links: [['IEEE ICIIBMS 2026 conference', 'https://www.iciibms.org/']]
  },
  tracetree: {
    eyebrow: 'TRACETREE / CHROME EXTENSION',
    title: 'Keep the trail behind your research.',
    image: 'assets/project-tracetree.svg',
    paragraphs: [
      'TraceTree organizes online research into persistent browsing trees. Instead of losing the path from one source to the next, you can keep related pages connected in a Chrome side panel.',
      'The extension supports project switching, contextual search of saved page metadata, moving branches, and reopening saved pages. Data stays local to the browser.',
      'It is a working MVP you can load unpacked from the repository; it is not currently published on the Chrome Web Store.'
    ],
    tags: ['React', 'TypeScript', 'Chrome Manifest V3', 'Vite', 'Vitest'],
    links: [['Explore the code', 'https://github.com/einstefer/tracetree']]
  },
  aime: {
    eyebrow: 'PUBLISHED RESEARCH / JOURNAL OF EMERGING INVESTIGATORS',
    title: 'Does a different prompt change the answer?',
    image: 'assets/project-aime.svg',
    paragraphs: [
      'With Lars Holdijk, an Oxford PhD student, I investigated how five prompting strategies affected three large language models on 60 American Invitational Mathematics Examination problems.',
      'I built Python evaluation pipelines and analyzed differences with Cochran’s Q and McNemar’s statistical tests, including multiple-comparison correction. Detailed-solution prompting did not significantly improve accuracy over the baseline or the other prompting styles.',
      '“Evaluating the impact of prompting styles on LLM accuracy for AIME math questions” was published in the Journal of Emerging Investigators on July 26, 2026. Authors: Vasu Ganesa and Lars Holdijk. DOI: 10.59720/25-137.'
    ],
    tags: ['Python', 'NumPy', 'statsmodels', 'LLM evaluation', 'Statistical testing'],
    links: [['Read the paper', 'https://emerginginvestigators.org/articles/25-137'], ['Explore the code', 'https://github.com/einstefer/aime-llm-prompting']]
  },
  games: {
    eyebrow: 'LIFT & SHIFT / FULL STACK DEVELOPMENT',
    title: 'From browser to mobile.',
    image: 'assets/project-games.svg',
    paragraphs: [
      'Through my Full Stack Web Development internship at Lift & Shift, I developed the foundation’s games website and implemented five interactive web games using Python, JavaScript, HTML, and CSS.',
      'The public game collection now runs on Cloudflare Workers and includes responsive themes and server-side Sudoku generation.',
      'My work at Lift & Shift also includes developing and launching a cross-platform equine veterinary management application on Google Play.'
    ],
    tags: ['JavaScript', 'Python', 'HTML / CSS', 'Cloudflare Workers', 'Wrangler'],
    links: [['Play the games', 'https://games.weliftandshift.org/'], ['Explore the code', 'https://github.com/einstefer/games-main']]
  }
};

// Native dialog supplies focus containment, Escape, and accessible modality.
const dialog = $('#project-dialog');
const dialogContent = $('#dialog-content');
let projectTrigger = null;
function openProject(key, trigger) {
  const project = projects[key];
  if (!project) return;
  projectTrigger = trigger;
  dialogContent.replaceChildren();
  if (project.image) {
    const image = document.createElement('img');
    image.className = 'dialog-image';
    image.src = project.image;
    image.alt = '';
    dialogContent.append(image);
  }
  const text = document.createElement('div');
  text.className = 'dialog-text';
  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = project.eyebrow;
  const title = document.createElement('h2');
  title.id = 'dialog-title';
  title.textContent = project.title;
  text.append(eyebrow, title);
  project.paragraphs.forEach(paragraph => {
    const p = document.createElement('p');
    p.textContent = paragraph;
    text.append(p);
  });
  const tags = document.createElement('div');
  tags.className = 'tags';
  project.tags.forEach(tag => {
    const span = document.createElement('span');
    span.textContent = tag;
    tags.append(span);
  });
  text.append(tags);
  const links = document.createElement('div');
  links.className = 'dialog-links';
  project.links.forEach(([label, href]) => {
    const a = document.createElement('a');
    a.className = 'text-link';
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = `${label} ↗`;
    links.append(a);
  });
  text.append(links);
  dialogContent.append(text);
  dialog.showModal();
  document.body.classList.add('modal-open');
  dialog.scrollTop = 0;
}
$$('[data-project]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.project, button)));
$('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  projectTrigger?.focus({ preventScroll: true });
});

$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  let visible = 0;
  $$('.project').forEach(project => {
    project.hidden = filter !== 'all' && project.dataset.category !== filter;
    if (!project.hidden) visible++;
  });
  $$('[data-filter]').forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  $('#filter-status').textContent = `Showing ${visible} ${filter === 'all' ? '' : filter + ' '}projects.`;
}));

let copyReset;
$('#copy-email').addEventListener('click', async () => {
  const button = $('#copy-email');
  clearTimeout(copyReset);
  try {
    await navigator.clipboard.writeText('einstefer@gmail.com');
    button.textContent = 'Copied ✓';
    $('#copy-status').textContent = 'Email address copied to clipboard.';
  } catch {
    button.textContent = 'Select email';
    $('#copy-status').textContent = 'Could not copy automatically. The email address is selected so you can copy it.';
    const range = document.createRange();
    range.selectNodeContents($('.email-group > a'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
  copyReset = setTimeout(() => { button.textContent = 'Copy ↗'; }, 2400);
});

// Lightweight original wireframe artwork: three parametric surfaces, one canvas.
(() => {
  const canvas = $('#curiosity-canvas');
  const context = canvas.getContext('2d');
  if (!context) return;
  const names = ['01 / TORUS KNOT', '02 / RIEMANN SPHERE', '03 / MÖBIUS STRIP'];
  let width = 1, height = 1, shape = 0, paused = motionPreference.matches;
  let visible = true, frame = 0, previous = 0, angle = 0.3;
  let pointerX = 0, pointerY = 0, tiltX = 0, tiltY = 0;
  let curves = [];
  const motionButton = $('#motion-toggle');
  function updateMotionButton() {
    motionButton.textContent = paused ? 'Play ▷' : 'Pause Ⅱ';
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.setAttribute('aria-label', paused ? 'Play sculpture animation' : 'Pause sculpture animation');
  }
  function createGeometry() {
    curves = [];
    const curveCount = shape === 1 ? 23 : 27;
    for (let ring = 0; ring < curveCount; ring++) {
      const line = [];
      const v = ring / curveCount * Math.PI * 2;
      for (let step = 0; step <= 180; step++) {
        const u = step / 180 * Math.PI * 2;
        let x, y, z;
        if (shape === 0) {
          const r = 2 + 0.68 * Math.cos(3 * u);
          const tube = 0.27;
          x = (r + tube * Math.cos(v)) * Math.cos(2 * u);
          y = (r + tube * Math.cos(v)) * Math.sin(2 * u);
          z = 0.85 * Math.sin(3 * u) + tube * Math.sin(v);
        } else if (shape === 1) {
          const latitude = Math.PI * (ring + 1) / (curveCount + 1);
          x = 2.8 * Math.sin(latitude) * Math.cos(u);
          y = 2.8 * Math.sin(latitude) * Math.sin(u);
          z = 2.8 * Math.cos(latitude);
        } else {
          const s = (ring / (curveCount - 1) - .5) * 2.2;
          x = (2.2 + s * Math.cos(u / 2)) * Math.cos(u);
          y = (2.2 + s * Math.cos(u / 2)) * Math.sin(u);
          z = s * Math.sin(u / 2);
        }
        line.push([x, y, z]);
      }
      curves.push(line);
    }
  }
  function draw() {
    context.clearRect(0, 0, width, height);
    const scale = Math.min(width, height) * .137;
    const yaw = angle * .38 + tiltX;
    const pitch = .83 + Math.sin(angle * .3) * .15 + tiltY;
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    context.lineWidth = .8;
    curves.forEach((points, index) => {
      context.beginPath();
      points.forEach(([x, y, z], pointIndex) => {
        const rx = x * cy - y * sy;
        const ry = x * sy + y * cy;
        const py = ry * cp - z * sp;
        const depth = ry * sp + z * cp;
        const perspective = 10 / (10 - depth);
        const sx = width * .51 + rx * scale * perspective;
        const sy2 = height * .47 + py * scale * perspective;
        if (!pointIndex) context.moveTo(sx, sy2); else context.lineTo(sx, sy2);
      });
      const edge = Math.abs(index / (curves.length - 1) - .5) * 2;
      context.strokeStyle = index % 5 === 0 ? `rgba(213,246,106,${.6 + edge * .24})` : `rgba(184,159,255,${.36 + edge * .39})`;
      context.stroke();
    });
    // Coordinate marks lend the drawing the feel of a mathematical field notebook.
    context.strokeStyle = '#a79caf77';
    context.lineWidth = 1;
    [[.12,.26],[.84,.37],[.18,.77]].forEach(([x,y]) => {
      const px=x*width,py=y*height;
      context.beginPath();context.moveTo(px-4,py);context.lineTo(px+4,py);context.moveTo(px,py-4);context.lineTo(px,py+4);context.stroke();
    });
  }
  function tick(time) {
    frame = 0;
    if (paused || !visible || document.hidden) return;
    const delta = previous ? Math.min(time - previous, 50) : 16;
    previous = time;
    angle += delta * .00024;
    tiltX += (pointerX - tiltX) * .035;
    tiltY += (pointerY - tiltY) * .035;
    draw();
    frame = requestAnimationFrame(tick);
  }
  function syncAnimation() {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
    updateMotionButton();
    draw();
    if (!paused && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width; height = rect.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }
  $('#reshape').addEventListener('click', () => {
    shape = (shape + 1) % names.length;
    $('#shape-name').textContent = names[shape];
    createGeometry(); draw();
  });
  motionButton.addEventListener('click', () => { paused = !paused; syncAnimation(); });
  motionPreference.addEventListener('change', event => { paused = event.matches; syncAnimation(); });
  canvas.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || paused) return;
    const rect = canvas.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / width - .5) * .65;
    pointerY = ((event.clientY - rect.top) / height - .5) * .45;
  });
  canvas.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; });
  document.addEventListener('visibilitychange', syncAnimation);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncAnimation(); }).observe(canvas);
  new ResizeObserver(resize).observe(canvas);
  createGeometry(); resize(); syncAnimation();
})();
