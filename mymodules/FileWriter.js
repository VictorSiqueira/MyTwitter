var fs = require('fs');
var FileWriter = function () {};
var DATAFILE = './documents/data.txt'

//https://darrenderidder.github.io/talks/ModulePatterns/#/8
var writeDocument = function (text) {
	fd = fs.openSync(DATAFILE, 'a');
	fs.writeSync(fd, text+',')
	fs.closeSync(fd)
};

var readDocument = function (callback) {
	var list;
	fs.readFile(DATAFILE, "utf8",(err, data) => {
    	if (err) throw err;
    	str = '['+data.toString().slice(0, data.toString().length -1)+']'
    	list = JSON.parse(str)
    	callback(list)
	});	
};

var deleteDataFromDocument = function(){
	fs.writeFile(DATAFILE, '', function(){
		console.log('done')
	})
}

FileWriter.prototype.saveData = function (newData) {
	writeDocument(newData);
};

FileWriter.prototype.readData = function(callback){
	readDocument(callback);
}

FileWriter.prototype.deleteData = function(){
	deleteDataFromDocument();
}

module.exports = new FileWriter();

