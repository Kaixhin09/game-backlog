import { useState, useEffect } from 'react';
import { Box, Heading, Flex, Text, Spinner, Badge, Button, Input} from '@chakra-ui/react';
import GameForm from './GameForm.jsx';
import EditGameModal from './EditGameModal.jsx';

const statusOptions = [
  { label: 'Not Started', value: 'Not Started' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Dropped', value: 'Dropped' },
];

const filterOptions = [
  { label: 'All', value: 'All' },
  ...statusOptions,
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
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [editingGame, setEditingGame] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/games');
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
  };

  const handleStatusCycle = async (game) => {
    const currentStatusIndex = statusOptions.findIndex((option) => option.value === game.status);
    const nextStatus = statusOptions[(currentStatusIndex + 1) % statusOptions.length].value;

    try {
      const res = await fetch(`http://localhost:5000/api/games/${game._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const updatedGame = await res.json();
      setGames((prevGames) => prevGames.map((g) => (g._id === updatedGame._id ? updatedGame : g)));
    } catch (err) {
      console.error('Error updating game status:', err);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="50vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Text color="red.500">{error}</Text>
      </Flex>
    );
  }

  const platformOptions = ['All', ...new Set(games.map((game) => game.platform).filter(Boolean))];

  const handleGameUpdated = (updatedGame) => {
    setGames((prevGames) => prevGames.map((g) => (g._id === updatedGame._id ? updatedGame : g)));
  };
  
  const displayedGames = [...games]
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'hoursPlayed') return (b.hoursPlayed || 0) - (a.hoursPlayed || 0);
      return new Date(b.createdAt) - new Date(a.createdAt); // date
    })
    .filter((game) => filter === 'All' || game.status === filter)
    .filter((game) => platformFilter === 'All' || game.platform === platformFilter)
    .filter((game) => game.title.toLowerCase().includes(searchTerm.toLowerCase()));


return (
    <Box className="backlog-container" p={4}>
      <Heading as="h2" size="lg" mb={4} className="backlog-title">My Game Backlog</Heading>
      <GameForm onGameAdded={handleGameAdded} />

      <Input
        className="search-input"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
      />

      {/* Filter controls */}
      <Flex className="filter-row filter-row--status" mt={2} mb={2} align="center" wrap="wrap">
        <Text className="filter-label" mr={2}>Filter by Status:</Text>
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            className={`filter-btn filter-btn--status ${filter === option.value ? 'is-active' : ''}`}
            size="sm"
            onClick={() => setFilter(option.value)}
            variant={filter === option.value ? 'solid' : 'outline'}
            colorPalette="purple"
            mr={2}
            mb={2}
          >
            {option.label}
          </Button>
        ))}
      </Flex>

      {/* Sort controls */}
      <Flex className="filter-row filter-row--sort" mt={2} mb={4} align="center" wrap="wrap">
        <Text className="filter-label" mr={2}>Sort by:</Text>
        {[
          { label: 'Rating', value: 'rating' },
          { label: 'Hours Played', value: 'hoursPlayed' },
          { label: 'Date Added', value: 'date' },
        ].map((option) => (
          <Button
            key={option.value}
            className={`filter-btn filter-btn--sort ${sortBy === option.value ? 'is-active' : ''}`}
            size="sm"
            onClick={() => setSortBy(option.value)}
            variant={sortBy === option.value ? 'solid' : 'outline'}
            colorPalette="teal"
            mr={2}
            mb={2}
          >
            {option.label}
          </Button>
        ))}
      </Flex>

      {/* Platform filter controls */}
      <Flex className="filter-row filter-row--platform" mt={2} mb={4} align="center" wrap="wrap">
        <Text className="filter-label" mr={2}>Filter by Platform:</Text>
        {platformOptions.map((platform) => (
          <Button
            key={platform}
            className={`filter-btn filter-btn--platform ${platformFilter === platform ? 'is-active' : ''}`}
            size="sm"
            onClick={() => setPlatformFilter(platform)}
            variant={platformFilter === platform ? 'solid' : 'outline'}
            colorPalette="blue"
            mr={2}
            mb={2}
          >
            {platform}
          </Button>
        ))}
      </Flex>

      {displayedGames.length === 0 ? (
        <Text className="empty-state">No games match this filter.</Text>
      ) : (
        <Box className="game-grid">
          {displayedGames.map((game) => (
            <Box
              key={game._id ?? `${game.title}-${game.platform}-${game.createdAt ?? ''}`}
              className={`game-card game-card--${game.status.toLowerCase().replace(/\s+/g, '-')}`}
              p={4}
              mb={4}
              borderWidth="1px"
              borderRadius="md"
              shadow="sm"
            >
              {/* Display cover image if available */}
              {game.coverImage && (
              <Box
                as="img"
                src={game.coverImage}
                alt={game.title}
                className="game-card-cover"
                w="100%"
                h="140px"
                objectFit="cover"
                borderRadius="6px"
                mb={3}
                />
              )}
              <Flex justify="space-between" align="flex-start">
                <Box className="game-card-info">
                  <Heading as="h3" size="md" mb={1} className="game-card-title">
                    {game.title}
                  </Heading>
                  <Text className="game-card-meta" fontSize="sm" color="gray.500">
                    {game.platform}
                    {game.rating ? ` · ${game.rating}/10` : ''}
                    {game.hoursPlayed ? ` · ${game.hoursPlayed}h played` : ''}
                  </Text>
                  {game.notes && (
                    <Text className="game-card-notes" fontSize="sm" mt={2}>
                      {game.notes}
                    </Text>
                  )}
                </Box>
                <Badge
                  className="status-badge"
                  colorPalette={getStatusColorPalette(game.status)}
                  onClick={() => handleStatusCycle(game)}
                  cursor="pointer"
                >
                  {game.status}
                </Badge>
              </Flex>
              <Flex className="game-card-actions" mt={3}>
                <Button
                  className="btn-delete"
                  size="sm"
                  colorPalette="red"
                  variant="outline"
                  onClick={() => handleGameDeleted(game._id)}
                >
                  Delete Game
                </Button>
                <Button
                  className="btn-edit"
                  size="sm"
                  colorPalette="blue"
                  variant="outline"
                  ml={2}
                  onClick={() => setEditingGame(game)}
                >
                  Edit Game
                </Button>
              </Flex>
            </Box>
          ))}
        </Box>
      )}

      {editingGame && (
        <EditGameModal
          isOpen={!!editingGame}
          onClose={() => setEditingGame(null)}
          game={editingGame}
          onGameUpdated={handleGameUpdated}
        />
      )}
    </Box>
  );
}
export default GameList;