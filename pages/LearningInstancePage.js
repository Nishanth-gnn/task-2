class LearningInstancePage {
    constructor(page) {
        this.page = page;
        this.frame = page.frameLocator('iframe').first();
    }

    async navigateToLearningInstances() {
        // Step 2: Navigate to AI -> Document Automation
        await this.page.getByRole('button', { name: 'AI', exact: true }).click();
        await this.page.getByRole('link', { name: 'Document Automation', exact: true }).click();
        // Assume this opens Learning Instances. If it doesn't, we will fix it later based on actual failure.
    }

    async createNew() {
        // Step 3: Click Create Instance (or Create New)
        // Locate the button using its container ID to avoid label matching issues.
        const btn = this.frame.locator('#create-learning-instance-button').getByRole('button');
        await btn.waitFor({ state: 'visible' });

        const { expect } = require('@playwright/test');
        await expect(async () => {
            await btn.click();
            await expect(this.frame.locator('input[name="name"]')).toBeVisible({ timeout: 5000 });
        }).toPass({ timeout: 30000 });
    }

    async fillDetails(type, name, description) {
        // Fill Name
        await this.frame.locator('input[name="name"]').fill(name);

        // Document Type -> User-defined
        const docType = this.frame.locator('.rio-select-input[data-name="domainId"]');
        await docType.click();
        
        // Options are rendered in a .poppy-farm container at the end of the DOM.
        await this.frame.locator('.poppy-farm').last().getByText(type, { exact: true }).click();

        // Click Next
        await this.frame.getByRole('button', { name: 'Next', exact: true }).click();
    }

    async addFormFields(fields) {
        // Step 4: Create Form Fields
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];

            // Click 'Add a field' only if the field doesn't already exist
            const fieldLink = this.frame.getByText(field.name, { exact: true });
            if (await fieldLink.isVisible()) {
                await fieldLink.click();
            } else {
                await this.frame.getByRole('button', { name: 'Add a field', exact: true }).first().click();
            }

            const dialog = this.frame.locator('[role="dialog"]').last();
            await dialog.locator('input[name="name"]').fill(field.name);
            await dialog.locator('input[name="displayName"]').fill(field.label);

            const fieldType = dialog.locator('.rio-select-input[data-name="dataType"]');
            await fieldType.click();
            await this.frame.locator('.poppy-farm').last().getByText(field.type, { exact: true }).click();
        }
    }

    async addTableFields(fields) {
        // Step 5: Switch to Table Fields
        await this.frame.getByRole('tab', { name: 'Table fields', exact: true }).click();
        
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];

            // Click 'Add a field' only if the field doesn't already exist
            const fieldLink = this.frame.getByText(field.name, { exact: true });
            if (await fieldLink.isVisible()) {
                await fieldLink.click();
            } else {
                await this.frame.getByRole('button', { name: 'Add a field', exact: true }).first().click();
            }

            const dialog = this.frame.locator('[role="dialog"]').last();
            await dialog.locator('input[name="name"]').fill(field.name);
            await dialog.locator('input[name="displayName"]').fill(field.label);

            const fieldType = dialog.locator('.rio-select-input[data-name="dataType"]');
            await fieldType.click();
            await this.frame.locator('.poppy-farm').last().getByText(field.type, { exact: true }).click();
        }
    }

    async openFieldRulesFor(fieldName) {
        // Step 6: Navigate back to Form Fields
        await this.frame.getByRole('tab', { name: /Form fields/i }).click();

        // Click invoice_number
        await this.frame.getByText(fieldName, { exact: true }).click();

        // Navigate to Field Rules
        await this.frame.getByRole('tab', { name: /Field rules/i }).click();
    }

    async saveLearningInstance() {
        // Step 7: Click Create
        const { expect } = require('@playwright/test');
        const createBtn = this.frame.getByRole('button', { name: 'Create', exact: true });
        
        // Wait for it to become enabled, up to 10 seconds.
        // Automation Anywhere disables it by adding a class or data-input-status="DISABLED"
        await expect(createBtn).not.toHaveAttribute('data-input-status', 'DISABLED', { timeout: 10000 });
        
        await createBtn.click();
    }
}

module.exports = { LearningInstancePage };
