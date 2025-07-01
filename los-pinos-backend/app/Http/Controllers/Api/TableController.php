<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TableController extends Controller
{
    public function index()
    {
        return response()->json(Table::orderBy('id')->get());
    }

    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'tables' => 'required|array',
            'tables.*.id' => 'required|integer|exists:tables,id',
            'tables.*.name' => 'required|string|max:255',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                foreach ($validated['tables'] as $tableData) {
                    $table = Table::find($tableData['id']);
                    if ($table) {
                        // Temporalmente permite un nombre duplicado durante la transacción
                        // La validación final debe hacerse en el frontend o con una lógica más compleja
                        $table->name = $tableData['name'];
                        $table->save();
                    }
                }
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error durante la actualización en masa.', 'error' => $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Mesas actualizadas correctamente.']);
    }
    // --- MÉTODO STORE MODIFICADO ---
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tables,name', // El nombre debe ser único
            'capacity' => 'required|integer|min:1',
            'location' => 'required|string|in:salón,patio,aire libre',
        ]);
        
        $table = Table::create($validated);

        return response()->json($table, 201);
    }

    // --- MÉTODO UPDATE MODIFICADO ---
    public function update(Request $request, Table $table)
    {
        $validated = $request->validate([
             // Validamos que el nombre no se repita, excluyendo la mesa actual
            'name' => 'required|string|max:255|unique:tables,name,' . $table->id,
            'capacity' => 'required|integer|min:1',
            'location' => 'required|string|in:salón,patio,aire libre',
        ]);

        $table->update($validated);

        return response()->json($table);
    }

    // --- MÉTODO DESTROY (SIN CAMBIOS) ---
    public function destroy(Table $table)
    {
        if ($table->reservations()->where('status', '!=', 'completada')->exists()) {
            return response()->json(['message' => 'No se puede eliminar la mesa porque tiene reservas activas o pendientes.'], 409);
        }
        $table->delete();
        return response()->json(null, 204);
    }
}