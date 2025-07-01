<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MenuItemController as PublicMenuItemController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TableStatusController;
use App\Http\Controllers\Api\SuggestionController as PublicSuggestionController;
use App\Http\Controllers\Api\TestimonialController as PublicTestimonialController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\Admin\MenuItemController as AdminMenuItemController;
use App\Http\Controllers\Api\Admin\SuggestionController as AdminSuggestionController;
use App\Http\Controllers\Api\Admin\TestimonialController as AdminTestimonialController;
use App\Http\Controllers\Api\Admin\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- Rutas Públicas (Accesibles por todos) ---
Route::get('/menu-items', [PublicMenuItemController::class, 'index']);
Route::post('/reservations', [ReservationController::class, 'store']);
Route::get('/tables', [TableStatusController::class, 'getAllTables']);
Route::get('/suggestions/active', [PublicSuggestionController::class, 'getActiveSuggestions']);
Route::get('/testimonials', [PublicTestimonialController::class, 'index']);
Route::post('/testimonials', [PublicTestimonialController::class, 'store']);
Route::post('/contact', [ContactController::class, 'send']);

// --- Ruta de Autenticación ---
Route::post('/login', [AuthController::class, 'login']);

// --- Rutas Protegidas (Requieren Login) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);
    Route::get('/user', fn(Request $request) => $request->user());

    // --- Rutas para Admin y Editores ---
    Route::apiResource('/admin/reservations', ReservationController::class)->except(['store']);
    Route::patch('/admin/reservations/{reservation}/confirm', [ReservationController::class, 'confirm']);
    
    Route::post('/admin/menu-items/{menuItem}', [AdminMenuItemController::class, 'updateWithImage']);
    Route::apiResource('/admin/menu-items', AdminMenuItemController::class);

    Route::apiResource('/admin/suggestions', AdminSuggestionController::class);

    // --- Rutas SOLO PARA ADMINS ---
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('/admin/testimonials', AdminTestimonialController::class)->except(['store', 'show']);
        Route::apiResource('/admin/users', UserController::class);
    });
});