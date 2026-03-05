import path from "path";
import fs from "fs";
import vm from "vm";
import Mocha from "mocha";

async function runTests() {
  const finalOutput = {
    stdout: "",
    stderr: "",
    tests: []
  };

  const originalLog = console.log;
  const originalError = console.error;

  const userCode = fs.readFileSync("./src/code.js", "utf8");

  const sandbox = {
    console: {
      log: (...args) => {
        finalOutput.stdout += args.join(" ") + "\n";
      },
      error: (...args) => {
        finalOutput.stderr += args.join(" ") + "\n";
      }
    },
    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval
  };

  vm.createContext(sandbox);

  let fileLoaded = false;

  try {
    vm.runInContext(userCode, sandbox, {
      filename: "code.js",
      timeout: 3000
    });

    fileLoaded = true;
  } catch (err) {
    finalOutput.stderr += err.stack + "\n";
  }

  if (!fileLoaded) {
    process.stdout.write(JSON.stringify(finalOutput, null, 2));
    return;
  }

  Object.assign(global, sandbox);

  const mocha = new Mocha({ reporter: function() {} });
  mocha.addFile(path.resolve("./src/code.test.js"));

  const resultsTree = { title: "root", suites: [], tests: [] };
  let currentSuiteStack = [resultsTree];
  let currentTest = null;

  const runner = mocha.run();

  runner.on("suite", (suite) => {
    if (!suite.title) return;
    const suiteNode = { title: suite.title, suites: [], tests: [] };
    currentSuiteStack[currentSuiteStack.length - 1].suites.push(suiteNode);
    currentSuiteStack.push(suiteNode);
  });

  runner.on("suite end", (suite) => {
    if (!suite.title) return;
    currentSuiteStack.pop();
  });

  runner.on("test", (test) => {
    currentTest = {
      title: test.title,
      logs: [],
      status: null,
      err: null,
      duration: null
    };

    console.log = (...args) => {
      currentTest.logs.push(args.join(" "));
    };

    console.error = (...args) => {
      finalOutput.stderr += args.join(" ") + "\n";
    };
  });

  runner.on("pass", (test) => {
    currentTest.status = "passed";
    currentTest.duration = test.duration;
  });

  runner.on("fail", (test, err) => {
    currentTest.status = "failed";
    currentTest.duration = test.duration;
    currentTest.err = {
      message: err.message,
      stack: err.stack
    };
  });

  runner.on("test end", () => {
    console.log = originalLog;
    console.error = originalError;

    currentSuiteStack[currentSuiteStack.length - 1].tests.push(currentTest);
    currentTest = null;
  });

  runner.on("end", () => {
    finalOutput.tests = resultsTree.suites;
    process.stdout.write(JSON.stringify(finalOutput, null, 2));
  });
}

runTests();