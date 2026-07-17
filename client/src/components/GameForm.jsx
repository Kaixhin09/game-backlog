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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const fetchCoverImage = async (title) => {
        try {
            const res = await fetch(`http://localhost:5000/api/cover-search?title=${encodeURIComponent(title)}`);
            const data = await res.json();
            return data.coverImage || "";
        } catch (err) {
            console.error("Error fetching cover image:", err);
            return "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const coverImage = await fetchCoverImage(formData.title);

            const res = await fetch("http://localhost:5000/api/games", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, coverImage }),
        });
        const newGame = await res.json();
        onGameAdded(newGame);
        setFormData({
            title: "",
            platform: "",
            genre: "",
            status: "Not Started",
            rating: "",
            hoursPlayed: "",
            notes: "",
            coverImage: "",
        });
         } catch (err) {
            console.error("Error adding game:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
    <Box className="game-form-container" p={4}>
        <Heading mb={4} className="game-form-title">Add New Game</Heading>
        <form className="game-form" onSubmit={handleSubmit}>
            <VStack spacing={4}>
                <Box className="form-field" w="100%">
                    <Box as="label" className="form-label" display="block" mb={2}>
                        Title
                    </Box>
                    <Input
                        className="form-input"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </Box>
                <Box className="form-field" w="100%">
                    <Box as="label" className="form-label" display="block" mb={2}>
                        Platform
                    </Box>
                    <Box
                        as="select"
                        className="form-select"
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
                <Box className="form-field" w="100%">
                    <Box as="label" className="form-label" display="block" mb={2}>
                        Status
                    </Box>
                    <Box
                        as="select"
                        className="form-select"
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
                <Box className="form-field" w="100%">
                    <Box as="label" className="form-label" display="block" mb={2}>
                        Rating
                    </Box>
                    <Input
                        className="form-input"
                        name="rating"
                        type="number"
                        min="0"
                        max="10"
                        value={formData.rating}
                        onChange={handleChange}
                    />
                </Box>
                <Box className="form-field" w="100%">
                    <Box as="label" className="form-label" display="block" mb={2}>
                        Hours Played
                    </Box>
                    <Input
                        className="form-input"
                        name="hoursPlayed"
                        type="number"
                        value={formData.hoursPlayed}
                        onChange={handleChange}
                    />
                </Box>
                <Box className="form-field" w="100%">
                    <Box as="label" className="form-label" display="block" mb={2}>
                        Notes
                    </Box>
                    <Textarea
                        className="form-textarea"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                    />
                </Box>
                <Button className="btn-submit" type="submit" loading={submitting}>
                    Add Game
                </Button>
            </VStack>
        </form>
    </Box>
);
}
export default GameForm;