import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/user-event";
import axios from "axios";
import BugReportForm from "@/Components/BugReportForm";

jest.mock("axios");
const mockedAxios = axios;

let user;

describe("BugReportForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        user = userEvent.setup();
    });

    test("renders form with all required fields", () => {
        render(<BugReportForm />);

        expect(
            screen.getByRole("heading", { name: /report a bug/i })
        ).toBeInTheDocument();
        expect(screen.getByLabelText(/title \*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/severity/i)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /report bug/i })
        ).toBeInTheDocument();
    });

    test("severity field defaults to medium", () => {
        render(<BugReportForm />);

        const severitySelect = screen.getByLabelText(/severity/i);
        expect(severitySelect).toHaveValue("medium");
    });

    test("prevents form submission when title is empty", async () => {
        render(<BugReportForm />);

        const submitButton = screen.getByRole("button", {
            name: /report bug/i,
        });
        await user.click(submitButton);

        expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    test("submits form with valid data", async () => {
        mockedAxios.post.mockResolvedValue({
            data: { message: "Bug reported successfully!" },
        });

        render(<BugReportForm />);

        await user.type(screen.getByLabelText(/title \*/i), "Test bug title");
        await user.type(
            screen.getByLabelText(/description/i),
            "Test description"
        );
        await user.selectOptions(screen.getByLabelText(/severity/i), "high");

        await user.click(screen.getByRole("button", { name: /report bug/i }));

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith(
                "/api/bug-reports",
                {
                    title: "Test bug title",
                    description: "Test description",
                    severity: "high",
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                }
            );
        });
    });

    test("displays success message on successful submission", async () => {
        mockedAxios.post.mockResolvedValue({
            data: { message: "Bug reported successfully!" },
        });

        render(<BugReportForm />);

        await user.type(screen.getByLabelText(/title \*/i), "Test bug");
        await user.click(screen.getByRole("button", { name: /report bug/i }));

        await waitFor(() => {
            expect(screen.getByText("Bug reported!")).toBeInTheDocument();
        });
    });

    test("displays validation errors from backend", async () => {
        mockedAxios.post.mockRejectedValue({
            response: {
                data: {
                    errors: {
                        title: [
                            "The title must not be greater than 100 characters.",
                        ],
                    },
                },
            },
        });

        render(<BugReportForm />);

        await user.type(screen.getByLabelText(/title \*/i), "A".repeat(101)); // 101 chars - too long
        await user.click(screen.getByRole("button", { name: /report bug/i }));

        await waitFor(() => {
            expect(
                screen.getByText(
                    "The title must not be greater than 100 characters."
                )
            ).toBeInTheDocument();
        });
    });

    test("resets form after successful submission", async () => {
        mockedAxios.post.mockResolvedValue({
            data: { message: "Bug reported successfully!" },
        });

        render(<BugReportForm />);

        const titleInput = screen.getByLabelText(/title \*/i);
        const descriptionInput = screen.getByLabelText(/description/i);
        const severitySelect = screen.getByLabelText(/severity/i);

        await user.type(titleInput, "Test bug title");
        await user.type(descriptionInput, "Test description");
        await user.selectOptions(severitySelect, "low");

        await user.click(screen.getByRole("button", { name: /report bug/i }));

        await waitFor(() => {
            expect(screen.getByText("Bug reported!")).toBeInTheDocument();
        });

        expect(titleInput).toHaveValue("");
        expect(descriptionInput).toHaveValue("");
        expect(severitySelect).toHaveValue("medium");
    });

    test("shows loading state during form submission", async () => {
        mockedAxios.post.mockImplementation(
            () =>
                new Promise((resolve) =>
                    setTimeout(() => resolve({ data: {} }), 100)
                )
        );

        render(<BugReportForm />);

        await user.type(screen.getByLabelText(/title \*/i), "Test bug");

        const submitButton = screen.getByRole("button", {
            name: /report bug/i,
        });
        await user.click(submitButton);

        expect(
            screen.getByRole("button", { name: /submitting\.\.\./i })
        ).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeDisabled();

        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: /report bug/i })
            ).toBeInTheDocument();
        });
    });

    test("handles general API errors", async () => {
        mockedAxios.post.mockRejectedValue({
            response: {
                status: 500,
                data: { message: "Server Error" },
            },
        });

        render(<BugReportForm />);

        await user.type(screen.getByLabelText(/title \*/i), "Test bug");
        await user.click(screen.getByRole("button", { name: /report bug/i }));

        await waitFor(() => {
            expect(
                screen.getByText("An error occurred. Please try again.")
            ).toBeInTheDocument();
        });
    });

    test("clears field errors when user starts typing", async () => {
        render(<BugReportForm />);

        await user.click(screen.getByRole("button", { name: /report bug/i }));

        await waitFor(() => {
            expect(screen.getByText("Title is required.")).toBeInTheDocument();
        });

        await user.type(screen.getByLabelText(/title \*/i), "New title");

        expect(
            screen.queryByText("Title is required.")
        ).not.toBeInTheDocument();
    });

    test("success message is removed when user starts typing", async () => {
        render(<BugReportForm />);

        await user.type(
            screen.getByLabelText(/title \*/i),
            "Test success message removal"
        );
        await user.click(screen.getByRole("button", { name: /report bug/i }));

        waitFor(() => {
            expect(screen.getByText("Bug reported!").toBeInTheDocument());
        });

        await user.type(screen.getByLabelText(/title \*/i), "T");

        waitFor(() => {
            expect(screen.getByText("Bug reported!").not.toBeInTheDocument());
        });
    });
});
