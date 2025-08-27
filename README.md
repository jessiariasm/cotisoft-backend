# Cotisoft - Guía de Implementación

## 1. Configuración Inicial

1. Instalar Laragon (https://laragon.org/download)
2. Iniciar Laragon y activar Apache/MySQL
3. Crear carpeta del proyecto: `C:\laragon\www\cotisoft`

## 2. Base de Datos

### phpMyAdmin:

1. Abrir http://localhost/phpmyadmin
2. Click en "Nueva base de datos":
    - Nombre: `cotisoft_db`
    - Cotejamiento: `utf8mb4_unicode_ci`
3. Importar SQL:
    - Seleccionar base de datos
    - Click en "Importar"
    - Seleccionar `cotisoft-sql.sql`
    - Click "Continuar"

### MySQL Workbench:

1. Abrir Workbench
2. Crear nueva conexión:
    - Hostname: 127.0.0.1
    - Port: 3306
    - Username: root (password vacío)
3. Ejecutar script:
    - File > Run SQL Script
    - Seleccionar `cotisoft-sql.sql`

## 3. Proyecto Laravel

```bash
cd C:\laragon\www\cotisoft
composer create-project laravel/laravel .
cp .env.example .env
php artisan key:generate
```
