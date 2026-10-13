# Vasu Ganesa — personal website

Live site: **https://einstefer.github.io/**

A responsive, buildless portfolio with an interactive mathematical sculpture, filterable project work, project detail dialogs, research and experience, technical stack, community work, education, honors, and a downloadable résumé.

## Run locally

From this directory:

```sh
python -m http.server 4173
```

Open `http://localhost:4173`. No package installation or build is required.

## Make changes

- **`index.html`**: page content, links, experience, skills, project cards, and metadata.
- **`script.js`**: the `projects` object contains project detail text and links. Also contains the sculpture, filters, menu, dialog, and email-copy behavior.
- **`styles.css`**: colors, typography, layouts, and breakpoints.
- **`assets/vasu-ganesa-resume.pdf`**: replace with a new résumé using the same filename.
- **`assets/social-card.png`**: social sharing preview; editable vector source is `assets/social-card.svg`.

When adding a project, add its card to `index.html`, its entry to `projects` in `script.js`, and update the All work count. Keep profile links and email synchronized in the footer and project details as applicable.

## GitHub Pages

This repository is a GitHub user site. GitHub Pages publishes the **root of `main`**. Push changes to `main` to trigger publication. `.nojekyll` keeps the static files unprocessed. There is no backend, database, analytics, contact-form service, or runtime credential requirement. Contact links open the visitor’s email client.

Official documentation: [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) · [Configuring the publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Content and design notes

The supplied résumé is the source for education, experience, honors, and volunteering. Present-tense roles and courses reflect that résumé and should be updated as they change. The IEEE paper is described as **accepted**, and the LLM study is described as published. Research with Lars Holdijk is not presented as employment by Oxford.

Additional public project sources:

- [Vexta](https://vextaapi.com): public product description; private beta, reviewable pull requests, no automatic merges.
- [TraceTree](https://github.com/einstefer/tracetree): local-first research browser extension; working MVP, no Chrome Web Store release claimed.
- [LLM prompting paper](https://emerginginvestigators.org/articles/25-137) and [analysis code](https://github.com/einstefer/aime-llm-prompting).
- [Lift & Shift games](https://games.weliftandshift.org/) and [source](https://github.com/einstefer/games-main). Five implemented games is the résumé contribution; the overall collection may change.
- [Devpost profile](https://devpost.com/einstefer), linked without a FUSE description as requested.

The toolkit lists technologies evidenced by implementation code or the résumé, without proficiency percentages or invented certifications. Private source code and private repository details are not published here.

Design research informed the structure: [Brittany Chiang](https://brittanychiang.com/) for clear experience and project evidence; [Bruno Simon](https://bruno-simon.com/) for a memorable interactive identity; [Lee Robinson](https://leerob.com/) for a direct personal introduction. All layouts, code, illustrations, and wording here were created for Vasu rather than copied from those sites.

Project illustrations are original visual metaphors, not product screenshots or measured charts. The Vexta flow is a conceptual product workflow. Fonts are self-hosted Space Grotesk and DM Sans, licensed under the SIL Open Font License; the license files are included in `assets/`.

## Accessibility and verification

- Keyboard-friendly navigation, visible focus indicators, a skip link, native disclosure controls, and native modal dialogs with focus restoration.
- Reduced-motion preferences pause the animated artwork by default; a persistent pause/play control is available.
- Animation stops when the artwork is offscreen or the browser tab is hidden.
- Responsive layouts checked at 320, 390, 600, 768, 1024, 1440, and 1920 pixels.
- Browser checks cover filters, all five dialogs, Escape and focus restoration, sculpture controls, mobile navigation, experience details, email copy, local assets, internal anchors, and console errors.

No third-party client-side scripts are loaded.
