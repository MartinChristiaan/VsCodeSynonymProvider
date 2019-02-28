/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

'use strict';

import * as vscode from 'vscode';
var WordPOS = require('wordpos'),
	wordpos = new WordPOS();



async function findSynonyms(document: vscode.TextDocument, position: vscode.Position) {
	let linePrefix = document.lineAt(position).text.split(' ').pop()
	//console.log(linePrefix)

	let linenumb = document.lineAt(position).lineNumber;
	let char2 = position.character;
	let char1 = position.character - linePrefix.length;

	if (linePrefix[linePrefix.length - 1] === ':') {
		let preword = linePrefix.replace(":", "")

		let results = await wordpos.lookup(preword);
		let synonyms_full = results.map(x => x.synonyms)
		let singled = []
		synonyms_full.forEach(element => {
			singled = singled.concat(element)
		});
		let synonyms = [...new Set(singled)];
		let items = synonyms.map(x => new vscode.CompletionItem(x, vscode.CompletionItemKind.Constant));
		items.forEach(item => {
			item.additionalTextEdits = [vscode.TextEdit.delete(new vscode.Range(linenumb, char1, linenumb, char2))]
		});

		return items;
	}
	if (linePrefix[linePrefix.length - 1] === '#') {
		let preword = linePrefix.replace("#", "")

		let results = await wordpos.lookup(preword);
		let synonyms_full = results.map(x => x.def)
		let singled = []
		synonyms_full.forEach(element => {
			singled = singled.concat(element)
		});
		let synonyms = [...new Set(singled)];
		let items = synonyms.map(x => new vscode.CompletionItem(x, vscode.CompletionItemKind.Snippet));
		items.forEach(item => {
			item.additionalTextEdits = [vscode.TextEdit.delete(new vscode.Range(linenumb, char1, linenumb, char2))]
		});

		return items;
	}
	return [];
}


export function activate(context: vscode.ExtensionContext) {

	const synonymprovider = vscode.languages.registerCompletionItemProvider(
		{ scheme: 'file' },
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				return findSynonyms(document, position);
			}
		},
		':','#'

	);
	context.subscriptions.push(synonymprovider);
}
