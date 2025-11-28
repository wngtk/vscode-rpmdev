import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import * as os from 'os';
import * as path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function bumpspecContent(content: string, userstring?: string, fileName?: string): Promise<string> {
    const tempFileName = fileName ? `${Date.now()}-${path.basename(fileName)}` : `vscode-rpmdev-${Date.now()}.spec`;
    const tempFilePath = path.join(os.tmpdir(), tempFileName);
    try {
        await fs.writeFile(tempFilePath, content);

        let command = `rpmdev-bumpspec ${tempFilePath}`;
        if (userstring) {
            command = `rpmdev-bumpspec -u "${userstring}" ${tempFilePath}`;
        }

        await execAsync(command);

        const newContent = await fs.readFile(tempFilePath, 'utf-8');
        return newContent;
    } finally {
        await fs.unlink(tempFilePath).catch(err => console.error(`Failed to delete temp file: ${err}`));
    }
}

async function executeBumpspec() {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'RPMSpec') {
        vscode.window.showErrorMessage('Not a RPMSpec file');
        return;
    }

    const document = editor.document;
    const originalContent = document.getText();
    const fileName = document.fileName;
    
    try {
        const config = vscode.workspace.getConfiguration('rpmdev');
        const userstring = config.get<string>('userstring');
        const newContent = await bumpspecContent(originalContent, userstring, fileName);

        const edit = new vscode.WorkspaceEdit();
        edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), newContent);
        await vscode.workspace.applyEdit(edit);

        // Jump to changelog
        const changelogRegex = /^%changelog$/m;
        const match = changelogRegex.exec(newContent);
        if (match) {
            const line = newContent.substring(0, match.index).split('\n').length;
            const position = new vscode.Position(line + 1, 0);
            editor.selection = new vscode.Selection(position, position);
            editor.revealRange(new vscode.Range(position, position));
        }

    } catch (error) {
        if (error instanceof Error) {
            vscode.window.showErrorMessage(`Failed to bump spec file: ${error.message}`);
        } else {
            vscode.window.showErrorMessage(`Failed to bump spec file: ${String(error)}`);
        }
    }
}


export function activate(context: vscode.ExtensionContext) {
    const bumpspecCommand = vscode.commands.registerCommand('vscode-rpmdev.bumpspec', executeBumpspec);
    context.subscriptions.push(bumpspecCommand);
}

export function deactivate() { }
