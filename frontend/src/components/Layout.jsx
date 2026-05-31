import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <>
      <header>
        <nav>
          <div className="logo">
            <i className="fas fa-users" aria-hidden="true"></i>
            <span>Study Group Finder</span>
          </div>
          <div className="nav-links">
            {user ? (
              <>
                <Link to="/dashboard">
                  <i className="fas fa-home" aria-hidden="true"></i> Dashboard
                </Link>
                <Link to="/groups">
                  <i className="fas fa-book-open" aria-hidden="true"></i> Study Groups
                </Link>
                <button type="button" className="link-button" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt" aria-hidden="true"></i> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/">
                  <i className="fas fa-sign-in-alt" aria-hidden="true"></i> Login
                </Link>
                <Link to="/register">
                  <i className="fas fa-user-plus" aria-hidden="true"></i> Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Study Group Finder. All rights reserved.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">
              <i className="fab fa-facebook" aria-hidden="true"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fab fa-twitter" aria-hidden="true"></i>
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fab fa-instagram" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;
