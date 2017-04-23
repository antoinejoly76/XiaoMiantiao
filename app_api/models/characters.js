var mongoose = require ('mongoose');

var characterSchema = new mongoose.Schema({
    chinese: {type: String, index: true, unique: true},
    pinyin: String,
    translation: String,
    tone: Number
});

var wordSchema = new mongoose.Schema({
    chinese: {type: String, index: true},
    pinyin1: String,
    pinyin2: String,
    pinyin3 : String,
    translation: String,
    level: String,
    characters: [characterSchema]
});


var Character = mongoose.model('Character', characterSchema);
var Word = mongoose.model('Word', wordSchema);
