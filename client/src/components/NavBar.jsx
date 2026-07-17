import { Box, Flex, Text } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/games', label: 'Game List' },
  { to: '/add', label: 'Add Game' },
];

function Navbar() {
  return (
    <Box className="navbar">
      <Flex className="navbar-inner" align="center" justify="space-between">
        <NavLink to="/" className="navbar-brand-link">
          <Text className="navbar-brand">Game Backlog</Text>
        </NavLink>
        <Flex className="navbar-links" gap={2}>
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
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar;