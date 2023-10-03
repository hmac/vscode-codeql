import { mockedObject } from "../../vscode-tests/utils/mocking.helpers";
import { ModelingEvents } from "../../../src/model-editor/modeling-events";

export function createMockModelingEvents({
  onActiveDbChanged = jest.fn(),
  onDbClosed = jest.fn(),
  onMethodsChanged = jest.fn(),
  onHideModeledMethodsChanged = jest.fn(),
  onModeledMethodsChanged = jest.fn(),
  onModifiedMethodsChanged = jest.fn(),
}: {
  onActiveDbChanged?: ModelingEvents["onActiveDbChanged"];
  onDbClosed?: ModelingEvents["onDbClosed"];
  onMethodsChanged?: ModelingEvents["onMethodsChanged"];
  onHideModeledMethodsChanged?: ModelingEvents["onHideModeledMethodsChanged"];
  onModeledMethodsChanged?: ModelingEvents["onModeledMethodsChanged"];
  onModifiedMethodsChanged?: ModelingEvents["onModifiedMethodsChanged"];
} = {}): ModelingEvents {
  return mockedObject<ModelingEvents>({
    onActiveDbChanged,
    onDbClosed,
    onMethodsChanged,
    onHideModeledMethodsChanged,
    onModeledMethodsChanged,
    onModifiedMethodsChanged,
  });
}
