<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ListController;
use App\Http\Controllers\CategoryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::options('/{any}', function () {
    return response()->json([], 204);
})->where('any', '.*');

Route::middleware(['firebase.auth'])->group(function () {
    Route::get('/v1/lists', [ListController::class, 'index']);
    Route::post('/v1/lists', [ListController::class, 'store']);
    Route::delete('/v1/lists/{id}', [ListController::class, 'destroy']);
    Route::get('/v1/categories', [CategoryController::class, 'index']);
});
