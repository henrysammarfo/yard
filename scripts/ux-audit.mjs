/**
 * Visual audit: sign up, screenshot every CRM + key marketing page, flag empty/broken patterns.
 */
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";

const out = "/opt/cursor/artifacts/screenshots/ux-audit";
mkdirSync(out, { recursive: true });
const base = "https://brainy-horse-649.convex.site";
const email = `yard-audit-${Date.now()}@example.com`;
const password = "DemoYard123!";

const browser = await chromium.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const findings = [];

page.on("console", (msg) => {
  if (msg.type() === "error") findings.push({ type: "console", text: msg.text().slice(0, 240) });
});

const shot = async (name) => {
  const path = `${out}/${name}.png`;
  await page.screenshot({ path, fullPage: false });
  return path;
};

const audit = async (name, path) => {
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1800);
  const body = await page.locator("body").innerText();
  const html = await page.content();
  const issues = [];
  if (/Cannot read properties|something went wrong|Error:/i.test(body)) issues.push("error text visible");
  if (/OWNERUnassigned|CONFIDENCE\d/i.test(body.replace(/\s+/g, ""))) issues.push("label/value mashed");
  if (body.includes("…") || body.includes("...")) {
    // check metric truncation patterns
    if (/public page p\.\.\.|Quoted above public page p/i.test(body)) issues.push("metric truncated");
  }
  const emptyTopLeft =
    (await page.locator(".empty-state").count()) === 0 &&
    /Waiting for supplier mail|No quotes|No activity|No suppliers|No purchase|No tracked/i.test(body) &&
    !/empty-state|Configure AgentMail|Open Settings|Add material/i.test(html);
  if (emptyTopLeft) issues.push("sparse/legacy empty copy without EmptyState");
  // overflow / ellipsis on metrics
  const clipped = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll(".metric small, .metric > small, td, .evidence-url, .quote-side strong").forEach((el) => {
      const s = getComputedStyle(el);
      if (s.textOverflow === "ellipsis" && el.scrollWidth > el.clientWidth + 2) {
        bad.push(el.textContent?.slice(0, 60) || "clipped");
      }
    });
    return bad.slice(0, 5);
  });
  if (clipped.length) issues.push(`clipped: ${clipped.join(" | ")}`);
  await shot(name);
  findings.push({ page: path, issues, title: await page.title(), len: body.length });
  console.log(path, issues.length ? issues.join("; ") : "ok");
};

await page.goto(`${base}/auth`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1500);
if (await page.getByRole("heading", { name: /Welcome back/i }).count()) {
  await page.getByRole("button", { name: /Create New Profile/i }).click();
  await page.waitForTimeout(400);
}
await page.getByLabel("First Name").fill("Audit");
await page.getByLabel("Last Name").fill("User");
await page.getByLabel("Organization").fill("YARD Audit Co");
await page.locator('input[type="email"]').fill(email);
await page.locator('input[type="password"]').fill(password);
await shot("00-auth");
// check placeholder contrast
const ph = await page.evaluate(() => {
  const input = document.querySelector('input[placeholder="Ama"], input[id="first-name"]');
  if (!input) return null;
  const cs = getComputedStyle(input, "::placeholder");
  return { color: cs.color, bg: getComputedStyle(input).backgroundColor };
});
findings.push({ page: "/auth", placeholder: ph });
await page.getByRole("button", { name: /Create Account/i }).click();
await page.waitForURL((u) => !u.pathname.includes("/auth"), { timeout: 45000 }).catch(() => null);
await page.waitForTimeout(2000);

const crm = [
  ["/dashboard", "01-dashboard"],
  ["/inbox", "02-inbox"],
  ["/board", "03-board"],
  ["/approvals", "04-approvals"],
  ["/suppliers", "05-suppliers"],
  ["/materials", "06-materials"],
  ["/orders", "07-orders"],
  ["/activity", "08-activity"],
  ["/workspace-team", "09-team"],
  ["/settings", "10-settings"],
  ["/supplier-portal", "11-portal"],
];
for (const [path, name] of crm) await audit(name, path);

// settings tabs
await page.goto(`${base}/settings`);
await page.waitForTimeout(1000);
await page.getByRole("button", { name: /^Inbox$/i }).click();
await page.waitForTimeout(500);
await shot("10b-settings-inbox");
await page.getByRole("button", { name: /Integrations/i }).click();
await page.waitForTimeout(500);
await shot("10c-settings-integrations");

const mkt = ["/", "/how-it-works", "/plans", "/hackathon", "/contact"];
for (const [i, path] of mkt.entries()) await audit(`mkt-${i}`, path);

writeFileSync(`${out}/report.json`, JSON.stringify({ email, findings }, null, 2));
console.log("REPORT", `${out}/report.json`);
await browser.close();
