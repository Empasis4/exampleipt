<?php

use App\Http\Controllers\BusinessController;

Route::post('/businesses', [BusinessController::class, 'store']);
Route::get('/businesses', [BusinessController::class, 'index']);
