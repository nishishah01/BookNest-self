import { useState } from 'react';
import MainNavbar from '../components/MainNavbar';
import bgimg from "../assets/intro-bg-1.svg";
import '../styles/RentForm.css'

const RentForm = () => {
    const [formData, setFormData] = useState({
        image: null,
        title: '',
        username: '',
        rating: '',
        contactNumber: '',
        status: 'available',
        condition: '',
        price: '',
        deposit: ''
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));

            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Book rental form submitted successfully!');
    };

    const containerStyle = {
        width: '55%',
        margin: '20px auto',
        padding: '30px',
        backgroundImage: `url('${bgimg}')`,
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
        minWidth: '300px'
    };

    const titleStyle = {
        textAlign: 'center',
        color: '#7B3306',
        marginBottom: '30px',
        fontSize: '28px',
        fontWeight: 'bold'
    };

    const formGroupStyle = {
        marginBottom: '20px'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#7B3306',
        fontSize: '14px'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        border: '2px solid #EE9E88',
        borderRadius: '8px',
        fontSize: '16px',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s ease',
        outline: 'none',
        color: 'black !important'
    };

    const inputFocusStyle = {
        borderColor: '#FF6467'
    };

    const selectStyle = {
        ...inputStyle,
        backgroundColor: '#ffffff',
        color: 'black'
    };

    const textareaStyle = {
        ...inputStyle,
        minHeight: '80px',
        resize: 'vertical'
    };

    const imageUploadStyle = {
        ...inputStyle,
        padding: '8px',
        cursor: 'pointer'
    };

    const imagePreviewStyle = {
        marginTop: '10px',
        maxWidth: '200px',
        maxHeight: '200px',
        borderRadius: '8px',
        border: '2px solid #EE9E88'
    };

    const buttonStyle = {
        width: '100%',
        padding: '15px',
        backgroundColor: '#FF6467',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        marginTop: '20px'
    };

    const buttonHoverStyle = {
        backgroundColor: '#EE9E88'
    };

    const rowStyle = {
        display: 'flex',
        gap: '15px'
    };

    const halfWidthStyle = {
        flex: '1'
    };

    return (
        <div>
            <MainNavbar />
            <div style={{ backgroundColor: 'rgb(255, 255, 255)', minHeight: '100vh', padding: '20px 0' }}>
                <div style={containerStyle}>
                    <h2 style={titleStyle}>Book Rental Form</h2>

                    <div onSubmit={handleSubmit}>
                        {/* Image Upload */}
                        <div style={formGroupStyle}>
                            <label htmlFor="image" style={labelStyle}>Book Image</label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={imageUploadStyle}
                            />
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Book preview"
                                    style={imagePreviewStyle}
                                />
                            )}
                        </div>

                        {/* Title */}
                        <div style={formGroupStyle}>
                            <label htmlFor="title" style={labelStyle}>Book Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                style={inputStyle}
                                required
                                placeholder="Enter book title"
                            />
                        </div>

                        {/* Username */}
                        <div style={formGroupStyle}>
                            <label htmlFor="username" style={labelStyle}>Username *</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                style={inputStyle}
                                required
                                placeholder="Enter your username"
                            />
                        </div>

                        {/* Rating and Contact Number Row */}
                        <div style={rowStyle}>
                            <div style={halfWidthStyle}>
                                <div style={formGroupStyle}>
                                    <label htmlFor="rating" style={labelStyle}>Your Rating (1-5)</label>
                                    <select
                                        id="rating"
                                        name="rating"
                                        value={formData.rating}
                                        onChange={handleInputChange}
                                        style={selectStyle}
                                    >
                                        <option value="">Select rating</option>
                                        <option value="1">⭐ 1 Star</option>
                                        <option value="2">⭐⭐ 2 Stars</option>
                                        <option value="3">⭐⭐⭐ 3 Stars</option>
                                        <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                                        <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                                    </select>
                                </div>
                            </div>

                            <div style={halfWidthStyle}>
                                <div style={formGroupStyle}>
                                    <label htmlFor="contactNumber" style={labelStyle}>Contact Number *</label>
                                    <input
                                        type="tel"
                                        id="contactNumber"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleInputChange}
                                        style={inputStyle}
                                        required
                                        placeholder="Enter phone number"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div style={formGroupStyle}>
                            <label htmlFor="status" style={labelStyle}>Rental Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                style={selectStyle}
                            >
                                <option value="available">✅ Available for Rent</option>
                                <option value="rented">🔒 Currently Rented</option>
                            </select>
                        </div>

                        {/* Book Condition */}
                        <div style={formGroupStyle}>
                            <label htmlFor="condition" style={labelStyle}>Book Condition *</label>
                            <textarea
                                id="condition"
                                name="condition"
                                value={formData.condition}
                                onChange={handleInputChange}
                                style={textareaStyle}
                                required
                                placeholder="Describe the condition of the book (e.g., excellent, good, fair, wear and tear details)"
                            />
                        </div>

                        {/* Price and Deposit Row */}
                        <div style={rowStyle}>
                            <div style={halfWidthStyle}>
                                <div style={formGroupStyle}>
                                    <label htmlFor="price" style={labelStyle}>Rental Price *</label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        style={inputStyle}
                                        required
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div style={halfWidthStyle}>
                                <div style={formGroupStyle}>
                                    <label htmlFor="deposit" style={labelStyle}>Security Deposit *</label>
                                    <input
                                        type="number"
                                        id="deposit"
                                        name="deposit"
                                        value={formData.deposit}
                                        onChange={handleInputChange}
                                        style={inputStyle}
                                        required
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            style={buttonStyle}
                            onMouseEnter={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
                            onMouseLeave={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                        >
                            Submit Book for Rental
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RentForm;