//Edited Aug 15,2014
// Can be used to run all/selected tests.
// Also can be stopped on first failure
// Use -list option to list tests
// 'node runTest.js exampleTest.js ==> runs all tests',
// 'node runTest.js exampleTest.js -list ==> lists all tests',
// 'node runTest.js exampleTest.js -stop ==> stops on first failure',
// 'node runTest.js exampleTest.js -only namePart ==> runs all tests that match the namePart'
// Below are contents of exampleTest.js, a sample test file
//  
//-----------exampleTest.js----------------
//	var assert = require('assert');
//	var test = {};
//	test.sum_of_1_and_1_is_2 = function(){
//		assert.equal(1+1,2);
//	};
//	test.sum_of_1_and_3_is_4 = function(){
//		assert.equal(1+3,4);
//	};
//	exports.test = test;
//-----------------------------------------

var fs = require('fs');
var usages = ['node runTest.js exampleTest.js ==> runs all tests',
	'node runTest.js exampleTest.js -list ==> lists all tests',
	'node runTest.js exampleTest.js -stop ==> stops on first failure',
	'node runTest.js exampleTest.js -only namePart ==> runs all tests that match the namePart'
];

var printLine = function(line){console.log(line);};

var TestUsageException = function(message){
	this.message = message;
	this.name = 'TestUsageException';
};
var trim_undefined = function(item){return item || ''};

var quit = function(){
	console.log('Usage:');
	usages.forEach(printLine);
	var args = Array.prototype.slice.call(arguments, 0);
	throw new TestUsageException(args.map(trim_undefined).join(' '));
};

var readTestDetails = function(testfileName){
	console.log('loading tests from',testfileName);
	var test = require('./'+testfileName).test;
	test || quit('Missing test object in',testfileName);
	var members = Object.keys(test);
	var isAFunction = function(field){return ('function' == typeof test[field]);};
	var methods = members.filter(isAFunction);
	return {test:test,methodNames:methods};
};
var runTests = function(test,methodNames,option){
	var failed = 0;
	var executeTest = function(name){
		var member = test[name];
		console.log('--------');
		console.log('-->',name);
		try{
			member();
		}catch(error){
			failed++;
			console.log(error.stack);
			if(option === 'stop') throw {name:'User Requested to stop',message:'on first failure'};
		}
	};
	methodNames.forEach(executeTest);
	console.log('--------');
	var total = methodNames.length;
	console.log(total-failed +'/'+total+' passed');
	process.exitCode = failed;
};


var main = function(){
	var testName = process.argv[2];
	var option = process.argv[3];
	var filterText = process.argv[4];
	var matching = function(name){return name.indexOf(filterText)>=0;};

	if(!fs.existsSync(testName)) quit('Missing testfile',testName);
	var testDetails = readTestDetails(testName);

	(option === '-list') && testDetails.methodNames.forEach(printLine);
	(option === '-stop') && runTests(testDetails.test,testDetails.methodNames,'stop');
	(option === '-only') && runTests(testDetails.test,testDetails.methodNames.filter(matching));
	option || runTests(testDetails.test,testDetails.methodNames);
};

main();