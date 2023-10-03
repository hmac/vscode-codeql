import { DisposableObject } from "../common/disposable-object";
import { DatabaseItem } from "../databases/local-databases";
import { Method, Usage } from "./method";
import { ModeledMethod } from "./modeled-method";
import { ModelingEvents } from "./modeling-events";
import { INITIAL_HIDE_MODELED_METHODS_VALUE } from "./shared/hide-modeled-methods";

export interface DbModelingState {
  databaseItem: DatabaseItem;
  methods: Method[];
  hideModeledMethods: boolean;
  modeledMethods: Record<string, ModeledMethod>;
  modifiedMethodSignatures: Set<string>;
  selectedMethod: Method | undefined;
  selectedUsage: Usage | undefined;
}

export class ModelingStore extends DisposableObject {
  private readonly state: Map<string, DbModelingState>;
  private activeDb: string | undefined;

  constructor(private readonly modelingEvents: ModelingEvents) {
    super();

    this.state = new Map<string, DbModelingState>();
  }

  public initializeStateForDb(databaseItem: DatabaseItem) {
    const dbUri = databaseItem.databaseUri.toString();
    this.state.set(dbUri, {
      databaseItem,
      methods: [],
      hideModeledMethods: INITIAL_HIDE_MODELED_METHODS_VALUE,
      modeledMethods: {},
      modifiedMethodSignatures: new Set(),
      selectedMethod: undefined,
      selectedUsage: undefined,
    });
  }

  public setActiveDb(databaseItem: DatabaseItem) {
    this.activeDb = databaseItem.databaseUri.toString();
    this.modelingEvents.fireActiveDbChanged();
  }

  public removeDb(databaseItem: DatabaseItem) {
    const dbUri = databaseItem.databaseUri.toString();

    if (!this.state.has(dbUri)) {
      throw Error("Cannot remove a database that has not been initialized");
    }

    if (this.activeDb === dbUri) {
      this.activeDb = undefined;
      this.modelingEvents.fireActiveDbChanged();
    }

    this.state.delete(dbUri);
    this.modelingEvents.fireDbClosed(dbUri);
  }

  public getStateForActiveDb(): DbModelingState | undefined {
    if (!this.activeDb) {
      return undefined;
    }

    return this.state.get(this.activeDb);
  }

  public setMethods(dbItem: DatabaseItem, methods: Method[]) {
    const dbState = this.getState(dbItem);
    const dbUri = dbItem.databaseUri.toString();

    dbState.methods = [...methods];

    this.modelingEvents.fireMethodsChanged(
      methods,
      dbUri,
      dbUri === this.activeDb,
    );
  }

  public setHideModeledMethods(
    dbItem: DatabaseItem,
    hideModeledMethods: boolean,
  ) {
    const dbState = this.getState(dbItem);
    const dbUri = dbItem.databaseUri.toString();

    dbState.hideModeledMethods = hideModeledMethods;

    this.modelingEvents.fireHideModeledMethodsChanged(
      hideModeledMethods,
      dbUri === this.activeDb,
    );
  }

  public addModeledMethods(
    dbItem: DatabaseItem,
    methods: Record<string, ModeledMethod>,
  ) {
    this.changeModeledMethods(dbItem, (state) => {
      const newModeledMethods = {
        ...methods,
        ...Object.fromEntries(
          Object.entries(state.modeledMethods).filter(
            ([_, value]) => value.type !== "none",
          ),
        ),
      };
      state.modeledMethods = newModeledMethods;
    });
  }

  public setModeledMethods(
    dbItem: DatabaseItem,
    methods: Record<string, ModeledMethod>,
  ) {
    this.changeModeledMethods(dbItem, (state) => {
      state.modeledMethods = { ...methods };
    });
  }

  public updateModeledMethod(dbItem: DatabaseItem, method: ModeledMethod) {
    this.changeModeledMethods(dbItem, (state) => {
      const newModeledMethods = { ...state.modeledMethods };
      newModeledMethods[method.signature] = method;
      state.modeledMethods = newModeledMethods;
    });
  }

  public setModifiedMethods(
    dbItem: DatabaseItem,
    methodSignatures: Set<string>,
  ) {
    this.changeModifiedMethods(dbItem, (state) => {
      state.modifiedMethodSignatures = new Set(methodSignatures);
    });
  }

  public addModifiedMethods(
    dbItem: DatabaseItem,
    methodSignatures: Iterable<string>,
  ) {
    this.changeModifiedMethods(dbItem, (state) => {
      const newModifiedMethods = new Set([
        ...state.modifiedMethodSignatures,
        ...methodSignatures,
      ]);
      state.modifiedMethodSignatures = newModifiedMethods;
    });
  }

  public addModifiedMethod(dbItem: DatabaseItem, methodSignature: string) {
    this.addModifiedMethods(dbItem, [methodSignature]);
  }

  public removeModifiedMethods(
    dbItem: DatabaseItem,
    methodSignatures: string[],
  ) {
    this.changeModifiedMethods(dbItem, (state) => {
      const newModifiedMethods = Array.from(
        state.modifiedMethodSignatures,
      ).filter((s) => !methodSignatures.includes(s));

      state.modifiedMethodSignatures = new Set(newModifiedMethods);
    });
  }

  public setSelectedMethod(dbItem: DatabaseItem, method: Method, usage: Usage) {
    const dbState = this.getState(dbItem);

    dbState.selectedMethod = method;
    dbState.selectedUsage = usage;

    this.modelingEvents.fireSelectedMethodChanged(
      dbItem,
      method,
      usage,
      dbState.modeledMethods[method.signature],
      dbState.modifiedMethodSignatures.has(method.signature),
    );
  }

  public getSelectedMethodDetails() {
    const dbState = this.getStateForActiveDb();
    if (!dbState) {
      throw new Error("No active state found in modeling store");
    }

    const selectedMethod = dbState.selectedMethod;
    if (!selectedMethod) {
      return undefined;
    }

    return {
      method: selectedMethod,
      usage: dbState.selectedUsage,
      modeledMethod: dbState.modeledMethods[selectedMethod.signature],
      isModified: dbState.modifiedMethodSignatures.has(
        selectedMethod.signature,
      ),
    };
  }

  private getState(databaseItem: DatabaseItem): DbModelingState {
    if (!this.state.has(databaseItem.databaseUri.toString())) {
      throw Error(
        "Cannot get state for a database that has not been initialized",
      );
    }

    return this.state.get(databaseItem.databaseUri.toString())!;
  }

  private changeModifiedMethods(
    dbItem: DatabaseItem,
    updateState: (state: DbModelingState) => void,
  ) {
    const state = this.getState(dbItem);

    updateState(state);

    this.modelingEvents.fireModifiedMethodsChanged(
      state.modifiedMethodSignatures,
      dbItem.databaseUri.toString(),
      dbItem.databaseUri.toString() === this.activeDb,
    );
  }

  private changeModeledMethods(
    dbItem: DatabaseItem,
    updateState: (state: DbModelingState) => void,
  ) {
    const state = this.getState(dbItem);

    updateState(state);

    this.modelingEvents.fireModeledMethodsChanged(
      state.modeledMethods,
      dbItem.databaseUri.toString(),
      dbItem.databaseUri.toString() === this.activeDb,
    );
  }
}
