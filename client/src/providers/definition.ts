import * as vscode from 'vscode';

export class LFEDefinitionProvider implements vscode.DefinitionProvider {

  async provideDefinition(document, position, token) {
    var text = getWordAtPosition(document, position);
     
    // var selected = document.getWordRangeAtPosition(position);
    // var selectedText = selected !== undefined ? document.getText(new vscode.Range(selected.start, selected.end)) : "";
    // console.log("selectedText=" + selectedText);
    
    text = text.replace(/\\/g, "\\\\");
    text = text.replace(/\+/g, "\\+");
    text = text.replace(/\-/g, "\\-");
    text = text.replace(/\*/g, "\\*");
    text = text.replace(/\?/g, "\\?");
    text = text.replace(/\./g, "\\.");
    text = text.replace(/\^/g, "\\^");
    text = text.replace(/\$/g, "\\$");
    text = text.replace(/\!/g, "\\!");
    text = text.replace(/\|/g, "\\|");

    console.log(`provideDefinition: text=${text}`);

    const defun_pattern = new RegExp("\\([\\s]*(defun|defmacro)[\\s]+"+text+"([\\s]+|[\\n]+)");
    
    let defun_pos = document.getText().search(defun_pattern);
    console.log("defun_pos=" + defun_pos);
    // console.log("" + position.line + " - " + document.positionAt(defun_pos).line);
    // let e = document.positionAt(defun_pos).line == position.line;

    if (defun_pos != -1) {
      return new vscode.Location(document.uri, document.positionAt(defun_pos));
    } else {
      return null;
    }
  }
}


const specialWords = ['-', '+', '/', '*', ':']; //TODO: Add more here
const syntaxQuoteSymbol = "'";

function getActualWord(document, position, selected, word) {
  if (selected === undefined) {
      let selectedChar = document.lineAt(position.line).text.slice(position.character, position.character + 1);
      let previousChar = document.lineAt(position.line).text.slice(position.character - 1, position.character);
      let isFn =((previousChar === "(") || (previousChar === "["));

      if (selectedChar !== undefined &&
          specialWords.indexOf(selectedChar) !== -1 &&
          isFn) {
          return selectedChar;
      } else {
          return "";
      }
  } else {
      return (word && word.startsWith(syntaxQuoteSymbol)) ? word.substr(1) : word;
  }
}

function getWordAtPosition(document, position) {
  let selected = document.getWordRangeAtPosition(position),
      selectedText = selected !== undefined ? document.getText(new vscode.Range(selected.start, selected.end)) : "";
      // console.log(`getWordAtPosition: selectedText= ${selectedText}`);
      // text = getActualWord(document, position, selected, selectedText);
  return selectedText;
}