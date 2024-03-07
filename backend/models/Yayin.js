// Yayin.js dosyası
const mongoose = require('mongoose');

const yayinSchema = new mongoose.Schema({
    content: String,
});

const Yayin = mongoose.model('Yayin', yayinSchema);

module.exports = Yayin;