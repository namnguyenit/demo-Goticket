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

function injectFrontLoginHelper(html) {
  const helperScript = `
<script>
(function () {
  const DEMO_ACCOUNTS = [
    { label: 'Customer', email: 'customer@demo.local' },
    { label: 'Admin', email: 'admin@demo.local' },
    { label: 'Vendor', email: 'vendor@demo.local' }
  ];

  function ensureHelper() {
    if (window.location.pathname !== '/sign-in') return;

    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    if (!emailInput || !passwordInput) return;
    if (document.getElementById('demo-account-helper')) return;

    const host = emailInput.parentElement || emailInput;
    if (getComputedStyle(host).position === 'static') {
      host.style.position = 'relative';
    }

    const helper = document.createElement('div');
    helper.id = 'demo-account-helper';
    helper.style.marginTop = '8px';
    helper.style.border = '1px solid #ead7b2';
    helper.style.borderRadius = '10px';
    helper.style.background = '#fff9eb';
    helper.style.padding = '10px';
    helper.style.fontSize = '13px';

    const title = document.createElement('div');
    title.textContent = 'Tai khoan demo (cham vao o user de chon):';
    title.style.fontWeight = '700';
    title.style.marginBottom = '8px';
    helper.appendChild(title);

    const passHint = document.createElement('div');
    passHint.textContent = 'Mat khau demo: 123456';
    passHint.style.color = '#5b2642';
    passHint.style.fontWeight = '700';
    passHint.style.marginBottom = '8px';
    helper.appendChild(passHint);

    const list = document.createElement('div');
    list.style.display = 'none';
    list.style.gap = '6px';
    list.style.flexDirection = 'column';

    DEMO_ACCOUNTS.forEach(function (account) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = account.label + ': ' + account.email;
      btn.style.width = '100%';
      btn.style.textAlign = 'left';
      btn.style.border = '1px solid #e0d0aa';
      btn.style.borderRadius = '8px';
      btn.style.padding = '8px';
      btn.style.background = '#ffffff';
      btn.style.cursor = 'pointer';

      btn.addEventListener('click', function () {
        function setControlledValue(input, value) {
          const proto = Object.getPrototypeOf(input);
          const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
          if (descriptor && descriptor.set) {
            descriptor.set.call(input, value);
          } else {
            input.value = value;
          }
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }

        setControlledValue(emailInput, account.email);
        setControlledValue(passwordInput, '123456');

        const form = emailInput.closest('form');
        setTimeout(function () {
          if (!form) return;
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
          const notPrevented = form.dispatchEvent(submitEvent);
          if (notPrevented && typeof form.requestSubmit === 'function') {
            form.requestSubmit();
          }
        }, 200);
      });

      list.appendChild(btn);
    });

    helper.appendChild(list);
    host.insertAdjacentElement('afterend', helper);

    function openList() {
      list.style.display = 'flex';
    }

    emailInput.addEventListener('focus', openList);
    emailInput.addEventListener('click', openList);
  }

  const observer = new MutationObserver(function () {
    ensureHelper();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  ensureHelper();
})();
</script>`;

  if (html.includes('demo-account-helper')) {
    return html;
  }

  return html.replace('</body>', `${helperScript}</body>`);
}

function injectRoleLandingRedirect(html) {
  const redirectScript = `
<script>
(function () {
  function getRawAuthToken() {
    const raw = localStorage.getItem('Authorisation') || '';
    return String(raw).replace(/^Bearer\s+/i, '').trim();
  }

  function getRoleFromToken(token) {
    if (!token) return null;
    const parts = token.split('-');
    return parts.length >= 4 ? parts[2] : null;
  }

  function syncRoleTokenStores(role, token) {
    if (!role || !token) return;
    if (role === 'vendor') {
      localStorage.setItem('API_TOKEN', token);
      localStorage.setItem('API_BASE_URL', '/api');
    }
    if (role === 'admin') {
      localStorage.setItem('authToken', token);
    }
  }

  if (!window.__roleRedirectPatched) {
    window.__roleRedirectPatched = true;
    const originalSetItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function (key, value) {
      if (key === 'Authorisation') {
        const token = String(value || '').replace(/^Bearer\s+/i, '').trim();
        const role = getRoleFromToken(token);
        if (role === 'admin' || role === 'vendor') {
          sessionStorage.setItem('force_role_redirect_once', role);
        }
        syncRoleTokenStores(role, token);
      }
      return originalSetItem(key, value);
    };
  }

  // If already logged-in vendor from user UI, keep vendor auth storage in sync.
  const existingToken = getRawAuthToken();
  const existingRole = getRoleFromToken(existingToken);
  if ((existingRole === 'vendor' || existingRole === 'admin') && existingToken) {
    syncRoleTokenStores(existingRole, existingToken);
  }

  const path = window.location.pathname;
  if (path === '/') {
    const pendingRole = sessionStorage.getItem('force_role_redirect_once');
    if (pendingRole === 'admin' || pendingRole === 'vendor') {
      sessionStorage.removeItem('force_role_redirect_once');
      window.location.replace(pendingRole === 'admin' ? '/dashboard' : '/vendor');
    }
  }
})();
</script>`;

  if (html.includes('getRoleFromAuthStorage')) {
    return html;
  }

  return html.replace('</body>', `${redirectScript}</body>`);
}

function injectRoleAdminNavButton(html) {
  const navScript = `
<script>
(function () {
  function getRawAuthToken() {
    const raw = localStorage.getItem('Authorisation') || '';
    return String(raw).replace(/^Bearer\s+/i, '').trim();
  }

  function getRoleFromAuthStorage() {
    const token = getRawAuthToken();
    if (!token) return null;
    const parts = token.split('-');
    return parts.length >= 4 ? parts[2] : null;
  }

  function syncRoleTokenStores(role, token) {
    if (!role || !token) return;
    if (role === 'vendor') {
      localStorage.setItem('API_TOKEN', token);
      localStorage.setItem('API_BASE_URL', '/api');
    }
    if (role === 'admin') {
      localStorage.setItem('authToken', token);
    }
  }

  function ensureAdminButton() {
    const role = getRoleFromAuthStorage();
    if (role !== 'admin' && role !== 'vendor') {
      const old = document.getElementById('role-admin-nav-btn');
      if (old) old.remove();
      return;
    }

    const path = window.location.pathname;
    if (path === '/sign-in' || path === '/sign-up') return;

    const token = getRawAuthToken();
    if (token && (role === 'vendor' || role === 'admin')) {
      syncRoleTokenStores(role, token);
    }

    const homeLink = document.querySelector('a[href="/"]');
    const bookLink = document.querySelector('a[href="/book"]');
    const navContainer = (bookLink && bookLink.parentElement) || (homeLink && homeLink.parentElement);
    if (!navContainer) return;

    let btnWrap = document.getElementById('role-admin-nav-btn');
    if (btnWrap) {
      const targetLink = btnWrap.querySelector('a');
      if (targetLink) {
        targetLink.setAttribute('href', role === 'admin' ? '/dashboard' : '/vendor');
      }
      return;
    }

    const sampleLink = bookLink || homeLink;
    const sampleClass = sampleLink ? sampleLink.className : '';

    btnWrap = document.createElement('a');
    btnWrap.id = 'role-admin-nav-btn';
    btnWrap.href = role === 'admin' ? '/dashboard' : '/vendor';
    btnWrap.textContent = 'Trang quan tri';
    if (sampleClass) {
      btnWrap.className = sampleClass;
    } else {
      btnWrap.style.padding = '8px 12px';
      btnWrap.style.borderRadius = '8px';
      btnWrap.style.background = '#f7ac3d';
      btnWrap.style.color = '#5b2642';
      btnWrap.style.fontWeight = '700';
      btnWrap.style.textDecoration = 'none';
    }

    navContainer.appendChild(btnWrap);

    btnWrap.addEventListener('click', function () {
      const latestRole = getRoleFromAuthStorage();
      const latestToken = getRawAuthToken();
      if (latestToken && (latestRole === 'vendor' || latestRole === 'admin')) {
        syncRoleTokenStores(latestRole, latestToken);
      }
    });
  }

  const observer = new MutationObserver(function () {
    ensureAdminButton();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  ensureAdminButton();
})();
</script>`;

  if (html.includes('role-admin-nav-btn')) {
    return html;
  }

  return html.replace('</body>', `${navScript}</body>`);
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

  const frontIndexPath = path.join(frontMirror, "index.html");
  const frontIndex = await readFile(frontIndexPath, "utf8");
  const withLoginHelper = injectFrontLoginHelper(frontIndex);
  const withRoleRedirect = injectRoleLandingRedirect(withLoginHelper);
  const withRoleButton = injectRoleAdminNavButton(withRoleRedirect);
  await writeFile(frontIndexPath, withRoleButton, "utf8");

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
