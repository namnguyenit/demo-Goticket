import path from "node:path";
import { fileURLToPath } from "node:url";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import ejs from "ejs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const legacyFrontDist = path.join(root, "legacy", "front-end", "dist");
const legacyAdminDist = path.join(root, "legacy", "admin-dashboard", "dist");
const legacyVendorRoot = path.join(root, "legacy", "vendor-front-end");
const legacyVendorViews = path.join(legacyVendorRoot, "views");
const legacyVendorPublic = path.join(legacyVendorRoot, "public");

const publicRoot = path.join(root, "public");
const mirrorRoot = path.join(publicRoot, "mirror");

async function ensureDir(dirPath) {
  await mkdir(dirPath, { recursive: true });
}

async function copyDir(src, dest) {
  await cp(src, dest, { recursive: true, force: true });
}

function rewriteVendorHtml(html) {
  let nextHtml = html;

  // Keep vendor pages under /vendor/* while preserving original template source files unchanged.
  nextHtml = nextHtml.replace(/href="\/(?!public\/|vendor\/|\/)/g, 'href="/vendor/');
  nextHtml = nextHtml.replace(/if\(location\.pathname !== '\/login'\)/g, "if(location.pathname !== '/vendor/login')");
  nextHtml = nextHtml.replace(/location\.href = '\/login'/g, "location.href = '/vendor/login'");
  nextHtml = nextHtml.replaceAll("http://127.0.0.1:8000/api", "/api");

  return nextHtml;
}

async function patchLegacyAssetJsUrls() {
  const assetsPath = path.join(publicRoot, "assets");
  let entries = [];
  try {
    entries = await readdir(assetsPath, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".js")) {
      continue;
    }

    const filePath = path.join(assetsPath, entry.name);
    const content = await readFile(filePath, "utf8");
    const patched = content
      .replace(/http:\/\/127\.0\.0\.1:8000\/api/g, "/api")
      .replace(/http:\/\/127\.0\.0\.1:8000/g, "");
    if (patched !== content) {
      await writeFile(filePath, patched, "utf8");
    }
  }
}

async function prepareFrontAndAdmin() {
  const frontMirror = path.join(mirrorRoot, "front");
  const adminMirror = path.join(mirrorRoot, "admin");
  const rootAssets = path.join(publicRoot, "assets");

  await ensureDir(frontMirror);
  await ensureDir(adminMirror);
  await ensureDir(rootAssets);

  await copyDir(path.join(legacyFrontDist, "assets"), rootAssets);
  await copyDir(path.join(legacyAdminDist, "assets"), rootAssets);

  await copyDir(path.join(legacyFrontDist, "HomePage"), path.join(publicRoot, "HomePage"));

  for (const fileName of ["welcome.jpg", "book-page-bg.jpg", "logo.png", "trip-logo.png"]) {
    await copyDir(path.join(legacyFrontDist, fileName), path.join(publicRoot, fileName));
  }

  await copyDir(path.join(legacyAdminDist, "vite.svg"), path.join(publicRoot, "vite.svg"));

  await copyDir(path.join(legacyFrontDist, "index.html"), path.join(frontMirror, "index.html"));
  await copyDir(path.join(legacyAdminDist, "index.html"), path.join(adminMirror, "index.html"));

  await patchLegacyAssetJsUrls();
}

async function renderVendorPage(viewName, outputRelativePath, title, currentPath, requireAuth) {
  const viewPath = path.join(legacyVendorViews, `${viewName}.ejs`);
  const outPath = path.join(publicRoot, outputRelativePath);

  await ensureDir(path.dirname(outPath));

  const html = await ejs.renderFile(
    viewPath,
    {
      title,
      currentPath,
      requireAuth,
    },
    {
      views: [legacyVendorViews],
      root: legacyVendorViews,
      filename: viewPath,
    },
  );

  await writeFile(outPath, rewriteVendorHtml(html), "utf8");
}

async function prepareVendor() {
  const vendorPublicStaticRoot = path.join(publicRoot, "public");
  await ensureDir(vendorPublicStaticRoot);
  await copyDir(legacyVendorPublic, vendorPublicStaticRoot);

  const apiJsPath = path.join(vendorPublicStaticRoot, "js", "api.js");
  const apiJs = await readFile(apiJsPath, "utf8");
  const patchedApiJs = apiJs
    .replace(/http:\/\/127\.0\.0\.1:8000\/api/g, "/api")
    .replace(/location\.pathname !== '\/login'/g, "location.pathname !== '/vendor/login'")
    .replace(/location\.href = '\/login'/g, "location.href = '/vendor/login'");
  await writeFile(apiJsPath, patchedApiJs, "utf8");

  await renderVendorPage("dashboard", path.join("vendor", "index.html"), "Tong quat", "/", true);
  await renderVendorPage("tickets", path.join("vendor", "tickets", "index.html"), "Tao ve", "/tickets", true);
  await renderVendorPage(
    "manage-bookings",
    path.join("vendor", "manage-bookings", "index.html"),
    "Quan ly ve",
    "/manage-bookings",
    true,
  );
  await renderVendorPage("transfers", path.join("vendor", "transfers", "index.html"), "Quan ly trung chuyen", "/transfers", true);
  await renderVendorPage("vehicles", path.join("vendor", "vehicles", "index.html"), "Quan ly xe", "/vehicles", true);
  await renderVendorPage("settings", path.join("vendor", "settings", "index.html"), "Cai dat", "/settings", false);
  await renderVendorPage("login", path.join("vendor", "login", "index.html"), "Dang nhap", "/login", false);
}

async function main() {
  await rm(mirrorRoot, { recursive: true, force: true });
  await rm(path.join(publicRoot, "vendor"), { recursive: true, force: true });

  await prepareFrontAndAdmin();
  await prepareVendor();

  console.log("Prepared legacy UIs into /public successfully.");
}

main().catch((error) => {
  console.error("Failed to prepare legacy UIs:", error);
  process.exit(1);
});
