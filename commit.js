const { execSync } = require("child_process");

const message = process.argv.slice(2).join(" "); 
if (!message) {
  console.error("Error: Commit message is required.");
  process.exit(1);
}

execSync(`git add . && git commit -m "${message}" && git push`, { stdio: "inherit" });