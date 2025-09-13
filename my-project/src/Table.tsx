import { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function PersonModal({ person, onSave, onClose }) {
  const [formData, setFormData] = useState({ name: "", age: "" });

  useEffect(() => {
    if (person) {
      setFormData({
        name: person.name || "",
        age: person.age || "",
      });
    }
  }, [person]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (person?.id) {
      await fetch(`http://localhost:8000/persons/${person.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } else {
      await fetch("http://localhost:8000/persons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }
    onSave();
  };

  return (
    <Modal open={!!person} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {person?.id ? "Редактировать человека" : "Добавить человека"}
        </Typography>

        <TextField
          label="Имя"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />

        <TextField
          label="Возраст"
          name="age"
          value={formData.age}
          onChange={handleChange}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />

        <Box sx={{ mt: 3, display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Сохранить
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
