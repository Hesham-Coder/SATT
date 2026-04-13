import { expect, test } from "@playwright/test";

test("dashboard conference create flow appears on frontend", async ({ page }) => {
  test.setTimeout(120000);

  await page.goto("/dashboard/login");

  await page.getByLabel("البريد الإلكتروني").fill("admin@satt.org");
  await page.getByLabel("كلمة المرور").fill("admin");
  await page.getByRole("button", { name: /دخول|login/i }).click();

  await page.goto("/dashboard/conferences");
  await page.getByRole("button", { name: /add conference|إضافة مؤتمر/i }).first().waitFor({ timeout: 90000 });
  await page.getByRole("button", { name: /add conference|إضافة مؤتمر/i }).click();

  const titleEn = `E2E Conference ${Date.now()}`;

  await page.getByLabel(/title \(ar\)/i).fill("E2E AR Title");
  await page.getByLabel(/title \(en\)/i).fill(titleEn);
  await page.getByLabel(/full description \(ar\)/i).fill("Arabic description");
  await page.getByLabel(/full description \(en\)/i).fill("English description");
  await page.getByLabel(/^date$/i).fill("2026-04-13");
  await page.getByLabel(/video url/i).fill("https://youtube.com/watch?v=dQw4w9WgXcQ");
  await page.getByRole("button", { name: /add video url/i }).click();

  const uploadInput = page.getByTestId("media-upload-input");
  await uploadInput.setInputFiles({
    name: "e2e.png",
    mimeType: "image/png",
    buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=", "base64"),
  });

  await page.getByRole("button", { name: /upload selected media/i }).click();
  await page.getByTestId("save-conference").click();

  await expect(page.getByText(/conference saved successfully|تم حفظ المؤتمر/i)).toBeVisible();

  await page.goto("/conferences");
  await expect(page.getByText(titleEn)).toBeVisible();

  await page.getByRole("link", { name: new RegExp(titleEn, "i") }).click();
  await expect(page.getByText(titleEn)).toBeVisible();
  await expect(page.locator("video, iframe").first()).toBeVisible();
});
