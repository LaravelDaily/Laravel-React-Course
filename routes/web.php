<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::view('/', 'layouts.app');

Route::post('login', [\App\Http\Controllers\Auth\LoginController::class, 'store']);
Route::post('logout', [\App\Http\Controllers\Auth\LoginController::class, 'destroy']);
Route::post('register', [\App\Http\Controllers\Auth\RegisteredUserController::class, 'store']);

Route::view('/{any?}', 'layouts.app')->where('any', '.*');
