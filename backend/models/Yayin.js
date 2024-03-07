// Yayin.js dosyası
const mongoose = require('mongoose');

const yayinSchema = new mongoose.Schema({
    id: Int32Array,
});

const Yayin = mongoose.model('Yayin', yayinSchema);

module.exports = Yayin;