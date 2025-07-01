<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleCors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Origen de tu frontend. Asegúrate de que sea la URL EXACTA de tu frontend.
        // Puedes obtenerlo desde el .env si lo prefieres, como en config/cors.php
        $origin = env('FRONTEND_URL', 'http://localhost:5173'); // Lee del .env

        $headers = [
            'Access-Control-Allow-Origin'      => $origin, // Permite el origen de tu frontend
            'Access-Control-Allow-Methods'     => 'GET, POST, PUT, PATCH, DELETE, OPTIONS', // Métodos HTTP permitidos
            'Access-Control-Allow-Headers'     => 'Content-Type, X-Auth-Token, Origin, Authorization, Accept, X-Requested-With', // Encabezados permitidos
            'Access-Control-Allow-Credentials' => 'true', // Importante para cookies/autenticación
            'Access-Control-Max-Age'           => '86400', // Cachea la respuesta preflight por 24 horas
        ];

        // Maneja la solicitud OPTIONS (preflight)
        if ($request->isMethod('OPTIONS')) {
            return response()->json('OK', 200, $headers);
        }

        $response = $next($request);

        // Asegúrate de que la respuesta tenga los encabezados CORS
        foreach ($headers as $key => $value) {
            $response->headers->set($key, $value);
        }

        return $response;
    }
}