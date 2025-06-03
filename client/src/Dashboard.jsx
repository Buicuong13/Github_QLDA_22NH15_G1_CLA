import React, { useState } from 'react';
import ProfileManager from './components/ProfileManager';
import GalleryManager from './GalleryManager';
import Trash from './components/Trash';

export default function Dashboard({ token, user, setToken, setUser, onLogout }) {
  const [tab, setTab] = useState('album');
  const [viewAlbumDetail, setViewAlbumDetail] = useState(false);
  // ...other state and logic as needed...

  return (
    <div style={{display:'flex',height:'100vh'}}>
      {/* Sidebar */}
      <div style={{width:220,background:'linear-gradient(180deg,#e0e7ff 0%,#f0fdfa 100%)',padding:16,borderRight:'1px solid #e5e7eb',display:'flex',flexDirection:'column',alignItems:'stretch',boxShadow:'2px 0 8px #e0e7eb',minHeight:0}}>
        <div style={{fontWeight:'bold',fontSize:20,marginBottom:24,color:'#6366f1',letterSpacing:1,display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:24}}>📦</span> ShotBox
        </div>
        <button onClick={() => { setTab('album'); setViewAlbumDetail(false); }} className={`sidebar-btn${tab==='album' ? ' active' : ''}`} style={{marginBottom:8,border:'none',borderRadius:8,padding:'10px 0',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:10,transition:'background 0.18s, color 0.18s'}}>
          <span style={{fontSize:18}}>📁</span> Quản lý Album
        </button>
        <button onClick={() => { setTab('image'); setViewAlbumDetail(false); }} className={`sidebar-btn${tab==='image' ? ' active' : ''}`} style={{marginBottom:8,border:'none',borderRadius:8,padding:'10px 0',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:10,transition:'background 0.18s, color 0.18s'}}>
          <span style={{fontSize:18}}>🖼️</span> Quản lý Ảnh
        </button>
        <button onClick={() => { setTab('trash'); setViewAlbumDetail(false); }} className={`sidebar-btn${tab==='trash' ? ' active' : ''}`} style={{marginBottom:8,border:'none',borderRadius:8,padding:'10px 0',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:10,transition:'background 0.18s, color 0.18s'}}>
          <span style={{fontSize:18}}>🗑️</span> Thùng rác
        </button>
        <button onClick={() => { setTab('storage'); setViewAlbumDetail(false); }} className={`sidebar-btn${tab==='storage' ? ' active' : ''}`} style={{marginBottom:8,border:'none',borderRadius:8,padding:'10px 0',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:10,transition:'background 0.18s, color 0.18s'}}>
          <span style={{fontSize:18}}>💾</span> Bộ nhớ
        </button>
        <button onClick={() => { setTab('profile'); setViewAlbumDetail(false); }} className={`sidebar-btn${tab==='profile' ? ' active' : ''}`} style={{marginBottom:8,border:'none',borderRadius:8,padding:'10px 0',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:10,transition:'background 0.18s, color 0.18s'}}>
          <span style={{fontSize:18}}>👤</span> Trang cá nhân
        </button>
        <button className="sidebar-logout-btn" onClick={onLogout}
          style={{marginTop:'auto',background:'#f1f5f9',color:'#334155',border:'none',borderRadius:8,padding:'10px 0',fontWeight:600,cursor:'pointer',transition:'background 0.18s, color 0.18s'}}>
          🚪 Đăng xuất
        </button>
      </div>
      {/* Main content placeholder */}
      <div style={{flex:1,background:'#f1f5f9',padding:32}}>
        {tab === 'profile' ? (
          <ProfileManager user={user} setUser={setUser} token={token} />
        ) : (
          <div>Chọn một tab để hiển thị nội dung.</div>
        )}
      </div>
    </div>
  );
}
