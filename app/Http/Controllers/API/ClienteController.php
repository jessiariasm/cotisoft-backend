<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse; // Importa JsonResponse
use Illuminate\Support\Facades\Validator;

class ClienteController extends Controller
{
    /**
     * Display a listing of clients.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        $clientes = Cliente::paginate(10);
        return response()->json($clientes);
    }

    /**
     * Store a newly created client in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'empresa' => 'required|string|max:255',
            'nit' => 'required|string|max:20|unique:clientes',
            'contacto' => 'required|email|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $cliente = Cliente::create($request->all());
        
        return response()->json([
            'message' => 'Cliente creado exitosamente',
            'data' => $cliente
        ], 201);
    }

    /**
     * Display the specified client.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id): JsonResponse
    {
        $cliente = Cliente::find($id);
        
        if (!$cliente) {
            return response()->json([
                'message' => 'Cliente no encontrado'
            ], 404);
        }
        
        return response()->json($cliente);
    }

    /**
     * Update the specified client in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id): JsonResponse
    {
        $cliente = Cliente::find($id);
        
        if (!$cliente) {
            return response()->json([
                'message' => 'Cliente no encontrado'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nombre' => 'sometimes|required|string|max:255',
            'empresa' => 'sometimes|required|string|max:255',
            'nit' => 'sometimes|required|string|max:20|unique:clientes,nit,'.$cliente->id,
            'contacto' => 'sometimes|required|email|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $cliente->update($request->all());
        
        return response()->json([
            'message' => 'Cliente actualizado exitosamente',
            'data' => $cliente
        ]);
    }

    /**
     * Remove the specified client from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        $cliente = Cliente::find($id);
        
        if (!$cliente) {
            return response()->json([
                'message' => 'Cliente no encontrado'
            ], 404);
        }

        if ($cliente->cotizaciones()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar el cliente porque tiene cotizaciones asociadas'
            ], 422);
        }

        $cliente->delete();
        
        return response()->json([
            'message' => 'Cliente eliminado exitosamente'
        ], 204);
    }
}