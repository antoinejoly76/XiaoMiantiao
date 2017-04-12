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
            "translation": new RegExp('^.* ?'+req.params.englishpattern+'[,;" ]?.*')
        })
        .exec(function(err, word) {
            sendJsonResponse(res, 200, word);
        });
};
module.exports.linkchar2words = function(req, res) {
    var cursor = Word.find({}).cursor();
    cursor.on('data', function(wd) {
        updateWord(wd);
    });
    cursor.on('close', function() {
        console.log("stream closed");
    });
};


module.exports.removecharfromwords = function(req, res) {
    var cursor = Word.find({}).cursor();
    cursor.on('data', function(wd) {
        removeChildrenChars(wd);

    });
    cursor.on('close', function() {
        console.log("stream closed");
    });
};



function removeChildrenChars(wd) {
  for (var j = 0; j < wd.characters.length; j++) {
          wd.characters.remove(wd.characters[j]);
          wd.save(function(err, wd) {
                  console.log("remove successful for " + wd)
          });


        }

}


function updateWord(wd) {
    for (var j = 0; j < wd.chinese.length; j++) {
        var char1;
        Char
            .find({
                "chinese": wd.chinese[j]
            })
            .exec(function(err, character) {
                char1 = character[0];
                console.log("updating char " + char1)
                wd.characters.addToSet({
                    chinese: char1.chinese,
                    pinyin: char1.pinyin,
                    translation: char1.translation
                });
                wd.save(function(err, wd) {
                    console.log("save successful for " + wd)
                });

            });

    }


};

function updateWord(wd) {
    for (var j = 0; j < wd.chinese.length; j++) {
        var char1;
        Char
            .find({
                "chinese": wd.chinese[j]
            })
            .exec(function(err, character) {
                char1 = character[0];
                console.log("updating char " + char1)
                wd.characters.addToSet({
                    chinese: char1.chinese,
                    pinyin: char1.pinyin,
                    translation: char1.translation
                });
                wd.save(function(err, wd) {
                    console.log("save successful for " + wd)
                });

            });

    }


};
