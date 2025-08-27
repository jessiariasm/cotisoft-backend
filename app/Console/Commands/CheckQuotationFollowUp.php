<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Cotizacion;
use App\Models\Setting;
use App\Models\User; // Agregado
use Illuminate\Support\Facades\Mail;
use App\Mail\QuotationFollowUpReminder;

class CheckQuotationFollowUp extends Command
{
    protected $signature = 'quotations:followup';
    protected $description = 'Check for quotations that need follow-up and send reminders';

    public function handle()
    {
        $days = Setting::where('key', 'follow_up_days')->value('value') ?? 7;

        $cotizaciones = Cotizacion::with('user') // Relación necesaria
            ->where('fecha_seguimiento', '<=', now()->addDays($days))
            ->where('estado', 'pendiente')
            ->get();

        foreach ($cotizaciones as $cotizacion) {
            // Acceder al email del vendedor a través de la relación
            Mail::to($cotizacion->user->email)->send(new QuotationFollowUpReminder($cotizacion));
        }

        $this->info('Recordatorios enviados: ' . $cotizaciones->count());
    }
}