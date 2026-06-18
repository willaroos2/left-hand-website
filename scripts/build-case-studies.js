import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const contentDir = join(root, "content", "case-studies");
const dataDir = join(root, "data");
const projectsDir = join(root, "projects");

function caseStudyPageHtml(title) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <base href="../../">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="icon" type="image/x-icon" href="favicons/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicons/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="favicons/favicon-180x180.png">
    <link rel="stylesheet" href="css/styles.css">
    <script type="module" src="js/case-study.js"></script>
  </head>
  <body>
    <div data-site-header></div>
    <main id="main-content">
      <div data-case-study-root aria-live="polite"></div>
    </main>
    <div data-site-footer></div>
  </body>
</html>
`;
}

async function buildCaseStudiesManifest() {
  await mkdir(dataDir, { recursive: true });

  let files;
  try {
    files = (await readdir(contentDir)).filter(
      (name) => name.endsWith(".json") && !name.endsWith(".schema.json") && !name.startsWith("_")
    );
  } catch {
    files = [];
  }

  const caseStudies = [];

  for (const file of files) {
    const slug = file.replace(/\.json$/, "");
    const raw = await readFile(join(contentDir, file), "utf8");
    const data = JSON.parse(raw);

    caseStudies.push({
      slug,
      title: data.title ?? slug,
      shortTitle: data.shortTitle ?? "",
      organisation: data.organisation ?? "",
      year: data.year ?? "",
      role: data.role ?? "",
      tags: data.tags ?? [],
      featuredImage: data.featuredImage ?? "",
    });
  }

  caseStudies.sort((a, b) => a.title.localeCompare(b.title));

  const manifest = {
    generatedAt: new Date().toISOString(),
    caseStudies,
  };

  await writeFile(
    join(dataDir, "case-studies.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );

  for (const { slug, title } of caseStudies) {
    const pageDir = join(projectsDir, slug);
    await mkdir(pageDir, { recursive: true });
    await writeFile(join(pageDir, "index.html"), caseStudyPageHtml(title), "utf8");
  }

  console.log(`Built manifest and ${caseStudies.length} case study page(s).`);
}

buildCaseStudiesManifest().catch((error) => {
  console.error(error);
  process.exit(1);
});
