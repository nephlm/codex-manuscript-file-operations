const fs = require("fs");
const vscode = require("vscode");

// function startsWithNumber(filePath) {
//   // extract the filename from the full path
//   const fileName = filePath.split(/[\\/]/).pop();
//   // check if the first character of the filename is a number
//   const firstChar = fileName.charAt(0);
//   return !isNaN(firstChar);
// }

async function renameFiles(directory) {
  // Get all files in the directory
  const files = await listFilesStartingWithNumber(directory);
  // const files = fs.readdirSync(directory);

  // Sort files by their numeric prefix
  files.sort((a, b) => compare(a, b));

  let numbers = files.map((dirEnt) => dirEnt.name).map(extractNumber);
  numbers.push(files.length);
  let numDigits = maxDigits(numbers);

  let nameMap = {};
  // Rename each file to have an integer prefix
  files.forEach(async (file, index) => {
    let newName = getNewName(directory, file.name, index, numDigits);
    if (newName !== file.name) {
      nameMap[`${directory}/${file.name}`] = `${directory}/${newName}`;
    }
  });
  await rename(nameMap);
}

const rename = async function (nameMap) {
  var remainingRenames = Object.keys(nameMap).length;
  var previousRemainingRenames = 99999;
  while (remainingRenames > 0) {
    if (previousRemainingRenames == remainingRenames) {
      // caught in a loop.  Just stop
      vscode.window.showErrorMessage(
        "Was not able to move all files.  Backing off to avoid any possible data loss.  The following files were not moved: " +
          Object.keys(nameMap).join(", ")
      );
    }

    previousRemainingRenames = remainingRenames;

    for (const originalPath in nameMap) {
      if (fs.existsSync(nameMap[originalPath])) {
        //The file exists, we can't move it yet
      } else {
        //destination file doesn't currently exist, moving
        fs.renameSync(originalPath, nameMap[originalPath]);
        delete nameMap[originalPath];
      }
    }
    remainingRenames = Object.keys(nameMap).length;
  }
};

const replacePrefixNumber = function (filename, paddedNumber) {
  return filename.replace(/^\d+(\.\d+)?/, `${paddedNumber}`);
};

const getNewName = function (directory, file, index, numDigits) {
  const paddedNumber = (index + 1).toString().padStart(numDigits, "0");
  return replacePrefixNumber(file, paddedNumber);
};

const compareType = function (a, b) {
  // a and b are fs.dirEnts
  // unless config item explorer.sortOrder is set to mixed
  // then
  // files before folders: filesFirst
  // else folders before files: (default, type, modified, folderNestedFiles)
  let sortOrder = vscode.workspace.getConfiguration().get("explorer.sortOrder");
  var inverted = 1;
  if (sortOrder === "mixed") {
    console.log("mixed");
    return null;
  } else if (sortOrder === "filesFirst") {
    console.log("filesFirst");
    inverted = -1;
  }
  if (a.isDirectory() && !b.isDirectory()) {
    return -1 * inverted;
  }
  if (b.isDirectory() && !a.isDirectory()) {
    return 1 * inverted;
  }
};

const compare = function (a, b) {
  // a and b are fs.dirEnts
  let typeVal = compareType(a, b);
  if (!isNaN(typeVal)) {
    return typeVal;
  }
  const A = extractNumber(a.name);
  const B = extractNumber(b.name);
  return A - B;
};

const startsWithNumber = function (file) {
  // input is string baseFilename
  return /^[0-9]/.test(file);
};

async function listFilesStartingWithNumber(dir) {
  let files = [];
  const fileList = await fs.promises.readdir(dir, { withFileTypes: true });
  fileList.forEach((file) => {
    if (startsWithNumber(file.name)) {
      files.push(file);
    }
  });
  return files;
}

function extractNumber(file) {
  // input is string baseFilename
  return Number(file.match(/^\d*\.?\d+/)[0]);
}

function maxDigits(numbers) {
  return numbers.reduce((max, n) => {
    const intN = Math.round(n);
    return Math.max(max, (intN + "").length);
  }, 0);
}

module.exports = {
  renameFiles,
  extractNumber,
  startsWithNumber,
  replacePrefixNumber,
};
