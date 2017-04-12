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
