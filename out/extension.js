/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
var WordPOS = require('wordpos'), wordpos = new WordPOS();
function findSynonyms(document, position) {
    return __awaiter(this, void 0, void 0, function* () {
        let linePrefix = document.lineAt(position).text.split(' ').pop();
        //console.log(linePrefix)
        let linenumb = document.lineAt(position).lineNumber;
        let char2 = position.character;
        let char1 = position.character - linePrefix.length;
        if (linePrefix[linePrefix.length - 1] === ':') {
            let preword = linePrefix.replace(":", "");
            let results = yield wordpos.lookup(preword);
            let synonyms_full = results.map(x => x.synonyms);
            let singled = [];
            synonyms_full.forEach(element => {
                singled = singled.concat(element);
            });
            let synonyms = [...new Set(singled)];
            let items = synonyms.map(x => new vscode.CompletionItem(x, vscode.CompletionItemKind.Constant));
            items.forEach(item => {
                item.additionalTextEdits = [vscode.TextEdit.delete(new vscode.Range(linenumb, char1, linenumb, char2))];
            });
            return items;
        }
        if (linePrefix[linePrefix.length - 1] === '#') {
            let preword = linePrefix.replace("#", "");
            let results = yield wordpos.lookup(preword);
            let synonyms_full = results.map(x => x.def);
            let singled = [];
            synonyms_full.forEach(element => {
                singled = singled.concat(element);
            });
            let synonyms = [...new Set(singled)];
            let items = synonyms.map(x => new vscode.CompletionItem(x, vscode.CompletionItemKind.Snippet));
            items.forEach(item => {
                item.additionalTextEdits = [vscode.TextEdit.delete(new vscode.Range(linenumb, char1, linenumb, char2))];
            });
            return items;
        }
        return [];
    });
}
function activate(context) {
    const synonymprovider = vscode.languages.registerCompletionItemProvider({ scheme: 'file' }, {
        provideCompletionItems(document, position) {
            return findSynonyms(document, position);
        }
    }, ':', '#');
    context.subscriptions.push(synonymprovider);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map