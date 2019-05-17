import { Entity } from './entity'
import { Class, PickByValue, SetDifference } from 'utility-types'

type Primitive = number | string | boolean

type Serializable =
  | Primitive
  | Primitive[]
  | undefined
  | {
      [K: string]: Serializable | Serializable[]
    }
type Supplier<T> = () => T

export {
  Primitive,
  Serializable,
  FieldType,
  Field,
  Supplier,
  AttributeField,
  RelationType,
  RelationField,
  ManyToManyField,
  EntityKeys,
  EntityBuilders
}

type FieldType =
  | 'Attribute'
  | 'OneToOne'
  | 'OneToMany'
  | 'ManyToOne'
  | 'ManyToMany'

export type ReverseRelation<
  TRelation extends RelationType
> = TRelation extends 'OneToOne'
  ? 'OneToOne'
  : TRelation extends 'ManyToMany'
  ? 'ManyToMany'
  : TRelation extends 'OneToMany'
  ? 'ManyToOne'
  : 'OneToMany' | 'OneToMany'

type Field =
  | AttributeField<any, any>
  | RelationField<'OneToOne' | 'OneToMany' | 'ManyToOne', any, any, any>
  | ManyToManyField<any, any, any, any, any>

interface EntityField<FType extends FieldType, From extends Entity<From>> {
  readonly fieldType: FType
  readonly from: Class<From>
}

interface AttributeField<
  From extends Entity<From>,
  ValueType extends Serializable
> extends EntityField<'Attribute', From> {
  readonly fieldType: 'Attribute'
  readonly supplier?: Supplier<ValueType>
}

type RelationType = SetDifference<FieldType, 'Attribute'>

interface RelationField<
  TRelationType extends RelationType = any,
  From extends Entity<From> = any,
  To extends Entity<To> = any,
  TReverseField extends keyof To = any
> extends EntityField<TRelationType, From> {
  readonly to: Class<To>
  readonly reverseField?: TReverseField
}

namespace EntityKeys {
  export type RelationKeys<
    From extends Entity<From>,
    To extends Entity<To>,
    TRelationType extends RelationType
  > = {
    [K in keyof From]-?: Required<From>[K] extends RelationField<
      TRelationType,
      From,
      To,
      infer R
    >
      ? K
      : never
  }[keyof From]

  export type Attribute<E extends Entity<E>> = keyof PickByValue<
    Required<E>,
    AttributeField<E, any>
  >

  export type Relation<
    E extends Entity<E>,
    TRelationType extends RelationType
  > = keyof PickByValue<Required<E>, RelationField<TRelationType, E, any, any>>
}

interface ManyToManyField<
  From extends Entity<From>,
  To extends Entity<To>,
  Through extends Entity<Through>,
  TReverseField extends EntityKeys.RelationKeys<To, From, 'ManyToMany'>,
  TThroughReverseField extends EntityKeys.RelationKeys<To, From, 'ManyToMany'>
> extends RelationField<'ManyToMany', From, To, TReverseField> {
  readonly fieldType: 'ManyToMany'
  readonly through: Class<Through>
  readonly throughReverseField: TThroughReverseField
}

namespace EntityBuilders {
  export interface RelationBuilder<
    From extends Entity<From>,
    TRelation extends RelationType
  > {
    <To extends Entity<To>>(to: Class<To>): {
      ref(
        reverseField?: EntityKeys.RelationKeys<
          To,
          From,
          ReverseRelation<TRelation>
        >
      ): RelationField<TRelation, From, To>
    }
  }

  export interface ManyToManyBuilder<From extends Entity<From>> {
    <To extends Entity<To>>(to: Class<To>): {
      through: <Through extends Entity<Through>>(
        through: Class<Through>
      ) => {
        ref(
          reverseField: EntityKeys.RelationKeys<To, From, 'ManyToMany'>,
          throughField: EntityKeys.RelationKeys<Through, From, 'ManyToOne'>
        ): ManyToManyField<From, To, Through, any, any>
      }
    }
  }
}
