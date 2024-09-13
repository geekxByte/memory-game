const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Models
const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}));

const Score = mongoose.model('Score', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}));
// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};
// It handles our signup
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});
// It handles login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});
// It is used to show the high score of the user
app.get('/api/highscore', verifyToken, async (req, res) => {
  try {
    const highScore = await Score.findOne({ userId: req.userId }).sort({ score: -1 });
    res.json({ highScore: highScore ? highScore.score : 0 });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching high score' });
  }
});
// It is used to save the scores
app.post('/api/score', verifyToken, async (req, res) => {
  const { score } = req.body;
 
  try {
    const newScore = new Score({ userId: req.userId, score });
    await newScore.save();
    res.status(201).json({ message: 'Score saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving score' });
  }
});
// It is used to show the past score of the user
app.get('/api/scores', verifyToken, async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.userId }).sort({ date: -1 }).limit(10);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching scores' });
  }
});
// It is used to show the top score made by any user (Bonus task)
app.get('/api/topscores', async (req, res) => {
  try {
    const highScores = await Score.aggregate([
      {
        $group: {
          _id: '$userId',
          highScore: { $max: '$score' },
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 0,
          username: '$user.username',
          highScore: 1
        }
      },
      {
        $sort: { highScore: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json(highScores);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching high scores' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));