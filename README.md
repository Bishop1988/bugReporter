🛠 Installation

1. Clone and Install Dependencies
    - git clone https://github.com/Bishop1988/bugReporter.git
    - cd bug-reporter

# Install PHP dependencies

-   composer install

# Install Node.js dependencies

-   npm install

2. Environment Setup

Copy environment file

-   cp .env.example .env

# Generate application key

-   php artisan key:generate

3. Database Setup

Create SQLite database

-   touch database/database.sqlite

# Run migrations

-   php artisan migrate

# Seed test user for authentication

-   php artisan db:seed --class=DatabaseSeeder
    Test User Credentials:

Email: test@example.com
Password: password

🏃‍♂️ Running the Application
Backend (Laravel API)
Start Laravel development server

-   php artisan serve
    Server will be available at: http://localhost:8000
    Frontend (React with Vite)
    Start Vite development server (in new terminal)
-   npm run dev
    Vite server runs at: http://localhost:5173 (but use Laravel URL for the actual app)
    Access the Application

Open your browser to: http://localhost:8000
You'll be redirected to the login page

-   Login with: test@example.com / password
    You'll be redirected to the dashboard with the bug report form

🧪 Running Tests
Cypress (End-to-End Tests)
bash# Run Cypress tests in headless mode
npx cypress run

# Open Cypress GUI for interactive testing

npx cypress open
Cypress Test Coverage:

```
✅ Form renders correctly
✅ Validation prevents empty title submission
✅ Valid data submission works
✅ Success message displays
✅ Backend validation errors display
✅ Severity defaults to "Medium"
✅ Form resets after successful submission
✅ Handles slow API responses
✅ Handles API failures
```

React Testing Library (Unit/Integration Tests)
bash# Run all RTL tests
npm test

# Run tests in watch mode

npm run test:watch

# Run with coverage report

npm run test:coverage

# Run specific test file

npm test BugReportForm.test.jsx
RTL Test Coverage:

```
✅ Component renders with all fields
✅ Client-side validation prevents empty submissions
✅ Form submission with valid data
✅ Success message handling
✅ Backend validation error display
✅ Form reset functionality
✅ Loading states during submission
✅ Error clearing when user types
✅ General API error handling
```

Run All Tests
bash# Run both test suites
npm test && npx cypress run

```
📁 Project Structure
bug-reporter/
├── app/
│ ├── Http/Controllers/Api/
│ │ └── BugReportController.php # API endpoint for bug reports
│ └── Models/
│ └── BugReport.php # Eloquent model
├── resources/js/
│ ├── Components/
│ │ └── BugReportForm.jsx # Main React component
│ ├── Pages/
│ │ └── Dashboard.jsx # Dashboard page
│ └── **tests**/
│ └── BugReportForm.test.jsx # RTL tests
├── database/
│ ├── migrations/ # Database schema
│ └── database.sqlite # SQLite database file
├── cypress/
│ └── e2e/
│ └── bug-report.cy.js # Cypress E2E tests
├── routes/
│ ├── api.php # API routes
│ └── web.php # Web routes
└── README.md
```

🔧 API Endpoints
POST /api/bug-reports
Create a new bug report.

Request Body:
json{
"title": "Bug title (required, max 100 chars)",
"description": "Optional description",
"severity": "low|medium|high (defaults to medium)"
}

Success Response (201):
json{
"message": "Bug reported successfully!",
"bug_report": {
"id": 1,
"title": "Bug title",
"description": "Description",
"severity": "medium",
"created_at": "2025-01-01T12:00:00.000000Z"
}
}
Validation Error Response (422):
json{
"message": "The given data was invalid.",
"errors": {
"title": ["The title field is required."]
}
}
🧪 Testing Strategy
Two-Layer Testing Approach

React Testing Library (RTL) - Fast unit/integration tests

Tests component logic and user interactions
Mocks API calls for predictable testing
Focuses on accessibility and user-centric testing

Cypress - Full end-to-end tests

Tests complete user workflows
Real browser environment with actual API calls
Network interception for edge case testing

📝 Implementation Notes
Architecture Decisions

SQLite Database: Chosen for simplicity and portability - easy to set up without external dependencies
Laravel Breeze: Provides robust authentication scaffolding with React integration
Client + Server Validation: Client-side validation for UX, server-side for security
Inertia.js: Enables seamless Laravel-React integration with server-side routing

Key Features

Form Validation: Both client-side (immediate feedback) and server-side (security)
Error Handling: Graceful handling of network errors, validation errors, and loading states
Accessibility: Form uses proper labels, ARIA attributes, and semantic HTML
Responsive Design: Mobile-friendly interface with Tailwind CSS

Testing Considerations

Authentication: Tests use a seeded test user for consistent authentication
API Mocking: RTL tests mock axios calls; Cypress uses real API with interception for edge cases
Data Attributes: Components include data-cy attributes specifically for testing
Loading States: Tests verify loading indicators and disabled states during submissions

🚀 Production Considerations
For a production deployment, consider:

Database: Switch from SQLite to PostgreSQL/MySQL for better concurrent access
Environment Variables: Secure API keys and database credentials
Rate Limiting: Add API rate limiting for the bug report endpoint
CSRF Protection: Ensure CSRF tokens are properly handled in production
Error Logging: Implement proper error logging for debugging
Caching: Add Redis caching for better performance
Queue System: Handle email notifications via queued jobs

🛠 Development Commands
bash# Clear Laravel caches
php artisan route:clear
php artisan config:clear
php artisan cache:clear

# Reset database

php artisan migrate:fresh --seed

# Build for production

npm run build

# Check Laravel routes

php artisan route:list

# Run PHP linting

composer install --dev
./vendor/bin/phpstan analyze
