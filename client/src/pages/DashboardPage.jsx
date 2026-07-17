import { Box } from '@chakra-ui/react';
import StatsDashboard from '../components/StatsDashboard.jsx';

function DashboardPage({ games }) {
  return (
    <Box>
      <StatsDashboard games={games} />
    </Box>
  );
}

export default DashboardPage;