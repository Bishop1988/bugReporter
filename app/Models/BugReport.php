<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BugReport extends Model
{
    protected $fillable = ['title', 'description', 'severity'];
    
    protected $casts = [
        'severity' => 'string',
    ];
}
