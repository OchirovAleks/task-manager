import { test, expect } from '@playwright/test';

test('user can register, login, create a project and a task, then delete the project', async ({ page, request }) => {
  test.setTimeout(60000);

  const healthResponse = await request.get(
    'https://task-manager-api-1216.onrender.com/health',
    { timeout: 30000 }
  );

  expect(healthResponse.ok()).toBeTruthy();

  const projectName = `E2E Project ${Date.now()}`;
  const taskTitle = `E2E Task ${Date.now()}`;
  const email = `test${Date.now()}@gmail.com`;
  const password = `test${Date.now()}`;

  await page.goto('/');
  await page.getByTestId('email-input').fill(email);
  await page.getByTestId('password-input').fill(password);
  await page.getByTestId('register-button').click();

  await expect(page.getByTestId('project-input')).toBeVisible({timeout: 10000});

  await page.getByTestId('project-input').fill(projectName);
  await page.getByTestId('project-input').press('Enter');

  const projectRow = page.locator('li', { hasText: projectName }).last();

  await expect(projectRow).toBeVisible({ timeout: 10000 });

  await projectRow.click();
  await page.getByTestId('task-input').fill(taskTitle);
  await page.getByTestId('task-input').press('Enter');

  await expect(page.getByText(taskTitle)).toBeVisible({ timeout: 10000 });

  await projectRow.getByRole('button', { name: 'Delete' }).click();
  await expect(page.locator('li', { hasText: projectName })).toHaveCount(0);
  await expect(page.getByText(taskTitle)).toHaveCount(0);
});