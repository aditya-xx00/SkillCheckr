import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from "path"
import 'dotenv/config' 


const secret = process.env.JWT_SECRET;

const app= express();

const port = process.env.PORT || 5000;

const _dirname=path.resolve();

app.use(cors());
app.use(express.json()); 


mongoose
  .connect(process.env.MONGODB_URI,)
.then(() => console.log('MongoDB connected'))
 .catch(err => console.error('MongoDB connection error:', err));

 const questionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    answer: String,
    category: String
 });


 const Question = mongoose.model('Question', questionSchema);
  
 app.post('/add-question', async (req, res) => {
    const { question, options, answer, category } = req.body;
    const newQuestion = new Question({ question, options, answer, category });
    await newQuestion.save();
    res.send('Question added successfully');
 });

const userSchema=new mongoose.Schema({
   username:{type:String,unique:true},
   password:String
})

 const User=mongoose.model('User',userSchema)

 app.post('/register',async (req,res)=>{
    const{username,password}=req.body
    try{
        const newUser=new User({username,password})
        await newUser.save();
        res.send('User registered')
    }catch(error){
      //   console.error('Register Failed',error)
      //   res.status(500).send('Error registering User')
       console.error('Register Failed', error);
    if (error.code === 11000) { // Duplicate username error in MongoDB
        return res.status(400).json({ message: 'Username already registered!' });
    }
    res.status(500).json({ message: 'Error registering user' });
    }
 })

 app.post('/login',async(req,res)=>{
    const{username,password}=req.body;
    try{
      const user=await User.findOne({username})
      if(!user){
   return res.status(401).json({ message: "User not registered" });
}
if(user.password !== password){
   return res.status(401).json({ message: "Incorrect password" });
}
      const token=jwt.sign({userId:user._id},secret,{expiresIn:'1h'});
      res.json({token})
    }catch(error){
         console.error('Login error',error)
         // res.status(500).send('Error loggin in')
         res.status(500).json({ message: 'Error logging in' });
    }
 })

 //category ke according data ko fetch karne ke liye joki frontend se aayega
app.get('/questions/:category', async (req, res) => {
    const { category } = req.params;
    const questions = await Question.find({ category });
    res.json(questions);
 });

 app.get('/questions', async(req,res)=>{
   const questions=await Question.find()
   res.json(questions)
  })

 app.get('/categories', async (req, res) => {
    const categories = await Question.distinct('category')
    res.json(categories)
 })

 const progressSchema=new mongoose.Schema({
   userId:mongoose.Schema.Types.ObjectId,
   category:String,
   correctAnswers:Number,
   wrongAnswers:Number
 })

const Progress=mongoose.model('Progress',progressSchema)

const authenticate=(req,res,next)=>{
   const token=req.headers.authorization?.split(' ')[1]
   if(token){
      jwt.verify(token,secret,(err,decoded)=>{
         if(err){
            return res.status(401).send('Invalid Token')
         }else{
            req.userId=decoded.userId
            next()
         }
      }) 
   }else{
         res.status(401).send('Access Denied')
      }
} 

 app.post('/save-progress', authenticate ,async(req,res)=>{
    const {category,correctAnswers,wrongAnswers}=req.body;
    const progress=new Progress({
         userId:req.userId,
         category,
         correctAnswers,
         wrongAnswers 
    })
     await progress.save()
     res.send('Progress saved')
 })

 app.get('/progress',authenticate,async(req,res)=>{
    const progress=await Progress.find({userId:req.userId})
    res.json(progress)
 })

 // Example backend route (add to your server.js)
app.delete('/progress', authenticate, async (req, res) => {
  await Progress.deleteMany({ userId: req.userId });
  res.send('All progress deleted');
});

app.use(express.static(path.join(_dirname, 'app', 'dist')));

app.get('/*splat', (_, res) => {
  res.sendFile(path.resolve(_dirname, 'app', 'dist', 'index.html'));
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});