var request = require("request");
var fs = require('fs');
var csvWriter = require('csv-write-stream');
var writer = csvWriter();

//
var path = './languages/';
var sourceLang = 'en';
var languages = [
    {key : "en-US", code: 'en'},
    {key : "en-AU", code: 'en'},
    {key : "zh-CN", code: 'zh-CN'},
    {key : "zh-TW", code: 'zh-TW'},
    {key : "es-ES", code: 'es'},
    {key : "tr-TR", code: 'tr'},
    {key : "pt-PT", code: 'pt'},
    {key : "pt-BR", code: 'pt'}
];

module.exports = function(app, express) {
    var api = express.Router();
    api.post('/', function(req, res) {
        if(req.body.sourceText && req.body.sourceText.length) {
            //return res.send(addTextInCSV(req.body.sourceText));
            var sourceArray = req.body.sourceText;
            sourceArray.forEach(function(text) {
                languages.forEach(function(lang) {
                    var url =  "https://translate.googleapis.com/translate_a/single?client=gtx&sl="+ sourceLang + "&tl=" + lang.code + "&dt=t&q=" + encodeURI(text);
                    request.get(url, function (error, response, body) {
                        if(error) {
                            return res.send(error);
                        }
                        console.log(response.statusCode);
                        if(response.statusCode == 200) {
                            var fileName = path + lang.key + '.csv';
                            var translatedText = JSON.parse(body)[0][0][0];
                            var translatedLang = lang.key;
                            addTextInCSV(fileName, translatedLang, translatedText);
                        } else {
                            return res.send("Google translation API service unavailable");
                        }
                    });
                });
            });

            return res.send(true);

            // var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="
            //     + req.body.sourceLang + "&tl=" + req.body.targetLang + "&dt=t&q=" + encodeURI(req.body.sourceText);
            //
            // return Request.get(url, function (error, response, body) {
            //     if(error) {
            //         return res.send(error);
            //     }
            //
            //
            //     var writer = csvWriter({sendHeaders: false});
            //     writer.pipe(fs.createWriteStream('out.csv',{flags: 'a'}));
            //     writer.write({hello: "world", foo: JSON.parse(body)[0][0][0], baz: "taco"});
            //     writer.end();
            //     return res.send(JSON.parse(body)[0][0][0]);
            // });
        } else {
            return res.send("Bad request!");
        }
    });

    api.get('/', function(req, res) {
            return res.send(true);
    });

    return api;
};


//Method to add row in CSV file
function addTextInCSV(fileName, translatedLang, translatedText) {
    var writer = csvWriter({sendHeaders: false});
    writer.pipe(fs.createWriteStream(fileName,{flags: 'a'}));
    writer.write({lang: translatedLang, foo: translatedText, baz: "taco"});
    writer.end();
    return true;
}