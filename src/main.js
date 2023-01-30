const vscode = require("vscode");
const { renameFiles } = require("./reorder_files");
const fs = require("fs").promises;

const getRelativePath = function (uri) {
  var relativePath = vscode.workspace.asRelativePath(uri);
  if (relativePath === uri.path) {
    relativePath = "";
  }
  return relativePath;
};

const validateDocumentRoot = function (uriArray) {
  if (uriArray === undefined) return false;
  try {
    if (uriArray.length == 1) {
    } else {
      vscode.window.showErrorMessage(
        "You may only choose one root for your manuscript"
      );
      return false;
    }

    const uri = uriArray[0];

    const folders = vscode.workspace.workspaceFolders;
    if (folders === undefined) {
      vscode.window.showErrorMessage(
        "You must be in a workspace to choose a document root."
      );
      return false;
    }
    let isWithinWorkspace = false;
    vscode.workspace.workspaceFolders.forEach((workspaceFolder) => {
      if (uri.fsPath.startsWith(workspaceFolder.uri.fsPath)) {
        isWithinWorkspace = true;
      }
    });
    if (!isWithinWorkspace) {
      vscode.showErrorMessage(
        "The document root must be within the workspace."
      );
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    vscode.window.showErrorMessage(
      "An unanticipated error occurred when setting a document root."
    );
    return false;
  }
};

const setDocumentRoot = async function () {
  vscode.window
    .showOpenDialog({
      canSelectFolders: true,
      canSelectMany: false,
      defaultUri: vscode.workspace.workspaceFolders[0].uri,
      openLabel: "set",
      title: "Select the root folder of your manuscript",
    })
    .then(async (uriArray) => {
      if (validateDocumentRoot(uriArray)) {
        this.documentRoot = uriArray[0];
        var relativePath = getRelativePath(this.documentRoot);
        vscode.workspace
          .getConfiguration()
          .update(
            "codexManuscriptWordcount.defaultDocumentRoot",
            relativePath,
            vscode.ConfigurationTarget.Workspace
          );
        vscode.window.showInformationMessage(
          `DocumentRoot set to ${relativePath} `
        );
      }
    });
};

const selectRoot = async function () {
  const uriArray = await vscode.window.showOpenDialog({
    canSelectFolders: true,
    canSelectMany: false,
    defaultUri: vscode.workspace.workspaceFolders[0].uri,
    openLabel: "select",
    title: "Select directory tree to renumber",
  });
  if (validateDocumentRoot(uriArray)) {
    return uriArray[0];
  }
};

async function getAllDirectories(path) {
  let results = [];

  const files = await fs.readdir(path);
  for (const file of files) {
    const filePath = `${path}/${file}`;
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      results = results.concat(await getAllDirectories(filePath));
    }
  }

  return results.concat(path);
}

const recursiveRename = async function () {
  const path = await selectRoot();
  await _recursiveRename(path);
};

const documentRootRename = async function () {
  let relative = vscode.workspace
    .getConfiguration()
    .get("codexManuscriptWordcount.defaultDocumentRoot");
  if (relative === undefined) {
    vscode.window.showInformationMessage(
      "The *Codex Document Root Files By Number Rename* command is only available if *Codex Manuscript WordCount* is installed"
    );
    return;
  }

  let workspaceRoot = vscode.workspace.workspaceFolders[0].uri;
  let documentRoot = vscode.Uri.joinPath(workspaceRoot, relative);
  await _recursiveRename(documentRoot);
};

const _recursiveRename = async function (path) {
  let directories = await getAllDirectories(path.fsPath);
  for (const directory of directories) {
    await renameFiles(directory);
  }
  vscode.window.showInformationMessage(
    "Rename operation is complete.  Be aware that some editors may pointing to file names that no longer exist."
  );
};

module.exports = { setDocumentRoot, recursiveRename, documentRootRename };
