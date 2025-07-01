<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Table;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReservationController extends Controller
{
    public function index()
    {
        $reservations = Reservation::with('table')->orderBy('reservation_datetime', 'desc')->get();
        return response()->json($reservations);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'reservation_datetime' => 'required|date_format:Y-m-d H:i:s|after_or_equal:now',
            'party_size' => 'required|integer|min:1',
            'table_id' => 'required|integer|exists:tables,id',
        ]);

        $table = \App\Models\Table::find($validatedData['table_id']);

        // Verificación 1: ¿La mesa tiene capacidad suficiente?
        if ($table->capacity < $validatedData['party_size']) {
            return response()->json(['message' => 'La mesa seleccionada no tiene capacidad suficiente para el número de personas indicado.'], 409);
        }

        // Verificación 2: ¿La mesa está disponible en ese horario?
        $requestedTime = \Carbon\Carbon::parse($validatedData['reservation_datetime']);
        $windowStart = $requestedTime->copy()->subHours(2);
        $windowEnd = $requestedTime->copy()->addHours(2);

        $isBooked = \App\Models\Reservation::where('table_id', $validatedData['table_id'])
                            ->whereBetween('reservation_datetime', [$windowStart, $windowEnd])
                            ->exists();

        if ($isBooked) {
            return response()->json(['message' => 'Lo sentimos, la mesa seleccionada ya no está disponible en ese horario. Por favor, elija otra.'], 409);
        }

        $reservation = \App\Models\Reservation::create([
            'customer_name' => $validatedData['customer_name'],
            'customer_email' => $validatedData['customer_email'],
            'customer_phone' => $validatedData['customer_phone'],
            'reservation_datetime' => $validatedData['reservation_datetime'],
            'party_size' => $validatedData['party_size'],
            'table_id' => $validatedData['table_id'],
            'status' => 'pending',
        ]);
        return response()->json(['message' => '¡Reserva confirmada con éxito!', 'reservation' => $reservation], 201);
    }

    public function update(Request $request, Reservation $reservation)
    {
        $validatedData = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'reservation_datetime' => 'required|date_format:Y-m-d H:i:s',
            'party_size' => 'required|integer|min:1',
        ]);

        if (Carbon::parse($validatedData['reservation_datetime'])->isPast()) {
            return response()->json([
                'message' => 'The reservation datetime field must be a date after or equal to "now".',
                'errors' => ['reservation_datetime' => ['La fecha de la reserva no puede ser en el pasado.']]
            ], 422);
        }

        $reservation->update($validatedData);
        return response()->json($reservation->load('table'));
    }

    public function destroy(Reservation $reservation)
    {
        $reservation->delete();
        return response()->noContent();
    }

    public function confirm(Reservation $reservation)
    {
        // Cambiamos el estado de la reserva a 'confirmed'
        $reservation->status = 'confirmed';
        $reservation->save();

        // Devolvemos la reserva actualizada
        return response()->json($reservation->load('table'));
    }
}