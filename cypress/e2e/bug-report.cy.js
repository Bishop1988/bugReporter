describe("Bug Report Form", () => {
    beforeEach(() => {
        cy.visit("/login");

        // Login with test user
        cy.get('input[name="email"]').type("test@example.com");
        cy.get('input[name="password"]').type("password");
        cy.get("button").click();

        // Should redirect to dashboard
        cy.url().should("include", "/dashboard");
    });

    it("form renders correctly", () => {
        cy.get('[data-cy="bug-report-form"]').should("be.visible");
        cy.get('[data-cy="title-input"]').should("be.visible");
        cy.get('[data-cy="description-input"]').should("be.visible");
        cy.get('[data-cy="severity-select"]').should("be.visible");
        cy.get('[data-cy="submit-button"]').should("be.visible");
    });

    it("severity defaults to Medium", () => {
        cy.get('[data-cy="severity-select"]').should("have.value", "medium");
    });

    it("validation prevents empty title", () => {
        cy.get('[data-cy="submit-button"]').click();
        cy.get('[data-cy="title-error"]').should("be.visible");
        cy.get('[data-cy="title-error"]').should(
            "contain",
            "Title is required"
        );
    });

    it("valid data is accepted and form submits", () => {
        cy.get('[data-cy="title-input"]').type("Test bug report");
        cy.get('[data-cy="description-input"]').type(
            "This is a test description"
        );
        cy.get('[data-cy="severity-select"]').select("high");

        cy.get('[data-cy="submit-button"]').click();

        cy.get('[data-cy="success-message"]').should("be.visible");
        cy.get('[data-cy="success-message"]').should(
            "contain",
            "Bug reported!"
        );
    });

    it("displays success message on submit", () => {
        cy.get('[data-cy="title-input"]').type("Another test bug");
        cy.get('[data-cy="submit-button"]').click();

        cy.get('[data-cy="success-message"]').should("be.visible");
        cy.get('[data-cy="success-message"]').should(
            "contain",
            "Bug reported!"
        );
    });

    it("form resets after successful submission", () => {
        cy.get('[data-cy="title-input"]').type("Test bug for reset");
        cy.get('[data-cy="description-input"]').type("Test description");
        cy.get('[data-cy="severity-select"]').select("low");

        cy.get('[data-cy="submit-button"]').click();

        // Wait for success message
        cy.get('[data-cy="success-message"]').should("be.visible");

        // Check form is reset
        cy.get('[data-cy="title-input"]').should("have.value", "");
        cy.get('[data-cy="description-input"]').should("have.value", "");
        cy.get('[data-cy="severity-select"]').should("have.value", "medium");
    });

    it("shows validation error message if backend returns error", () => {
        // Intercept the API call and force it to return validation errors
        cy.intercept("POST", "/api/bug-reports", {
            statusCode: 422,
            body: {
                message: "The given data was invalid.",
                errors: {
                    title: [
                        "The title must not be greater than 100 characters.",
                    ],
                },
            },
        }).as("validationError");

        // Fill form with invalid data (title too long)
        cy.get('[data-cy="title-input"]').type("A".repeat(101)); // 101 characters
        cy.get('[data-cy="submit-button"]').click();

        // Wait for the intercepted request
        cy.wait("@validationError");

        // Check that validation error is displayed
        cy.get('[data-cy="title-error"]').should("be.visible");
        cy.get('[data-cy="title-error"]').should(
            "contain",
            "must not be greater than 100 characters"
        );
    });

    it("handles slow API response", () => {
        // Intercept API call and add delay
        cy.intercept("POST", "/api/bug-reports", (req) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        statusCode: 201,
                        body: {
                            message: "Bug reported successfully!",
                            bug_report: {
                                id: 1,
                                title: "Test",
                                severity: "medium",
                            },
                        },
                    });
                }, 2000); // 2 second delay
            });
        }).as("slowResponse");

        cy.get('[data-cy="title-input"]').type("Test slow response");
        cy.get('[data-cy="submit-button"]').click();

        // Check that submit button shows loading state
        cy.get('[data-cy="submit-button"]').should("contain", "Submitting...");
        cy.get('[data-cy="submit-button"]').should("be.disabled");

        // Wait for response and check success
        cy.wait("@slowResponse");
        cy.get('[data-cy="success-message"]').should("be.visible");
        cy.get('[data-cy="submit-button"]').should("contain", "Report Bug");
    });

    it("handles API failure", () => {
        // Intercept API call and force server error
        cy.intercept("POST", "/api/bug-reports", {
            statusCode: 500,
            body: {
                message: "Server Error",
            },
        }).as("serverError");

        cy.get('[data-cy="title-input"]').type("Test server error");
        cy.get('[data-cy="submit-button"]').click();

        cy.wait("@serverError");

        // Should show generic error message (you'll need to add this to your component)
        cy.get('[data-cy="error-message"]').should("be.visible");
        cy.get('[data-cy="error-message"]').should(
            "contain",
            "An error occurred"
        );
    });
});
