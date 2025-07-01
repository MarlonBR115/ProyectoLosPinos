<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Suggestion;
use Carbon\Carbon;
use Illuminate\Http\Request;

class SuggestionController extends Controller
{
    /**
     * Obtiene las sugerencias activas basadas en la hora y día actual.
     */
    public function getActiveSuggestions()
    {
        // Usamos la zona horaria de Lima para asegurar que la hora sea la correcta.
        $now = Carbon::now('America/Lima');
        $dayOfWeek = $now->dayOfWeek; // 0=Domingo, 1=Lunes...
        $currentTime = $now->format('H:i:s');

        $suggestions = Suggestion::with('menuItem')
            ->where('is_active', true)
            ->where(function ($query) use ($dayOfWeek, $currentTime) {
                // Busca sugerencias que coincidan con el día y la hora actual
                $query->where(function ($q) use ($dayOfWeek, $currentTime) {
                    $q->where('day_of_week', $dayOfWeek)
                      ->where('start_time', '<=', $currentTime)
                      ->where('end_time', '>=', $currentTime);
                })
                // O busca sugerencias que sean para cualquier día, pero que coincidan con la hora
                ->orWhere(function ($q) use ($currentTime) {
                    $q->whereNull('day_of_week')
                      ->where('start_time', '<=', $currentTime)
                      ->where('end_time', '>=', $currentTime);
                });
            })
            ->get();

        return response()->json($suggestions);
    }
}