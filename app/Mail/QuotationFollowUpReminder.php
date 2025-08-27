<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class QuotationFollowUpReminder extends Mailable
{
    use Queueable, SerializesModels;

    public $cotizacion;

    /**
     * Create a new message instance.
     */
    public function __construct($cotizacion)
    {
        $this->cotizacion = $cotizacion;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Recordatorio de seguimiento de cotización #' . $this->cotizacion->codigo)
            ->view('emails.quotation_followup')
            ->with(['cotizacion' => $this->cotizacion]);
    }
}
