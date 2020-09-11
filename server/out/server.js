"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
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
let connection = vscode_languageserver_1.createConnection(vscode_languageserver_1.ProposedFeatures.all);
// const codeManager = new CodeManager();
// const aaa = [
// 	{
// 		label: 'math:abs',
// 		kind: CompletionItemKind.Function,
// 		data: 1
// 	}]
// Create a simple text document manager. 
let documents = new vscode_languageserver_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;
// const aaa:string[] = [
// 'quote','cons','car','cdr','list','tuple','progn','prog1','prog2','begin','tref','tset','binary','map','map-get','lambda','match-lambda','function','abs','funcall','call','list*','eval-when-compile','spawn','apply','gief','match-lambda','andalso','orelse','lc','list-comp','bc','binary-comp','match-spec']
var zzz = [
    { label: 'quote', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'cons', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'car', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'cdr', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'list', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'tuple', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'progn', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'prog1', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'prog2', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'begin', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'tref', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'tset', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'binary', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'map', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'map-get', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'lambda', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'match-lambda', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'function', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'abs', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'funcall', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'call', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'list*', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'eval-when-compile', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'spawn', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'apply', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'gief', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'match-lambda', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'andalso', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'orelse', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'lc', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'list-comp', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'bc', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'binary-comp', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'match-spec', kind: vscode_languageserver_1.CompletionItemKind.Function }
];
connection.onInitialize((params) => {
    let capabilities = params.capabilities;
    // Does the client support the `workspace/configuration` request?
    // If not, we fall back using global settings.
    hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
    hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);
    hasDiagnosticRelatedInformationCapability = !!(capabilities.textDocument &&
        capabilities.textDocument.publishDiagnostics &&
        capabilities.textDocument.publishDiagnostics.relatedInformation);
    const result = {
        capabilities: {
            textDocumentSync: vscode_languageserver_1.TextDocumentSyncKind.Incremental,
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
        connection.client.register(vscode_languageserver_1.DidChangeConfigurationNotification.type, undefined);
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
// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings = { maxNumberOfProblems: 1000 };
let globalSettings = defaultSettings;
// Cache the settings of all open documents
let documentSettings = new Map();
connection.onDidChangeConfiguration(change => {
    if (hasConfigurationCapability) {
        // Reset all cached document settings
        documentSettings.clear();
    }
    else {
        globalSettings = ((change.settings.LFELanguageServer || defaultSettings));
    }
    // Revalidate all open text documents
    documents.all().forEach(validateTextDocument);
});
function getDocumentSettings(resource) {
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
async function validateTextDocument(textDocument) {
    // In this simple example we get the settings for every validate run.
    let settings = await getDocumentSettings(textDocument.uri);
    // The validator creates diagnostics for all uppercase words length 2 and more
    let text = textDocument.getText();
    let pattern = /\b[A-Z]{32,}\b/g;
    let m;
    let problems = 0;
    let diagnostics = [];
    while ((m = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
        problems++;
        let diagnostic = {
            severity: vscode_languageserver_1.DiagnosticSeverity.Warning,
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
connection.onCompletion((_textDocumentPosition) => {
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
});
// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve((item) => {
    if (item.data === 1) {
        // item.detail = 'TypeScript details';
        // item.documentation = 'TypeScript documentation';
    }
    else if (item.kind === vscode_languageserver_1.CompletionItemKind.Function) {
        // item.detail = 'Function details';
        // item.documentation = 'Function documentation ...';
    }
    return item;
});
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
// Listen on the connection
connection.listen();
//# sourceMappingURL=server.js.map