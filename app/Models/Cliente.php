<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cliente extends Model
{
    protected $fillable = ['nombre', 'empresa', 'nit', 'contacto'];
    
    /**
     * Obtener las cotizaciones del cliente.
     */
    public function cotizaciones(): HasMany
    {
        return $this->hasMany(Cotizacion::class);
    }
}