const mongoose = require('mongoose');

const thingSchema = new mongoose.Schema({
    name:  { type: String, required: false },
    description:  { type: String, required: false },
    img:  { type: String, required: false },
    link:  { type: String, required: false },
    likes:  { type: Number, required: false },
});

const Thing = mongoose.model('Thing', thingSchema);

module.exports = Thing;
