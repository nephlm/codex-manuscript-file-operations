const vscode = require("vscode");
const fs = require("fs");

async function getSelectedFiles() {
  const originalClipboard = await vscode.env.clipboard.readText();
  console.log(originalClipboard);
  await vscode.commands.executeCommand("copyFilePath");
  const selectedString = await vscode.env.clipboard.readText();
  await vscode.env.clipboard.writeText(originalClipboard);
  const selectedPaths = selectedString.split("\n");
  var selectedUris = [];
  for (const f of selectedPaths) {
    selectedUris.push(vscode.Uri.file(f));
  }
  console.log(selectedUris);

  return selectedUris;
}

async function isValid(selectedFiles) {
  if (selectedFiles.length < 2) {
    vscode.window.showInformationMessage(
      "Please select at least 2 files to merge!"
    );
    return false;
  }
  for (const uri of selectedFiles) {
    let stat = await fs.promises.lstat(uri.fsPath);
    if (stat.isDirectory()) {
      vscode.window.showWarningMessage("Can't merge directories, only files.");
      return false;
    }
  }
  return true;
}

function writeMergedFile(uri, fileContent) {
  fs.writeFileSync(uri.fsPath, fileContent);
}

function deleteFile(uri) {
  fs.unlinkSync(uri.fsPath);
}

async function mergeFiles() {
  const selectedFiles = await getSelectedFiles();
  if (!isValid(selectedFiles)) {
    return;
  }

  let destFile = selectedFiles[0];

  let mergedText = "";
  for (const file of selectedFiles) {
    let document = await vscode.workspace.openTextDocument(file);
    mergedText += document.getText() + "\n";
  }
  console.log(mergedText);
  try {
    writeMergedFile(destFile, mergedText);
    for (const file of selectedFiles.slice(1)) {
      deleteFile(file);
    }
  } catch (error) {
    vscode.window.showErrorMessage("Could not update file, aborting");
    return;
  }
}

module.exports = {
  mergeFiles,
};
