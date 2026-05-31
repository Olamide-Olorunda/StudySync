import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../api/client';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboard();
        setGroups(data.groups || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <>
      <section className="hero">
        <h1>Welcome, {user?.name}!</h1>
        <p>Connect with fellow students, join study groups, and excel in your courses together.</p>
      </section>

      <div className="dashboard">
        <section className="my-groups">
          <h2>
            <i className="fas fa-users" aria-hidden="true"></i> Your Study Groups
          </h2>
          {loading && <p>Loading your groups...</p>}
          {error && <div className="error-message">{error}</div>}
          {!loading && !error && groups.length === 0 && (
            <div className="no-groups">
              <p>You haven't joined any study groups yet.</p>
              <Link to="/groups" className="btn">
                Browse Available Groups
              </Link>
            </div>
          )}
          {!loading && groups.length > 0 && (
            <div className="group-list">
              {groups.map((group) => (
                <div key={group.id} className="group-card member">
                  <h3>{group.name}</h3>
                  <p className="course">
                    <i className="fas fa-book" aria-hidden="true"></i> {group.course_code}
                  </p>
                  <div className="group-actions">
                    <Link to={`/groups/${group.id}`} className="btn view-btn">
                      <i className="fas fa-info-circle" aria-hidden="true"></i> View Group
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Dashboard;
