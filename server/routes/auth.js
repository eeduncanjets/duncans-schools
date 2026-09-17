const router=require("express").Router();
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const db=require("../db/pool");

const tokenFor=u=>jwt.sign({id:u.id,name:u.name,email:u.email,role:u.role},process.env.JWT_SECRET,{expiresIn:"7d"});

router.post("/register",async(req,res)=>{
  try{
    const {name,email,password}=req.body;
    if(!name||!email||!password||password.length<6) return res.status(400).json({error:"Name, email and a 6+ character password are required"});
    const [exists]=await db.query("SELECT id FROM users WHERE email=?",[email.toLowerCase()]);
    if(exists.length) return res.status(409).json({error:"Email already registered"});
    const hash=await bcrypt.hash(password,12);
    const [r]=await db.query("INSERT INTO users(name,email,password_hash) VALUES(?,?,?)",[name,email.toLowerCase(),hash]);
    const user={id:r.insertId,name,email:email.toLowerCase(),role:"student"};
    res.json({token:tokenFor(user),user});
  }catch(e){console.error(e);res.status(500).json({error:"Registration failed"});}
});
router.post("/login",async(req,res)=>{
  try{
    const {email,password}=req.body;
    const [rows]=await db.query("SELECT * FROM users WHERE email=?",[String(email||"").toLowerCase()]);
    if(!rows.length || !(await bcrypt.compare(password||"",rows[0].password_hash))) return res.status(401).json({error:"Invalid email or password"});
    const u=rows[0];
    res.json({token:tokenFor(u),user:{id:u.id,name:u.name,email:u.email,role:u.role,xp:u.xp,streak:u.streak}});
  }catch(e){res.status(500).json({error:"Login failed"});}
});
module.exports=router;
