const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const authMiddleware = require('../middleware/auth');

// GET all games
router.get('/', authMiddleware, async (req, res) => {
    try {
        const games = await Game.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single game by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const game = await Game.findOne({ _id: req.params.id, userId: req.userId });
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.json(game);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new game
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newGame = new Game({ ...req.body, userId: req.userId });
        const savedGame = await newGame.save();
        res.status(201).json(savedGame);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT (update) a game by ID
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const updatedGame = await Game.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedGame) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.json(updatedGame);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a game by ID
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deletedGame = await Game.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!deletedGame) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.json({ message: 'Game deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;