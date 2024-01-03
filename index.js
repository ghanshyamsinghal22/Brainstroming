const express = require('express')
const app = express()
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser')
const cors = require('cors');
const secretKey = 'your_secret_key';
const Sequelize =require('sequelize');
let totalconteststillnow =0;
const Submission=require('./model/submission')
const TestCase=require('./model/testcase');
const Problem =require('./model/problem');
const UnpublishedProblem =require('./model/unpublishedProblems');
const Pk1submission =require('./model/pk1submissionid');
const Pk2submission =require('./model/pk2submissionid');
const Pk3submission =require('./model/pk3submissionid');
const User =require('./model/user');
// const Admin =require('./model/Admin');
const Contests =require('./model/contest');
const Contestsdata =require('./model/Contestsdata');
const  ContestsOfUser=require('./model/contestsOfUser');
const Contestinprogress =require('./model/contestinprogress');
const emergency =require('./model/emergency');
// const PublishedProblem=require('./model/publishedProblem');

// External functions defined in other files so that code looks good
const funcSubmit=require('./fun/submission');
const funcCreateUser =require('./fun/createuser');
const funcCreateProblem =require('./fun/createproblem');
const createProblem=funcCreateProblem.createProblem;
const createUser=funcCreateUser.createUser;
const processSubmission=funcSubmit.processSubmission;
const func =require('./fun/testcCppCode');
const rankContstants =require('./fun/./rankcontestnats');
const startrating =require('./fun/startgivingratings');
// This function is used to verify token

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token is invalid' });
    }

    req.user = decoded;
    next();
  });
}

// This is to integrate with backend
app.use(cors({
  origin: 'http://localhost:3001', // Replace with your frontend's domain
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
// I m using bogyParses as middleware but can also use express.json
app.use(bodyParser.json())

/*
  all these below sync functions are used to create a table if it does not exist
  and all are kept in bracket just to short the code from side arrow 
*/

// This block of code below is to create models in sql database as we are using Sequelizer 
{Submission.sync();
Problem.sync();
TestCase.sync();
Pk1submission.sync();
Pk2submission.sync();
Pk3submission.sync();
User.sync();
Contests.sync();
ContestsOfUser.sync();
Contestinprogress.sync();
Contestsdata.sync();
emergency.sync();
// PublishedProblem.sync();
UnpublishedProblem.sync();
}

/*
 this is just for demo 
*/
app.get('/', function (req, res) {
  res.send('Hello World')
});

// /*
// This api is used to signup 
// */

app.post('/signup', async (req, res) => {
  try {
    const userId = req.body.userId;
    const emailid = req.body.emailid;
    const password = req.body.password;
    // const role = req.body.role;
    const userWithSameUserId= await User.findByPk(userId);
    const userWithSameEmailId= await User.findOne({
      where: {
        emailid: emailid,
      },
    });
    if(userWithSameEmailId){
      return res.json({"error":"email id already in use"});
    }
    if(userWithSameUserId){
      return res.json({"error":"userid already in use"});
    }
    const newUser = await User.create({
      userId,
      emailid,
      password,
      // role
  });
  // console.log(newUser);
    return res.status(201).json(newUser);
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// /*
// This api is used to signin 
// */

app.get('/login',async (req, res) => {
  const  userId = req.body.userId;
  const  password = req.body.password;
  const  role = req.body.role;

  if (!userId || !password) {
    return res.status(401).json({ message: 'Username and password are required' });
  }
  const userDataValues = await User.findByPk(userId);
  console.log(password);
  if(userDataValues===null||userDataValues.dataValues===null){
    return res.send({"message":"There is no user with such userId"});
  }
  const userData =userDataValues.dataValues;
  console.log(userData.password);
  if(role!==userData.role){
    return res.send({"message":"your role is incorrext"});
  }
  if (userData.password === password) {
    const token = jwt.sign({ userId ,role}, secretKey, { expiresIn: '4h' });
    return res.json({ token });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

/*
This api is for sign out
*/

app.post('/logout', (req, res) => {
  const token = req.headers['authorization'];

  if (token) {
    tokenBlacklist.push(token);
    res.json({ message: 'Token has been revoked' });
  } else {
    res.status(400).json({ message: 'Token not provided' });
  }
});

// /*
// This api is used to submit the sollutions 
// # Only c++ sollutions are accepted
// */

app.post('/submit',verifyToken, async (req, res) => {
  const resp=processSubmission(req,res);
  return resp;
});

/*
 admin or problem creators can submit there problems using this api 
 Later that admins can monitor these problems are they good or not
*/

app.post('/createproblem',verifyToken, async (req, res) => {
  if(req.user.role!='admin'){
    return res.json({"message":"you are not authorised"});
  }
  return createProblem(req,res);
});


app.put('/updatequestion',verifyToken,async (req,res) => {
  if(req.user.role!='admin'){
    return res.json({"message":"you are not authorised"});
  }
  try {
    const problemName = req.body.problemName;
    const problemid = req.body.problemid;
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

    const newProblem = await UnpublishedProblem.update({
      problemName,
      problemid,
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
  },{where :{problemid :req.body.problemid}});
  console.log(newProblem);
    return res.status(201).json(newProblem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// /*
// This api is used to fetch the unpublished problems for admins o create a contest
// */

app.get('/unpublishedproblems',verifyToken, async (req, res) => {
  if(req.user.role!='admin'){
    return res.json({"message":"you are not authorised"});
  }
  try {
    const allProblems = await UnpublishedProblem.findAll({});
    console.log(allProblems)
    return res.send(allProblems);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// /*
// This api is used to save testcases 
// ->this api first test the test cases on sollution uploaded during creating problem
// */

app.post('/testCase/:problemId',verifyToken, async (req, res) => {
  if(req.user.role!='admin'){
    return res.json({"message":"you are not authorised"});
  }
  try {
    const input = req.body.input;
    const output = req.body.output;
    const problemId = req.params.problemId;
    const data=await UnpublishedProblem.findByPk(problemId,{ attributes: ['testCases','solution','timeLimit']});
    const code =data.dataValues.solution;
    // console.log(code);
  const result = func.testCppCode(code,input,output,data.dataValues.timeLimit*1000);
  const testCases =data.dataValues.testCases+1;
  const testid=problemId+'$'+`${testCases}`;
  if(result==="Accepted"){
  const newTestCase = await TestCase.create({
    testid,
    input,
    output
});
const row = await UnpublishedProblem.findByPk(problemId);
await row.increment('testCases');
  console.log(newTestCase.dataValues);
}else{
    console.log(result);
  }
    return res.status(201).json({"ok":result});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// /*
// This api is used to fetch the submissions of a user
// */


//get apis to get submissions of particular users and particular problems

app.get('/submissions/:userId' ,async(req,res) =>{
  const userId=req.params.userId;
  console.log(userId);
  let totalsubmissions = await User.findByPk(userId,{attributes:['totalsubmissions']});
  totalsubmissions=totalsubmissions.dataValues.totalsubmissions;
  console.log(totalsubmissions);
  let userSubmissions =[];
  for(let i=totalsubmissions;i>0;i--){
    const result1 = await Pk2submission.findByPk(userid+`${i}`,{attributes :['Submissionid']});
    const result2 = await Submission.findByPk(result1.dataValues.Submissionid);
    userSubmissions.push(result2.dataValues);
  }
  return res.send(userSubmissions);
});

// /*
// This api is used to fetch the submissions of a problem by a particular user
// */

app.get('/mysubmissions/problemset/:problemid',verifyToken,async(req,res) =>{
  const userid=req.user.userId;
  const problemid =req.params.problemid;
  console.log(userid);
  console.log(problemid);
  let userSubmissions =[];
  let i=1;
  while(true){
    const result1 = await Pk3submission.findByPk(problemid+userid+`${i}`,{attributes :['Submissionid']});
    if(result1===null){
      break;
    }
    const result2 = await Submission.findByPk(result1.dataValues.Submissionid);
    
    i++;
    userSubmissions.push(result2.dataValues);
  }
  return res.send(userSubmissions);
});

// /*
// This api is used to fetch the submissions of a problem
// */

app.get('/problemset/submissions/:problemid' ,async(req,res) =>{
  const problemid=req.params.problemid;
  console.log(problemid);
  let totalsubmissions = await Problem.findByPk(problemid,{attributes:['attempts']});
  totalsubmissions=totalsubmissions.dataValues.attempts;
  console.log(totalsubmissions);
  let userSubmissions =[];
  for(let i=totalsubmissions;i>0;i--){
    const result1 = await Submission.findByPk(problemid+`${i}`);
    // const result2 = await Submission.findByPk(result1.dataValues.Submissionid);
    userSubmissions.push(result1.dataValues);
  }
  return res.send(userSubmissions);
});

// /*
//  get published problems
// */

app.get('/problems', async (req, res) => {
  console.log(req.user);
  try {
    const allProblems = await Problem.findAll({});
    console.log(allProblems)
    return res.send(allProblems);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


//------------------     below code is related to contest organization     ------------------\\


// /*
// publish contest
// */

app.put('/selectproblemsforcontest/:contestid', async (req, res) => {
  try{
  const orderofproblemids=req.body.orderofproblemids;
  const orderofproblemnum=req.body.orderofproblemnum;
  const contestid=req.params.contestid;
  let i=0;
  for(i=0;i<orderofproblemids.length;i++){
    console.log(orderofproblemids);
    let problem = await UnpublishedProblem.findByPk(orderofproblemids[i]);
    problem.dataValues.contestid=contestid;
    problem.problemnum=orderofproblemnum[i];
    console.log(problem);
    const updatedproblem = await UnpublishedProblem.update(problem.dataValues, {
      where: { problemid : orderofproblemids[i]},
    })
    console.log(updatedproblem);
  }
   return res.status(201).json("updatedproblem");
  }catch(error){
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// /*
// publishcontest
// */

app.post('/scheduleacontest',verifyToken,async (req,res) => {
  if(req.user.role!='admin'){
    return res.json({"message":"you are not authorised"});
  }
  console.log(req.body)
  try{
  totalconteststillnow++;
  const contestName =req.body.contestName;
  const numberOfQuestions =req.body.numberOfQuestions;
  const date =req.body.date;
  const time =req.body.time;
  const contestId =req.body.contestId;
    const newContest =await Contestsdata.create({
      contestId,
      contestName,
      numberOfQuestions,
      date,
      time}
    );
    return res.status(201).json(newContest);
  }catch(error){
    console.log(error);
    return res.status(501).json(error);
  }
});

/*
toupdate informations regarding contest
*/

app.put('/scheduleacontest',verifyToken,async (req,res) => {
  if(req.user.role!='admin'){
    return res.json({"message":"you are not authorised"});
  }
  console.log(req.body)
  try{
  const contestName =req.body.contestName;
  const numberOfQuestions =req.body.numberOfQuestions;
  const date =req.body.date;
  const time =req.body.time;
  const contestId =req.body.contestId;
    const newContest =await Contestsdata.update({
      contestName,
      numberOfQuestions,
      date,
      time},{where : { contestId: contestId }}
    );
    return res.status(201).json(newContest);
  }catch(error){
    console.log(error);
    return res.status(501).json(error);
  }
});

/*
to get list of upcoming contests
*/

app.get('/Calendar',async (req,res)=>{
  try{
    const currentdate =new Date;
    const unpublishedQuestions=await Contestsdata.findAll({
      where:{
      date: {
        [Sequelize.gt]: currentdate,
      }}
    });
    if(unpublishedQuestions[0]){
    console.log(typeof  unpublishedQuestions[0].dataValues.date);}
    res.send(unpublishedQuestions);
  }catch(error){
    console.log(error);
    return res.status(501).json({error : "Internal server error"});
  }
});

app.get('contest/:contestid',async(req,res)=>{
  try {
    const contestid =req.params.contestid;
    const contestdata= await Contestsdata.findByPk(contestid);
    if(contestdata==null||contestdata.dataValues==null){
      return res.send("no such contest");
    }
    let contesttime =contestdata.dataValues.date;
    const currentdate =new Date();
    if(contesttime>currentdate){
      return res.send("shuru to hone de bhai/bhen contest");
    }
    
    let allProblems=[];
    let totalpoblems=contestdata.numberOfQuestions;
    let x=1;
    for(i=0;i<totalpoblems;i++){
      let problemid=contestid+x;
    let problem = await Problem.findByPk(problemid);
    allProblems.push(problem.dataValues);
    x++;
  }
    console.log(allProblems)
    return res.send(allProblems);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('contest/:contestid/problem/:problemnumber',async(req,res)=>{
  try {
    const contestid =req.params.contestid;
    const contestdateandtime= await Contestsdata.findByPk(contestid);
    let contesttime =contestdateandtime.dataValues.date;
    const currentdate =new Date();
    if(contesttime>currentdate){
      return res.send("shuru to hone de bhai/bhen contest");
    }
    const problemnumber =req.params.problemnumber;
    const problemid = contestid+problemnumber;
    const problem = await UnpublishedProblem.findByPk(problemid);
    console.log(problem)
    return res.send(problem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/standings/:contestid/page/:pageno',async(req,res)=>{
  const contestid =req.params.contestid;
  let pageno=req.params.pageno;
  const contestdata= await Contestsdata.findByPk(contestid);
  contestdata=contestdata.dataValues;
  const maxrank = contestdata.actualNumberOfParticipants;
  let contesttime =contestdata.date;
  const currentdate =new Date();
  if(contesttime>currentdate){
    return res.send("shuru to hone de bhai/bhen contest");
  }
  let standings;
  if(pageno<1){
    pageno=1;
  }
  let rank =(pageno-1)*200;
  let maxrankonpageno;
  if(max>=rank+200){
    maxrankonpageno=rank+200;
  }else{
    maxrankonpageno=maxrank;
  }
  for(let i=rank+1 ;i<maxrank+1;i++){
    const dd= await Contests.findByPk(contestid+'$'+rank);
    standings.push(dd);
  }
  return res.send(standings);
})
app.put('/managestandings',verifyToken,async (req,res)=>{
  if(req.user.role!='admin'){
    return res.json({"message":"you are not authorised"});
  }
  rankContstants();
  return {"message":"reranked Successfully"};
})
app.put('/ratecontestants',verifyToken,async (req,res)=>{
  if(req.user.role!='admin'){
    return res.json({"message":"you are not authorised"});
  }
  startrating();
  return {"message":"ratings given  Successfully"};
})
app.listen(3000);