// src/pages/camera/camera.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './camera.css';

const Camera = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    
    const [facingMode, setFacingMode] = useState('user');
    
    // --- STATE QUAY VIDEO ---
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]); // Lưu các mảnh video
    const timerRef = useRef(null); // Timer để phân biệt click/hold
    const longPressTriggered = useRef(false); // Check xem đã kích hoạt quay chưa

    // --- 1. KHỞI ĐỘNG CAMERA (Thêm audio: true) ---
    const startCamera = async () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true, // [QUAN TRỌNG] Cần xin quyền Micro để quay video
                video: { 
                    facingMode: facingMode,
                    width: { ideal: 720 },
                    height: { ideal: 1280 }
                }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Lỗi Camera:", err);
            // Nếu lỗi mic hoặc cam, thử fallback chỉ lấy video (đề phòng user chặn mic)
            if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
                 try {
                    const videoOnlyStream = await navigator.mediaDevices.getUserMedia({
                        audio: false, 
                        video: { facingMode: facingMode }
                    });
                    if (videoRef.current) videoRef.current.srcObject = videoOnlyStream;
                 } catch (e) { console.error("Không thể mở cam:", e); }
            }
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, [facingMode]);

    // --- 2. LOGIC QUAY VIDEO ---
    const startRecording = () => {
        const stream = videoRef.current.srcObject;
        if (!stream) return;

        setIsRecording(true);
        longPressTriggered.current = true; // Đánh dấu là đang quay
        chunksRef.current = []; // Reset bộ nhớ đệm

        // Tạo MediaRecorder
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        // Khi có dữ liệu video trả về
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunksRef.current.push(e.data);
            }
        };

        // Khi dừng quay -> Xử lý file
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            
            // Chuyển Blob thành URL hoặc Base64 để xem trước
            // Lưu ý: Video Base64 rất nặng, với demo nhỏ thì dùng FileReader
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result;
                // Lưu vào bộ nhớ với key khác để phân biệt ảnh/video
                localStorage.setItem('temp_media_type', 'video');
                localStorage.setItem('temp_video', base64data);
                
                navigate('/camera-post');
            };
        };

        mediaRecorder.start();
    };

    const stopRecording = () => {
        setIsRecording(false);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    };

    // --- 3. LOGIC CHỤP ẢNH (Giữ nguyên) ---
    const takePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (facingMode === 'user') {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
            }
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imgData = canvas.toDataURL('image/png');
            
            // Lưu type là image
            localStorage.setItem('temp_media_type', 'image');
            localStorage.setItem('temp_photo', imgData);
            navigate('/camera-post'); 
        }
    };

    // --- 4. XỬ LÝ ẤN GIỮ (TOUCH/MOUSE EVENTS) ---
    
    const handlePressStart = (e) => {
        // Ngăn sự kiện mặc định để tránh lỗi trên mobile
        // e.preventDefault(); 
        longPressTriggered.current = false;

        // Đặt hẹn giờ: Nếu giữ quá 500ms thì tính là quay video
        timerRef.current = setTimeout(() => {
            startRecording();
        }, 500); 
    };

    const handlePressEnd = (e) => {
        // Xóa hẹn giờ (nếu thả tay sớm)
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (longPressTriggered.current) {
            // Nếu đã kích hoạt quay video -> Dừng quay
            stopRecording();
        } else {
            // Nếu chưa kích hoạt quay -> Tính là chụp ảnh
            takePhoto();
        }
    };

    // --- CÁC HÀM PHỤ TRỢ KHÁC ---
    const handleRotate = () => setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    
    const handleUploadClick = () => fileInputRef.current.click();
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const type = file.type.startsWith('video') ? 'video' : 'image';
                localStorage.setItem('temp_media_type', type);
                if(type === 'video') localStorage.setItem('temp_video', reader.result);
                else localStorage.setItem('temp_photo', reader.result);
                navigate('/camera-post');
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="camera-wrapper">
            <div className="camera-view">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted={isRecording} // Tắt tiếng loa ngoài khi quay để tránh vọng âm
                    className={facingMode === 'environment' ? 'environment' : ''}
                ></video>
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*,video/*" onChange={handleFileChange} />

                {/* Hiển thị thời gian khi quay */}
                {isRecording && (
                    <div className="recording-timer">
                        <div className="recording-dot"></div> REC
                    </div>
                )}
            </div>

            <div className="controls">
                <button className="btn-icon" onClick={() => navigate('/')}>
                    <i className="fa-solid fa-arrow-left"></i>
                </button>

                <button className="btn-icon" onClick={handleUploadClick}>
                    <i className="fa-regular fa-image"></i>
                </button>

                {/* NÚT CHỤP / QUAY */}
                <button 
                    className={`shutter-btn ${isRecording ? 'recording' : ''}`}
                    // Sự kiện cho chuột (PC)
                    onMouseDown={handlePressStart}
                    onMouseUp={handlePressEnd}
                    onMouseLeave={handlePressEnd}
                    // Sự kiện cho cảm ứng (Mobile)
                    onTouchStart={handlePressStart}
                    onTouchEnd={handlePressEnd}
                >
                    <span className="shutter-inner"></span>
                </button>

                <button className="btn-icon" onClick={handleRotate}>
                    <i className="fa-solid fa-rotate"></i>
                </button>
            </div>
        </div>
    );
};

export default Camera;