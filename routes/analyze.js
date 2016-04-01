/**
 * Created by Admin on 06.03.2016.
 */
var express = require('express');
var router = express.Router();
var natural = require('natural');
var external = require('ExternalTypesAndFunctions');
var tokenize = external.tokenize;
var isCyrillic = external.isCyrillic;
var findStemsInDict = external.findStemsInDict;
stemmer = natural.PorterStemmerRu;
stemmerEng = natural.PorterStemmer;
fs = require('fs');
var filename = './etc/files/tanen_index_all_mod_new.txt';
var data = fs.readFileSync(filename,'utf8'); //читаем текстовый файл со словарем
var dataDevided = data.toString().split('\n'); //разбиваем его по строкам

var dictStems = new external.DictStems(); //коллекция со всеми словарными стемами (как однословных понятий так и многословных понятий)
var dictConcepts = new external.DictConcepts(); //коллекция со всему словарные понятиями из dataDevided
var myConceptAndStemTable = new external.ConceptAndStemTable();
// dictStems, dictConcepts, myConceptAndStemTable - не используются (!!!)
//var hashDict = external.hashDictExt; //хэш-таблица хранящая понятия из словаря (ключ - слово/словосочетание после стемминга, значение - слово/словосочетание из словаря)

//var filename = './etc/files/tanen_index_all_mod_new.txt';
//var filename = './etc/files/tanen_index_full.csv';
//hashDict = external.parseDictionary(filename);
//Проходим по всем элементам dataDevided, заполняем словари
//dataDevided.forEach(function(item) {
//    var idConc = dictConcepts.addConcept(item);
//    var idStem;
//    var stem;
//    var words1=item.split(' ');
//    if(words1.length==0)
//        return '';
//    //var words1=tokenize(item);
//    if(words1.length==1){
//        if(isCyrillic(item)) {
//            idStem= dictStems.addStem(stemmer.stem(item));
//            if(item.length>3){
//                stem= stemmer.stem(item);
//            } else {
//                stem= item.toLowerCase();
//            }
//            stem.replace( / /gi, '');
//            hashDict[stem]=item;
//        }
//        else {
//            idStem= dictStems.addStem(stemmerEng.stem(item));
//            if(item.length>3){
//                stem= stemmerEng.stem(item);
//            } else {
//                stem= item.toLowerCase();
//            }
//            //stem=  stemmerEng.stem(item);
//            stem.replace( / /gi, '');
//            hashDict[stem]=item;
//        }
//        myConceptAndStemTable.add(idConc, idStem, 1);
//    }
//    else {
//        var itemHash=[];
//        for(var i=0; i<words1.length; i++)
//        {
//            var word=words1[i];
//            if(isCyrillic(word)) {
//                if(word.length>3){
//                    stem= stemmer.stem(word);
//                } else {
//                    stem= word.toLowerCase();
//                }
//                //stem= stemmer.stem(word);
//                stem.replace( / /gi, '');
//                idStem= dictStems.addStem(stem);
//            }
//            else {
//                if(word.length>3){
//                    stem= stemmerEng.stem(word);
//                } else {
//                    stem= word.toLowerCase();
//                }
//                //stem=  stemmerEng.stem(word);
//                stem.replace( / /gi, '');
//                idStem= dictStems.addStem(stem);
//            }
//            itemHash.push(stem);
//            myConceptAndStemTable.add(idConc, idStem, words1.length);
//        }
//        hashDict[itemHash.join(' ')]=item;
//    }
//});
//console.log( "dictStems.getLength()=" + dictStems.getLength() );
//console.log( "dictStems=" + dictStems.print() );
//console.log( "dictConcepts.getLength()=" + dictConcepts.getLength() );
//console.log( 'dictConcepts=\n' + dictConcepts.print() );
//console.log( "myConceptAndStemTable.getLength()=" + myConceptAndStemTable.getLength() );
//console.log( "myConceptAndStemTable=" + myConceptAndStemTable.print() );
//console.log( 'hashDict=\n' );
//for(var k in hashDict){
//    console.log( k + " => " + hashDict[k]);
//}


router.get('/', function(req, res, next) {
    res.render('analyze', {
        title: 'Tag Annotation Service' ,
        dictNames: external.getParsedDictionaryName()
    });
});

router.post('/', function(req, res){
    var text = req.body.textarea1;
    var selectDictName = req.body.selectDictName;
    console.log('Selected dict: '+selectDictName);
    external.parseTextData(text, res, selectDictName);
    console.log('analyze success finish');
});

module.exports = router;
