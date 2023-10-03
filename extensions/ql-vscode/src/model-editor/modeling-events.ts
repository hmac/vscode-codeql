import { App } from "../common/app";
import { DisposableObject } from "../common/disposable-object";
import { AppEvent, AppEventEmitter } from "../common/events";
import { DatabaseItem } from "../databases/local-databases";
import { Method, Usage } from "./method";
import { ModeledMethod } from "./modeled-method";

interface MethodsChangedEvent {
  methods: Method[];
  dbUri: string;
  isActiveDb: boolean;
}

interface HideModeledMethodsChangedEvent {
  hideModeledMethods: boolean;
  isActiveDb: boolean;
}

interface ModeledMethodsChangedEvent {
  modeledMethods: Record<string, ModeledMethod>;
  dbUri: string;
  isActiveDb: boolean;
}

interface ModifiedMethodsChangedEvent {
  modifiedMethods: Set<string>;
  dbUri: string;
  isActiveDb: boolean;
}

interface SelectedMethodChangedEvent {
  databaseItem: DatabaseItem;
  method: Method;
  usage: Usage;
  modeledMethod: ModeledMethod | undefined;
  isModified: boolean;
}

interface RevealInModelEditorEvent {
  dbUri: string;
  method: Method;
}

export class ModelingEvents extends DisposableObject {
  public readonly onActiveDbChanged: AppEvent<void>;
  public readonly onDbClosed: AppEvent<string>;
  public readonly onMethodsChanged: AppEvent<MethodsChangedEvent>;
  public readonly onHideModeledMethodsChanged: AppEvent<HideModeledMethodsChangedEvent>;
  public readonly onModeledMethodsChanged: AppEvent<ModeledMethodsChangedEvent>;
  public readonly onModifiedMethodsChanged: AppEvent<ModifiedMethodsChangedEvent>;
  public readonly onSelectedMethodChanged: AppEvent<SelectedMethodChangedEvent>;
  public readonly onRevealInModelEditor: AppEvent<RevealInModelEditorEvent>;

  private readonly onActiveDbChangedEventEmitter: AppEventEmitter<void>;
  private readonly onDbClosedEventEmitter: AppEventEmitter<string>;
  private readonly onMethodsChangedEventEmitter: AppEventEmitter<MethodsChangedEvent>;
  private readonly onHideModeledMethodsChangedEventEmitter: AppEventEmitter<HideModeledMethodsChangedEvent>;
  private readonly onModeledMethodsChangedEventEmitter: AppEventEmitter<ModeledMethodsChangedEvent>;
  private readonly onModifiedMethodsChangedEventEmitter: AppEventEmitter<ModifiedMethodsChangedEvent>;
  private readonly onSelectedMethodChangedEventEmitter: AppEventEmitter<SelectedMethodChangedEvent>;
  private readonly onRevealInModelEditorEventEmitter: AppEventEmitter<RevealInModelEditorEvent>;

  constructor(app: App) {
    super();

    this.onActiveDbChangedEventEmitter = this.push(
      app.createEventEmitter<void>(),
    );
    this.onActiveDbChanged = this.onActiveDbChangedEventEmitter.event;

    this.onDbClosedEventEmitter = this.push(app.createEventEmitter<string>());
    this.onDbClosed = this.onDbClosedEventEmitter.event;

    this.onMethodsChangedEventEmitter = this.push(
      app.createEventEmitter<MethodsChangedEvent>(),
    );
    this.onMethodsChanged = this.onMethodsChangedEventEmitter.event;

    this.onHideModeledMethodsChangedEventEmitter = this.push(
      app.createEventEmitter<HideModeledMethodsChangedEvent>(),
    );
    this.onHideModeledMethodsChanged =
      this.onHideModeledMethodsChangedEventEmitter.event;

    this.onModeledMethodsChangedEventEmitter = this.push(
      app.createEventEmitter<ModeledMethodsChangedEvent>(),
    );
    this.onModeledMethodsChanged =
      this.onModeledMethodsChangedEventEmitter.event;

    this.onModifiedMethodsChangedEventEmitter = this.push(
      app.createEventEmitter<ModifiedMethodsChangedEvent>(),
    );
    this.onModifiedMethodsChanged =
      this.onModifiedMethodsChangedEventEmitter.event;

    this.onSelectedMethodChangedEventEmitter = this.push(
      app.createEventEmitter<SelectedMethodChangedEvent>(),
    );
    this.onSelectedMethodChanged =
      this.onSelectedMethodChangedEventEmitter.event;

    this.onRevealInModelEditorEventEmitter = this.push(
      app.createEventEmitter<RevealInModelEditorEvent>(),
    );
    this.onRevealInModelEditor = this.onRevealInModelEditorEventEmitter.event;
  }

  public fireMethodsChanged(
    methods: Method[],
    dbUri: string,
    isActiveDb: boolean,
  ): void {
    this.onMethodsChangedEventEmitter.fire({
      methods,
      dbUri,
      isActiveDb,
    });
  }

  public fireActiveDbChanged(): void {
    this.onActiveDbChangedEventEmitter.fire();
  }

  public fireDbClosed(dbUri: string): void {
    this.onDbClosedEventEmitter.fire(dbUri);
  }

  public fireHideModeledMethodsChanged(
    hideModeledMethods: boolean,
    isActiveDb: boolean,
  ): void {
    this.onHideModeledMethodsChangedEventEmitter.fire({
      hideModeledMethods,
      isActiveDb,
    });
  }

  public fireSelectedMethodChanged(
    databaseItem: DatabaseItem,
    method: Method,
    usage: Usage,
    modeledMethod: ModeledMethod | undefined,
    isModified: boolean,
  ): void {
    this.onSelectedMethodChangedEventEmitter.fire({
      databaseItem,
      method,
      usage,
      modeledMethod,
      isModified,
    });
  }

  public fireModifiedMethodsChanged(
    modifiedMethods: Set<string>,
    dbUri: string,
    isActiveDb: boolean,
  ): void {
    this.onModifiedMethodsChangedEventEmitter.fire({
      modifiedMethods,
      dbUri,
      isActiveDb,
    });
  }

  public fireModeledMethodsChanged(
    modeledMethods: Record<string, ModeledMethod>,
    dbUri: string,
    isActiveDb: boolean,
  ): void {
    this.onModeledMethodsChangedEventEmitter.fire({
      modeledMethods,
      dbUri,
      isActiveDb,
    });
  }

  public fireRevealInModelEditor(dbUri: string, method: Method): void {
    this.onRevealInModelEditorEventEmitter.fire({
      dbUri,
      method,
    });
  }
}
