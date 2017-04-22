require('../models/db')

var mongoose = require('mongoose');
var Char = mongoose.model('Character');
var Word = mongoose.model('Word');
mongoose.set('debug', true);

module.exports.addStrippedPinyin = function() {
    var cursor = Word.find({}).cursor();
    cursor.on('data', function(wd) {
      var pinyin = wd.pinyin1;
      var strpinyin = pinyin.replace(/[0-9]/g, "") //replace all digits
      wd.pinyin3 = strpinyin
      wd.save(function(err, wd) {
              console.log("added stripped pinyin for" + wd)
      });
    });
    cursor.on('close', function() {
        console.log("stream closed");
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
