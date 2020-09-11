
import {
	createConnection,
	TextDocuments,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult
} from 'vscode-languageserver';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';

// "use strict";
// import * as vscode from "vscode";
// import { CodeManager } from "./codeManager";

// import * as fs from "fs";
// import * as micromatch from "micromatch";
// import * as os from "os";
// import { basename, dirname, extname, join } from "path";
// import * as vscode from "vscode";
// import { AppInsightsClient } from "./appInsightsClient";
// import { Constants } from "./constants";
// import { Utility } from "./utility";


// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = createConnection(ProposedFeatures.all);
// const codeManager = new CodeManager();

// const aaa = [
// 	{
// 		label: 'math:abs',
// 		kind: CompletionItemKind.Function,
// 		data: 1
// 	}]

// Create a simple text document manager. 
let documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability: boolean = false;
let hasWorkspaceFolderCapability: boolean = false;
let hasDiagnosticRelatedInformationCapability: boolean = false;

// const aaa:string[] = [
// 'quote','cons','car','cdr','list','tuple','progn','prog1','prog2','begin','tref','tset','binary','map','map-get','lambda','match-lambda','function','abs','funcall','call','list*','eval-when-compile','spawn','apply','gief','match-lambda','andalso','orelse','lc','list-comp','bc','binary-comp','match-spec']
	
var zzz : CompletionItem[] = [
	{label:'quote', kind: CompletionItemKind.Function},
	{label:'cons', kind: CompletionItemKind.Function},
	{label:'car', kind: CompletionItemKind.Function},
	{label:'cdr', kind: CompletionItemKind.Function},
	{label:'list', kind: CompletionItemKind.Function},
	{label:'tuple', kind: CompletionItemKind.Function},
	{label:'progn', kind: CompletionItemKind.Function},
	{label:'prog1', kind: CompletionItemKind.Function},
	{label:'prog2', kind: CompletionItemKind.Function},
	{label:'begin', kind: CompletionItemKind.Function},
	{label:'tref', kind: CompletionItemKind.Function},
	{label:'tset', kind: CompletionItemKind.Function},
	{label:'binary', kind: CompletionItemKind.Function},
	{label:'map', kind: CompletionItemKind.Function},
	{label:'map-get', kind: CompletionItemKind.Function},
	{label:'lambda', kind: CompletionItemKind.Function},
	{label:'match-lambda', kind: CompletionItemKind.Function},
	{label:'function', kind: CompletionItemKind.Function},
	{label:'abs', kind: CompletionItemKind.Function},
	{label:'funcall', kind: CompletionItemKind.Function},
	{label:'call', kind: CompletionItemKind.Function},
	{label:'list*', kind: CompletionItemKind.Function},
	{label:'eval-when-compile', kind: CompletionItemKind.Function},
	{label:'spawn', kind: CompletionItemKind.Function},
	{label:'apply', kind: CompletionItemKind.Function},
	{label:'gief', kind: CompletionItemKind.Function},
	{label:'match-lambda', kind: CompletionItemKind.Function},
	{label:'andalso', kind: CompletionItemKind.Function},
	{label:'orelse', kind: CompletionItemKind.Function},
	{label:'lc', kind: CompletionItemKind.Function},
	{label:'list-comp', kind: CompletionItemKind.Function},
	{label:'bc', kind: CompletionItemKind.Function},
	{label:'binary-comp', kind: CompletionItemKind.Function},
	{label:'match-spec', kind: CompletionItemKind.Function}

	];



connection.onInitialize((params: InitializeParams) => {
	let capabilities = params.capabilities;



	// Does the client support the `workspace/configuration` request?
	// If not, we fall back using global settings.
	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);
	hasDiagnosticRelatedInformationCapability = !!(
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation
	);

	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			// Tell the client that this server supports code completion.
			completionProvider: {
				resolveProvider: true
			}
		}
	};
	if (hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true
			}
		};
	}
	return result;
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}
	connection.console.log('We received an file change event--------------');
	// vscode.window.showInformationMessage("LFE workbench is running!");
	// codeManager.runCustomCommand()
});

// The example settings
interface ExampleSettings {
	maxNumberOfProblems: number;
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: ExampleSettings = { maxNumberOfProblems: 1000 };
let globalSettings: ExampleSettings = defaultSettings;

// Cache the settings of all open documents
let documentSettings: Map<string, Thenable<ExampleSettings>> = new Map();

connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		// Reset all cached document settings
		documentSettings.clear();
	} else {
		globalSettings = <ExampleSettings>(
			(change.settings.LFELanguageServer || defaultSettings)
		);
	}

	// Revalidate all open text documents
	documents.all().forEach(validateTextDocument);
});

function getDocumentSettings(resource: string): Thenable<ExampleSettings> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: 'LFELanguageServer'
		});
		documentSettings.set(resource, result);
	}
	return result;
}

// Only keep settings for open documents
documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
	validateTextDocument(change.document);
});

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	// In this simple example we get the settings for every validate run.
	let settings = await getDocumentSettings(textDocument.uri);

	// The validator creates diagnostics for all uppercase words length 2 and more
	let text = textDocument.getText();
	let pattern = /\b[A-Z]{32,}\b/g;
	let m: RegExpExecArray | null;

	let problems = 0;
	let diagnostics: Diagnostic[] = [];
	while ((m = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
		problems++;
		let diagnostic: Diagnostic = {
			severity: DiagnosticSeverity.Warning,
			range: {
				start: textDocument.positionAt(m.index),
				end: textDocument.positionAt(m.index + m[0].length)
			},
			message: `${m[0]} is all uppercase.`,
			source: 'ex'
		};
		if (hasDiagnosticRelatedInformationCapability) {
			diagnostic.relatedInformation = [
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnostic.range)
					},
					message: 'Spelling matters'
				},
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnostic.range)
					},
					message: 'Particularly for names'
				}
			];
		}
		diagnostics.push(diagnostic);
	}

	// Send the computed diagnostics to VSCode.
	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

connection.onDidChangeWatchedFiles(_change => {
	// Monitored files have change in VSCode
	connection.console.log('We received an file change event');
});

// This handler provides the initial list of the completion items.
connection.onCompletion(
	
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		// The pass parameter contains the position of the text document in
		// which code complete got requested. For the example we ignore this
		// info and always provide the same completion items.


		return zzz;
		// return [
		// 	{
		// 		label: 'random:uniform11',
		// 		kind: CompletionItemKind.Function,
		// 		data: 1
		// 	},
		// 	{
		// 		label: 'io:format11',
		// 		kind: CompletionItemKind.Function,
		// 		data: 2
		// 	}
		// ];
	}
);

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {
		if (item.data === 1) {
			// item.detail = 'TypeScript details';
			// item.documentation = 'TypeScript documentation';
		} else if (item.kind === CompletionItemKind.Function) {
			// item.detail = 'Function details';
			// item.documentation = 'Function documentation ...';
		}
		return item;
	}
);

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
