<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Cliente;
use App\Models\Producto;
use App\Models\Cotizacion;
use App\Models\Setting;
class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Crear usuarios
        $admin = User::create([
            'name' => 'Administrador',
            'email' => 'admin@cotisoft.com',
            'password' => bcrypt('Admin123'),
            'role' => 'admin'
        ]);
        $vendedor1 = User::create([
            'name' => 'Vendedor Uno',
            'email' => 'vendedor1@cotisoft.com',
            'password' => bcrypt('Vendedor123'),
            'role' => 'vendedor'
        ]);
        $vendedor2 = User::create([
            'name' => 'Vendedor Dos',
            'email' => 'vendedor2@cotisoft.com',
            'password' => bcrypt('Vendedor123'),
            'role' => 'vendedor'
        ]);
        $gerente = User::create([
            'name' => 'Gerente',
            'email' => 'gerente@cotisoft.com',
            'password' => bcrypt('Gerente123'),
            'role' => 'gerente'
        ]);
        // Crear clientes
        $cliente1 = Cliente::create([
            'nombre' => 'Cliente A',
            'empresa' => 'Industrias ABC',
            'nit' => '123456-7',
            'contacto' => 'contacto@clientea.com'
        ]);
        $cliente2 = Cliente::create([
            'nombre' => 'Cliente B',
            'empresa' => 'Empresa XYZ',
            'nit' => '765432-1',
            'contacto' => 'info@clienteb.com'
        ]);
        // Crear productos
        $producto1 = Producto::create([
            'nombre' => 'Tablero Eléctrico 220V',
            'referencia' => 'TAB-220',
            'categoria' => 'Tableros',
            'precio' => 1200.50,
            'descripcion' => 'Tablero principal para instalaciones industriales con capacidad para 32 circuitos',
            'imagen' => 'https://via.placeholder.com/300'
        ]);
        $producto2 = Producto::create([
            'nombre' => 'Interruptor Termomagnético 63A',
            'referencia' => 'IT-63',
            'categoria' => 'Componentes',
            'precio' => 45.75,
            'descripcion' => 'Interruptor de seguridad para circuitos eléctricos de alta potencia',
            'imagen' => 'https://via.placeholder.com/300'
        ]);
        $producto3 = Producto::create([
            'nombre' => 'Caja Térmica 3 Polos',
            'referencia' => 'CT-3P',
            'categoria' => 'Componentes',
            'precio' => 28.90,
            'descripcion' => 'Caja de protección térmica para sistemas trifásicos',
            'imagen' => ''
        ]);
        // Crear cotizaciones
        $cotizacion1 = Cotizacion::create([
            'cliente_id' => $cliente1->id,
            'user_id' => $vendedor1->id,
            'codigo' => 'COT-001',
            'fecha' => now()->subDays(2),
            'fecha_seguimiento' => now()->addDays(7),
            'estado' => 'pendiente',
            'notas' => 'Cliente interesado en tableros eléctricos'
        ]);
        $cotizacion2 = Cotizacion::create([
            'cliente_id' => $cliente2->id,
            'user_id' => $vendedor2->id,
            'codigo' => 'COT-002',
            'fecha' => now()->subDay(),
            'fecha_seguimiento' => now()->addDays(7),
            'estado' => 'enviada',
            'notas' => 'Enviar recordatorio en 3 días'
        ]);
        // Asociar productos a cotizaciones
        $cotizacion1->productos()->attach([$producto1->id, $producto2->id], [
            ['cantidad' => 2, 'precio_unitario' => $producto1->precio],
            ['cantidad' => 5, 'precio_unitario' => $producto2->precio]
        ]);
        $cotizacion2->productos()->attach([$producto2->id, $producto3->id], [
            ['cantidad' => 10, 'precio_unitario' => $producto2->precio],
            ['cantidad' => 3, 'precio_unitario' => $producto3->precio]
        ]);
        // Configuración
        Setting::create([
            'key' => 'follow_up_days',
            'value' => '7'
        ]);
    }
}