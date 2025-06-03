import React from 'react';

// Unified image grid for album, gallery, trash
const ImageGrid = ({ images, onMenuClick, showMenu, renderMenu, onImageClick, imageActions, imageStyle, cardStyle }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 20,
      marginTop: 16
    }}>
      {images.map(img => (
        <div
          key={img.id}
          style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 8px #e5e7eb',
            padding: 16,
            minHeight: 260,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            transition: 'box-shadow 0.2s, transform 0.2s',
            cursor: onImageClick || onMenuClick ? 'pointer' : 'default',
            userSelect: 'none',
            outline: 'none',
          }}
          tabIndex={0}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 8px 32px #6366f199, 0 2px 8px #a5b4fc55';
            e.currentTarget.style.transform = 'scale(1.03)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 2px 8px #e5e7eb';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onClick={onImageClick ? () => onImageClick(img) : undefined}
          onKeyDown={onImageClick ? (e => { if (e.key === 'Enter' || e.key === ' ') onImageClick(img); }) : undefined}
        >
          <img
            src={img.url}
            alt={img.fileName}
            style={{
              width: '100%',
              height: 200,
              objectFit: 'cover',
              borderRadius: 8,
              marginBottom: 12,
              transition: 'box-shadow 0.2s, transform 0.2s',
              cursor: onImageClick ? 'pointer' : 'default',
            }}
          />
          <div style={{ marginTop: 8, fontWeight: 500, fontSize: 14, textAlign: 'center', width: '100%', wordBreak: 'break-word', cursor: onImageClick ? 'pointer' : 'default' }}>{img.fileName}</div>
          {/* Three-dot menu at bottom right */}
          <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
            <button
              className="image-menu-btn"
              style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', padding: 0, borderRadius: 6, transition: 'background 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
              onClick={e => { e.stopPropagation(); onMenuClick && onMenuClick(img); }}
              tabIndex={0}
            >
              ⋯
            </button>
            {showMenu === img.id && renderMenu && (
              <div className="image-menu-dropdown" style={{position:'absolute',zIndex:10,right:0,top:32}}
                onClick={e => e.stopPropagation()}
              >
                {renderMenu(img, {
                  onDownload: () => imageActions && imageActions(img, 'download'),
                  onEdit: () => imageActions && imageActions(img, 'edit'),
                  onDelete: () => imageActions && imageActions(img, 'delete'),
                })}
              </div>
            )}
          </div>
          {imageActions && imageActions(img)}
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
