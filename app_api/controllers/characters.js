var mongoose = require('mongoose');
var Char = mongoose.model('Character');
var Word = mongoose.model('Word');
mongoose.set('debug', true);

module.exports.charactersList = function(req, res) {
    Char.find({}, function(err, character) {
        sendJsonResponse(res, 200, character);
    });
};




module.exports.charactersReadOne = function(req, res) {
    Char
        .find({
            "chinese": req.params.chinesechar
        })
        .exec(function(err, character) {
            sendJsonResponse(res, 200, character);
        });
};


var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
}


module.exports.wordsList = function(req, res) {
    Word.find({}, function(err, word) {
        sendJsonResponse(res, 200, word);
    });
};

module.exports.wordsReadOne = function(req, res) {
    Word
        .find({
            "chinese": req.params.chineseword
        })
        .exec(function(err, word) {
            sendJsonResponse(res, 200, word);
        });
};


module.exports.pinyinWordsReadOne = function(req, res) {
    Word
        .find({
            "pinyin3": req.params.pinyinword
        })
        .exec(function(err, word) {
            sendJsonResponse(res, 200, word);
        });
};

module.exports.pinyinWordsSearchPattern = function(req, res) {

    Word
        .find({
            "pinyin3": new RegExp('^.*'+req.params.pinyinpattern+'.*$')
        })
        .exec(function(err, word) {
            sendJsonResponse(res, 200, word);
        });
};

module.exports.englishWordsSearchPattern = function(req, res) {
  console.log(req.params.englishpattern);
    Word
        .find({
            "translation": new RegExp('(^|^.*[,;" ]+)'+req.params.englishpattern+'([,;" ]+.*$|$)')
        })
        .exec(function(err, word) {
            sendJsonResponse(res, 200, word);
        });
};

module.exports.chineseWordsSearchPattern = function(req, res) {

    Word
        .find({
            "chinese": new RegExp('^.*'+req.params.chinesepattern+'.*$')
        })
        .exec(function(err, word) {
            sendJsonResponse(res, 200, word);
        });
};
