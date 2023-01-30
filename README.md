# Words

One of the rough edges of using VSCode as a writing platform is that fact that you cannot arbitrarily order files, your builtin choices are only lexicographic and how to intermix files and directories.  

This isn't terribly difficult to work around, simply add a numeric prefix to each file.  In variably a file will need to be split, merged or a forgotten scene will present itself.  As long as the seperator between the number and file name is one of the 8 characters ( -,;:!?_) that are sorted before the decimal point ".", you can insert decimal numbers and it will sort properly.

```
1-Scene.md
1.5-A forgotten scene.md
2-the continuation.md
```

This leaves two problems: You're more of an exploratory writer and end up with a file called `5.434-important_scene.md` and `9-scene.md` and `10-scene.md` don't sort properly, and you were sure you weren't going to have 10 scenes, so the numbers aren't zero padded.

This extension contributes a command that will turn this

```
10-scene_with_joe_and_amanda.md
[...]
9-scene_with_joe.md
9.5-scene_with_amanda.md
```
into this
```
[...]
09-scene_with_joe.md
10-scene_with_amanda.md
11-scene_with_joe_and_amanda.md
```

It won't rename any file without a numeric prefix, nor any non-numeric part of the name.  It will recursively apply the change to the whole workspace or if `document-root` is set, then the entire document set.  Despite being recursive, each directory is individually renumbered.


## Limitations

* Files starting with "." are not considered numeric, since in most systems that would indicate a hidden file.  Files being placed before the file starting with `1-something.md` must have a leading `0` (e.g. `0.5-prologue.md`)