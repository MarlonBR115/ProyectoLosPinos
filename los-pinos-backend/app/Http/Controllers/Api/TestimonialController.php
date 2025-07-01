<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller {
    // Obtiene los testimonios VISIBLES para la página de inicio
    public function index() {
        return Testimonial::where('is_visible', true)->latest()->take(5)->get();
    }
    // Guarda un nuevo testimonio enviado por un cliente (siempre como no visible)
    public function store(Request $request) {
        $validated = $request->validate([
            'author' => 'required|string|max:255',
            'quote' => 'required|string|max:1000',
            'rating' => 'required|integer|between:1,5',
        ]);
        $testimonial = Testimonial::create($validated);
        return response()->json($testimonial, 201);
    }
}