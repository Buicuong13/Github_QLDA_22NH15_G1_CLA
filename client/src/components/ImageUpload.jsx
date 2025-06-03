import React, { useState } from 'react';

const ImageUpload = ({ onUpload, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('fileName', fileName);

    try {
      await onUpload(formData);
      onClose();
    } catch (err) {
      console.error('Upload error:', err);
      alert(err.message || 'Failed to upload image');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Upload Image</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              required
            />
          </div>
          {preview && (
            <div className="preview-container">
              <img 
                src={preview} 
                alt="Preview" 
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  objectFit: 'contain',
                  marginBottom: '16px'
                }}
              />
            </div>
          )}
          <div className="form-group">
            <label>File Name:</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              required
            />
          </div>
          <div className="modal-buttons">
            <button type="submit">Upload</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 24px;
          border-radius: 8px;
          width: 90%;
          max-width: 400px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
        }

        .form-group input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .modal-buttons {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .modal-buttons button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.18s, box-shadow 0.18s, transform 0.12s;
        }

        .modal-buttons button:hover {
          filter: brightness(1.08);
          box-shadow: 0 2px 8px rgba(40, 167, 69, 0.12), 0 1.5px 4px rgba(0,0,0,0.08);
          transform: translateY(-2px) scale(1.04);
        }

        .modal-buttons button:active {
          filter: brightness(0.97);
          box-shadow: 0 1px 2px rgba(40, 167, 69, 0.10);
          transform: scale(0.98);
        }

        .modal-buttons button[type="submit"] {
          background: linear-gradient(90deg,#28a745 0%,#34d399 100%);
          color: white;
          font-weight: 600;
          box-shadow: 0 2px 8px #28a74522;
        }
        .modal-buttons button[type="submit"]:hover {
          background: linear-gradient(90deg,#34d399 0%,#28a745 100%);
        }
        .modal-buttons button[type="button"] {
          background: #6c757d;
          color: white;
          font-weight: 600;
        }
        .modal-buttons button[type="button"]:hover {
          background: #495057;
        }
      `}</style>
    </div>
  );
};

export default ImageUpload;
