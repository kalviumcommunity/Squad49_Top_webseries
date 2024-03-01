const mongoose = require("mongoose");

const showSchema = new mongoose.Schema({
    title: String,
    genre: String,
    platform: String,
    release_date: String,
    description: String,
    average_rating: Number,
    reviews: Array,
    creators: Array,
    number_of_seasons: Number,
    total_episodes: Number,
})
const showsMongoose = mongoose.model(
    "WebSeries",showSchema
)
module.exports = showsMongoose