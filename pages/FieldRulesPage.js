class FieldRulesPage {
    constructor(page) {
        this.page = page;
        this.frame = page.frameLocator('iframe').first();
    }

    async createRule(ruleData) {
        // Step 6: Click Add Rule
        await this.frame.getByRole('button', { name: 'Add Rule', exact: true }).click();

        // Expand 'Field Rule 1' if collapsed
        const ruleTitle = this.frame.getByText('Field Rule 1', { exact: true });
        await ruleTitle.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
        if (await ruleTitle.isVisible()) {
            await ruleTitle.click();
        }

        // Fill Rule Value (condition value = 100)
        await this.frame.locator('input[name="data.ruleValue"]').first().fill('100');
        await this.frame.locator('input[name="data.ruleValue"]').first().press('Tab');

        // Select Action Type → Show Error
        await this.frame.getByPlaceholder('Select Action Type', { exact: true }).click();
        await this.frame.getByText(/show error/i).click();

        // Fill Action Value → "Invalid Value"
        const actionValue = this.frame.getByPlaceholder('Action Value')
            .or(this.frame.locator('input[name*="actionValue"]')).first();
        await actionValue.fill('Invalid Value');
        await actionValue.press('Enter');
        await actionValue.blur();

        // Allow the UI state to settle before proceeding
        await this.page.waitForTimeout(1000);
    }
}

module.exports = { FieldRulesPage };
