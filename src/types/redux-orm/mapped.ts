import {
  Class,
  DeepRequired,
  OptionalKeys,
  PickByValue,
  RequiredKeys,
  SetIntersection
} from 'utility-types'
import {
  AttributeField,
  Entity,
  EntityKeys,
  EntitySchema,
  ManyToOneField,
  Primitive,
  RelationField,
  RelationType
} from '../schema'
import { OrmModel } from './aliases'

export {
  Ref,
  ModelAttributeFields,
  ModelRelationField,
  ModelRelationFields,
  Model,
  QuerySet,
  MutableQuerySet,
  Repository,
  Repositories,
  TypedModel
}

type ModelAttributeFields<E extends Entity<E>> = {
  [K in EntityKeys.Attributes<E>]: E[K] extends AttributeField<E, infer R>
    ? R
    : never
}

type ModelRelationField<
  E extends Entity<E>,
  K extends EntityKeys.Relations<E, RelationType>
> = E[K] extends RelationField<infer RKind, E, infer To, infer K>
  ? RKind extends 'OneToOne' | 'ManyToOne'
    ? Model<To>
    : RKind extends 'OneToMany'
    ? QuerySet<To>
    : RKind extends 'ManyToMany'
    ? MutableQuerySet<To>
    : never
  : never

type ModelRelationFields<E extends Entity<E>> = {
  [K in EntityKeys.Relations<E, RelationType>]: ModelRelationField<E, K>
}

/**
 * @internal
 */
type RequiredRef<E extends Entity<E>> = {
  [K in SetIntersection<
    RequiredKeys<E>,
    keyof PickByValue<
      E,
      { fieldType: 'ManyToOne' } | { fieldType: 'Attribute' }
    >
  >]-?: E[K] extends AttributeField<any, infer R>
    ? R
    : E[K] extends ManyToOneField<E, any, any>
    ? string
    : never
}

/**
 * @internal
 */
type OptionalRef<
  E extends Entity<E>,
  T = DeepRequired<Pick<E, OptionalKeys<E>>>
> = {
  [K in keyof T]+?: T[K] extends AttributeField<any, infer R>
    ? R
    : T[K] extends { fieldType: 'ManyToOne' }
    ? string
    : never
}

type Ref<E extends Entity<E>> = RequiredRef<E> & OptionalRef<E>

type Model<E extends Entity<E>> = ModelAttributeFields<E> &
  ModelRelationFields<E> & { ref: Ref<E> }

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
    iterateeArray: QuerySet.SortIteratee<E>[],
    orders: QuerySet.SortOrder[]
  ): QuerySet<E>

  update(props: Partial<Ref<E>>): void

  delete(): void
}

namespace QuerySet {
  export type SortOrder = 'asc' | true | 'desc' | false

  export type SortIteratee<E extends Entity<E>> =
    | keyof Model<E>
    | { (model: Model<E>): Primitive }
}

interface MutableQuerySet<E extends Entity<E>> extends QuerySet<E> {
  add: (idOrModel: string | Model<E>) => void
  remove: (idOrModel: string | Model<E>) => void
}

interface Dao<E extends Entity<E>> {
  create: (props: Ref<E>) => Model<E>
  upsert: (props: Partial<Ref<E>>) => Model<E>
  withId: (id: string) => Model<E> | null
  hasId: (id: string) => boolean
}

interface Repository<E extends Entity<E>> extends Dao<E>, QuerySet<E> {}

type Repositories<E extends EntitySchema> = {
  [k in keyof E]: E[k] extends Class<Entity<infer R>> ? Repository<R> : never
}

class TypedModel<E extends Entity<E>> extends OrmModel<
  ModelAttributeFields<E>,
  ModelRelationFields<E>
> {}
