<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cotizacion_productos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('empresa');
            $table->string('nit')->unique();
            $table->string('contacto');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cotizacion_productos');
    }
};
