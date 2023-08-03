const mongoose = require("mongoose");

const taskShmema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
    },
});

const Task = mongoose.model('Task', taskShmema);
module.exports = {Task};