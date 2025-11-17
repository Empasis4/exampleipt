<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        return response()->json(Course::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'department_id' => 'required|integer|exists:departments,id',
            'status' => 'required|string|in:Active,Inactive',
        ]);
        $course = Course::create($data);
        return response()->json($course, 201);
    }

    public function show(Course $course)
    {
        return response()->json($course);
    }

    public function update(Request $request, Course $course)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'department_id' => 'sometimes|required|integer|exists:departments,id',
            'status' => 'sometimes|required|string|in:Active,Inactive',
        ]);
        $course->update($data);
        return response()->json($course);
    }

    public function destroy(Course $course)
    {
        $course->delete();
        return response()->json(['message' => 'Course deleted']);
    }
}
