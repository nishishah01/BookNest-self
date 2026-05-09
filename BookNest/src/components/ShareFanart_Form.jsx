import { useState } from 'react';
import '../styles/FanartForm.css';

const FanartUploadForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    inspiration: '',
    description: '',
    isOriginal: false,
    file: null
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData({ ...formData, file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
  };

  return (
    <div className="fanart-upload-form">
      <h2 className="form-title">Share Your Fanart</h2>
      
      <div className="guidelines-box">
        <p>
          Please make sure your artwork follows our community guidelines.<br />
          Accepted formats: JPG, PNG, GIF. Maximum file size: 10MB.
        </p>
      </div>
      
      <div 
        className="upload-area" 
        onDrop={handleDrop} 
        onDragOver={handleDragOver}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="image-preview" />
        ) : (
          <>
            <div className="upload-icon">+</div>
            <p className="upload-text">
              Drag and drop your artwork here<br />
              or click to browse files
            </p>
          </>
        )}
        <input 
          type="file" 
          accept="image/*" 
          className="file-input" 
          onChange={handleFileChange} 
        />
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">
            Artwork title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="inspiration">Book/Character Inspiration</label>
          <input
            type="text"
            id="inspiration"
            name="inspiration"
            value={formData.inspiration}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        
        <div className="checkbox-group">
          <input
            type="checkbox"
            name="isOriginal"
            checked={formData.isOriginal}
            onChange={handleChange}
          />
          <label style={{ fontSize: '17px' }}>
            I confirm this is my original fanart and I have the right to share it
          </label>
        </div>
        
        <div className="button-group">
          <button type="submit" className="submit-button">Submit</button>
          <button type="button" className="cancel-button">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default FanartUploadForm;