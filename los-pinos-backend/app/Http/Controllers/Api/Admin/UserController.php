<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller {
    public function index() {
        return User::all();
    }

    public function store(Request $request) {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', Rules\Password::defaults()],
            'role' => ['required', 'string', 'in:admin,editor'], // Validar el rol
        ]);
    
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role, // Asignar rol
        ]);
        return response()->json($user, 201);
    }
    
    public function update(Request $request, User $user) {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class.',email,'.$user->id],
            'role' => ['required', 'string', 'in:admin,editor'], // Validar el rol
        ]);
        // No permitir que un admin se quite el rol a sí mismo si es el único admin
        if ($user->id === auth()->id() && $user->role === 'admin' && $request->role !== 'admin') {
            if (User::where('role', 'admin')->count() <= 1) {
                return response()->json(['message' => 'No puedes quitar el rol de administrador al único administrador existente.'], 403);
            }
        }
        $user->update($request->only('name', 'email', 'role'));
        return response()->json($user);
    }

    public function destroy(User $user) {
        // Prevenir que el admin principal se borre a sí mismo
        // ===== LÍNEA CORREGIDA =====
        if ($user->id === auth()->user()->id) {
            return response()->json(['message' => 'No puedes eliminar tu propio usuario.'], 403);
        }
        $user->delete();
        return response()->noContent();
    }
}