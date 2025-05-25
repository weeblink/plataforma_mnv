<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CredentialsCheckout extends Model
{
    use HasFactory;

    protected $table = 'credentials_checkout';
    protected $fillable = [
        'app_name',
        'app_id',
        'token',
        'cliente_id',
        'cliente_secret',
        'expires_in'
    ];

    public function payments()
    {
        $this->belongsToMany(Payment::class, 'payments', 'id', 'checkout_id' );
    }

    /**
     * Function to config new credentials
     * @return void
     * @throws Exception
     */
    public function configCredentials(  ): void
    {

        self::query()->delete();

        if( !$this->save() )
            throw new Exception("An error occured while trying to save credentials");
    }

    /**
     * Function to list all credentials
     * @return Collection
     */
    static function listAll(  ): Collection
    {
        return self::query()->get([
            'app_name',
            'app_id',
            'token',
            'cliente_id',
            'cliente_secret',
            'expires_in'
        ]);
    }
}
