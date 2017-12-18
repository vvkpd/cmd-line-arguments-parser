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

  getOption: function(option) {
    return option.match(/^-[a-z]+/g).toString();
  },

  hasHelp: function() {
    return this.arguments.includes('--help');
  },

  setHelp: function() {
    if (this.hasHelp()) {
      this.help = true;
      this.options = {};
      this.allFiles = [];
    }
  },

  seperateOptions: function() {
    let options = [];
    this.setHelp();
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
    return this.arguments.slice(this.seperateOptions(this.arguments).length,
      this.arguments.length);
  },

  getOptions: function() {
    let optionList = this.seperateOptions();
    let options = {};
    for (let i = 0; i < optionList.length; i++) {
      this.assignCombineOption(options,optionList[i]);
      if (this.isHalfOption(optionList[i])) {
        options[optionList[i]] = optionList[++i];
      } else if (this.isNumberOption(optionList[i]) && !(this.defaultKey in options)) {
        options[this.defaultKey] = Math.abs(optionList[i]);
      } else {
        throw new Error("illegal option -- " + optionList[i]);
      }
    }
    return options;
  },

  assignCombineOption: function(obj,arg){
    if (this.isCombinedOption(arg)) {
      obj[this.getOption(arg)] = this.getIntegerPart(arg);
    }
  },

  parse: function() {
    this.options = this.getOptions();
    this.allFiles = this.seperateFiles();
    return this;
  },

};


module.exports = Parser;
