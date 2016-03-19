/**
 * Created by Admin on 06.03.2016.
 */
var express = require('express');
var router = express.Router();
var natural = require('natural');
var tokenizer1 = require('Tokenizer');
var isCyrillic = function (text) {
    return /[а-яА-Я]/i.test(text);
};
function intersection(A, B)
{
    var m = A.length, n = B.length, c = 0, C = [];
    for (var i = 0; i < m; i++)
    {
        var j = 0, k = 0;
        while (B[j] !== A[ i ] && j < n) j++;
        while (C[k] !== A[ i ] && k < c) k++;
        if (j != n && k == c) C[c++] = A[ i ];
    }
    return C;
};
function diff(A, B)
{
    var M = A.length, N = B.length, c = 0, C = [];
    for (var i = 0; i < M; i++)
    {
        var j = 0, k = 0;
        while (B[j] !== A[i] && j < N) j++;
        while (C[k] !== A[i] && k < c) k++;
        if (j == N && k == c) C[c++] = A[i];
    }
    return C;
}
function getMostFreqTokens(A){
    A.sort();
    var current = null;
    var res = [];
    var cnt = 0;
    var out = '';
    for (var i = 0; i < A.length; i++) {
        if (A[i] != current) {
            if (cnt > 0) {
                out += current + '  --> ' + cnt + '  \r\n';
                if(cnt>1)
                    res.push(current);
            }
            current = A[i];
            cnt = 1;
        } else {
            cnt++;
        }
    }
    if (cnt > 0) {
        out += current + '  --> ' + cnt + ' ';
        if(cnt>1)
            res.push(current);
    }
    //console.log('getMostFreqTokens #' + out);
    return res;
}
//var _id=0;
//function DictStem( stem ) {
//    this.id = ++_id;
//    this.stem = stem;
//    this.get = function () {
//        return this.id + " " + this.stem;
//    };
//}

function ConceptAndStemValue(c1, s1, n1 ){
    this.idConc=c1;
    this.idStem=s1;
    this.numbStems=n1;
    this.set = function (c, s, n) {
        this.idConc = c;
        this.idStem = s;
        this.numbStems = n;
    }
}

// **************** ConceptAndStemTable **********************
function ConceptAndStemTable( ){
    this.table=[];
    this.add = function (c, s, n) {
        var value = new ConceptAndStemValue(c, s, n);
        this.table.push(value);
        return this.table.length-1;
    };
    this.getLength = function () {
        return this.table.length;
    };
    this.print = function () {
        var arr=[];
        for(var i=0; i<this.table.length; i++){
            arr.push(i+"\t=>\t"+this.table[i].idConc+" \t "+this.table[i].idStem);
        }
        return arr.join('\n');
    }
}

// **************** DictConcepts **********************
function DictConcepts( ){
    this.concepts=new Array();
    this.addConcept = function (c) {
        function checkAvailability(arr, val) {
            return arr.some(function(arrVal) {
                return val === arrVal;
            });
        }
        if(!checkAvailability(this.concepts, c)) {
            //если отсутсвует
            this.concepts.push(c);
            return this.concepts.length-1;
        }
        else {
            return this.concepts.indexOf(c);
        }
    };
    this.getLength = function () {
        return this.concepts.length;
    };
    this.print = function () {
        var arr=[];
        for(var i=0; i<this.concepts.length; i++){
            arr.push(i+"\t=>\t"+this.concepts[i]);
        }
        return arr.join('\n');
    }
}
// **************** DictStems **********************
//класс для хранения словарных стем
function DictStems(  ) {
    this.stems=new Array();
    this.addStem = function (stem) {
        function checkAvailability(arr, val) {
            return arr.some(function(arrVal) {
                return val === arrVal;
            });
        }
        if(!checkAvailability(this.stems, stem)) {
            //если отсутсвует
            this.stems.push(stem);
            return this.stems.length-1;
        }
        else {
            return this.stems.indexOf(stem);
        }
    };
    this.getLength = function () {
        return this.stems.length;
    };
    this.print = function () {
        var arr=[];
        for(var i=0; i<this.stems.length; i++){
            arr.push(i+"\t=>\t"+this.stems[i]);
        }
        return arr.join('\n');
        //return this.stems.join(';');
    }
}

stemmer = natural.PorterStemmerRu;
//stemmer.attach();
stemmerEng = natural.PorterStemmer;
//stemmerEng.attach();
TfIdf = natural.TfIdf;
tfidf = new TfIdf();
tokenizer = new natural.AggressiveTokenizerRu();
fs = require('fs');
var filename = '/!Code/Node/FirstApp1/etc/files/tanen_index_all_mod_new.txt';
var stopWordRuFile = '/!Code/Node/FirstApp1/etc/files/stop_ru.txt';
var stopWordEngFile = '/!Code/Node/FirstApp1/etc/files/stop_eng.txt';
var data = fs.readFileSync(filename,'utf8');
//console.log (data);
var dict1 = data.toString().split('\n');
console.log(dict1.length);
var myDict1Stems = new DictStems();
var myDictConcepts = new DictConcepts();
var myConceptAndStemTable = new ConceptAndStemTable();
console.log( "myDict1Stems.getLength()=" + myDict1Stems.getLength() );
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
    if(words1.length==1){
        if(isCyrillic(item)) {
            idStem= myDict1Stems.addStem(stemmer.stem(item));
            stem= stemmer.stem(item);
        }
        else {
            idStem= myDict1Stems.addStem(stemmerEng.stem(item));
            stem=  stemmerEng.stem(item);
        }
        myConceptAndStemTable.add(idConc, idStem, 1);
    }
    else {
        for(var i=0; i<words1.length; i++)
        {
            var word=words1[i];
            if(isCyrillic(word)) {
                idStem= myDict1Stems.addStem(stemmer.stem(word));
            }
            else {
                idStem= myDict1Stems.addStem(stemmerEng.stem(word));
            }
            myConceptAndStemTable.add(idConc, idStem, words1.length);
        }
        stem= '';
    }

    return stem;
});
//console.log('Dict1Stem: ');
//console.log(dict1Stems);
console.log('Dict1Stem count:');
console.log(dict1Stems.length);
console.log( "myDict1Stems.getLength()=" + myDict1Stems.getLength() );
console.log( "myDict1Stems=" + myDict1Stems.print() );
console.log( "myDictConcepts.getLength()=" + myDictConcepts.getLength() );
console.log( "myDictConcepts=" + myDictConcepts.print() );
console.log( "myConceptAndStemTable.getLength()=" + myConceptAndStemTable.getLength() );
console.log( "myConceptAndStemTable=" + myConceptAndStemTable.print() );


var stopWordRu = fs.readFileSync(stopWordRuFile,'utf8').toString().split('\n');
var stopWordEng = fs.readFileSync(stopWordEngFile,'utf8').toString().split('\n');
//console.log('stopWordRu count:');
//console.log(stopWordRu.length);
//console.log(stopWordRu.join('\n'));

//router.get('/', function(req, res, next) {
//    res.render('index', { title: 'Express' });
//});


router.get('/', function(req, res){
    var query = require('url').parse(req.url,true).query;
    var textarea1 = query.textarea1;
    //res.send('GET: ' + JSON.stringify(query) + '<br>'+ textarea1);
    console.log('GET: ' + JSON.stringify(query) + '<br>'+ textarea1);
    res.render('analyze', { title: 'Express', content: '****' + textarea1 + '****' });
});

router.post('/', function(req, res){
    //var textarea1 = req.body.textarea1;
    var textarea1 = fs.readFileSync('/!Code/Node/FirstApp1/etc/files/tanen_part2_process_and_threads_new.txt','utf8').toString();
    //res.send('POST: ' + JSON.stringify(req.body) + '<br>'+textarea1);
    console.log('POST: '+ textarea1);
    //var taTokens = textarea1.tokenizeAndStem(true);
    //console.log(taTokens);
    //var taTokens2 =  tokenizer.tokenize(textarea1);//from natural module
    var taTokens2 =  tokenizer1(textarea1);
    console.log("taTokens2.length="+taTokens2.length);
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
    //console.log('Tokens: ' + taTokens2);
    //var freqsTokens = getMostFreqTokens(taTokens2);
    var freqsTokens = taTokens2;
    //console.log("Freqs: "+freqsTokens.length + ": "+ freqsTokens);
    var keys = intersection(freqsTokens, dict1Stems);
    var myKeys = intersection(freqsTokens, myDict1Stems.stems);
    console.log('keys.length= ' + keys.length);
    console.log('myKeys.length= ' + myKeys.length);


    var keysOrig=[];
    var prev=null;
    for (var i = 0; i < dict1Stems.length; i++) {
        if(dict1Stems[i]!=''){
            if(dict1Stems[i]!=prev ) {
                if (keys.indexOf(dict1Stems[i]) != -1)
                    keysOrig.push(dict1[i]);
                prev=dict1Stems[i];
            }
        }
        else{
            var itemArr=dict1[i].split(' ');
            var stem1=null;
            if(isCyrillic(itemArr[0]))
                stem1=  stemmer.stem(itemArr[0]);
            else
                stem1=  stemmerEng.stem(itemArr[0]);
            var postToken=freqsTokens.indexOf(stem1);
            if(postToken!=-1){
                for (var j = 0; j < itemArr.length-1; j++) {
                    if(isCyrillic(itemArr[j+1]))
                        stem1= stemmer.stem(itemArr[j+1]);
                    else
                        stem1= stemmerEng.stem(itemArr[j+1]);
                    if(freqsTokens[postToken+j+1]==stem1
                        || freqsTokens[postToken-j-1]==stem1) {
                        keysOrig.push(dict1[i]);
                    }
                }
            }//end if
        }
    }
    console.log('Lenght key orig: ' + keysOrig.length);
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
    //console.log(keysAndFreqs.join('\n'));
    // Сортировка по частоте
    keysAndFreqs.sort(function(a, b) {
        if (a[1] < b[1]) return 1;
        else if (a[1] > b[1]) return -1;
        else return 0;
    });
    //console.log(keysAndFreqs.join('\n'));

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
        pKeysOrig: keysOrig,
        pKeysAndFreq: keysAndFreqs,
        tokenText1: taTokens2
    });
});

module.exports = router;
