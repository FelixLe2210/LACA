import React, { useState, useEffect } from "react";
import { getPendingContent, approveContent, rejectContent, deleteContent } from "../../api/admin.api";
import "./ContentModeration.css";

const ContentModeration = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // pending, approved, rejected
  const [selectedContent, setSelectedContent] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchContent();
  }, [activeTab]);

  const fetchContent = async () => {
    setLoading(true);
    const res = await getPendingContent(1, 50);
    if (res.success) {
      setContent(res.data.content || []);
    }
    setLoading(false);
  };

  const handleApprove = async (contentId) => {
    const res = await approveContent(contentId);
    if (res.success) {
      setContent(prev => prev.filter(c => c.id !== contentId));
    }
  };

  const handleRejectClick = (item) => {
    setSelectedContent(item);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedContent) return;

    const res = await rejectContent(selectedContent.id, rejectReason);
    if (res.success) {
      setContent(prev => prev.filter(c => c.id !== selectedContent.id));
      setShowRejectModal(false);
      setSelectedContent(null);
      setRejectReason("");
    }
  };

  const handleDelete = async (contentId) => {
    if (!window.confirm("Are you sure you want to delete this content?")) return;

    const res = await deleteContent(contentId);
    if (res.success) {
      setContent(prev => prev.filter(c => c.id !== contentId));
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="content-moderation">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-moderation">
      <div className="page-header">
        <h1>Content Moderation</h1>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({content.length})
        </button>
        <button 
          className={`tab ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          Approved
        </button>
        <button 
          className={`tab ${activeTab === 'rejected' ? 'active' : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          Rejected
        </button>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {content.length === 0 ? (
          <div className="empty-state">
            <p>No {activeTab} content</p>
          </div>
        ) : (
          content.map(item => (
            <div key={item.id} className="content-card">
              {/* Image Preview */}
              {item.photos && item.photos.length > 0 && (
                <div className="content-image">
                  <img 
                    src={item.photos[0].url} 
                    alt="Content preview"
                    loading="lazy"
                  />
                  {item.photos.length > 1 && (
                    <div className="photo-count">
                      +{item.photos.length - 1}
                    </div>
                  )}
                </div>
              )}

              {/* Content Info */}
              <div className="content-body">
                <div className="content-header">
                  <div className="user-info">
                    <div className="user-avatar">
                      {item.user.avatar ? (
                        <img src={item.user.avatar} alt={item.user.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {item.user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="user-details">
                      <div className="user-name">{item.user.name}</div>
                      <div className="content-time">{formatTimestamp(item.timestamp)}</div>
                    </div>
                  </div>
                  <span className="status-badge status-pending">NEW</span>
                </div>

                <div className="content-location">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8Z" fill="currentColor"/>
                    <path d="M8 1C5.23858 1 3 3.23858 3 6C3 9.25 8 15 8 15C8 15 13 9.25 13 6C13 3.23858 10.7614 1 8 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{item.location.name}</span>
                </div>

                {item.description && (
                  <p className="content-description">{item.description}</p>
                )}

                {/* Action Buttons */}
                {activeTab === 'pending' && (
                  <div className="content-actions">
                    <button 
                      className="btn-action btn-approve"
                      onClick={() => handleApprove(item.id)}
                    >
                      ✓ Approve
                    </button>
                    <button 
                      className="btn-action btn-reject"
                      onClick={() => handleRejectClick(item)}
                    >
                      ✕ Reject
                    </button>
                    <button 
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Reject Content</h3>
            <p>Please provide a reason for rejecting this content:</p>
            <textarea
              className="reject-textarea"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows="4"
            />
            <div className="modal-actions">
              <button 
                className="btn-cancel" 
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm" 
                onClick={handleRejectConfirm}
                disabled={!rejectReason.trim()}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentModeration;