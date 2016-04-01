/**
 * Created by Admin on 06.03.2016.
 */
var express = require('express');
var router = express.Router();
var external = require('ExternalTypesAndFunctions');

router.post('/', function(req, res){
    var text = req.body.textarea1;
    var selectDictName = req.body.selectDictName;
    console.log('Selected dict: '+selectDictName);
    external.parseTextData(text, res);
    console.log('analyze success finish');
});

module.exports = router;
