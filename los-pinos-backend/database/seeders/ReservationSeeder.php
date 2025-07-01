<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Reservation;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        Reservation::truncate();

        Reservation::create([
            'customer_name' => 'Ana Torres',
            'customer_email' => 'ana.t@correo.com',
            'customer_phone' => '999888777',
            'reservation_datetime' => now()->addDay()->setTime(13, 0, 0),
            'party_size' => 2,
            'table_id' => 1,
            'status' => 'confirmed',
        ]);
        Reservation::create([
            'customer_name' => 'Carlos Burgos',
            'customer_email' => 'carlos.b@correo.com',
            'customer_phone' => '977666555',
            'reservation_datetime' => now()->addDay()->setTime(20, 0, 0),
            'party_size' => 4,
            'table_id' => 2,
            'status' => 'confirmed',
        ]);
    }
}