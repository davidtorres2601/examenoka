import { test, expect, Page } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

//PRIMER CASO DE PRUEBA
test('Login exitoso examen', async ({ page }) => {

await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

const login=new LoginPage(page);
await login.loginWithCredentials("Admin", "admin123");
 
// Validación: verificar que se redirige a la página principal de la aplicación
await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');

});


//SEGUNDO CASO DE PRUEBA
test('Login fallido examen', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'incorrectPassword');
  await page.click('button[type="submit"]');
  
  // Verificar mensaje de error
  await expect(page.locator('.oxd-alert-content')).toContainText('Invalid credentials');
});


test('Filtro de usuarios por rol Admin', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  
  // Filtro por rol "Admin"
  await page.click('oxd-main-menu-item');
  await page.click('button:has-text("User Management")');
  await page.click('button:has-text("Users")');
  await page.selectOption('select[name="role"]', 'Admin');

  
  // Validar que los registros contienen las acciones 'editar' y 'eliminar'
  const editButton = await page.locator('button:has-text("Edit")');
  const deleteButton = await page.locator('button:has-text("Delete")');
  await expect(editButton).toBeVisible();
  await expect(deleteButton).toBeVisible();
});

test('Edición de usuario existente', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  
  // Agregar un nuevo usuario
  await page.click('button:has-text("Add")');
  await page.fill('input[name="firstName"]', 'John');
  await page.fill('input[name="lastName"]', 'A. Doe');
  await page.fill('input[name="employeeId"]', '1234');
  await page.fill('input[name="username"]', 'HappyTesting');
  await page.fill('input[name="password"]', 'HappyTesting123');
  await page.fill('input[name="confirmPassword"]', 'HappyTesting123');
  await page.selectOption('select[name="status"]', 'Enabled');
  await page.click('button[type="submit"]');
  
  // Validar que el nuevo usuario fue creado y es visible
  await page.click('button:has-text("User Management")');
  await page.click('button:has-text("Users")');
  await page.fill('input[placeholder="Search"]', 'HappyTesting');
  const userRow = await page.locator('td:has-text("HappyTesting")');
  await expect(userRow).toBeVisible();
});


test('Agregar un nuevo usuario y validarlo', async ({ page }) => {
  // Paso 1: Iniciar sesión en la plataforma
  await page.goto('https://opensourcedemo.orangehrmlive.com/web/index.php/auth/login');
  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  
  // Validar que la redirección fue exitosa
  await expect(page).toHaveURL('https://opensourcedemo.orangehrmlive.com/web/index.php/dashboard/index');

  // Paso 2: Ir a la sección de "User Management" -> "Users"
  await page.click('button:has-text("Admin")');
  await page.click('a:has-text("User Management")');
  await page.click('a:has-text("Users")');
  
  // Paso 3: Hacer clic en "Add" para agregar un nuevo usuario
  await page.click('button:has-text("Add")');
  
  // Paso 4: Llenar los campos con los datos de prueba
  await page.fill('input[name="firstName"]', 'John');
  await page.fill('input[name="lastName"]', 'A. Doe');
  await page.fill('input[name="employeeId"]', '1234');
  await page.fill('input[name="username"]', 'HappyTesting');
  await page.fill('input[name="password"]', 'HappyTesting123');
  await page.fill('input[name="confirmPassword"]', 'HappyTesting123');
  
  // Seleccionar el estado "Enabled"
  await page.selectOption('select[name="status"]', 'Enabled');
  
  // Paso 5: Hacer clic en "Save" para guardar el nuevo usuario
  await page.click('button[type="submit"]');
  
  // Validar la alerta de éxito después de guardar el usuario
  const successAlert = page.locator('.oxd-toast-text');
  await expect(successAlert).toContainText('Successfully Saved');
  
  // Paso 6: Filtrar el usuario creado
  await page.fill('input[placeholder="Search"]', 'HappyTesting');
  await page.click('button:has-text("Search")');
  
  // Validar que el usuario creado se muestra en los resultados de búsqueda
  const newUserRow = page.locator('td:has-text("HappyTesting")');
  await expect(newUserRow).toBeVisible();

  // Paso 7: Validar la presencia de campos de texto, checkbox y alertas
  const usernameField = page.locator('input[name="username"]');
  const passwordField = page.locator('input[name="password"]');
  const statusDropdown = page.locator('select[name="status"]');
  
  // Verificar que los campos estén visibles
  await expect(usernameField).toBeVisible();
  await expect(passwordField).toBeVisible();
  await expect(statusDropdown).toBeVisible();

  // Verificar que el checkbox de "Enabled" esté seleccionado correctamente
  const statusOption = page.locator('option:has-text("Enabled")');
  await expect(statusOption).toBeFocused();
});

test('Validar campos de texto, checkbox y alertas al agregar usuario', async ({ page }) => {
  // Paso 1: Iniciar sesión en la plataforma
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  
  // Verificar que la URL cambió y que estamos en la página principal
  await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
  
  // Paso 2: Ir a la sección de "User Management" -> "Users"
  await page.click('button:has-text("Admin")');
  await page.click('a:has-text("User Management")');
  await page.click('a:has-text("Users")');
  
  // Paso 3: Hacer clic en "Add" para agregar un nuevo usuario
  await page.click('button:has-text("Add")');
  
  // Paso 4: Verificar la presencia de campos de texto
  const firstNameField = page.locator('input[name="firstName"]');
  const lastNameField = page.locator('input[name="lastName"]');
  const employeeIdField = page.locator('input[name="employeeId"]');
  const usernameField = page.locator('input[name="username"]');
  const passwordField = page.locator('input[name="password"]');
  const confirmPasswordField = page.locator('input[name="confirmPassword"]');
  const statusDropdown = page.locator('select[name="status"]');
  
  await expect(firstNameField).toBeVisible();
  await expect(lastNameField).toBeVisible();
  await expect(employeeIdField).toBeVisible();
  await expect(usernameField).toBeVisible();
  await expect(passwordField).toBeVisible();
  await expect(confirmPasswordField).toBeVisible();
  await expect(statusDropdown).toBeVisible();

  // Paso 5: Validar la presencia del checkbox y su selección
  const enabledOption = page.locator('option:has-text("Enabled")');
  await expect(enabledOption).toBeAttached();
  
  // Paso 6: Llenar los campos con los datos de prueba
  await page.fill('input[name="firstName"]', 'John');
  await page.fill('input[name="lastName"]', 'A. Doe');
  await page.fill('input[name="employeeId"]', '1234');
  await page.fill('input[name="username"]', 'HappyTesting');
  await page.fill('input[name="password"]', 'HappyTesting123');
  await page.fill('input[name="confirmPassword"]', 'HappyTesting123');
  
  // Paso 7: Hacer clic en "Save"
  await page.click('button[type="submit"]');
  
  // Paso 8: Validar alerta de éxito
  const successAlert = page.locator('.oxd-toast-text');
  await expect(successAlert).toContainText('Successfully Saved');
});


test('test mercado', async ({ page }) => {

await page.goto('https://mercadolibre.com.co/');
await page.locator('input[id=\'cb1-edit\']').fill("Iphone")
await page.keyboard.press("Enter")

await expect(page.locator('//ol[contains(@class,\'ui-search-layout\')]')).toBeVisible()
//await page.pause()

const titles= await page.locator('//ol[contains(@class,\'ui-search-layout\')]//li/h2').allInnerTexts()

console.log("the total number of result is:",titles.length)

for(let title of titles){
console.log("the title is: ", title)
}
});