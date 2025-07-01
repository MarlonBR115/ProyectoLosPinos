<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!\Illuminate\Support\Facades\Auth::check() || !in_array(\Illuminate\Support\Facades\Auth::user()->role, $roles)) {
            // Si el usuario no está logueado o su rol no está en la lista de roles permitidos...
            return response()->json(['message' => 'No tienes permiso para realizar esta acción.'], 403);
        }
        return $next($request);
    }
}