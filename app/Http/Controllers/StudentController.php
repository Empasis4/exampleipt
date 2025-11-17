<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->query('q');
        $departmentId = $request->query('department_id');
        $perPage = (int)($request->query('per_page', 10));

        $query = Student::query();
        if ($q) {
            $query->where(function($w) use ($q) {
                $w->where('firstname', 'like', "%$q%")
                  ->orWhere('lastname', 'like', "%$q%")
                  ->orWhere('email', 'like', "%$q%");
            });
        }
        if ($departmentId) {
            $query->where('department_id', $departmentId);
        }

        $result = $query->orderByDesc('id')->paginate($perPage);
        return response()->json($result);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email',
            'course' => 'sometimes|nullable|string|max:255',
            'year' => 'required|string|max:255',
            'gpa' => 'required|numeric|min:0|max:4',
            'status' => 'required|string|max:255',
            'department_id' => 'sometimes|nullable|integer|exists:departments,id',
            'course_id' => 'sometimes|nullable|integer|exists:courses,id',
            'phone' => 'sometimes|nullable|string|max:255',
            'enrollment_date' => 'sometimes|nullable|date',
            'address' => 'sometimes|nullable|string',
        ]);

        $student = Student::create($validated);

        return response()->json($student, 201);
    }

    public function show($id)
    {
        return response()->json(Student::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        $data = $request->validate([
            'firstname' => 'sometimes|required|string|max:255',
            'lastname' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:students,email,' . $student->id,
            'course' => 'sometimes|nullable|string|max:255',
            'year' => 'sometimes|required|string|max:255',
            'gpa' => 'sometimes|required|numeric|min:0|max:4',
            'status' => 'sometimes|required|string|max:255',
            'department_id' => 'sometimes|nullable|integer|exists:departments,id',
            'course_id' => 'sometimes|nullable|integer|exists:courses,id',
            'phone' => 'sometimes|nullable|string|max:255',
            'enrollment_date' => 'sometimes|nullable|date',
            'address' => 'sometimes|nullable|string',
        ]);
        $student->update($data);
        return response()->json($student);
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();
        return response()->json(['message' => 'Student deleted']);
    }
}
