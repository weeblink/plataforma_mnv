<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class HomeLayout extends Model
{

    protected $table = 'home_layout';
    protected $fillable = ['title', 'order'];

    public function contents(){
        return $this->hasMany(HomeLayoutContent::class, 'home_layout_id', 'id');
    }

    static function ListAllLayouts( ) : Collection {

        return HomeLayout::query()->orderBy('order', 'ASC')->get();
    }

    static function getDashboardMenus( $userId )
    {
        $allProducts = UserProduct::where('user_id', $userId)
            ->get(['user_id', 'course_id', 'extra_id', 'group_id']);

        $courses = $allProducts->pluck('course_id')->filter()->unique()->values()->all();
        $extras = $allProducts->pluck('extra_id')->filter()->unique()->values()->all();
        $mentorings = $allProducts->pluck('group_id')->filter()->unique()->values()->all();
        
        $courseData = Courses::select('id', 'image_url', 'price', 'promotional_price', 'title')
            ->get()
            ->keyBy('id')
            ->toArray();

        $extraData = Extra::select('id', 'image_url', 'price', 'promotional_price', 'title')
            ->get()
            ->keyBy('id')
            ->toArray();
        $mentorshipData = MentorshipGroup::with('mentorship:id,image_url')
            ->get()
            ->mapWithKeys(function ($group) {
                Log::debug($group);
                return [$group->id => [
                    'image_url' => $group->mentorship->image_url,
                    'price' => $group->price,
                    'title' => $group->title,
                    'promotional_price' => $group->price_promotional
                ]];
            })
            ->all();

        return HomeLayout::orderBy('order', 'ASC')
            ->get()
            ->map(function ($layout) use ($courses, $extras, $mentorings, $courseData, $extraData, $mentorshipData) {

                $layoutContents = $layout->contents;
                
                return [
                    'id' => $layout->id,
                    'title' => $layout->title,
                    'order' => $layout->order,
                    'created_at' => $layout->created_at,
                    'contents' => $layoutContents->map(function ($content) use ($courses, $extras, $mentorings, $courseData, $extraData, $mentorshipData) {

                        $productId = $content->product_id;
                        $isLock = true;
                        $urlImg = '';
                        $price = 0;
                        $pricePromotional = 0;
                        $title = '';
                        
                        switch ($content->type) {
                            case 'course':                                
                                $urlImg = $courseData[$productId]['image_url'] ?? '';
                                $price = $courseData[$productId]['price'] ?? 0;
                                $pricePromotional = $courseData[$productId]['promotional_price'] ?? 0;
                                $title = $courseData[$productId]['title'] ?? "";

                                $isLock = !isset(array_flip($courses)[$productId]) && $price > 0;
                                break;
                            case 'mentoring':                                
                                $urlImg = $mentorshipData[$productId]['image_url'] ?? '';
                                $price = $mentorshipData[$productId]['price'] ?? 0;
                                $pricePromotional = $mentorshipData[$productId]['promotional_price'] ?? 0;
                                $title = $mentorshipData[$productId]['title'] ?? "";

                                $isLock = !isset(array_flip($mentorings)[$productId]) && $price > 0;
                                break;
                            case 'extra':                                
                                $urlImg = $extraData[$productId]['image_url'] ?? '';
                                $price = $extraData[$productId]['price'] ?? 0;
                                $pricePromotional = $extraData[$productId]['promotional_price'] ?? 0;
                                $title = $extraData[$productId]['title'] ?? "";

                                $isLock = !isset(array_flip($extras)[$productId]) && $price > 0;
                                break;
                        }

                        return [
                            'id' => $content->id,
                            'type' => $content->type,
                            'product_id' => $productId,
                            'order' => $content->order,
                            'is_lock' => $isLock,
                            'image_url' => $urlImg,
                            'price'     => $price,
                            'price_promotional' => $pricePromotional,
                            'title' => $title
                        ];
                    })->values()->all()
                ];
            });
    }

    static function getNextPosition(  )
    {
        $lastPosition = self::orderBy('order', 'DESC')->first();

        if( !$lastPosition ) return 1;

        return ++$lastPosition->order;
    }

    public function getDetailsLayout(){

        $courseData = Courses::pluck('image_url', 'id')->all();
        $extraData = Extra::pluck('image_url', 'id')->all();
        $mentorshipData = MentorshipGroup::with('mentorship:id,image_url')
            ->get()
            ->mapWithKeys(function ($group) {
                return [$group->id => $group->mentorship->image_url];
            })
            ->all();

        return [
            'id'            => $this->id,
            'title'         => $this->title,
            'order'         => $this->order,
            'created_at'    => $this->created_at,
            'contents'      => HomeLayoutContent::query()
                                ->where('home_layout_id', $this->id)
                                ->orderBy('order', 'ASC')
                                ->get()
                                ->map(function($content) use ($courseData, $extraData, $mentorshipData) {

                $urlImg = '';
                        
                switch ($content->type) {
                    case 'course':
                        $urlImg = $courseData[$content->product_id] ?? '';
                        break;
                    case 'mentoring':
                        $urlImg = $mentorshipData[$content->product_id] ?? '';
                        break;
                    case 'extra':
                        $urlImg = $extraData[$content->product_id] ?? '';
                        break;
                }

                return [
                    'id' => $content->id,
                    'type' => $content->type,
                    'product_id' => $content->product_id,
                    'order' => $content->order,
                    'image_url' => $urlImg
                ];
            })
        ];
    }

    /**
     * Function to swap order of layouts
     * @param HomeLayout $homeSwap
     * @return bool
     */
    public function swapOrder(HomeLayout $homeSwap): bool
    {
        $oldPosition = $this->order;

        $this->order = $homeSwap->order;
        $homeSwap->order  = $oldPosition;

        return ($this->save() && $homeSwap->save());
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
}
