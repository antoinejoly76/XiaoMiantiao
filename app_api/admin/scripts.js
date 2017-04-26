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

module.exports.addToneToChars = function(req, res) {
    var cursor = Char.find({}).cursor();
    cursor.on('data', function(wd) {
        setTone(wd);

    });
    cursor.on('close', function() {
        console.log("stream closed");
    });
};

module.exports.addStrippedPinyinToChars = function() {
    var cursor = Char.find({}).cursor();
    cursor.on('data', function(wd) {
      var pinyin = wd.pinyin;
      var strpinyin = pinyin.replace(/[ūǖǚùú]/g, "u").replace(/[ōóǒò]/g, "o").replace(/[ēéěè]/g, "e").replace(/[īíǐì]/g, "i").replace(/[āáǎà]/g, "a");
      wd.pinyin3 = strpinyin
      wd.save(function(err, wd) {
              console.log("added stripped pinyin for" + wd)
      });
    });
    cursor.on('close', function() {
        console.log("stream closed");
    });
};

function setTone(wd) {
  var first_tone_pattern = /[ūǖōāēī]/;
  var second_tone_pattern = /[éóúáí]/;
  var third_tone_pattern = /[ǎǐǒǔǚ]/;
  var fourth_tone_pattern = /[àùìèò]/;

  var pin = wd.pinyin
  var tone = 0;

  if (pin.search(first_tone_pattern) > -1)
    tone = 1;
  else if (pin.search(second_tone_pattern) > -1)
    tone = 2;
  else if (pin.search(third_tone_pattern) > -1)
    tone = 3;
  else if (pin.search(fourth_tone_pattern) > -1)
    tone = 4;
  else tone = 0;
  wd.tone = tone
  wd.save(function(err, wd) {
    console.log("add tone" + tone +  " for " + wd)
  });


}


module.exports.linkchar2words = function(req, res) {
     var cursor = Word.find({}).cursor();
    // cursor.on('data', function(wd) {
    //     updateWord(wd, 0);
    // });
    //
    //
    // cursor.on('close', function() {
    //     console.log("stream closed");
    // });

    // cursor.on('data', function(wd) {
    //     updateWord(wd, 1);
    // });
    //
    // cursor.on('close', function() {
    //     console.log("stream closed");
    // });
    //
    // cursor.on('data', function(wd) {
    //     updateWord(wd, 2);
    // });
    //
    // cursor.on('close', function() {
    //     console.log("stream closed");
    // });
    //
    // cursor.on('data', function(wd) {
    //     updateWord(wd, 3);
    // });
    //
    // cursor.on('close', function() {
    //     console.log("stream closed");
    // });
    //
    cursor.on('data', function(wd) {
        updateWord(wd, 4);
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


function updateWord(wd, num) {


  //  for (var j = 0; j < wd.chinese.length; j++) {
        var char1;
        Char
            .find({
                "chinese": wd.chinese[num]
            })
            .exec(function(err, character) {
                char1 = character[0];
                if (char1) {
                wd.characters.addToSet({
                    chinese: char1.chinese,
                    pinyin: char1.pinyin,
                    translation: char1.translation,
                    tone: char1.tone,
                    pinyin3: char1.pinyin3
                });
                wd.save(function(err, wd) {
                    console.log("save successful for " + wd)
                });
              }
            });

  //  }


};
