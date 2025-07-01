<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller {
    public function send(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:2000',
        ]);

        // Nota: Para que esto funcione, debes configurar tus credenciales de correo
        // en el archivo .env de tu proyecto de Laravel.
        Mail::raw($validated['message'], function ($mail) use ($validated) {
            $mail->to(env('ADMIN_EMAIL_ADDRESS', 'admin@lospinos.com'))
                 ->from($validated['email'], $validated['name'])
                 ->subject('Nuevo Mensaje de Contacto desde la Web');
        });

        return response()->json(['message' => 'Mensaje enviado con éxito.']);
    }
}