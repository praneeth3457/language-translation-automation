var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var routes = require('./routes.js')(app, express);
app.use('/', routes);

app.use(express.static(__dirname + '/'));

app.listen(PORT, function(err){
    if(err){
        console.log('Error in server!');
    }else{
        console.log('Server running on port: 3000');
    }
});