var async = require('async');
var fs = require('fs');
var util = require('util');
var child_process = require('child_process');

var Task = require('./task.js');
var CronJob = require('cron').CronJob;

module.exports = function(scriptPath) {
	return new Handyman(scriptPath); 
};


var Handyman = function(scriptPath) {

	console.log("腳本所在相對目錄: " + scriptPath);
	this.tasks = {};
	
	this.scriptPath = scriptPath;

	this.reload();

	this.initTimers();
	// 每10秒再reload一次!
	setInterval(this.reload.bind(this), 10000);
}

var proto = Handyman.prototype;


// 加到文件的頂部，不是尾部！
var appendLog = function(this_, str) {
	var logFilePath = this_.getScriptFullPath() + "/HandymanLog.txt";
	fs.readFile(logFilePath, function(err, data) {
		data = '\r=======================' + (new Date).toString() + '==============================\r'
		+ str + '\r' 
		+ data;

		fs.writeFile(logFilePath, data);
	});

}

proto.getLogs = function () {
	var logFilePath = this.getScriptFullPath() + "/HandymanLog.txt";

	try {
		return fs.readFileSync(logFilePath);
	}
	catch (e) {
		return '';
	}
}

proto.log = function(str) { 
	appendLog(this, str);
	console.error(str);
}
proto.error = function(str) { 
	appendLog(this, "ERROR: " + str);
	console.error(str);
}


// @private
// 掃描單個目錄下
var _oneScriptFolderReader = function(this_, dirName, dirFullPath) {

	files = fs.readdirSync(dirFullPath);
	// var newArr = [];
	// _.each(files, function(file) {
	// 	newArr.push(file);
	// });
	
	var newTask = new Task(dirName, files);
	this_.tasks[dirName] = newTask;
}

proto.getScriptFullPath = function() {
	return util.format('%s', fs.realpathSync(this.scriptPath));
}

// @public
proto.reload = function() {

	this_ = this;
	
	console.log("reload.... " + this.scriptPath);

	var files = fs.readdirSync(this.scriptPath);

	_.each(files, function(file) {

		fileFullPath = util.format('%s', fs.realpathSync(this_.scriptPath + file));
		fileStat = fs.statSync(fileFullPath);
		if (fileStat.isDirectory()) {

			_oneScriptFolderReader(this_, file, fileFullPath);

			

		}
	});

	console.log("任務... :: " + util.inspect(this_.tasks));
}

proto.doTaskCommand = function(taskName, cmd) {
		// require是相對於本文件的!
	taskFilePath = util.format('../%s%s/%s.js', this.scriptPath, taskName, cmd);
	
	return require(taskFilePath);
}


// 獲取所有計劃任務
proto.getTasks = function() {
	return this.tasks;
}

// 執行其run腳本
proto.run = function(taskName) {
	var task = this.tasks[taskName];
	if (!task) {
		Handyman.error(util.format("找不到任務: %s", taskName));
		return false;
	}

	var runFunc = this.doTaskCommand(taskName, 'run');
	runFunc(task);
	return true;
}

// 執行其run腳本
proto.initTimers = function() {
	this_ = this;
	_.each(this.tasks, function(task, taskName){
		if (!task) {
			Handyman.error(util.format("找不到任務: %s", taskName));
			//return false;
		}
		else {
			var runFunc = this_.doTaskCommand(taskName, 'timer');
			if (runFunc.time && runFunc.run) {
				console.log("init timer " + taskName);
				new CronJob(runFunc.time, function(){runFunc.run(task);}, null, true);
			}
			//return true;
		}
	});

}

// 執行系統文件
proto.runSystemFile = function(fileFullPath, runFinishCallback) {
	this_ = this;
  		child_process.execFile(
  			fileFullPath, 

  			function(err, stdout, stderr){

	  			this_.log(stdout);

	  			if (runFinishCallback)
	  				runFinishCallback(err, stdout, stderr);
  			}
  		);
}