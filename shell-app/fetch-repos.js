const { execSync } = require("child_process");
const fs = require("fs-extra");
const path = require("path");

async function fetchRepo(name, repoUrl) {
  const tmpDir = path.join("/tmp", name); // /tmp/admin or /tmp/cms
  const destDir = path.join(__dirname, "app", name);

  // ✅ Remove old temp dir if it exists
  await fs.remove(tmpDir);
  await fs.remove(destDir);

  console.log(`📥 Cloning ${name} from ${repoUrl}`);
  execSync(`git clone --depth 1 ${repoUrl} ${tmpDir}`, { stdio: "inherit" });

  console.log(`📂 Copying ${name}/app into shell/app/${name}`);
  await fs.copy(path.join(tmpDir, "app"), destDir);
}

(async () => {
  try {
    await fetchRepo(
      "admin",
      "https://github.com/sridhar-zentelai/admin-repo.git"
    );
    await fetchRepo("cms", "https://github.com/sridhar-zentelai/cms-repo.git");
    console.log("✅ Admin and CMS fetched into shell-app/app/");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
