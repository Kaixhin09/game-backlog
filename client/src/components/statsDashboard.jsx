import { Box, Flex, Heading, Text, SimpleGrid } from '@chakra-ui/react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const STATUS_COLORS = {
  'Not Started': '#6B7280',
  'In Progress': '#F5A623',
  'Completed': '#34D399',
  'Dropped': '#F43F5E',
};

function StatsDashboard({ games }) {
  const totalGames = games.length;
  const totalHours = games.reduce((sum, g) => sum + (g.hoursPlayed || 0), 0);
  const completedCount = games.filter((g) => g.status === 'Completed').length;
  const completionRate = totalGames > 0 ? Math.round((completedCount / totalGames) * 100) : 0;

  const ratedGames = games.filter((g) => g.rating);
  const avgRating = ratedGames.length > 0
    ? (ratedGames.reduce((sum, g) => sum + g.rating, 0) / ratedGames.length).toFixed(1)
    : 'N/A';

  // Status breakdown for pie chart
  const statusCounts = games.reduce((acc, g) => {
    acc[g.status] = (acc[g.status] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  // Platform breakdown for bar chart
  const platformCounts = games.reduce((acc, g) => {
    acc[g.platform] = (acc[g.platform] || 0) + 1;
    return acc;
  }, {});
  const platformData = Object.entries(platformCounts).map(([platform, count]) => ({
    platform,
    count,
  }));

  if (totalGames === 0) {
    return (
      <Box className="stats-dashboard">
        <Heading size="md" className="stats-title" mb={2}>Backlog Stats</Heading>
        <Text className="stats-empty">
          No games yet — add your first game to see your stats here.
        </Text>
      </Box>
    );
  }
  

  return (
    <Box className="stats-dashboard">
      <Heading size="md" className="stats-title" mb={4}>Backlog Stats</Heading>

      <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} mb={6}>
        <Box className="stat-card">
          <Text className="stat-value">{totalGames}</Text>
          <Text className="stat-label">Total Games</Text>
        </Box>
        <Box className="stat-card">
          <Text className="stat-value">{totalHours}h</Text>
          <Text className="stat-label">Hours Played</Text>
        </Box>
        <Box className="stat-card">
          <Text className="stat-value">{completionRate}%</Text>
          <Text className="stat-label">Completion Rate</Text>
        </Box>
        <Box className="stat-card">
          <Text className="stat-value">{avgRating}</Text>
          <Text className="stat-label">Avg Rating</Text>
        </Box>
      </SimpleGrid>

      <Flex className="stats-charts" gap={6} wrap="wrap">
        <Box className="chart-box">
          <Text className="chart-title">By Status</Text>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label={(entry) => entry.name}
              >
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#7C6AEF'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1c1c28', border: '1px solid #2c2c3a', borderRadius: '8px' }}
                itemStyle={{ color: '#EDEDF2' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box className="chart-box">
          <Text className="chart-title">By Platform</Text>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={platformData}>
              <XAxis dataKey="platform" stroke="#8A8A9E" fontSize={12} />
              <YAxis stroke="#8A8A9E" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: '#1c1c28', border: '1px solid #2c2c3a', borderRadius: '8px' }}
                itemStyle={{ color: '#EDEDF2' }}
                cursor={{ fill: 'rgba(124, 106, 239, 0.1)' }}
              />
              <Bar dataKey="count" fill="#7C6AEF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Flex>
    </Box>
  );
}

export default StatsDashboard;