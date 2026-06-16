import { fetchCaseStudyManifest, fetchCaseStudy, caseStudyUrl } from "./case-studies.js";
import { initLayout } from "./layout.js";

// ─── Shared icon SVGs ────────────────────────────────────────────────────────

const BACK_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" aria-hidden="true"><g fill="none"><path d="M10 10V14" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M8 12L16 12" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/><path d="M4 20H20" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/><path d="M4 4H20" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/><path d="M22 18L22 6" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/><path d="M2 18L2 6" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/><path d="M12 8.01001L12 8.00001" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M12 16.01L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></g></svg>`;

const LINK_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" aria-hidden="true"><g fill="none"><path d="M10 17H10.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M14 7L13.99 7" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M12 19H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M12 5L11.99 5" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M19 19H19.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M5 5L4.99 5" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M10 10H10.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M14 14L13.99 14" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M14 21H17" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M10 3L7 3" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M21 14L21 17" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M3 10L3 7" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M8 12L8 15" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M16 12L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></g></svg>`;

const ARROW_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" aria-hidden="true"><g fill="none"><path d="M13 4H20V11" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/><path d="M18 6L18 6.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M16 8L16 8.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M14 10L14 10.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M12 12L12 12.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M10 14L10 14.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M8 16L8 16.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M6 18L6 18.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M4 20L4 20.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></g></svg>`;

// ─── Projects listing ─────────────────────────────────────────────────────────

function renderCaseStudyList(container, caseStudies) {
  container.replaceChildren();

  if (caseStudies.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No case studies yet.";
    container.append(empty);
    return;
  }

  const list = document.createElement("ul");
  list.className = "case-study-grid";

  for (const study of caseStudies) {
    const item = document.createElement("li");
    const article = document.createElement("article");

    const imgWrapper = document.createElement("div");
    imgWrapper.className = "case-study-card-image";

    if (study.featuredImage) {
      const img = document.createElement("img");
      img.src = study.featuredImage;
      img.alt = study.title;
      img.loading = "lazy";
      img.decoding = "async";
      imgWrapper.append(img);
    }

    article.append(imgWrapper);

    const cardMeta = document.createElement("div");
    cardMeta.className = "case-study-card-meta";

    if (study.organisation) {
      const org = document.createElement("h5");
      org.textContent = study.organisation;
      cardMeta.append(org);
    }

    const title = document.createElement("p");
    title.className = "body-large";
    title.textContent = study.shortTitle || study.title;

    const readMore = document.createElement("a");
    readMore.href = caseStudyUrl(study.slug);
    readMore.className = "card-read-more";
    readMore.setAttribute("aria-label", `Read more about ${study.title}`);

    const readMoreLabel = document.createElement("h6");
    readMoreLabel.textContent = "Read more";
    const arrow = document.createElement("span");
    arrow.className = "card-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><g fill="none"><path d="M21 12L21 12.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M19 14L19 14.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M17 16L17 16.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M15 18L15 18.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M19 10L19 10.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M17 8L17 8.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M15 6L15 6.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M19 12L3 12" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></g></svg>`;
    readMore.append(readMoreLabel, arrow);

    cardMeta.append(title, readMore);
    article.append(cardMeta);

    const divider = document.createElement("hr");
    divider.className = "case-study-card-divider";
    article.append(divider);

    const footer = document.createElement("div");
    footer.className = "case-study-card-footer";

    const footerMeta = document.createElement("p");
    const metaParts = [study.year, study.role].filter(Boolean);
    footerMeta.textContent = metaParts.join(" · ");
    footerMeta.className = "case-study-card-footer-meta body-small";

    footer.append(footerMeta);
    article.append(footer);

    item.append(article);
    list.append(item);
  }

  container.append(list);
}

// ─── Case study view ──────────────────────────────────────────────────────────

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
  for (const tag of tags) list.append(createTag(tag));
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

function createBackNav() {
  const a = document.createElement("a");
  a.href = "/projects.html";
  a.className = "case-study-back";

  const icon = document.createElement("span");
  icon.className = "case-study-back-icon";
  icon.innerHTML = BACK_ICON_SVG;

  const h6 = document.createElement("h6");
  h6.textContent = "All projects";

  a.append(icon, h6);
  return a;
}

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

  const mediaCol = document.createElement("div");
  mediaCol.className = "case-study-media";

  if (data.featuredImage) {
    mediaCol.append(createFeaturedImage(data.featuredImage, data.title));
  }

  if (Array.isArray(data.imagesWithCaptions)) {
    for (const image of data.imagesWithCaptions) {
      if (image.src && image.caption) {
        mediaCol.append(createImageWithCaption(image));
      }
    }
  }

  body.append(contentCol, mediaCol);
  article.append(body);

  root.append(article);
  document.title = data.title ?? slug;
}

// ─── Init ─────────────────────────────────────────────────────────────────────

async function initProjectsPage() {
  initLayout({ currentPath: "/projects.html" });

  const slug = location.search.slice(1);

  if (slug) {
    const listSection = document.querySelector("[data-case-study-list]")?.closest("section");
    if (listSection) listSection.hidden = true;

    const root = document.querySelector("[data-case-study-root]");
    if (!root) return;
    try {
      const data = await fetchCaseStudy(decodeURIComponent(slug));
      renderCaseStudy(root, slug, data);
    } catch (error) {
      root.textContent = error.message;
    }
    return;
  }

  const listRoot = document.querySelector("[data-case-study-list]");
  if (!listRoot) return;
  try {
    const manifest = await fetchCaseStudyManifest();
    renderCaseStudyList(listRoot, manifest.caseStudies ?? []);
  } catch (error) {
    listRoot.textContent = error.message;
  }
}

initProjectsPage();
