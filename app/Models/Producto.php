<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Producto extends Model
{
    use HasFactory;
    protected $fillable = ['nombre', 'referencia', 'categoria', 'precio', 'descripcion', 'imagen'];
    public function cotizaciones()
    {
        return $this->belongsToMany(Cotizacion::class, 'cotizacion_productos')
            ->withPivot('cantidad', 'precio_unitario')
            ->withTimestamps();
    }
}
