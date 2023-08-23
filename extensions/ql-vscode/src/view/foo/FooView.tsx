import * as React from "react";
import { useEffect } from "react";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";

export function FooView(): JSX.Element {
  useEffect(() => {
    const listener = (evt: MessageEvent) => {
      if (evt.origin === window.origin) {
        // ....
      } else {
        // sanitize origin
        const origin = evt.origin.replace(/\n|\r/g, "");
        console.error(`Invalid event origin ${origin}`);
      }
    };
    window.addEventListener("message", listener);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, []);

  return <VSCodeButton>Click me</VSCodeButton>;
}
