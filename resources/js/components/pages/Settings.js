import React, {useEffect, useMemo, useState} from 'react';
import axios from 'axios';

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

// Outlined icon-only button used inside tables
const OutlineIconButton=({title,onClick,children})=> (
  <button
    onClick={onClick}
    title={title}
    style={{
      display:'inline-flex',alignItems:'center',justifyContent:'center',
      width:32,height:32,borderRadius:8,
      background:'#fff',color:'#111827',
      border:'1px solid #D1D5DB'
    }}
  >
    {children}
  </button>
);

export default function Settings(){
  const [tab,setTab]=useState('years');
  const [years,setYears]=useState([]);
  const [depts,setDepts]=useState([]);
  const [courses,setCourses]=useState([]);
  const [loading,setLoading]=useState(false);

  const toArray=(resp)=>{
    const data = resp && resp.data;
    if(Array.isArray(data)) return data;
    if(data && Array.isArray(data.data)) return data.data;
    return [];
  };

  const refresh=async()=>{
    setLoading(true);
    try{
      const [y,d,c]=await Promise.all([
        axios.get('/academic-years'),
        axios.get('/departments'),
        axios.get('/courses'),
      ]);
      setYears(toArray(y)); setDepts(toArray(d)); setCourses(toArray(c));
    } finally { setLoading(false); }
  };

  useEffect(()=>{refresh()},[]);

  const fmtDate=(v)=>{
    if(!v) return '—';
    try{ return new Date(v).toLocaleDateString(undefined,{year:'numeric',month:'numeric',day:'numeric'}); }
    catch{ return String(v); }
  };

  const StatusPill=({value})=>{
    const active=value==='Active';
    const style={
      background: active? '#DCFCE7' : '#F3F4F6',
      color: active? '#065F46' : '#374151',
      border: `1px solid ${active? '#A7F3D0':'#E5E7EB'}`,
      borderRadius: 9999,
      padding: '3px 10px',
      fontSize: 12,
      fontWeight: 600,
      display:'inline-block'
    };
    return <span style={style}>{value}</span>;
  };

  const Section=({title,subtitle,children,action})=> (
    <div style={{marginTop:16,background:'#fff',border:'1px solid #E5E7EB',padding:16,borderRadius:12,boxShadow:'0 1px 2px rgba(0,0,0,0.04)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <div>
          <div style={{fontWeight:700,fontSize:16}}>{title}</div>
          {subtitle && <div style={{color:'#6B7280',fontSize:12,marginTop:2}}>{subtitle}</div>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );

  const addYear=async()=>{
    const label=prompt('Academic Year label (e.g., 2025-2026)'); if(!label) return;
    const start=prompt('Start date (YYYY-MM-DD)'); if(!start) return;
    const end=prompt('End date (YYYY-MM-DD)'); if(!end) return;
    const status=prompt('Status (Active/Inactive)','Active')||'Active';
    await axios.post('/academic-years',{label,start_date:start,end_date:end,status});
    await refresh();
  };
  const editYear=async(ay)=>{
    const label=prompt('Label', ay.label)||ay.label;
    const start=prompt('Start date', ay.start_date)||ay.start_date;
    const end=prompt('End date', ay.end_date)||ay.end_date;
    const status=prompt('Status', ay.status)||ay.status;
    await axios.put(`/academic-years/${ay.id}`,{label,start_date:start,end_date:end,status});
    await refresh();
  };
  const delYear=async(ay)=>{ if(confirm('Delete academic year?')){ await axios.delete(`/academic-years/${ay.id}`); await refresh(); }};

  const addDept=async()=>{
    const name=prompt('Department name'); if(!name) return;
    const status=prompt('Status (Active/Inactive)','Active')||'Active';
    await axios.post('/departments',{name,status});
    await refresh();
  };
  const editDept=async(d)=>{
    const name=prompt('Name', d.name)||d.name;
    const status=prompt('Status', d.status)||d.status;
    await axios.put(`/departments/${d.id}`,{name,status});
    await refresh();
  };
  const delDept=async(d)=>{ if(confirm('Delete department?')){ await axios.delete(`/departments/${d.id}`); await refresh(); }};

  const addCourse=async()=>{
    if(depts.length===0){ alert('Create a department first.'); return; }
    const name=prompt('Course name'); if(!name) return;
    const depIdStr=prompt(`Department ID (choose):\n${depts.map(x=>`${x.id}: ${x.name}`).join('\n')}`, String(depts[0].id));
    const department_id=Number(depIdStr);
    const status=prompt('Status (Active/Inactive)','Active')||'Active';
    await axios.post('/courses',{name,department_id,status});
    await refresh();
  };
  const editCourse=async(c)=>{
    const name=prompt('Name', c.name)||c.name;
    const depIdStr=prompt(`Department ID (choose):\n${depts.map(x=>`${x.id}: ${x.name}`).join('\n')}`, String(c.department_id));
    const department_id=Number(depIdStr);
    const status=prompt('Status', c.status)||c.status;
    await axios.put(`/courses/${c.id}`,{name,department_id,status});
    await refresh();
  };
  const delCourse=async(c)=>{ if(confirm('Delete course?')){ await axios.delete(`/courses/${c.id}`); await refresh(); }};

  const renderYears=()=> (
    <Section title="Academic Years" subtitle="Manage academic year periods" action={<button onClick={addYear} style={{display:'inline-flex',alignItems:'center',gap:8,background:'#111827',color:'#fff',borderRadius:9999,padding:'8px 14px',fontWeight:700}}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Add Academic Year
    </button>}>
      <div style={{border:'1px solid #E5E7EB',borderRadius:10,overflow:'hidden'}}>
      <table style={{width:'100%',borderCollapse:'separate',borderSpacing:0}}>
        <thead>
          <tr style={{background:'#F3F4F6'}}>
            <th style={{padding:8,border:'1px solid #e5e7eb'}}>Academic Years</th>
            <th style={{padding:8,border:'1px solid #e5e7eb'}}>Start Date</th>
            <th style={{padding:8,border:'1px solid #e5e7eb'}}>End Date</th>
            <th style={{padding:8,border:'1px solid #e5e7eb'}}>Status</th>
            <th style={{padding:8,border:'1px solid #e5e7eb'}}>Action</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(years)?years:[]).map(ay=> (
            <tr key={ay.id}>
              <td style={{padding:8,border:'1px solid #e5e7eb'}}>{ay.label}</td>
              <td style={{padding:8,border:'1px solid #e5e7eb'}}>{fmtDate(ay.start_date)}</td>
              <td style={{padding:8,border:'1px solid #e5e7eb'}}>{fmtDate(ay.end_date)}</td>
              <td style={{padding:8,border:'1px solid #e5e7eb'}}><StatusPill value={ay.status}/></td>
              <td style={{padding:8,border:'1px solid #e5e7eb'}}>
                <span style={{display:'inline-flex',gap:8}}>
                  <OutlineIconButton title="Edit" onClick={()=>editYear(ay)}><PencilIcon/></OutlineIconButton>
                  <OutlineIconButton title="Delete" onClick={()=>delYear(ay)}><TrashIcon/></OutlineIconButton>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </Section>
  );

  const renderDepts=()=> (
    <Section title="Departments" subtitle="Manage your departments" action={<button onClick={addDept} style={{display:'inline-flex',alignItems:'center',gap:8,background:'#111827',color:'#fff',borderRadius:9999,padding:'8px 14px',fontWeight:700}}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Add Department
    </button>}>
      <div style={{border:'1px solid #E5E7EB',borderRadius:10,overflow:'hidden'}}>
      <table style={{width:'100%',borderCollapse:'separate',borderSpacing:0}}>
        <thead>
          <tr style={{background:'#F3F4F6'}}>
            <th style={{padding:8,border:'1px solid #e5e7eb'}}>Name</th>
            <th style={{padding:8,border:'1px solid #e5e7eb'}}>Status</th>
            <th style={{padding:8,border:'1px solid #e5e7eb'}}>Action</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(depts)?depts:[]).map(d=> (
            <tr key={d.id}>
              <td style={{padding:8,border:'1px solid #e5e7eb'}}>{d.name}</td>
              <td style={{padding:8,border:'1px solid #e5e7eb'}}><StatusPill value={d.status}/></td>
              <td style={{padding:8,border:'1px solid #e5e7eb'}}>
                <span style={{display:'inline-flex',gap:8}}>
                  <OutlineIconButton title="Edit" onClick={()=>editDept(d)}><PencilIcon/></OutlineIconButton>
                  <OutlineIconButton title="Delete" onClick={()=>delDept(d)}><TrashIcon/></OutlineIconButton>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </Section>
  );

  const renderCourses=()=> (
    <Section title="Courses" subtitle="Manage courses" action={<button onClick={addCourse} style={{display:'inline-flex',alignItems:'center',gap:8,background:'#111827',color:'#fff',borderRadius:9999,padding:'8px 14px',fontWeight:700}}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Add Course
    </button>}>
      <div style={{border:'1px solid #E5E7EB',borderRadius:10,overflow:'hidden'}}>
      <table style={{width:'100%',borderCollapse:'separate',borderSpacing:0}}>
        <thead>
          <tr style={{background:'#F3F4F6'}}>
            <th style={{padding:8,border:'1px solid #e5e7eb'}}>Name</th>
            <th style={{padding:8,border:'1px solid #e5e7eb'}}>Department</th>
            <th style={{padding:8,border:'1px solid #e5e7eb'}}>Status</th>
            <th style={{padding:8,border:'1px solid #e5e7eb'}}>Action</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(courses)?courses:[]).map(c=> {
            const dep=depts.find(d=>d.id===c.department_id);
            return (
              <tr key={c.id}>
                <td style={{padding:8,border:'1px solid #e5e7eb'}}>{c.name}</td>
                <td style={{padding:8,border:'1px solid #e5e7eb'}}>{dep?dep.name:'—'}</td>
                <td style={{padding:8,border:'1px solid #e5e7eb'}}><StatusPill value={c.status}/></td>
                <td style={{padding:8,border:'1px solid #e5e7eb'}}>
                  <span style={{display:'inline-flex',gap:8}}>
                    <OutlineIconButton title="Edit" onClick={()=>editCourse(c)}><PencilIcon/></OutlineIconButton>
                    <OutlineIconButton title="Delete" onClick={()=>delCourse(c)}><TrashIcon/></OutlineIconButton>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </Section>
  );

  return (
    <div>
      <div style={{marginBottom:8}}>
        <div style={{fontSize:20,fontWeight:800}}>System Settings</div>
        <div style={{color:'#6B7280',fontSize:13}}>Manage academic years, departments, and courses</div>
      </div>
      <div style={{marginTop:12,border:'1px solid #E5E7EB',padding:6,borderRadius:9999,display:'inline-flex',gap:6,background:'#F3F4F6'}}>
        <button onClick={()=>setTab('years')} style={{padding:'8px 14px',borderRadius:9999,background:tab==='years'?'#fff':'transparent',fontWeight:600,color:'#111827'}}>Academic Years</button>
        <button onClick={()=>setTab('depts')} style={{padding:'8px 14px',borderRadius:9999,background:tab==='depts'?'#fff':'transparent',fontWeight:600,color:'#111827'}}>Departments</button>
        <button onClick={()=>setTab('courses')} style={{padding:'8px 14px',borderRadius:9999,background:tab==='courses'?'#fff':'transparent',fontWeight:600,color:'#111827'}}>Courses</button>
      </div>

      {loading && <div style={{marginTop:12}}>Loading…</div>}
      {!loading && (
        <div>
          {tab==='years' && renderYears()}
          {tab==='depts' && renderDepts()}
          {tab==='courses' && renderCourses()}
        </div>
      )}
    </div>
  );
}
