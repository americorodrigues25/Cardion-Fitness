const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const SERVER_URL = require('./config.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer com destino dinâmico com base no userId vindo do FormData
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.body.userId;
    if (!userId) return cb(new Error('userId obrigatório'), null);

    const userDir = path.join(__dirname, 'uploads', userId);
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

    req.userId = userId;
    req.userDir = userDir;
    cb(null, userDir);
  },
  filename: (req, file, cb) => cb(null, 'profile.jpg') // sempre substitui
});

const upload = multer({ storage });

// Upload da imagem (substitui a antiga)
app.post('/upload', upload.single('image'), (req, res) => {
  const imagePath = path.join(`/uploads/${req.userId}`, 'profile.jpg');

  // Se a imagem já existir, apaga
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
  const imageUrl = `${SERVER_URL}/uploads/${req.userId}/profile.jpg`;
  res.json({ url: imageUrl, name: 'profile.jpg' });
});

// Middleware para GET e DELETE
const ensureUserDir = (req, res, next) => {
  const userId = req.params.userId;
  if (!userId) return res.status(400).json({ error: 'userId obrigatório' });

  const userDir = path.join(__dirname, 'uploads', userId);
  req.userId = userId;
  req.userDir = userDir;
  next();
};

// GET de uma imagem única do usuário
app.get('/image/:userId', ensureUserDir, (req, res) => {
  const imagePath = path.join(req.userDir, 'profile.jpg');
  if (!fs.existsSync(imagePath)) return res.status(404).json({ error: 'Imagem não encontrada' });

  const imageUrl = `${SERVER_URL}/uploads/${req.params.userId}/profile.jpg`;
  res.json({ url: imageUrl });
});

// Deleta imagem do usuário
app.delete('/image/:userId', ensureUserDir, (req, res) => {
  const imagePath = path.join(req.userDir, 'profile.jpg');
  if (!fs.existsSync(imagePath)) return res.status(404).json({ error: 'Imagem não encontrada' });

  fs.unlinkSync(imagePath);
  res.json({ success: true });
});

app.listen(3001, () => console.log('Servidor rodando na porta 3001'));
