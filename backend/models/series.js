const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
    username: String,
    email: String,
    genre: String,
    platform: String,
    releaseDate: String,
    description: String,
    averageRating: String,
    numberOfSeasons: String,
    totalEpisodes: String,
});

const Series = mongoose.model('Series', seriesSchema);
module.exports = Series;
