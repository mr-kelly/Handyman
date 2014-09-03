// global._ = require('underscore');

// var SCRIPT_PATH = './Scripts/';
// var util = require('util');

// global.Handyman = require('./handyman')(SCRIPT_PATH);

// var express = require('express');

// var app = express();

// app.get('/', function(req, res) {

// 	var tasks = Handyman.getTasks();

// 	strOutput = '<form method="get">';

// 	_.each(tasks, function(task, key){

// 		strOutput += util.format('<input type="submit" value="%s" name="do_task" />', key);
// 	});

// 	strOutput += '</form>';

// 	console.log(util.inspect(req.body));
// 	if (req.body && req.body.do_task) {
// 		res.send(req.body.do_task)
// 	}
// 	else {
// 		res.send(strOutput);
// 	}

// });

global._ = require('underscore');
var SCRIPT_PATH = '../HandyManScripts/';
global.Handyman = require('./handyman')(SCRIPT_PATH);

var app = require('./app.js');


app.listen(3000);