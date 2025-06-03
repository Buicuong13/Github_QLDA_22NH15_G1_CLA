import React, { useEffect, useState } from 'react';
import { getDeletedImages, restoreDeletedImage, permanentlyDeleteImage } from '../api/imageAlbums';
import ImageGrid from './ImageGrid';

// Modal xác nhận đẹp
function ConfirmModal({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16
      }}>
        <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>{title}</div>
        <div style={{ color: '#444', marginBottom: 16, textAlign: 'center' }}>{message}</div>
        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={onCancel} disabled={loading} style={{ padding: '8px 20px', borderRadius: 6, border: '1px solid #ccc', background: '#f3f4f6', cursor: 'pointer' }}>Huỷ</button>
          <button onClick={onConfirm} disabled={loading} style={{ padding: '8px 20px', borderRadius: 6, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>{loading ? 'Đang xử lý...' : 'Xác nhận'}</button>
        </div>
      </div>
    </div>
  );
}

const Trash = ({ token, onRestore }) => {
  const [deletedImages, setDeletedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, type: '', img: null });

  useEffect(() => {
    const fetchDeleted = async () => {
      try {
        setLoading(true);
        const images = await getDeletedImages(token);
        setDeletedImages(images);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchDeleted();
  }, [token]);

  const handleRestore = (img) => {
    setConfirmModal({ open: true, type: 'restore', img });
  };

  const handlePermanentDelete = (img) => {
    setConfirmModal({ open: true, type: 'delete', img });
  };

  const handleConfirm = async () => {
    setActionLoading(true);
    setActionError(null);
    const { type, img } = confirmModal;
    try {
      if (type === 'restore') {
        await restoreDeletedImage(img, token);
        setDeletedImages(deletedImages.filter(i => i.id !== img.id));
        if (onRestore) onRestore();
      } else if (type === 'delete') {
        await permanentlyDeleteImage(img.id, token);
        setDeletedImages(deletedImages.filter(i => i.id !== img.id));
      }
      setConfirmModal({ open: false, type: '', img: null });
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = () => {
    setConfirmModal({ open: false, type: '', img: null });
  };

  // Outside click logic for dropdown menu
  useEffect(() => {
    if (showMenu === null) return;
    function handleClickOutside(e) {
      // If click is outside any trash-menu-dropdown or the menu button, close menu
      if (
        !e.target.closest('.trash-menu-dropdown') &&
        !e.target.closest('.trash-menu-btn')
      ) {
        setShowMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  if (loading) return <div>Đang tải ảnh đã xoá...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div>
      <h3>Thùng rác</h3>
      {deletedImages.length === 0 ? (
        <div>Không có ảnh nào trong thùng rác.</div>
      ) : (
        <>
          <ImageGrid
            images={deletedImages}
            showMenu={showMenu}
            onMenuClick={img => setShowMenu(img.id === showMenu ? null : img.id)}
            renderMenu={img => (
              <div className="trash-menu-dropdown" style={{ position: 'absolute', bottom: 32, right: 0, background: '#fff', border: '1px solid #ccc', borderRadius: 6, zIndex: 10, minWidth: 180 }}>
                <button
                  onClick={() => { handleRestore(img); setShowMenu(null); }}
                  disabled={actionLoading}
                  style={{
                    width: '100%',
                    padding: 8,
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    borderRadius: 6,
                    transition: 'background 0.2s, color 0.2s, transform 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#e0e7ef'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  ♻️ Khôi phục
                </button>
                <button
                  onClick={() => { handlePermanentDelete(img); setShowMenu(null); }}
                  disabled={actionLoading}
                  style={{
                    width: '100%',
                    padding: 8,
                    border: 'none',
                    background: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    borderRadius: 6,
                    transition: 'background 0.2s, color 0.2s, transform 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  🗑️ Xoá vĩnh viễn
                </button>
              </div>
            )}
          />
          {actionError && <div style={{ color: 'red', marginTop: 8 }}>{actionError}</div>}
        </>
      )}
      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.type === 'restore' ? 'Khôi phục ảnh' : 'Xoá vĩnh viễn'}
        message={confirmModal.type === 'restore'
          ? 'Bạn có chắc muốn khôi phục ảnh này không?'
          : 'Bạn có chắc muốn xoá vĩnh viễn ảnh này? Hành động này không thể hoàn tác!'}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        loading={actionLoading}
      />
    </div>
  );
};

export default Trash;
