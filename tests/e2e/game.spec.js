import { test, expect } from '@playwright/test';

async function startGame(page) {
  await page.goto('/');
  const overlay = page.locator('#ui-overlay');
  await page.getByText('1 PLAYER', { exact: true }).click();
  await expect(overlay).toHaveClass(/active/);
  await expect(overlay).toContainText('STAGE 01');
  await page.waitForFunction(() => {
    const element = document.getElementById('ui-overlay');
    return element && !element.classList.contains('active');
  });
}

test('菜单显示 HUD 信息且可启动游戏', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#hud-player-score')).toHaveText('000000');
  await expect(page.locator('#hud-hi-score')).toHaveText('000000');
  await expect(page.locator('#hud-stage')).toHaveText('01');
  await expect(page.getByText('1 PLAYER', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '切换音频' })).toHaveText('🔊');
});

test('从菜单进入关卡并开始战斗', async ({ page }) => {
  await startGame(page);
  await expect(page.locator('#ui-overlay')).not.toHaveClass(/active/);
  await expect(page.locator('#hud-stage')).toHaveText('01');
  await expect(page.locator('#hud-player-score')).toHaveText('000000');
});

test('按 Enter 可暂停与继续', async ({ page }) => {
  await startGame(page);
  const overlay = page.locator('#ui-overlay');
  await page.keyboard.press('Enter');
  await expect(overlay).toHaveClass(/active/);
  await expect(overlay).toContainText('PAUSE');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => {
    const element = document.getElementById('ui-overlay');
    return element && !element.classList.contains('active');
  });
});

test('HUD 音量按钮切换静音图标', async ({ page }) => {
  await page.goto('/');
  const audioButton = page.locator('#btn-toggle-audio');
  await expect(audioButton).toHaveText('🔊');
  await audioButton.click();
  await expect(audioButton).toHaveText('🔇');
  await audioButton.click();
  await expect(audioButton).toHaveText('🔊');
});
