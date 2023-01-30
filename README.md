
# <img src="https://raw.githubusercontent.com/nephlm/codex-manuscript-file-operations/main/logo_512.png" width=48px> Codex Manuscript File Operations

A set of file operations to facilitate splitting and merging scenes and to maintaining the fileorder of the manuscript.

## Background

As a writer who uses vscode as a writing platform, I encountered the issue that vscode has no arbitrary order for files.  There are several solutions to this problem, mine was to put a numeric prefix in front of the files.  

That leads to the question of what do you do when you want to add a scene between two existing files with sequential numbers.  My solution was to use decimals (`4.5-missing-scene.md`), vsCode is smart enough to sort by prefix number as numbers instead of lexicographically so that works, but my *"attention to detail"* wants to fix the numbering, and I'm lazy enough not do it by hand, especially more than once.

Ideally we'd just be able to drag and drop scenes where they belong, this is how I simulate that through the use of renames.

## Features

- Context menu in a document to split a markdown file at the cursor, of if you have text selected, split the selected text into a new file.
- Context menu in the explorer to merge two or more files together into a single file.
- Update numeric prefixes on files to integers without changing the order of the files.
- If [Codex Manuscript Wordcount](https://marketplace.visualstudio.com/items?itemName=ZenBrewismBooks.codex-manuscript-wordcount) is installed, it will honor the document root to run the renamer without having to select a directory.

## Installation

The normal way.  Search for `codex-manuscript-file-operations` 
in the extension activity, and press install when
this extension comes up.
Unless you're reading this after having done a
search there, then you just have to press the install
button.

## Documentation

### Merge

To merge two or more files, select them in the explorer and right click.  Select the `Merge Files` option, all the selected files will be merged into the first file.  All other files will be deleted.

<img src="https://raw.githubusercontent.com/nephlm/codex-manuscript-file-operations/main/merge-menu-image.png" width=300px>

### Split

While editing a document, right click.  If you have text selected you will see `Split Selection to New File`, otherwise you'll see `Split File At Cursor`.  

<img src="https://raw.githubusercontent.com/nephlm/codex-manuscript-file-operations/main/split-menu-image.png" width=280px>

The only difference between the two commands is what gets split in the newfile, either the selected text or all text after the cursor position to the end of the file.

### Rename

This feature is only available in the command palette, unless you choose to assign a shortcut to it.  By default, no shortcut is assigned.

There are two commands; `Codex Numeric Rename` and `Codex Document Root Rename`.  `Codex Numeric Rename` will ask you to select a directory from the file picker, while `Codex Document Root Rename` will use the Document Root set in the [Codex Manuscript Wordcount](https://marketplace.visualstudio.com/items?itemName=ZenBrewismBooks.codex-manuscript-wordcount), if installed, otherwise it won't run.  

This operation will recursively rename files and directories so that within a directory, each file that had a numeric prefix, will have an integer prefix with `zero (0)` padding, so all numbers are of consistent length, without changing the order of the files.

<img src="https://raw.githubusercontent.com/nephlm/codex-manuscript-file-operations/main/before.png">
<img src="https://raw.githubusercontent.com/nephlm/codex-manuscript-file-operations/main/after.png">

It will have no effect on files without a numeric prefix, though their paths may change if the directory containing those files have a numeric prefix and gets renamed.  

### Limitations

- Only supports workspaces with one root.
- Files starting with "." are not considered numeric, since in most systems that would indicate a hidden file.  Files being placed before the file starting with `1-something.md` must have a leading `0` (e.g. `0.5-prologue.md`)
- After the rename command there may be open editors pointing to files that no longer exist.

## Details

Nitty-gritty that you probably don't have to worry about, but if you are interested.

### File Split Naming rules

The new file created by either of the split operations will be named by the following rules in order.

- If the original file has an integer prefix, add one to it, unless a file with that name already exists.
- If the original file has an integer prefix, add `0.5` to it, unless a file with that name already exists.
- If the original file has a numeric prefix, add `0.5` to it and add a `5` to the end of the numeric string (`3.5` -> `3.55`), unless a file with that name already exists.
  - If the original file has a numeric prefix, repeat the previous steps, adding more and more `5`'s to the prefix until we find a name that does not already exist.
- Add `-1` to the end of the basename (before the `.md` extension).
  - If that name is taken, move on to `-2`, `-3`, etc. until we find a name that does not exist.  

### Rename Ordering

By default, vsCode puts directories before files, but that can be reversed, or the two can be mixed together.  During the rename, the order set for the workspace (or user) will be honored so that the order in the current sort order will not be changed.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Related

Here are some other VSCode extensions I wrote to support my
writing instead of writing.

[Codex Autocommit](https://marketplace.visualstudio.com/items?itemName=ZenBrewismBooks.codex-autocommit&ssr=false#overview) -
Automatically take a snapshot of the manuscript every interval and store it on a remote git server.

[Codex Manuscript Wordcount](https://marketplace.visualstudio.com/items?itemName=ZenBrewismBooks.codex-manuscript-wordcount) - Show whole manuscript word counts and set manuscript and writing session targets.

## Authors

- [@nephlm](https://www.github.com/nephlm)
