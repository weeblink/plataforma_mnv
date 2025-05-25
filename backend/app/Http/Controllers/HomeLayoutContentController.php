<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrUpdateHomeLayoutContent;
use App\Http\Requests\SwapOrderHomeLayout;
use App\Http\Requests\SwapOrderHomeLayoutContent;
use App\Models\HomeLayoutContent;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HomeLayoutContentController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrUpdateHomeLayoutContent $request)
    {
        try{

            $data = $request->only(['home_layout_id', 'type', 'product_id']);
            $data['order'] = HomeLayoutContent::getNextPosition();

            $homeLayoutContent = new HomeLayoutContent($data);

            if( !$homeLayoutContent->save() )
                return response()->json(['error' => "Não foi possível salvar esse novo conteúdo"], 500);

            return response()->json([
                'content'   => [
                    'id'                => $homeLayoutContent->id,
                    'home_layout_id'    => $homeLayoutContent->home_layout_id,
                    'type'              => $homeLayoutContent->type,
                    'product_id'        => $homeLayoutContent->product_id,
                    'order'             => $homeLayoutContent->order,
                ]
            ]);

        }catch(Exception $e){
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreOrUpdateHomeLayoutContent $request, $id)
    {
        try{

            $layoutContent = HomeLayoutContent::find($id);

            if(!$layoutContent)
                return response()->json(['error' => 'Não foi possível localizar o conteúdo desejado'], 404);

            $layoutContent->home_layout_id  = $request->home_layout_id;
            $layoutContent->type            = $request->type;
            $layoutContent->product_id      = $request->product_id;

            if(!$layoutContent->save())
                return response()->json(['error' => "Ocorreu um erro inesperado ao tentar atualizar o conteúdo"], 500);

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

            $layoutContent = HomeLayoutContent::find($id);

            if(!$layoutContent)
                return response()->json(['error' => 'Não foi possível localizar o conteúdo desejado'], 404);

            HomeLayoutContent::rearrangePosition($layoutContent->order);

            if( !$layoutContent->delete() )
                return response()->json(['error' => "Ocorreu um erro inesperado ao tentar remover o conteúdo"], 500);

            DB::commit();

            return response(null, 204);

        }catch(Exception $e){
            DB::rollBack();
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function swap( SwapOrderHomeLayoutContent $request ){
        DB::beginTransaction();

        try {
            $layout1 = HomeLayoutContent::find($request->input('layout_1'));
            $layout2 = HomeLayoutContent::find($request->input('layout_2'));

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
