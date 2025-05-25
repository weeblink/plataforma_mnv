<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrUpdateHomeLayoutContent extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'home_layout_id'    => 'required|exists:home_layout,id',
            'type'              => 'required|in:course,mentoring,extra',
            'product_id'        => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'type.in' => 'O tipo de conteúdo deve ser: course, mentoring, extra',
        ];
    }
}
