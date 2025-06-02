const { test, expect } = require('@playwright/test');

test('register user', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/register');
  await page.fill('input[name="fullname"]', 'Test User');
  await page.fill('input[name="username"]', 'testuser');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.fill('input[name="password_confirmation"]', 'password');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/login|dashboard/);
});

test('login user', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/login');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/dashboard/);
});