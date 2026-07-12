# Automation Anywhere – Task 2: Playwright Automation

End-to-end automation of the **Automation Anywhere Control Room** using Playwright. This suite logs in, navigates to Document Automation, creates a Learning Instance with form fields, table fields, and a field rule, and finally saves it.

---

## 📋 Table of Contents

- [Framework & Tools](#framework--tools)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment & Configuration](#environment--configuration)
- [Running Tests](#running-tests)
- [Test Organization](#test-organization)

---

## 🛠️ Framework & Tools

| Tool / Library         | Version  | Purpose                                              |
|------------------------|----------|------------------------------------------------------|
| [Node.js](https://nodejs.org) | ≥ 18.x | JavaScript runtime                              |
| [Playwright](https://playwright.dev) | ^1.61.1 | Browser automation framework              |
| [dotenv](https://github.com/motdotla/dotenv) | ^17.x | Loads credentials from `.env` file   |
| **Page Object Model**  | —        | Design pattern to keep selectors/actions in `pages/` |

### Architecture

```
task-2/
├── pages/                  # Page Object Model classes
│   ├── LoginPage.js        # Login screen interactions
│   ├── LearningInstancePage.js  # Learning Instance creation flow
│   └── FieldRulesPage.js   # Field Rules dialog interactions
├── tests/
│   └── task2.spec.js       # Main test suite (organized by use case)
├── utils/
│   └── constants.js        # Shared test data & URLs
├── playwright.config.js    # Playwright configuration
├── .env                    # Local credentials (never commit this)
└── package.json
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites

- **Node.js** ≥ 18 installed → [Download](https://nodejs.org)
- An active **Automation Anywhere Control Room** account with credentials.

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install
```

### 4. Configure environment variables

Copy the example below into a new `.env` file at the project root and fill in your credentials:

```env
CONTROL_ROOM_URL=https://<your-control-room>.automationanywhere.digital/
AA_USERNAME=your_email@example.com
AA_PASSWORD=your_password
```

> ⚠️ **Never commit `.env` to version control.** It is already listed in `.gitignore`.

---

## 🔐 Environment & Configuration

| Variable            | Required | Description                                                    |
|---------------------|----------|----------------------------------------------------------------|
| `CONTROL_ROOM_URL`  | ✅ Yes   | Full URL to your Automation Anywhere Control Room login page   |
| `AA_USERNAME`       | ✅ Yes   | Email/username used to log in to the Control Room              |
| `AA_PASSWORD`       | ✅ Yes   | Password for the above account                                 |

### Playwright Configuration Notes (`playwright.config.js`)

| Setting              | Value              | Note                                              |
|----------------------|--------------------|---------------------------------------------------|
| `testDir`            | `./tests`          | All spec files must live here                     |
| `fullyParallel`      | `false`            | Tests run sequentially (UI state dependency)      |
| `workers`            | `1`                | Single browser worker to avoid race conditions    |
| `timeout`            | `120 000 ms`       | Per-test timeout (2 minutes)                      |
| `actionTimeout`      | `30 000 ms`        | Per-action timeout                                |
| `navigationTimeout`  | `60 000 ms`        | Page navigation timeout                           |
| `reporter`           | `html`             | Generates an HTML report in `playwright-report/`  |
| `screenshot`         | `only-on-failure`  | Screenshots saved only when a test fails          |
| `video`              | `retain-on-failure`| Video saved only when a test fails                |

---

## ▶️ Running Tests

| Command                                    | Description                                       |
|--------------------------------------------|---------------------------------------------------|
| `npx playwright test`                      | Run all tests headlessly (default)                |
| `npx playwright test --headed`             | Run with visible browser UI                       |
| `npx playwright test --ui`                 | Open Playwright interactive UI runner             |
| `npx playwright test --debug`              | Run in debug mode with Playwright inspector       |
| `npx playwright show-report`               | Open the HTML report after a test run             |
| `npx playwright test --grep "Login"`       | Run only tests matching a specific tag/name       |

---

## 🧪 Test Organization

Tests are located in [`tests/task2.spec.js`](./tests/task2.spec.js) and are structured using nested `test.describe` blocks, one per use case:

| `describe` Block                                      | Test Name                                                                 |
|-------------------------------------------------------|---------------------------------------------------------------------------|
| `Authentication`                                      | `should successfully log in with valid credentials`                       |
| `Navigation – Document Automation`                    | `should navigate to Learning Instances section`                           |
| `Learning Instance – Creation & Configuration`        | `should create a new Learning Instance with name and description`         |
| `Learning Instance – Form Fields`                     | `should add form fields (Text and Date types) to the Learning Instance`   |
| `Learning Instance – Table Fields`                    | `should add table fields (Number type) to the Learning Instance`          |
| `Field Rules`                                         | `should create a validation rule for the invoice_number field`            |
| `Learning Instance – Save`                            | `should save and persist the Learning Instance successfully`               |

---

## 📄 License

ISC
