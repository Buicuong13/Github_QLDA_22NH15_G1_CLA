// src/api.js
const API_BASE_URL = 'http://localhost:5000/api';
export default API_BASE_URL;

export const getImageAlbums = async (imageId, token) => {
  const res = await fetch(`${API_BASE_URL}/image/${imageId}/album`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch image albums');
  }
  return data;
};

export const getDeletedImages = async (token) => {
  const res = await fetch(`${API_BASE_URL}/image/deleted`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch deleted images');
  }
  return data;
};

export const restoreDeletedImage = async (img, token) => {
  // Gửi dữ liệu ảnh về lại images, rồi xoá khỏi deleted_images
  const res = await fetch(`${API_BASE_URL}/image/restore`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(img)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to restore image');
  }
  return data;
};

export const permanentlyDeleteImage = async (id, token) => {
  const res = await fetch(`${API_BASE_URL}/image/deleted/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to permanently delete image');
  }
  return data;
};

export const addImageToAlbum = async (imageId, albumId, token) => {
  // Correct endpoint: POST /api/album/add-image
  const res = await fetch(`${API_BASE_URL}/album/add-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ imageId, albumId })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to add image to album');
  }
  return data;
};

export const removeImageFromAlbum = async (imageId, albumId, token) => {
  // Correct endpoint: DELETE /api/album/:id/images with body { imageIds: [imageId] }
  const res = await fetch(`${API_BASE_URL}/album/${albumId}/images`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ imageIds: [imageId] })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to remove image from album');
  }
  return data;
};
