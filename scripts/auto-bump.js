const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Configuration - Relative paths from root
const CONFIG = {
  frontend: {
    packageJson: "frontend/package.json",
    k8sFile: "k8s/frontend-deployment.yaml",
    imageName: "jin312/vietsign-fe",
  },
  backend: {
    packageJson: "backend/package.json",
    k8sFile: "k8s/backend-deployment.yaml",
    imageName: "jin312/vietsign-be",
  },
};

function bumpVersion(currentVersion) {
  const parts = currentVersion.split(".");
  parts[2] = parseInt(parts[2], 10) + 1;
  return parts.join(".");
}

function updatePackageJson(filePath) {
  // filePath is relative, e.g. 'frontend/package.json'
  // internal logic uses absolute path for FS operations
  const absolutePath = path.resolve(__dirname, "..", filePath);
  const content = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  const oldVersion = content.version;
  const newVersion = bumpVersion(oldVersion);

  content.version = newVersion;
  fs.writeFileSync(absolutePath, JSON.stringify(content, null, 2) + "\n");
  console.log(`[Auto-Bump] Bumped ${filePath}: ${oldVersion} -> ${newVersion}`);
  return newVersion;
}

function updateK8sDeployment(filePath, imageName, newVersion) {
  const absolutePath = path.resolve(__dirname, "..", filePath);
  let content = fs.readFileSync(absolutePath, "utf8");

  // Regex matches "image: imageName:vX.Y.Z"
  const regex = new RegExp(
    `(image:\\s*${imageName}:v)([0-9]+\\.[0-9]+\\.[0-9]+)`,
    "g",
  );

  if (!regex.test(content)) {
    console.warn(
      `[Auto-Bump] Warning: Could not find image definition for ${imageName} in ${filePath}`,
    );
    return;
  }

  content = content.replace(regex, `$1${newVersion}`);
  fs.writeFileSync(absolutePath, content);
  console.log(`[Auto-Bump] Updated ${filePath} image tag to v${newVersion}`);
}

function hasChangesInDirectory(dir) {
  try {
    // Check if there are staged changes in the specific directory
    const output = execSync(
      `git diff --cached --name-only "${dir}"`,
    ).toString();
    return output.trim().length > 0;
  } catch (error) {
    return false;
  }
}

function main() {
  console.log("[Auto-Bump] Checking for changes...");

  const bumpFrontend = hasChangesInDirectory("frontend");
  const bumpBackend = hasChangesInDirectory("backend");

  if (!bumpFrontend && !bumpBackend) {
    console.log(
      "[Auto-Bump] No staged changes in frontend/ or backend/. Skipping.",
    );
    return;
  }

  const filesToAdd = [];

  if (bumpFrontend) {
    console.log("[Auto-Bump] Detected changes in frontend.");
    const newVersion = updatePackageJson(CONFIG.frontend.packageJson);
    updateK8sDeployment(
      CONFIG.frontend.k8sFile,
      CONFIG.frontend.imageName,
      newVersion,
    );
    filesToAdd.push(CONFIG.frontend.packageJson);
    filesToAdd.push(CONFIG.frontend.k8sFile);
  }

  if (bumpBackend) {
    console.log("[Auto-Bump] Detected changes in backend.");
    const newVersion = updatePackageJson(CONFIG.backend.packageJson);
    updateK8sDeployment(
      CONFIG.backend.k8sFile,
      CONFIG.backend.imageName,
      newVersion,
    );
    filesToAdd.push(CONFIG.backend.packageJson);
    filesToAdd.push(CONFIG.backend.k8sFile);
  }

  if (filesToAdd.length > 0) {
    // Use relative paths for git add
    const files = filesToAdd.join(" ");
    console.log(`[Auto-Bump] Staging updated files: ${files}`);
    try {
      execSync(`git add ${files}`);
    } catch (e) {
      console.error("[Auto-Bump] Error staging files:", e.message);
      process.exit(1);
    }
  }
}

main();
// git add . && node scripts/auto-bump.js && git commit -m "mô tả của bạn" && git push
// chỉ tự động sửa số sau cùng của version
