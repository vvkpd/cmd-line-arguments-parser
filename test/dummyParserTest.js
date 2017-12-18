let Parser = require('../src/dummyParser.js');
const assert = require('assert');
let test = {};

test["isCompleteOption should return true when it is complete option"]=function(){
  let parser = new Parser();
  let option1="-6";
  let option2="-n6";
  let option3="-c6";
  let option4="6";
  assert.ok(parser.isCompleteOption(option1));
  assert.ok(parser.isCompleteOption(option2));
  assert.ok(parser.isCompleteOption(option3));
  assert.ok(!parser.isCompleteOption(option4));
};

test["getIntegerPart should return Integer value from combined option"] = function(){
  let parser = new Parser();
  let option1="-n";
  let option2="-n6";
  assert.equal(parser.getIntegerPart(option1),0);
  assert.equal(parser.getIntegerPart(option2),6);
};

test["getOption should return option key from combined option"] = function(){
  let parser = new Parser();
  let option1 = '-n6';
  assert.equal(parser.getOption(option1),'-n');
};

test["seperatedOption should return list of options"] = function(){
  let args = ['-n10', '-c', '10', '-n', '2', 'file.txt', '-n12'];
  let parser = new Parser(args);
  assert.deepEqual(parser.seperateOptions(),['-n10','-c','10','-n','2']);
};

test["seperatedOption should return empty list of options when arguments has --help"] = function(){
  let args = ['--help', '-c', '10', '-n', '2', 'file.txt', '-n12'];
  let parser = new Parser(args);
  assert.deepEqual(parser.seperateOptions(),[]);
};

test["hasHelp should return true when arguments has --help"] = function(){
  let args = ['--help', '-c', '10', '-n', '2', 'file.txt', '-n12'];
  let parser = new Parser(args);
  assert.ok(parser.hasHelp());
};

test["setHelp should set help verbose true when arguments has --help"] = function(){
  let args = ['--help', '-c', '10', '-n', '2', 'file.txt', '-n12'];
  let parser = new Parser(args);
  parser.setHelp();
  assert.ok(parser.help);
};

test["seperateFiles should return list of files"] = function(){
  let args = ['-n10', '-c', '10', '-n', '2', 'file.txt', '-n12'];
  let parser = new Parser(args,'-n','10');
  assert.deepEqual(parser.seperateFiles(),['file.txt','-n12']);
};

test["seperateFiles should return list of files when u will pass only file list"] = function(){
  let args = ['file.txt','-n12'];
  let parser = new Parser(args,'-n','10');
  assert.deepEqual(parser.seperateFiles(),['file.txt','-n12']);
};


test["getOptions should return object of Options"] = function(){
  let args = ['-4','-c','10','-n','9','file.txt','-n12'];
  let parser = new Parser(args,'-n','10');
  assert.deepEqual(parser.getOptions(),{ '-n': 9 , '-c': 10 });
};

test["parser.parse should parse options and files"] = function(){
  let args = ['-10','-c','10','-n','10','file.txt','-n12'];
  let parser = new Parser(args,'-n','10');
  parser.parse();
  const expectedOutput = { arguments: [ '-10', '-c', '10', '-n', '10', 'file.txt', '-n12' ],
  defaultKey: '-n',
  defaultValue: '10',
  options: { '-n': 10, '-c': '10' },
  allFiles: [ 'file.txt', '-n12' ],
  help: false };
  assert.deepEqual(parser.parse(),expectedOutput);
};

test["parser.options should empty and parser.allFiles has files list when we pass only files List"] = function(){
  let args = ['file.txt'];
  let parser = new Parser(args,'-n','10');
  parser.parse();
  assert.deepEqual(parser.allFiles,['file.txt']);
};

test["parser.options should have options and parser.allFiles has empty list when we pass only options List"] = function(){
  let args = ['-10','-c','10','-n','10'];
  let parser = new Parser(args,'-n','10');
  parser.parse();
  assert.deepEqual(parser.options,{ '-n': '10', '-c': '10' });
  assert.deepEqual(parser.allFiles,[]);
};

test["parser.parse should throw Error when we will pass invalid arg"] = function(){
  let args = ['-10','-c','10','-n','10','-8','file.txt','-n12'];
  let parser = new Parser(args,'-n','10');
  assert.throws(parser.parse,Error);
};
exports.test = test;
