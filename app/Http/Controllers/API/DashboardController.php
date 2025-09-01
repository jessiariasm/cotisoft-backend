<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cotizacion;
use App\Models\Cliente;
use App\Models\User;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        try {
            $user = $request->user();

            // Estadísticas básicas del dashboard
            $stats = [
                'pendientes' => Cotizacion::where('estado', 'pendiente')->count(),
                'ganadas' => Cotizacion::where('estado', 'ganada')->count(),
                'clientes' => Cliente::count(),
                'usuarios' => User::count(),
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al cargar estadísticas',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}