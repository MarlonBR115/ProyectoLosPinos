<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * ---> ESTA ES LA MODIFICACIÓN CLAVE <---
     * Le decimos a Laravel que estos campos se pueden rellenar de forma masiva.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'capacity',
        'location',
    ];

    /**
     * Get the reservations for the table.
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}