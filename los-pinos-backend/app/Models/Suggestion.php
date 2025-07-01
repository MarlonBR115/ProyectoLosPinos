<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Suggestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'menu_item_id',
        'day_of_week',
        'start_time',
        'end_time',
        'is_active',
    ];

    /**
     * Define la relación con el MenuItem.
     */
    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class);
    }
}