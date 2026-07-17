import {useState} from 'react'
import {Box, Input, Button, Textarea, VStack, Heading} from '@chakra-ui/react'

const statusOptions = [
    { label: 'Not Started', value: 'Not Started' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Dropped', value: 'Dropped' }
]
const platformOptions = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile', 'Other']


function GameForm({ onGameAdded }) {
    const [formData, setFormData] = useState({
        title: '',
        platform: '',
        status: 'Not Started',
        rating: '',
        hoursPlayed: '',
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch('http://localhost:5000/api/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const newGame = await response.json();

            if (!response.ok) {
                throw new Error(newGame.message || 'Failed to add game');
            }

            onGameAdded(newGame);
            setFormData({
                title: '',
                platform: '',
                status: 'Not Started',
                rating: '',
                hoursPlayed: '',
                notes: ''
            });
        } catch (error) {
            console.error('Error adding game:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box p={4}>
            <Heading mb={4}>Add New Game</Heading>
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                    <Box w="100%">
                        <Box as="label" display="block" mb={2}>
                            Title
                        </Box>
                        <Input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </Box>
                    <Box w="100%">
                        <Box as="label" display="block" mb={2}>
                            Platform
                        </Box>
                        <Box
                            as="select"
                            name="platform"
                            value={formData.platform}
                            onChange={handleChange}
                            width="100%"
                            padding="0.5rem"
                            borderWidth="1px"
                            borderRadius="md"
                        >
                            <option value="">Select a platform</option>
                            {platformOptions.map((platform) => (
                                <option key={platform} value={platform}>
                                    {platform}
                                </option>
                            ))}
                        </Box>
                    </Box>
                    <Box w="100%">
                        <Box as="label" display="block" mb={2}>
                            Status
                        </Box>
                        <Box
                            as="select"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            width="100%"
                            padding="0.5rem"
                            borderWidth="1px"
                            borderRadius="md"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Box>
                    </Box>
                    <Box w="100%">
                        <Box as="label" display="block" mb={2}>
                            Rating
                        </Box>
                        <Input
                            name="rating"
                            type="number"
                            min="0"
                            max="10"
                            value={formData.rating}
                            onChange={handleChange}
                        />
                    </Box>
                    <Box w="100%">
                        <Box as="label" display="block" mb={2}>
                            Hours Played
                        </Box>
                        <Input
                            name="hoursPlayed"
                            type="number"
                            value={formData.hoursPlayed}
                            onChange={handleChange}
                        />
                    </Box>
                    <Box w="100%">
                        <Box as="label" display="block" mb={2}>
                            Notes
                        </Box>
                        <Textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </Box>
                    <Button type="submit" isLoading={submitting}>
                        Add Game
                    </Button>
                </VStack>
            </form>
        </Box>
    );
}

export default GameForm;