// models/Problem.js
// const mongoose = require('mongoose');

// const exampleSchema = new mongoose.Schema({
//   input: String,
//   output: String,
//   explanation: String
// });

// const problemSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   difficulty: String,
//   raw_tags: [String],
//   tags: [String],
//   description: String,
//   input_format: String,
//   output_format: String,
//   examples: [exampleSchema],
//   note: String,
//   solutions: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Solution'
//   }],
// }, { 
//   timestamps: true,
//   collection: 'Problem'
// });

// module.exports = mongoose.model('Problem', problemSchema);

// ==============================================================================
// ==============================================================================

// const mongoose = require('mongoose');

// const exampleSchema = new mongoose.Schema({
//   input: String,
//   output: String,
//   explanation: String
// });

// const problemSchema = new mongoose.Schema({
  
//   name: { type: String },
//   difficulty: String,
  
//   raw_tags: [
//     {type: String}
//   ],

//   tags: [
//     {type: String}
//   ],

//   skill_types: [
//     {type: String}
//   ],

//   description: String,
//   input_format: String,
//   output_format: String,
  
//   examples: [exampleSchema],
  
//   note: String,

//   solutions: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Solution'
//   }],
// }, { 
//   timestamps: true,
//   collection: 'Problem'
// });

// module.exports = mongoose.model('Problem', problemSchema);

// ======================================================================

// models/Problem.js
const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
  input: String,
  output: String,
  explanation: String // optional
});

const problemSchema = new mongoose.Schema({
  difficulty: String,
  name: String,
  source: String,

  raw_tags: [String],
  tags: [String],
  skill_types: [String],

  url: String,
  expected_auxiliary_space: String,
  expected_time_complexity: String,
  time_limit: String,
  date: String,
  picture_num: String,
  memory_limit: String,

  description: String,
  input: String,
  output: String,
  note: String,

  solutions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Solution'
  }],

  examples: [exampleSchema]

}, { timestamps: true, collection: 'Problem' });

module.exports = mongoose.model('Problem', problemSchema);
