(function () {
  const projects = window.PORTFOLIO_PROJECTS || [];
  const header = document.querySelector("[data-header]");

  function assetPath(project, src) {
    const depth = document.body.dataset.depth || "root";
    return depth === "nested" ? `../${src}` : src;
  }

  function pagePath(path) {
    const depth = document.body.dataset.depth || "root";
    return depth === "nested" ? `../${path}` : path;
  }

  function makeProjectCard(project, index, options = {}) {
    const article = document.createElement("article");
    article.className = options.compact ? "project-feature compact-card" : "project-feature";
    article.innerHTML = `
      <div class="project-meta">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <span>${project.category}</span>
        <span>${project.year}</span>
      </div>
      <div class="project-copy">
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        <div class="tag-row">
          ${project.role.map((item) => `<span>${item}</span>`).join("")}
        </div>
        <div class="link-row">
          <a href="${pagePath(project.links.caseStudy)}">Read case study</a>
          <a href="${project.links.figma}" target="_blank" rel="noreferrer">View Figma Prototype</a>
          <a href="${project.links.live}" target="_blank" rel="noreferrer">Open Live Vault Demo</a>
        </div>
      </div>
      <a class="project-visuals clean-project-visuals" href="${pagePath(project.links.caseStudy)}" aria-label="Open ${project.title} case study">
        <figure>
          <img class="screen-shot" src="${assetPath(project, project.assets.homeScreen || project.assets.launchFlow)}" alt="${project.title} home screen" />
        </figure>
        <figure>
          <img class="card-shot" src="${assetPath(project, project.assets.cardFront)}" alt="${project.title} premium card visual" />
        </figure>
      </a>
    `;
    return article;
  }

  function renderHome() {
    const projectList = document.querySelector("#project-list");
    const processList = document.querySelector("#process-list");
    if (!projectList || !projects.length) return;

    projectList.replaceChildren(...projects.map((project, index) => makeProjectCard(project, index)));

    if (processList) {
      const activeProject = projects[0];
      processList.replaceChildren(
        ...activeProject.process.map((step, index) => {
          const item = document.createElement("article");
          item.className = "process-step";
          item.innerHTML = `
            <span>${String(index + 1).padStart(2, "0")}</span>
            <h3>${step.label}</h3>
            <p>${step.text}</p>
          `;
          return item;
        })
      );
    }
  }

  function renderWorkPage() {
    const workList = document.querySelector("#work-overview-list");
    if (!workList) return;
    workList.replaceChildren(...projects.map((project, index) => makeProjectCard(project, index, { compact: true })));
  }

  function renderCaseStudy() {
    const mount = document.querySelector("#case-study-detail");
    if (!mount || !projects.length) return;

    const slug = mount.dataset.project || "vault-bank";
    const project = projects.find((item) => item.slug === slug) || projects[0];

    const personasHTML = project.personas && project.personas.length
      ? `
        <section class="personas-section section-frame">
          <div class="rail-label" aria-hidden="true">
            <span>User</span>
            <span>Research</span>
          </div>
          <div class="section-heading">
            <span class="section-index">02</span>
            <h2>Four real people. Four distinct problems.</h2>
            <p>Each persona drove specific features, flows and UI decisions in Vault.</p>
          </div>
          <div class="personas-grid">
            ${project.personas.map((persona) => `
              <article class="persona-card">
                <div class="persona-header">
                  <span class="persona-avatar" aria-hidden="true">${persona.avatar}</span>
                  <div>
                    <h3>${persona.name}</h3>
                    <p class="persona-role">${persona.age} &middot; ${persona.role} &middot; ${persona.city}</p>
                  </div>
                </div>
                <blockquote class="persona-quote">&ldquo;${persona.quote}&rdquo;</blockquote>
                <div class="persona-stat">
                  <span class="stat-label">${persona.topPain}</span>
                  <div class="stat-bar-track">
                    <div class="stat-bar-fill" style="width:${persona.painScore}%"></div>
                  </div>
                  <span class="stat-note">${persona.painLabel}</span>
                </div>
                <p class="persona-goal"><strong>Goals:</strong> ${persona.goal}</p>
                <p class="persona-vault">${persona.whyVault}</p>
              </article>
            `).join("")}
          </div>
          ${project.assets.personaBoard ? `
            <figure class="persona-board">
              <img src="../${project.assets.personaBoard}" alt="Sarah Mitchell persona board research artifact" loading="lazy" />
              <figcaption>Primary persona board - Sarah Mitchell, 31, Melbourne</figcaption>
            </figure>
          ` : ""}
        </section>
      `
      : "";

    const featuresHTML = project.features && project.features.length
      ? `
        <section class="features-section section-frame">
          <div class="rail-label" aria-hidden="true">
            <span>Key</span>
            <span>Features</span>
          </div>
          <div class="section-heading">
            <span class="section-index">03</span>
            <h2>Built around the moments that matter.</h2>
            <p>Each feature illustration maps directly to a user pain point discovered in research.</p>
          </div>
          <div class="features-strip">
            ${project.features.map((feat) => `
              <figure class="feature-tile">
                <div class="feature-img-wrap">
                  <img src="../${feat.src}" alt="${feat.label} feature illustration" loading="lazy" />
                </div>
                <figcaption>
                  <strong>${feat.label}</strong>
                  <span>${feat.caption}</span>
                </figcaption>
              </figure>
            `).join("")}
          </div>
        </section>
      `
      : "";

    const brandHTML = project.assets.brandArtifacts
      ? `
        <section class="brand-section section-frame">
          <div class="rail-label" aria-hidden="true">
            <span>Visual</span>
            <span>Identity</span>
          </div>
          <div class="section-heading">
            <span class="section-index">04</span>
            <h2>A warm identity apart from bank-blue fintech.</h2>
            <p>Deep rose, plum and gold define a brand built on trust without institutional coldness.</p>
          </div>
          <div class="brand-grid">
            <figure>
              <img src="../${project.assets.brandArtifacts.poster}" alt="Vault Bank launch poster" loading="lazy" />
              <figcaption>App launch poster</figcaption>
            </figure>
            <figure>
              <img src="../${project.assets.brandArtifacts.cardFrontShadow}" alt="Vault card front render" loading="lazy" />
              <figcaption>Physical card &mdash; front</figcaption>
            </figure>
            <figure>
              <img src="../${project.assets.brandArtifacts.cardBackShadow}" alt="Vault card back render" loading="lazy" />
              <figcaption>Physical card &mdash; back</figcaption>
            </figure>
          </div>
        </section>
      `
      : "";

    const protoScreensHTML = project.assets.prototypeScreens && project.assets.prototypeScreens.length
      ? `
        <div class="proto-screens">
          ${project.assets.prototypeScreens.map((src) => {
            const label = src.split("/").pop().replace(".png", "");
            return `<figure>
              <img src="../${src}" alt="${label} screen" loading="lazy" />
              <figcaption>${label}</figcaption>
            </figure>`;
          }).join("")}
        </div>
      `
      : "";

    mount.innerHTML = `
      <section class="case-detail-hero section-frame">
        <div class="rail-label" aria-hidden="true">
          <span>Case</span>
          <span>Study</span>
        </div>
        <div class="case-detail-copy">
          <a class="back-link" href="../work.html">Back to work</a>
          <p class="tiny-label">${project.category} / ${project.year}</p>
          <h1>${project.title}</h1>
          <p class="hero-statement">${project.hero}</p>
          <div class="hero-actions">
            <a class="button primary" href="${project.prototype.figma}" target="_blank" rel="noreferrer">View Figma Prototype</a>
            <a class="button quiet" href="${project.prototype.live}" target="_blank" rel="noreferrer">Open Live Vault Demo</a>
          </div>
        </div>
        <div class="case-detail-visual">
          <div class="case-artifact-pair">
            <figure class="case-screen-artifact">
              <img src="../${project.assets.homeScreen}" alt="Vault Bank home screen" />
              <figcaption>Home screen</figcaption>
            </figure>
            <figure class="case-card-artifact">
              <img src="../${project.assets.cardFront}" alt="Vault debit card" />
              <figcaption>Premium debit card</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section class="case-story">
        <div class="case-facts">
          <div><span>Role</span><p>${project.role.join(", ")}</p></div>
          <div><span>Tools</span><p>${project.tools.join(", ")}</p></div>
          <div><span>Problem</span><p>${project.problem}</p></div>
        </div>
        <div class="story-stack">
          ${project.sections
            .map(
              (section, index) => `
                <article class="story-row">
                  <span>${String(index + 1).padStart(2, "0")} / ${section.label}</span>
                  <h2>${section.title}</h2>
                  <p>${section.body}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      ${personasHTML}

      ${featuresHTML}

      ${brandHTML}

      <section class="gallery-section section-frame">
        <div class="rail-label" aria-hidden="true">
          <span>Project</span>
          <span>Screens</span>
        </div>
        <div class="section-heading">
          <span class="section-index">05</span>
          <h2>Prototype screens</h2>
          <p>High-fidelity screens from the Vault Bank Figma prototype.</p>
        </div>
        ${protoScreensHTML}
        <div class="case-gallery supplemental-gallery">
          ${project.gallery
            .map(
              (item) => `
                <figure>
                  <img src="../${item.src}" alt="${item.alt}" loading="lazy" />
                  <figcaption>${item.caption}</figcaption>
                </figure>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="prototype-section">
        <div>
          <span class="section-index">06</span>
          <h2>Prototype access</h2>
          <p>Review the Figma prototype for screen-by-screen interaction detail, or open the live Vault demo to explore the rebuilt web experience.</p>
          <div class="case-links">
            <a class="button primary" href="${project.prototype.figma}" target="_blank" rel="noreferrer">View Figma Prototype</a>
            <a class="button quiet" href="${project.prototype.live}" target="_blank" rel="noreferrer">Open Live Vault Demo</a>
          </div>
        </div>
        <img src="../${project.assets.virtualCard || project.prototype.preview}" alt="${project.title} virtual card screen" />
      </section>

      <section class="outcome-section">
        <span class="section-index">07</span>
        <h2>Outcomes</h2>
        <ul>
          ${project.outcomes.map((outcome) => `<li>${outcome}</li>`).join("")}
        </ul>
      </section>
    `;
  }

  function bindSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function bindHeaderState() {
    if (!header) return;
    const update = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  renderHome();
  renderWorkPage();
  renderCaseStudy();
  bindSmoothScroll();
  bindHeaderState();
})();
