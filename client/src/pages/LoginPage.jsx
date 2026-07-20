import { useState } from 'react';
import { Box, Heading, Input, Button, VStack, Text } from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="auth-container" maxW="360px" mx="auto" mt={20}>
      <Heading className="auth-title" size="lg" mb={6}>Log In</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <Input
            className="form-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            className="form-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <Text color="red.400" fontSize="sm">{error}</Text>}
          <Button className="btn-submit" type="submit" loading={submitting}>
            Log In
          </Button>
        </VStack>
      </form>
      <Text mt={4} fontSize="sm" className="auth-switch">
        Don't have an account? <Link to="/register" className="auth-link">Register</Link>
      </Text>
    </Box>
  );
}

export default LoginPage;