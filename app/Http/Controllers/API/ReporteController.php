<?php
namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\Cotizacion;
use App\Models\User;
use Illuminate\Http\Request;
class ReporteController extends Controller
{
    /**
     * Reporte de cotizaciones por estado
     */
    public function cotizacionesPorEstado(Request $request)
    {
        $estados = ['pendiente', 'enviada', 'ganada', 'perdida', 'vencida'];
        $reporte = [];
        foreach ($estados as $estado) {
            $count = Cotizacion::where('estado', $estado)->count();
            $reporte[$estado] = $count;
        }
        return response()->json($reporte);
    }
    /**
     * Reporte de ventas por vendedor
     */
    public function ventasPorVendedor(Request $request)
    {
        // Solo contamos cotizaciones ganadas
        $vendedores = User::where('role', 'vendedor')
            ->withCount([
                'cotizaciones as ventas' => function ($query) {
                    $query->where('estado', 'ganada');
                }
            ])
            ->get();
        return response()->json($vendedores);
    }
}