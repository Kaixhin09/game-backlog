import { useState } from 'react';
import {
  Dialog,
  Portal,
  Button,
  Input,
  Textarea,
  VStack,
  NativeSelect,
} from '@chakra-ui/react';

const statusOptions = [
  { label: 'Not Started', value: 'Not Started' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Dropped', value: 'Dropped' },
];
const platformOptions = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile', 'Other'];

function EditGameModal({ game, isOpen, onClose, onGameUpdated }) {
  const [formData, setFormData] = useState({
    title: game.title || '',
    platform: game.platform || '',
    genre: game.genre || '',
    status: game.status || 'Not Started',
    rating: game.rating || '',
    hoursPlayed: game.hoursPlayed || '',
    notes: game.notes || '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/games/${game._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const updatedGame = await res.json();
      onGameUpdated(updatedGame);
      onClose();
    } catch (err) {
      console.error('Error updating game:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Edit Game</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack spacing={3} align="stretch">
                <Input
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleChange}
                />
                <NativeSelect.Root>
                  <NativeSelect.Field
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                  >
                    {platformOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
                <Input
                  name="genre"
                  placeholder="Genre"
                  value={formData.genre}
                  onChange={handleChange}
                />
                <NativeSelect.Root>
                  <NativeSelect.Field
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
                <Input
                  name="rating"
                  type="number"
                  placeholder="Rating (0-10)"
                  value={formData.rating}
                  onChange={handleChange}
                  min={0}
                  max={10}
                />
                <Input
                  name="hoursPlayed"
                  type="number"
                  placeholder="Hours played"
                  value={formData.hoursPlayed}
                  onChange={handleChange}
                  min={0}
                />
                <Textarea
                  name="notes"
                  placeholder="Notes"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorPalette="purple" loading={submitting} onClick={handleSave}>
                Save Changes
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default EditGameModal;