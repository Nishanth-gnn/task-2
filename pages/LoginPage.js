class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.getByPlaceholder('Enter your username'); // typical AA login, will adjust if fails
        this.passwordInput = page.getByPlaceholder('Enter your password');
        this.loginButton = page.getByRole('button', { name: 'Log in' });
    }

    async navigate(url) {
        await this.page.goto(url);
    }

    async login(username, password) {
        // Handle input fields appropriately, they might have different labels or placeholders
        // Using common AA locators, self-healing will fix if necessary
        const usernameLocator = this.page.getByLabel(/Username/i).or(this.page.getByPlaceholder(/Username/i)).or(this.page.locator('input[name="username"]'));
        const passwordLocator = this.page.getByLabel(/Password/i).or(this.page.getByPlaceholder(/Password/i)).or(this.page.locator('input[name="password"]'));
        
        await usernameLocator.first().fill(username);
        await passwordLocator.first().fill(password);
        
        const btn = this.page.getByRole('button', { name: /Login|Log in/i });

        // Fire click and navigation wait together — prevents action timeout
        // when the server takes time to respond after login
        await Promise.all([
            this.page.waitForURL('**/#/**', { timeout: 60000 }),
            btn.first().click({ timeout: 60000 })
        ]);
    }
}

module.exports = { LoginPage };
