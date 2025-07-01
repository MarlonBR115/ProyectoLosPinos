<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    // ... tu propiedad $fillable se queda como está ...
    protected $fillable = [
        'customer_name',
        'customer_email',
        'customer_phone',
        'reservation_datetime',
        'party_size',
        'table_id',
        'status',
        'notes',
    ];

    /**
     * Obtiene la mesa asociada con la reserva.
     * Esta función le dice a Laravel: "Una Reserva pertenece a una Mesa".
     */
    public function table()
    {
        return $this->belongsTo(Table::class);
    }
}