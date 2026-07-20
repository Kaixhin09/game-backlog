import { Box } from '@chakra-ui/react';
import StatsDashboard from '../components/statsDashboard.jsx';

function DashboardPage({ games }) {
  return (
    <Box>
      <StatsDashboard games={games} />
    </Box>
  );
}

export default DashboardPage;