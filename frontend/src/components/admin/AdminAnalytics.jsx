import { useEffect, useState } from "react";
import "./AdminAnalytics.css";
import { getAdminAnalytics } from "../../api/admin/analytics.api";

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getAdminAnalytics();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Analytics error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="loading-container">Loading analytics...</div>;
  }

  if (!data) {
    return <div className="empty-state">No analytics data</div>;
  }

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h2>Analytics</h2>
        <div className="date-filter">
          <button>Last 7 days</button>
          <button>Last 30 days</button>
          <button>Custom</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <p>Total Users</p>
          <h3>{data.stats.totalUsers.toLocaleString()}</h3>
        </div>
        <div className="stat-card">
          <p>Daily Active Users</p>
          <h3>{data.stats.dailyActiveUsers.toLocaleString()}</h3>
        </div>
        <div className="stat-card">
          <p>New Signups</p>
          <h3>{data.stats.newSignups.toLocaleString()}</h3>
        </div>
      </div>

      {/* Charts (placeholder – backend/chart lib gắn sau) */}
      <div className="charts-grid">
        <div className="chart-card">
          <h4>User Growth Over Time</h4>
          <div className="chart-placeholder">📈 Line Chart</div>
        </div>

        <div className="chart-card">
          <h4>Most Active Regions</h4>
          <div className="chart-placeholder">📊 Bar Chart</div>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <h4>Top Check-in Locations</h4>
        <table>
          <thead>
            <tr>
              <th>Location</th>
              <th>Region</th>
              <th>Total Check-ins</th>
            </tr>
          </thead>
          <tbody>
            {data.topLocations.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>{item.region}</td>
                <td>{item.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAnalytics;
