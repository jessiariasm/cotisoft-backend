<?php
namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\Cotizacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class CotizacionController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $cotizaciones = Cotizacion::with('cliente', 'productos')
            ->when($user->role == 'vendedor', function ($query) use ($user) {
                return $query->where('user_id', $user->id);
            })
            ->get();
        return response()->json($cotizaciones);
    }
    public function store(Request $request)
    {
        // Validación y creación
    }
    public function show($id)
    {
        $cotizacion = Cotizacion::with('cliente', 'productos')->findOrFail($id);
        return response()->json($cotizacion);
    }
    public function update(Request $request, $id)
    {
        // Validación y actualización
    }
    public function destroy($id)
    {
        // Eliminar
    }
}