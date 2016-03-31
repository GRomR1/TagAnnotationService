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


router.post('/', function(req, res){
    var text = req.body.textarea1;
    external.parseTextData(text, res);
    //var textarea1 = fs.readFileSync('/!Code/Node/FirstApp1/etc/files/tanen_part2_process_and_threads_new.txt','utf8').toString();
    //res.send('POST: ' + JSON.stringify(req.body) + '<br>'+textarea1);
    //console.log('POST: '+ textarea1);
    //var taTokens2 =  tokenize(textarea1); //получаем массив с токенами на основе текста
    //console.log("taTokens2.length="+taTokens2.length);
    //var taTokens3 = taTokens2.filter(external.findCorrectWord); //оставляем только значащие слова
    //console.log("taTokens3.length="+taTokens3.length);
    ////console.log("taTokens3=\n"+taTokens3.join('\n'));
    //
    ////проводим процедуру стемминга
    //for(var i = 0; i < taTokens3.length; i++) {
    //    if(taTokens3[i].length>3){
    //        if(isCyrillic(taTokens3[i]))
    //            taTokens3[i] = stemmer.stem(taTokens3[i]);
    //        else
    //            taTokens3[i] = stemmerEng.stem(taTokens3[i]);
    //    }
    //}
    //
    ////получаем хэш таблицу со словарными понятиями и их частотой
    //var ress = findStemsInDict(taTokens3, hashDict);
    ////console.log('ress'+'=>'+'\n');
    ////for(var kk in ress){
    ////    console.log( kk + " => " + ress[kk]);
    ////}
    //
    //var keysRess = []; //массив словарных понятий
    //var valuesRess = []; //массив частот
    //for (var key in ress) {
    //    keysRess.push(key);
    //    valuesRess.push(ress[key]);
    //}
    //
    //var keysAndFreqs=new Array(keysRess.length); //двумерный массив словарных понятий и частот
    //for(i = 0; i < keysRess.length; i++) {
    //    keysAndFreqs[i]=new Array(2);
    //    keysAndFreqs[i][0]=keysRess[i];
    //    keysAndFreqs[i][1]=valuesRess[i];
    //}
    //
    //// Сортировка по частоте
    //keysAndFreqs.sort(function(a, b) {
    //    if (a[1] < b[1]) return 1;
    //    else if (a[1] > b[1]) return -1;
    //    else return 0;
    //});
    ////console.log(keysAndFreqs.join('\n'));
    //
    //res.render('analyze', {
    //    title: 'Tag Annotation Service',
    //    text1: textarea1,
    //    tokenText1: taTokens3,
    //    pKeysOrigAndFreq: keysAndFreqs
    //});
    console.log('analyze success finish');
});

module.exports = router;
