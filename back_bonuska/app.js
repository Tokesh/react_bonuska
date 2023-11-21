const express = require('express');
const app = express();
const port = 3001;

const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const querystring = require('querystring');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const format = require('pg-format');
const multer = require("multer");
const { Pool } = require('pg');
const { DateTime } = require('luxon');
const uuid = require('uuid');
const {verify} = require("jsonwebtoken");
dotenv.config();
const pool = new Pool({
    user: process.env.db_user,
    host: process.env.db_host,
    database: process.env.db_name,
    password: process.env.db_password,
    port: process.env.db_port,
});
const secretKey = 'd965e3d1236c46c40521eac28b3d742ed214d024ec7781de4779aaab1215cabc';


app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.post('/api/users/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        console.log(req.body);
        const result = await pool.query(
            'INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING *',
            [username, password, email]
        );
        const user = result.rows[0];
        const token = jwt.sign({ userId: user.user_id }, secretKey, { expiresIn: '24h' });
        res.status(201).json({ user, token });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/users/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND password_hash = $2',
            [username, password]
        );
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const token = jwt.sign({ userId: user.user_id }, secretKey, { expiresIn: '24h' });
            res.json({ user, token });
        } else {
            res.status(400).json({ error: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.get('/api/protected-route', authenticateToken, (req, res) => {
    // Доступ к req.user для получения данных пользователя
    res.json({ message: "Доступ разрешен" });
});

app.post('/api/chats',authenticateToken, async (req, res) => {
    const { chatName } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO chats (chat_name) VALUES ($1) RETURNING *',
            [chatName]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/chats',authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM chats');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/chats/:chatId/messages',authenticateToken, async (req, res) => {
    const { chatId } = req.params;
    console.log(req.body);
    const { userId, messageText } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO messages (chat_id, user_id, message_text) VALUES ($1, $2, $3) RETURNING *',
            [chatId, userId, messageText]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получение сообщений чата
app.get('/api/chats/:chatId/messages',authenticateToken, async (req, res) => {
    const { chatId } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM messages WHERE chat_id = $1',
            [chatId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});