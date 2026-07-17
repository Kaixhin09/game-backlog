const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    platform: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed', 'Dropped'],
        default: 'Not Started',
    },
    rating: {
        type: Number,
        min: 0,
        max: 10
    },
    hoursPlayed: {
        type: Number,
        default: 0,
    },
    notes: {
        type: String,
    },
    coverImage: {
        type: String,
        default: '',
    },
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);