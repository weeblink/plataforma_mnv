<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeLayoutContent extends Model
{
    protected $table = 'home_layout_contents';
    protected $fillable = ['home_layout_id', 'type', 'product_id', 'order'];

    public function layout(){
        return $this->belongsTo(HomeLayout::class, 'home_layout_id', 'id');
    }

    /**
     * Function to rearrange position
     * @param $deletedPosition
     * @return void
     */
    static function rearrangePosition($deletedPosition): void
    {
        self::where('order', '>', $deletedPosition)
            ->orderBy('order', 'asc')
            ->decrement('order', 1);
    }

    static function getNextPosition(  )
    {
        $lastPosition = self::orderBy('order', 'DESC')->first();

        if( !$lastPosition ) return 1;

        return ++$lastPosition->order;
    }

    /**
     * Function to swap order of layouts
     * @param HomeLayout $homeSwap
     * @return bool
     */
    public function swapOrder(HomeLayoutContent $homeSwap): bool
    {
        $oldPosition = $this->order;

        $this->order = $homeSwap->order;
        $homeSwap->order  = $oldPosition;

        return ($this->save() && $homeSwap->save());
    }
}
