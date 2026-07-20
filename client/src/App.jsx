import { useEffect, useState } from 'react';
import { Box, Spinner, Flex, Text } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import GameListPage from './pages/GameListPage.jsx';
import AddGamePage from './pages/AddGamePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './App.css';
import { Toaster } from './components/ui/Toaster.jsx';
import { toaster } from './components/ui/Toaster.jsx';
import { useAuth } from './context/AuthContext.jsx';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchGames = async () => {
      try {
        const res = await fetch(`${API_URL}/api/games`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data = await res.json();
        setGames(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [isAuthenticated, token]);

  const handleGameAdded = (newGame) => {
    setGames((prev) => [newGame, ...prev]);
    toaster.create({
      title: 'Game Added',
      description: `${newGame.title} has been added to your backlog.`,
      type: 'success',
    });
  };

  const handleGameDeleted = async (id) => {
    const deletedGame = games.find((g) => g._id === id);
    try {
      await fetch(`${API_URL}/api/games/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGames((prev) => prev.filter((g) => g._id !== id));
      toaster.create({
        title: 'Game Deleted',
        description: deletedGame ? `${deletedGame.title} was removed.` : undefined,
        type: 'info',
      });
    } catch (err) {
      console.error('Error deleting game:', err);
      toaster.create({ title: 'Failed to delete game', type: 'error' });
    }
  };

  const handleGameUpdated = (updatedGame) => {
    setGames((prev) => prev.map((g) => (g._id === updatedGame._id ? updatedGame : g)));
    toaster.create({
      title: 'Game Updated',
      description: `${updatedGame.title} was saved.`,
      type: 'success',
    });
  };

  const handleStatusCycle = async (game) => {
    const statusOptions = ['Not Started', 'In Progress', 'Completed', 'Dropped'];
    const currentIndex = statusOptions.indexOf(game.status);
    const nextStatus = statusOptions[(currentIndex + 1) % statusOptions.length];
    try {
      const res = await fetch(`${API_URL}/api/games/${game._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      const updatedGame = await res.json();
      handleGameUpdated(updatedGame);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh" bg="bg">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" height="100vh" bg="bg">
        <Text color="red.500">{error}</Text>
      </Flex>
    );
  }

  return (
    <Box minH="100vh" color="textPrimary" fontFamily="body">
      <Toaster />
      <Navbar />
      <Box maxW="900px" mx="auto" p={{base: 4, md: 8}}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ProtectedRoute><DashboardPage games={games} /></ProtectedRoute>} />
          <Route
            path="/games"
            element={
              <ProtectedRoute>
                <GameListPage
                  games={games}
                  onGameDeleted={handleGameDeleted}
                  onStatusCycle={handleStatusCycle}
                  onGameUpdated={handleGameUpdated}
                />
              </ProtectedRoute>
            }
          />
          <Route path="/add" element={<ProtectedRoute><AddGamePage onGameAdded={handleGameAdded} /></ProtectedRoute>} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;