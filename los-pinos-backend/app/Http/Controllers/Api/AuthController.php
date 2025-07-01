<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller {
    public function login(Request $request) {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login exitoso',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
                // Devolvemos si el usuario debe cambiar su contraseña
                'must_change_password' => $user->password_changed_at === null
            ]);
        }
        return response()->json(['message' => 'Credenciales no autorizadas'], 401);
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada exitosamente']);
    }

    public function changePassword(Request $request) {
        $request->validate([
            'password' => ['required', 'confirmed', Password::min(8)]
        ]);

        $user = $request->user();
        $user->password = Hash::make($request->password);
        $user->password_changed_at = now();
        $user->save();

        return response()->json(['message' => 'Contraseña cambiada con éxito.']);
    }
}