const LOGO = {
  href: "index.html",
  label: "Left hand",
};

const NAV_LINKS = [
  { href: "projects.html", label: "Projects" },
  { href: "about.html", label: "About" },
  { href: "contact.html", label: "Contact" },
];

function isNavLinkCurrent(href, currentPath) {
  const pathBase = currentPath.split("/").pop();
  if (href === pathBase) return true;

  if (href === "projects.html" && pathBase === "case-study.html") {
    return true;
  }

  return false;
}

function createLogo() {
  const logo = document.createElement("a");
  logo.href = LOGO.href;
  logo.textContent = LOGO.label;
  logo.setAttribute("aria-label", "Left hand, home");
  return logo;
}

function createNavToggle(nav) {
  const button = document.createElement("button");
  button.className = "nav-toggle";
  button.setAttribute("aria-label", "Open navigation");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", "primary-nav");

  for (let i = 0; i < 3; i++) {
    const line = document.createElement("span");
    line.setAttribute("aria-hidden", "true");
    button.append(line);
  }

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  return button;
}

function createNav(currentPath) {
  const nav = document.createElement("nav");
  nav.setAttribute("aria-label", "Primary");
  nav.id = "primary-nav";

  const list = document.createElement("ul");

  for (const link of NAV_LINKS) {
    const item = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.href = link.href;
    anchor.textContent = link.label;

    if (isNavLinkCurrent(link.href, currentPath)) {
      anchor.setAttribute("aria-current", "page");
    }

    item.append(anchor);
    list.append(item);
  }

  nav.append(list);
  return nav;
}

function createSiteHeader(currentPath) {
  const header = document.createElement("header");
  const nav = createNav(currentPath);
  header.append(createLogo(), createNavToggle(nav), nav);
  return header;
}

function createFooter() {
  const footer = document.createElement("footer");

  const divider = document.createElement("hr");
  divider.className = "footer-divider";

  const inner = document.createElement("div");
  inner.className = "footer-inner";

  const left = document.createElement("div");
  left.className = "footer-left";

  const iconsEl = document.createElement("div");
  iconsEl.className = "footer-icons";
  iconsEl.setAttribute("aria-hidden", "true");
  iconsEl.innerHTML = `
    <svg class="footer-icon-figma" width="12" height="18" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 24C6.21 24 8 22.21 8 20v-4H4a4 4 0 000 8z" fill="#0ACF83"/>
      <path d="M0 12c0-2.21 1.79-4 4-4h4v8H4a4 4 0 01-4-4z" fill="#A259FF"/>
      <path d="M0 4C0 1.79 1.79 0 4 0h4v8H4a4 4 0 01-4-4z" fill="#F24E1E"/>
      <path d="M8 0h4a4 4 0 010 8H8V0z" fill="#FF7262"/>
      <path d="M16 12a4 4 0 11-8 0 4 4 0 018 0z" fill="#1ABCFE"/>
    </svg>
    <span class="footer-icon footer-icon--yellow">✳</span>
  `;

  const tagline = document.createElement("p");
  tagline.className = "body-small";
  tagline.textContent = "Cooked, crafted and pontificated";

  const copyright = document.createElement("p");
  copyright.className = "footer-copyright body-small";
  copyright.textContent = "© 2026 Left Hand";

  left.append(iconsEl, tagline, copyright);

  const right = document.createElement("div");
  right.className = "footer-right";

  const socialLinks = [
    { label: "Behance", href: "https://behance.net" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ];

  for (const { label, href } of socialLinks) {
    const link = document.createElement("a");
    link.href = href;
    link.className = "footer-social";
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const h6 = document.createElement("h6");
    h6.textContent = label;

    const iconWrapper = document.createElement("span");
    iconWrapper.className = "footer-social-icon";
    iconWrapper.setAttribute("aria-hidden", "true");
    iconWrapper.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><g fill="none"><path d="M13 4H20V11" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/><path d="M18 6L18 6.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M16 8L16 8.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M14 10L14 10.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M12 12L12 12.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M10 14L10 14.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M8 16L8 16.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M6 18L6 18.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/><path d="M4 20L4 20.01" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></g></svg>`;

    link.append(h6, iconWrapper);
    right.append(link);
  }

  inner.append(left, right);
  footer.append(divider, inner);

  return footer;
}

export function initLayout({ currentPath = location.pathname } = {}) {
  const headerSlot = document.querySelector("[data-site-header]");
  const footerSlot = document.querySelector("[data-site-footer]");

  if (headerSlot) {
    headerSlot.replaceWith(createSiteHeader(currentPath));
  }

  if (footerSlot) {
    footerSlot.replaceWith(createFooter());
  }
}
