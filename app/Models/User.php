<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // 👈 Importar Sanctum

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // 👈 Agregar HasApiTokens

    protected $fillable = [
        'name',
        'email',
        'password',
        'role'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function cotizaciones()
    {
        return $this->hasMany(Cotizacion::class);
    }
}
