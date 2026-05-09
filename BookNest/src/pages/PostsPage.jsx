import Cookies from "js-cookie";
import { Heart, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { posts } from "../apis/posts.api";
import poster_1 from "../book_posters/poster_1.png";
import MainNavbar from '../components/MainNavbar';
import "../styles/PostPage.css";


// Sample data for posts
const initialPosts = [
    {
        id: 1,
        username: "bookworm42",
        date: "April 23, 2025",
        title: "Just finished 'The Midnight Library' - Anyone interested in renting?",
        content: "I absolutely loved this book by Matt Haig! It's about a library between life and death where each book represents a different version of your life. Would rent for $5/month or sell for $15.",
        imageUrl: poster_1,
        likes: 24,
        comments: 7,
        hasImage: true
    },
    {
        id: 2,
        username: "literatefox",
        date: "April 20, 2025",
        title: "Collection of classic literature for sale",
        content: "Clearing out my bookshelves and have about 20 classics in excellent condition. Titles include Pride and Prejudice, Great Expectations, and The Great Gatsby. $5 each or $80 for the lot.",
        likes: 16,
        comments: 12,
        hasImage: false
    },
    {
        id: 3,
        username: "pageturner",
        date: "April 18, 2025",
        title: "Looking for 'Project Hail Mary' by Andy Weir",
        content: "Has anyone read this sci-fi novel? I've heard amazing things and would love to rent or buy a copy. Let me know your price!",
        imageUrl: "/api/placeholder/500/300",
        likes: 8,
        comments: 4,
        hasImage: true
    },
    {
        id: 4,
        username: "bookdragon",
        date: "April 15, 2025",
        title: "Textbook exchange for Computer Science students",
        content: "I have several gently used CS textbooks from my undergraduate program. Topics include algorithms, data structures, and machine learning. Looking to trade or sell at reasonable prices for fellow students.",
        likes: 32,
        comments: 15,
        hasImage: false
    }
];

// Function to transform API data to match component structure
const transformApiData = (apiPosts) => {
    return apiPosts.map(post => ({
        id: post.id,
        username: post.user_name || `user${post.user}`,
        date: post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }) : "Recent",
        title: post.message.length > 50 ? post.message.substring(0, 50) + "..." : post.message,
        content: post.message,
        imageUrl: post.imageUrl || poster_1,
        likes: post.likes || Math.floor(Math.random() * 30) + 1, // Random likes if not provided
        comments: post.comments || Math.floor(Math.random() * 15) + 1, // Random comments if not provided
        hasImage: !!post.imageUrl
    }));
};

export default function PostsPage() {
    const [postsData, setPostsData] = useState(initialPosts);
    const [activeFilter, setActiveFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newPostMessage, setNewPostMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch posts from API
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                
                const token = Cookies.get('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }
                
                const response = await fetch(posts, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Authentication failed. Please log in again.');
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Fetched posts:', data);
                
                // Transform API data to match component structure
                const transformedPosts = transformApiData(data);
                setPostsData(transformedPosts);
                setError(null);
            } catch (err) {
                console.error('Error fetching posts:', err);
                setError(err.message);
                // Keep using initial posts as fallback
                setPostsData(initialPosts);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostMessage.trim()) return;

        try {
            setIsSubmitting(true);
            const token = Cookies.get('token');
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(posts, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: newPostMessage })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const data = await response.json();
            
            // Format the new post immediately for the UI
            const newPost = {
                id: data.data.id || Date.now(),
                username: data.data.user_name || "You",
                date: "Just now",
                title: newPostMessage.length > 50 ? newPostMessage.substring(0, 50) + "..." : newPostMessage,
                content: newPostMessage,
                imageUrl: null,
                likes: 0,
                comments: 0,
                hasImage: false
            };

            setPostsData([newPost, ...postsData]);
            setNewPostMessage("");
            alert("Post created successfully!");
        } catch (err) {
            console.error('Error creating post:', err);
            alert(`Failed to create post: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const likePost = async (postId) => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No authentication token found');
                return;
            }

            // Optimistically update UI
            setPostsData(postsData.map(post =>
                post.id === postId ? { ...post, likes: post.likes + 1 } : post
            ));

            // Note: Like endpoint not available in API - using local update only
            console.log('Like updated locally (no server endpoint available)');
        } catch (err) {
            console.error('Error liking post:', err);
            // Revert optimistic update on error
            setPostsData(prevPosts => prevPosts.map(post =>
                post.id === postId ? { ...post, likes: post.likes - 1 } : post
            ));
        }
    };

    const deletePost = async (postId) => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No authentication token found');
                return;
            }

            // Construct the delete URL properly
            const deleteUrl = `${posts}${postId}/`;
            console.log('Delete URL:', deleteUrl); // Debug log
            console.log('Deleting post with ID:', postId); // Debug log

            const response = await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            console.log('Delete response status:', response.status); // Debug log

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please log in again.');
                }
                if (response.status === 404) {
                    throw new Error('Post not found or already deleted.');
                }
                if (response.status === 403) {
                    throw new Error('You do not have permission to delete this post.');
                }
                const errorText = await response.text();
                console.log('Delete error response:', errorText); // Debug log
                throw new Error(`Failed to delete post: ${response.status} - ${errorText}`);
            }

            // Remove post from local state
            setPostsData(prevPosts => prevPosts.filter(post => post.id !== postId));
            console.log('Post deleted successfully');
        } catch (err) {
            console.error('Error deleting post:', err);
            setError(`Failed to delete post: ${err.message}`);
        }
    };

    const filterPosts = (filter) => {
        setActiveFilter(filter);
    };

    const getFilteredPosts = () => {
        switch (activeFilter) {
            case 'selling':
                return postsData.filter(post => post.content.toLowerCase().includes('sell') || post.content.toLowerCase().includes('sale'));
            case 'renting':
                return postsData.filter(post => post.content.toLowerCase().includes('rent'));
            case 'withImages':
                return postsData.filter(post => post.hasImage);
            default:
                return postsData;
        }
    };

    if (loading) {
        return (
            <div className="posts-page">
                <MainNavbar />
                <main className="main-container">
                    <div className='header'>
                        <h1 style={{ color: '#8b4513', fontSize: '30px', fontFamily: 'Raleway', fontWeight: '600' }}>Posts</h1>
                        <p style={{ color: '#b08068', fontSize: '18px' }}>Loading posts...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="posts-page">

            <MainNavbar />

            <main className="main-container">
                <div className='header'>
                    <h1 style={{ color: '#8b4513', fontSize: '30px', fontFamily: 'Raleway', fontWeight: '600' }}>Posts</h1>
                    <p style={{ color: '#b08068', fontSize: '18px' }}>Explore posts shared by fellow readers!</p>
                    {error && <p style={{ color: '#dc2626', fontSize: '14px' }}>Note: Using offline data due to connection issues</p>}
                </div>

                <div className="create-post-container">
                    <form onSubmit={handleCreatePost} className="create-post-form">
                        <textarea 
                            className="create-post-textarea"
                            value={newPostMessage}
                            onChange={(e) => setNewPostMessage(e.target.value)}
                            placeholder="What's on your mind? Share your thoughts about books..."
                            required
                        />
                        <div className="create-post-actions">
                            <button 
                                className="create-post-btn"
                                type="submit" 
                                disabled={isSubmitting || !newPostMessage.trim()}
                            >
                                {isSubmitting ? 'Posting...' : 'Post'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="space-y-6">
                    {getFilteredPosts().length > 0 ? (
                        getFilteredPosts().map(post => (
                            <div key={post.id} className="post-card">
                                <div className="p-4">
                                    <h2 className="post-title">{post.title}</h2>
                                    <div className="post-meta">
                                        <span>Posted by {post.username}</span>
                                        <span>•</span>
                                        <span>{post.date}</span>
                                    </div>
                                    <p className="post-content">{post.content}</p>
                                    {post.hasImage && (
                                        <div>
                                            <img
                                                src={post.imageUrl}
                                                alt="Post content"
                                                className="post-image"
                                            />
                                        </div>
                                    )}
                                    <div className="post-actions">
                                        <button
                                            onClick={() => likePost(post.id)}
                                            className="like-button"
                                        >
                                            <Heart size={18} />
                                            <span>{post.likes} likes</span>
                                        </button>
                                        <div className="comment-section">
                                            <MessageCircle size={18} />
                                            <span>{post.comments} comments</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: "center", padding: "40px" }}>
                            <p style={{ color: '#b08068', fontSize: '18px' }}>No posts available yet. Be the first to share something!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>

    );
}