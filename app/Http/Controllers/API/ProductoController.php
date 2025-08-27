<?php
namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $productos = Producto::all();
        return response()->json($productos);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'referencia' => 'required|string|max:50|unique:productos',
            'categoria' => 'required|string|max:100',
            'precio' => 'required|numeric|min:0',
            'descripcion' => 'nullable|string',
            'imagen' => 'nullable|url',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $producto = Producto::create($request->all());
        return response()->json($producto, 201);
    }
    /**
     * Display the specified resource.
     */
    public function show(Producto $producto)
    {
        return response()->json($producto);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Producto $producto)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'sometimes|required|string|max:255',
            'referencia' => 'sometimes|required|string|max:50|unique:productos,referencia,' . $producto->id,
            'categoria' => 'sometimes|required|string|max:100',
            'precio' => 'sometimes|required|numeric|min:0',
            'descripcion' => 'nullable|string',
            'imagen' => 'nullable|url',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $producto->update($request->all());
        return response()->json($producto);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Producto $producto)
    {
        $producto->delete();
        return response()->json(null, 204);
    }
}