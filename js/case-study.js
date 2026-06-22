import { fetchCaseStudy, fetchCaseStudyManifest, caseStudyUrl } from "./case-studies.js";
import { initLayout } from "./layout.js";

function getSlugFromQuery() {
  return location.pathname.split("/").filter(Boolean).pop() || null;
}

function createTag(text, { variant = "yellow" } = {}) {
  const span = document.createElement("span");
  span.className = `tag tag--${variant}`;
  const label = document.createElement("h6");
  label.textContent = text;
  span.append(label);
  return span;
}

function createTagList(tags) {
  const list = document.createElement("div");
  list.className = "tag-list";
  list.setAttribute("aria-label", "Tags");

  for (const tag of tags) {
    list.append(createTag(tag));
  }

  return list;
}

function createFeaturedImage(src, alt) {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt ?? "";
  img.loading = "lazy";
  img.decoding = "async";
  return img;
}

function createImageWithCaption({ src, alt, caption }) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt ?? caption;
  img.loading = "lazy";
  img.decoding = "async";

  const figcaption = document.createElement("figcaption");
  figcaption.textContent = caption;

  figure.append(figcaption, img);
  return figure;
}

function createAccordionSections(sections = []) {
  const container = document.createElement("section");
  container.setAttribute("aria-label", "Case study details");

  for (const [index, { heading, content }] of sections.entries()) {
    const details = document.createElement("details");
    details.setAttribute("open", "");
    if (index === 0) details.classList.add("is-open");

    const summary = document.createElement("summary");
    const headingEl = document.createElement("h5");
    headingEl.textContent = heading;
    summary.append(headingEl);

    const body = document.createElement("div");
    body.className = "accordion-body";
    const inner = document.createElement("div");
    inner.className = "accordion-inner";
    inner.innerHTML = content ?? "";
    body.append(inner);

    summary.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = details.classList.contains("is-open");
      container.querySelectorAll("details").forEach(d => d.classList.remove("is-open"));
      if (!isOpen) details.classList.add("is-open");
    });

    details.append(summary, body);
    container.append(details);
  }

  return container;
}

const BACK_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" aria-hidden="true"><g fill="none"><path d="M10 10V14" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M8 12L16 12" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/><path d="M4 20H20" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/><path d="M4 4H20" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/><path d="M22 18L22 6" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/><path d="M2 18L2 6" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/><path d="M12 8.01001L12 8.00001" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M12 16.01L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></g></svg>`;

const RECT_ARROW_RIGHT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" aria-hidden="true"><g fill="none"><path d="M14 10V14" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M4 20H20" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/><path d="M4 4H20" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/><path d="M22 18L22 6" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/><path d="M2 18L2 6" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/><path d="M16 12L8 12" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/><path d="M12 8.01001L12 8.00001" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M12 16.01L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></g></svg>`;

const LINK_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" aria-hidden="true"><g fill="none"><path d="M10 17H10.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M14 7L13.99 7" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M12 19H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M12 5L11.99 5" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M19 19H19.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M5 5L4.99 5" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M10 10H10.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M14 14L13.99 14" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M14 21H17" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M10 3L7 3" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M21 14L21 17" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M3 10L3 7" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M8 12L8 15" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M16 12L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></g></svg>`;

const ARROW_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" aria-hidden="true"><g fill="none"><path d="M13 4H20V11" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/><path d="M18 6L18 6.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M16 8L16 8.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M14 10L14 10.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M12 12L12 12.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M10 14L10 14.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M8 16L8 16.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M6 18L6 18.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M4 20L4 20.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></g></svg>`;

function createCaseStudyLink({ url, displayLink }) {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.className = "case-study-link";

  const linkIcon = document.createElement("span");
  linkIcon.className = "case-study-link-icon";
  linkIcon.innerHTML = LINK_ICON_SVG;

  const h5 = document.createElement("h5");
  h5.textContent = displayLink;

  const arrowIcon = document.createElement("span");
  arrowIcon.className = "case-study-link-icon";
  arrowIcon.innerHTML = ARROW_ICON_SVG;

  a.append(linkIcon, h5, arrowIcon);
  return a;
}

function createBackNav() {
  const a = document.createElement("a");
  a.href = "projects.html";
  a.className = "case-study-back";

  const icon = document.createElement("span");
  icon.className = "case-study-back-icon";
  icon.innerHTML = BACK_ICON_SVG;

  const h6 = document.createElement("h6");
  h6.textContent = "All projects";

  a.append(icon, h6);
  return a;
}

function renderCaseStudy(root, slug, data) {
  root.replaceChildren();

  const article = document.createElement("article");
  article.dataset.slug = slug;

  article.append(createBackNav());

  const header = document.createElement("header");
  header.className = "case-study-header";
  const title = document.createElement("h1");
  title.textContent = data.title ?? slug;
  header.append(title);

  if (Array.isArray(data.tags) && data.tags.length > 0) {
    header.append(createTagList(data.tags));
  }

  article.append(header);

  const body = document.createElement("div");
  body.className = "case-study-body";

  const contentCol = document.createElement("div");
  contentCol.className = "case-study-content";
  contentCol.append(createAccordionSections(data.sections));

  if (data.link?.url && data.link?.displayLink) {
    contentCol.append(createCaseStudyLink(data.link));
  }

  const featuredEl = document.createElement("div");
  featuredEl.className = "case-study-featured";

  if (data.featuredImage) {
    featuredEl.append(createFeaturedImage(data.featuredImage, data.title));
  }

  const captionsEl = document.createElement("div");
  captionsEl.className = "case-study-captions";

  if (Array.isArray(data.imagesWithCaptions)) {
    for (const image of data.imagesWithCaptions) {
      if (image.src && image.caption) {
        captionsEl.append(createImageWithCaption(image));
      }
    }
  }

  body.append(contentCol, featuredEl, captionsEl);
  article.append(body);

  root.append(article);
  document.title = data.title ?? slug;
}

function measureElements(container, elements) {
  const PAD = 4;
  const cr = container.getBoundingClientRect();
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const el of elements) {
    const r = el.getBoundingClientRect();
    minX = Math.min(minX, r.left - cr.left);
    minY = Math.min(minY, r.top - cr.top);
    maxX = Math.max(maxX, r.right - cr.left);
    maxY = Math.max(maxY, r.bottom - cr.top);
  }
  return {
    minX: Math.max(0, minX - PAD),
    minY: Math.max(0, minY - PAD),
    maxX: Math.min(container.offsetWidth, maxX + PAD),
    maxY: Math.min(container.offsetHeight, maxY + PAD),
  };
}

function pixelDissolve(container, bounds, onSwap) {
  const PIXEL = 6.35;
  const PHASE_MS = 300;
  const COLORS = ["#f3e367"];

  const { minX, minY, maxX, maxY } = bounds;

  const canvas = document.createElement("canvas");
  canvas.width = maxX - minX;
  canvas.height = maxY - minY;
  canvas.style.cssText = `position:absolute;left:${minX}px;top:${minY}px;pointer-events:none;z-index:1;`;
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  const cols = Math.ceil(canvas.width / PIXEL);
  const rows = Math.ceil(canvas.height / PIXEL);
  const n = cols * rows;
  const colorMap = Array.from({ length: n }, () => COLORS[Math.floor(Math.random() * COLORS.length)]);
  const coverOrder = Array.from({ length: n }, (_, i) => i).sort(() => Math.random() - 0.5);

  let phase = "cover";
  let phaseStart = null;
  let revealOrder = null;
  let cancelled = false;

  function draw(ts) {
    if (cancelled) { canvas.remove(); return; }
    if (!phaseStart) phaseStart = ts;
    const progress = Math.min((ts - phaseStart) / PHASE_MS, 1);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (phase === "cover") {
      const filled = Math.floor(progress * n);
      for (let i = 0; i < filled; i++) {
        const idx = coverOrder[i];
        const col = idx % cols, row = Math.floor(idx / cols);
        const x = Math.round(col * PIXEL), y = Math.round(row * PIXEL);
        ctx.fillStyle = colorMap[idx];
        ctx.fillRect(x, y, Math.round((col + 1) * PIXEL) - x, Math.round((row + 1) * PIXEL) - y);
      }
      if (progress >= 1) {
        onSwap();
        revealOrder = Array.from({ length: n }, (_, i) => i).sort(() => Math.random() - 0.5);
        phase = "reveal";
        phaseStart = ts;
      }
    } else {
      const cleared = Math.floor(progress * n);
      for (let i = cleared; i < n; i++) {
        const idx = revealOrder[i];
        const col = idx % cols, row = Math.floor(idx / cols);
        const x = Math.round(col * PIXEL), y = Math.round(row * PIXEL);
        ctx.fillStyle = colorMap[idx];
        ctx.fillRect(x, y, Math.round((col + 1) * PIXEL) - x, Math.round((row + 1) * PIXEL) - y);
      }
      if (progress >= 1) { canvas.remove(); return; }
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
  return () => { cancelled = true; };
}

function renderCaseStudyPageFooter(slot, currentSlug, manifest) {
  const studies = manifest.caseStudies ?? [];
  const idx = studies.findIndex(s => s.slug === currentSlug);
  const nextStudy = studies.length > 1 ? studies[(idx + 1) % studies.length] : null;

  const footer = document.createElement("div");
  footer.className = "case-study-page-footer";

  const DINNER_ICON = `<svg xmlns="http://www.w3.org/2000/svg" height="40" width="40" viewBox="0 0 24 24" aria-hidden="true"><g fill="none"><path d="M18 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M3 18H6" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M12 21V14" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M16 20V21" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M8 20V21" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M7 14H17" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M21 12V21" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M3 12V21" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M12.01 4H12" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M12.01 10H12" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M14 8L15 8" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M9 8L10 8" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M15 2L14 2" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M10 2L9 2" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M17 4L17 6" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M7 4L7 6" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></g></svg>`;
  const ENVELOPE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" height="40" width="40" viewBox="0 0 24 24" aria-hidden="true"><g fill="none"><path d="M2 8H5" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M19 8H22" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M7 10H9" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M15 10H17" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M11 12H13" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M11 20H4" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M20 4H4" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M22 6V10" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M2 6V18" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M21.01 18L21 18" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M23.01 14L23 14" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M15.01 22L15 22" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M17.01 18L17 18" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M19 14L19 16" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M19 20L19 22" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></g></svg>`;

  const left = document.createElement("a");
  left.className = "cs-footer-left";
  left.href = "contact.html";
  const leftH2 = document.createElement("h2");
  leftH2.textContent = "Work with Leftside";
  const leftIcon = document.createElement("span");
  leftIcon.className = "cs-footer-left-icon";
  leftIcon.innerHTML = DINNER_ICON;

  let cancelDissolve = null;
  let currentState = "default";

  function dissolveToState(state) {
    if (currentState === state) return;
    if (cancelDissolve) cancelDissolve();
    currentState = state;

    const before = measureElements(left, [leftH2, leftIcon]);

    // Swap to target state to measure its bounds, then restore — no repaint between sync calls
    if (state === "hover") {
      leftH2.textContent = "Get in touch";
      leftIcon.innerHTML = ENVELOPE_ICON;
    } else {
      leftH2.textContent = "Work with Leftside";
      leftIcon.innerHTML = DINNER_ICON;
    }
    const after = measureElements(left, [leftH2, leftIcon]);
    if (state === "hover") {
      leftH2.textContent = "Work with Leftside";
      leftIcon.innerHTML = DINNER_ICON;
    } else {
      leftH2.textContent = "Get in touch";
      leftIcon.innerHTML = ENVELOPE_ICON;
    }

    const bounds = {
      minX: Math.min(before.minX, after.minX),
      minY: Math.min(before.minY, after.minY),
      maxX: Math.max(before.maxX, after.maxX),
      maxY: Math.max(before.maxY, after.maxY),
    };

    cancelDissolve = pixelDissolve(left, bounds, () => {
      if (state === "hover") {
        leftH2.textContent = "Get in touch";
        leftIcon.innerHTML = ENVELOPE_ICON;
      } else {
        leftH2.textContent = "Work with Leftside";
        leftIcon.innerHTML = DINNER_ICON;
      }
    });
  }

  left.addEventListener("mouseenter", () => dissolveToState("hover"));
  left.addEventListener("mouseleave", () => dissolveToState("default"));

  left.append(leftH2, leftIcon);

  footer.append(left);

  if (nextStudy) {
    const right = document.createElement("a");
    right.className = "cs-footer-right";
    right.href = caseStudyUrl(nextStudy.slug);

    const nav = document.createElement("span");
    nav.className = "case-study-back";
    const navLabel = document.createElement("h6");
    navLabel.textContent = "Next project";
    const navIcon = document.createElement("span");
    navIcon.className = "case-study-back-icon";
    navIcon.innerHTML = RECT_ARROW_RIGHT_SVG;
    nav.append(navLabel, navIcon);

    const h2 = document.createElement("h2");
    h2.textContent = nextStudy.shortTitle || nextStudy.title;

    const readMore = document.createElement("span");
    readMore.className = "card-read-more";
    const readMoreLabel = document.createElement("h6");
    readMoreLabel.textContent = "Read more";
    const arrow = document.createElement("span");
    arrow.className = "card-arrow";
    arrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><g fill="none"><path d="M21 12L21 12.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M19 14L19 14.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M17 16L17 16.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M15 18L15 18.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M19 10L19 10.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M17 8L17 8.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M15 6L15 6.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M19 12L3 12" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></g></svg>`;
    readMore.append(readMoreLabel, arrow);

    right.append(nav, h2, readMore);
    footer.append(right);
  }

  slot.replaceChildren(footer);
}

async function initCaseStudyPage() {
  initLayout({ currentPath: "case-study.html" });

  const root = document.querySelector("[data-case-study-root]");
  const footerSlot = document.querySelector("[data-case-study-page-footer]");
  const slug = getSlugFromQuery();

  if (!root) return;

  if (!slug) {
    root.textContent = "Missing case study slug.";
    return;
  }

  try {
    const [data, manifest] = await Promise.all([
      fetchCaseStudy(slug),
      fetchCaseStudyManifest(),
    ]);
    renderCaseStudy(root, slug, data);
    if (footerSlot) renderCaseStudyPageFooter(footerSlot, slug, manifest);
  } catch (error) {
    root.textContent = error.message;
  }
}

initCaseStudyPage();
