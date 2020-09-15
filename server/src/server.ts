'use strict';

// import { spawn, spawnSync, execFileSync, ChildProcess } from 'child_process';
// import { access } from 'fs';
// import { setFlagsFromString } from 'v8';

import {
	// CompletionContext,
	CompletionParams,
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
	InitializeResult, VersionedTextDocumentIdentifier, TextDocumentIdentifier

} from 'vscode-languageserver';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';

// import * from child_process

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


// Create a simple text document manager. 
let documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability: boolean = false;
let hasWorkspaceFolderCapability: boolean = false;
let hasDiagnosticRelatedInformationCapability: boolean = false;



var core_completitions : CompletionItem[] = [
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


// var my_exec_out: string = "";
var lfe_modules: Array<string> = [];
// var lfe_modfun = new Map();

var modules_completitions = new Map();
var modfunc_completitions = new Map();

connection.onInitialize((params: InitializeParams) => {
	let capabilities = params.capabilities;

	// params.capabilities.textDocument?.completion?.completionItem?.commitCharactersSupport.

	// get_lfe_modules();
	// get_lfe_functions();
	get_modules_completitions();

	// get_lfe_functions_completitions("erlang");

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
				resolveProvider: true,
				triggerCharacters: [":"]
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


// function sleep(time: any) {
//     var stop = new Date().getTime();
//     while(new Date().getTime() < stop + time) {
//         ;
//     }
// }

function matchAll(s: String, pattern: RegExp): Array<string> {
	var acc = new Array<string> ();
	var m_index  = s.search(pattern);
	if (m_index >= 0) {
		var m_string = String(s.match(pattern));
		while (m_index >= 0 && m_string != null){
			acc.push(s.substr(m_index, m_string.length));
			s = s.substring(m_index + m_string.length)
			m_index  = s.search(pattern);
			m_string = String(s.match(pattern));
		}
	}
	return acc;
}

function get_lfe_modules (): Array<string> {
	if (lfe_modules.length > 1){
		// connection.console.log('get_lfe_modules: return lfe_modules');
		return lfe_modules;
	} else {
		// connection.console.log('get_lfe_modules: parsing...');
		const cmd = `lfe -eval "(m)"`;
		var s :String = myExec(cmd);
		s = s.substring(s.search("\n")+1, s.length);
		let pattern = /^[\S]+/m;
		var result = matchAll(s, pattern);
		// connection.console.log('get_lfe_modules: lfe_modules:\n' + result +"\n");
		lfe_modules = lfe_modules.concat(result);
		return lfe_modules;
	}
}

function get_lfe_module_functions(moduleName:String): RegExpMatchArray|null {
	// connection.console.log('get_lfe_module_functions: moduleName: ' + moduleName +"");
	const cmd = `lfe -eval "(m '${moduleName})"`;
	var s : String = myExec(cmd);
	let pattern = /[\S]+\/[\d]+/g;
	// var result = matchAll(s, pattern);
	let result = s.match(pattern);
	// var result : new Array<string>
	// connection.console.log('get_lfe_module_functions: lfe_module_functions:\n' + result +"\n");
	return result;
}


// Возвращет и загружает если не загружено
function get_modules_completitions() : CompletionItem[]{
	if (modules_completitions.has("lfe")) {
		// connection.console.log('get_modules_completitions:  "lfe" in modules_completitions.keys');
		return modules_completitions.get("lfe");
	} else {
		var lfe_m = get_lfe_modules();
		// connection.console.log('get_modules_completitions:  lfe_modules=' + lfe_m);
		var completitions : CompletionItem[] = [];
		for (var i in lfe_m) {
			// connection.console.log('get_modules_completitions:  push=' + lfe_m[i]);
			completitions.push({label: lfe_m[i], kind: CompletionItemKind.Module})
		}
		modules_completitions.set("lfe", completitions);
		return completitions;
	}
}

// Возвращет и загружает если не загружено
function get_module_functions_completitions(moduleName:string) : CompletionItem[]{
	// connection.console.log(`get_lfe_functions_completitions: start for ${moduleName}`);
	var result : CompletionItem[] = [];
	if (modfunc_completitions.has(moduleName)) {
		// connection.console.log(`get_module_functions_completitions:  "${moduleName}" already exists`);
		result = modfunc_completitions.get(moduleName);
	} else {
		if (lfe_modules.indexOf(moduleName) >= 0) {
			// connection.console.log(`get_module_functions_completitions:  "${moduleName}" is correct`);
			var r = get_lfe_module_functions(moduleName);
			
			if (r?.length != null){
				// connection.console.log(`get_module_functions_completitions: ${r}`);
				for (var j in r) {
					// result.push(moduleName + ":" + r[j]);
					result.push({label: String(moduleName + ":" + r[j]), kind: CompletionItemKind.Function})
				};
				modfunc_completitions.set(moduleName, result);	
			};
		};
	};
	return result;
}


function myExec (cmd : string) :string {
	var r : string = "";
	try {r = require('child_process').execSync(cmd).toString();}
	catch {}
	// my_exec_out = r;
	return r;
}




connection.onInitialized(() => {
	connection.console.log('LFE WB language server is running!');
	
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}

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
	// let textDocument = change.document;
	// let text = textDocument.getText();

	
    // current editor
    // const editor = vscode.window.activeTextEditor;

    // check if there is no selection
    // if (editor != undefined) {
      // the Position object gives you the line and character where the cursor is
    //   const position = editor. selection.active;
	// }
	
	// let start =  textDocument.positionAt(m.index);
	// let end: textDocument.positionAt(m.index + m[0].length)

	// validateTextDocument(change.document);
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

connection.onDidChangeTextDocument((params) => {
    // The content of a text document did change in VSCode.
    // params.uri uniquely identifies the document.
	// params.contentChanges describe the content changes to the document.
    connection.console.log(`${params.textDocument.uri} changed: ${JSON.stringify(params.contentChanges)}`);
});

// This handler provides the initial list of the completion items.
connection.onCompletion(
	
	// (_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
	(_completionParams: CompletionParams): CompletionItem[] => {
		// The pass parameter contains the position of the text document in
		// which code complete got requested. For the example we ignore this
		// info and always provide the same completion items.

		
		// if (_completionParams != undefined){
		// 	switch (_completionParams.context?.triggerCharacter) {
		// 		case ':':{
		// 			connection.console.log(`onCompletion: triggerCharacter`);
		// 			return [];}; // contains "@INCLUDE" e.g.
					
		// 		// case '#':
		// 		// 	return codecompletionlist.constants; // contains "#BLACK" e.g.
			
		// 		default:
		// 			break;
		// 	};
		// };


		// connection.console.log(`${_completionParams.position.character}`);
		
		let textDocument = documents.get(_completionParams.textDocument.uri);
		var result_completitions : CompletionItem[] = [];
		if (textDocument != undefined){
			let text = textDocument.getText();
			var end = textDocument.offsetAt(_completionParams.position);
			var start = end - _completionParams.position.character;
			var ttt = text.substring(start, end);
			// connection.console.log(`onCompletion: parsing line:${ttt}`);
			var mod_fun_pattern: RegExp = /[0-9a-z_]+[0-9a-z_\-\=\!\@\#\$\%\^\&\;\?]*\:[0-9a-z_]*$/
			let m1 = mod_fun_pattern.exec(ttt);

			if (m1 != null) {
				connection.console.log(`onCompletion: find pattern: ${m1[0]}`);
				// var pattern2: RegExp = /[a-z_]+[0-9a-z_]*$/
				var colon_pos = m1[0].indexOf(":");
				var mod_name: string = m1[0].substring(0, colon_pos);
				connection.console.log(`onCompletion: mod_name: ${mod_name}`);
				// var fun_name
				
				result_completitions = get_module_functions_completitions(mod_name);

			} else {
				result_completitions = core_completitions.concat(get_modules_completitions());
			}

		}


		return result_completitions;
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
