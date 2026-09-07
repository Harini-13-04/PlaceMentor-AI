import { describe, it, expect } from "vitest";
import { EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { sql } from "@codemirror/lang-sql";
import { indentUnit, indentOnInput, bracketMatching } from "@codemirror/language";
import { defaultKeymap, historyKeymap, indentWithTab, insertNewlineAndIndent, indentMore, indentLess } from "@codemirror/commands";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { keymap, EditorView } from "@codemirror/view";

function createEditor(initialDoc: string, langExtension: any, indentStr: string = "    ") {
  const parent = document.createElement("div");
  const tabSize = indentStr.length;
  const view = new EditorView({
    state: EditorState.create({
      doc: initialDoc,
      selection: { anchor: initialDoc.length },
      extensions: [
        langExtension,
        indentUnit.of(indentStr),
        EditorState.tabSize.of(tabSize),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...historyKeymap,
          indentWithTab,
        ]),
      ],
    }),
    parent,
  });
  return view;
}

describe("CodeMirror Indentation via EditorView", () => {
  it("Python: indents automatically when pressing Enter after def test():", () => {
    const view = createEditor("def test():", python());
    insertNewlineAndIndent(view);
    expect(view.state.doc.toString()).toBe("def test():\n    ");
    view.destroy();
  });

  it("Python: indents automatically when pressing Enter after nested if True:", () => {
    const view = createEditor("def test():\n    if True:", python());
    insertNewlineAndIndent(view);
    expect(view.state.doc.toString()).toBe("def test():\n    if True:\n        ");
    view.destroy();
  });

  it("Python: preserves indentation level on normal statements", () => {
    const view = createEditor("def test():\n    x = 10", python());
    insertNewlineAndIndent(view);
    expect(view.state.doc.toString()).toBe("def test():\n    x = 10\n    ");
    view.destroy();
  });

  it("Java: indents automatically when pressing Enter after open brace {", () => {
    const view = createEditor("public class Solution {", java());
    insertNewlineAndIndent(view);
    expect(view.state.doc.toString()).toBe("public class Solution {\n    ");
    view.destroy();
  });

  it("Java: indents nested method and statement blocks", () => {
    const view = createEditor("public class Solution {\n    public void test() {", java());
    insertNewlineAndIndent(view);
    expect(view.state.doc.toString()).toMatch(/public void test\(\) \{\n\s+/);
    view.destroy();
  });

  it("C++: indents automatically when pressing Enter after open brace {", () => {
    const view = createEditor("void solve() {", cpp());
    insertNewlineAndIndent(view);
    expect(view.state.doc.toString()).toBe("void solve() {\n    ");
    view.destroy();
  });

  it("JavaScript: indents with 2 spaces when pressing Enter after function {", () => {
    const view = createEditor("function solve() {", javascript(), "  ");
    insertNewlineAndIndent(view);
    expect(view.state.doc.toString()).toBe("function solve() {\n  ");
    view.destroy();
  });

  it("Tab and Shift-Tab keys: indents and outdents properly", () => {
    const view = createEditor("x = 1", python());
    // Move cursor to start of line
    view.dispatch({ selection: { anchor: 0 } });
    indentMore(view);
    expect(view.state.doc.toString()).toBe("    x = 1");

    indentLess(view);
    expect(view.state.doc.toString()).toBe("x = 1");
    view.destroy();
  });
});
