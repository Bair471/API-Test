import { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function PersonModal({ person, onClose, onSave }) {
  const [formData, setFormData] = useState({ id: 0, name: "", age: 0 });

  useEffect(() => {
    if (person) {
      setFormData(person);
    } else {
      setFormData({ id: 0, name: "", age: 0 });
    }
  }, [person]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === "age" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      if (formData.id && formData.id !== 0) {
        await fetch(`http://localhost:8000/persons/${formData.id}`, {
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
      onClose();
    } catch (err) {
      console.error("Ошибка сохранения:", err);
    }
  };

  return (
    <Modal open={!!person} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          {formData.id && formData.id !== 0 ? "Редактировать человека" : "Добавить нового человека"}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Имя"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="age"
              label="Возраст"
              type="number"
              value={formData.age}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>
        </Grid>

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
