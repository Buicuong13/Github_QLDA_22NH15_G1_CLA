import React from 'react';
import ImageManager from './components/ImageManager';
import { uploadImage, editImage, deleteImage, getImages } from './api';
import { addImageToAlbum, removeImageFromAlbum } from './api/imageAlbums';
import './GalleryManager.css';

// AlbumCard component for better UI
function AlbumCard({ album, active, onClick }) {
  return (
    <div
      className={`album-card${active ? ' active' : ''}`}
      style={{
        background: active ? 'linear-gradient(135deg,#a5b4fc 0%,#f0fdfa 100%)' : 'linear-gradient(135deg,#fff 0%,#e0e7ef 100%)',
        borderRadius: 20,
        boxShadow: active
          ? '0 8px 32px #6366f199, 0 2px 8px #a5b4fc55'
          : '0 2px 12px #e0e7eb',
        padding: 32,
        minWidth: 260,
        minHeight: 140,
        cursor: 'pointer',
        border: active ? '3px solid #6366f1' : '2px solid #e5e7eb',
        fontWeight: 600,
        transition: 'box-shadow 0.2s, border 0.2s, background 0.2s, transform 0.2s',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 12,
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        outline: 'none',
      }}
      tabIndex={0}
      onClick={onClick}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 8px 32px #6366f199, 0 2px 8px #a5b4fc55';
        e.currentTarget.style.transform = 'scale(1.03)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = active ? '0 8px 32px #6366f199, 0 2px 8px #a5b4fc55' : '0 2px 12px #e0e7eb';
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      <div style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: active ? 'linear-gradient(135deg,#6366f1 0%,#06b6d4 100%)' : 'linear-gradient(135deg,#f1f5f9 0%,#e0e7ef 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        boxShadow: active ? '0 2px 8px #6366f133' : 'none',
      }}>
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3" fill={active ? '#fff' : '#6366f1'} /><path d="M3 17l4.5-6 4.5 6 4.5-6 4.5 6" stroke={active ? '#6366f1' : '#06b6d4'} strokeWidth="2" fill="none" /></svg>
      </div>
      <div style={{ fontSize: 24, marginBottom: 2, color: '#334155', fontWeight: 800 }}>{album.albumName}</div>
      {album.description && <div style={{ fontSize: 15, color: '#64748b', marginBottom: 2 }}>{album.description}</div>}
      <div style={{ fontSize: 13, color: '#94a3b8' }}>ID: {album.id}</div>
    </div>
  );
}

const GalleryManager = ({ mode = 'album', token, images, setImages, albums, selectedAlbum }) => {
  const [activeAlbum, setActiveAlbum] = React.useState(selectedAlbum || null);
  const [albumImages, setAlbumImages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    setActiveAlbum(selectedAlbum || null);
  }, [selectedAlbum]);

  // Move fetchAlbumImages outside useEffect so it can be called anywhere
  const fetchAlbumImages = async (albumId = null) => {
    const id = albumId || (activeAlbum && activeAlbum.id);
    if (!id || !token) {
      setAlbumImages([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/album/${id}/images`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Không thể tải danh sách ảnh của album');
      const data = await res.json();
      setAlbumImages(data.images || []);
    } catch (err) {
      setAlbumImages([]);
      setError(err.message || 'Lỗi khi tải ảnh album');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAlbumImages();
    // eslint-disable-next-line
  }, [activeAlbum, token]);

  // Unified image CRUD handlers
  const handleAdd = async (formData) => {
    setLoading(true);
    setError('');
    try {
      const uploadedImage = await uploadImage(formData, token);
      setImages(prev => [...prev, uploadedImage]);
      if (activeAlbum) {
        await addImageToAlbum(uploadedImage.id, activeAlbum.id, token);
        setAlbumImages(prev => [...prev, uploadedImage]);
      }
      return uploadedImage;
    } catch (err) {
      setError(err.message || 'Lỗi khi thêm ảnh');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = async (id, data) => {
    setLoading(true);
    setError('');
    try {
      const updatedImage = await editImage(id, data, token);
      setImages(prev => prev.map(img => img.id === id ? updatedImage : img));
      setAlbumImages(prev => prev.map(img => img.id === id ? updatedImage : img));
      // Nếu đang ở album, cập nhật ngay danh sách ảnh album (đảm bảo UI phản ánh tức thì)
    } catch (err) {
      setError(err.message || 'Lỗi khi sửa ảnh');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    setLoading(true);
    setError('');
    try {
      await deleteImage(id, token);
      setImages(prev => prev.filter(img => img.id !== id));
      setAlbumImages(prev => prev.filter(img => img.id !== id)); // Cập nhật ngay danh sách ảnh album
    } catch (err) {
      setError(err.message || 'Lỗi khi xóa ảnh');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const handleMove = (imageId, albumId) => {
    // Optimistically update UI: only remove image if moving out of current album
    if (mode !== 'image' && activeAlbum) {
      if (!albumId || Number(albumId) !== activeAlbum.id) {
        setAlbumImages(prev => prev.filter(img => img.id !== imageId));
      }
      setImages(prev => prev.map(img =>
        img.id === imageId ? { ...img, albumId: albumId ? Number(albumId) : null } : img
      ));
    }
    // Async update in background
    (async () => {
      setLoading(true);
      setError('');
      try {
        // Remove from all albums first (for both modes)
        for (const album of albums) {
          try {
            await removeImageFromAlbum(imageId, album.id, token);
          } catch {}
        }
        // Add to new album if selected
        if (albumId && albumId !== '' && albumId !== null) {
          await addImageToAlbum(imageId, albumId, token);
        }
        // Background re-fetch to ensure consistency
        if (mode === 'image') {
          const allImages = await getImages(token);
          setImages(allImages);
        } else if (activeAlbum) {
          await fetchAlbumImages();
        }
      } catch (err) {
        setError(err.message || 'Lỗi khi chuyển ảnh');
      } finally {
        setLoading(false);
      }
    })();
  };

  if (mode === 'image') {
    return (
      <div className="gallery-manager">
        <ImageManager
          images={images}
          albums={albums}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMove={handleMove}
          selectedAlbum={null} // always null in all-images mode
          token={token}
          loading={loading}
        />
      </div>
    );
  }

  // Nếu đã chọn album thì hiển thị danh sách ảnh trong album bằng ImageManager
  return (
    <div style={{marginTop: 32}}>
      {error && (
        <div style={{background:'#fee2e2',color:'#ef4444',padding:'8px 16px',borderRadius:6,marginBottom:16}}>{error}</div>
      )}
      <ImageManager
        images={albumImages}
        albums={albums}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onMove={handleMove}
        selectedAlbum={activeAlbum}
        token={token}
        loading={loading}
      />
    </div>
  );
};

export default GalleryManager;

// Thêm class cho các nút menu bên trái
// .menu-button {
//   position: relative;
//   overflow: hidden;
//   transition: background 0.3s, color 0.3s;
// }
// .menu-button:hover {
//   background: rgba(99, 102, 241, 0.1);
//   color: #6366f1;
// }
// .menu-button:active {
//   background: rgba(99, 102, 241, 0.2);
// }

// Không cần sửa logic React, chỉ cần thêm CSS cho hiệu ứng hover
// .gallery-manager {
//   display: flex;
//   flex-direction: column;
//   align-items: stretch;
//   padding: 0 16px;
// }
// .image-manager {
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
//   gap: 16px;
// }
// .album-card {
//   transition: transform 0.3s, box-shadow 0.3s;
// }
// .album-card:hover {
//   transform: translateY(-2px);
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
// }
