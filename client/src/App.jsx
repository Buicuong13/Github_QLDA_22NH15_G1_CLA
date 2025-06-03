import React, { useState, useEffect, useRef } from 'react';
import AuthForm from './AuthForm';
import './App.css';
import './styles.css';
import { getAlbums, getImages, createAlbum, uploadImage, addImageToAlbum, editImage, deleteImage, removeImageFromAlbum, editAlbum, deleteAlbum } from './api';
import GalleryManager from './GalleryManager';
import Trash from './components/Trash';
import ProfileManager from './components/ProfileManager';

// Hàm lấy số lượng ảnh của album từ backend
async function fetchAlbumStats(albumId, token) {
  const res = await fetch(`http://localhost:5000/api/album/${albumId}/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return { totalImages: 0 };
  return await res.json();
}

// Hàm lấy ảnh trong album từ backend
async function fetchImagesInAlbum(albumId, token) {
  const res = await fetch(`http://localhost:5000/api/album/${albumId}/images`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.images || [];
}

function AlbumManager({ albums, onAdd, onEdit, onDelete, onSelect, selectedAlbum, images, token }) {
  const [showForm, setShowForm] = useState(false);
  const [editAlbum, setEditAlbum] = useState(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [albumStats, setAlbumStats] = useState({});
  const statsFetched = useRef(false);
  const [showMenu, setShowMenu] = useState(null); // Thêm state cho menu ba chấm

  // Fetch số lượng ảnh cho từng album khi albums thay đổi
  useEffect(() => {
    if (!albums || albums.length === 0 || statsFetched.current) return;
    statsFetched.current = true;
    (async () => {
      const statsObj = {};
      for (const album of albums) {
        try {
          const stats = await fetchAlbumStats(album.id, token);
          statsObj[album.id] = stats.totalImages || 0;
        } catch {
          statsObj[album.id] = 0;
        }
      }
      setAlbumStats(statsObj);
    })();
  }, [albums, token]);

  // Open add/edit modal
  const openForm = (album = null) => {
    setEditAlbum(album);
    setName(album ? album.albumName : '');
    setDesc(album ? album.description || '' : '');
    setShowForm(true);
  };

  // Handle add/edit submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === '') return;
    if (editAlbum) onEdit({ ...editAlbum, albumName: name, description: desc });
    else onAdd({ albumName: name, description: desc });
    setShowForm(false); setEditAlbum(null); setName(''); setDesc('');
  };

  // Handle delete
  const handleDelete = (album) => {
    setConfirmDelete(album);
  };

  // Confirm delete
  const confirmDeleteAlbum = () => {
    if (confirmDelete) onDelete(confirmDelete.id);
    setConfirmDelete(null);
  };

  // Album image count lấy từ albumStats
  const getImageCount = (albumId) => {
    return albumStats[albumId] ?? 0;
  };

  // Khi click vào album, chuyển sang chế độ xem chi tiết album (hiển thị ảnh trong album)
  const handleSelect = (album) => {
    onSelect(album);
    if (typeof window !== 'undefined' && window.setViewAlbumDetail) {
      window.setViewAlbumDetail(true);
    }
  };

  // Đóng menu khi click ra ngoài
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      // Nếu có menu đang mở và click ra ngoài menu thì đóng menu
      if (showMenu !== null) {
        // Tìm phần tử menu
        const menu = document.querySelector('.album-menu-dropdown');
        if (menu && !menu.contains(e.target)) {
          setShowMenu(null);
        }
      }

    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  return (
    <div style={{maxWidth: '100%', width: '1100px', margin:'0 auto',background:'#fff',borderRadius:12,boxShadow:'0 2px 16px #e0e7eb',padding:48}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <h3 style={{margin:0,fontWeight:700,fontSize:24,color:'#334155'}}>Danh sách Album</h3>
        <button
          onClick={() => openForm()}
          style={{
            background:'linear-gradient(90deg,#6366f1 0%,#06b6d4 100%)',
            color:'#fff',
            border:'none',
            borderRadius:8,
            padding:'10px 24px',
            fontWeight:600,
            cursor:'pointer',
            fontSize:16,
            transition:'background 0.2s, color 0.2s, transform 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#e0e7ef'; e.currentTarget.style.color = '#6366f1'; e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(90deg,#6366f1 0%,#06b6d4 100%)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          + Tạo Album
        </button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))',gap:28}}>
        {albums.length === 0 && (
          <div style={{color:'#64748b',fontStyle:'italic'}}>Chưa có album nào.</div>
        )}
        {albums.map(album => (
          <div
            key={album.id}
            onClick={() => handleSelect(album)}
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSelect(album); }}
            style={{
              background:selectedAlbum?.id===album.id?'linear-gradient(90deg,#6366f1 0%,#06b6d4 100%)':'#f1f5f9',
              color:selectedAlbum?.id===album.id?'#fff':'#334155',
              border:selectedAlbum?.id===album.id?'2px solid #6366f1':'1px solid #e5e7eb',
              borderRadius:10,
              padding:20,
              cursor:'pointer',
              boxShadow:'0 1px 6px #e5e7eb',
              position:'relative',
              transition:'all 0.2s',
              minHeight:120,
              display:'flex',
              flexDirection:'column',
              justifyContent:'space-between',
              outline:'none',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 8px 32px #6366f199, 0 2px 8px #a5b4fc55';
              e.currentTarget.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 1px 6px #e5e7eb';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{fontWeight:600,fontSize:18,marginBottom:8,wordBreak:'break-word'}}>{album.albumName}</div>
            <div style={{fontSize:14,marginBottom:8,opacity:0.85}}>{album.description || <span style={{color:'#94a3b8'}}>Không có mô tả</span>}</div>
            <div style={{fontSize:13,marginBottom:8}}>
              <span style={{fontWeight:500}}>{getImageCount(album.id)}</span> ảnh
            </div>
            {/* Menu ba chấm cho Sửa/Xoá */}
            <div style={{position:'absolute',top:12,right:12}}>
              <button
                onClick={e => {
                  e.stopPropagation();
                  setShowMenu(album.id === showMenu ? null : album.id);
                }}
                style={{background:'none',border:'none',cursor:'pointer',fontSize:22,color:'#64748b',padding:2,borderRadius:6}}
                title="Tùy chọn"
              >
                &#8230;
              </button>
              {showMenu === album.id && (
                <div className="album-menu-dropdown" style={{position:'absolute',top:28,right:0,zIndex:10,background:'#fff',boxShadow:'0 2px 8px #e5e7eb',borderRadius:8,minWidth:150,padding:'6px 0'}}>
                  <button
                    onClick={async e => {
                      e.stopPropagation();
                      // Tải toàn bộ ảnh trong album dưới dạng zip
                      try {
                        const res = await fetch(`http://localhost:5000/api/album/${album.id}/download`, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        if (!res.ok) throw new Error('Không thể tải album');
                        const blob = await res.blob();
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = `${album.albumName || 'album'}.zip`;
                        document.body.appendChild(link);
                        link.click();
                        setTimeout(() => {
                          URL.revokeObjectURL(link.href);
                          document.body.removeChild(link);
                        }, 200);
                      } catch (err) {
                        alert('Không thể tải album này!');
                      }
                      setShowMenu(null);
                    }}
                    style={{display:'block',width:'100%',background:'none',border:'none',padding:'8px 16px',textAlign:'left',cursor:'pointer',color:'#0ea5e9'}}
                  >⬇️ Tải album</button>
                  <button
                    onClick={e => { e.stopPropagation(); openForm(album); setShowMenu(null); }}
                    style={{display:'block',width:'100%',background:'none',border:'none',padding:'8px 16px',textAlign:'left',cursor:'pointer',color:'#06b6d4'}}
                  >✏️ Sửa</button>
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(album); setShowMenu(null); }}
                    style={{display:'block',width:'100%',background:'none',border:'none',padding:'8px 16px',textAlign:'left',cursor:'pointer',color:'#ef4444'}}
                  >🗑️ Xoá</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Add/Edit Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content" style={{borderRadius:16,boxShadow:'0 8px 32px #6366f133, 0 2px 8px #06b6d455',padding:32,minWidth:340}}>
            <h3 style={{display:'flex',alignItems:'center',gap:8,fontWeight:700,fontSize:22,marginBottom:20}}>
              {editAlbum ? <span style={{color:'#6366f1'}}>✏️</span> : <span style={{color:'#06b6d4'}}>➕</span>}
              {editAlbum ? 'Sửa Album' : 'Thêm Album mới'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{marginBottom:18}}>
                <label style={{fontWeight:600,marginBottom:6,display:'block'}}>Tên album:</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  autoFocus
                  style={{width:'100%',padding:'10px 14px',borderRadius:8,border:'1.5px solid #e5e7eb',fontSize:16,outline:'none',transition:'border 0.2s'}}
                  onFocus={e => e.target.style.border='1.5px solid #6366f1'}
                  onBlur={e => e.target.style.border='1.5px solid #e5e7eb'}
                />
              </div>
              <div className="form-group" style={{marginBottom:18}}>
                <label style={{fontWeight:600,marginBottom:6,display:'block'}}>Mô tả:</label>
                <textarea
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  rows={2}
                  style={{width:'100%',padding:'10px 14px',borderRadius:8,border:'1.5px solid #e5e7eb',fontSize:15,resize:'vertical',outline:'none',transition:'border 0.2s'}}
                  onFocus={e => e.target.style.border='1.5px solid #06b6d4'}
                  onBlur={e => e.target.style.border='1.5px solid #e5e7eb'}
                />
              </div>
              <div className="modal-buttons" style={{display:'flex',gap:12,marginTop:10}}>
                <button type="submit" style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:8,padding:'10px 28px',fontWeight:700,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',gap:8,boxShadow:'0 2px 8px #6366f122',transition:'background 0.18s, transform 0.12s'}}
                  onMouseEnter={e => { e.currentTarget.style.background = '#06b6d4'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.transform = 'scale(1)'; }}
                >{editAlbum ? <span>💾</span> : <span>➕</span>}{editAlbum ? 'Lưu' : 'Thêm'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditAlbum(null); setName(''); setDesc(''); }}
                  style={{background:'#f1f5f9',color:'#334155',border:'none',borderRadius:8,padding:'10px 28px',fontWeight:700,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',gap:8,transition:'background 0.18s, transform 0.12s'}}
                  onMouseEnter={e => { e.currentTarget.style.background = '#e0e7ef'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.transform = 'scale(1)'; }}
                >❌ Huỷ</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal-content" style={{borderRadius:16,boxShadow:'0 8px 32px #ef444433, 0 2px 8px #ef444455',padding:32,minWidth:340}}>
            <h3 style={{display:'flex',alignItems:'center',gap:8,fontWeight:700,fontSize:22,marginBottom:20,color:'#ef4444'}}>
              <span>🗑️</span> Xác nhận xoá album
            </h3>
            <p style={{fontSize:16,marginBottom:24}}>Bạn có chắc chắn muốn xoá album <b>{confirmDelete.albumName}</b> không?</p>
            <div className="modal-buttons" style={{display:'flex',gap:12}}>
              <button 
                onClick={confirmDeleteAlbum}
                style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:8,padding:'10px 28px',fontWeight:700,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',gap:8,boxShadow:'0 2px 8px #ef444422',transition:'background 0.18s, transform 0.12s'}}
                onMouseEnter={e => { e.currentTarget.style.background = '#b91c1c'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.transform = 'scale(1)'; }}
              >🗑️ Xoá</button>
              <button 
                onClick={() => setConfirmDelete(null)}
                style={{background:'#f1f5f9',color:'#334155',border:'none',borderRadius:8,padding:'10px 28px',fontWeight:700,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',gap:8,transition:'background 0.18s, transform 0.12s'}}
                onMouseEnter={e => { e.currentTarget.style.background = '#e0e7ef'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.transform = 'scale(1)'; }}
              >❌ Huỷ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ImageManager({ images, albums, onAdd, onEdit, onDelete, onMove, selectedAlbum, token }) {
  const [showUpload, setShowUpload] = useState(false);
  const [editImg, setEditImg] = useState(null);
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  // Filter images by selected album
  const filteredImages = selectedAlbum ? 
    images.filter(img => img.albumId === selectedAlbum.id) : 
    images;

  // Handle file select
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('fileName', fileName.trim());
      
      await onAdd(formData);
      handleCloseEdit();
    } catch (err) {
      console.error('Lỗi khi tải ảnh:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải ảnh');
    } finally {
      setLoading(false);
    }
  };

  // Handle image edit
  const handleEdit = async () => {
    if (!editImg || !fileName.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      await onEdit(editImg.id, { fileName: fileName.trim() });
      handleCloseEdit();
    } catch (err) {
      console.error('Lỗi khi cập nhật:', err);
      setError(err.message || 'Có lỗi xảy ra khi cập nhật tên file');
    } finally {
      setLoading(false);
    }
  };

  // Handle image delete
  const handleDelete = async (id) => {
    setLoading(true);
    setError('');
    
    try {
      await onDelete(id);
      setConfirmDelete(null);
    } catch (err) {
      console.error('Lỗi khi xóa:', err);
      setError(err.message || 'Có lỗi xảy ra khi xóa ảnh');
    } finally {
      setLoading(false);
    }
  };

  // Handle move to album
  const handleMove = async (imageId, albumId) => {
    setLoading(true);
    setError('');
    
    try {
      await onMove(imageId, albumId);
    } catch (err) {
      console.error('Lỗi khi chuyển ảnh:', err);
      setError(err.message || 'Có lỗi xảy ra khi chuyển ảnh');
    } finally {
      setLoading(false);
    }
  };

  // Handle closing modals
  const handleCloseEdit = () => {
    setShowUpload(false);
    setEditImg(null);
    setFileName('');
    setSelectedFile(null);
    setPreview('');
    setError('');
  };

  const handleCloseDelete = () => {
    setConfirmDelete(null);
    setError('');
  };

  const handleDownload = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name || 'image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Camera capture logic
  const handleOpenCamera = () => {
    setShowCamera(true);
    setTimeout(() => {
      if (videoRef.current) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          });
      }
    }, 100);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) {
          setSelectedFile(new File([blob], `camera_${Date.now()}.png`, { type: 'image/png' }));
          setFileName(`camera_${Date.now()}.png`);
          setPreview(URL.createObjectURL(blob));
          // Stop camera
          if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
          }
          setShowCamera(false);
        }
      }, 'image/png');
    }
  };

  const handleCloseCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <h3 style={{margin:0}}>
          Danh sách  {selectedAlbum ? `(Album: ${selectedAlbum.albumName})` : ''}
        </h3>
        <div style={{display:'flex',gap:8}}>
          <button
            onClick={() => setShowUpload(true)}
            style={{
              background:'linear-gradient(90deg,#06b6d4 0%,#6366f1 100%)',
              color:'#fff',
              border:'none',
              borderRadius:8,
              padding:'10px 24px',
              fontWeight:600,
              cursor:'pointer',
              transition:'background 0.2s, color 0.2s, transform 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e0e7ef'; e.currentTarget.style.color = '#06b6d4'; e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(90deg,#06b6d4 0%,#6366f1 100%)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Upload ảnh
          </button>
          <button
            onClick={handleOpenCamera}
            style={{
              background:'linear-gradient(90deg,#06b6d4 0%,#6366f1 100%)',
              color:'#fff',
              border:'none',
              borderRadius:8,
              padding:'10px 24px',
              fontWeight:600,
              cursor:'pointer',
              transition:'background 0.2s, color 0.2s, transform 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e0e7ef'; e.currentTarget.style.color = '#06b6d4'; e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(90deg,#06b6d4 0%,#6366f1 100%)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            📷 Chụp bằng Camera
          </button>
        </div>
      </div>
      
      {error && (
        <div style={{
          background: '#fee2e2',
          color: '#ef4444',
          padding: '8px 16px',
          borderRadius: 6,
          marginBottom: 16
        }}>
          {error}
        </div>
      )}

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))',gap:20,marginTop:16}}>
        {filteredImages.map(img => (
          <div key={img.id} style={{
            background:'#fff',
            borderRadius:8,
            boxShadow:'0 2px 8px #e5e7eb',
            padding:12,
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            position:'relative'
          }}>
            <img 
              src={img.url} 
              alt={img.fileName}
              style={{
                width:'100%',
                height:160,
                objectFit:'cover',
                borderRadius:6,
                marginBottom:8
              }}
            />
            
            <div style={{
              display:'flex',
              alignItems:'center',
              width:'100%',
              gap:8,
              marginTop:4
            }}>
              <select
                value={img.albumId || ''}
                onChange={(e) => handleMove(img.id, e.target.value)}
                style={{
                  border:'1px solid #e5e7eb',
                  borderRadius:6,
                  padding:'4px 8px',
                  fontSize:14,
                  minWidth:90,
                  marginRight:'auto'
                }}
                disabled={loading}
              >
                <option value="">+ Album</option>
                {albums.map((alb) => (
                  <option key={alb.id} value={alb.id}>{alb.albumName}</option>
                ))}
              </select>

              <div style={{position:'relative'}}>
                <button
                  onClick={() => setShowMenu(img.id === showMenu ? null : img.id)}
                  style={{
                    background:'none',
                    border:'none',
                    cursor:'pointer',
                    fontSize:20,
                    padding:0
                  }}
                  disabled={loading}
                >
                  ⋯
                </button>

                {showMenu === img.id && (
                  <div style={{
                    position:'absolute',
                    top:28,
                    right:0,
                    zIndex:10,
                    background:'#fff',
                    boxShadow:'0 2px 8px #e5e7eb',
                    borderRadius:8,
                    minWidth:150,
                    padding:'6px 0'
                  }}>
                    <button 
                      onClick={() => {
                        handleDownload(img.url, img.fileName);
                        setShowMenu(null);
                      }}
                      style={{
                        display:'block',
                        width:'100%',
                        background:'none',
                        border:'none',
                        padding:'8px 16px',
                        textAlign:'left',
                        cursor:'pointer'
                      }}
                      disabled={loading}
                    >
                      ⬇️ Tải xuống
                    </button>
                    <button 
                      onClick={() => {
                        setEditImg(img);
                        setFileName(img.fileName);
                        setShowUpload(true);
                        setShowMenu(null);
                      }}
                      style={{
                        display:'block',
                        width:'100%',
                        background:'none',
                        border:'none',
                        padding:'8px 16px',
                        textAlign:'left',
                        cursor:'pointer'
                      }}
                      disabled={loading}
                    >
                      ✏️ Sửa
                    </button>
                    <button 
                      onClick={() => {
                        setConfirmDelete(img.id);
                        setShowMenu(null);
                      }}
                      style={{
                        display:'block',
                        width:'100%',
                        background:'none',
                        border:'none',
                        padding:'8px 16px',
                        textAlign:'left',
                        cursor:'pointer',
                        color:'#ef4444'
                      }}
                      disabled={loading}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div style={{
              marginTop:8,
              fontWeight:500,
              fontSize:14,
              textAlign:'center',
              width:'100%',
              wordBreak:'break-word'
            }}>
              {img.fileName}
            </div>
          </div>
        ))}
      </div>

      {/* Upload/Edit modal */}
      {showUpload && (
        <div className="modal-overlay">
          <div className="modal-content" style={{borderRadius:16,boxShadow:'0 8px 32px #6366f133, 0 2px 8px #06b6d455',padding:32,minWidth:340}}>
            <h3 style={{display:'flex',alignItems:'center',gap:8,fontWeight:700,fontSize:22,marginBottom:20}}>
              {editImg ? <span style={{color:'#6366f1'}}>✏️</span> : <span style={{color:'#06b6d4'}}>➕</span>}
              {editImg ? 'Sửa tên file' : 'Upload ảnh mới'}
            </h3>
            {editImg ? (
              <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
                <div className="preview-container" style={{marginBottom:18}}>
                  <img 
                    src={editImg.url} 
                    alt="Preview" 
                    style={{maxWidth: '100%',maxHeight: '200px',objectFit: 'contain',marginBottom: '16px',borderRadius:10,boxShadow:'0 2px 8px #6366f122'}}
                  />
                </div>
                <div className="form-group" style={{marginBottom:18}}>
                  <label style={{fontWeight:600,marginBottom:6,display:'block'}}>Tên file:</label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    disabled={loading}
                    required
                    style={{width:'100%',padding:'10px 14px',borderRadius:8,border:'1.5px solid #e5e7eb',fontSize:16,outline:'none',transition:'border 0.2s'}}
                    onFocus={e => e.target.style.border='1.5px solid #6366f1'}
                    onBlur={e => e.target.style.border='1.5px solid #e5e7eb'}
                  />
                </div>
                <div className="modal-buttons" style={{display:'flex',gap:12,marginTop:10}}>
                  <button type="submit" disabled={loading || !fileName.trim()} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:8,padding:'10px 28px',fontWeight:700,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',gap:8,boxShadow:'0 2px 8px #6366f122',transition:'background 0.18s, transform 0.12s'}}
                    onMouseEnter={e => { e.currentTarget.style.background = '#06b6d4'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.transform = 'scale(1)'; }}
                  >💾 Lưu</button>
                  <button type="button" onClick={handleCloseEdit} disabled={loading} style={{background:'#f1f5f9',color:'#334155',border:'none',borderRadius:8,padding:'10px 28px',fontWeight:700,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',gap:8,transition:'background 0.18s, transform 0.12s'}}
                    onMouseEnter={e => { e.currentTarget.style.background = '#e0e7ef'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.transform = 'scale(1)'; }}
                  >❌ Huỷ</button>
                </div>
              </form>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleUpload(); }}>
                <div className="form-group" style={{marginBottom:18}}>
                  <label style={{fontWeight:600,marginBottom:6,display:'block'}}>Chọn ảnh:</label>
                  {!selectedFile ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      required
                      style={{padding:'8px 0'}}
                    />
                  ) : (
                    <div style={{marginBottom:12}}>
                      <span style={{color:'#06b6d4',fontWeight:600}}>
                        Đã chọn ảnh từ {preview && preview.startsWith('blob:') ? 'camera' : 'máy tính'}
                      </span>
                      <button type="button" style={{marginLeft:16,background:'#f1f5f9',color:'#334155',border:'none',borderRadius:6,padding:'4px 16px',fontWeight:600,cursor:'pointer',transition:'background 0.18s'}} onClick={() => { setSelectedFile(null); setPreview(''); setFileName(''); }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#e0e7ef'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; }}
                      >🔄 Chọn lại ảnh</button>
                    </div>
                  )}
                </div>
                {preview && (
                  <div className="preview-container" style={{marginBottom:18}}>
                    <img 
                      src={preview} 
                      alt="Preview" 
                      style={{maxWidth: '100%',maxHeight: '200px',objectFit: 'contain',marginBottom: '16px',borderRadius:10,boxShadow:'0 2px 8px #06b6d422'}}
                    />
                  </div>
                )}
                <div className="form-group" style={{marginBottom:18}}>
                  <label style={{fontWeight:600,marginBottom:6,display:'block'}}>Tên file:</label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    disabled={loading}
                    required
                    style={{width:'100%',padding:'10px 14px',borderRadius:8,border:'1.5px solid #e5e7eb',fontSize:16,outline:'none',transition:'border 0.2s'}}
                    onFocus={e => e.target.style.border='1.5px solid #06b6d4'}
                    onBlur={e => e.target.style.border='1.5px solid #e5e7eb'}
                  />
                </div>
                <div className="modal-buttons" style={{display:'flex',gap:12,marginTop:10}}>
                  <button type="submit" disabled={loading || !selectedFile || !fileName.trim()} style={{background:'#06b6d4',color:'#fff',border:'none',borderRadius:8,padding:'10px 28px',fontWeight:700,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',gap:8,boxShadow:'0 2px 8px #06b6d422',transition:'background 0.18s, transform 0.12s'}}
                    onMouseEnter={e => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#06b6d4'; e.currentTarget.style.transform = 'scale(1)'; }}
                  >⬆️ Tải lên</button>
                  <button type="button" onClick={handleCloseEdit} disabled={loading} style={{background:'#f1f5f9',color:'#334155',border:'none',borderRadius:8,padding:'10px 28px',fontWeight:700,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',gap:8,transition:'background 0.18s, transform 0.12s'}}
                    onMouseEnter={e => { e.currentTarget.style.background = '#e0e7ef'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.transform = 'scale(1)'; }}
                  >❌ Huỷ</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal-content" style={{borderRadius:16,boxShadow:'0 8px 32px #ef444433, 0 2px 8px #ef444455',padding:32,minWidth:340}}>
            <h3 style={{display:'flex',alignItems:'center',gap:8,fontWeight:700,fontSize:22,marginBottom:20,color:'#ef4444'}}>
              <span>🗑️</span> Xác nhận xoá ảnh
            </h3>
            <p>Bạn có chắc chắn muốn xoá ảnh này không?</p>
            <div className="modal-buttons" style={{display:'flex',gap:12}}>
              <button 
                onClick={() => handleDelete(confirmDelete)}
                style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:8,padding:'10px 28px',fontWeight:700,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',gap:8,boxShadow:'0 2px 8px #ef444422',transition:'background 0.18s, transform 0.12s'}}
                onMouseEnter={e => { e.currentTarget.style.background = '#b91c1c'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.transform = 'scale(1)'; }}
              >🗑️ Xoá</button>
              <button 
                onClick={handleCloseDelete}
                style={{background:'#f1f5f9',color:'#334155',border:'none',borderRadius:8,padding:'10px 28px',fontWeight:700,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',gap:8,transition:'background 0.18s, transform 0.12s'}}
                onMouseEnter={e => { e.currentTarget.style.background = '#e0e7ef'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.transform = 'scale(1)'; }}
              >❌ Huỷ</button>
            </div>
          </div>
        </div>
      )}

      {/* Camera modal */}
      {showCamera && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Chụp ảnh từ Camera</h3>
            <video ref={videoRef} style={{width:'100%',maxHeight:300,background:'#000',borderRadius:8}} autoPlay muted />
            <canvas ref={canvasRef} style={{display:'none'}} />
            <div className="modal-buttons" style={{marginTop:16}}>
              <button type="button" onClick={handleCapture} style={{background:'#06b6d4',color:'#fff',border:'none',borderRadius:6,padding:'8px 24px',fontWeight:600,cursor:'pointer'}}>Chụp</button>
              <button type="button" onClick={handleCloseCamera} style={{background:'#f1f5f9',color:'#334155',border:'none',borderRadius:6,padding:'8px 24px',fontWeight:600,cursor:'pointer'}}>Huỷ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Dashboard({ token, user, setToken, setUser }) {
  const [tab, setTab] = useState('album');
  const [albums, setAlbums] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [viewAlbumDetail, setViewAlbumDetail] = useState(false);
  const [albumImages, setAlbumImages] = useState([]);

  useEffect(() => {
    if (token) {
      // Load initial data
      const fetchData = async () => {
        try {
          const [albumData, imageData] = await Promise.all([
            getAlbums(token),
            getImages(token)
          ]);
          setAlbums(albumData);
          setImages(imageData);
        } catch (error) {
          console.error('Error loading data:', error);
        }
      };
      fetchData();
    }
  }, [token]);

  const handleAddAlbum = async (album) => {
    try {
      const newAlbum = await createAlbum(album, token);
      setAlbums([...albums, newAlbum]);
    } catch (error) {
      console.error('Error creating album:', error);
    }
  };

  const handleEditAlbum = async (album) => {
    try {
      const updatedAlbum = await editAlbum(album.id, album, token);
      setAlbums(albums.map(a => a.id === album.id ? updatedAlbum : a));
      if (selectedAlbum?.id === album.id) {
        setSelectedAlbum(updatedAlbum);
      }
    } catch (error) {
      console.error('Error updating album:', error);
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    try {
      await deleteAlbum(albumId, token);
      setAlbums(albums.filter(a => a.id !== albumId));
      if (selectedAlbum?.id === albumId) {
        setSelectedAlbum(null);
        setViewAlbumDetail(false);
      }
    } catch (error) {
      console.error('Error deleting album:', error);
    }
  };

  const handleSelectAlbum = async (album) => {
    setSelectedAlbum(album);
    if (album) {
      const imgs = await fetchImagesInAlbum(album.id, token);
      setAlbumImages(imgs);
    } else {
      setAlbumImages([]);
    }
    setViewAlbumDetail(true);
  };

  // Hàm reload lại danh sách ảnh
  const fetchGalleryImages = async () => {
    if (!token) return;
    const imgs = await getImages(token);
    setImages(imgs);
  };

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'#fff'}}>
      {/* Header */}
      <div style={{height:60,background:'linear-gradient(90deg,#6366f1 0%,#06b6d4 100%)',color:'#fff',display:'flex',alignItems:'center',padding:'0 32px',boxShadow:'0 2px 8px #e0e7eb',zIndex:20}}>
        <div style={{fontWeight:'bold',fontSize:22,letterSpacing:1}}>ShotBox Cloud</div>
        <div style={{marginLeft:'auto',fontSize:16}}>Xin chào, <b>{user?.name}</b></div>
      </div>
      {/* Main content with sidebar and body */}
      <div style={{flex:1,display:'flex',minHeight:0,minWidth:0}}>
        {/* Sidebar đẹp, hiện đại */}
        <div style={{
          width:220,
          background:'linear-gradient(180deg,#e0e7ff 0%,#f0fdfa 100%)',
          padding:20,
          borderRight:'1.5px solid #e5e7eb',
          display:'flex',
          flexDirection:'column',
          alignItems:'stretch',
          boxShadow:'2px 0 12px #e0e7eb33',
          minHeight:0,
          borderTopRightRadius:24,
          borderBottomRightRadius:24
        }}>
          <div style={{fontWeight:'bold',fontSize:22,marginBottom:32,color:'#6366f1',letterSpacing:1,display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:28}}>📦</span> ShotBox
          </div>
          <SidebarButton icon="📁" label="Quản lý Album" active={tab==='album'} onClick={()=>{ setTab('album'); setViewAlbumDetail(false); }} />
          <SidebarButton icon="🖼️" label="Quản lý Ảnh" active={tab==='image'} onClick={()=>{ setTab('image'); setViewAlbumDetail(false); }} />
          <SidebarButton icon="🗑️" label="Thùng rác" active={tab==='trash'} onClick={()=>{ setTab('trash'); setViewAlbumDetail(false); }} />
          <SidebarButton icon="💾" label="Bộ nhớ" active={tab==='storage'} onClick={()=>{ setTab('storage'); setViewAlbumDetail(false); }} />
          <SidebarButton icon="👤" label="Trang cá nhân" active={tab==='profile'} onClick={()=>{ setTab('profile'); setViewAlbumDetail(false); }} />
          <button className="sidebar-logout-btn" onClick={() => { setToken(null); setUser(null); }}
            style={{marginTop:'auto',background:'#f1f5f9',color:'#334155',border:'none',borderRadius:8,padding:'12px 0',fontWeight:600,cursor:'pointer',transition:'background 0.18s, color 0.18s',fontSize:16,boxShadow:'0 2px 8px #e0e7eb22'}}>
            🚪 Đăng xuất
          </button>
        </div>
        {/* Main body */}
        <div style={{
          flex: 1,
          padding: '32px',
          overflow: 'hidden',
          background: '#f1f5f9',
          minWidth: 0,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          boxSizing: 'border-box',
          marginLeft: 0
        }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: '#334155' }}>
            {tab === 'album' && (viewAlbumDetail ? `Album: ${selectedAlbum?.albumName}` : 'Quản lý Album')}
            {tab === 'image' && 'Quản lý Ảnh'}
            {tab === 'trash' && 'Thùng rác'}
            {tab === 'storage' && 'Bộ nhớ'}
            {tab === 'profile' && 'Trang cá nhân'}
          </div>
          <div style={{flex: 1,display: 'flex',flexDirection: 'column',minHeight: 0,overflowY: 'auto',overflowX: 'hidden',paddingRight: 8}}>
            {tab === 'profile' && (
              <ProfileManager user={user} setUser={setUser} token={token} />
            )}
            {tab === 'album' && !viewAlbumDetail && (
              <AlbumManager
                albums={albums}
                onAdd={handleAddAlbum}
                onEdit={async (album) => {
                  await handleEditAlbum(album);
                  const [albumData, imageData] = await Promise.all([
                    getAlbums(token),
                    getImages(token)
                  ]);
                  setAlbums(albumData);
                  setImages(imageData);
                }}
                onDelete={async (albumId) => {
                  await handleDeleteAlbum(albumId);
                  const [albumData, imageData] = await Promise.all([
                    getAlbums(token),
                    getImages(token)
                  ]);
                  setAlbums(albumData);
                  setImages(imageData);
                }}
                onSelect={handleSelectAlbum}
                selectedAlbum={selectedAlbum}
                images={images}
                token={token}
              />
            )}
            {tab === 'album' && viewAlbumDetail && selectedAlbum && (
              <div style={{position:'relative'}}>
                <button
                  onClick={() => { setViewAlbumDetail(false); setSelectedAlbum(null); setAlbumImages([]); }}
                  style={{position:'absolute',left:0,top:0,background:'none',border:'none',cursor:'pointer',padding:0,marginBottom:16}}
                  title="Quay lại quản lý album"
                >
                  <span style={{fontSize:28,marginRight:8,verticalAlign:'middle'}}>&larr;</span> <span style={{fontWeight:600,fontSize:18,color:'#334155'}}>Quay lại</span>
                </button>
                <div style={{paddingTop:40}}>
                  <GalleryManager
                    mode="image"
                    token={token}
                    images={albumImages}
                    albums={albums}
                    setImages={setImages}
                    selectedAlbum={selectedAlbum}
                  />
                </div>
              </div>
            )}
            {tab === 'image' && (
              <GalleryManager
                mode="image"
                token={token}
                images={images}
                albums={albums}
                setImages={setImages}
                selectedAlbum={selectedAlbum}
              />
            )}
            {tab === 'trash' && (<Trash token={token} onRestore={fetchGalleryImages} />)}
            {tab === 'storage' && (<div>Chức năng quản lý bộ nhớ (xem dung lượng đã dùng, gói hiện tại, nâng cấp gói)</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// SidebarButton component: hiện đại, có icon, hiệu ứng hover, active
function SidebarButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`sidebar-btn${active ? ' active' : ''}`}
      style={{
        display:'flex',alignItems:'center',gap:12,
        border:'none',borderRadius:10,padding:'12px 0',fontWeight:600,cursor:'pointer',fontSize:17,
        marginBottom:10,
        background: active ? 'linear-gradient(90deg,#6366f1 0%,#06b6d4 100%)' : 'none',
        color: active ? '#fff' : '#334155',
        boxShadow: active ? '0 2px 8px #6366f122' : 'none',
        transition:'background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.12s',
        outline: active ? '2px solid #6366f1' : 'none',
        transform: active ? 'scale(1.04)' : 'scale(1)'
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#e0e7ef'; e.currentTarget.style.color = '#6366f1'; e.currentTarget.style.transform = 'scale(1.03)'; }}}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#334155'; e.currentTarget.style.transform = 'scale(1)'; }}}
    >
      <span style={{fontSize:22}}>{icon}</span> {label}
    </button>
  );
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Đảm bảo khi load lại trang, nếu không có token thì về login
  React.useEffect(() => {
    if (!token) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token]);

  const handleLogin = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  // Đăng xuất xoá localStorage
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Nếu không có token thì luôn hiển thị form đăng nhập/đăng ký
  return (
    <div className="app">
      {!token ? (
        <AuthForm setToken={handleLogin} setUser={setUser} />
      ) : (
        <Dashboard token={token} user={user} setToken={setToken} setUser={setUser} onLogout={handleLogout} />
      )}
    </div>
  );
}
