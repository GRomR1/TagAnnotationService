var express = require('express');
var router = express.Router();
var external = require('ExternalTypesAndFunctions');

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Tag Annotation Service' ,
    dictNames: external.getParsedDictionaryName()
  });
});

module.exports = router;
