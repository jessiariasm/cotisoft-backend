<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Cotizacion extends Model
{
    use HasFactory;
    protected $fillable = ['cliente_id', 'user_id', 'codigo', 'fecha', 'fecha_seguimiento', 'estado', 'notas'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }
    public function vendedor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function productos()
    {
        return $this->belongsToMany(Producto::class, 'cotizacion_productos')
            ->withPivot('cantidad', 'precio_unitario')
            ->withTimestamps();
    }
}
