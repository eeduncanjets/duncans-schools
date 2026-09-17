const router=require("express").Router();
const db=require("../db/pool");
const {auth,role}=require("../middleware/auth");

router.use(auth,role("admin","instructor"));
router.get("/overview",async(req,res)=>{
  const [[users]]=await db.query("SELECT COUNT(*) n FROM users");
  const [[courses]]=await db.query("SELECT COUNT(*) n FROM courses");
  const [[enrollments]]=await db.query("SELECT COUNT(*) n FROM enrollments");
  const [[attempts]]=await db.query("SELECT COUNT(*) n FROM quiz_attempts");
  res.json({users:users.n,courses:courses.n,enrollments:enrollments.n,attempts:attempts.n});
});
router.get("/users",async(req,res)=>{
  const [rows]=await db.query("SELECT id,name,email,role,xp,streak,created_at FROM users ORDER BY created_at DESC LIMIT 100");
  res.json(rows);
});
router.post("/announcements",async(req,res)=>{
  const {title,body}=req.body;
  if(!title||!body)return res.status(400).json({error:"Title and body required"});
  await db.query("INSERT INTO announcements(title,body) VALUES(?,?)",[title,body]);
  res.json({ok:true});
});
module.exports=router;
