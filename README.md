# vscode-rpmdev

A VS Code extension that uses the `rpmdev-bumpspec` command to bump the release number in RPM spec files.

## Features

- Bumps the release tag and adds a new changelog entry in the current spec file using a simple command.

## Dependencies

- The `rpmdev-bumpspec` command, which is usually provided by the `rpmdevtools` package.

## Usage

1. Open a `.spec` file in VS Code.
2. Open the Command Palette (`Ctrl+Shift+P`) and run the `Bumpspec: Increase release number and add changelog` command.
3. Alternatively, use the `F10` keyboard shortcut.
4. The release of the spec file will be automatically bumped, and the file will be reloaded with the cursor at the new changelog entry.

## Extension Settings

This extension contributes the following settings:

* `rpmdev.userstring`: The user string to use for the new changelog entry (e.g., "John Doe <john.doe@example.com>"). If not provided, `rpmdev-bumpspec` will use its default.

## Keybindings

- `F10`: Triggers the `Bumpspec` command when a `.spec` file is open.

## License

MIT
