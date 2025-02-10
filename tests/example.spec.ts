import { test, expect, Page } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { UrlPage } from './pages/UrlPage';
import exp from 'constants';

//PRIMER CASO DE PRUEBA
test('Validar Login exitoso', async ({ page }) => {

const url =new UrlPage(page);
await url.navigateToUrl();
const login=new LoginPage(page);
await login.loginWithCredentials("Admin", "admin123");
// Validación: verificar que se redirige a la página principal de la aplicación
await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
});


//SEGUNDO CASO DE PRUEBA
test('Validar Login fallido', async ({ page }) => {
  const url =new UrlPage(page);
  await url.navigateToUrl();
  const login=new LoginPage(page);
  await login.loginWithCredentials("Admin", "passwordincorrect");
  // Verificar mensaje de error
  await expect(page.locator('.oxd-alert-content')).toContainText('Invalid credentials');
});

//TERCER CASO DE PRUEBA
test('Filtro de usuarios por rol Admin', async ({ page }) => {
  const url =new UrlPage(page);
  await url.navigateToUrl();
  const login=new LoginPage(page);
  await login.loginWithCredentials("Admin", "admin123");

  const userManagement=new UserManagementPage(page);
  // Filtro por rol "Admin"
  await userManagement.filtrarPorRol();
  // Seleccionar "Admin" en el dropdown  
  await userManagement.seleccionarOpcionAdmin();
  // Validar que los registros contienen las acciones 'editar' y 'eliminar'
  await userManagement.verifyActionsVisible();
  /** 
  const rows = await page.locator('.oxd-table-body .oxd-table-row').count();
  for (let i = 0; i < rows; i++) {
    await expect(page.locator(`.oxd-table-body .oxd-table-row:nth-child(${i + 1}) .oxd-icon-button[title="Edit"]`)).toBeVisible();
    await expect(page.locator(`.oxd-table-body .oxd-table-row:nth-child(${i + 1}) .oxd-icon-button[title="Delete"]`)).toBeVisible();
  }**/
  await userManagement.validateInvalidDataMessage();
  
});

//TERCER CASO DE PRUEBA
test('Editar usario rol Admin', async ({ page }) => {
  const url =new UrlPage(page);
  await url.navigateToUrl();
  const login=new LoginPage(page);
  await login.loginWithCredentials("Admin", "admin123");

  const userManagement=new UserManagementPage(page);
  // Filtro por rol "Admin"
  await userManagement.filtrarPorRol();
  // Seleccionar "Admin" en el dropdown  
  await userManagement.seleccionarOpcionAdmin();
  // Validar que los registros contienen las acciones 'editar' y 'eliminar'
  await userManagement.verifyActionsVisible();


  // Hacer scroll hasta la primera fila (opcional, si el ícono no es visible de inmediato)
  await page.locator("//button[@class='oxd-icon-button oxd-table-cell-action-space'])[2]").click();

  //Editar usuario
  await userManagement.editUser();

  
});


test('Agregar nuevo usuario', async ({ page }) => {
  const url =new UrlPage(page);
  await url.navigateToUrl();
  const login=new LoginPage(page);
  await login.loginWithCredentials("Admin", "admin123");
  
  const userManagement=new UserManagementPage(page);
  await userManagement.navigateToUserManagement();

  // Agregar un nuevo usuario
  await page.click('button:has-text("Add")');

  await page.click('.oxd-select-text'); // Abrir el dropdown
  await page.getByRole('option', { name: 'Admin' }).locator('span').click();

  await page.getByPlaceholder('Type for hints...').fill('John A. Doe');
  const checkboxStatus= await page.locator('div:nth-child(3) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper > .oxd-select-text');
  await checkboxStatus.click();
  await page.getByRole('option', { name: 'Enabled' }).click();
  await page.getByRole('textbox').nth(2).click();
  await page.getByRole('textbox').nth(2).fill('HappyTesting');
  await page.getByRole('textbox').nth(3).click();
  await page.getByRole('textbox').nth(3).fill('HappyTesting123');
  await page.getByRole('textbox').nth(4).click();
  await page.getByRole('textbox').nth(4).fill('HappyTesting123');

  await page.click('button[type="submit"]');

  const textpag= await page.getByText('Invalid');
  const passwordxd=await page.getByText('Better');


  await expect(textpag).toBeVisible();
  await expect(checkboxStatus).toBeVisible();
  await expect(passwordxd).toBeVisible();

});
