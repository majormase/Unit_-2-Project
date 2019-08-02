const mongoose = require('mongoose');

const thingSchema = new mongoose.Schema({
    name:  { type: String, required: true },
    description:  { type: String, required: true },
    img:  { type: String, required: true },
    link:  { type: String, required: true },
    like:  { type: Number, required: true },
});

const Thing = mongoose.model('Thing', thingSchema);

module.exports = Thing;
