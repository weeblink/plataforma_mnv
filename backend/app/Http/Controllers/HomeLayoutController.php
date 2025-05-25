<?php

namespace App\Http\Controllers;

use App\Http\Requests\home_layout\StoreOrUpdateHomeLayout;
use App\Http\Requests\SwapOrderHomeLayout;
use App\Models\HomeLayout;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HomeLayoutController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try{

            return response()->json([
                'layouts'   => HomeLayout::ListAllLayouts()
            ]);

        }catch(Exception $e){
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrUpdateHomeLayout $request)
    {
        try{

            $newHomeLayout = new HomeLayout([
                'title'     => $request->title,
                'order'     => HomeLayout::getNextPosition()
            ]);

            if( ! $newHomeLayout->save() )
                return response()->json(['error'    => "Ocorreu um erro inesperado ao tentar criar um novo layout"], 400);

            return response()->json([
                'layout'    => [
                    'id'    => $newHomeLayout->id,
                    'title' => $newHomeLayout->title,
                    'order' => $newHomeLayout->order
                ]
            ]);

        }catch(Exception $e){
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        try{

            $homeLayout = HomeLayout::find($id);

            if( !$homeLayout ) 
                return response()->json(['error' => "Não foi possível localizar o layout desejado"], 404);

            return response()->json( $homeLayout->getDetailsLayout() );

        }catch(Exception $e){
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(StoreOrUpdateHomeLayout $request, $id)
    {
        try{

            $homeLayout = HomeLayout::find($id);

            if( !$homeLayout ) 
                return response()->json(['error' => "Não foi possível localizar o layout desejado"], 404);

            $homeLayout->title = $request->title;
            $homeLayout->order = $request->order ?? HomeLayout::getNextPosition();

            if( !$homeLayout->save() )
                return response()->json(['error' => "Ocorreu um erro inesperado ao tentar editar o layout"], 500);

            return response(null, 204);

        }catch(Exception $e){
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {

        DB::beginTransaction();

        try{

            $homeLayout = HomeLayout::find($id);

            if( !$homeLayout ) 
                return response()->json(['error' => "Não foi possível localizar o layout desejado"], 404);

            HomeLayout::rearrangePosition($homeLayout->order);

            if( !$homeLayout->delete() )
                return response()->json(['error' => "Ocorreu um erro inesperado ao tentar remover layout"], 204);

            DB::commit();

            return response(null, 204);

        }catch(Exception $e){

            DB::rollBack();

            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function swap( SwapOrderHomeLayout $request ){
        DB::beginTransaction();

        try {
            $layout1 = HomeLayout::find($request->input('layout_1'));
            $layout2 = HomeLayout::find($request->input('layout_2'));

            if (!$layout1 || !$layout2) {
                throw new \Exception("One or both layout not found.");
            }

            if (!$layout1->swapOrder($layout2)) {
                throw new \Exception("An error occurred while swapping layout order.");
            }

            DB::commit();

            return response()->json([
                'message' => "Layout order swapped successfully"
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'An unknown error occurred while updating banners.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
