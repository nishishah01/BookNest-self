import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavbar from '../components/MainNavbar';
import Footer from "../components/Footer";
import '../styles/SellForm.css';

const SellForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        image: null,
        title: '',
        author: '',
        condition: 'excellent',
        price: '',
        contactNumber: '',
        description: '',
        location: '',
        meetupPreference: 'flexible'
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const totalSteps = 3;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear validation error when field is edited
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setFormErrors(prev => ({
                    ...prev,
                    image: 'Image size should be less than 5MB'
                }));
                return;
            }

            setFormData(prev => ({
                ...prev,
                image: file
            }));
            
            setFormErrors(prev => ({
                ...prev,
                image: ''
            }));

            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateCurrentStep = () => {
        const errors = {};
        
        if (currentStep === 1) {
            if (!formData.title.trim()) errors.title = 'Book title is required';
            if (!formData.author.trim()) errors.author = 'Author name is required';
            if (!formData.price.trim()) errors.price = 'Price is required';
            if (parseFloat(formData.price) <= 0) errors.price = 'Price must be greater than 0';
        }
        
        if (currentStep === 2) {
            if (!formData.condition.trim()) errors.condition = 'Book condition is required';
            if (!formData.description.trim()) errors.description = 'Description is required';
            if (formData.description.trim().length < 20) errors.description = 'Description should be at least 20 characters';
        }
        
        if (currentStep === 3) {
            if (!formData.contactNumber.trim()) errors.contactNumber = 'Contact number is required';
            if (!formData.location.trim()) errors.location = 'Location is required';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNextStep = () => {
        if (validateCurrentStep()) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateCurrentStep()) return;
        
        setLoading(true);
        
        try {
            // Here you would normally send the data to your backend
            console.log('Book selling form submitted:', formData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setFormSubmitted(true);
            
            // Navigate back after showing success message
            setTimeout(() => {
                navigate('/rent-buy');
            }, 2000);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit the form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? Your data will not be saved.')) {
            navigate('/rent-buy');
        }
    };

    const renderFormStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <h3 className="step-title">Book Details</h3>
                        
                        {/* Image Upload */}
                        <div className="form-group">
                            <label htmlFor="image">Book Image</label>
                            <div 
                                className="image-upload-area"
                                onClick={() => document.getElementById('image').click()}
                            >
                                {!imagePreview ? (
                                    <div className="upload-placeholder">
                                        <div className="upload-icon">📸</div>
                                        <p className="upload-text">Click to upload a cover image</p>
                                        <p className="upload-hint">JPG, PNG or GIF (max 5MB)</p>
                                    </div>
                                ) : (
                                    <img
                                        src={imagePreview}
                                        alt="Book preview"
                                        className="image-preview-thumbnail"
                                    />
                                )}
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden-file-input"
                                />
                            </div>
                            {formErrors.image && <div className="error-message">{formErrors.image}</div>}
                        </div>

                        {/* Title */}
                        <div className="form-group">
                            <label htmlFor="title">Book Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className={formErrors.title ? "form-input error" : "form-input"}
                                placeholder="Enter book title"
                                maxLength="200"
                            />
                            {formErrors.title && <div className="error-message">{formErrors.title}</div>}
                        </div>

                        {/* Author */}
                        <div className="form-group">
                            <label htmlFor="author">Author *</label>
                            <input
                                type="text"
                                id="author"
                                name="author"
                                value={formData.author}
                                onChange={handleInputChange}
                                className={formErrors.author ? "form-input error" : "form-input"}
                                placeholder="Enter author name"
                            />
                            {formErrors.author && <div className="error-message">{formErrors.author}</div>}
                        </div>

                        {/* Price */}
                        <div className="form-group">
                            <label htmlFor="price">Selling Price *</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className={formErrors.price ? "form-input error" : "form-input"}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                            {formErrors.price && <div className="error-message">{formErrors.price}</div>}
                            <small className="form-hint">Set a competitive price to increase your chances of selling</small>
                        </div>
                    </>
                );
            
            case 2:
                return (
                    <>
                        <h3 className="step-title">Book Condition & Description</h3>
                        
                        {/* Book Condition */}
                        <div className="form-group">
                            <label htmlFor="condition">Book Condition *</label>
                            <select
                                id="condition"
                                name="condition"
                                value={formData.condition}
                                onChange={handleInputChange}
                                className={formErrors.condition ? "form-select error" : "form-select"}
                            >
                                <option value="excellent">Excellent - Like New</option>
                                <option value="good">Good - Minor Wear</option>
                                <option value="fair">Fair - Noticeable Wear</option>
                                <option value="worn">Worn - Heavily Used</option>
                            </select>
                            {formErrors.condition && <div className="error-message">{formErrors.condition}</div>}
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label htmlFor="description">Book Description *</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className={formErrors.description ? "form-textarea error" : "form-textarea"}
                                placeholder="Describe the book in detail, including edition, publisher, special features, and any minor defects"
                                maxLength="500"
                            />
                            <div className="char-counter-container">
                                {formErrors.description ? (
                                    <div className="error-message">{formErrors.description}</div>
                                ) : (
                                    <small className="form-hint">Min. 20 characters</small>
                                )}
                                <small className={formData.description.length < 20 ? "char-count error" : "char-count"}>
                                    {formData.description.length}/500
                                </small>
                            </div>
                        </div>
                    </>
                );
            
            case 3:
                return (
                    <>
                        <h3 className="step-title">Contact & Location Details</h3>

                        {/* Contact Number */}
                        <div className="form-group">
                            <label htmlFor="contactNumber">Contact Number *</label>
                            <input
                                type="tel"
                                id="contactNumber"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                className={formErrors.contactNumber ? "form-input error" : "form-input"}
                                placeholder="Enter your contact number"
                            />
                            {formErrors.contactNumber && <div className="error-message">{formErrors.contactNumber}</div>}
                        </div>

                        {/* Location */}
                        <div className="form-group">
                            <label htmlFor="location">Your Location *</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className={formErrors.location ? "form-input error" : "form-input"}
                                placeholder="City, Area, or Campus"
                            />
                            {formErrors.location && <div className="error-message">{formErrors.location}</div>}
                        </div>

                        {/* Meetup Preference */}
                        <div className="form-group">
                            <label htmlFor="meetupPreference">Meetup Preference</label>
                            <select
                                id="meetupPreference"
                                name="meetupPreference"
                                value={formData.meetupPreference}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option value="flexible">Flexible</option>
                                <option value="in-person">In-person Only</option>
                                <option value="shipping">Shipping Only</option>
                                <option value="campus">Campus Meetup</option>
                            </select>
                        </div>

                        <div className="info-box">
                            <p><strong>Note:</strong> By listing your book, you agree to communicate safely with buyers
                                and meet in public places for transactions.</p>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <MainNavbar />
            <div className="sell-form-page">
                <div className="sell-form-container">
                    <h2 className="sell-form-title">Sell Your Book</h2>

                    <div className="progress-bar-container">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            ></div>
                        </div>
                        <div className="step-indicators">
                            <div className="step-indicator">
                                <div className={`step-dot ${currentStep >= 1 ? 'active' : ''}`}>1</div>
                                <div className={`step-label ${currentStep >= 1 ? 'active' : ''}`}>Book Details</div>
                            </div>
                            <div className="step-indicator">
                                <div className={`step-dot ${currentStep >= 2 ? 'active' : ''}`}>2</div>
                                <div className={`step-label ${currentStep >= 2 ? 'active' : ''}`}>Condition</div>
                            </div>
                            <div className="step-indicator">
                                <div className={`step-dot ${currentStep >= 3 ? 'active' : ''}`}>3</div>
                                <div className={`step-label ${currentStep >= 3 ? 'active' : ''}`}>Contact</div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {renderFormStep()}
                        
                        <div className="form-actions">
                            {currentStep > 1 ? (
                                <button
                                    type="button"
                                    onClick={handlePrevStep}
                                    className="button secondary-button"
                                >
                                    Back
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="button secondary-button"
                                >
                                    Cancel
                                </button>
                            )}
                            
                            {currentStep < totalSteps ? (
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="button primary-button"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`button primary-button ${loading ? 'loading' : ''}`}
                                >
                                    {loading ? 'Submitting...' : 'List Book for Sale'}
                                </button>
                            )}
                        </div>
                    </form>

                    {formSubmitted && (
                        <div className="success-overlay">
                            <div className="success-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <h3 className="success-title">Success!</h3>
                            <p className="success-message">
                                Your book has been listed for sale.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default SellForm;