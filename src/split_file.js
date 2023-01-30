const vscode = require("vscode");
const {
  extractNumber,
  startsWithNumber,
  replacePrefixNumber,
} = require("./reorder_files");
const path = require("path");
const fs = require("fs");

const _safePrefixName = function (dirName, baseFileName, ext) {
  let number = extractNumber(baseFileName);
  var newBaseName;
  var newBaseNames;
  if (Number.isInteger(number)) {
    newBaseNames = [
      replacePrefixNumber(baseFileName, (number + 1).toString()),
      replacePrefixNumber(baseFileName, (number + 0.5).toString()),
    ];
    for (const newBaseName of newBaseNames) {
      if (!fs.existsSync(path.join(dirName, newBaseName + ext))) {
        return newBaseName;
      }
    }
    return _safePrefixName(dirName, newBaseNames[1], ext);
  }
  //Not an integer
  var newBaseName = replacePrefixNumber(baseFileName, number.toString() + "5");
  if (!fs.existsSync(path.join(dirName, newBaseName + ext))) {
    // Not an int, doesn't exist
    return newBaseName;
  } else {
    //Not an int, file exists
    return _safePrefixName(dirName, newBaseName, ext);
  }
};

const endsWithNumber = function (baseFileName) {
  return /[0-9]$/.test(baseFileName);
};

function extractPostfixNumber(file) {
  return Number(file.match(/\d+$/)[0]);
}

const replacePostfixNumber = function (filename, paddedNumber) {
  return filename.replace(/(\d+)$/, `${paddedNumber}`);
};

const _safePostfixName = function (dirName, baseFileName, ext) {
  let number = extractPostfixNumber(baseFileName);
  let newBaseName = replacePostfixNumber(baseFileName, (number + 1).toString());
  if (fs.existsSync(path.join(dirName, newBaseName + ext))) {
    return _safePostfixName(dirName, newBaseName);
  } else {
    return newBaseName;
  }
};

const safeName = function (dirName, baseFileName, ext) {
  var newName;
  if (startsWithNumber(baseFileName)) {
    console.log("start with number");
    newName = _safePrefixName(dirName, baseFileName, ext);
  } else if (endsWithNumber(baseFileName)) {
    console.log("ends with number");
    newName = _safePostfixName(dirName, baseFileName, ext);
  } else {
    console.log("no number found, setting to 1");
    newName = _safePostfixName(dirName, baseFileName + "-0", ext);
  }
  return path.join(dirName, newName + ext);
};

const getSelection = function (editor) {
  let selection = editor.selection;
  let cursorPosition = selection.active;
  var endOfSelection, newSelection;
  if (
    selection.start.line === selection.end.line &&
    selection.start.character === selection.end.character
  ) {
    //from cursor to end
    endOfSelection = editor.document.lineAt(editor.document.lineCount - 1).range
      .end;
    newSelection = new vscode.Selection(cursorPosition, endOfSelection);
    editor.selections = [newSelection];
  } else {
    //existing selection
    newSelection = selection;
  }
  return newSelection;
};

const splitDocument = function () {
  let editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  let document = editor.document;
  let newSelection = getSelection(editor);
  let text = document.getText(newSelection);
  console.log(text);

  let fsPath = editor.document.uri.fsPath;
  let dirName = path.dirname(fsPath);
  let ext = path.extname(fsPath);
  let baseFileName = path.basename(fsPath, ext);

  let newPath = safeName(dirName, baseFileName, ext);
  console.log(newPath);
  // let newPath = path.join(dirName, newBaseName + ext);

  fs.writeFileSync(newPath, text, (err) => {
    return console.log("error writing file");
  });
  if (fs.existsSync(newPath)) {
    editor.edit((editBuilder) => {
      editBuilder.delete(newSelection);
    });
  } else {
    vscode.window.showErrorMessage(
      "File not successfully created, aborting split operation"
    );
  }
};

module.exports = {
  splitDocument,
};
