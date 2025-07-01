<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('tables')->truncate();

        $tables = [];
        for ($i = 1; $i <= 35; $i++) {
            $location = '';
            if ($i >= 1 && $i <= 8) {
                $location = 'salón';
            } elseif ($i >= 9 && $i <= 15) {
                $location = 'patio';
            } else {
                $location = 'aire libre';
            }

            // Asignamos una capacidad por defecto, puedes ajustarla si es necesario
            $capacity = 4;

            $tables[] = [
                'name' => 'Mesa ' . $i,
                'capacity' => $capacity,
                'location' => $location,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('tables')->insert($tables);
    }
}