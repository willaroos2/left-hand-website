const MANIFEST_URL = "/data/case-studies.json";
const CONTENT_BASE = "/content/case-studies";

export async function fetchCaseStudyManifest() {
  const response = await fetch(MANIFEST_URL);

  if (!response.ok) {
    throw new Error(`Failed to load case study manifest (${response.status})`);
  }

  return response.json();
}

export async function fetchCaseStudy(slug) {
  const response = await fetch(`${CONTENT_BASE}/${slug}.json`);

  if (!response.ok) {
    throw new Error(`Case study not found (${response.status})`);
  }

  return response.json();
}

export function caseStudyUrl(slug) {
  return `/projects?${encodeURIComponent(slug)}`;
}
