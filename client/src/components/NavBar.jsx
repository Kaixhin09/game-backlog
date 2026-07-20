import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/games', label: 'Game List' },
  { to: '/add', label: 'Add Game' },
];

function Navbar() {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
     <Box className="navbar">
      <Flex className="navbar-inner" align="center" justify="space-between">
        <NavLink to="/" className="navbar-brand-link">
          <Text className="navbar-brand">Game Backlog</Text>
        </NavLink>
        <Flex className="navbar-links" align="center" gap={2}>
          {isAuthenticated ? (
            <>
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => `navbar-link ${isActive ? 'is-active' : ''}`}
                >
                  {link.label}
                </NavLink>
              ))}
              <Text className="navbar-username" ml={3}>{username}</Text>
              <Button size="sm" className="btn-logout" onClick={handleLogout}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => `navbar-link ${isActive ? 'is-active' : ''}`}>
                Log In
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => `navbar-link ${isActive ? 'is-active' : ''}`}>
                Register
              </NavLink>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
export default Navbar;