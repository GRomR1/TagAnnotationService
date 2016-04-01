/**
 * Created by Admin on 21.03.2016.
 */
var express = require('express');
var router = express.Router();
var external = require('ExternalTypesAndFunctions');

router.get('/', function(req, res, next) {
    res.render('choose_method', {
        title: 'Tag Annotation Service',
        dictNames: external.getParsedDictionaryName()
    });
});

module.exports = router;