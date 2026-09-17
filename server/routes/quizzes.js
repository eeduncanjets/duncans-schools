const router=require("express").Router();
const db=require("../db/pool");
const {auth}=require("../middleware/auth");

router.get("/:quizId",auth,async(req,res)=>{
  const [q]=await db.query("SELECT id,title,course_id FROM quizzes WHERE id=?",[req.params.quizId]);
  if(!q.length)return res.status(404).json({error:"Quiz not found"});
  const [questions]=await db.query("SELECT id,question,options_json FROM quiz_questions WHERE quiz_id=? ORDER BY id",[req.params.quizId]);
  res.json({...q[0],questions:questions.map(x=>({...x,options:JSON.parse(x.options_json)}))});
});
router.post("/:quizId/submit",auth,async(req,res)=>{
  const [questions]=await db.query("SELECT * FROM quiz_questions WHERE quiz_id=? ORDER BY id",[req.params.quizId]);
  let score=0;
  questions.forEach((q,i)=>{if(Number(req.body.answers?.[i])===q.answer_index)score++;});
  await db.query("INSERT INTO quiz_attempts(user_id,quiz_id,score,total) VALUES(?,?,?,?)",[req.user.id,req.params.quizId,score,questions.length]);
  if(questions.length && score/questions.length>=.8) await db.query(
    "INSERT IGNORE INTO user_achievements(user_id,achievement_id) SELECT ?,id FROM achievements WHERE slug='quiz-master'",[req.user.id]);
  res.json({score,total:questions.length,percent:questions.length?Math.round(score/questions.length*100):0});
});
module.exports=router;
