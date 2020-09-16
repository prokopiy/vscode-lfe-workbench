
import * as path from 'path';
import { workspace, ExtensionContext, window } from 'vscode';
import * as vscode from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient';

import * as definition from './providers/definition';

let client: LanguageClient;

// include the 'file' and 'untitled' to the
// document selector. All other schemes are
// not known and therefore not supported.
const documentSelector = [
    { scheme: 'file', language: 'lfe' },
    { scheme: 'jar', language: 'lfe' },
    { scheme: 'untitled', language: 'lfe' }
];

export function activate(context: ExtensionContext) {
	// The server is implemented in node

	context.subscriptions.push(vscode.languages.registerDefinitionProvider(documentSelector, new definition.LFEDefinitionProvider()));
	let serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	let serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'lfe' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'LFELanguageServer',
		'LFE Language Server',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();
	window.showInformationMessage('LFE WB Client started');
	
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
