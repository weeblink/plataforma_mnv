<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('home_layout_contents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('home_layout_id');
            $table->enum('type', ['course', 'mentoring', 'extra']);
            $table->uuid('product_id');
            $table->integer('order');
            $table->timestamps();

            $table->foreign('home_layout_id')->references('id')->on('home_layout')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('home_layout_contents', function (Blueprint $table) {
            $table->dropForeign(['home_layout_id']);
            $table->dropIfExists();
        });
    }
};
