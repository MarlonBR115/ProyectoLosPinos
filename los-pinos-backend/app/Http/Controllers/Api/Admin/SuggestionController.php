<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Suggestion;
use Illuminate\Http\Request;

class SuggestionController extends Controller
{
    public function index()
    {
        return Suggestion::with('menuItem')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'menu_item_id' => 'required|exists:menu_items,id',
            'day_of_week' => 'nullable|integer|between:0,6',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'is_active' => 'required|boolean',
        ]);

        $suggestion = Suggestion::create($validated);
        return response()->json($suggestion->load('menuItem'), 201);
    }

    public function update(Request $request, Suggestion $suggestion)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'menu_item_id' => 'required|exists:menu_items,id',
            'day_of_week' => 'nullable|integer|between:0,6',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'is_active' => 'required|boolean',
        ]);

        $suggestion->update($validated);
        return response()->json($suggestion->load('menuItem'));
    }

    public function destroy(Suggestion $suggestion)
    {
        $suggestion->delete();
        return response()->noContent();
    }
}