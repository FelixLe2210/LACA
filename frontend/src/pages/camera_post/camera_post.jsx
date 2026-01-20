// src/pages/CameraPost/CameraPost.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './camera_post.css';

const CameraPost = () => {
    const navigate = useNavigate();
    
    // State lưu dữ liệu media
    const [mediaSrc, setMediaSrc] = useState(null);
    const [mediaType, setMediaType] = useState('image'); // 'image' hoặc 'video'
    
    const [caption, setCaption] = useState('');
    const [showTimer, setShowTimer] = useState(false);
    const [timerValue, setTimerValue] = useState('unlimited');

    // 1. KHI TRANG LOAD -> LẤY DỮ LIỆU TỪ STORAGE
    useEffect(() => {
        // Kiểm tra xem là Video hay Ảnh
        const type = localStorage.getItem('temp_media_type') || 'image';
        setMediaType(type);

        let src = null;
        if (type === 'video') {
            src = localStorage.getItem('temp_video');
        } else {
            src = localStorage.getItem('temp_photo');
        }

        if (src) {
            setMediaSrc(src);
        } else {
            alert("Không tìm thấy dữ liệu! Vui lòng quay lại Camera.");
            navigate('/camera');
        }
    }, [navigate]);

    // 2. XỬ LÝ DOWNLOAD
    const handleDownload = () => {
        if (mediaSrc) {
            const link = document.createElement('a');
            link.href = mediaSrc;
            // Đặt đuôi file tùy theo loại
            link.download = `laca_${Date.now()}.${mediaType === 'video' ? 'webm' : 'png'}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // 3. XỬ LÝ ĐĂNG BÀI (POST)
    const handlePost = () => {
        const newPost = {
            id: Date.now(),
            type: mediaType, // [QUAN TRỌNG] Lưu loại bài đăng (video/image)
            image: mediaSrc, // Dùng chung key 'image' để chứa link (dù là video hay ảnh)
            caption: caption,
            timer: timerValue,
            date: new Date().toLocaleString()
        };

        const existingPosts = JSON.parse(localStorage.getItem('user_posts')) || [];
        const updatedPosts = [newPost, ...existingPosts];
        localStorage.setItem('user_posts', JSON.stringify(updatedPosts));

        navigate('/profile');
    };

    return (
        <div className="mobile-wrapper" style={{background: '#000'}}>
            
            {/* CONTAINER HIỂN THỊ ẢNH HOẶC VIDEO */}
            <div className="photo-container">
                {mediaSrc && (
                    mediaType === 'video' ? (
                        // Nếu là Video
                        <video 
                            id="preview-video" 
                            src={mediaSrc} 
                            autoPlay 
                            loop 
                            controls={false} // Tắt thanh điều khiển để trông giống Story
                            playsInline
                            muted // Mặc định tắt tiếng để không ồn (User có thể bật sau nếu muốn)
                        ></video>
                    ) : (
                        // Nếu là Ảnh
                        <img id="preview-img" src={mediaSrc} alt="Preview" />
                    )
                )}
            </div>

            {/* HEADER (Giữ nguyên) */}
            <div className="review-header">
                <Link to="/camera" className="btn-icon">
                    <i className="fa-solid fa-xmark"></i>
                </Link>

                <div className="timer-wrapper">
                    <div 
                        className="timer-btn" 
                        onClick={() => setShowTimer(!showTimer)}
                        style={{ color: timerValue === '24h' ? '#2bd0d0' : 'white' }}
                    >
                        <i className="fa-regular fa-clock"></i>
                    </div>

                    <div className={`timer-dropdown ${showTimer ? 'show' : ''}`}>
                        <div 
                            className={`timer-option ${timerValue === 'unlimited' ? 'active' : ''}`}
                            onClick={() => { setTimerValue('unlimited'); setShowTimer(false); }}
                        >
                            <i className="fa-solid fa-infinity"></i> Unlimited
                        </div>
                        <div 
                            className={`timer-option ${timerValue === '24h' ? 'active' : ''}`}
                            onClick={() => { setTimerValue('24h'); setShowTimer(false); }}
                        >
                            <i className="fa-solid fa-hourglass-half"></i> 24 Hours
                        </div>
                    </div>
                </div>
            </div>

            {/* CAPTION INPUT */}
            <div className="caption-wrapper">
                <input 
                    type="text" 
                    className="caption-input" 
                    placeholder={mediaType === 'video' ? "Mô tả video..." : "Viết chú thích..."}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />
            </div>

            {/* FOOTER */}
            <div className="review-footer">
                <button className="btn-icon-footer" onClick={handleDownload}>
                    <i className="fa-solid fa-download"></i>
                </button>

                <button className="send-btn" onClick={handlePost}>
                    <i className="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>
    );
};

export default CameraPost;