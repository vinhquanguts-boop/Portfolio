(function () {
  const header = document.querySelector("[data-header]");
  const navLinks = [...document.querySelectorAll(".site-nav a")];
  const studies = [...document.querySelectorAll("[data-study]")];
  const projects = window.PORTFOLIO_PROJECTS || [];
  const isProjectPage = window.location.pathname.replace(/\\/g, "/").includes("/projects/");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 18);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function assetPath(src) {
    if (!src) return "";
    if (/^(https?:|mailto:|tel:|#)/.test(src)) return src;
    if (src.startsWith("../")) return src;
    return `${isProjectPage ? "../" : ""}${src}`;
  }

  function pagePath(path) {
    if (!path) return "#";
    if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
    return `${isProjectPage ? "../" : ""}${path}`;
  }

  function listItems(items, className) {
    return (items || [])
      .map((item) => `<li${className ? ` class="${className}"` : ""}>${escapeHtml(item)}</li>`)
      .join("");
  }

  function bindSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function bindActiveNav() {
    const hashLinks = navLinks.filter((link) => (link.getAttribute("href") || "").startsWith("#"));
    const targets = hashLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    if (!targets.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (!visible) return;
        hashLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
        });
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: 0 }
    );

    targets.forEach((target) => observer.observe(target));
  }

  function bindStudies() {
    studies.forEach((study) => {
      const button = study.querySelector("[data-next-state]");
      const states = (study.dataset.states || "").split("|").filter(Boolean);
      if (!button || !states.length) return;

      let index = 0;
      button.textContent = states[index];

      button.addEventListener("click", () => {
        index = (index + 1) % states.length;
        button.textContent = states[index];
        study.dataset.activeState = String(index);
      });
    });
  }

  function projectVisuals(project) {
    const assets = project.assets || {};
    return [
      assets.cardFront,
      assets.homeScreen,
      assets.virtualCard,
      project.gallery?.[1]?.src
    ].filter(Boolean);
  }

  function renderProjectCard(project, variant) {
    const visuals = projectVisuals(project);
    const role = (project.role || []).slice(0, 4);
    const tools = (project.tools || []).slice(0, 5);
    const isFeatured = variant === "featured";

    return `
      <article class="work-card ${isFeatured ? "featured-work-card" : "index-work-card"}">
        <div class="work-card-copy">
          <div class="file-topline">
            <span>${escapeHtml(project.category)}</span>
            <span>${escapeHtml(project.year)}</span>
          </div>
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(isFeatured ? project.hero || project.summary : project.summary)}</p>
          <dl class="work-meta">
            <div><dt>Role</dt><dd>${role.map(escapeHtml).join(" / ")}</dd></div>
            <div><dt>Tools</dt><dd>${tools.map(escapeHtml).join(" / ")}</dd></div>
          </dl>
          <div class="work-actions">
            <a class="text-button" href="${pagePath(project.links?.caseStudy || `projects/${project.slug}.html`)}">View Case Study</a>
            <a class="text-button secondary-link" href="${escapeHtml(project.links?.figma || project.prototype?.figma)}" target="_blank" rel="noreferrer">View Figma Prototype</a>
          </div>
        </div>
        <div class="work-card-visuals" aria-label="${escapeHtml(project.title)} visual artifacts">
          ${visuals
            .slice(0, isFeatured ? 3 : 4)
            .map(
              (src, index) => `
                <figure class="artifact artifact-${index + 1}">
                  <img src="${assetPath(src)}" alt="${escapeHtml(project.title)} artifact ${index + 1}" loading="lazy" />
                  <figcaption>${index === 0 ? "Card system" : index === 1 ? "Home screen" : index === 2 ? "Prototype" : "Brand board"}</figcaption>
                </figure>
              `
            )
            .join("")}
        </div>
      </article>
    `;
  }

  function renderFeaturedWork() {
    const container = document.querySelector("[data-featured-work]");
    if (!container || !projects.length) return;
    container.innerHTML = renderProjectCard(projects[0], "featured");
  }

  function renderWorkList() {
    const container = document.querySelector("[data-work-list]");
    if (!container || !projects.length) return;
    container.innerHTML = projects.map((project) => renderProjectCard(project, "index")).join("");
  }

  function renderImageFigure(src, alt, caption, className) {
    return `
      <figure class="${className || "case-figure"}">
        <img src="${assetPath(src)}" alt="${escapeHtml(alt)}" loading="lazy" />
        <figcaption>${escapeHtml(caption || alt)}</figcaption>
      </figure>
    `;
  }

  function renderCaseStudy() {
    const container = document.querySelector("[data-case-study]");
    if (!container) return;

    const slug = container.dataset.caseStudy;
    const project = projects.find((item) => item.slug === slug) || projects[0];
    if (!project) {
      container.innerHTML = '<section class="page-section"><h1>Project not found.</h1></section>';
      return;
    }

    const assets = project.assets || {};
    const prototypeScreens = assets.prototypeScreens || [];
    const gallery = project.gallery || [];

    container.innerHTML = `
      <section class="case-hero grid-shell page-hero" aria-labelledby="case-title">
        <div class="section-rail" aria-hidden="true">
          <span>${escapeHtml(project.category)}</span>
          <span>${escapeHtml(project.year)}</span>
        </div>
        <div class="page-hero-copy">
          <a class="back-link" href="../work.html">Back to work</a>
          <p class="micro-label">Case study / Fintech interface / Product system</p>
          <h1 id="case-title">${escapeHtml(project.title)}</h1>
          <p class="lead">${escapeHtml(project.hero || project.summary)}</p>
          <div class="work-actions">
            <a class="text-button" href="${escapeHtml(project.prototype?.figma || project.links?.figma)}" target="_blank" rel="noreferrer">View Figma Prototype</a>
            <a class="text-button secondary-link" href="${escapeHtml(project.prototype?.live || project.links?.live)}" target="_blank" rel="noreferrer">Open Live Vault Demo</a>
          </div>
        </div>
        <div class="case-hero-media">
          ${renderImageFigure(assets.cardFront, "Vault Bank card front", "Premium card artifact", "case-hero-card")}
          ${renderImageFigure(assets.homeScreen, "Vault Bank home screen", "Primary mobile dashboard", "case-hero-phone")}
        </div>
      </section>

      <section class="case-overview page-section" aria-labelledby="overview-title">
        <div class="section-kicker">Overview</div>
        <div class="case-overview-grid">
          <div>
            <h2 id="overview-title">A calmer financial product for everyday confidence.</h2>
            <p>${escapeHtml(project.problem)}</p>
          </div>
          <dl class="case-facts">
            <div><dt>Role</dt><dd>${(project.role || []).map(escapeHtml).join(" / ")}</dd></div>
            <div><dt>Tools</dt><dd>${(project.tools || []).map(escapeHtml).join(" / ")}</dd></div>
            <div><dt>Source note</dt><dd>Restored from the previous Vault portfolio material.</dd></div>
          </dl>
        </div>
      </section>

      <section class="case-section page-section" aria-labelledby="story-title">
        <div class="section-kicker">Product story</div>
        <div class="case-story-list">
          ${(project.sections || [])
            .map(
              (section, index) => `
                <article>
                  <span>${String(index + 1).padStart(2, "0")} / ${escapeHtml(section.label)}</span>
                  <h2 ${index === 0 ? 'id="story-title"' : ""}>${escapeHtml(section.title)}</h2>
                  <p>${escapeHtml(section.body)}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="case-section page-section" aria-labelledby="artifact-title">
        <div class="section-kicker">Artifacts</div>
        <div class="section-heading">
          <h2 id="artifact-title">Screens and research evidence.</h2>
          <p>Clean project artifacts, kept large enough for reviewers to understand the product.</p>
        </div>
        <div class="artifact-row primary-artifacts">
          ${renderImageFigure(assets.personaBoard, "Sarah Mitchell persona board", "Primary persona and research board")}
          ${renderImageFigure(assets.virtualCard, "Vault virtual card screen", "Virtual card flow")}
        </div>
        <div class="phone-gallery">
          ${prototypeScreens
            .slice(0, 6)
            .map((src) => renderImageFigure(src, src.split("/").pop().replace(".png", ""), src.split("/").pop().replace(".png", "")))
            .join("")}
        </div>
      </section>

      <section class="case-section page-section" aria-labelledby="system-artifacts-title">
        <div class="section-kicker">Visual system</div>
        <div class="section-heading">
          <h2 id="system-artifacts-title">Brand assets, cards, and product surfaces.</h2>
          <p>The restored work keeps Vault's rose, plum, and gold identity visible through the actual artifacts.</p>
        </div>
        <div class="case-gallery">
          ${gallery
            .slice(0, 6)
            .map((item) => renderImageFigure(item.src, item.alt, item.caption))
            .join("")}
        </div>
      </section>

      <section class="case-section page-section" aria-labelledby="process-case-title">
        <div class="section-kicker">Process and outcomes</div>
        <div class="case-process-grid">
          <div>
            <h2 id="process-case-title">Process map.</h2>
            <ol class="case-process-list">
              ${(project.process || [])
                .map((item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(item.label)}</strong><p>${escapeHtml(item.text)}</p></li>`)
                .join("")}
            </ol>
          </div>
          <div>
            <h2>Outcomes.</h2>
            <ul class="outcome-list">${listItems(project.outcomes || [])}</ul>
          </div>
        </div>
      </section>
    `;
  }

  renderFeaturedWork();
  renderWorkList();
  renderCaseStudy();
  bindSmoothAnchors();
  bindActiveNav();
  bindStudies();
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();
