import { Page, expect } from '@playwright/test';

export class UserManagementPage {
  constructor(private page: Page) {}

  async navigateToUserManagement() {
    await this.page.click('.oxd-main-menu-item:has-text("Admin")');
    await expect(this.page).toHaveURL(/viewSystemUsers/);
  }

  async filtrarPorRol() {
    await this.page.waitForSelector('.oxd-main-menu-item', { state: 'visible' });
    await this.page.locator('.oxd-main-menu-item:has-text("Admin")').click();

    await this.page.waitForSelector('.oxd-topbar-body-nav-tab-item:has-text("User Management")', { state: 'visible' });
    await this.page.locator('.oxd-topbar-body-nav-tab-item:has-text("User Management")').click();
  
    await this.page.waitForSelector('.oxd-topbar-body-nav-tab-link:has-text("Users")', { state: 'visible' });
    await this.page.locator('.oxd-topbar-body-nav-tab-link:has-text("Users")').click();
  }

  async seleccionarOpcionAdmin() {
    await this.page.click('.oxd-select-text'); // Abrir el dropdown
    await this.page.getByRole('option', { name: 'Admin' }).locator('span').click();
    await this.page.click('button[type="submit"]'); // Confirmar la selección
    // Hacer clic en el botón de búsqueda o confirmación si es necesario
    await this.page.getByRole("button",{name:'Search'})

  }

  async verifyActionsVisible() {
    const rows = await this.page.locator('.oxd-table-body .oxd-table-row').count();
    for (let i = 0; i < rows; i++) {
      await expect(this.page.locator(`.oxd-table-body .oxd-table-row:nth-child(${i + 1}) .oxd-table-cell:last-child button[title="Edit"]`)).toBeVisible();
      await expect(this.page.locator(`.oxd-table-body .oxd-table-row:nth-child(${i + 1}) .oxd-table-cell:last-child button[title="Delete"]`)).toBeVisible();
    }
  }

  async validateInvalidDataMessage() {
    await this.page.getByRole('textbox').nth(1).fill('asdasd');
    await this.page.getByRole("button",{name:'Search'})
    await expect(this.page.locator('.oxd-text.oxd-text--p.oxd-alert-content-text')).toContainText("Records Found");
  }

  async editUser() {
    await this.page.fill('input[name="username"]', "David");
    await this.page.click('button[type="submit"]');
    await expect(this.page.locator('.oxd-table-body .oxd-table-row')).toContainText("David");

  }
}
