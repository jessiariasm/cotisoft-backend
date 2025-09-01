<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ClienteController;
use App\Http\Controllers\API\CotizacionController;
use App\Http\Controllers\API\ProductoController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\ReporteController;
use App\Http\Controllers\API\DashboardController;

// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas con Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // API Resources
    Route::apiResource('clientes', ClienteController::class);
    Route::apiResource('productos', ProductoController::class);
    Route::apiResource('cotizaciones', CotizacionController::class);
    Route::apiResource('usuarios', UserController::class)->except(['store']);

    // Rutas adicionales
    Route::put('/usuarios/{id}/toggle-status', [UserController::class, 'toggleStatus']);
    Route::get('/reportes/cotizaciones', [ReporteController::class, 'cotizacionesPorEstado']);
    Route::get('/reportes/ventas', [ReporteController::class, 'ventasPorVendedor']);
});

// Ruta de fallback para API no encontrada
Route::fallback(function () {
    return response()->json([
        'message' => 'Endpoint de API no encontrado. Verifica la URL y el método.'
    ], 404);
});

// Ruta de prueba
Route::get('/prueba', fn() => 'Hola desde API');