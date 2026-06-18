import { fetchCaseStudy } from "./case-studies.js";
import { initLayout } from "./layout.js";

function getSlugFromQuery() {
  return new URLSearchParams(location.search).get("slug");
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

async function initCaseStudyPage() {
  initLayout({ currentPath: "case-study.html" });

  const root = document.querySelector("[data-case-study-root]");
  const slug = getSlugFromQuery();

  if (!root) return;

  if (!slug) {
    root.textContent = "Missing case study slug.";
    return;
  }

  try {
    const data = await fetchCaseStudy(slug);
    renderCaseStudy(root, slug, data);
  } catch (error) {
    root.textContent = error.message;
  }
}

initCaseStudyPage();
