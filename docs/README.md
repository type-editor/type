**Type Editor**

---

![Type Editor](_media/type-logo-small.svg)

# Type

### Type Richtext Editor - Another [ProseMirror](https://github.com/ProseMirror/prosemirror) clone

This is a refactored version of the original ProseMirror richtext editor code.
The code is mainly the same but reformatted and a little bit refactored to make it more readable (for me).

You can find an example of the editor here: [type-editor.io](https://type-editor.io/).

### Why another ProseMirror clone?

I think the original ProseMirror editor is awesome and [Marijn Haverbeke](https://github.com/marijnh), the developer of
the ProseMirror editor, did a fantastic job.
But I find it hard to read the code. Maybe the reason is that I'm not a JavaScript or TypeScript developer.
Nevertheless, as I want to use and possibly extend the ProseMirror editor for a personal project I decided to refactor
the code.

Maybe you will ask: should I use this version of the ProseMirror editor? Maybe or maybe not.

Anyone who did a refactoring of an existing code base knows that it often introduces bugs that were not present in the
original code.
The original ProseMirror is used in many projects and therefore very well tested.
Additionally, the ProseMirror editor has a very active community, and you will find many extensions for it.

So if you want to stay on the safe side you should use the original ProseMirror editor or a variant
like [Tiptap](https://github.com/ueberdosis/tiptap) or [ProseKit](https://prosekit.dev) that extends the original
ProseMirror editor.

But if you are planning to create a new application from scratch and want to use plain ProseMirror as the editor, then
maybe you should
give this refactored version a try.

As I did some refactoring especially added some interfaces to decouple the modules a little bit more the final code is
partly not compatible with the original ProseMirror editor code. I have added a compatibility layer to
make it compatible again. The compatibility layer contains primarily type definitions.

Another note: the documentation in the code, as far as it is not the original one, is mainly generated with tools like
GitHub Copilot and I didn't check it for correctness in detail. So please be aware that it could be wrong in some parts.

## Quick Start

I assume you have Node and npm installed. Clone this repository and then run:

```bash
# Install pnpm globally if you don't have it yet
npm run install:pnpm
# Install dependencies
pnpm install

# Build the modules
pnpm build

# Start the editor in the browser
pnpm start

# Optional for development to run browser tests
pnpm run install:playwright
pnpm test
```

## Project structure

### `/packages`

These are mainly the same modules as those from the original ProseMirror editor GitHub repository but a little bit
refactored. The naming of the modules is the same as in the original ProseMirror editor only without the prosemirror
prefix. The view module has been split into several modules to make it more readable and maintainable and to reduce
circular dependencies.

There are some additional packages:

- `commons`: contains some common helper functions and the `browser` utility from original code.
- `decoration`: moved from prosemirror-view/decoration and prosemirror-view/viewdesc into separate package.
- `dom-change-util`: moved from prosemirror-view/domchange into separate package.
- `dom-coords-util`: moved from prosemirror-view/domcoords into separate package.
- `dom-util`: moved from prosemirror-view/dom into separate package.
- `selection-util`: moved from prosemirror-view/selection into separate package.

### `/packages-compat`

These packages contain primarily type definitions to make the refactored code type compatible with the original
ProseMirror editor.

### `/adapters`

This folder contains adapters for React, Vue, and Svelte to use the editor in these frameworks.
The code is from the [prosemirror-adapter](https://github.com/prosekit/prosemirror-adapter) project.
They have created a generic and easy-to-use adapter for the ProseMirror editor and are using it successfully in
the advanced [ProseKit](https://prosekit.dev) editor.
There are some other maybe more feature-rich adapters available especially for React integration. But this one seemed
to me the most generic and easy-to-use adapter. So I have integrated it.

### `/demo`

This folder contains a simple example web page to test the editor in the browser. This is started using `npm start`
command.

### `/style`

This folder contains CSS for the preview web page. The prosemirror.css contains the styles from the original ProseMirror
editor with some minor changes e.g. for dark mode.

### `/docs`

This folder contains the generated documentation using TypeDoc (Markdown). You can generate the documentation by running
`npm run docs`.

### Documentation

- Modules (HTML): [type-editor.io](https://type-editor.io/0.0.1)
- Modules (Markdown): [GitHub](_media/index.md)

As this is mainly the same code base as the original ProseMirror editor you can find more information here:

- ProseMirror [Website](https://prosemirror.net)
- ProseMirror [Documentation](https://prosemirror.net/docs/)
- ProseMirror [Forum](https://discuss.prosemirror.net)
- ProseMirror [GitHub repository](https://github.com/ProseMirror/prosemirror)

## License

The MIT License (MIT) like the original ProseMirror editor. Please see [License File](LICENSE.md) for more information.
