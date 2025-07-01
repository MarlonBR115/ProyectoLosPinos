<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Table;
use App\Models\Reservation;
use Carbon\Carbon;

class TableStatusController extends Controller
{
    public function getStatus(Request $request)
    {
        $validated = $request->validate([
            'datetime' => 'required|date_format:Y-m-d H:i:s',
            'party_size' => 'required|integer|min:1',
        ]);

        $requestedTime = Carbon::parse($validated['datetime']);
        $partySize = (int) $validated['party_size']; // Aseguramos que sea un entero
        
        $windowStart = $requestedTime->copy()->subHours(2);
        $windowEnd = $requestedTime->copy()->addHours(2);

        $bookedTableIds = Reservation::whereBetween('reservation_datetime', [$windowStart, $windowEnd])
                                    ->pluck('table_id')
                                    ->toArray();

        $tables = Table::all()->map(function ($table) use ($bookedTableIds, $partySize) {
            if (in_array($table->id, $bookedTableIds)) {
                $table->status = 'occupied';
            } elseif ($table->capacity < $partySize) {
                $table->status = 'unavailable';
            } else {
                $table->status = 'available';
            }
            return $table;
        });

        return response()->json($tables);
    }

    public function getAllTables()
    {
        return \App\Models\Table::orderBy('id')->get();
    }
}