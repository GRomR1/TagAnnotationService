/**
 * Created by Admin on 06.03.2016.
 */
var express = require('express');
var router = express.Router();
var natural = require('natural');
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
stemmer = natural.PorterStemmerRu;
//stemmer.attach();
stemmerEng = natural.PorterStemmer;
//stemmerEng.attach();
TfIdf = natural.TfIdf;
tfidf = new TfIdf();
tokenizer = new natural.AggressiveTokenizerRu();
fs = require('fs');
var filename = '/!Code/Node/FirstApp1/etc/files/dict_all.txt';
var stopWordRuFile = '/!Code/Node/FirstApp1/etc/files/stop_ru.txt';
var stopWordEngFile = '/!Code/Node/FirstApp1/etc/files/stop_eng.txt';
var data = fs.readFileSync(filename,'utf8');
//console.log (data);
var dict1 = data.toString().split('\n');
console.log(dict1.length);
var dict1Stems = dict1.map(function(item) {
    if(item.split(' ').length==1){
        if(isCyrillic(item))
            return  stemmer.stem(item);
        else
            return  stemmerEng.stem(item);
    }
    else
        return '';
});
console.log('Dict1Stem count:');
console.log(dict1Stems.length);

var stopWordRu = fs.readFileSync(stopWordRuFile,'utf8').toString().split('\n');
var stopWordEng = fs.readFileSync(stopWordEngFile,'utf8').toString().split('\n');

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
    var textarea1 = req.body.textarea1;
    //res.send('POST: ' + JSON.stringify(req.body) + '<br>'+textarea1);
    console.log('POST: '+ textarea1);
    //var taTokens = textarea1.tokenizeAndStem(true);
    //console.log(taTokens);
    var taTokens2 =  tokenizer.tokenize(textarea1);
    //console.log(taTokens2.length);
    taTokens2=diff(diff(taTokens2.map(function(t) { return t.toLowerCase(); }),stopWordEng), stopWordRu);
    //console.log(taTokens2.length);
    for (var i = 0; i < taTokens2.length; i++) {
        if(isCyrillic(taTokens2[i]))
            taTokens2[i] = stemmer.stem(taTokens2[i]);
        else
            taTokens2[i] = stemmerEng.stem(taTokens2[i]);
    }
    //console.log('Tokens: ' + taTokens2);
    var freqsTokens = getMostFreqTokens(taTokens2);
    console.log("Freqs: "+freqsTokens.length + ": "+ freqsTokens);
    var keys = intersection(freqsTokens, dict1Stems);
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
        pKeysOrig: keysOrig
    });
});

module.exports = router;
