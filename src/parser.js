let Parser = function(argumentsList, defaultKey, defaultValue) {
  this.arguments = argumentsList;
  this.defaultKey = defaultKey;
  this.defaultValue = defaultValue;
  this.options = {};
  this.allFiles = [];
  this.help = false;
};

Parser.prototype = {
  isCompleteOption: function(option) {
    let regex = /^-[a-z][0-9]+$|^-[0-9]+$/g;
    return option.match(regex) != null;
  },

  isHalfOption: function(option) {
    let regex = /^-[a-z]+$/g;
    return option.match(regex) != null;
  },

  isCombinedOption: function(option){
    let regex = /^-[a-z][0-9]+$/g;
    return option.match(regex) != null;
  },

  isNumberOption: function(option){
    let regex = /^-[0-9]+$/g;
    return option.match(regex) != null;
  },

  getIntegerPart: function(option) {
    let integerValue = option.match(/[0-9]+/g);
    return integerValue != null ? integerValue.toString() : 0;
  },

  getOptionPart: function(option) {
    return option.match(/^-[a-z]+/g).toString();
  },

  hasHelp: function() {
    return this.arguments.includes('--help');
  },

  setHelpFlag: function() {
    if (this.hasHelp()) {
      this.help = true;
      this.options = {};
      this.allFiles = [];
    }
  },

  seperateOptions: function() {
    let options = [];
    this.setHelpFlag();
    for (let i = 0; i < this.arguments.length; i++) {
      if (this.isCompleteOption(this.arguments[i])) {
        options.push(this.arguments[i]);
      } else if (this.isHalfOption(this.arguments[i])) {
        options.push(this.arguments[i], this.arguments[++i]);
      } else {
        return options;
      }
    }
    return options;
  },

  seperateFiles: function() {
    return this.arguments.slice(this.seperateOptions().length,
      this.arguments.length);
  },

  isInvalidNumOption: function(arg,options){
    return this.isNumberOption(arg) && (this.defaultKey in options);
  },

  isValidNumOption: function(arg,options){
    return this.isNumberOption(arg) && !(this.defaultKey in options);
  },

  getOptionAndCount: function() {
    let optionList = this.seperateOptions();
    let options = {};
    for (let i = 0; i < optionList.length; i++) {
      this.assignCombineOption(options,optionList[i]);
      if (this.isHalfOption(optionList[i])) {
        options[optionList[i]] = optionList[++i];
      } else if (this.isValidNumOption(optionList[i],options)) {
        options[this.defaultKey] = Math.abs(optionList[i]);
      } else if (this.isInvalidNumOption(optionList[i],options)){
        throw new Error(`illegal option -- ${optionList[i]}`);
      }
    }
    return options;
  },

  assignCombineOption: function(obj,arg){
    if (this.isCombinedOption(arg)) {
      obj[this.getOptionPart(arg)] = this.getIntegerPart(arg);
    }
  },

  parse: function() {
    this.options = this.getOptionAndCount();
    this.allFiles = this.seperateFiles();
    return this;
  },

};

module.exports = Parser;
