var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var external = require('ExternalTypesAndFunctions');
var fs = require('fs');

router.get('/', function(req, res, next) {
    res.render('upload', {
        title: 'Tag Annotation Service',
        dictNames: external.getParsedDictionaryName()
    });
});

router.post('/', function(req, res){
    var count = 0;
    var form = new multiparty.Form();
    var path = './etc/files/upload/';
    var selectDictName;

    // Errors may be emitted
    form.on('error', function(err) {
        console.log('Error parsing form: ' + err.stack);
    });

    form.on('field', function(name, value) {
        if (name === 'selectDictName') {
            selectDictName = value;
        }
    });

    // Parts are emitted when parsing the form
    form.on('part', function(part) {
        if (part.filename) {
            // filename is defined when this is a file
            path += part.filename;
            if(count==0 && fs.existsSync(path)) {
                //если загружаемый файл существует удаляем его
                fs.unlinkSync(path);
            }
            count++;
            var out = fs.createWriteStream(path);
            part.pipe(out);
            part.resume();
        }
        else{
            part.resume();
        }

        part.on('error', function(err) {
            // decide what to do
        });
    });

    // Close emitted after form parsed
    form.on('close', function() {
        console.log('Upload completed: ' + path);
        if(count>0){
            fs.readFile( path, 'utf8', function(err, data) {
                    if (err)
                        throw err;
                    external.parseTextData(data, res, selectDictName);
                    console.log('Success parse text: '+ path + '. Dict: '+ selectDictName);
                });
        }
        else{
            res.render('upload', {
                title: 'Tag Annotation Service',
                dictNames: external.getParsedDictionaryName()
            });
        }
        //res.end('Received ' + count + ' files');
    });

    // Parse req
    form.parse(req);
});


module.exports = router;