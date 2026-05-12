import { spawn } from "node:child_process";
import cypress from "cypress";

const appUrl = "http://localhost:5173";
const isWindows = process.platform === "win32";

function run(command, args, options = {}) {
  return spawn(command, args, {
    shell: isWindows,
    stdio: "inherit",
    ...options,
  });
}

async function waitForServer(url, timeoutMs = 60_000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Vite is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function isServerAvailable(url) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

function waitForExit(child) {
  return new Promise((resolve) => {
    child.on("exit", (code, signal) => {
      resolve({ code, signal });
    });
  });
}

const serverWasRunning = await isServerAvailable(appUrl);
const server = serverWasRunning
  ? null
  : run("npm", ["--prefix", "frontend", "run", "dev", "--", "--host", "localhost"]);

try {
  if (!serverWasRunning) {
    await waitForServer(appUrl);
  }

  const result = await cypress.run({
    browser: "electron",
    configFile: "cypress.config.js",
  });

  process.exitCode = result.totalFailed === 0 ? 0 : 1;
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  server?.kill();
}
