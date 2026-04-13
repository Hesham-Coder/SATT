import { expect, test } from "@playwright/test";

test("homepage interactions work end to end", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /نبني منصة علمية رائدة لدعم التطور/i,
    }),
  ).toBeVisible();

  await page.getByRole("button", { name: "الكل" }).click();
  await expect(page.getByText(/عرض 4 محاور/i)).toBeVisible();

  await page.getByRole("button", { name: "مؤتمرات" }).click();
  await expect(page.getByText(/عرض 1 محور/i)).toBeVisible();

  await page.getByRole("button", { name: "تواصل معنا" }).first().click();
  await expect(page.getByLabel("الاسم")).toBeVisible();

  await page.getByRole("button", { name: "إرسال الرسالة" }).click();
  await expect(page.getByText("الاسم مطلوب.")).toBeVisible();

  await page.getByLabel("الاسم").fill("Jane Doe");
  await page.getByLabel("البريد الإلكتروني").fill("jane@example.com");
  await page.getByLabel("رسالتك").fill("We need a production-ready launch.");
  await page.getByRole("button", { name: "إرسال الرسالة" }).click();

  await expect(
    page.getByText("شكراً لك، تم إرسال رسالتك بنجاح وسنفيدك قريباً."),
  ).toBeVisible();
});
