<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AllowAccessLeadRequest extends FormRequest
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
            'course_id'     => 'nullable',
            'extra_id'      => 'nullable',
            'group_id'      => 'nullable',
            'type_product'  => 'nullable'
        ];
    }
}
