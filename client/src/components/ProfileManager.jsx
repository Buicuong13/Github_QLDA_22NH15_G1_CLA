import React, { useState } from 'react';
import dayjs from 'dayjs';
import { updateUserInfo, changePassword } from '../api';

export default function ProfileManager({ user, setUser, token }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const updated = await updateUserInfo({ name, email, updatedAt: dayjs().format('YYYY-MM-DD') }, token);
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated)); // Sync localStorage
      setSuccess('Cập nhật thông tin thành công!');
    } catch (err) {
      setError(err.message || 'Cập nhật thất bại!');
    }
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    setLoading(true);
    try {
      const res = await changePassword({ oldPassword, newPassword }, token);
      setPwSuccess(res.message || 'Đổi mật khẩu thành công!');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setPwError(err.message || 'Đổi mật khẩu thất bại!');
    }
    setLoading(false);
  };

  return (
    <div style={{maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '48px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 16px #e0e7eb'}}>
      <h2 style={{fontWeight:700, fontSize: 24, marginBottom: 32, display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:28}}>👤</span> Trang cá nhân</h2>
      <div style={{display:'flex', gap: 48, flexWrap: 'wrap', alignItems:'flex-start'}}>
        {/* Chỉnh sửa thông tin */}
        <form onSubmit={handleSave} style={{flex:1, minWidth:320, maxWidth:500, marginBottom:0, display:'flex', flexDirection:'column', justifyContent:'flex-start'}}>
          <h3 style={{fontWeight:600,marginBottom:24}}>Chỉnh sửa thông tin</h3>
          <div style={{marginBottom:16}}>
            <label style={{fontWeight:600,display:'block',marginBottom:6}}>Tên:</label>
            <input type="text" value={name} onChange={e=>setName(e.target.value)} disabled={loading} style={{width:'100%',padding:10,borderRadius:8,border:'1.5px solid #e5e7eb',fontSize:16}} />
          </div>
          <div style={{marginBottom:16}}>
            <label style={{fontWeight:600,display:'block',marginBottom:6}}>Email:</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} disabled={loading} style={{width:'100%',padding:10,borderRadius:8,border:'1.5px solid #e5e7eb',fontSize:16}} />
          </div>
          {success && <div style={{color:'#22c55e',marginBottom:8}}>{success}</div>}
          {error && <div style={{color:'#ef4444',marginBottom:8}}>{error}</div>}
          <div style={{display:'flex',gap:12,marginTop:8,alignItems:'center'}}>
            <button type="submit" disabled={loading} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:8,padding:'10px 28px',fontWeight:700,cursor:'pointer',flex:1}}>Lưu</button>
            <button type="button" onClick={()=>{
              setName(user?.name||'');
              setEmail(user?.email||'');
              setSuccess('');
              setError('');
            }} disabled={loading} style={{background:'#f1f5f9',color:'#334155',border:'none',borderRadius:8,padding:'10px 28px',fontWeight:700,cursor:'pointer',flex:1}}>Huỷ</button>
          </div>
        </form>
        {/* Đổi mật khẩu */}
        <form onSubmit={handleChangePassword} style={{flex:1, minWidth:320, maxWidth:400, marginBottom:0, display:'flex', flexDirection:'column', justifyContent:'flex-start'}}>
          <h3 style={{fontWeight:600,marginBottom:24}}>Đổi mật khẩu</h3>
          <div style={{marginBottom:16, position:'relative'}}>
            <label style={{fontWeight:600,display:'block',marginBottom:6}}>Mật khẩu cũ:</label>
            <input type={showPassword ? 'text' : 'password'} value={oldPassword} onChange={e=>setOldPassword(e.target.value)} required disabled={loading} style={{width:'100%',padding:10,paddingRight:38,borderRadius:8,border:'1.5px solid #e5e7eb',fontSize:16}} />
            <span onClick={()=>setShowPassword(v=>!v)} style={{position:'absolute',top:38,right:12,cursor:'pointer',userSelect:'none',color:'#64748b',fontSize:20}} title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>
              {showPassword ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 20C7 20 2.73 16.11 1 12c.74-1.61 1.81-3.06 3.06-4.24M9.88 9.88A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3 0 .39-.08.76-.21 1.1"/><path d="M1 1l22 22"/></svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </span>
          </div>
          <div style={{marginBottom:16, position:'relative'}}>
            <label style={{fontWeight:600,display:'block',marginBottom:6}}>Mật khẩu mới:</label>
            <input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={e=>setNewPassword(e.target.value)} required disabled={loading} style={{width:'100%',padding:10,paddingRight:38,borderRadius:8,border:'1.5px solid #e5e7eb',fontSize:16}} />
            <span onClick={()=>setShowPassword(v=>!v)} style={{position:'absolute',top:38,right:12,cursor:'pointer',userSelect:'none',color:'#64748b',fontSize:20}} title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>
              {showPassword ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 20C7 20 2.73 16.11 1 12c.74-1.61 1.81-3.06 3.06-4.24M9.88 9.88A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3 0 .39-.08.76-.21 1.1"/><path d="M1 1l22 22"/></svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </span>
          </div>
          {pwSuccess && <div style={{color:'#22c55e',marginBottom:8}}>{pwSuccess}</div>}
          {pwError && <div style={{color:'#ef4444',marginBottom:8}}>{pwError}</div>}
          <button type="submit" disabled={loading} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:8,padding:'10px 28px',fontWeight:700,cursor:'pointer',width:'100%',marginTop:8}}>Đổi mật khẩu</button>
        </form>
      </div>
    </div>
  );
}
