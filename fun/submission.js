const Submission=require('../model/submission')
const TestCase=require('../model/testcase');
const Problem =require('../model/problem');
const Pk1submission =require('../model/pk1submissionid');
const Pk2submission =require('../model/pk2submissionid');
const Pk3submission =require('../model/pk3submissionid');
const User =require('../model/user');
const func =require('./testcCppCode');
async function processSubmission(req, res) {
    try {
      const solution = req.body.solution;
      const problemId = req.body.problemId;
      const data=await Problem.findByPk(problemId,{ attributes: ['testCases','timeLimit']});
      // console.log(data);
    const testCases =data.dataValues.testCases;
    let i=1;
    let veridict ;
    for(i=1;i<=testCases;i++){
      const testData= await TestCase.findByPk(problemId+`${i}`);
      veridict = func.testCppCode(solution,testData.input,testData.output,data.dataValues.timeLimit*1000); 
      if(veridict!=="Accepted"){
        veridict =veridict+` at ${i}`;
        break;
      }
    }
    const who =req.user.userId;
    const problemAttempts =await Problem.findByPk(problemId,{attributes :['attempts']});
    const userdata =await User.findByPk(who,{attributes :['totalsubmissions','userId']});
    let z=0;
    let attepmtonproblembyuser=0;
    const structforpk3=problemId+`${userdata.dataValues.userId}`;
    while(z!=null){
      attepmtonproblembyuser+=1;
      z=await Pk3submission.findByPk(structforpk3+`${attepmtonproblembyuser}`);
      // console.log(z);
      // console.log("Upr data hai");
    }
    const userAttemptOnProblemId=attepmtonproblembyuser;
  
    const when =new Date();
    const official=true;
    const Submissionid=problemId+`${problemAttempts.dataValues.attempts+1}`;
    const newSubmission = await Submission.create({
      Submissionid,
      when,
      who,
      problemId,
      veridict,
      solution,
      official
  });
  const userId=who;
  const pk1=problemId+`${problemAttempts.dataValues.attempts+1}`;
  // console.log(`i m pk1 ${pk1}`)
  const Usertoupdate = await User.findByPk(userId);
  const Prbolemtoupdate = await Problem.findByPk(problemId);
  await Usertoupdate.increment('totalsubmissions');
  await Prbolemtoupdate.increment('attempts');
  const pk2=`${userdata.dataValues.userId}`+`${userdata.dataValues.totalsubmissions+1}`;
  const pk3=problemId+`${userdata.dataValues.userId}`+`${userAttemptOnProblemId}`;
  const newEntryInPk1 = await Pk1submission.create({
    pk1,
    Submissionid
  });
  
  const newEntryInPk2 = await Pk2submission.create({
    Submissionid,
    pk2
  });
  const newEntryInPk3 = await Pk3submission.create({
    Submissionid,
    pk3
  });
  
  
    // console.log(newSubmission.dataValues);
      return res.status(201).json({"veridict":veridict,"testcase": i});
    } catch (error) {
      // console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
module.exports={
    processSubmission
};