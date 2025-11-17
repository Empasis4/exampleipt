<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index()
    {
        return response()->json(Department::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:departments,name',
            'status' => 'required|string|in:Active,Inactive',
        ]);
        $department = Department::create($data);
        return response()->json($department, 201);
    }

    public function show(Department $department)
    {
        return response()->json($department);
    }

    public function update(Request $request, Department $department)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:departments,name,' . $department->id,
            'status' => 'sometimes|required|string|in:Active,Inactive',
        ]);
        $department->update($data);
        return response()->json($department);
    }

    public function destroy(Department $department)
    {
        $department->delete();
        return response()->json(['message' => 'Department deleted']);
    }
}
