const API_BASE_URL = 'http://localhost:5000/api';

// Auth endpoints
export const login = async (name, password) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, password })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
};

export const register = async (name, password, email) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, password, email })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
};

// Album endpoints
export const getAlbums = async (token) => {
  const res = await fetch(`${API_BASE_URL}/album`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch albums');
  }
  return data;
};

export const createAlbum = async (album, token) => {
  const res = await fetch(`${API_BASE_URL}/album`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(album)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create album');
  }
  return data;
};

export const editAlbum = async (id, updates, token) => {
  const res = await fetch(`${API_BASE_URL}/album/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update album');
  }
  return data;
};

export const deleteAlbum = async (id, token) => {
  const res = await fetch(`${API_BASE_URL}/album/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete album');
  }
  return data;
};

// Image endpoints
export const getImages = async (token) => {
  const res = await fetch(`${API_BASE_URL}/image`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch images');
  }
  return data;
};

export const uploadImage = async (formData, token) => {
  // First upload to Cloudinary
  const uploadFormData = new FormData();
  uploadFormData.append('file', formData.get('file'));
  uploadFormData.append('upload_preset', 'demo-upload');
  uploadFormData.append('folder', 'Demo');

  const uploadRes = await fetch('https://api.cloudinary.com/v1_1/dcvl3jxl0/image/upload', {
    method: 'POST',
    body: uploadFormData
  });
  const cloudinaryData = await uploadRes.json();
  
  if (!uploadRes.ok) {
    throw new Error(cloudinaryData.error?.message || 'Failed to upload to Cloudinary');
  }

  // Then save to our server
  const saveRes = await fetch(`${API_BASE_URL}/image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      fileName: formData.get('fileName'),
      url: cloudinaryData.secure_url,
      fileSize: cloudinaryData.bytes,
      fileWidth: cloudinaryData.width,
      fileHeight: cloudinaryData.height,
      fileFormat: cloudinaryData.format
    })
  });
  const data = await saveRes.json();
  if (!saveRes.ok) {
    throw new Error(data.message || 'Failed to save image info');
  }
  return data;
};

export const editImage = async (id, imageData, token) => {
  const res = await fetch(`${API_BASE_URL}/image/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(imageData)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update image');
  }
  return data;
};

export const deleteImage = async (id, token) => {
  const res = await fetch(`${API_BASE_URL}/image/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete image');
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

// Update user info
export const updateUserInfo = async (updates, token) => {
  const res = await fetch(`${API_BASE_URL}/user/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update user info');
  }
  return data;
};

// Change password
export const changePassword = async (body, token) => {
  const res = await fetch(`${API_BASE_URL}/user/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to change password');
  }
  return data;
};
