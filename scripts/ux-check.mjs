import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const out = "/opt/cursor/artifacts/screenshots";
mkdirSync(out, { recursive: true });
const base = "https://brainy-horse-649.convex.site";
const email = `yard-ux-${Date.now()}@example.com`;
const password = "DemoYard123!";

const browser = await chromium.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const shot = async (name) => {
  const path = `${out}/${name}.png`;
  await page.screenshot({ path, fullPage: false });
  console.log("SHOT", path);
};

page.on("console", (msg) => {
  if (msg.type() === "error") console.log("CONSOLE ERR", msg.text());
});

await page.goto(`${base}/auth`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2000);

// Ensure signup mode
if (await page.getByRole("heading", { name: /Welcome back/i }).count()) {
  await page.getByRole("button", { name: /Create New Profile/i }).click();
  await page.waitForTimeout(400);
}

await page.getByLabel("First Name").fill("Demo");
await page.getByLabel("Last Name").fill("Owner");
await page.getByLabel("Organization").fill("YARD Buyers Co");
await page.locator('input[type="email"]').fill(email);
await page.locator('input[type="password"]').fill(password);
await shot("ux-auth-signup");

const icons = await page.evaluate(() =>
  [...document.querySelectorAll('link[rel*="icon"]')].map((l) => l.href),
);
console.log("favicon links", icons);

await page.getByRole("button", { name: /Create Account/i }).click();
await page.waitForURL((url) => !url.pathname.includes("/auth"), { timeout: 45000 }).catch(() => null);
await page.waitForTimeout(2000);
console.log("after signup URL", page.url());
await shot("ux-after-signup");

const err = await page.locator('[role="alert"]').textContent().catch(() => null);
if (err) console.log("AUTH ERROR", err);

if (page.url().includes("/auth")) {
  console.log("still on auth — aborting page checks");
  await browser.close();
  process.exit(1);
}

await page.goto(`${base}/inbox`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(4000);
await shot("ux-inbox-empty");
const body = await page.locator("body").innerText();
console.log("on inbox?", page.url());
console.log("empty-state count", await page.locator(".empty-state").count());
console.log("has Configure", body.includes("Configure AgentMail"));
console.log("has Waiting", /Waiting for supplier mail/i.test(body));

await page.goto(`${base}/dashboard`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(4000);
await shot("ux-dashboard");
const dash = await page.locator("body").innerText();
console.log("truncated?", dash.includes("public page p..."));
console.log("full note?", dash.includes("Amount quoted above the public page price"));
console.log("nothing waiting?", dash.includes("Nothing waiting"));
console.log("open settings?", dash.includes("Open Settings"));

// Favicon content-type + SVG mark
const fav = await page.evaluate(async () => {
  const href = document.querySelector('link[rel="icon"][type="image/svg+xml"]')?.getAttribute("href");
  if (!href) return { href: null };
  const res = await fetch(href);
  const text = await res.text();
  return { href, ok: res.ok, hasY: text.includes("L16.9 25.2") || text.includes("M7.6") };
});
console.log("favicon check", fav);

await browser.close();
console.log("email used", email);
