import * as vscode from "vscode";
import { WebviewViewProvider } from "vscode";
import { getHtmlForWebview } from "../../common/vscode/webview-html";

export class FooViewProvider implements WebviewViewProvider {
  public static readonly viewType = "codeQLModelFoo";

  constructor(private readonly context: vscode.ExtensionContext) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri],
    };

    const html = getHtmlForWebview(this.context, webviewView.webview, "foo", {
      allowInlineStyles: true,
      allowWasmEval: false,
    });

    webviewView.webview.html = html;
  }
}
