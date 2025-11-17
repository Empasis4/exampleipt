import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard(){
  const [students,setStudents]=useState([]);
  const [faculty,setFaculty]=useState([]);
  const [courses,setCourses]=useState([]);
  const [depts,setDepts]=useState([]);

  const toArray=(resp)=>{
    const data = resp && resp.data;
    if(Array.isArray(data)) return data;
    if(data && Array.isArray(data.data)) return data.data;
    return [];
  };

  const refresh=async()=>{
    const [s,f,c,d]=await Promise.all([
      axios.get('/students'),
      axios.get('/faculties'),
      axios.get('/courses'),
      axios.get('/departments'),
    ]);
    setStudents(toArray(s));
    setFaculty(toArray(f));
    setCourses(toArray(c));
    setDepts(toArray(d));
  };

  useEffect(()=>{refresh()},[]);

  const Card=({title,value,icon})=> (
    <div className="stat-card">
      <div className="stat-card__title">{title}</div>
      <div className="stat-card__value">{value}</div>
    </div>
  );

  return (
    <div>
      <h2 className="page-title">Dashboard Overview</h2>
      <div className="card-grid">
        <Card title="Total Students" value={students.length}/>
        <Card title="Total Faculty" value={faculty.length}/>
        <Card title="Active Course" value={courses.filter(x=>x.status==='Active').length}/>
        <Card title="Active Departments" value={depts.filter(x=>x.status==='Active').length}/>
      </div>

      <div className="panel">
        <div className="panel__title">Students</div>
        <div className="table-panel">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Department</th>
                <th>GPA</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {([...(Array.isArray(students)?students:[])].slice(-5).reverse()).map(s=> (
                <tr key={s.id}>
                  <td>{(s.firstname||'')+ ' ' + (s.lastname||'')}</td>
                  <td>{s.department_id ? (depts.find(d=>d.id===s.department_id)?.name||'-') : (s.course||'-')}</td>
                  <td>{s.gpa ?? '—'}</td>
                  <td>{s.status||'—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
