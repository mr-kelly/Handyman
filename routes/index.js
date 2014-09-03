var express = require('express');
var router = express.Router();
var util = require('util');
/* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: 'Express' });
// });

var index_render = function(req, res) {
	var handymanLog = Handyman.getLogs();
	var tasks = Handyman.getTasks();
	renderObj = {title:"Handyman", tasks : tasks, logs : handymanLog};


	if (req.query && req.query.do_task) {
		renderObj.do_task = req.query.do_task;
		res.render('index', renderObj);
	}
	else {
		res.render('index', renderObj);
	}
}

router.get('/', function(req, res) {

	index_render(req, res);

});

router.post('/', function(req, res) {

	if (req.body && req.body.do_task) {

		console.log(util.format('do_task: %s', req.body.do_task));

		Handyman.run(req.body.do_task);

		// 堵塞，執行任務后再繼續

		// Handyman.reload(); // 重載文件系統，可能會多了Lock
	}

	index_render(req, res);
});



module.exports = router;