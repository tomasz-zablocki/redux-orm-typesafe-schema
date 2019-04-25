declare module 'redux-orm' {
  export interface ORMId {
    id: string
  }

  export interface TableState<Item = any, Meta = any> {
    items: string[]
    itemsById: { [index: string]: Item }
    meta: Meta
  }

  export interface ORMCommonState {
    [index: string]: TableState
  }

  export type SessionWithModels<State extends ORMCommonState> = Session<State> &
    { [P in keyof State]: typeof Model }

  export type ModelWithFields<Fields, VirtualFields = {}> = Model<
    Fields,
    VirtualFields
  > &
    Fields &
    VirtualFields
  export type ModelProps = any

  export interface DB {
    getEmptyState: any
    query: any
    update: any
    describe: any
  }

  export interface SchemaSpec {
    tables: any
  }

  export interface ORMOpts {
    createDatabase: (schemaSpec: SchemaSpec) => any
  }

  export interface ModelFields {
    [index: string]: Attribute | ForeignKey | ManyToMany | OneToOne
  }

  export interface ModelVirtualFields {
    [index: string]: any
  }

  export class ORM<State extends ORMCommonState = ORMCommonState> {
    constructor(opts?: ORMOpts)

    register(...model: Array<typeof Model>): void
    register<M>(...model: Array<M[keyof M]>): void

    registerManyToManyModelsFor(model: typeof Model): void

    get(modelName: string): typeof Model

    getModelClasses(): Array<typeof Model>

    isFieldInstalled(modelName: string, fieldName: string): boolean

    setFieldInstalled(modelName: string, fieldName: string): void

    generateSchemaSpec(): SchemaSpec

    getDatabase(): DB

    getEmptyState(): State

    session(state: State): SessionWithModels<State>

    mutableSession(state: State): SessionWithModels<State>

    private _attachQuerySetMethods(model: typeof Model): void

    private _setupModelPrototypes(models: Array<typeof Model>): void
  }

  export class Model<Fields, VirtualFields = {}> {
    static readonly idAttribute: string
    static readonly session: SessionWithModels<any>
    static readonly _sessionData: any // TODO
    static readonly query: QuerySet<any>

    static modelName: string
    static fields: ModelFields
    static virtualFields: ModelVirtualFields
    static querySetClass: typeof QuerySet

    static toString(): string

    static options(): object

    static _getTableOpts(): object

    static markAccessed(): void

    static connect(session: Session<ORMCommonState>): void

    static getQuerySet(): QuerySet<any>

    static invalidateClassCache(): void

    readonly ref: Fields

    static all(): QuerySet<any, any>

    static create<Fields>(props: Fields): ModelWithFields<Fields, any>

    static upsert<Fields>(props: Partial<Fields>): ModelWithFields<Fields, any>

    static hasId(id: string): boolean

    static _findDatabaseRows(lookupObj: object): any // TODO

    static withId(id: string): ModelWithFields<any, any> | null

    static reducer(
      action: any,
      modelClass: typeof Model,
      session: SessionWithModels<ORMCommonState>
    ): any

    static get(lookupObj: object): ModelWithFields<any, any>

    constructor(props: ModelProps)

    getClass(): string

    getId(): string

    toString(): string

    equals(otherModel: ModelWithFields<any, any>): boolean

    set(propertyName: string, value: any): void

    update(userMergeObj: Partial<Fields>): void

    refreshFromState(): void

    delete(): void

    private _onDelete(): void

    private _initFields(props: ModelProps): void

    private _refreshMany2Many(relations: any): void // TODO
  }

  export type QuerySetClauses = any // TODO

  export type QuerySetOpts = any // TODO

  export class QuerySet<Fields, VirtualFields = {}> {
    static addSharedMethod(methodName: string): void

    constructor(
      modelClass: typeof Model,
      clauses: QuerySetClauses,
      opts: QuerySetOpts
    )

    toString(): string

    toRefArray(): ReadonlyArray<Fields & ORMId>

    toModelArray(): ReadonlyArray<ModelWithFields<Fields, VirtualFields>>

    count(): number

    exists(): boolean

    at(index: number): ModelWithFields<Fields, VirtualFields> | undefined

    first(): ModelWithFields<Fields, VirtualFields> | undefined

    last(): ModelWithFields<Fields, VirtualFields> | undefined

    all(): QuerySet<Fields, VirtualFields>

    filter(lookupObj: object): QuerySet<Fields, VirtualFields>

    exclude(lookupObj: object): QuerySet<Fields, VirtualFields>

    orderBy(iteratees: any, orders: any): QuerySet<Fields, VirtualFields>

    update(mergeObj: Partial<Fields>): void

    delete(): void

    private _evaluate(): void

    private _new(
      clauses: QuerySetClauses,
      userOpts: QuerySetOpts
    ): QuerySet<Fields, VirtualFields>
  }

  export class Session<State extends ORMCommonState> {
    readonly accessedModels: string[]
    schema: ORM<State>
    db: DB
    initialState: State
    withMutations: boolean
    batchToken: any
    sessionBoundModels: Array<typeof Model>
    models: Array<typeof Model>
    state: State

    constructor(
      schema: ORM<State>,
      db: DB,
      state: State,
      withMutations: boolean,
      batchToken: any
    ) // TODO

    markAccessed(modelName: string): void

    getDataForModel(modelName: string): object

    applyUpdate(updateSpec: any): any // TODO
    query(querySpec: any): any // TODO
  }

  export interface AttributeOpts {
    getDefault?: () => any
  }

  export interface RelationalFieldOpts {
    to: string
    relatedName?: string
    through?: string
    throughFields?: {
      to: string
      from: string
    }
  }

  export function attr(opts?: AttributeOpts): Attribute

  export function fk(toModelName: string, relatedName?: string): ForeignKey
  export function fk(opts: RelationalFieldOpts): ForeignKey

  export function many(toModelName: string, relatedName?: string): ManyToMany
  export function many(opts: RelationalFieldOpts): ManyToMany

  export function oneToOne(toModelName: string, relatedName?: string): OneToOne
  export function oneToOne(opts: RelationalFieldOpts): OneToOne

  export type Updater<State extends ORMCommonState> = (
    session: SessionWithModels<State>,
    action: any
  ) => any

  export function createReducer<State extends ORMCommonState = ORMCommonState>(
    orm: ORM<State>,
    updater?: Updater<State>
  ): (state: State, action: any) => State

  export type ORMSelector<
    State extends ORMCommonState,
    S = {},
    Result = any
  > = (session: Session<State>, ...args: any[]) => Result

  export function createSelector<
    State extends ORMCommonState = ORMCommonState,
    S = {}
  >(
    orm: ORM<State>,
    ...args: Array<ORMSelector<State, S>>
  ): (state: State) => any

  class Field {}
  class Attribute extends Field {}
  class OneToOne extends Field {}
  class ManyToMany extends Field {}
  class ForeignKey extends Field {}
}
