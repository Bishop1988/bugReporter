import React, { useState } from "react";
import axios from "axios";

export default function BugReportForm() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        severity: "medium",
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        setSuccessMessage("");

        try {
            await axios.post("/api/bug-reports", formData, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            });

            setSuccessMessage("Bug reported!");
            // Reset form
            setFormData({
                title: "",
                description: "",
                severity: "medium",
            });
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: "An error occurred. Please try again." });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Report a Bug
            </h2>

            {successMessage && (
                <div
                    className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded"
                    data-cy="success-message"
                >
                    {successMessage}
                </div>
            )}

            {errors.general && (
                <div
                    className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
                    data-cy="error-message"
                >
                    {errors.general}
                </div>
            )}

            <form onSubmit={handleSubmit} data-cy="bug-report-form">
                <div className="mb-4">
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.title ? "border-red-500" : "border-gray-300"
                        }`}
                        data-cy="title-input"
                    />
                    {errors.title && (
                        <p
                            className="mt-1 text-sm text-red-600"
                            data-cy="title-error"
                        >
                            {errors.title[0]}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        data-cy="description-input"
                    />
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="severity"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Severity
                    </label>
                    <select
                        id="severity"
                        name="severity"
                        value={formData.severity}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        data-cy="severity-select"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                        isSubmitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }`}
                    data-cy="submit-button"
                >
                    {isSubmitting ? "Submitting..." : "Report Bug"}
                </button>
            </form>
        </div>
    );
}
