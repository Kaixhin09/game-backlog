import { useState } from 'react';
import {
  Dialog,
  Portal,
  Button,
  Input,
  Textarea,
  VStack,
  Select,
  createListCollection,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext.jsx';


const API_URL = import.meta.env.VITE_API_URL;

const statusOptions = [
  { label: 'Not Started', value: 'Not Started' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Dropped', value: 'Dropped' },
];
const platformOptions = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile', 'Other'];

const statusCollection = createListCollection({
  items: statusOptions,
});

const platformCollection = createListCollection({
  items: platformOptions.map((p) => ({ label: p, value: p })),
});

function EditGameModal({ game, isOpen, onClose, onGameUpdated }) {
  const { token } = useAuth();
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

  const handleSelectChange = (field) => (details) => {
    setFormData({ ...formData, [field]: details.value[0] || '' });
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/games/${game._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` },
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
        <Dialog.Backdrop className="modal-backdrop" />
        <Dialog.Positioner>
          <Dialog.Content className="edit-modal">
            <Dialog.Header className="edit-modal-header">
              <Dialog.Title className="edit-modal-title">Edit Game</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body className="edit-modal-body">
              <VStack spacing={3} align="stretch">
                <Input
                  className="form-input"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleChange}
                />

                <Select.Root
                  className="form-select-root"
                  collection={platformCollection}
                  value={[formData.platform]}
                  onValueChange={handleSelectChange('platform')}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger className="form-select-trigger">
                      <Select.ValueText placeholder="Select platform" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content className="form-select-content">
                        {platformCollection.items.map((item) => (
                          <Select.Item key={item.value} item={item} className="form-select-item">
                            <Select.ItemText>{item.label}</Select.ItemText>
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>

                <Select.Root
                  className="form-select-root"
                  collection={statusCollection}
                  value={[formData.status]}
                  onValueChange={handleSelectChange('status')}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger className="form-select-trigger">
                      <Select.ValueText placeholder="Select status" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content className="form-select-content">
                        {statusCollection.items.map((item) => (
                          <Select.Item key={item.value} item={item} className="form-select-item">
                            <Select.ItemText>{item.label}</Select.ItemText>
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>

                <Input
                  className="form-input"
                  name="rating"
                  type="number"
                  placeholder="Rating (0-10)"
                  value={formData.rating}
                  onChange={handleChange}
                  min={0}
                  max={10}
                />
                <Input
                  className="form-input"
                  name="hoursPlayed"
                  type="number"
                  placeholder="Hours played"
                  value={formData.hoursPlayed}
                  onChange={handleChange}
                  min={0}
                />
                <Textarea
                  className="form-textarea"
                  name="notes"
                  placeholder="Notes"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </VStack>
            </Dialog.Body>
            <Dialog.Footer className="edit-modal-footer">
              <Button className="btn-cancel" variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button className="btn-save" colorPalette="purple" loading={submitting} onClick={handleSave}>
                Save Changes
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger className="modal-close" />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default EditGameModal;