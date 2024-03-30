import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4567/');
  await page.waitForTimeout(2000);
});

test('user not logged in, should only be able to view reviews', async ({ page }) => {
  await page.getByRole('link', { name: 'View Users' }).click();
  await page.getByRole('link', { name: 'Return to Home page' }).click();
  await page.getByRole('link', { name: 'Add Review' }).click();
  await page.getByRole('link', { name: 'Return to Home page' }).click();
  await page.getByRole('link', { name: 'Update' }).first().click();
  await page.getByRole('link', { name: 'Return to Home page' }).click();
  await page.getByRole('link', { name: 'Delete' }).first().click();
  await page.getByRole('link', { name: 'Return to Home page' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByRole('link', { name: 'Return to Home page' }).click();
});

test('user signup with admin role', async ({ page }) => {
  await page.getByRole('link', { name: 'Signup' }).click();
  await page.getByLabel('Username:').click();
  await page.getByLabel('Username:').fill('testusername');
  await page.getByLabel('Password:').click();
  await page.getByLabel('Password:').fill('password');
  await page.getByLabel('Role (user / admin):').click();
  await page.getByLabel('Role (user / admin):').fill('admin');
  await page.getByRole('button', { name: 'Signup' }).click();
});

test('user logs in with valid credentials to an admin account', async ({ page }) => {
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByLabel('Username:').click();
  await page.getByLabel('Username:').fill('admin');
  await page.getByLabel('Password:').click();
  await page.getByLabel('Password:').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
});

test('logged in user now elevated permissions', async ({ page }) => {
  await page.getByRole('link', { name: 'View Users' }).click();
  await page.getByRole('link', { name: 'Home' }).click();
});

test('creating a review', async ({ page }) => {
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByLabel('Username:').click();
  await page.getByLabel('Username:').fill('admin');
  await page.getByLabel('Password:').click();
  await page.getByLabel('Password:').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'Add Review' }).click();
  await page.getByLabel('Book Author:').click();
  await page.getByLabel('Book Author:').fill('John Doe');
  await page.getByLabel('Rating (1-10):').click();
  await page.getByLabel('Rating (1-10):').fill('6');
  await page.getByLabel('Comments:').click();
  await page.getByLabel('Comments:').fill('This is a test review');
  await page.getByRole('button', { name: 'Add' }).click();
});

test('updating a review', async ({ page }) => {
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByLabel('Username:').click();
  await page.getByLabel('Username:').fill('admin');
  await page.getByLabel('Password:').click();
  await page.getByLabel('Password:').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'Update' }).first().click();
  await page.getByLabel('Book Title:').click();
  await page.getByLabel('Comments:').fill('Update');
  await page.getByRole('button', { name: 'Update' }).click();
});

test('deleting a review', async ({ page }) => {
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByLabel('Username:').click();
  await page.getByLabel('Username:').fill('admin');
  await page.getByLabel('Password:').click();
  await page.getByLabel('Password:').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'Delete' }).first().click();
  await page.getByRole('button', { name: 'Delete' }).click();
});

test('user already logged in, cannot access signup and login features', async ({ page }) => {
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByLabel('Username:').click();
  await page.getByLabel('Username:').fill('admin');
  await page.getByLabel('Password:').click();
  await page.getByLabel('Password:').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'Signup' }).click();
  await page.getByRole('link', { name: 'Return to Home page' }).click();
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Return to Home page' }).click();
});

test('user logs out', async ({ page }) => {
  await page.getByRole('link', { name: 'Logout' }).click();
});

test('testing input validation', async ({ page }) => {
  await page.getByRole('link', { name: 'Signup' }).click();
  await page.getByLabel('Password:').click();
  await page.getByLabel('Password:').fill('p');
  await page.getByLabel('Role (user / admin):').click();
  await page.getByLabel('Role (user / admin):').fill('u');
  await page.getByRole('button', { name: 'Signup' }).click();
});

test('user signup with with user role', async ({ page }) => {
  await page.getByRole('link', { name: 'Signup' }).click();
  
  await page.getByLabel('Username:').click();
  await page.getByLabel('Username:').fill('testusername2');
  await page.getByLabel('Password:').click();
  await page.getByLabel('Password:').fill('password');
  await page.getByLabel('Role (user / admin):').click();
  await page.getByLabel('Role (user / admin):').fill('user');
  await page.getByLabel('Username:').click();
  await page.getByLabel('Username:').fill('testusername');
  await page.getByRole('button', { name: 'Signup' }).click();
});

test('user logs in with valid credentials to a user account', async ({ page }) => {
  await page.getByRole('link', { name: 'Login' }).click();
    await page.getByLabel('Username:').click();
  await page.getByLabel('Username:').fill('test1');
  await page.getByLabel('Password:').click();
  await page.getByLabel('Password:').fill('pass');
  await page.getByRole('button', { name: 'Login' }).click();
});
test('user account with user role has restricted permissions', async ({ page }) => {
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByLabel('Username:').click();
  await page.getByLabel('Username:').fill('test1');
  await page.getByLabel('Password:').click();
  await page.getByLabel('Password:').fill('pass');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'View Users' }).click();
  await page.getByRole('link', { name: 'Return to Home page' }).click();
  await page.getByRole('link', { name: 'Delete' }).first().click();
  await page.getByRole('link', { name: 'Return to Home page' }).click();
});

test('user account with user role can add a review', async ({ page }) => {
  await page.waitForTimeout(2000);
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByLabel('Username:').click();
  await page.getByLabel('Username:').fill('test1');
  await page.getByLabel('Password:').click();
  await page.getByLabel('Password:').fill('pass');
  await page.getByRole('button', { name: 'Login' }).click();
  
  await page.getByRole('link', { name: 'Add Review' }).click();
  await page.getByLabel('Book Author:').click();
  await page.getByLabel('Book Author:').fill('John Smith');
  await page.getByLabel('Rating (1-10):').click();
  await page.getByLabel('Rating (1-10):').fill('5');
  await page.getByLabel('Comments:').click();
  await page.getByLabel('Comments:').fill('This is another test review');
  await page.getByRole('button', { name: 'Add' }).click();
});

test('user account with user role can update a review', async ({ page }) => {
  await page.waitForTimeout(3000);
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByLabel('Username:').click();
  await page.getByLabel('Username:').fill('test1');
  await page.getByLabel('Password:').click();
  await page.getByLabel('Password:').fill('pass');
  await page.getByRole('button', { name: 'Login' }).click();
  
  await page.getByRole('link', { name: 'Update' }).first().click();
  await page.getByLabel('Comments:').click();
  await page.getByLabel('Comments:').fill('Update');
  await page.getByRole('button', { name: 'Update' }).click();
});

test('testing input validation for reviews', async ({ page }) => {
  await page.waitForTimeout(4000);
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByLabel('Username:').click();
  await page.getByLabel('Username:').fill('test1');
  await page.getByLabel('Password:').click();
  await page.getByLabel('Password:').fill('pass');
  await page.getByRole('button', { name: 'Login' }).click();
  
  await page.getByRole('link', { name: 'Add Review' }).click();
  await page.getByLabel('Book Author:').click();
  await page.getByLabel('Book Author:').fill('2');
  await page.getByLabel('Book Title:').click();
  await page.getByLabel('Book Title:').fill('1');
  await page.getByLabel('Rating (1-10):').click();
  await page.getByLabel('Rating (1-10):').fill('4');
  await page.getByLabel('Comments:').click();
  await page.getByLabel('Comments:').fill('1');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('link', { name: 'Cancel' }).click();
});
test('login with non existent username and then incorrect password', async ({ page }) => {
  // await page.getByRole('link', { name: 'Logout' }).click();
  await page.waitForTimeout(4000); 

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByLabel('Username:').click();
  await page.getByLabel('Username:').fill('nousername');
  await page.getByLabel('Password:').click();
  await page.getByLabel('Password:').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Return to Home page' }).click();
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByLabel('Username:').click();
  await page.getByLabel('Username:').fill('admin');
  await page.getByLabel('Password:').click();
  await page.getByLabel('Password:').fill('wrongpassword');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Return to Home page' }).click();
});