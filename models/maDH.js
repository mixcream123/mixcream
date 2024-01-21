const mongoose = require("mongoose");

const maDHSchema = new mongoose.Schema(
    {
        tenmadonhang: {
            type: String,
            required: true,
        },
        nameproduct:{
            type: String, 
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("maDH", maDHSchema);
