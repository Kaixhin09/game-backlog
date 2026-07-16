import { useState, useEffect } from 'react';
import { Box, Heading, Flex, Text, Spinner, Badge } from '@chakra-ui/react';
import GameForm from './GameForm.jsx';

const statusOptions = [
  { label: 'Not Started', value: 'Not Started' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Dropped', value: 'Dropped' },
];

const getStatusColorPalette = (status) => {
  switch (status) {
    case 'In Progress':
      return 'yellow';
    case 'Completed':
      return 'green';
    case 'Dropped':
      return 'red';
    case 'Not Started':
    default:
      return 'gray';
  }
};

function GameList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/games');
        const data = await res.json();
        setGames(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleGameAdded = (newGame) => {
    setGames((prevGames) => [newGame, ...prevGames]);
  };

  const handleGameDeleted = async (deletedGameId) => {
    try {
      await fetch(`http://localhost:5000/api/games/${deletedGameId}`, {
        method: 'DELETE',
      });
      setGames((prevGames) => prevGames.filter((game) => game._id !== deletedGameId));
    } catch (err) {
      console.error('Error deleting game:', err);
    }
  }
  const handleStatusCycle = async (game) => {
    const currentStatusIndex = statusOptions.findIndex(option => option.value === game.status);

    try{
        const res = await fetch(`http://localhost:5000/api/games/${game._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: statusOptions[(currentStatusIndex + 1) % statusOptions.length].value })
        });
        const updatedGame = await res.json();
        setGames((prevGames) => prevGames.map((g) => g._id === updatedGame._id ? updatedGame : g)); 
    } catch (err) {
        console.error('Error updating game status:', err);
    }
  };

  if (error) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Text color="red.500">{error}</Text>
      </Flex>
    );
  }

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>
        Game List
      </Heading>
    <GameForm onGameAdded={handleGameAdded} />

      {games.length === 0 ? (
        <Text>No games found.</Text>
      ) : (
        games.map((game) => (
          <Box key={game._id ?? `${game.title}-${game.platform}-${game.createdAt ?? ''}`} p={4} mb={4} borderWidth="1px" borderRadius="md">
            <Heading as="h3" size="md">
              {game.title}
            </Heading>
            <Text>Platform: {game.platform}</Text>
            <Text>Status: {game.status}</Text>
            <Text>Rating: {game.rating}</Text>
            <Text>Hours Played: {game.hoursPlayed}</Text>
            <Text>Notes: {game.notes}</Text>
            <Badge ml={2} colorPalette={getStatusColorPalette(game.status)} onClick={() => handleStatusCycle(game)} cursor="pointer">
              {game.status}
            </Badge>
            <Flex mt={2}>
              <Box as="button" onClick={() => handleGameDeleted(game._id)} mr={2} p={2} bg="red.500" color="white" borderRadius="md">
                Delete Game
              </Box>
            </Flex>
          </Box>
        ))
      )}
    </Box>
  );
}


export default GameList;

