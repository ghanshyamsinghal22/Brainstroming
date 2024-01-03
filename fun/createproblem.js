const unpublishedProblem = require('../model/unpublishedProblems');
async function createProblem(req, res) {
  console.log(req.body);
try {
    const problemName = req.body.problemName;
    // const problemid = req.body.problemid;
    const problemStatement = req.body.problemStatement;
    const problemInput = req.body.problemInput;
    const problemOutput = req.body.problemOutput;
    const problemNote = req.body.problemNote;
    const timeLimit = req.body.timeLimit;
    const memoryLimit = req.body.memoryLimit;
    const testCases = req.body.testCases;
    const solution = req.body.solution;
    const difficulty = req.body.difficulty;
    const attempts = req.body.attempts;

    const newProblem = await unpublishedProblem.create({
      problemName,
      // problemid,
      problemStatement,
      problemInput,
      problemOutput,
      problemNote,
      timeLimit,
      memoryLimit,
      testCases,
      difficulty,
      solution,
      attempts
  });
  console.log(newProblem);
    return res.status(201).json(newProblem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
module.exports={
    createProblem
}