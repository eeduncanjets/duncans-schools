CREATE DATABASE IF NOT EXISTS duncans_schools CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE duncans_schools;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student','instructor','admin') NOT NULL DEFAULT 'student',
  xp INT NOT NULL DEFAULT 0,
  streak INT NOT NULL DEFAULT 0,
  bio TEXT,
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(160) NOT NULL UNIQUE,
  title VARCHAR(180) NOT NULL,
  category VARCHAR(100) NOT NULL,
  level VARCHAR(60) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(30) DEFAULT '⌘',
  featured TINYINT(1) DEFAULT 0,
  published TINYINT(1) DEFAULT 1,
  duration VARCHAR(80),
  prerequisites TEXT,
  overview LONGTEXT,
  skills_json JSON,
  tools_json JSON,
  guide_json JSON,
  projects_json JSON,
  outcomes_json JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lessons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT,
  content LONGTEXT,
  code_language VARCHAR(30),
  starter_code LONGTEXT,
  xp INT NOT NULL DEFAULT 50,
  lesson_order INT NOT NULL,
  FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  progress DECIMAL(5,2) NOT NULL DEFAULT 0,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_enrollment(user_id, course_id),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS completions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  lesson_id INT NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_completion(user_id, lesson_id),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  title VARCHAR(180) NOT NULL,
  FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id INT NOT NULL,
  question TEXT NOT NULL,
  options_json JSON NOT NULL,
  answer_index INT NOT NULL,
  explanation TEXT,
  FOREIGN KEY(quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  quiz_id INT NOT NULL,
  score INT NOT NULL,
  total INT NOT NULL,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(150) NOT NULL,
  description VARCHAR(255) NOT NULL,
  icon VARCHAR(30) NOT NULL,
  xp_reward INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id INT NOT NULL,
  achievement_id INT NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(user_id, achievement_id),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO courses (slug,title,category,level,description,icon,featured) VALUES
('full-stack','Full-Stack Engineering','Development','Pro Path','Build production web apps from interface to database and API.','</>',1),
('python','Python Engineering','Development','Core','Python fundamentals, algorithms, automation and backend engineering.','🐍',1),
('ai-engineering','AI Engineering','AI & Data','Advanced','Machine learning, neural networks, model APIs and responsible AI.','✦',1),
('cybersecurity','Cybersecurity','Security','Pro Path','Defensive security, web security, networks, identity and secure coding.','⌁',1),
('cloud-devops','Cloud & DevOps','Cloud','Advanced','Linux, containers, CI/CD, cloud architecture and observability.','☁',0),
('data-science','Data Science','AI & Data','Core','Statistics, data cleaning, visualization and predictive analytics.','◉',0),
('iot-robotics','IoT & Robotics','Hardware','Advanced','Microcontrollers, sensors, protocols and robotics systems.','⚙',0),
('mobile','Mobile Engineering','Development','Core','Modern mobile apps, APIs, storage and deployment.','▣',0),
('web3','Blockchain & Web3','Emerging','Explorer','Blockchain concepts, smart contracts, wallets and decentralized apps.','◇',0),
('uiux','UI/UX & Creative Tech','Design','All Levels','Human-centered design, prototypes, design systems and creative code.','✎',0),
('game-3d','Game & 3D Development','Development','Advanced','Game loops, physics, shaders, 3D scenes and interactive experiences.','◈',0),
('networking','Network Engineering','Hardware','Pro Path','TCP/IP, routing, switching, troubleshooting and network security.','⌘',0);

INSERT IGNORE INTO achievements (slug,title,description,icon,xp_reward) VALUES
('first-step','First Step','Complete your first lesson.','🚀',50),
('quiz-master','Quiz Master','Score 80% or higher on a quiz.','🏆',100),
('course-finisher','Course Finisher','Reach 100% in a course.','🎓',250),
('streak-7','7 Day Streak','Learn for seven consecutive days.','🔥',200),
('xp-1000','1K XP','Reach 1,000 total XP.','⚡',150);
