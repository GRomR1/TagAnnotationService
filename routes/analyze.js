/**
 * Created by Admin on 06.03.2016.
 */
var express = require('express');
var router = express.Router();
var natural = require('natural');
var tokenizer1 = require('Tokenizer');
var external = require('ExternalTypesAndFunctions');
var isCyrillic = external.isCyrillic;
//var FStems = external.FStems;
var findStemsInDict = external.findStemsInDict;
stemmer = natural.PorterStemmerRu;
//stemmer.attach();
stemmerEng = natural.PorterStemmer;
//stemmerEng.attach();
TfIdf = natural.TfIdf;
tfidf = new TfIdf();
tokenizer = new natural.AggressiveTokenizerRu();
fs = require('fs');
var filename = './etc/files/tanen_index_all_mod_new.txt';
var data = fs.readFileSync(filename,'utf8');
//console.log (data);
var dict1 = data.toString().split('\n');
//console.log(dict1.length);
var myDict1Stems = new external.DictStems();
var myDictConcepts = new external.DictConcepts();
var myConceptAndStemTable = new external.ConceptAndStemTable();
var hashDict = {};
//console.log( "myDict1Stems.getLength()=" + myDict1Stems.getLength() );
//myDict1Stems.addStem('A');
//myDict1Stems.addStem('B');
//myDict1Stems.addStem('C');
//myDict1Stems.addStem('A');
//console.log( "myDict1Stems.getLength()=" + myDict1Stems.getLength() );
//console.log( "myDict1Stems=" + myDict1Stems.stems.reduce(function(sum, current) { return sum + current; }, '' ) );
//console.log( "myDict1Stems=" + myDict1Stems.print() );
var dict1Stems = dict1.map(function(item) {
    var idConc = myDictConcepts.addConcept(item);
    var idStem;
    var stem;
    var words1=item.split(' ');
    if(words1.length==0)
        return '';
    //var words1=tokenizer1(item);
    if(words1.length==1){
        if(isCyrillic(item)) {
            idStem= myDict1Stems.addStem(stemmer.stem(item));
            stem= stemmer.stem(item);
            stem.replace( / /gi, '');
            hashDict[stem]=item;
        }
        else {
            idStem= myDict1Stems.addStem(stemmerEng.stem(item));
            stem=  stemmerEng.stem(item);
            stem.replace( / /gi, '');
            hashDict[stem]=item;
        }
        myConceptAndStemTable.add(idConc, idStem, 1);
    }
    else {
        var itemHash=[];
        for(var i=0; i<words1.length; i++)
        {
            var word=words1[i];
            if(isCyrillic(word)) {
                stem= stemmer.stem(word);
                idStem= myDict1Stems.addStem(stem);
            }
            else {
                stem=  stemmerEng.stem(word);
                idStem= myDict1Stems.addStem(stem);
            }
            itemHash.push(stem);
            myConceptAndStemTable.add(idConc, idStem, words1.length);
        }
        stem= '';
        hashDict[itemHash.join(' ')]=item;
    }

    return stem;
});
//console.log('Dict1Stem: ');
//console.log(dict1Stems);
console.log('Dict1Stem count:');
console.log(dict1Stems.length);
console.log( "myDict1Stems.getLength()=" + myDict1Stems.getLength() );
//console.log( "myDict1Stems=" + myDict1Stems.print() );
console.log( "myDictConcepts.getLength()=" + myDictConcepts.getLength() );
//console.log( 'myDictConcepts=\n' + myDictConcepts.print() );
console.log( "myConceptAndStemTable.getLength()=" + myConceptAndStemTable.getLength() );
//console.log( "myConceptAndStemTable=" + myConceptAndStemTable.print() );
//console.log( 'hashDict=\n' );
//for(var k in hashDict){
//    console.log( k + " => " + hashDict[k]);
//}



//router.get('/', function(req, res, next) {
//    res.render('index', { title: 'Express' });
//});


//router.get('/', function(req, res){
//    var query = require('url').parse(req.url,true).query;
//    var textarea1 = query.textarea1;
//    //res.send('GET: ' + JSON.stringify(query) + '<br>'+ textarea1);
//    console.log('GET: ' + JSON.stringify(query) + '<br>'+ textarea1);
//    res.render('analyze', { title: 'Express', content: '****' + textarea1 + '****' });
//});



router.post('/', function(req, res){
    var textarea1 = req.body.textarea1;
    //var textarea1 = fs.readFileSync('/!Code/Node/FirstApp1/etc/files/tanen_part2_process_and_threads_new.txt','utf8').toString();
    //res.send('POST: ' + JSON.stringify(req.body) + '<br>'+textarea1);
    //console.log('POST: '+ textarea1);
    //var taTokens = textarea1.tokenizeAndStem(true);
    //console.log(taTokens);
    //var taTokens2 =  tokenizer.tokenize(textarea1);//from natural module
    var taTokens2 =  tokenizer1(textarea1);
    console.log("taTokens2.length="+taTokens2.length);

    //********** FILTER TOKENs *********
    var taTokens3 = taTokens2.filter(external.findCorrectWord);
    console.log("taTokens3.length="+taTokens3.length);
    //console.log("taTokens3=\n"+taTokens3.join('\n'));

    //исключение стоп-слов из списка токенов (выполнение разности с двумя массивами
    //taTokens2=diff(diff(taTokens2, stopWordEng), stopWordRu);
    //taTokens2=diff(taTokens2, stopWordRu);

    //исключение стоп-слов из списка токенов (выполнение разности с двумя массивами)
    //не работает: убирает слишком много слов - из 43тыс оставил только 7тыс
    //taTokens2=diff(diff(taTokens2.map(function(t) { return t.toLowerCase(); }),stopWordEng), stopWordRu);
    console.log("taTokens2.length="+taTokens2.length);
    for (var i = 0; i < taTokens2.length; i++) {
        if(isCyrillic(taTokens2[i]))
            taTokens2[i] = stemmer.stem(taTokens2[i]);
        else
            taTokens2[i] = stemmerEng.stem(taTokens2[i]);
    }
    for ( i = 0; i < taTokens3.length; i++) {
        if(isCyrillic(taTokens3[i]))
            taTokens3[i] = stemmer.stem(taTokens3[i]);
        else
            taTokens3[i] = stemmerEng.stem(taTokens3[i]);
    }

    var ress = findStemsInDict(taTokens3, hashDict);
    //console.log('ress'+'=>'+'\n');
    //for(var kk in ress){
    //    console.log( kk + " => " + ress[kk]);
    //}

    //console.log('Tokens: ' + taTokens2);
    //var freqsTokens = getMostFreqTokens(taTokens2);
    var freqsTokens = taTokens2;
    //console.log("Freqs: "+freqsTokens.length + ": "+ freqsTokens);
    var keys = external.intersection(freqsTokens, dict1Stems);
    var myKeys =  external.intersection(freqsTokens, myDict1Stems.stems);
    console.log('keys.length= ' + keys.length);
    console.log('myKeys.length= ' + myKeys.length);


    //var keysOrig=[];
    //var prev=null;
    //for (var i = 0; i < dict1Stems.length; i++) {
    //    if(dict1Stems[i]!=''){
    //        if(dict1Stems[i]!=prev ) {
    //            if (keys.indexOf(dict1Stems[i]) != -1)
    //                keysOrig.push(dict1[i]);
    //            prev=dict1Stems[i];
    //        }
    //    }
    //    else{
    //        var itemArr=dict1[i].split(' ');
    //        //var itemArr=tokenizer1(dict1[i]);
    //        var stem1=null;
    //        if(isCyrillic(itemArr[0]))
    //            stem1=  stemmer.stem(itemArr[0]);
    //        else
    //            stem1=  stemmerEng.stem(itemArr[0]);
    //        var postToken=freqsTokens.indexOf(stem1);
    //        if(postToken!=-1){
    //            for (var j = 0; j < itemArr.length-1; j++) {
    //                if(isCyrillic(itemArr[j+1]))
    //                    stem1= stemmer.stem(itemArr[j+1]);
    //                else
    //                    stem1= stemmerEng.stem(itemArr[j+1]);
    //                if(freqsTokens[postToken+j+1]==stem1
    //                    || freqsTokens[postToken-j-1]==stem1) {
    //                    keysOrig.push(dict1[i]);
    //                }
    //            }
    //        }//end if
    //    }
    //}
    //console.log('Lenght key orig: ' + keysOrig.length);

    var keysRess = [];
    var valuesRess = [];
    for (var key in ress) {
        keysRess.push(key);
        valuesRess.push(ress[key]);
    }
    var keysAndFreqs=new Array(keysRess.length);
    for(i = 0; i < keysRess.length; i++) {
        keysAndFreqs[i]=new Array(2);
        keysAndFreqs[i][0]=keysRess[i];
        keysAndFreqs[i][1]=valuesRess[i];
    }

    var keysAndFreqs2=new Array();
    for(i = 0; i < myKeys.length; i++) {
        var arr = new Array(2);
        arr[0]=myKeys[i];
        var indices = 0;
        var element = myKeys[i];
        if(element.length <= 3)
            continue;
        var idx = freqsTokens.indexOf(element);
        while (idx != -1) {
            indices=indices+1;
            idx = freqsTokens.indexOf(element, idx + 1);
        }
        arr[1]=indices;
        keysAndFreqs2.push(arr);
        //console.log(keys[i]+"->"+indices);
    }
    /*
    var keysAndFreqs=new Array(keys.length);
    for(var i = 0; i < keys.length; i++) {
        keysAndFreqs[i]=new Array(2);
        keysAndFreqs[i][0]=keys[i];
        var indices = 0;
        var element = keys[i];
        var idx = freqsTokens.indexOf(element);
        while (idx != -1) {
            indices=indices+1;
            idx = freqsTokens.indexOf(element, idx + 1);
        }
        keysAndFreqs[i][1]=indices;
        //console.log(keys[i]+"->"+indices);
    }
    */
    //console.log(keysAndFreqs.join('\n'));
    // Сортировка по частоте
    keysAndFreqs.sort(function(a, b) {
        if (a[1] < b[1]) return 1;
        else if (a[1] > b[1]) return -1;
        else return 0;
    });
    //console.log(keysAndFreqs.join('\n'));
    // Сортировка по частоте
    keysAndFreqs2.sort(function(a, b) {
        if (a[1] < b[1]) return 1;
        else if (a[1] > b[1]) return -1;
        else return 0;
    });
    //console.log(keysAndFreqs2.join('\n'));

    /*
    console.log('SORT: ');
    taTokens.sort();
    var current = null;
    var cnt = 0;
    var out = '';
    for (var i = 0; i < taTokens.length; i++) {
        if (taTokens[i] != current) {
            if (cnt > 0) {
                out += current + '  --> ' + cnt + '  \r\n';
            }
            current = taTokens[i];
            cnt = 1;
        } else {
            cnt++;
        }
    }
    if (cnt > 0) {
        out += current + '  --> ' + cnt + ' ';
    }
    */

    //tfidf.addDocument(taTokens);
    //var str = 'В статье вы как бы намекаете, что у вас apt-based дистрибутив';
    //tfidf.addDocument(str.tokenizeAndStem(true));
    //tfidf.tfidfs(['node', 'ruby'], function(i, measure) {
    //    console.log('document #' + i + ' is ' + measure);
    //});
    //tfidf.addDocument('this document is about node.');
    //tfidf.addDocument('this document is about ruby.');
    //tfidf.addDocument('this document is about ruby and node.');

    //tfidf.tfidfs('node ruby', function(i, measure) {
    //    console.log('document #' + i + ' is ' + measure);
    //});
    //console.log(out);
    //console.log('смысл'.stem());
    //tfidf.tfidfs('смысл'.stem(), function(i, measure) {
    //    console.log('document #' + i + ' is ' + measure);
    //});
    res.render('analyze', {
        title: 'Tag Annotation Service',
        //pContent: taTokens2,
        text1: textarea1,
        pKeys: keys,
        pKeysOrigAndFreq: keysAndFreqs,
        //pKeysAndFreq: keysAndFreqs,
        tokenText1: taTokens3,
        pKeysAndFreq2: keysAndFreqs2
    });
    console.log('analyze success finish');
});

module.exports = router;
