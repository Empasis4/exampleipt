<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;

Route::get('/contacts', [ContactController::class, 'index']);   // GET all
Route::post('/contacts', [ContactController::class, 'store']);  // POST create
Route::put('/contacts/{id}', [ContactController::class, 'update']); // PUT update
Route::delete('/contacts/{id}', [ContactController::class, 'destroy']); // DELETE
