import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getGroupDetails, joinGroup, leaveGroup } from '../api/client';

const GroupDetails = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [status, setStatus] = useState({ loading: true, error: '', message: '' });

  const fetchDetails = async () => {
    setStatus((prev) => ({ ...prev, loading: true, error: '' }));
    try {
      const data = await getGroupDetails(groupId);
      setGroup(data.group);
      setMembers(data.members || []);
      setIsMember(Boolean(data.is_member));
    } catch (err) {
      setStatus((prev) => ({ ...prev, error: err.message }));
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [groupId]);

  const handleJoin = async () => {
    setStatus((prev) => ({ ...prev, message: '', error: '' }));
    try {
      const data = await joinGroup(groupId);
      setStatus((prev) => ({ ...prev, message: data.message || 'Joined group.' }));
      fetchDetails();
    } catch (err) {
      setStatus((prev) => ({ ...prev, error: err.message }));
    }
  };

  const handleLeave = async () => {
    if (!window.confirm('Are you sure you want to leave this study group?')) {
      return;
    }
    setStatus((prev) => ({ ...prev, message: '', error: '' }));
    try {
      const data = await leaveGroup(groupId);
      setStatus((prev) => ({ ...prev, message: data.message || 'Left group.' }));
      fetchDetails();
    } catch (err) {
      setStatus((prev) => ({ ...prev, error: err.message }));
    }
  };

  if (status.loading) {
    return <p>Loading group details...</p>;
  }

  if (status.error) {
    return <div className="error-message">{status.error}</div>;
  }

  if (!group) {
    return <div className="error-message">Group not found.</div>;
  }

  return (
    <div className="group-details">
      {status.message && <div className="success-message">{status.message}</div>}
      <h2>
        <i className="fas fa-users" aria-hidden="true"></i> {group.name}
      </h2>
      <p className="course-info">
        <i className="fas fa-book" aria-hidden="true"></i> <strong>Course:</strong>{' '}
        {group.course_code} - {group.course_name}
      </p>
      <p className="description">{group.description}</p>

      <div className="group-actions">
        {isMember ? (
          <button type="button" className="btn leave-btn" onClick={handleLeave}>
            <i className="fas fa-user-minus" aria-hidden="true"></i> Leave Group
          </button>
        ) : (
          <button type="button" className="btn join-btn" onClick={handleJoin}>
            <i className="fas fa-user-plus" aria-hidden="true"></i> Join Group
          </button>
        )}
      </div>

      <h3>
        <i className="fas fa-users" aria-hidden="true"></i> Members
      </h3>
      {members.length > 0 ? (
        <ul className="member-list">
          {members.map((member) => (
            <li key={member.id}>
              <i className="fas fa-user" aria-hidden="true"></i> {member.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No members yet.</p>
      )}

      <Link to="/groups" className="back-link">
        <i className="fas fa-arrow-left" aria-hidden="true"></i> Back to all groups
      </Link>
    </div>
  );
};

export default GroupDetails;
