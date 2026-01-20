// src/pages/Home/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './home.css'; 

const Home = () => {

  // --- 1. DỮ LIỆU BÀI ĐĂNG (STATE) ---
  const [feedPosts, setFeedPosts] = useState([]);

  // Dữ liệu bài mẫu (Fake data) - Thêm field 'type'
  const defaultPosts = [
    {
        id: 'post1',
        userId: 'user_a', // [MỚI] ID riêng của User
        username: 'User A',
        avatarColor: '#ccc',
        type: 'image',
        image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600',
        caption: "I'm always happy by your side.",
        likes: 90
    },
    {
        id: 'post2',
        userId: 'hong_hanh', // [MỚI]
        username: 'Hồng Hạnh',
        avatarColor: '#ff7675',
        type: 'image',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600',
        caption: "Ngày mới tốt lành nha mọi người!",
        likes: 100
    },
    {
        id: 'post3',
        userId: 'tuan_anh', // [MỚI]
        username: 'Tuấn Anh',
        avatarColor: '#74b9ff',
        type: 'video',
        image: 'https://cdn.pixabay.com/video/2024/03/31/206294_tiny.mp4',
        caption: "Chill with sea vibes 🌊",
        likes: 5
    }
  ];

  // Load bài đăng từ LocalStorage và trộn với bài mẫu
  useEffect(() => {
    const myPosts = JSON.parse(localStorage.getItem('user_posts')) || [];
    
    // Chuẩn hóa dữ liệu của mình
    const formattedMyPosts = myPosts.map(post => ({
        id: post.id,
        username: 'Me', 
        avatarColor: '#000', 
        // Lấy đúng loại media (video hoặc image), nếu không có thì mặc định là image
        type: post.type || 'image', 
        image: post.image,
        caption: post.caption,
        likes: 0, 
        isMine: true 
    }));

    // Đưa bài của mình lên đầu, sau đó đến bài bạn bè
    setFeedPosts([...formattedMyPosts, ...defaultPosts]);
  }, []);


  // --- 2. CÁC HÀM XỬ LÝ SỰ KIỆN ---

  const toggleReportMenu = (e) => {
    e.stopPropagation(); 
    const btn = e.currentTarget;
    const dropdown = btn.nextElementSibling;
    document.querySelectorAll('.report-dropdown.show').forEach(d => {
        if(d !== dropdown) d.classList.remove('show');
    });
    dropdown.classList.toggle('show');
  };

  const handleAction = (action) => {
    if (action === 'block') alert("Đã chặn người dùng này!"); 
    else if (action === 'report') alert("Đã báo cáo bài viết!"); 
    document.querySelectorAll('.report-dropdown.show').forEach(d => d.classList.remove('show'));
  };

  const handleLike = (e, post) => {
    const btn = e.currentTarget;
    const iconHeart = btn.querySelector('i');
    const likeCountDiv = btn.nextElementSibling; 
    
    const isLiked = iconHeart.classList.contains('fa-solid');

    if (!isLiked) {
        // UI Like
        iconHeart.classList.remove('fa-regular');
        iconHeart.classList.add('fa-solid');
        iconHeart.style.color = '#e0245e';
        let currentCount = parseLikeCount(likeCountDiv.innerText);
        likeCountDiv.innerText = formatLikeCount(currentCount + 1);

        // Gửi thông báo (Notification Logic)
        const newNotif = {
            id: Date.now(),
            user: 'user A', 
            text: 'sent a reaction to your post!',
            postImage: post.image, 
            time: new Date().toISOString()
        };
        const currentNotifs = JSON.parse(localStorage.getItem('user_notifications')) || [];
        currentNotifs.push(newNotif);
        localStorage.setItem('user_notifications', JSON.stringify(currentNotifs));

    } else {
        // UI Unlike
        iconHeart.classList.remove('fa-solid');
        iconHeart.classList.add('fa-regular');
        iconHeart.style.color = ''; 
        let currentCount = parseLikeCount(likeCountDiv.innerText);
        if(currentCount > 0) likeCountDiv.innerText = formatLikeCount(currentCount - 1);
    }
  };

  const parseLikeCount = (str) => {
    if(typeof str === 'string' && str.includes('k')) return parseFloat(str) * 1000;
    return parseInt(str) || 0;
  };
  const formatLikeCount = (num) => {
    if(num >= 1000) return (num / 1000).toFixed(1).replace('.0','') + 'k';
    return num;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (!event.target.closest('.report-wrapper')) {
            document.querySelectorAll('.report-dropdown.show').forEach(d => d.classList.remove('show'));
        }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);


  // --- 3. GIAO DIỆN ---
  return (
    <div className="mobile-wrapper">
        <input type="checkbox" id="menu-toggle" />
        <label htmlFor="menu-toggle" className="overlay"></label>
        
        <nav className="sidebar">
            <div className="sidebar-header">MENU</div>
            <Link to="/profile" className="sidebar-item"><i className="fa-regular fa-user"></i> Profile</Link>
            <Link to="/camera" className="sidebar-item"><i className="fa-solid fa-camera"></i> Camera</Link>
            <Link to="#" className="sidebar-item"><i className="fa-regular fa-comment-dots"></i> Chat</Link>
            <Link to="#" className="sidebar-item"><i className="fa-regular fa-map"></i> Map</Link>
            <Link to="#" className="sidebar-item"><i className="fa-solid fa-gear"></i> Setting</Link>
        </nav>

        <header>
            <label htmlFor="menu-toggle" className="icon-btn"><i className="fa-solid fa-bars"></i></label>
            <div className="header-title">LACA</div>
            <Link to="/notification" className="icon-btn" style={{ textDecoration: 'none' }}>
                <i className="fa-regular fa-bell"></i>
            </Link>
        </header>

        <main>
            {feedPosts.map((post) => (
                <article className="post-card" key={post.id}>
                    <div className="post-header">
                        <Link 
                                to={post.isMine ? "/profile" : `/stranger_profile/${post.userId}`} 
                                className="user-info">
                                <div className="user-avatar" style={{backgroundColor: post.avatarColor}}>
                                    <i className="fa-solid fa-user"></i>
                                </div> 
                                <span className="username">{post.username}</span>
                        </Link> 
                        <div className="report-wrapper">
                            <div className="report-btn" onClick={toggleReportMenu}>
                                <i className="fa-solid fa-circle-exclamation"></i>
                            </div>
                            <div className="report-dropdown">
                                <div className="dropdown-item" onClick={() => handleAction('block')}>
                                    <i className="fa-solid fa-ban"></i> Block User
                                </div>
                                <div className="dropdown-item warning" onClick={() => handleAction('report')}>
                                    <i className="fa-solid fa-flag"></i> Report Post
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="post-image-wrapper">
                        {/* [QUAN TRỌNG] Kiểm tra type để hiển thị Video hoặc Ảnh */}
                        {post.type === 'video' ? (
                            <video 
                                src={post.image} 
                                className="post-image"
                                muted 
                                loop 
                                autoPlay 
                                playsInline
                                onClick={(e) => e.target.muted = !e.target.muted} // Click để bật tiếng
                            ></video>
                        ) : (
                            <img src={post.image} alt="Post" className="post-image" />
                        )}
                        
                        <div className="caption-overlay"><p>{post.caption}</p></div>
                    </div>

                    <div className="post-actions">
                        <button className="left-actions" onClick={(e) => handleLike(e, post)}>
                            <i className="fa-regular fa-heart action-icon"></i>
                        </button>
                        <div className="like-count">{post.likes}</div>
                        <Link to="#" className="right-actions">
                            <i className="fa-regular fa-comment action-icon"></i>
                        </Link>
                    </div>
                </article>
            ))}
        </main>
    </div>
  );
};

export default Home;