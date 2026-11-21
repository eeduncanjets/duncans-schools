const CHEATS = {
  "Java": [
    [
      "public class Main { public static void main(String[] args) { } }",
      "Program entry point"
    ],
    [
      "int age = 18;",
      "Declare an integer"
    ],
    [
      "String name = \"Duncan\";",
      "Declare a string"
    ],
    [
      "if (score >= 50) { } else { }",
      "Conditional"
    ],
    [
      "for (int i = 0; i < 5; i++) { }",
      "Counted loop"
    ],
    [
      "for (String item : items) { }",
      "Enhanced for loop"
    ],
    [
      "static int add(int a, int b) { return a + b; }",
      "Method"
    ],
    [
      "ArrayList<String> names = new ArrayList<>();",
      "Resizable list"
    ],
    [
      "Map<String, Integer> scores = new HashMap<>();",
      "Key/value map"
    ],
    [
      "try { risky(); } catch (Exception e) { }",
      "Exception handling"
    ],
    [
      "Files.readString(Path.of(\"data.txt\"));",
      "Read a text file (Java 11+)"
    ],
    [
      "record User(int id, String name) {}",
      "Compact data carrier (Java 16+)"
    ]
  ],
  "C++": [
    [
      "#include <iostream>\nint main() { std::cout << \"Hello\"; }",
      "Basic program"
    ],
    [
      "std::string name = \"Duncan\";",
      "String"
    ],
    [
      "std::vector<int> nums{1, 2, 3};",
      "Dynamic array"
    ],
    [
      "for (const auto& n : nums) { }",
      "Range-based loop"
    ],
    [
      "int add(int a, int b) { return a + b; }",
      "Function"
    ],
    [
      "auto value = std::make_unique<int>(5);",
      "Unique ownership"
    ],
    [
      "std::unordered_map<std::string, int> counts;",
      "Hash map"
    ],
    [
      "try { } catch (const std::exception& e) { }",
      "Exception handling"
    ],
    [
      "std::sort(v.begin(), v.end());",
      "Sort a vector"
    ],
    [
      "const int* ptr = &value;",
      "Pointer to const int"
    ],
    [
      "template <typename T> T larger(T a,T b){return a>b?a:b;}",
      "Function template"
    ]
  ],
  "PHP": [
    [
      "<?php\necho \"Hello\";",
      "PHP opening and output"
    ],
    [
      "$name = \"Duncan\";",
      "Variable"
    ],
    [
      "function add(int $a, int $b): int { return $a + $b; }",
      "Typed function"
    ],
    [
      "if ($score >= 50) { } else { }",
      "Conditional"
    ],
    [
      "foreach ($items as $item) { }",
      "Loop"
    ],
    [
      "$names = [\"Ama\", \"Kojo\"];",
      "Indexed array"
    ],
    [
      "$user = [\"name\" => \"Ama\"];",
      "Associative array"
    ],
    [
      "filter_var($email, FILTER_VALIDATE_EMAIL);",
      "Validate email"
    ],
    [
      "password_hash($password, PASSWORD_DEFAULT);",
      "Hash password"
    ],
    [
      "password_verify($password, $hash);",
      "Verify password"
    ],
    [
      "$stmt = $pdo->prepare(\"SELECT * FROM users WHERE id = ?\");\n$stmt->execute([$id]);",
      "PDO prepared query"
    ],
    [
      "header(\"Content-Type: application/json\");\necho json_encode($data);",
      "Return JSON"
    ]
  ],
  "Bootstrap": [
    [
      "<div class=\"container\">...</div>",
      "Responsive fixed-width container"
    ],
    [
      "<div class=\"container-fluid\">...</div>",
      "Full-width container"
    ],
    [
      "<div class=\"row g-3\">...</div>",
      "Grid row with gutters"
    ],
    [
      "<div class=\"col-12 col-md-6\">...</div>",
      "Responsive half-width column"
    ],
    [
      "<button class=\"btn btn-primary\">Save</button>",
      "Primary button"
    ],
    [
      "<div class=\"card\"><div class=\"card-body\">...</div></div>",
      "Card"
    ],
    [
      "<nav class=\"navbar navbar-expand-lg\">...</nav>",
      "Responsive navbar"
    ],
    [
      "<div class=\"alert alert-success\" role=\"alert\">Saved</div>",
      "Accessible alert"
    ],
    [
      "<span class=\"badge text-bg-info\">New</span>",
      "Badge"
    ],
    [
      "<div class=\"d-flex justify-content-between align-items-center\">...</div>",
      "Flex alignment"
    ],
    [
      "<div class=\"row row-cols-1 row-cols-md-3 g-3\">...</div>",
      "Responsive card columns"
    ],
    [
      "<button class=\"btn btn-outline-secondary btn-sm\">Cancel</button>",
      "Outline small button"
    ]
  ],
  "Node.js": [
    [
      "const http = require(\"node:http\");",
      "Import built-in HTTP"
    ],
    [
      "const server = http.createServer((req,res) => {});",
      "Create HTTP server"
    ],
    [
      "server.listen(3000);",
      "Listen on port"
    ],
    [
      "const fs = require(\"node:fs/promises\");",
      "Promise-based file system"
    ],
    [
      "const data = await fs.readFile(\"data.txt\", \"utf8\");",
      "Read file asynchronously"
    ],
    [
      "const path = require(\"node:path\");",
      "Path utilities"
    ],
    [
      "process.env.PORT || 3000",
      "Environment configuration"
    ],
    [
      "app.use(express.json());",
      "Parse JSON request bodies"
    ],
    [
      "res.status(201).json(record);",
      "Send created resource"
    ],
    [
      "const { id } = req.params;",
      "Read route parameter"
    ],
    [
      "module.exports = router;",
      "Export module (CommonJS)"
    ],
    [
      "export default app;",
      "Export module (ESM)"
    ]
  ],
  "TypeScript": [
    [
      "let username: string = \"Ama\";",
      "Typed variable"
    ],
    [
      "type ID = string | number;",
      "Union type alias"
    ],
    [
      "interface User { id: number; name: string; }",
      "Interface"
    ],
    [
      "function greet(name: string): string { return `Hi ${name}`; }",
      "Typed function"
    ],
    [
      "const scores: number[] = [70, 85];",
      "Typed array"
    ],
    [
      "type Status = \"idle\" | \"loading\" | \"done\";",
      "Literal union"
    ],
    [
      "function first<T>(items: T[]): T | undefined { return items[0]; }",
      "Generic function"
    ],
    [
      "const user = { id: 1, name: \"Ama\" } satisfies User;",
      "Validate shape with satisfies"
    ],
    [
      "async function load(): Promise<User[]> { return []; }",
      "Async return type"
    ],
    [
      "try { } catch (error: unknown) { }",
      "Safe catch type"
    ],
    [
      "type PartialUser = Partial<User>;",
      "Utility type"
    ],
    [
      "type UserName = Pick<User, \"name\">;",
      "Pick selected properties"
    ]
  ],
  "AWS": [
    [
      "aws s3 ls",
      "List S3 buckets"
    ],
    [
      "aws s3 cp site/ s3://bucket-name/ --recursive",
      "Upload static files"
    ],
    [
      "aws s3 sync dist/ s3://bucket-name/ --delete",
      "Sync build output (review delete first)"
    ],
    [
      "aws sts get-caller-identity",
      "Check active AWS identity"
    ],
    [
      "aws configure list",
      "Inspect configured CLI profile"
    ],
    [
      "aws ec2 describe-instances",
      "List EC2 instances"
    ],
    [
      "aws lambda list-functions",
      "List Lambda functions"
    ],
    [
      "aws cloudformation list-stacks",
      "List CloudFormation stacks"
    ],
    [
      "aws logs tail /aws/lambda/function-name --follow",
      "Follow CloudWatch logs"
    ],
    [
      "aws s3api get-bucket-encryption --bucket bucket-name",
      "Check S3 encryption"
    ],
    [
      "aws iam get-account-summary",
      "View IAM account summary"
    ],
    [
      "aws cloudfront create-invalidation --distribution-id DIST_ID --paths \"/*\"",
      "Invalidate CloudFront cache"
    ]
  ],
  "HTML": [
    [
      "<!doctype html>",
      "HTML5 document declaration"
    ],
    [
      "<html lang=\"en\">...</html>",
      "Set document language"
    ],
    [
      "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
      "Mobile viewport"
    ],
    [
      "<main id=\"main\">...</main>",
      "Main landmark"
    ],
    [
      "<nav aria-label=\"Main navigation\">...</nav>",
      "Named navigation landmark"
    ],
    [
      "<label for=\"email\">Email</label><input id=\"email\" type=\"email\">",
      "Accessible labelled input"
    ],
    [
      "<button type=\"submit\">Send</button>",
      "Submit button"
    ],
    [
      "<a href=\"/courses\">Courses</a>",
      "Link to a page"
    ],
    [
      "<img src=\"photo.webp\" alt=\"Description\">",
      "Image with alternative text"
    ],
    [
      "<details><summary>More</summary>Details</details>",
      "Native disclosure widget"
    ],
    [
      "<table><caption>Scores</caption>...</table>",
      "Accessible table caption"
    ],
    [
      "<script src=\"app.js\" defer></script>",
      "Load deferred script"
    ]
  ],
  "CSS": [
    [
      ":root { --brand: #7057ff; }",
      "CSS custom property"
    ],
    [
      ".card { padding: 1rem; border-radius: 1rem; }",
      "Card styling"
    ],
    [
      "display: flex; gap: 1rem; align-items: center;",
      "Flex layout"
    ],
    [
      "display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr));",
      "Responsive grid"
    ],
    [
      "max-width: 70rem; margin-inline: auto;",
      "Centered container"
    ],
    [
      "@media (max-width: 700px) { .nav { flex-direction: column; } }",
      "Responsive breakpoint"
    ],
    [
      ":focus-visible { outline: 3px solid currentColor; }",
      "Keyboard focus"
    ],
    [
      "box-sizing: border-box;",
      "Predictable sizing"
    ],
    [
      "object-fit: cover; aspect-ratio: 16 / 9;",
      "Image crop and ratio"
    ],
    [
      "transition: transform .2s ease;",
      "Motion transition"
    ],
    [
      "@supports (backdrop-filter: blur(8px)) { }",
      "Feature query"
    ],
    [
      "prefers-reduced-motion: reduce",
      "Respect reduced motion preference"
    ]
  ],
  "Python": [
    [
      "def greet(name: str) -> str: return f\"Hello, {name}\"",
      "Typed function"
    ],
    [
      "for item in items: print(item)",
      "Loop"
    ],
    [
      "[n * 2 for n in numbers]",
      "List comprehension"
    ],
    [
      "{name: len(name) for name in names}",
      "Dictionary comprehension"
    ],
    [
      "with open(\"data.txt\", encoding=\"utf-8\") as file: text = file.read()",
      "Safe file handling"
    ],
    [
      "try:\n    value = int(raw)\nexcept ValueError:\n    value = 0",
      "Handle conversion errors"
    ],
    [
      "from pathlib import Path",
      "Path utilities"
    ],
    [
      "import json\ndata = json.loads(text)",
      "Parse JSON"
    ],
    [
      "from collections import Counter\nCounter(words)",
      "Count values"
    ],
    [
      "if __name__ == \"__main__\":\n    main()",
      "Script entry point"
    ],
    [
      "python -m venv .venv",
      "Create virtual environment"
    ],
    [
      "python -m pip install requests",
      "Install package"
    ]
  ],
  "SQL": [
    [
      "SELECT * FROM learners;",
      "Select all rows"
    ],
    [
      "SELECT name, score FROM learners;",
      "Select columns"
    ],
    [
      "WHERE score >= 50",
      "Filter rows"
    ],
    [
      "ORDER BY score DESC",
      "Sort descending"
    ],
    [
      "LIMIT 10",
      "Limit results"
    ],
    [
      "SELECT country, COUNT(*) FROM learners GROUP BY country;",
      "Aggregate groups"
    ],
    [
      "HAVING COUNT(*) > 5",
      "Filter grouped results"
    ],
    [
      "INNER JOIN courses ON courses.id = enrolments.course_id",
      "Join related rows"
    ],
    [
      "LEFT JOIN enrolments ON enrolments.course_id = courses.id",
      "Keep unmatched left rows"
    ],
    [
      "INSERT INTO courses (title) VALUES ('Python');",
      "Insert row"
    ],
    [
      "UPDATE learners SET active = TRUE WHERE id = 7;",
      "Update selected row"
    ],
    [
      "CREATE INDEX idx_learners_email ON learners(email);",
      "Index a column"
    ]
  ],
  "React": [
    [
      "const [count, setCount] = useState(0);",
      "State hook"
    ],
    [
      "useEffect(() => { document.title = title; }, [title]);",
      "Effect with dependency"
    ],
    [
      "function Button({ label }) { return <button>{label}</button>; }",
      "Component with prop"
    ],
    [
      "<input value={name} onChange={e => setName(e.target.value)} />",
      "Controlled input"
    ],
    [
      "items.map(item => <li key={item.id}>{item.name}</li>)",
      "Render keyed list"
    ],
    [
      "const value = useMemo(() => compute(data), [data]);",
      "Memoize derived value"
    ],
    [
      "const onSave = useCallback(() => save(id), [id]);",
      "Memoize callback"
    ],
    [
      "<form onSubmit={handleSubmit}>...</form>",
      "Form submission"
    ],
    [
      "const ref = useRef(null);",
      "Mutable ref"
    ],
    [
      "if (loading) return <p>Loading…</p>;",
      "Loading state"
    ]
  ],
  "Git": [
    [
      "git status",
      "Working tree status"
    ],
    [
      "git add -p",
      "Stage selected hunks"
    ],
    [
      "git commit -m \"Describe change\"",
      "Commit"
    ],
    [
      "git switch -c feature/name",
      "Create branch"
    ],
    [
      "git log --oneline --graph --decorate",
      "Visual history"
    ],
    [
      "git diff --staged",
      "Review staged changes"
    ],
    [
      "git restore file.txt",
      "Discard unstaged file edits"
    ],
    [
      "git revert COMMIT_SHA",
      "Safely reverse a commit"
    ],
    [
      "git fetch --all --prune",
      "Refresh remote refs"
    ],
    [
      "git pull --rebase",
      "Rebase local work on upstream"
    ],
    [
      "git stash push -m \"work in progress\"",
      "Temporarily shelve changes"
    ]
  ],
  "Linux": [
    [
      "pwd",
      "Print current directory"
    ],
    [
      "ls -lah",
      "List files with details"
    ],
    [
      "find . -name \"*.py\"",
      "Find Python files"
    ],
    [
      "grep -Rni \"TODO\" .",
      "Search text recursively"
    ],
    [
      "chmod 640 secrets.txt",
      "Set file permissions"
    ],
    [
      "ps aux",
      "List processes"
    ],
    [
      "top",
      "Monitor processes"
    ],
    [
      "df -h",
      "Disk space"
    ],
    [
      "du -sh folder/",
      "Folder size"
    ],
    [
      "systemctl status nginx",
      "Service status"
    ],
    [
      "journalctl -u nginx -n 100",
      "Recent service logs"
    ]
  ],
  "Docker": [
    [
      "docker build -t app:local .",
      "Build image"
    ],
    [
      "docker run --rm -p 3000:3000 app:local",
      "Run container"
    ],
    [
      "docker ps -a",
      "List containers"
    ],
    [
      "docker logs -f container_name",
      "Follow logs"
    ],
    [
      "docker compose up -d",
      "Start Compose services"
    ],
    [
      "docker compose down",
      "Stop Compose services"
    ],
    [
      "docker image ls",
      "List images"
    ],
    [
      "docker exec -it container_name sh",
      "Open shell"
    ],
    [
      "docker volume ls",
      "List volumes"
    ],
    [
      ".dockerignore",
      "Exclude files from build context"
    ]
  ],
  "Cybersecurity": [
    [
      "Use Argon2id or bcrypt for password hashing",
      "Password storage"
    ],
    [
      "Enable MFA for privileged accounts",
      "Multi-factor authentication"
    ],
    [
      "Apply least-privilege IAM roles",
      "Access control"
    ],
    [
      "Set HttpOnly; Secure; SameSite cookies",
      "Session cookie protection"
    ],
    [
      "Validate input on the server",
      "Trust boundary"
    ],
    [
      "Use parameterized SQL queries",
      "SQL injection prevention"
    ],
    [
      "Add rate limiting to authentication endpoints",
      "Brute-force resistance"
    ],
    [
      "Keep secrets in a secret manager, not source control",
      "Secret management"
    ],
    [
      "Patch dependencies and scan lockfiles",
      "Dependency hygiene"
    ],
    [
      "Log security events without logging passwords or tokens",
      "Safe audit logging"
    ]
  ],
  "Networking": [
    [
      "ipconfig /all",
      "Windows network configuration"
    ],
    [
      "ip addr",
      "Linux interface addresses"
    ],
    [
      "nslookup example.com",
      "DNS lookup"
    ],
    [
      "dig example.com",
      "Detailed DNS query"
    ],
    [
      "ping -c 4 example.com",
      "Basic reachability (Linux/macOS)"
    ],
    [
      "traceroute example.com",
      "Trace route (Linux/macOS)"
    ],
    [
      "tracert example.com",
      "Trace route (Windows)"
    ],
    [
      "ss -tulpn",
      "Listening sockets (Linux)"
    ],
    [
      "curl -I https://example.com",
      "Inspect HTTP headers"
    ],
    [
      "Test-NetConnection example.com -Port 443",
      "Test TCP port (PowerShell)"
    ]
  ],
  "LC-3 Assembly": [
    [
      ".ORIG x3000",
      "Set program origin"
    ],
    [
      "ADD R1, R2, R3",
      "Add registers"
    ],
    [
      "AND R1, R2, #7",
      "Bitwise AND immediate"
    ],
    [
      "NOT R1, R2",
      "Invert bits"
    ],
    [
      "LD R1, VALUE",
      "Load PC-relative value"
    ],
    [
      "ST R1, RESULT",
      "Store register"
    ],
    [
      "LDR R1, R2, #0",
      "Load using base + offset"
    ],
    [
      "STR R1, R2, #1",
      "Store using base + offset"
    ],
    [
      "BRz DONE",
      "Branch when zero"
    ],
    [
      "JSR SUBROUTINE",
      "Call subroutine"
    ],
    [
      "RET",
      "Return from subroutine"
    ],
    [
      "TRAP x25",
      "Halt execution"
    ],
    [
      ".FILL x0041",
      "Allocate initialized word"
    ],
    [
      ".BLKW 10",
      "Reserve ten words"
    ],
    [
      ".END",
      "End source program"
    ]
  ]
};
