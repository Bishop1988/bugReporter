<?php
use App\Http\Controllers\Api\BugReportController;

Route::post('/bug-reports', [BugReportController::class, 'store']);
