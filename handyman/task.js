

var util = require('util');
var fs = require('fs');

// Class
Task = function(taskName, files) {
	this.taskName = taskName;
	this.files = files;
}

// 完整的task目錄
Task.prototype.getTaskFullPath = function () {
	return util.format("%s/%s/", Handyman.getScriptFullPath(), this.taskName);
}

Task.prototype.lock = function() {
	// 創建Lock文件
	var taskDirPath = this.getTaskFullPath();
	
	Handyman.log("taskDirPath " + taskDirPath);

	fs.writeFileSync(taskDirPath + 'lock', '')

}

Task.prototype.getText = function() {
	var getText = Handyman.doTaskCommand(this.taskName, 'text');
	if (getText)
		getText = getText(this);
	else
		getText = this.taskName;

	return getText;
}
Task.prototype.unLock = function() {
	if (!this.isLock) {
		Handyman.error(util.format("想要解鎖一個沒有鎖的任務: %s", this.taskName));
		return;
	}
	var taskDirPath = this.getTaskFullPath();
	fs.unlinkSync(taskDirPath + 'lock');
}

Task.prototype.isLock = function() {
	var taskDirPath = this.getTaskFullPath();
	return fs.existsSync(taskDirPath + 'lock');
};

module.exports = Task;