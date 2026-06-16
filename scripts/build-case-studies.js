import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const contentDir = join(root, "content", "case-studies");
const dataDir = join(root, "data");

/**
 * Scans content/case-studies/*.json and writes data/case-studies.json.
 * Run this after adding or updating a case study file.
 */
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

  console.log(`Built manifest with ${caseStudies.length} case study/studies.`);
}

buildCaseStudiesManifest().catch((error) => {
  console.error(error);
  process.exit(1);
});
