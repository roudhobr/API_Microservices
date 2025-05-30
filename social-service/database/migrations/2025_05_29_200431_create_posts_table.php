<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('posts', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('user_id');
        $table->string('type');
        $table->text('content');
        $table->string('media_url')->nullable();
        $table->string('song_title')->nullable();
        $table->string('artist')->nullable();
        $table->string('album')->nullable();
        $table->unsignedBigInteger('playlist_id')->nullable();
        $table->unsignedBigInteger('timeline_id')->nullable();
        $table->boolean('is_public')->default(true);
        $table->integer('likes_count')->default(0);
        $table->integer('comments_count')->default(0);
        $table->integer('shares_count')->default(0);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
