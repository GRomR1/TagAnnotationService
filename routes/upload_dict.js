/**
 * Created by Admin on 21.03.2016.
 */
var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var external = require('ExternalTypesAndFunctions');
var fs = require('fs');

router.get('/', function(req, res, next) {
    res.render('upload_dict', {
        title: 'Tag Annotation Service',
        isDownload: false
    });
});

router.post('/', function(req, res){
    // создаем форму
    var form = new multiparty.Form();
    //здесь будет храниться путь с загружаемому файлу, его тип и размер
    var uploadFile = {uploadPath: '', type: '', size: 0};
    //максимальный размер файла
    var maxSize = 2 * 1024 * 1024; //2MB
    //поддерживаемые типы(в данном случае это картинки формата jpeg,jpg и png)
    var supportMimeTypes = ['text/plain'];
    //массив с ошибками произошедшими в ходе загрузки файла
    var errors = [];

    //если произошла ошибка
    form.on('error', function(){
        console.log('error' + uploadFile.path);
        if(fs.existsSync(uploadFile.path)) {
            //если загружаемый файл существует удаляем его
            fs.unlinkSync(uploadFile.path);
            //console.log('error');
        }
    });

    form.on('close', function() {
        //если нет ошибок и все хорошо
        if(uploadFile.path === './etc/files/upload/')
            res.render('upload_dict', {
                title: 'Tag Annotation Service',
                isDownload: false
            });
        else {
            if(errors.length == 0) {
                fs.readFile( uploadFile.path, 'utf8', function(err, data) {
                    if (err)
                        throw err;
                    console.log('Parse new dict: '+ uploadFile.path);
                    external.parseDictionaryToArr(uploadFile.path);
                    console.log('Success parse dict: '+ uploadFile.path);
                    //console.log(external.getParsedDictionaryName())
                });
                res.render('upload_dict', {
                    title: 'Tag Annotation Service',
                    isDownload: true
                });
            }
            else {
                if(fs.existsSync(uploadFile.path)) {
                    //если загружаемый файл существует удаляем его
                    fs.unlinkSync(uploadFile.path);
                }
                //сообщаем что все плохо и какие произошли ошибки
                res.send({status: 'bad', errors: errors});
            }
        }
    });

    // при поступление файла
    form.on('part', function(part) {
        //читаем его размер в байтах
        uploadFile.size = part.byteCount;
        //читаем его тип
        uploadFile.type = part.headers['content-type'];
        //путь для сохранения файла
        uploadFile.path = './etc/files/upload/' + part.filename;

        //проверяем размер файла, он не должен быть больше максимального размера
        if(uploadFile.size > maxSize) {
            errors.push('File size is ' + uploadFile.size + '. Limit is' + (maxSize / 1024 / 1024) + 'MB.');
        }

        //проверяем является ли тип поддерживаемым
        if(supportMimeTypes.indexOf(uploadFile.type) == -1) {
            errors.push('Unsupported mimetype ' + uploadFile.type);
        }

        //если нет ошибок то создаем поток для записи файла
        if(errors.length == 0) {
            var out = fs.createWriteStream(uploadFile.path);
            part.pipe(out);
            //var fp = __dirname.split(path.sep);
            //fp.pop();
            //var upFile = path.join(fp.join(path.sep), uploadFile.path);
        }
        else {
            //пропускаем
            //вообще здесь нужно как-то остановить загрузку и перейти к onclose
            part.resume();
        }
    });

    // парсим форму
    form.parse(req);
});


module.exports = router;