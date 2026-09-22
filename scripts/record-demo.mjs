/**
 * Short submission demo (≤3 min): home → auth → board spine → quote counter → activity.
 */
import { chromium } from "playwright-core";
import { mkdirSync, copyFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

const base = "https://brainy-horse-649.convex.site";
const outDir = "/opt/cursor/artifacts/demo-video";
mkdirSync(outDir, { recursive: true });
mkdirSync("/opt/cursor/artifacts/screenshots", { recursive: true });

const email = `yard-demo-submit-${Date.now()}@example.com`;
const password = "DemoYard123!";
const PAGE_URL =
  "https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html";

function amKey() {
  return execSync("npx convex env get AGENTMAIL_API_KEY --prod", {
    encoding: "utf8",
    env: { ...process.env, CONVEX_OVERRIDE_ACCESS_TOKEN: "" },
  }).trim();
}

const browser = await chromium.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: outDir, size: { width: 1440, height: 900 } },
});
const page = await context.newPage();
const pause = (ms) => page.waitForTimeout(ms);
const shot = async (n) => {
  await page.screenshot({ path: `/opt/cursor/artifacts/screenshots/demo-${n}.png` });
};

// 1) Marketing home
await page.goto(`${base}/`, { waitUntil: "networkidle", timeout: 60000 });
await pause(2500);
await shot("01-home");

// 2) How it works
await page.goto(`${base}/how-it-works`, { waitUntil: "domcontentloaded" });
await pause(2000);
await shot("02-how");

// 3) Signup
await page.goto(`${base}/auth`, { waitUntil: "domcontentloaded" });
await pause(1500);
if (await page.getByRole("heading", { name: /Welcome back/i }).count()) {
  await page.getByRole("button", { name: /Create New Profile/i }).click();
  await pause(400);
}
await page.getByLabel("First Name").fill("Submit");
await page.getByLabel("Last Name").fill("Demo");
await page.getByLabel("Organization").fill("YARD Submit Co");
await page.locator('input[type="email"]').fill(email);
await page.locator('input[type="password"]').fill(password);
await shot("03-auth");
await page.getByRole("button", { name: /Create Account/i }).click();
await page.waitForURL((u) => !u.pathname.includes("/auth"), { timeout: 45000 });
await pause(2000);
await shot("04-dashboard");

// 4) Wire inbox
await page.goto(`${base}/settings`);
await pause(1200);
await page.getByRole("button", { name: /^Inbox$/i }).click();
await pause(400);
await page.locator('input[placeholder*="inbox" i]').fill("yard-allgas@agentmail.to");
await page.getByRole("button", { name: /Save|Link|Update/i }).first().click();
await pause(1000);
await page.getByRole("button", { name: /Integrations/i }).click();
await pause(1500);
await shot("05-integrations");

// 5) Portal match quote
await page.goto(`${base}/supplier-portal`);
await pause(1200);
await page.locator('input[name="material"]').fill("A Light in the Attic");
await page.locator('input[name="spec"]').fill("Paperback");
await page.locator('input[name="qty"]').fill("2 copies");
await page.locator('input[name="price"]').fill("40");
await page.locator('input[name="url"]').fill(PAGE_URL);
await page.getByRole("button", { name: /Submit for Firecrawl/i }).click();
await pause(2000);
await shot("06-portal");

// 6) Inbound high quote for counter
const key = amKey();
await fetch(
  "https://api.agentmail.to/v0/inboxes/yard-supplier-demo@agentmail.to/messages/send",
  {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      to: ["yard-allgas@agentmail.to"],
      subject: "Live demo quote — Attic paperback",
      text: [
        "Hi,",
        "Material: A Light in the Attic",
        "Quantity: 5 copies",
        "Unit price: $99.00 per copy",
        `Page: ${PAGE_URL}`,
        "Thanks",
      ].join("\n"),
    }),
  },
);

// 7) Watch board settle
let countered = false;
for (let i = 0; i < 18; i++) {
  await page.goto(`${base}/board`, { waitUntil: "domcontentloaded" });
  await pause(3500);
  const body = await page.locator("body").innerText();
  await shot(`07-board-${i}`);
  if (/Countered/i.test(body) && /Matched|Approved/i.test(body)) {
    countered = true;
    break;
  }
  if (/Countered/i.test(body)) {
    countered = true;
    break;
  }
}
console.log("countered visible", countered);

// 8) Open newest quote detail
const link = page.locator('a[href*="/quotes/"]').first();
if (await link.count()) {
  await link.click();
  await pause(3000);
  await shot("08-quote-detail");
}

// 9) Activity + orders path
await page.goto(`${base}/activity`);
await pause(2500);
await shot("09-activity");
await page.goto(`${base}/inbox`);
await pause(2000);
await shot("10-inbox");
await page.goto(`${base}/dashboard`);
await pause(2500);
await shot("11-dashboard-live");

const videoPath = await page.video()?.path();
await context.close();
await browser.close();
console.log("RAW_VIDEO", videoPath);

if (videoPath && existsSync(videoPath)) {
  const mp4 = "/opt/cursor/artifacts/yard_all_gas_demo.mp4";
  try {
    execSync(
      `ffmpeg -y -i ${JSON.stringify(videoPath)} -c:v libx264 -pix_fmt yuv420p -movflags +faststart -an ${JSON.stringify(mp4)}`,
      { stdio: "inherit" },
    );
    console.log("MP4", mp4);
  } catch (e) {
    copyFileSync(videoPath, "/opt/cursor/artifacts/yard_all_gas_demo.webm");
    console.log("WEBM_FALLBACK copied");
  }
}
console.log("email", email);
