const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { LearningInstancePage } = require('../pages/LearningInstancePage');
const { FieldRulesPage } = require('../pages/FieldRulesPage');
const constants = require('../utils/constants');

test.describe('Automation Anywhere - Learning Instance Creation', () => {
    test('Task 2 Workflow', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const liPage = new LearningInstancePage(page);
        const rulesPage = new FieldRulesPage(page);

        // STEP 1: Login
        await loginPage.navigate(constants.URLS.LOGIN);
        await loginPage.login(process.env.AA_USERNAME, process.env.AA_PASSWORD);

        // STEP 2: Navigate to AI -> Document Automation
        await liPage.navigateToLearningInstances();

        // STEP 3: Click Create Instance, fill details, click Next
        await liPage.createNew();
        const instanceName = constants.LEARNING_INSTANCE.NAME + '_' + Date.now();
        await liPage.fillDetails(
            constants.LEARNING_INSTANCE.DOCUMENT_TYPE,
            instanceName,
            constants.LEARNING_INSTANCE.DESCRIPTION
        );

        // STEP 4: Create Form Fields
        await liPage.addFormFields(constants.FORM_FIELDS);

        // STEP 5: Create Table Fields
        await liPage.addTableFields(constants.TABLE_FIELDS);

        // STEP 6: Navigate to Field Rules and Create Rule
        await liPage.openFieldRulesFor(constants.RULES[0].field);
        await rulesPage.createRule(constants.RULES[0]);

        // STEP 7: Click Create
        await liPage.saveLearningInstance();

        // STEP 8: End
        await page.waitForTimeout(10000); // just to ensure it completes and we can see it
    });
});
