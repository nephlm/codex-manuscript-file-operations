const vscode = require("vscode");
const {
  setDocumentRoot,
  recursiveRename,
  documentRootRename,
} = require("./main");
const { splitDocument } = require("./split_file");
const { mergeFiles } = require("./merge_files");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log(
    'Congratulations, your extension "codex-manuscript-file-operations" is now active!'
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "codex-manuscript-file-operations.rename",
      function () {
        console.log("Files By Number Rename");
        recursiveRename();
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "codex-manuscript-file-operations.split-file",
      function (e) {
        console.log("splitFile");
        splitDocument();
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "codex-manuscript-file-operations.split-file-selection",
      function (e) {
        console.log("splitFileSelection");
        splitDocument();
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "codex-manuscript-file-operations.merge-files",
      function (e) {
        console.log("mergeFiles");
        console.log(e);
        mergeFiles();
      }
    )
  );

  // context.subscriptions.push(
  //   vscode.commands.registerCommand(
  //     "codex-manuscript-file-operations.set-document-root",
  //     function (e) {
  //       console.log("setDocumentRoot");
  //       setDocumentRoot();
  //     }
  //   )
  // );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "codex-manuscript-file-operations.rename-document-root",
      function (e) {
        console.log("renameDocumentRoot");
        documentRootRename();
      }
    )
  );
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
