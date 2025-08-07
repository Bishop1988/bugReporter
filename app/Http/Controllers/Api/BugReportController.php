<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BugReport;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BugReportController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'nullable|string',
            'severity' => ['nullable', Rule::in(['low', 'medium', 'high'])],
        ]);

        $validated['severity'] = $validated['severity'] ?? 'medium';

        $bugReport = BugReport::create($validated);

        return response()->json([
            'message' => 'Bug reported successfully!',
            'bug_report' => $bugReport
        ], 201);
    }
}