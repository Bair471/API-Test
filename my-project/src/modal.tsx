import type { Person } from "./Table";
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from "react";

interface EditPersonModalProps {
    person: Person | null;
    onSave: () => void;
    onClose: () => void;
}

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function PersonModal({ person, onClose, onSave }: EditPersonModalProps) {
    const [formData, setFormData] = useState<Person>({
        id: 0,
        name: '',
        age: 0,
    });

    useEffect(() => {
        if (person) {
            setFormData(person);
        } else {
            // Новый человек
            setFormData({ id: 0, name: '', age: 0 });
        }
    }, [person]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.name === "age" ? Number(e.target.value) : e.target.value });
    };

    const handleSave = async () => {
        try {
            if (formData.id && formData.id !== 0) {
                // Редактирование
                const response = await fetch(`http://localhost:8000/persons/${formData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    onSave();
                    onClose();
                }
            } else {
                // Добавление нового человека
                const response = await fetch("http://localhost:8000/persons", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    onSave();
                    onClose();
                }
            }
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
        }
    };

    return (
        <Modal open={!!person} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    {formData.id && formData.id !== 0 ? "Редактировать человека" : "Добавить нового человека"}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        name="name"
                        label="Имя"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        name="age"
                        label="Возраст"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        fullWidth
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                        <Button variant="outlined" onClick={onClose}>
                            Отмена
                        </Button>
                        <Button variant="contained" onClick={handleSave}>
                            Сохранить
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
