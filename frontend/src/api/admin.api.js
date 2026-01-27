import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// =======================
// AUTH
// =======================
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// =======================
// DASHBOARD
// =======================

export const getDashboardStats = async () => {
  try {
    const res = await apiClient.get("/admin/dashboard");
    return { success: true, data: res.data };
  } catch {
    return {
      success: true,
      data: {
        totalUsers: 1240,
        activeLocations: 340,
        pendingReviews: 12,
        totalPosts: 5320,
      },
    };
  }
};

export const getRecentActivity = async (limit = 5) => {
  return {
    success: true,
    data: [
      {
        id: 1,
        user: { name: "Nguyễn Văn A", avatar: null },
        action: "created a new check-in",
        location: "Central Park",
        timestamp: Date.now() - 1000 * 60 * 5,
      },
      {
        id: 2,
        user: { name: "Trần Thị B", avatar: null },
        action: "reviewed a location",
        location: "River Side",
        timestamp: Date.now() - 1000 * 60 * 30,
      },
      {
        id: 3,
        user: { name: "Lê Văn C", avatar: null },
        action: "signed up",
        location: "-",
        timestamp: Date.now() - 1000 * 60 * 60,
      },
    ].slice(0, limit),
  };
};

// =======================
// USER MANAGEMENT
// =======================

export const getAllUsers = async () => {
  try {
    const res = await apiClient.get("/admin/users");
    return { success: true, data: res.data };
  } catch {
    return {
      success: true,
      data: [
        {
          id: "u1",
          name: "Nguyễn Văn A",
          email: "a@test.com",
          status: "active",
        },
        {
          id: "u2",
          name: "Trần Thị B",
          email: "b@test.com",
          status: "blocked",
        },
        {
          id: "u3",
          name: "Lê Văn C",
          email: "c@test.com",
          status: "active",
        },
      ],
    };
  }
};

export const updateUserStatus = async () => ({ success: true });
export const deleteUser = async () => ({ success: true });

// =======================
// CONTENT MODERATION
// =======================

export const getPendingContent = async () => {
  return {
    success: true,
    data: [
      { id: "c1", locationName: "Cafe ABC", user: "User A" },
      { id: "c2", locationName: "Park XYZ", user: "User B" },
    ],
  };
};

export const approveContent = async () => ({ success: true });
export const rejectContent = async () => ({ success: true });
export const deleteContent = async () => ({ success: true });

// =======================
// MAP MANAGEMENT
// =======================

export const getAllLocations = async () => {
  return {
    success: true,
    data: [
      {
        id: "m1",
        name: "Central Park",
        latitude: 16.05,
        longitude: 108.2,
      },
      {
        id: "m2",
        name: "River Side",
        latitude: 16.06,
        longitude: 108.21,
      },
    ],
  };
};

export const createLocation = async () => ({ success: true });
export const updateLocation = async () => ({ success: true });
export const deleteLocation = async () => ({ success: true });

// =======================
// ANALYTICS
// =======================

export const getAdminAnalytics = async () => {
  return {
    success: true,
    data: {
      summary: {
        totalUsers: 125430,
        dailyActiveUsers: 18250,
        newSignups: 2140,
      },
      userGrowth: [
        { date: "Jan 1", value: 5000 },
        { date: "Jan 8", value: 12000 },
        { date: "Jan 15", value: 18000 },
        { date: "Jan 22", value: 28000 },
      ],
      activeRegions: [
        { region: "Region A", value: 1200 },
        { region: "Region B", value: 800 },
        { region: "Region C", value: 1400 },
      ],
      topLocations: [
        { name: "Central Park", region: "Region A", total: 4350 },
        { name: "City Mall", region: "Region B", total: 3250 },
      ],
    },
  };
};

export default apiClient;
