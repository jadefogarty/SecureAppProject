const { test, expect } = require('@playwright/test');

test('Page loads successfully', async ({ page }) => {
  // Navigate to the page you want to test
  await page.goto('http://localhost:4567/');

  // Wait for the page to load
  await page.waitForLoadState('domcontentloaded');

  // Check if the page title is as expected
  const title = await page.title();
  expect(title).toBe('Secure Application Project');
});

test('User signup form works correctly', async ({ page }) => {
  // Navigate to the signup page
  await page.goto('http://localhost:4567/user/signup');

  // Fill out the signup form
  await page.fill('input[name="Username"]', 'testuser4');
  await page.fill('input[name="Password"]', 'testpassword');
  await page.fill('input[name="Role"]', 'user');

  // Submit the form
  await page.click('button[type="submit"]');

  // Wait for navigation
  // await page.waitForNavigation();

  // Check if navigation was successful
  const url = page.url();
  expect(url).toBe('http://localhost:4567/'); // Adjust this URL based on your application's behavior

  // Optionally, you can check for success messages or other elements on the page
});
