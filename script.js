const projects = {
  vexta: {
    eyebrow: "VEXTA / DEVELOPER TOOLS / PRIVATE BETA",
    title: "API changes, repaired.",
    paragraphs: [
      "Vexta monitors external API changes and traces their impact into TypeScript and JavaScript integrations. It prepares focused repairs, validates them in isolated sandboxes, and opens GitHub pull requests for human review.",
      "The repair loop covers OpenAPI specifications, npm packages, and changelogs, then connects breaking changes to affected code. Candidate fixes include regression tests and are validated before a pull request is opened.",
      "Vexta is in private beta. Repairs stay reviewable: it does not automatically merge changes.",
    ],
    tags: [
      "TypeScript",
      "API monitoring",
      "OpenAPI",
      "GitHub integration",
      "Isolated validation",
    ],
    links: [["Explore Vexta", "https://vextaapi.com"]],
  },
  eeg: {
    eyebrow: "IEEE ICIIBMS 2026 / SOLE-AUTHOR PAPER ACCEPTED",
    title: "P300 EEG classification.",
    image: "assets/research-signal.svg",
    paragraphs: [
      "As a research assistant to Dr. Xiucai Ding in the UC Davis Department of Statistics, I analyzed high-dimensional biomedical and EEG datasets for a brain-computer interface project backed by a UC Davis medical team and supported by an NSF grant.",
      "I evaluated 11 machine learning methods for P300 EEG classification across 110 subjects, applying statistical learning, dimensionality reduction, and deep learning techniques.",
      "My sole-author research paper was accepted to IEEE ICIIBMS 2026.",
    ],
    tags: [
      "P300 EEG",
      "Brain-computer interfaces",
      "Statistical learning",
      "Deep learning",
    ],
    links: [["IEEE ICIIBMS 2026 conference", "https://www.iciibms.org/"]],
  },
  tracetree: {
    eyebrow: "TRACETREE / CHROME EXTENSION",
    title: "Keep the trail behind your research.",
    image: "assets/project-tracetree-v2.svg",
    paragraphs: [
      "TraceTree organizes online research into persistent browsing trees. Instead of losing the path from one source to the next, you can keep related pages connected in a Chrome side panel.",
      "The extension supports project switching, contextual search of saved page metadata, moving branches, and reopening saved pages. Data stays local to the browser.",
      "It is a working MVP you can load unpacked from the repository; it is not currently published on the Chrome Web Store.",
    ],
    tags: ["React", "TypeScript", "Chrome Manifest V3", "Vite", "Vitest"],
    links: [["Explore the code", "https://github.com/einstefer/tracetree"]],
  },
  aime: {
    eyebrow: "PUBLISHED RESEARCH / JOURNAL OF EMERGING INVESTIGATORS",
    title: "Does a different prompt change the answer?",
    image: "assets/project-aime.svg",
    paragraphs: [
      "With Lars Holdijk, an Oxford PhD student, I investigated how five prompting strategies affected three large language models on 60 American Invitational Mathematics Examination problems.",
      "I built Python evaluation pipelines and analyzed differences with Cochran’s Q and McNemar’s statistical tests, including multiple-comparison correction. Detailed-solution prompting did not significantly improve accuracy over the baseline or the other prompting styles.",
      "“Evaluating the impact of prompting styles on LLM accuracy for AIME math questions” was published in the Journal of Emerging Investigators on July 26, 2026. Authors: Vasu Ganesa and Lars Holdijk. DOI: 10.59720/25-137.",
    ],
    tags: [
      "Python",
      "NumPy",
      "statsmodels",
      "LLM evaluation",
      "Statistical testing",
    ],
    links: [
      ["Read the paper", "https://emerginginvestigators.org/articles/25-137"],
      ["Explore the code", "https://github.com/einstefer/aime-llm-prompting"],
    ],
  },
  games: {
    eyebrow: "LIFT & SHIFT / FULL STACK DEVELOPMENT",
    title: "From browser to mobile.",
    image: "assets/project-games.svg",
    paragraphs: [
      "Through my Full Stack Web Development internship at Lift & Shift, I developed the foundation’s games website and implemented five interactive web games using Python, JavaScript, HTML, and CSS.",
      "The public game collection now runs on Cloudflare Workers and includes responsive themes and server-side Sudoku generation.",
      "My work at Lift & Shift also includes developing and launching a cross-platform equine veterinary management application on Google Play.",
    ],
    tags: [
      "JavaScript",
      "Python",
      "HTML / CSS",
      "Cloudflare Workers",
      "Wrangler",
    ],
    links: [
      ["Play the games", "https://games.weliftandshift.org/"],
      ["Explore the code", "https://github.com/einstefer/games-main"],
    ],
  },
};

// The page is static; all examples run locally without API calls or analytics.
(() => {
  "use strict";
  document.getElementById("year").textContent = new Date().getFullYear();
  const menu = document.querySelector(".menu-button");
  const nav = document.getElementById("main-nav");
  function closeMenu() {
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("is-open");
  }
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
    nav.classList.toggle("is-open", open);
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menu.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menu.focus();
    }
  });
  window.matchMedia("(min-width:801px)").addEventListener("change", closeMenu);

  const dialog = document.getElementById("project-dialog");
  const content = document.getElementById("dialog-content");
  let returnFocus;
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  document.querySelectorAll("[data-project]").forEach((button) => {
    button.addEventListener("click", () => {
      const project = projects[button.dataset.project];
      if (!project) return;
      returnFocus = button;
      const heading = element("h2", "", project.title);
      heading.id = "dialog-title";
      content.replaceChildren(
        element("p", "dialog-eyebrow", project.eyebrow),
        heading,
      );
      if (project.image) {
        const img = element("img", "dialog-image");
        img.src = project.image;
        img.alt = "Illustration for this project";
        content.append(img);
      }
      project.paragraphs.forEach((paragraph) =>
        content.append(element("p", "", paragraph)),
      );
      const tags = element("div", "tags");
      project.tags.forEach((tag) => tags.append(element("span", "", tag)));
      content.append(tags);
      const links = element("div", "dialog-links");
      project.links.forEach(([label, url]) => {
        const link = element("a", "", label + " ↗");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener";
        links.append(link);
      });
      content.append(links);
      document.body.classList.add("dialog-open");
      dialog.showModal();
      dialog.scrollTop = 0;
      dialog.querySelector(".dialog-close").focus({ preventScroll: true });
    });
  });
  dialog
    .querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  let backdropPress = false;
  dialog.addEventListener("pointerdown", (event) => {
    backdropPress = event.target === dialog;
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog || !backdropPress) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    returnFocus?.focus({ preventScroll: true });
  });

  // An explicit three-state illustration, not a live Vexta result.
  const demo = document.getElementById("api-demo");
  const action = document.getElementById("demo-action");
  const reset = document.getElementById("demo-reset");
  const demoStates = {
    healthy: {
      field: "user_name",
      consumer: "user_name",
      status: "CONNECTED",
      message: "The contract matches. The application works.",
      action: "Break the API",
    },
    broken: {
      field: "display_name",
      consumer: "user_name",
      status: "BREAKING CHANGE",
      message:
        "The API renamed a field. Your application still expects user_name.",
      action: "Preview a repair",
    },
    repaired: {
      field: "display_name",
      consumer: "display_name",
      status: "REPAIR PREVIEW",
      message:
        "The proposed change restores the match. In Vexta, a repair becomes a PR for review.",
      action: "Try it again",
    },
  };
  function setDemo(state) {
    const data = demoStates[state];
    demo.dataset.state = state;
    document.getElementById("api-field").textContent = '"' + data.field + '"';
    document.getElementById("consumer-field").textContent = data.consumer;
    document.getElementById("demo-status").textContent = data.status;
    document.getElementById("demo-message").textContent = data.message;
    action.replaceChildren(
      document.createTextNode(data.action + " "),
      element("span", "", "↗"),
    );
    document.getElementById("repair-diff").hidden = state !== "repaired";
    reset.hidden = state === "healthy";
  }
  action.addEventListener("click", () =>
    setDemo(
      { healthy: "broken", broken: "repaired", repaired: "healthy" }[
        demo.dataset.state
      ],
    ),
  );
  reset.addEventListener("click", () => {
    setDemo("healthy");
    action.focus({ preventScroll: true });
  });

  const tabs = [...document.querySelectorAll("[data-stack]")];
  function selectTab(tab, focus = false) {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute("aria-controls")).hidden =
        !selected;
    });
    if (focus) tab.focus({ preventScroll: true });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft")
        next = (index + tabs.length - 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      selectTab(tabs[next], true);
    });
  });
  selectTab(tabs[0]);

  const descriptions = {
    systems: ["Small connections.", "One working system."],
    signals: ["Hidden in the noise.", "A pattern worth finding."],
    reasoning: ["Follow a connection.", "Find the next question."],
  };
  document.querySelectorAll("[data-lab-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      const lines = descriptions[button.dataset.labMode];
      document
        .getElementById("scene-description")
        .replaceChildren(
          document.createTextNode(lines[0]),
          document.createElement("br"),
          document.createTextNode(lines[1]),
        );
    });
  });
  document
    .getElementById("copy-email")
    .addEventListener("click", async (event) => {
      const button = event.currentTarget;
      const status = document.getElementById("copy-status");
      try {
        await navigator.clipboard.writeText("einstefer@gmail.com");
        button.textContent = "Copied ✓";
        status.textContent = "Email address copied.";
        window.setTimeout(() => {
          button.textContent = "Copy ↗";
        }, 2500);
      } catch {
        status.textContent =
          "Copy unavailable. Select the email address to copy it.";
        button.textContent = "Select email";
        const range = document.createRange();
        range.selectNodeContents(document.querySelector(".email-group>a"));
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
})();
