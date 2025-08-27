<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ClienteController; // Importa el controlador
use App\Http\Controllers\API\CotizacionController;
use App\Http\Controllers\API\ProductoController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\ReporteController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Ruta pública de autenticación
Route::post('/login', [AuthController::class, 'login']);

// Grupo de rutas protegidas por autenticación Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Rutas CRUD para clientes
    Route::apiResource('clientes', ClienteController::class);
    
    // Rutas para otros recursos
    Route::apiResource('cotizaciones', CotizacionController::class);
    Route::apiResource('productos', ProductoController::class)->middleware('role:admin');
    Route::apiResource('usuarios', UserController::class)->middleware('role:admin');
    
    // Rutas para reportes (gerente/admin)
    Route::prefix('reportes')->middleware('role:gerente,admin')->group(function () {
        Route::get('/cotizaciones', [ReporteController::class, 'cotizacionesPorEstado']);
        Route::get('/ventas', [ReporteController::class, 'ventasPorVendedor']);
    });
    
    // Ruta de logout (si la necesitas)
    Route::post('/logout', [AuthController::class, 'logout']);
});