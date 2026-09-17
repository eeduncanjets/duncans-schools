const router=require("express").Router();
const db=require("../db/pool");
const {auth}=require("../middleware/auth");

router.get("/",auth,async(req,res)=>{
  const [[user]]=await db.query("SELECT id,name,email,role,xp,streak,bio,created_at FROM users WHERE id=?",[req.user.id]);
  const [courses]=await db.query(`SELECT c.id,c.title,c.category,c.level,e.progress,e.enrolled_at
    FROM enrollments e JOIN courses c ON c.id=e.course_id WHERE e.user_id=? ORDER BY e.enrolled_at DESC`,[req.user.id]);
  const [[done]]=await db.query("SELECT COUNT(*) n FROM completions WHERE user_id=?",[req.user.id]);
  const [achievements]=await db.query(`SELECT a.title,a.description,a.icon,ua.earned_at FROM user_achievements ua
    JOIN achievements a ON a.id=ua.achievement_id WHERE ua.user_id=? ORDER BY ua.earned_at DESC`,[req.user.id]);
  const [attempts]=await db.query(`SELECT q.title,qa.score,qa.total,qa.attempted_at FROM quiz_attempts qa JOIN quizzes q ON q.id=qa.quiz_id
    WHERE qa.user_id=? ORDER BY qa.attempted_at DESC LIMIT 10`,[req.user.id]);
  res.json({user,level:Math.floor(user.xp/500)+1,completedLessons:done.n,courses,achievements,attempts});
});
module.exports=router;
