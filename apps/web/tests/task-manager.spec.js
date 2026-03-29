import { test, expect } from '@playwright/test';

test('user can create a project and a task', async ({ page, request }) => {
    test.setTimeout(60000);
    const healthResponse = await request.get(
        'https://task-manager-api-1216.onrender.com/health',
        { timeout: 30000 }
    );
    expect(healthResponse.ok()).toBeTruthy();

    const projectName = `E2E Project`;
    const taskTitle = `E2E Task`;

    await page.goto('/');

    await page.getByTestId('project-input').fill(projectName);
    await page.getByTestId('project-input').press('Enter');

    await expect(page.getByText(projectName)).toBeVisible();

    await page.getByText(projectName).click();

    await page.getByTestId('task-input').fill(taskTitle);
    await page.getByTestId('task-input').press('Enter');

    await expect(page.getByText(taskTitle)).toBeVisible();
})