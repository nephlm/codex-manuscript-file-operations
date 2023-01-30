// Creates a Configuration that was not in package.json
vscode.workspace.registerConfiguration("example", {
  title: "Example Configuration",
  type: "object",
  properties: {
    exampleSetting: {
      type: "boolean",
      default: true,
      description: "An example setting",
    },
  },
});

// Determine if already set.  The code that determines which extension has configed is probably imperfect at best.
exports.activate = (context) => {
  let config = vscode.workspace.getConfiguration("example");
  if (!config.has("exampleSetting")) {
    vscode.extensions.all.forEach((extension) => {
      if (
        extension.packageJSON &&
        extension.packageJSON.contributes &&
        extension.packageJSON.contributes.configuration
      ) {
        let configuration = extension.packageJSON.contributes.configuration;
        if (configuration.hasOwnProperty("example")) {
          console.log(
            `The configuration 'example' has been registered by ${extension.id}`
          );
        } else {
          // Register the configuration in your package.json
        }
      }
    });
  }
};
