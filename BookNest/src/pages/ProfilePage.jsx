import React, { useState, useEffect, useContext, memo } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Profile.css';
import IntroNavbar_1 from '../components/IntroNavbar_1';
import MainNavbar from '../components/MainNavbar';
import Footer from "../components/Footer";
import AuthContext from "../context/AuthContext";
import ProfileEdit from '../components/ProfileEdit';
import defaultAvatar from "../assets/author-img.png";
import defaultBookCover from "../assets/author-img.png";

const ProfilePage = () => {
  const { user, authTokens, api_link } = useContext(AuthContext);
  const { id } = useParams();
  
  const [activeTab, setActiveTab] = useState('Booklist');
  const [profileData, setProfileData] = useState(null);
  const [friends, setFriends] = useState([]);
  const [bookLists, setBookLists] = useState({ reading: [], want_to_read: [], read: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const profileId = id || (user ? user.user_id : null);

  // Main data loading - use Promise.all for parallel requests
  useEffect(() => {
    if (!profileId || !authTokens) return;
    
    const controller = new AbortController();
    const signal = controller.signal;
    
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Prepare all fetch requests
        const profileRequest = fetch(`${api_link}base/get-profile/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`
          },
          signal
        });
        
        const friendsRequest = fetch(`${api_link}base/user/get-friends/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`
          },
          signal
        });
        
        const booklistsRequest = fetch(`${api_link}base/booklists`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`
          },
          signal
        });
        
        // Execute all requests in parallel
        const [profileResponse, friendsResponse, booklistsResponse] = 
          await Promise.all([profileRequest, friendsRequest, booklistsRequest]);
          
        // Handle profile data
        if (!profileResponse.ok) throw new Error(`Error fetching profile: ${profileResponse.status}`);
        const profileJson = await profileResponse.json();
        setProfileData(profileJson);
        
        // Handle friends data
        if (friendsResponse.ok) {
          const friendsJson = await friendsResponse.json();
          setFriends(friendsJson);
        }
        
        // Handle booklists data
        if (booklistsResponse.ok) {
          const booklistsJson = await booklistsResponse.json();
          setBookLists({
            reading: booklistsJson.reading || [],
            want_to_read: booklistsJson.want_to_read || [],
            read: booklistsJson.read || []
          });
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
    
    // Cleanup function to abort fetch if component unmounts
    return () => controller.abort();
  }, [profileId, authTokens, api_link]);

  // Load tab data only when tab changes and not on initial load
  useEffect(() => {
    if (!profileId || !authTokens || loading || activeTab === 'Booklist') return;
    
    const controller = new AbortController();
    const signal = controller.signal;
    
    const fetchTabData = async () => {
      let endpoint;
      switch(activeTab) {
        case 'Posts':
          endpoint = `base/posts?user_id=${profileId}`;
          break;
        case 'Fanarts':
          endpoint = `base/fanarts?user_id=${profileId}`;
          break;
        case 'Reviews':
          endpoint = `base/user/${profileId}/reviews`;
          break;
        default:
          return;
      }

      try {
        const response = await fetch(`${api_link}${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`
          },
          signal
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(prev => ({...prev, [activeTab.toLowerCase()]: data}));
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          // Silent fail for tab data
        }
      }
    };

    fetchTabData();
    
    return () => controller.abort();
  }, [activeTab, profileId, authTokens, api_link, loading]);

  // Memoized render components to improve performance
  const TabContent = memo(() => {
    if (activeTab === 'Posts') {
      return (
        <section className="tab-content">
          {profileData?.posts && profileData.posts.length > 0 ? (
            <div className="posts-grid">
              {profileData.posts.map(post => (
                <div key={post.id} className="post-card">
                  <h4>{post.title}</h4>
                  <p>{post.content && post.content.substring(0, 100)}...</p>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="placeholder-text">No posts to display.</p>
          )}
        </section>
      );
    } else if (activeTab === 'Fanarts') {
      return (
        <section className="tab-content">
          {profileData?.fanarts && profileData.fanarts.length > 0 ? (
            <div className="fanarts-grid">
              {profileData.fanarts.map(fanart => (
                <div key={fanart.id} className="fanart-card">
                  {fanart.image_url && <img src={fanart.image_url} alt="Fanart" />}
                  <h4>{fanart.title || "Untitled"}</h4>
                </div>
              ))}
            </div>
          ) : (
            <p className="placeholder-text">No fanarts to display.</p>
          )}
        </section>
      );
    } else if (activeTab === 'Reviews') {
      return (
        <section className="tab-content">
          {profileData?.reviews && profileData.reviews.length > 0 ? (
            <div className="reviews-grid">
              {profileData.reviews.map(review => (
                <div key={review.id} className="review-card">
                  <h4>{review.book_title || "Unknown Book"}</h4>
                  <div className="review-rating">Rating: {review.rating || "N/A"}/5</div>
                  <p>{review.content && review.content.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="placeholder-text">No reviews to display.</p>
          )}
        </section>
      );
    } else {
      return (
        <section className="booklist-content">
          <div className="book-category">
            <h3 className="category-title">Reading</h3>
            <div className="books-showcase">
              {bookLists.reading.length > 0 ? bookLists.reading.map(book => (
                <div key={book.id} className="book-card">
                  <div className="book-image">
                    <img src={book.cover_image || defaultBookCover} alt="Book" />
                    <div className="book-rating">{book.rating || "N/A"}</div>
                  </div>
                </div>
              )) : (
                <p className="no-books-message">No books in this category.</p>
              )}
            </div>
          </div>

          <div className="book-category">
            <h3 className="category-title">Want to Read</h3>
            <div className="books-showcase">
              {bookLists.want_to_read.length > 0 ? bookLists.want_to_read.map(book => (
                <div key={book.id} className="book-card">
                  <div className="book-image">
                    <img src={book.cover_image || defaultBookCover} alt="Book" />
                    <div className="book-rating">{book.rating || "N/A"}</div>
                  </div>
                </div>
              )) : (
                <p className="no-books-message">No books in this category.</p>
              )}
            </div>
          </div>

          <div className="book-category">
            <h3 className="category-title">Read</h3>
            <div className="books-showcase">
              {bookLists.read.length > 0 ? bookLists.read.map(book => (
                <div key={book.id} className="book-card">
                  <div className="book-image">
                    <img src={book.cover_image || defaultBookCover} alt="Book" />
                    <div className="book-rating">{book.rating || "N/A"}</div>
                  </div>
                </div>
              )) : (
                <p className="no-books-message">No books in this category.</p>
              )}
            </div>
          </div>
        </section>
      );
    }
  });

  return (
    <div className="profile-wrapper">
      <MainNavbar/>
      <main className="profile-main">
        {error && (
          <div className="error-alert">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}
        
        {loading ? (
          <div className="loading-container">
            <p>Loading profile data...</p>
          </div>
        ) : (
          <>
            <section className="profile-top-section">
              <div className="profile-avatar-container">
                <img 
                  src={profileData?.profile_image || defaultAvatar} 
                  alt="Profile" 
                  className="top-profile-avatar" 
                  loading="lazy"
                />
              </div>
              
              <div className="stats-bar">
                <div className="stat-item">
                  <span className="stat-number">{profileData?.friends_count || 0}</span>
                  <span className="stat-label">Friends</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{profileData?.posts_count || 0}</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{profileData?.fanarts_count || 0}</span>
                  <span className="stat-label">Fanarts</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{profileData?.reviews_count || 0}</span>
                  <span className="stat-label">Reviews</span>
                </div>
              </div>
            </section>

            <section className="profile-info-card">
              <div className="profile-details-container">
                <h1 className="profile-name">{profileData?.name || profileData?.username || "User"}</h1>
                <div className="reader-level">
                  <span>Level {profileData?.reader_level || 1} Reader</span>
                  <span className="star-icon">⭐</span>
                </div>
                <div className="level-progress">
                  <div className="progress-track">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${profileData?.level_progress || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="user-stats">
                  <p>Points: {profileData?.points || 0}</p>
                  <p>Avg Rating: {profileData?.average_rating || "N/A"}</p>
                </div>
              </div>

              <div className="profile-right-section">
                <p className="user-bio">{profileData?.bio || "This user hasn't added a bio yet."}</p>
                {user && user.user_id === parseInt(profileId) && (
                  <button className="edit-btn" onClick={() => setShowEditProfile(true)}>Edit</button>
                )}
              </div>
            </section>

            <section className="friends-container">
              <div className="friends-heading"><h2>Your Friends</h2></div>
              <div className="friends-grid">
                {friends && friends.length > 0 ? friends.slice(0, 6).map(friend => (
                  <div key={friend.id} className="friend-card">
                    <img 
                      src={friend.profile_image || defaultAvatar} 
                      alt="Friend" 
                      className="friend-avatar" 
                      loading="lazy"
                    />
                    <p className="friend-name">{friend.name || friend.username}</p>
                    <p className="friend-followers">{friend.followers_count || 0} Followers</p>
                  </div>
                )) : (
                  <p className="no-data-message">No friends to display.</p>
                )}
              </div>
              {friends && friends.length > 6 && (
                <div className="view-all-link"><button>View all</button></div>
              )}
            </section>

            <section className="content-tabs">
              <button 
                className={activeTab === 'Posts' ? 'active' : ''}
                onClick={() => setActiveTab('Posts')}
              >Posts</button>
              <button 
                className={activeTab === 'Fanarts' ? 'active' : ''}
                onClick={() => setActiveTab('Fanarts')}
              >Fanarts</button>
              <button 
                className={activeTab === 'Reviews' ? 'active' : ''}
                onClick={() => setActiveTab('Reviews')}
              >Reviews</button>
              <button 
                className={activeTab === 'Booklist' ? 'active' : ''}
                onClick={() => setActiveTab('Booklist')}
              >Booklist</button>
            </section>

            <TabContent />
          </>
        )}
      </main>
      
      <Footer />
      
      {showEditProfile && (
        <ProfileEdit 
          onClose={() => setShowEditProfile(false)} 
          profileData={profileData}
        />
      )}
    </div>
  );
};

export default ProfilePage;