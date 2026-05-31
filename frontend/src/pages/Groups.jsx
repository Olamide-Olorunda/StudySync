import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { joinGroup, leaveGroup, listGroups } from '../api/client';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: '', message: '' });

  const fetchGroups = async () => {
    setStatus((prev) => ({ ...prev, loading: true, error: '' }));
    try {
      const data = await listGroups();
      setGroups(data.groups || []);
    } catch (err) {
      setStatus((prev) => ({ ...prev, error: err.message }));
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleJoin = async (groupId) => {
    setStatus((prev) => ({ ...prev, message: '', error: '' }));
    try {
      const data = await joinGroup(groupId);
      setStatus((prev) => ({ ...prev, message: data.message || 'Joined group.' }));
      fetchGroups();
    } catch (err) {
      setStatus((prev) => ({ ...prev, error: err.message }));
    }
  };

  const handleLeave = async (groupId) => {
    if (!window.confirm('Are you sure you want to leave this study group?')) {
      return;
    }
    setStatus((prev) => ({ ...prev, message: '', error: '' }));
    try {
      const data = await leaveGroup(groupId);
      setStatus((prev) => ({ ...prev, message: data.message || 'Left group.' }));
      fetchGroups();
    } catch (err) {
      setStatus((prev) => ({ ...prev, error: err.message }));
    }
  };

  return (
    <div className="groups-container">
      {status.message && <div className="success-message">{status.message}</div>}
      {status.error && <div className="error-message">{status.error}</div>}

      <h1>
        <i className="fas fa-users" aria-hidden="true"></i> Study Groups
      </h1>

      {status.loading ? (
        <p>Loading groups...</p>
      ) : (
        <div className="group-list">
          {groups.map((group) => (
            <div key={group.id} className={`group-card ${group.is_member ? 'member' : ''}`}>
              <h3>{group.name}</h3>
              <p className="course">
                <i className="fas fa-book" aria-hidden="true"></i> {group.course_code} - {group.course_name}
              </p>
              <p className="description">{group.description}</p>

              <div className="group-actions">
                {group.is_member ? (
                  <button type="button" className="btn leave-btn" onClick={() => handleLeave(group.id)}>
                    <i className="fas fa-user-minus" aria-hidden="true"></i> Leave
                  </button>
                ) : (
                  <button type="button" className="btn join-btn" onClick={() => handleJoin(group.id)}>
                    <i className="fas fa-user-plus" aria-hidden="true"></i> Join
                  </button>
                )}
                <Link to={`/groups/${group.id}`} className="btn view-btn">
                  <i className="fas fa-info-circle" aria-hidden="true"></i> Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Groups;
