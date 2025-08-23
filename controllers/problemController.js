const Problem = require('../models/Problem');
const Solution = require('../models/Solution');

exports.getAllProblems = async (req, res) => {
    const problems = await Problem.find();
    console.log('hello');
    res.json(problems);
}

exports.getProblemById = async (req, res) => {
    try{
        const prob = await Problem.findById(req.params.id).populate('solutions');
        res.json(prob);
    }
    catch(err){
        res.json({ error: err.message })
    }
}


// Only for Admin
exports.addProblem = async (req, res) => {
  try {
    const { solutions, ...problemData } = req.body;
    const problem = await Problem.create(problemData);

    if (solutions?.length) {
      const createdSolutions = await Solution.insertMany(
        solutions.map(s => ({
          ...s,
          problem: problem._id   // attach problem ref here
        }))
      );
      problem.solutions = createdSolutions.map(s => s._id);
      await problem.save();
    }

    res.json(await problem.populate('solutions'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

