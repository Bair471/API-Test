const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const port = 8000;
const { Pool } = require('pg');


const pool = new Pool({
  user: 'adminadmin',      
  host: 'localhost',     
  database: 'postgres',
  password: 'adminadmin',     
  port: 5432,            
});


app.listen(port, () => {
    console.log(` Сервер запущен: http://localhost:${port}`);
  });

app.get("/persons", async (req, res) => {
  const age = req.query.age;
  try {
    const result = await pool.query('SELECT * FROM Persons WHERE age > 18');
    res.json(result.rows); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/persons/:id', async (req, res) => {
  const personId = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM persons WHERE id = $1', [personId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Человек не найден' });
    }
    res.json(result.rows[0]);
  } catch (error) { 
    console.error('Ошибка:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});


app.post('/persons', async (req, res) => {
  const { name, age } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO persons (name, age) VALUES ($1, $2) RETURNING *',
     [ name, age]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.delete('/persons/:id', async (req, res) => {
  const idToDelete = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM persons WHERE id = $1 RETURNING *', [idToDelete]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Человек не найден' });
    }
    res.json({ message: 'Человек успешно удален', car: result.rows[0] });
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.put('/persons/:id', async (req, res) => {
  try {
      const personId = parseInt(req.params.id);
      const { name, age } = req.body;

      if (!name || !age) {
        return res.status(400).json({ error: 'Имя и возраст обязательны' });
      }

      if (age <= 18) {
        return res.status(400).json({ error: 'Возраст должен быть больше 18' });
      }
      
      const query = `
          UPDATE persons
          SET name = $1, age = $2
          WHERE id = $3
          RETURNING *
      `;
      
      const values = [name, age, personId];
      
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Человек не найден' });
      }
      
      console.log('Данные обновлены:', result.rows[0]);
      res.json(result.rows[0]);
      
  } catch (error) {
      console.error('Ошибка обновления:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
  }
});


