import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL ? (import.meta.env.VITE_BACKEND_URL.endsWith('/') ? import.meta.env.VITE_BACKEND_URL : import.meta.env.VITE_BACKEND_URL + '/') : "http://localhost:8000/";

// Generic fetch function with authentication
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = Cookies.get('token');
  
  if (!token) {
    throw new Error("Authentication token is missing");
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(options.headers || {})
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`API Request Failed: ${endpoint}`, error);
    throw error;
  }
};

// Profile related API functions
export const ProfileAPI = {
  // Get complete profile data - FIXED URL structure
  getFullProfile: async (userId) => {
    return fetchWithAuth(`base/user/profile/${userId}/`);
  },

  // Get user's basic profile information
  getUserProfile: async () => {
    return fetchWithAuth('base/get-profile/');
  },

  // Get user's friends
  getFriends: async () => {
    return fetchWithAuth('base/user/get-friends/');
  },
  
  // Update user profile
  updateProfile: async (profileData) => {
    return fetchWithAuth('base/update-profile/', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });
  },

  // Get user's book lists
  getBookLists: async () => {
    return fetchWithAuth('base/booklists');
  },

  // Get user's posts
  getPosts: async (userId) => {
    return fetchWithAuth(`base/posts?user_id=${userId}`);
  },

  // Get user's fanarts
  getFanarts: async (userId) => {
    return fetchWithAuth(`base/fanarts?user_id=${userId}`);
  },
  
  // Get reviews for a user
  getReviews: async (userId) => {
    return fetchWithAuth(`base/user/${userId}/reviews`);
  }
};

// Book related API functions
export const BookAPI = {
  // Get book details
  getBookDetails: async (bookId) => {
    return fetchWithAuth(`base/books/${bookId}/`);
  },
  
  // Search for books
  searchBooks: async (query) => {
    return fetchWithAuth(`base/books/search/?q=${encodeURIComponent(query)}`);
  }
};

// Social related API functions
export const SocialAPI = {
  // Add a friend
  addFriend: async (userId) => {
    return fetchWithAuth(`base/user/add-friend/`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId })
    });
  },
  
  // Remove a friend
  removeFriend: async (userId) => {
    return fetchWithAuth(`base/user/remove-friend/`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId })
    });
  }
};

// Export all API modules
export default {
  ProfileAPI,
  BookAPI,
  SocialAPI
};