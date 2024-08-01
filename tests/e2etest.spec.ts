import { expect, test } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://localhost:3000/maps');
    await page.getByRole('button', { name: 'Enable Indoor Map' }).click();
    await page.getByLabel('toggle button').click();
    await page.getByPlaceholder('      Enter search e.g. Room').click();
    await page.getByPlaceholder('      Enter search e.g. Room').fill('Foog');
    await page.getByPlaceholder('Choose a starting place').dblclick();
    await page.getByLabel('Map', { exact: true }).click({
        position: {
            x: 514,
            y: 395,
        },
    });
    await page.getByLabel('Map', { exact: true }).click({
        position: {
            x: 730,
            y: 388,
        },
    });
    await page.getByText('Campus Maps Chatbot').click();
    await page.getByPlaceholder('Write a message...').click();
    await page.getByPlaceholder('Write a message...').fill('Hi');
    await page
        .locator('div')
        .filter({ hasText: "Campus Maps Chatbot▼Hello, I'" })
        .getByRole('button')
        .click();
    await page.getByText('Campus Maps Chatbot').click();
    await page.getByLabel('AutoLightDark').selectOption('dark');
});
