<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    public function index()
    {
        return response()->json(AcademicYear::orderByDesc('start_date')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'label' => 'required|string|max:255|unique:academic_years,label',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|string|in:Active,Inactive',
        ]);
        $ay = AcademicYear::create($data);
        return response()->json($ay, 201);
    }

    public function show(AcademicYear $academic_year)
    {
        return response()->json($academic_year);
    }

    public function update(Request $request, AcademicYear $academic_year)
    {
        $data = $request->validate([
            'label' => 'sometimes|required|string|max:255|unique:academic_years,label,' . $academic_year->id,
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after:start_date',
            'status' => 'sometimes|required|string|in:Active,Inactive',
        ]);
        $academic_year->update($data);
        return response()->json($academic_year);
    }

    public function destroy(AcademicYear $academic_year)
    {
        $academic_year->delete();
        return response()->json(['message' => 'Academic Year deleted']);
    }
}
