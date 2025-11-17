import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Badge from '../Badge';

const IconButton=({title,onClick,children})=> (
  <button onClick={onClick} title={title} style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:34,height:34,borderRadius:8,background:'#111827',color:'#fff',border:'1px solid #111827'}}>
    {children}
  </button>
);
const iconProps={width:16,height:16,fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'};
const PencilIcon=()=> (
  <svg {...iconProps} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
  </svg>
);
const TrashIcon=()=> (
  <svg {...iconProps} viewBox="0 0 24 24" aria-hidden="true">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/>
    <path d="M14 11v6"/>
    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
  </svg>
);

export default function Students(){
  const [students,setStudents]=useState([]);
  const [depts,setDepts]=useState([]);
  const [courses,setCourses]=useState([]);
  const [q,setQ]=useState('');
  const [deptFilter,setDeptFilter]=useState('all');
  const [showModal,setShowModal]=useState(false);
  const blank={firstname:'',lastname:'',email:'',department_id:'',course_id:'',year:'',gpa:'',status:'Active',phone:'',enrollment_date:'',address:''};
  const [form,setForm]=useState(blank);
  const [editing,setEditing]=useState(null);
  const [error,setError]=useState('');

  const toArray=(resp)=>{
    const data = resp && resp.data;
    if(Array.isArray(data)) return data;
    if(data && Array.isArray(data.data)) return data.data;
    return [];
  };

  const fetchAll = async ()=>{
    const [s,d,c]=await Promise.all([
      axios.get('/students',{ params: { q, department_id: deptFilter==='all'?undefined:deptFilter } }),
      axios.get('/departments'),
      axios.get('/courses'),
    ]);
    setStudents(toArray(s));
    setDepts(toArray(d));
    setCourses(toArray(c));
  };

  useEffect(()=>{fetchAll()},[q,deptFilter]);

  const filtered = students; // server-side filtered

  const openAdd = ()=>{ setForm(blank); setEditing(null); setShowModal(true); };
  const openEdit = (s)=>{ setForm({ ...blank, ...s}); setEditing(s); setShowModal(true); };
  const closeModal = ()=>{ setShowModal(false); setEditing(null); };

  const save = async ()=>{
    setError('');
    // Simple client-side validation to match backend
    if(!form.firstname || !form.lastname || !form.email){ setError('First name, last name, and email are required.'); return; }
    if(!form.year){ setError('Year is required.'); return; }
    if(form.gpa==='' || form.gpa===null){ setError('GPA is required.'); return; }
    const payload={
      ...form,
      firstname: (form.firstname||'').trim(),
      lastname: (form.lastname||'').trim(),
      email: (form.email||'').trim(),
      gpa: Number(form.gpa),
      department_id: form.department_id===''? null : form.department_id,
      course_id: form.course_id===''? null : form.course_id,
    };
    // extra GPA guard to match backend rule numeric|min:0|max:4
    if(Number.isNaN(payload.gpa) || payload.gpa < 0 || payload.gpa > 4){ setError('GPA must be a number between 0 and 4.'); return; }
    try{
      if(editing){ await axios.put(`/students/${editing.id}`, payload); }
      else { await axios.post('/students', payload); }
      closeModal(); await fetchAll();
    }catch(e){
      if(e.response && e.response.data){
        const data = e.response.data;
        // Prefer first Laravel validation error if available
        if(data && data.errors && typeof data.errors === 'object'){
          const firstField = Object.keys(data.errors)[0];
          const firstMsg = firstField && Array.isArray(data.errors[firstField]) ? data.errors[firstField][0] : null;
          setError(firstMsg || data.message || 'Validation error');
        }else{
          setError(typeof data === 'string' ? data : (data.message || 'Validation error'));
        }
      }else{
        setError('Network or server error.');
      }
    }
  };
  const remove = async (s)=>{ if(confirm('Delete student?')){ await axios.delete(`/students/${s.id}`); await fetchAll(); } };

  const StatusPill=({value})=>(<span style={{background:value==='Active'?'#DCFCE7':'#E5E7EB',borderRadius:8,padding:'2px 8px',fontSize:12}}>{value||'—'}</span>);

  return (
    <div>
      <h2>Students Management</h2>
      <div style={{marginTop:12}}>
        <div style={{border:'1px solid #e5e7eb',padding:12,borderRadius:6}}>
          <div style={{marginBottom:8,display:'flex',gap:12,alignItems:'center'}}>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search Students..." style={{width:300,padding:8,borderRadius:20,border:'1px solid #e5e7eb'}}/>
            <select value={deptFilter} onChange={e=>setDeptFilter(e.target.value)} style={{padding:8,borderRadius:8,border:'1px solid #e5e7eb'}}>
              <option value="all">All Department</option>
              {(Array.isArray(depts)?depts:[]).map(d=> <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <button onClick={openAdd} style={{marginLeft:'auto',background:'#000',color:'#fff',borderRadius:8,padding:'6px 10px'}}>+ Add Student</button>
          </div>

          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#f8fafc'}}>
                <th style={{padding:8,border:'1px solid #e5e7eb'}}>Student</th>
                <th style={{padding:8,border:'1px solid #e5e7eb'}}>Department</th>
                <th style={{padding:8,border:'1px solid #e5e7eb'}}>Year</th>
                <th style={{padding:8,border:'1px solid #e5e7eb'}}>GPA</th>
                <th style={{padding:8,border:'1px solid #e5e7eb'}}>Status</th>
                <th style={{padding:8,border:'1px solid #e5e7eb'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {(!Array.isArray(filtered) || filtered.length===0)?(
                <tr><td colSpan={6} style={{padding:16,textAlign:'center'}}>No students yet.</td></tr>
              ):(
                filtered.map(s=> {
                  const d=depts.find(x=>x.id===s.department_id);
                  return (
                    <tr key={s.id}>
                      <td style={{padding:8,border:'1px solid #e5e7eb'}}>{(s.firstname||'')+' '+(s.lastname||'')}</td>
                      <td style={{padding:8,border:'1px solid #e5e7eb'}}>{d?d.name:'—'}</td>
                      <td style={{padding:8,border:'1px solid #e5e7eb'}}>{s.year||'—'}</td>
                      <td style={{padding:8,border:'1px solid #e5e7eb'}}>{s.gpa??'—'}</td>
                      <td style={{padding:8,border:'1px solid #e5e7eb'}}><Badge value={s.status}/></td>
                      <td style={{padding:8,border:'1px solid #e5e7eb'}}>
                        <span style={{display:'inline-flex',gap:6}}>
                          <IconButton title="Edit" onClick={()=>openEdit(s)}><PencilIcon/></IconButton>
                          <IconButton title="Delete" onClick={()=>remove(s)}><TrashIcon/></IconButton>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination controls removed per request */}

      {showModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',padding:16,borderRadius:8,width:560,maxHeight:'80vh',overflow:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <h3>{editing?'Edit Student':'Add New Student'}</h3>
              <button onClick={closeModal}>✖</button>
            </div>
            {error && <div style={{background:'#FEF2F2',border:'1px solid #FECACA',color:'#991B1B',padding:8,borderRadius:6,marginBottom:8,fontSize:12}}>{error}</div>}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <input placeholder="First name" value={form.firstname} onChange={e=>setForm({...form,firstname:e.target.value})}/>
              <input placeholder="Last name" value={form.lastname} onChange={e=>setForm({...form,lastname:e.target.value})}/>
              <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
              <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
              <select value={form.department_id||''} onChange={e=>{
                const v=e.target.value; setForm({...form,department_id: v===''? '': Number(v)});
              }}>
                <option value="">Select Department</option>
                {(Array.isArray(depts)?depts:[]).map(d=> <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <select value={form.course_id||''} onChange={e=>{
                const v=e.target.value; setForm({...form,course_id: v===''? '': Number(v)});
              }}>
                <option value="">Select Course</option>
                {(Array.isArray(courses)?courses:[]).filter(c=>!form.department_id || String(c.department_id)===String(form.department_id)).map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input placeholder="Year" value={form.year} onChange={e=>setForm({...form,year:e.target.value})}/>
              <input type="number" step="0.01" min="0" max="4" placeholder="GPA" value={form.gpa} onChange={e=>setForm({...form,gpa:e.target.value})}/>
              <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <input type="date" placeholder="Enrollment Date" value={form.enrollment_date||''} onChange={e=>setForm({...form,enrollment_date:e.target.value})}/>
              <textarea placeholder="Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} style={{gridColumn:'1 / span 2'}}/>
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
              <button onClick={closeModal}>Cancel</button>
              <button onClick={save} style={{background:'#000',color:'#fff',borderRadius:6,padding:'6px 10px'}}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
