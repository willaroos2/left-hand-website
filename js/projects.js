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

// ─── Page header animation ────────────────────────────────────────────────────

function animatePageHeader() {
  const pageHeader = document.querySelector(".page-header");
  if (!pageHeader) return;
  const h1         = pageHeader.querySelector("h1");
  const subheading  = pageHeader.querySelector(".subheading");
  if (!h1) return;

  setTimeout(() => requestAnimationFrame(() => {
    const h1Rect        = h1.getBoundingClientRect();
    const containerRect = pageHeader.getBoundingClientRect();
    const W = Math.ceil(h1Rect.width);
    const H = Math.ceil(h1Rect.height);

    // Render the h1 text to an offscreen canvas to detect where glyphs are
    const computed      = getComputedStyle(h1);
    const fontSize      = parseFloat(computed.fontSize);
    const fontFamily    = computed.fontFamily;
    const fontWeight    = computed.fontWeight;
    const letterSpacing = computed.letterSpacing;
    const lineHeight    = parseFloat(computed.lineHeight) || fontSize;
    const text          = h1.textContent.trim();

    const probe = document.createElement("canvas");
    probe.width  = W;
    probe.height = H;
    const pCtx = probe.getContext("2d");
    pCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    if ("letterSpacing" in pCtx) pCtx.letterSpacing = letterSpacing;
    pCtx.textBaseline = "alphabetic";
    pCtx.fillStyle = "#ffffff";

    const ascent = pCtx.measureText("Hg").fontBoundingBoxAscent ?? (fontSize * 0.8);

    // Wrap text to match h1's layout
    function wrapText(str, maxW) {
      const words = str.split(" ");
      const lines = [];
      let line = "";
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (pCtx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
        else line = test;
      }
      if (line) lines.push(line);
      return lines;
    }

    const lines = wrapText(text, W);
    lines.forEach((line, i) => pCtx.fillText(line, 0, ascent + i * lineHeight));

    const pixels = pCtx.getImageData(0, 0, W, H).data;
    function hasGlyph(bx, by, bw, bh) {
      for (let sy = by; sy < Math.min(by + bh, H); sy += 2)
        for (let sx = bx; sx < Math.min(bx + bw, W); sx += 2)
          if (pixels[(sy * W + sx) * 4 + 3] > 30) return true;
      return false;
    }

    // Reveal h1 and canvas in the same frame so there's no flash
    h1.style.opacity = "";

    const canvas = document.createElement("canvas");
    canvas.width  = W;
    canvas.height = H;
    canvas.style.cssText = `position:absolute;left:${Math.round(h1Rect.left - containerRect.left)}px;top:${Math.round(h1Rect.top - containerRect.top)}px;width:${W}px;height:${H}px;pointer-events:none;`;
    pageHeader.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const BG  = "#ffffff";

    // Place blocks only where letter pixels exist
    const SIZES   = [8, 12, 16, 20, 24];
    const pick    = () => SIZES[Math.floor(Math.random() * SIZES.length)];
    const DENSITY = 0.6;
    const GRID    = 16;

    const blocks = [];
    for (let y = 0; y < H; y += GRID) {
      for (let x = 0; x < W; x += GRID) {
        if (!hasGlyph(x, y, GRID, GRID)) continue;
        if (Math.random() > DENSITY) continue;
        const w = Math.min(pick(), W - x);
        const h = Math.min(pick(), H - y);
        const removeAt = Math.max(0, Math.min(1,
          (y / H) + (Math.random() - 0.5) * 0.18
        ));
        blocks.push({ x, y, w, h, removeAt });
      }
    }

    // Draw all blocks immediately so h1 is covered on first paint
    ctx.fillStyle = BG;
    for (const b of blocks) ctx.fillRect(b.x, b.y, b.w, b.h);

    const DURATION = 900;
    let startTime  = null;

    function draw(ts) {
      if (!startTime) startTime = ts;
      const t = Math.min((ts - startTime) / DURATION, 1);

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = BG;

      let anyVisible = false;
      for (const b of blocks) {
        if (t < b.removeAt) {
          ctx.fillRect(b.x, b.y, b.w, b.h);
          anyVisible = true;
        }
      }

      if (!anyVisible || t >= 1) {
        canvas.remove();
        if (subheading) setTimeout(() => { subheading.style.opacity = "1"; }, 200);
        return;
      }
      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }), 400);
}

// ─── Init ─────────────────────────────────────────────────────────────────────

async function initProjectsPage() {
  initLayout({ currentPath: "projects.html" });

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

  animatePageHeader();

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
