import React, {useState} from 'react'

export default function AdminProfile(){
  const [tab,setTab]=useState('personal');
  const user={
    avatar:'',
    first:'Jeffer',
    last:'Administrator',
    role:'System Administrator',
    department:'Information Technology',
    email:'admin@urios.edu.ph',
    phone:'+1 (555) 000-0000'
  };

  const Badge=({value})=> (
    <span style={{display:'inline-block',padding:'2px 8px',borderRadius:9999,fontSize:12,fontWeight:600,background:'#F3F4F6',border:'1px solid #E5E7EB'}}>{value}</span>
  );

  const InfoRow=({label,value})=> (
    <div style={{display:'grid',gridTemplateColumns:'160px 1fr',padding:'8px 0',borderBottom:'1px solid #F3F4F6'}}>
      <div style={{color:'#6B7280'}}>{label}</div>
      <div>{value||'—'}</div>
    </div>
  );

  const SectionCard=({children})=> (
    <div style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:12,padding:16,boxShadow:'0 1px 2px rgba(0,0,0,0.04)'}}>{children}</div>
  );

  const renderTab=()=>{
    if(tab==='personal') return (
      <div>
        <InfoRow label="First Name" value={user.first}/>
        <InfoRow label="Last Name" value={user.last}/>
        <InfoRow label="Role" value={user.role}/>
        <InfoRow label="Department" value={user.department}/>
      </div>
    );
    if(tab==='contact') return (
      <div>
        <InfoRow label="Email" value={user.email}/>
        <InfoRow label="Phone" value={user.phone}/>
      </div>
    );
    return (
      <div>
        <InfoRow label="Password" value="••••••••"/>
        <InfoRow label="Two-Factor Auth" value="Disabled"/>
      </div>
    );
  };

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontSize:20,fontWeight:800}}>Admin Profile</div>
          <div style={{color:'#6B7280',fontSize:13}}>Manage your administrative profile and account settings</div>
        </div>
        <button onClick={()=>alert('Edit Profile')} style={{display:'inline-flex',alignItems:'center',gap:8,background:'#111827',color:'#fff',borderRadius:9999,padding:'8px 14px',fontWeight:700}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Edit Profile
        </button>
      </div>

      <div style={{display:'flex',gap:20,marginTop:16}}>
        <SectionCard>
          <div style={{width:280}}>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
              <div style={{width:120,height:120,borderRadius:'50%',background:'#E5E7EB'}}/>
              <div style={{fontWeight:700}}>{user.first} {user.last}</div>
              <Badge value={user.role}/>
              <div style={{color:'#6B7280',fontSize:13}}>{user.department}</div>
            </div>
            <div style={{height:1,background:'#E5E7EB',margin:'12px 0'}}/>
            <div style={{display:'grid',gap:10}}>
              <div style={{display:'flex',gap:10,alignItems:'center'}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z" fill="none"/><path d="M22 6L12 13 2 6"/></svg>
                <span>{user.email}</span>
              </div>
              <div style={{display:'flex',gap:10,alignItems:'center'}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.1 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.87.3 1.72.57 2.54a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.54-1.14a2 2 0 0 1 2.11-.45c.82.27 1.67.45 2.54.57A2 2 0 0 1 22 16.92z"/></svg>
                <span>{user.phone}</span>
              </div>
            </div>
          </div>
        </SectionCard>

        <div style={{flex:1}}>
          <SectionCard>
            <div style={{marginBottom:10}}>
              <div style={{border:'1px solid #E5E7EB',padding:6,borderRadius:9999,display:'inline-flex',gap:6,background:'#F3F4F6'}}>
                <button onClick={()=>setTab('personal')} style={{padding:'8px 14px',borderRadius:9999,background:tab==='personal'?'#fff':'transparent',fontWeight:600,color:'#111827'}}>Personal Info</button>
                <button onClick={()=>setTab('contact')} style={{padding:'8px 14px',borderRadius:9999,background:tab==='contact'?'#fff':'transparent',fontWeight:600,color:'#111827'}}>Contact Details</button>
                <button onClick={()=>setTab('security')} style={{padding:'8px 14px',borderRadius:9999,background:tab==='security'?'#fff':'transparent',fontWeight:600,color:'#111827'}}>Security</button>
              </div>
            </div>
            {renderTab()}
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
