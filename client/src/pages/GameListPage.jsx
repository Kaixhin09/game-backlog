import { useState } from 'react';
import { Box, Flex, Text, Badge, Button, Input } from '@chakra-ui/react';
import EditGameModal from '../components/EditGameModal.jsx';

const statusOptions = [
  { label: 'Not Started', value: 'Not Started' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Dropped', value: 'Dropped' },
];
const filterOptions = [{ label: 'All', value: 'All' }, ...statusOptions];

const getStatusColorPalette = (status) => {
  switch (status) {
    case 'In Progress': return 'yellow';
    case 'Completed': return 'green';
    case 'Dropped': return 'red';
    default: return 'gray';
  }
};

function GameListPage({ games, onGameDeleted, onStatusCycle, onGameUpdated }) {
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [editingGame, setEditingGame] = useState(null);

  const platformOptions = ['All', ...new Set(games.map((g) => g.platform).filter(Boolean))];

  const displayedGames = [...games]
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'hoursPlayed') return (b.hoursPlayed || 0) - (a.hoursPlayed || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .filter((g) => filter === 'All' || g.status === filter)
    .filter((g) => platformFilter === 'All' || g.platform === platformFilter)
    .filter((g) => g.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Box className="backlog-container">
      <Input
        className="search-input"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
      />

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
              key={game._id}
              className={`game-card game-card--${game.status.toLowerCase().replace(/\s+/g, '-')}`}
              p={4}
              mb={4}
              borderWidth="1px"
              borderRadius="md"
              shadow="sm"
            >
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
                  <Box as="h3" className="game-card-title" mb={1}>{game.title}</Box>
                  <Text className="game-card-meta" fontSize="sm">
                    {game.platform}
                    {game.rating ? ` · ${game.rating}/10` : ''}
                    {game.hoursPlayed ? ` · ${game.hoursPlayed}h played` : ''}
                  </Text>
                  {game.notes && <Text className="game-card-notes" fontSize="sm" mt={2}>{game.notes}</Text>}
                </Box>
                <Badge
                  className="status-badge"
                  colorPalette={getStatusColorPalette(game.status)}
                  onClick={() => onStatusCycle(game)}
                  cursor="pointer"
                >
                  {game.status}
                </Badge>
              </Flex>
              <Flex className="game-card-actions" mt={3}>
                <Button className="btn-delete" size="sm" colorPalette="red" variant="outline" onClick={() => onGameDeleted(game._id)}>
                  Delete Game
                </Button>
                <Button className="btn-edit" size="sm" colorPalette="blue" variant="outline" ml={2} onClick={() => setEditingGame(game)}>
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
          onGameUpdated={(g) => { onGameUpdated(g); setEditingGame(null); }}
        />
      )}
    </Box>
  );
}

export default GameListPage;