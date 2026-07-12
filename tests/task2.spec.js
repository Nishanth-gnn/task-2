const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { LearningInstancePage } = require('../pages/LearningInstancePage');
const { FieldRulesPage } = require('../pages/FieldRulesPage');
const constants = require('../utils/constants');

// ─── Shared state across steps ────────────────────────────────────────────────
let loginPage;
let liPage;
let rulesPage;
const instanceName = constants.LEARNING_INSTANCE.NAME + '_' + Date.now();

// ─── Use Case: Authentication ──────────────────────────────────────────────────
test.describe('Authentication', () => {
    test('should successfully log in with valid credentials', async ({ page }) => {
        loginPage = new LoginPage(page);
        liPage = new LearningInstancePage(page);
        rulesPage = new FieldRulesPage(page);

        await loginPage.navigate(constants.URLS.LOGIN);
        await loginPage.login(process.env.AA_USERNAME, process.env.AA_PASSWORD);
    });
});

// ─── Use Case: Navigation – Document Automation ────────────────────────────────
test.describe('Navigation - Document Automation', () => {
    test('should navigate to Learning Instances section under AI > Document Automation', async ({ page }) => {
        loginPage = new LoginPage(page);
        liPage = new LearningInstancePage(page);
        rulesPage = new FieldRulesPage(page);

        await loginPage.navigate(constants.URLS.LOGIN);
        await loginPage.login(process.env.AA_USERNAME, process.env.AA_PASSWORD);
        await liPage.navigateToLearningInstances();
    });
});

// ─── Use Case: Learning Instance – Full Creation Workflow ──────────────────────
test.describe('Learning Instance - Creation and Configuration', () => {
    test('should create a new Learning Instance with name, document type, and description', async ({ page }) => {
        loginPage = new LoginPage(page);
        liPage = new LearningInstancePage(page);
        rulesPage = new FieldRulesPage(page);

        // Pre-requisite: log in and navigate
        await loginPage.navigate(constants.URLS.LOGIN);
        await loginPage.login(process.env.AA_USERNAME, process.env.AA_PASSWORD);
        await liPage.navigateToLearningInstances();

        // Open creation dialog and fill basic details
        await liPage.createNew();
        await liPage.fillDetails(
            constants.LEARNING_INSTANCE.DOCUMENT_TYPE,
            instanceName,
            constants.LEARNING_INSTANCE.DESCRIPTION
        );
    });

    test('should add form fields (Text and Date types) to the Learning Instance', async ({ page }) => {
        loginPage = new LoginPage(page);
        liPage = new LearningInstancePage(page);
        rulesPage = new FieldRulesPage(page);

        // Pre-requisite: log in, navigate, and fill basic details
        await loginPage.navigate(constants.URLS.LOGIN);
        await loginPage.login(process.env.AA_USERNAME, process.env.AA_PASSWORD);
        await liPage.navigateToLearningInstances();
        await liPage.createNew();
        await liPage.fillDetails(
            constants.LEARNING_INSTANCE.DOCUMENT_TYPE,
            instanceName,
            constants.LEARNING_INSTANCE.DESCRIPTION
        );

        // Add form fields
        await liPage.addFormFields(constants.FORM_FIELDS);
    });

    test('should add table fields (Number type) to the Learning Instance', async ({ page }) => {
        loginPage = new LoginPage(page);
        liPage = new LearningInstancePage(page);
        rulesPage = new FieldRulesPage(page);

        // Pre-requisite: log in, navigate, fill details, and add form fields
        await loginPage.navigate(constants.URLS.LOGIN);
        await loginPage.login(process.env.AA_USERNAME, process.env.AA_PASSWORD);
        await liPage.navigateToLearningInstances();
        await liPage.createNew();
        await liPage.fillDetails(
            constants.LEARNING_INSTANCE.DOCUMENT_TYPE,
            instanceName,
            constants.LEARNING_INSTANCE.DESCRIPTION
        );
        await liPage.addFormFields(constants.FORM_FIELDS);

        // Add table fields
        await liPage.addTableFields(constants.TABLE_FIELDS);
    });
});

// ─── Use Case: Field Rules ─────────────────────────────────────────────────────
test.describe('Field Rules', () => {
    test('should create a validation rule for the invoice_number field with Show Error action', async ({ page }) => {
        loginPage = new LoginPage(page);
        liPage = new LearningInstancePage(page);
        rulesPage = new FieldRulesPage(page);

        // Pre-requisite: complete all prior steps
        await loginPage.navigate(constants.URLS.LOGIN);
        await loginPage.login(process.env.AA_USERNAME, process.env.AA_PASSWORD);
        await liPage.navigateToLearningInstances();
        await liPage.createNew();
        await liPage.fillDetails(
            constants.LEARNING_INSTANCE.DOCUMENT_TYPE,
            instanceName,
            constants.LEARNING_INSTANCE.DESCRIPTION
        );
        await liPage.addFormFields(constants.FORM_FIELDS);
        await liPage.addTableFields(constants.TABLE_FIELDS);

        // Open field rules and create rule
        await liPage.openFieldRulesFor(constants.RULES[0].field);
        await rulesPage.createRule(constants.RULES[0]);
    });
});

// ─── Use Case: Learning Instance – Save & Persist ─────────────────────────────
test.describe('Learning Instance - Save and Persist', () => {
    test('should save and successfully persist the fully configured Learning Instance', async ({ page }) => {
        loginPage = new LoginPage(page);
        liPage = new LearningInstancePage(page);
        rulesPage = new FieldRulesPage(page);

        // Pre-requisite: complete entire workflow
        await loginPage.navigate(constants.URLS.LOGIN);
        await loginPage.login(process.env.AA_USERNAME, process.env.AA_PASSWORD);
        await liPage.navigateToLearningInstances();
        await liPage.createNew();
        await liPage.fillDetails(
            constants.LEARNING_INSTANCE.DOCUMENT_TYPE,
            instanceName,
            constants.LEARNING_INSTANCE.DESCRIPTION
        );
        await liPage.addFormFields(constants.FORM_FIELDS);
        await liPage.addTableFields(constants.TABLE_FIELDS);
        await liPage.openFieldRulesFor(constants.RULES[0].field);
        await rulesPage.createRule(constants.RULES[0]);

        // Save the Learning Instance
        await liPage.saveLearningInstance();

        // Allow time for the save to complete and confirm in the UI
        await page.waitForTimeout(10000);
    });
});
