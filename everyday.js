var fs = require('fs');
var path = require('path');
var jade = require('jade');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var cwd = process.cwd();

var encoding = 'utf-8';

var tplFile = jade.compile(fs.readFileSync(path.join(__dirname, 'everyday.jade'), encoding), {
	filename: path.join(__dirname, 'everyday.jade'),
	pretty: true
});

var errorTplFile = jade.compile(fs.readFileSync(path.join(__dirname, '404.jade'), encoding), {
	filename: path.join(__dirname, '404.jade'),
	pretty: true
});

var mdRender = hexo.extend.renderer.get('md', true);

function walk(dir, callback) {
	if (!fs.existsSync(dir)) {
		return;
	}
	var files = fs.readdirSync(dir);
	files.forEach(function(fileName) {
		var curPath = path.join(dir, fileName);
		var stats = fs.statSync(curPath);
		if (stats.isFile()) {
			callback(curPath);
		} else {
			walk(curPath);
		}
	});
	return;
}

function everyday(config) {
	var source = path.join(cwd, 'everyday');
	var assets = path.join(__dirname, 'assets');
	if (!config.enable) {
		return;
	}

	walk(source, function(filePath) {
		var name = path.basename(filePath, '.md');
		var time = name.split('-');
		var day = time[2];
		var destFolder = path.join(config.path, time[0], time[1]);
		if (!fs.existsSync(destFolder)) {
			mkdirp.sync(destFolder);
		}
		hexo.route.set(path.join(destFolder, time[2] + '.html'), mdRender({
			text: fs.readFileSync(filePath, encoding)
		}));
	});

	walk(assets, function(filePath) {
		var name = path.basename(filePath);
		hexo.route.set(path.join(config.path, 'assets', name), fs.readFileSync(filePath, encoding));
	});

	hexo.route.set(path.join(config.path, 'index.html'), tplFile(config));
	hexo.route.set(path.join(config.path, '404.html'), errorTplFile(config));
}

module.exports = function(locals, render, callback) {
	var config = hexo.config;

	everyday(_.assign({
		path: 'everyday',
		enable: true,
		author: '天镶',
		description: '这里都是日记',
		highlight: {
			languages: ['javascript', 'css', 'xml', 'markdown'],
			style: 'github'
		}
	}, hexo.config.everyday));

	callback();
};