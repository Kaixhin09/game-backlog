const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();

app.use(cors());
app.use(express.json());

const gamesRouter = require('./routes/games');
app.use('/api/games', gamesRouter);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const coverSearchRoutes = require("./routes/gamecoverSearch");
app.use("/api/cover-search", coverSearchRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});