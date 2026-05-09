import React, { useState, useContext, useCallback, memo } from 'react';
import AuthContext from '../context/AuthContext';
import '../styles/ProfileEdit.css';

const ProfileEdit = memo(({ onClose, profileData: initialData }) => {
  const { authTokens, api_link } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    bio: initialData?.bio || '',
    profile_image: null,
    imagePreview: initialData?.profile_image || null
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Use callbacks to prevent unnecessary re-renders
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  }, []);

  const handleImageChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Compress the image before conversion
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Create an image to get dimensions for compression
          const img = new Image();
          img.onload = () => {
            // Create a canvas to compress the image
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // If image is too large, scale it down
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            
            if (width > MAX_WIDTH) {
              height = Math.round(height * (MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
            
            if (height > MAX_HEIGHT) {
              width = Math.round(width * (MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw and compress
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Get compressed data URL (JPEG at 80% quality)
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            
            // Convert back to File/Blob for upload
            fetch(compressedDataUrl)
              .then(res => res.blob())
              .then(blob => {
                const compressedFile = new File([blob], file.name, { 
                  type: 'image/jpeg',
                  lastModified: new Date().getTime() 
                });
                
                setFormData(prev => ({
                  ...prev,
                  profile_image: compressedFile,
                  imagePreview: compressedDataUrl
                }));
              });
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const updateEndpoint = 'base/update-profile/';
      
      // Create JSON data
      const jsonData = {
        name: formData.name,
        bio: formData.bio
      };
      
      // Include image as base64 if available
      if (formData.profile_image && formData.imagePreview) {
        // If we already have a compressed preview, use that directly
        jsonData.profile_image = formData.imagePreview;
      } else if (formData.profile_image) {
        // Only convert if needed
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(formData.profile_image);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
        jsonData.profile_image = base64;
      }
      
      // Add timeout for slow connections
      const fetchWithTimeout = (url, options, timeout = 30000) => {
        return Promise.race([
          fetch(url, options),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timed out')), timeout)
          )
        ]);
      };
      
      // Use fetch with timeout
      const response = await fetchWithTimeout(`${api_link}${updateEndpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access}`
        },
        body: JSON.stringify(jsonData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`);
      }
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1000); // Reduce from 1500ms to 1000ms for faster response
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [formData, authTokens, api_link, onClose]);

  return (
    <div className="profile-edit-overlay">
      <div className="profile-edit-modal">
        <div className="profile-edit-header">
          <h2>Edit Your Profile</h2>
          <button type="button" className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="profile-edit-content">
          {error && <div className="profile-edit-error"><p>{error}</p></div>}
          {success && <div className="profile-edit-success"><p>Profile updated successfully!</p></div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="profile-image-container">
                <img 
                  src={formData.imagePreview || initialData?.profile_image || "/default-avatar.png"} 
                  alt="Profile Preview" 
                  className="image-preview" 
                />
                <div className="image-upload">
                  <label htmlFor="profile-image" className="upload-button">Change Profile Photo</label>
                  <input
                    type="file"
                    id="profile-image"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="name">Display Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                rows={4}
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button" 
                onClick={onClose}
                disabled={loading}
              >Cancel</button>
              <button 
                type="submit" 
                className="save-button" 
                disabled={loading || success}
              >{loading ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

export default ProfileEdit;