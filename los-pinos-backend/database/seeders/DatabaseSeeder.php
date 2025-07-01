<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema; // <-- 1. Importa la clase Schema

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 2. Desactivamos las restricciones de clave externa
        Schema::disableForeignKeyConstraints();

        // 3. Llamamos a nuestros seeders
        $this->call([
            MenuItemSeeder::class,
            TableSeeder::class,
            //ReservationSeeder::class,
        ]);

        // 4. Creamos el usuario de prueba
        User::factory()->create([
            'name' => 'Admin Los Pinos',
            'email' => 'admin@lospinos.com',
            'role' => 'admin',
        ]);

        // 5. Volvemos a activar las restricciones
        Schema::enableForeignKeyConstraints();
    }
}