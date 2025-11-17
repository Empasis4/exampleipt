<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\AcademicYearController;

Route::get('/contacts', [ContactController::class, 'index']);   // GET all
Route::post('/contacts', [ContactController::class, 'store']);  // POST create
Route::put('/contacts/{id}', [ContactController::class, 'update']); // PUT update
Route::delete('/contacts/{id}', [ContactController::class, 'destroy']); // DELETE

// Students API
Route::get('/students', [StudentController::class, 'index']);
Route::post('/students', [StudentController::class, 'store']);
Route::get('/students/{id}', [StudentController::class, 'show']);
Route::put('/students/{id}', [StudentController::class, 'update']);
Route::delete('/students/{id}', [StudentController::class, 'destroy']);

// Faculties API
Route::get('/faculties', [FacultyController::class, 'index']);
Route::post('/faculties', [FacultyController::class, 'store']);
Route::get('/faculties/{id}', [FacultyController::class, 'show']);
Route::put('/faculties/{id}', [FacultyController::class, 'update']);
Route::delete('/faculties/{id}', [FacultyController::class, 'destroy']);

// Alternative way to define Students and Faculty API routes
Route::apiResource('students', StudentController::class);
Route::apiResource('faculty', FacultyController::class);

// Departments, Courses, Academic Years
Route::apiResource('departments', DepartmentController::class);
Route::apiResource('courses', CourseController::class);
Route::apiResource('academic-years', AcademicYearController::class);
