import { ExtensionContext, window } from "vscode";
import { DisposableObject } from "../../common/disposable-object";
import { FooViewProvider } from "./foo-provider";

export class FooPanel extends DisposableObject {
  constructor(context: ExtensionContext) {
    const provider = new FooViewProvider(context);

    context.subscriptions.push(
      window.registerWebviewViewProvider(FooViewProvider.viewType, provider),
    );

    super();
  }
}
