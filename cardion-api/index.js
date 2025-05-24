const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cron = require('node-cron');

const SERVER_URL = require('./config.js');

const authenticate = require('./authMiddleware');

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
app.post('/upload',authenticate, upload.single('image'), (req, res) => {
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
app.get('/image/:userId', authenticate,ensureUserDir, (req, res) => {
  const imagePath = path.join(req.userDir, 'profile.jpg');
  if (!fs.existsSync(imagePath)) return res.status(404).json({ error: 'Imagem não encontrada' });

  const imageUrl = `${SERVER_URL}/uploads/${req.params.userId}/profile.jpg`;
  res.json({ url: imageUrl });
});

// Deleta imagem do usuário
app.delete('/image/:userId',authenticate, ensureUserDir, (req, res) => {
  const imagePath = path.join(req.userDir, 'profile.jpg');
  if (!fs.existsSync(imagePath)) return res.status(404).json({ error: 'Imagem não encontrada' });

  fs.unlinkSync(imagePath);
  res.json({ success: true });
});


// Salva token com userId
app.post('/register-token', authenticate,async (req, res) => {
  const { token, userId } = req.body;
  if (!token || !userId) return res.status(400).send('Dados inválidos');

  try {
    await db.collection('pushTokens').doc(userId).set({
      token,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.send('Token salvo!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao salvar token');
  }
});

// Envia notificação para todos
app.post('/send-notification/all', async (req, res) => {
  const { title, body} = req.body;
  const snapshot = await db.collection('pushTokens').get();
  const tokens = snapshot.docs.map(doc => doc.data().token);

  try {
    await Promise.all(tokens.map(token =>
      axios.post('https://exp.host/--/api/v2/push/send', {
        to: token,
        sound: 'default',
        title,
        body,
      })
    ));
    res.send('Notificações enviadas!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao enviar notificações');
  }
});

// Envia notificação
app.post('/send-notification',authenticate, async (req, res) => {
  const { title, body,token } = req.body;
  try {
    await axios.post('https://exp.host/--/api/v2/push/send', {
        to: token,
        sound: 'default',
        title,
        body,
      })
    
    res.send('Notificações enviadas!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao enviar notificações');
  }
});

// Notificação diária às 9h
cron.schedule('0 9 * * *', async () => {
  const snapshot = await db.collection('pushTokens').get();
  const tokens = snapshot.docs.map(doc => doc.data().token);

  for (const token of tokens) {
    await axios.post('https://exp.host/--/api/v2/push/send', {
      to: token,
      sound: 'default',
      title: 'Lembrete Diário',
      body: 'Já fez seu treino hoje? 💪',
    });
  }
});

app.listen(3001, () => console.log('Servidor rodando na porta 3001'));
