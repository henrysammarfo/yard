/**
 * Full YARD feature run + spine exercise for All Gas submission.
 * Signs up, walks marketing + CRM, configures inbox, submits portal quotes,
 * triggers AgentMail inbound, approves a match, and writes a JSON report.
 */
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const out = "/opt/cursor/artifacts/screenshots";
const reportPath = "/opt/cursor/artifacts/full-feature-report.json";
mkdirSync(out, { recursive: true });
mkdirSync("/opt/cursor/artifacts/demo-video", { recursive: true });

const base = "https://brainy-horse-649.convex.site";
const stamp = Date.now();
const email = `yard-full-${stamp}@example.com`;
const password = "DemoYard123!";
const PAGE_URL =
  "https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html";
const INBOX_ID = "yard-allgas@agentmail.to";

function amKey() {
  return execSync("npx convex env get AGENTMAIL_API_KEY --prod", {
    encoding: "utf8",
    env: { ...process.env, CONVEX_OVERRIDE_ACCESS_TOKEN: "" },
  }).trim();
}

const report = {
  email,
  startedAt: new Date().toISOString(),
  pages: {},
  spine: {},
  bugs: [],
  ok: true,
};

const browser = await chromium.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: "/opt/cursor/artifacts/demo-video", size: { width: 1440, height: 900 } },
});
const page = await context.newPage();
const shot = async (name) => {
  const path = `${out}/full-${name}.png`;
  await page.screenshot({ path, fullPage: false });
  console.log("SHOT", path);
  return path;
};
const note = (k, v) => {
  report.pages[k] = v;
  console.log("PAGE", k, v);
};
const bug = (msg) => {
  report.bugs.push(msg);
  report.ok = false;
  console.log("BUG", msg);
};

page.on("console", (msg) => {
  if (msg.type() === "error") console.log("CONSOLE ERR", msg.text().slice(0, 200));
});

async function signup() {
  await page.goto(`${base}/auth`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1500);
  if (await page.getByRole("heading", { name: /Welcome back/i }).count()) {
    await page.getByRole("button", { name: /Create New Profile/i }).click();
    await page.waitForTimeout(400);
  }
  await page.getByLabel("First Name").fill("Full");
  await page.getByLabel("Last Name").fill("Demo");
  await page.getByLabel("Organization").fill("YARD Full Demo Co");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole("button", { name: /Create Account/i }).click();
  await page.waitForURL((u) => !u.pathname.includes("/auth"), { timeout: 45000 });
  note("signup", { url: page.url(), ok: !page.url().includes("/auth") });
  await shot("01-after-signup");
}

async function walkMarketing() {
  const routes = [
    "/",
    "/how-it-works",
    "/projects",
    "/plans",
    "/team",
    "/faqs",
    "/contact",
    "/about",
    "/help",
    "/hackathon",
    "/security",
  ];
  for (const r of routes) {
    await page.goto(`${base}${r}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(800);
    const title = await page.title();
    const body = await page.locator("body").innerText();
    const ok = body.length > 40 && !/something went wrong|error boundary/i.test(body);
    note(`mkt:${r}`, { title, ok, len: body.length });
    if (!ok) bug(`Marketing ${r} looks broken`);
  }
  await shot("02-home");
}

async function walkCrm() {
  const routes = [
    "/dashboard",
    "/inbox",
    "/board",
    "/approvals",
    "/suppliers",
    "/materials",
    "/orders",
    "/activity",
    "/workspace-team",
    "/settings",
    "/supplier-portal",
  ];
  for (const r of routes) {
    await page.goto(`${base}${r}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(2000);
    const url = page.url();
    const body = await page.locator("body").innerText();
    const bounced = url.includes("/auth");
    const ok = !bounced && body.length > 40;
    note(`crm:${r}`, { url, ok, snippet: body.slice(0, 120).replace(/\s+/g, " ") });
    if (!ok) bug(`CRM ${r} failed (bounced=${bounced})`);
  }
  await shot("03-dashboard");
}

async function configureInbox() {
  await page.goto(`${base}/settings`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  await page.getByRole("button", { name: /^Inbox$/i }).click();
  await page.waitForTimeout(500);
  await page.locator('input[placeholder*="inbox" i]').fill(INBOX_ID);
  await page.getByRole("button", { name: /Save|Link|Update/i }).first().click();
  await page.waitForTimeout(1500);
  await shot("04-settings-inbox");
  note("settings-inbox", { filled: INBOX_ID });
}

async function addMaterial() {
  await page.goto(`${base}/materials`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  await page.locator('input[name="name"]').fill("Demo Attic Book");
  await page.locator('input[name="category"]').fill("Demo");
  await page.locator('input[name="unit"]').fill("copy");
  await page.locator('input[name="url"]').fill(PAGE_URL);
  await page.getByRole("button", { name: /Add material/i }).click();
  await page.waitForTimeout(2000);
  const body = await page.locator("body").innerText();
  const ok = /Demo Attic Book|Material saved/i.test(body);
  note("materials-add", { ok });
  if (!ok) bug("Material add did not show in UI");
  await shot("05-materials");
}

async function submitPortalQuotes() {
  await page.goto(`${base}/supplier-portal`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  // Match path: quote below typical page price (~51.77)
  await page.locator('input[name="material"]').fill("A Light in the Attic");
  await page.locator('input[name="spec"]').fill("Paperback · books.toscrape");
  await page.locator('input[name="qty"]').fill("2 copies");
  await page.locator('input[name="price"]').fill("40");
  await page.locator('input[name="url"]').fill(PAGE_URL);
  await page.getByRole("button", { name: /Submit for Firecrawl/i }).click();
  await page.waitForTimeout(2500);
  await shot("06-portal-matched-submit");

  // High path: quote above page
  await page.locator('input[name="material"]').fill("A Light in the Attic HIGH");
  await page.locator('input[name="spec"]').fill("Overquoted unit");
  await page.locator('input[name="qty"]').fill("1 copy");
  await page.locator('input[name="price"]').fill("99.5");
  await page.locator('input[name="url"]').fill(PAGE_URL);
  await page.getByRole("button", { name: /Submit for Firecrawl/i }).click();
  await page.waitForTimeout(2500);
  note("portal-submit", { ok: true });
}

async function sendInboundMail() {
  const key = amKey();
  const body = [
    "Quote for A Light in the Attic",
    "Quantity: 3 copies",
    "Unit price: $99.00 per copy",
    `Product page: ${PAGE_URL}`,
    "Please confirm PO.",
  ].join("\n");
  const res = await fetch(
    `https://api.agentmail.to/v0/inboxes/yard-supplier-demo@agentmail.to/messages/send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: [INBOX_ID],
        subject: "Quote — A Light in the Attic @ $99.00",
        text: body,
      }),
    },
  );
  const json = await res.json();
  report.spine.mailSend = { status: res.status, json };
  console.log("MAIL SEND", res.status, JSON.stringify(json).slice(0, 300));
  if (!res.ok) bug(`AgentMail send failed: ${res.status}`);
}

async function waitForQuotes(timeoutMs = 120000) {
  const start = Date.now();
  let last = [];
  while (Date.now() - start < timeoutMs) {
    await page.goto(`${base}/board`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);
    const body = await page.locator("body").innerText();
    const statuses = [];
    for (const s of ["Matched", "Approved", "Needs info", "Rejected", "Review", "Countered"]) {
      if (body.includes(s)) statuses.push(s);
    }
    last = statuses;
    const hasQuote = /QT-|A Light in the Attic|Demo Attic/i.test(body);
    console.log("BOARD poll", { hasQuote, statuses, secs: Math.round((Date.now() - start) / 1000) });
    report.spine.board = { hasQuote, statuses, bodySnippet: body.slice(0, 400) };
    if (hasQuote && (statuses.includes("Matched") || statuses.includes("Needs info") || statuses.includes("Approved"))) {
      break;
    }
    await page.waitForTimeout(8000);
  }
  await shot("07-board-after-spine");
  if (!last.length) bug("No terminal quote statuses appeared on board");
}

async function approveFirstMatched() {
  await page.goto(`${base}/board`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  const link = page.locator('a[href*="/quotes/"]').first();
  if (!(await link.count())) {
    bug("No quote detail link on board");
    return;
  }
  await link.click();
  await page.waitForTimeout(2000);
  await shot("08-quote-detail");
  const approve = page.getByRole("button", { name: /Approve|Create order|PO/i });
  if (await approve.count()) {
    await approve.first().click();
    await page.waitForTimeout(2500);
    note("approve", { ok: true, url: page.url() });
  } else {
    // try Approvals page
    await page.goto(`${base}/approvals`);
    await page.waitForTimeout(2000);
    const btn = page.getByRole("button", { name: /Approve/i });
    if (await btn.count()) {
      await btn.first().click();
      await page.waitForTimeout(2000);
      note("approve", { ok: true, via: "approvals" });
    } else {
      bug("Could not find Approve action");
    }
  }
  await page.goto(`${base}/orders`);
  await page.waitForTimeout(2000);
  const orders = await page.locator("body").innerText();
  note("orders", { hasPo: /PO-|purchase|Confirmed/i.test(orders) });
  await shot("09-orders");
  await page.goto(`${base}/activity`);
  await page.waitForTimeout(2000);
  await shot("10-activity");
  note("activity", { ok: true });
}

async function checkIntegrations() {
  await page.goto(`${base}/settings`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: /Integrations/i }).click();
  await page.waitForTimeout(1000);
  const body = await page.locator("body").innerText();
  note("integrations", {
    agentmail: /AgentMail|configured|live/i.test(body),
    firecrawl: /Firecrawl/i.test(body),
    snippet: body.slice(0, 500),
  });
  await shot("11-integrations");
}

try {
  await signup();
  // Stay authenticated for CRM first (marketing would lose session? no - same origin)
  await walkCrm();
  await configureInbox();
  await checkIntegrations();
  await addMaterial();
  await submitPortalQuotes();
  await sendInboundMail();
  await waitForQuotes(150000);
  await approveFirstMatched();
  await walkMarketing();
  await page.goto(`${base}/dashboard`);
  await page.waitForTimeout(2500);
  await shot("12-dashboard-final");
} catch (err) {
  bug(err instanceof Error ? err.message : String(err));
  await shot("99-error");
}

report.finishedAt = new Date().toISOString();
writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log("REPORT", reportPath, "ok=", report.ok, "bugs=", report.bugs);

const video = await page.video()?.path();
await context.close();
await browser.close();
if (video) console.log("VIDEO_RAW", video);
