const mongoose = require('mongoose');


// habit schema
const HabbitSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true
    },
    dates: [{
        date: String,
        status: String
    }]
})

const Habbit = mongoose.model('Habbit', HabbitSchema);
module.exports = Habbit;