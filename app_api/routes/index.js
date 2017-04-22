
var express = require('express');
var router = express.Router();
var ctrlCharacters = require('../controllers/characters');


/* Get full list of words or characters*/
router.get('/list/characters', ctrlCharacters.charactersList);
router.get('/list/words', ctrlCharacters.wordsList);

/* Get a specific character or word*/
router.get('/character/chinese/:chinesechar', ctrlCharacters.charactersReadOne);
router.get('/word/chinese/:chineseword', ctrlCharacters.wordsReadOne);
router.get('/word/pinyin/:pinyinword', ctrlCharacters.pinyinWordsReadOne);

/* Find words matching a given pattern*/
router.get('/search/pinyin/:pinyinpattern', ctrlCharacters.pinyinWordsSearchPattern);
router.get('/search/english/:englishpattern', ctrlCharacters.englishWordsSearchPattern);
router.get('/search/chinese/:chinesepattern', ctrlCharacters.chineseWordsSearchPattern);


// router.get('/admin/linkchar2words', ctrlCharacters.linkchar2words);
// router.get('/admin/removecharfromwords', ctrlCharacters.removecharfromwords) ;

module.exports = router;
