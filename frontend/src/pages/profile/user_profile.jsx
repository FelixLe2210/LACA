// src/pages/Profile/UserProfile.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './user_profile.css';

const UserProfile = () => {
    // --- STATE QUẢN LÝ DỮ LIỆU ---
    const [posts, setPosts] = useState([
        // Bài 1: Ảnh
        {
            id: 999,
            type: 'image',
            image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600',
            caption: "I'm always happy by your side.",
            date: '20/10/2023'
        },
        // Bài 2: Video mẫu (Link MP4 online)
        {
            id: 998,
            type: 'video',
            image: 'https://cdn.pixabay.com/video/2023/10/22/186115-877653483_tiny.mp4', 
            caption: "Chill vibes only 🎵",
            date: '19/10/2023'
        },
        // Bài 3: Ảnh
        {
            id: 997,
            type: 'image',
            image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600',
            caption: "Morning coffee ☕",
            date: '18/10/2023'
        }
    ]);

    // Load bài đăng từ LocalStorage
    useEffect(() => {
        const savedPosts = JSON.parse(localStorage.getItem('user_posts'));
        if (savedPosts && savedPosts.length > 0) {
            setPosts(prevDefaultPosts => {
                // Gộp bài từ máy (savedPosts) lên đầu
                // Lưu ý: Bài từ localStorage bây giờ đã có trường 'type': 'video' hoặc 'image'
                const newPosts = [...savedPosts, ...prevDefaultPosts];
                
                // Xóa trùng lặp (nếu cần)
                const uniquePosts = newPosts.filter((post, index, self) =>
                    index === self.findIndex((p) => p.id === post.id)
                );
                return uniquePosts;
            });
        }
    }, []);

    const [isEditing, setIsEditing] = useState(false);
    const nameRef = useRef(null);
    const bioRef = useRef(null);

    // State Menu 3 chấm
    const [activeMenuId, setActiveMenuId] = useState(null);

    // State Modal Xóa
    const [showModal, setShowModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    // --- CÁC HÀM LOGIC ---

    const togglePostMenu = (e, postId) => {
        e.stopPropagation();
        if (activeMenuId === postId) {
            setActiveMenuId(null);
        } else {
            setActiveMenuId(postId);
        }
    };

    useEffect(() => {
        const handleClickOutside = () => {
            setActiveMenuId(null);
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const handleEditToggle = () => {
        if (!isEditing) {
            setIsEditing(true);
            setTimeout(() => nameRef.current.focus(), 0);
        } else {
            setIsEditing(false);
        }
    };

    const handleDeleteClick = (postId) => {
        setActiveMenuId(null);
        setPostToDelete(postId);
        setShowModal(true);
    };

    const closeDeleteModal = () => {
        setShowModal(false);
        setPostToDelete(null);
    };

    const confirmDelete = () => {
        if (postToDelete !== null) {
            const newPosts = posts.filter(post => post.id !== postToDelete);
            setPosts(newPosts);

            const currentStorage = JSON.parse(localStorage.getItem('user_posts')) || [];
            const updatedStorage = currentStorage.filter(p => p.id !== postToDelete);
            localStorage.setItem('user_posts', JSON.stringify(updatedStorage));
        }
        closeDeleteModal();
    };

    return (
        <div className="mobile-wrapper">
            <header className="top-nav">
                <Link to="/" className="back-btn">
                    <i className="fa-solid fa-arrow-left"></i>
                </Link>
            </header>

            <main className="profile-container">
                <div className="user-details-section">
                    <div className="avatar-large"></div>
                    <div className="user-text-info">
                        <h2 
                            ref={nameRef}
                            className={`user-name ${isEditing ? 'editable' : ''}`}
                            contentEditable={isEditing}
                            suppressContentEditableWarning={true}
                        >
                            User A
                        </h2>
                        <p className="user-id">ID: xxxxx</p>
                        <p 
                            ref={bioRef}
                            className={`user-bio ${isEditing ? 'editable' : ''}`}
                            contentEditable={isEditing}
                            suppressContentEditableWarning={true}
                        >
                            1m79 | Gymer VN
                        </p>
                    </div>
                </div>

                <div className="stats-action-section">
                    <div className="stats-group">
                        <span className="stat-item"><strong>{posts.length}</strong> Posts</span>
                        <span className="stat-item"><strong>0</strong> Followers</span>
                    </div>
                    <button className="edit-profile-btn" onClick={handleEditToggle}>
                        {isEditing ? 'DONE' : 'EDIT'}
                    </button>
                </div>

                <div className="section-label">POSTS</div>

                <div className="post-list" id="postList">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <article className="mini-post" key={post.id}>
                                <div className="mini-post-header">
                                    <div className="mini-user">
                                        <div className="mini-avatar"></div>
                                        <span className="mini-username">
                                            {post.date ? post.date.split(',')[0] : 'User A'}
                                        </span>
                                    </div>

                                    {/* Menu 3 chấm */}
                                    <div className="mini-post-actions">
                                        <button 
                                            className="post-options-btn" 
                                            onClick={(e) => togglePostMenu(e, post.id)}
                                        >
                                            <i className="fa-solid fa-ellipsis"></i>
                                        </button>

                                        <div className={`post-options-menu ${activeMenuId === post.id ? 'show' : ''}`}>
                                            <div className="option-item" onClick={() => alert("Tính năng sửa đang phát triển!")}>
                                                <i className="fa-solid fa-pen"></i> Edit
                                            </div>
                                            <div className="option-item danger" onClick={() => handleDeleteClick(post.id)}>
                                                <i className="fa-solid fa-trash"></i> Delete
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* [QUAN TRỌNG] LOGIC HIỂN THỊ VIDEO HOẶC ẢNH */}
                                <div className="post-image-wrapper">
                                    {post.type === 'video' ? (
                                        <video 
                                            src={post.image} // Lưu ý: key 'image' chứa url video
                                            muted 
                                            loop 
                                            autoPlay 
                                            playsInline
                                            // Click vào video để bật/tắt tiếng nếu muốn (nâng cao)
                                            onClick={(e) => e.target.muted = !e.target.muted}
                                        ></video>
                                    ) : (
                                        <img src={post.image} alt="Post" />
                                    )}
                                    
                                    <div className="overlay-caption">
                                        {post.caption}
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
                            NO POST YET
                        </div>
                    )}
                </div>
            </main>

            <div className={`modal-overlay ${showModal ? 'show' : ''}`}>
                <div className="modal-content">
                    <p className="modal-text">ARE YOU SURE YOU WANT TO DELETE?</p>
                    <div className="modal-actions">
                        <button className="btn-modal btn-no" onClick={closeDeleteModal}>NO</button>
                        <button className="btn-modal btn-yes" onClick={confirmDelete}>YES</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;