import {
  Class,
  OptionalKeys,
  Overwrite,
  PickByValue,
  RequiredKeys,
  SetIntersection
} from 'utility-types'
// noinspection ES6UnusedImports
import {
  AttributeField,
  Entity,
  EntityKeys,
  EntitySchema,
  Primitive,
  RelationField,
  RelationType
} from '../schema'
import { OrmModel, OrmSession } from './aliases'

export {
  OrmSelector,
  RefFieldTypes,
  RequiredRef,
  OptionalRef,
  Ref,
  ModelAttributeFields,
  ModelRelationField,
  ModelRelationFields,
  Model,
  QuerySet,
  MutableQuerySet,
  Repository,
  Session,
  TypedModel,
  UpdatePayload
}

type ModelAttributeFields<
  E extends Entity<E>,
  T = Pick<E, EntityKeys.Attribute<E>>
> = { [K in keyof T]: T[K] extends AttributeField<E, infer R> ? R : T[K] }

type ModelRelationField<
  E extends Entity<E>,
  K extends EntityKeys.Relation<E, RelationType>
> = Required<E>[K] extends RelationField<infer RKind, E, infer To, infer K>
  ? RKind extends 'OneToOne' | 'ManyToOne'
    ? Model<To>
    : RKind extends 'OneToMany'
    ? QuerySet<To>
    : MutableQuerySet<To>
  : never

type ModelRelationFields<E extends Entity<E>> = {
  [K in EntityKeys.Relation<E, RelationType>]: ModelRelationField<E, K>
}

type RefFieldTypes =
  | { fieldType: 'ManyToOne' }
  | { fieldType: 'OneToOne' }
  | { fieldType: 'Attribute' }

type RequiredRef<E extends Entity<E>> = {
  [K in SetIntersection<
    RequiredKeys<E>,
    keyof PickByValue<E, RefFieldTypes>
  >]: E[K] extends AttributeField<E, infer R> ? R : string | TypedModel<any>
}

type OptionalRef<E extends Entity<E>> = {
  [K in SetIntersection<
    OptionalKeys<E>,
    keyof PickByValue<Required<E>, RefFieldTypes>
  >]?: Required<E>[K] extends AttributeField<E, infer R> ? R : string
}

type Ref<E extends Entity<E>> = RequiredRef<E> & OptionalRef<E>

type Model<E extends Entity<E>> = ModelAttributeFields<E> &
  ModelRelationFields<E> & {
    getId(): string
    delete(): void
    equals(otherModel: Model<any>): boolean
    getModelClass(): Class<TypedModel<E>>
    update(userMergeObj: Partial<Ref<E>>): void
    set<K extends keyof Ref<E>>(property: K, value: Ref<E>[K]): void
    ref: Ref<E>
  }

interface QuerySet<E extends Entity<E>> {
  toRefArray(): ReadonlyArray<Ref<E>>
  toModelArray(): ReadonlyArray<Model<E>>
  count(): number
  exists(): boolean
  at(index: number): Model<E> | undefined
  first(): Model<E> | undefined
  last(): Model<E> | undefined
  all(): QuerySet<E>
  filter(lookupObj: Partial<Ref<E>>): QuerySet<E>
  exclude(lookupObj: Partial<Ref<E>>): QuerySet<E>
  orderBy(
    iterateeArray: ReadonlyArray<QuerySet.SortIteratee<E>>,
    orders?: ReadonlyArray<QuerySet.SortOrder>
  ): QuerySet<E>
  update(props: Partial<Ref<E>>): void
  delete(): void
}

namespace QuerySet {
  export type SortOrder = 'asc' | 'desc'

  export type SortIteratee<E extends Entity<E>> =
    | keyof Ref<E>
    | { (model: Ref<E>): any }
}

interface MutableQuerySet<E extends Entity<E>> extends QuerySet<E> {
  add: (...entitiesToAdd: (Model<E> | string)[]) => void
  remove: (...entitiesToRemove: (Model<E> | string)[]) => void
  clear: () => void
}

interface Dao<E extends Entity<E>> {
  create: (props: Ref<E>) => Model<E>
  update: (props: Partial<Ref<E>>) => void
  upsert: (props: Partial<Ref<E>>) => Model<E>
  withId: (id: string) => Model<E> | null
  idExists: (id: string) => boolean
}

interface Repository<E extends Entity<E>> extends Dao<E>, QuerySet<E> {}

type Session<E extends EntitySchema> = {
  [k in keyof E]: E[k] extends Class<Entity<infer R>> ? Repository<R> : never
} &
  OrmSession & {}

class TypedModel<E extends Entity<E>> extends OrmModel<
  ModelAttributeFields<E>,
  ModelRelationFields<E>
> {}

type OrmSelector<E extends EntitySchema, Result> = (
  repositories: Session<E>
) => Result

type UpdatePayload<E extends object> = Overwrite<Partial<E>, { id: string }>
