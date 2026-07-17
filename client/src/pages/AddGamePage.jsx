import { Box } from '@chakra-ui/react';
import GameForm from '../components/GameForm.jsx';

function AddGamePage({ onGameAdded }) {
  return (
    <Box>
      <GameForm onGameAdded={onGameAdded} />
    </Box>
  );
}

export default AddGamePage;