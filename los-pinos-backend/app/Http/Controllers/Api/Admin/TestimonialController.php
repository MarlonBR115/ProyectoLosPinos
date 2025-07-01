<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller {
    // Muestra TODOS los testimonios al admin
    public function index() {
        return Testimonial::latest()->get();
    }

    // Permite al admin editar y APROBAR un testimonio
    public function update(Request $request, Testimonial $testimonial) {
        $validated = $request->validate([
            'author' => 'required|string|max:255',
            'quote' => 'required|string',
            'rating' => 'required|integer|between:1,5',
            'is_visible' => 'required|boolean',
        ]);
        $testimonial->update($validated);
        return response()->json($testimonial);
    }

    // Permite al admin borrar un testimonio
    public function destroy(Testimonial $testimonial) {
        $testimonial->delete();
        return response()->noContent();
    }
}