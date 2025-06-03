import React, { useState } from 'react';
import { uploadImage, editImage, deleteImage, addImageToAlbum, removeImageFromAlbum } from '../api';
import { getImageAlbums } from '../api/imageAlbums';
import ImageGrid from './ImageGrid';

const ImageManager = ({ images, albums, onAdd, onEdit, onDelete, onMove, selectedAlbum, token }) => {
  const [showUpload, setShowUpload] = useState(false);
  const [editImg, setEditImg] = useState(null);
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageAlbums, setImageAlbums] = useState({}); // { [imageId]: [album, ...] }
  const [pendingMove, setPendingMove] = useState(null); // {imageId, albumId, albumName}
  const [showCamera, setShowCamera] = useState(false);
  const [cameraImage, setCameraImage] = useState(null); // { blob, url }
  const [cameraFileName, setCameraFileName] = useState('');
  const [viewImage, setViewImage] = useState(null); // {img}
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  // Filter images by selected album
  // Nếu đã truyền images là danh sách ảnh của album, không cần filter lại nữa
  const displayImages = images;

  // Fetch albums for each image on mount or images change
  React.useEffect(() => {
    const fetchAlbums = async () => {
      if (!token || !images.length) return;
      const result = {};
      for (const img of images) {
        try {
          const albums = await getImageAlbums(img.id, token);
          result[img.id] = albums;
        } catch (e) {
          result[img.id] = [];
        }
      }
      setImageAlbums(result);
    };
    fetchAlbums();
  }, [images, token]);

  // Đóng menu khi click ra ngoài
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (showMenu !== null) {
        const menu = document.querySelector('.image-menu-dropdown');
        if (menu && !menu.contains(e.target)) {
          setShowMenu(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // Helper to get current albumId for an image (first album if exists)
  const getCurrentAlbumId = (img) => {
    const albums = imageAlbums[img.id];
    return albums && albums.length > 0 ? albums[0].id : '';
  };

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
      await onDelete(id); // Soft delete: chuyển ảnh vào thùng rác (deleted_images)
      setConfirmDelete(null);
    } catch (err) {
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
      if (albumId) {
        await addImageToAlbum(imageId, albumId, token);
      } else if (selectedAlbum) {
        await removeImageFromAlbum(imageId, selectedAlbum.id, token);
      }
      // Optimistically update UI: notify parent to remove image from current album view immediately
      if (typeof onMove === 'function') {
        onMove(imageId, albumId ? Number(albumId) : null); // Parent should update state instantly
      }
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

  // Tải xuống ảnh về máy (dùng fetch để lấy blob, đặt tên file đúng định dạng)
  const handleDownloadToDevice = async (url, name) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const ext = name && name.includes('.') ? name.split('.').pop() : 'jpg';
      const fileName = name || `image.${ext}`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      }, 200);
    } catch (e) {
      alert('Không thể tải ảnh về máy.');
    }
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
          const url = URL.createObjectURL(blob);
          setCameraImage({ blob, url });
          setCameraFileName(`camera_${Date.now()}.png`);
          // Stop camera
          if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
          }
        }
      }, 'image/png');
    }
  };

  const handleSaveCameraImage = () => {
    if (!cameraImage || !cameraFileName.trim()) return;
    const file = new File([cameraImage.blob], cameraFileName, { type: 'image/png' });
    setSelectedFile(file);
    setFileName(cameraFileName);
    setPreview(cameraImage.url);
    setShowUpload(true); // Hiển thị form upload ngay sau khi lưu từ camera
    setShowCamera(false);
    setCameraImage(null);
    setCameraFileName('');
  };

  const handleDownloadCameraImage = () => {
    if (cameraImage && cameraImage.url) {
      const link = document.createElement('a');
      link.href = cameraImage.url;
      link.download = cameraFileName || 'camera_image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRetakeCameraImage = () => {
    setCameraImage(null);
    setCameraFileName('');
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

  const handleCloseCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
    setCameraImage(null);
    setCameraFileName('');
  };

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <h3 style={{margin:0}}>
          Danh sách Ảnh {selectedAlbum ? `(Album: ${selectedAlbum.albumName})` : ''}
        </h3>
        <div style={{display:'flex',gap:8}}>
          <button
            onClick={() => setShowUpload(true)}
            style={{
              background:'linear-gradient(90deg,#6366f1 0%,#06b6d4 100%)',
              color:'#fff',
              border:'none',
              borderRadius:8,
              padding:'10px 24px',
              fontWeight:600,
              cursor:'pointer',
              transition:'background 0.2s, color 0.2s, transform 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e0e7ef'; e.currentTarget.style.color = '#6366f1'; e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(90deg,#6366f1 0%,#06b6d4 100%)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Upload ảnh mới
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

      <ImageGrid
        images={displayImages}
        showMenu={showMenu}
        onMenuClick={img => setShowMenu(img.id === showMenu ? null : img.id)}
        renderMenu={img => (
          <div className="image-menu-dropdown" style={{
            position: 'absolute',
            bottom: 32,
            right: 0,
            background: '#fff',
            boxShadow: '0 2px 8px #e5e7eb',
            borderRadius: 8,
            minWidth: 150,
            padding: '6px 0',
            zIndex: 10
          }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={async (e) => {
                e.stopPropagation();
                await handleDownloadToDevice(img.url, img.fileName);
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
              onClick={(e) => {
                e.stopPropagation();
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
              onClick={(e) => {
                e.stopPropagation();
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
        imageActions={img => (
          <div style={{
            display:'flex',
            alignItems:'center',
            width:'100%',
            gap:8,
            marginTop:4
          }}>
            <select
              value={getCurrentAlbumId(img)}
              onChange={e => {
                const albumId = e.target.value || null;
                const albumName = albums.find(a => a.id === albumId)?.albumName || '+ Album';
                setPendingMove({ imageId: img.id, albumId, albumName }); // Chỉ setPendingMove, không gọi handleMove trực tiếp
              }}
              onClick={e => e.stopPropagation()} // Ngăn click lan ra ngoài, không phóng to ảnh
              style={{
                border:'1px solid #e5e7eb',
                borderRadius:6,
                padding:'4px 8px',
                fontSize:14,
                minWidth:140,
                maxWidth:220,
                marginRight:'auto',
                whiteSpace:'nowrap',
                overflow:'hidden',
                textOverflow:'ellipsis',
                background:'#fff'
              }}
              disabled={loading}
            >
              <option value="">+ Album</option>
              {albums.map((alb) => (
                <option key={alb.id} value={alb.id}>{alb.albumName}</option>
              ))}
            </select>
          </div>
        )}
        onImageClick={img => setViewImage(img)}
      />

      {/* Image viewer modal */}
      {viewImage && (
        <div className="modal-overlay" style={{zIndex:1000}}>
          <div className="modal-content" style={{borderRadius:16,boxShadow:'0 8px 32px #6366f133, 0 2px 8px #06b6d455',padding:0,minWidth:0,maxWidth:'98vw',maxHeight:'98vh',display:'flex',flexDirection:'column',alignItems:'center',background:'#fff',position:'relative'}}>
            <button onClick={() => setViewImage(null)} style={{position:'absolute',top:12,right:16,background:'none',border:'none',fontSize:40,color:'#334155',cursor:'pointer',padding:0,zIndex:2}} title="Đóng">×</button>
            <img src={viewImage.url} alt={viewImage.fileName} style={{maxWidth:'96vw',maxHeight:'80vh',borderRadius:16,margin:'48px 48px 24px 48px',boxShadow:'0 2px 16px #6366f122',objectFit:'contain',background:'#f8fafc'}} />
            <div style={{display:'flex',gap:24,marginBottom:32,justifyContent:'center'}}>
              <button onClick={() => handleDownloadToDevice(viewImage.url, viewImage.fileName)} style={{background:'#0ea5e9',color:'#fff',border:'none',borderRadius:8,padding:'12px 32px',fontWeight:700,cursor:'pointer',fontSize:18,display:'flex',alignItems:'center',gap:10,boxShadow:'0 2px 8px #0ea5e922',transition:'background 0.18s, transform 0.12s'}}
                onMouseEnter={e => { e.currentTarget.style.background = '#0369a1'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#0ea5e9'; e.currentTarget.style.transform = 'scale(1)'; }}
              >💾 Tải về máy</button>
              <button onClick={() => { setEditImg(viewImage); setFileName(viewImage.fileName); setShowUpload(true); setViewImage(null); }} style={{background:'#fbbf24',color:'#fff',border:'none',borderRadius:8,padding:'12px 32px',fontWeight:700,cursor:'pointer',fontSize:18,display:'flex',alignItems:'center',gap:10,boxShadow:'0 2px 8px #fbbf2422',transition:'background 0.18s, transform 0.12s'}}
                onMouseEnter={e => { e.currentTarget.style.background = '#f59e42'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fbbf24'; e.currentTarget.style.transform = 'scale(1)'; }}
              >✏️ Sửa</button>
              <button onClick={() => { setConfirmDelete(viewImage.id); setViewImage(null); }} style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:8,padding:'12px 32px',fontWeight:700,cursor:'pointer',fontSize:18,display:'flex',alignItems:'center',gap:10,boxShadow:'0 2px 8px #ef444422',transition:'background 0.18s, transform 0.12s'}}
                onMouseEnter={e => { e.currentTarget.style.background = '#b91c1c'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.transform = 'scale(1)'; }}
              >🗑️ Xoá</button>
            </div>
          </div>
        </div>
      )}

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
                      <button type="button" style={{marginLeft:16,background:'#f1f5f9',color:'#334155',border:'none',borderRadius:6,padding:'4px 16px',fontWeight:600,cursor:'pointer'}} onClick={() => { setSelectedFile(null); setPreview(''); setFileName(''); }}>Đổi ảnh</button>
                    </div>
                  )}
                  {preview && (
                    <div className="preview-container" style={{marginBottom:18}}>
                      <img 
                        src={preview} 
                        alt="Preview" 
                        style={{maxWidth: '100%',maxHeight: '200px',objectFit: 'contain',marginBottom: '16px',borderRadius:10,boxShadow:'0 2px 8px #6366f122'}}
                      />
                    </div>
                  )}
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
                    onFocus={e => e.target.style.border='1.5px solid #06b6d4'}
                    onBlur={e => e.target.style.border='1.5px solid #e5e7eb'}
                  />
                </div>
                <div className="modal-buttons" style={{display:'flex',gap:12,marginTop:10}}>
                  <button type="submit" disabled={loading || !fileName.trim() || !selectedFile} style={{background:'#06b6d4',color:'#fff',border:'none',borderRadius:8,padding:'10px 28px',fontWeight:700,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',gap:8,boxShadow:'0 2px 8px #06b6d422',transition:'background 0.18s, transform 0.12s'}}
                    onMouseEnter={e => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#06b6d4'; e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    ➕ Upload
                  </button>
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
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal-content" style={{borderRadius:16,boxShadow:'0 8px 32px #6366f133, 0 2px 8px #ef444455',padding:32,minWidth:340,background:'#fff'}}>
            <h3 style={{display:'flex',alignItems:'center',gap:8,fontWeight:700,fontSize:22,marginBottom:20,color:'#ef4444'}}>
              🗑️ Xác nhận xoá ảnh
            </h3>
            <div style={{marginBottom:24,fontSize:16}}>
              Bạn có chắc chắn muốn xoá ảnh này không? Ảnh sẽ được chuyển vào thùng rác.
            </div>
            <div className="modal-buttons" style={{display:'flex',gap:12,marginTop:10}}>
              <button onClick={() => handleDelete(confirmDelete)} disabled={loading} style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:8,padding:'10px 28px',fontWeight:700,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',gap:8,boxShadow:'0 2px 8px #ef444422',transition:'background 0.18s, transform 0.12s'}}
                onMouseEnter={e => { e.currentTarget.style.background = '#b91c1c'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                🗑️ Xoá
              </button>
              <button onClick={handleCloseDelete} disabled={loading} style={{background:'#f1f5f9',color:'#334155',border:'none',borderRadius:8,padding:'10px 28px',fontWeight:700,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',gap:8,transition:'background 0.18s, transform 0.12s'}}
                onMouseEnter={e => { e.currentTarget.style.background = '#e0e7ef'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                ❌ Huỷ
              </button>
            </div>
          </div>
        </div>
      )}
      {showCamera && (
        <div className="modal-overlay">
          <div className="modal-content" style={{borderRadius:18,boxShadow:'0 8px 32px #6366f133, 0 2px 8px #06b6d455',padding:40,minWidth:900,background:'#fff',display:'flex',flexDirection:'column',alignItems:'center'}}>
            <h3 style={{display:'flex',alignItems:'center',gap:12,fontWeight:700,fontSize:28,marginBottom:28,color:'#06b6d4'}}>
              📷 Chụp ảnh bằng Camera
            </h3>
            {!cameraImage ? (
              <>
                <video ref={videoRef} style={{width:720,height:360,borderRadius:16,background:'#000',marginBottom:28}} autoPlay muted />
                <div style={{display:'flex',gap:20,marginTop:12,flexWrap:'nowrap',justifyContent:'center',width:'100%'}}>
                  <button onClick={handleCapture} style={{background:'#06b6d4',color:'#fff',border:'none',borderRadius:12,padding:'14px 44px',fontWeight:700,cursor:'pointer',fontSize:20,boxShadow:'0 2px 8px #06b6d422',whiteSpace:'nowrap',transition:'background 0.18s, transform 0.12s'}}
                    onMouseEnter={e => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#06b6d4'; e.currentTarget.style.transform = 'scale(1)'; }}
                  >📸 Chụp ảnh</button>
                  <button onClick={handleCloseCamera} style={{background:'#f1f5f9',color:'#334155',border:'none',borderRadius:12,padding:'14px 44px',fontWeight:700,cursor:'pointer',fontSize:20,whiteSpace:'nowrap',transition:'background 0.18s, transform 0.12s'}}>
                    ❌ Huỷ
                  </button>
                </div>
              </>
            ) : (
              <>
                <img src={cameraImage.url} alt="Camera preview" style={{width:720,height:360,objectFit:'contain',borderRadius:16,background:'#f8fafc',marginBottom:28}} />
                <div style={{display:'flex',gap:20,marginTop:12,flexWrap:'nowrap',justifyContent:'center',width:'100%'}}>
                  <button onClick={handleSaveCameraImage} style={{background:'#06b6d4',color:'#fff',border:'none',borderRadius:12,padding:'14px 32px',fontWeight:700,cursor:'pointer',fontSize:20,boxShadow:'0 2px 8px #06b6d422',whiteSpace:'nowrap',transition:'background 0.18s, transform 0.12s'}}>💾 Lưu vào form</button>
                  <button onClick={handleDownloadCameraImage} style={{background:'#0ea5e9',color:'#fff',border:'none',borderRadius:12,padding:'14px 32px',fontWeight:700,cursor:'pointer',fontSize:20,boxShadow:'0 2px 8px #0ea5e922',whiteSpace:'nowrap',transition:'background 0.18s, transform 0.12s'}}>⬇️ Tải về</button>
                  <button onClick={handleRetakeCameraImage} style={{background:'#fbbf24',color:'#fff',border:'none',borderRadius:12,padding:'14px 32px',fontWeight:700,cursor:'pointer',fontSize:20,boxShadow:'0 2px 8px #fbbf2422',whiteSpace:'nowrap',transition:'background 0.18s, transform 0.12s'}}>🔄 Chụp lại</button>
                  <button onClick={handleCloseCamera} style={{background:'#f1f5f9',color:'#334155',border:'none',borderRadius:12,padding:'14px 32px',fontWeight:700,cursor:'pointer',fontSize:20,whiteSpace:'nowrap',transition:'background 0.18s, transform 0.12s'}}>❌ Huỷ</button>
                </div>
              </>
            )}
            <canvas ref={canvasRef} style={{display:'none'}} />
          </div>
        </div>
      )}

      {/* Modal xác nhận chuyển ảnh vào album */}
      {pendingMove && (
        <div className="modal-overlay">
          <div className="modal-content" style={{borderRadius:16,boxShadow:'0 8px 32px #6366f133, 0 2px 8px #06b6d455',padding:32,minWidth:340,background:'#fff'}}>
            <h3 style={{display:'flex',alignItems:'center',gap:8,fontWeight:700,fontSize:22,marginBottom:20,color:'#06b6d4'}}>
              📁 Xác nhận chuyển ảnh
            </h3>
            <div style={{marginBottom:24,fontSize:16}}>
              Bạn có chắc chắn muốn chuyển ảnh này vào album này không?
            </div>
            <div className="modal-buttons" style={{display:'flex',gap:12,marginTop:10}}>
              <button onClick={async () => { 
                await handleMove(pendingMove.imageId, pendingMove.albumId); 
                setPendingMove(null);
              }} disabled={loading} style={{background:'#06b6d4',color:'#fff',border:'none',borderRadius:8,padding:'10px 28px',fontWeight:700,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',gap:8,boxShadow:'0 2px 8px #06b6d422',transition:'background 0.18s, transform 0.12s'}}
                onMouseEnter={e => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#06b6d4'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                💾 Xác nhận
              </button>
              <button onClick={() => setPendingMove(null)} disabled={loading} style={{background:'#f1f5f9',color:'#334155',border:'none',borderRadius:8,padding:'10px 28px',fontWeight:700,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',gap:8,transition:'background 0.18s, transform 0.12s'}}
                onMouseEnter={e => { e.currentTarget.style.background = '#e0e7ef'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                ❌ Huỷ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageManager;
