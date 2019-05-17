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

type Field =
  | AttributeField<any, any>
  | RelationField<any, any, any, any>
  | ManyToManyField<any, any, any, any, any>

interface EntityField<FType extends FieldType, From extends Entity<From>> {
  readonly fieldType: FType
  readonly virtual: boolean
  readonly from: Class<From>
}

interface AttributeField<
  From extends Entity<From>,
  ValueType extends Serializable
> extends EntityField<'Attribute', From> {
  readonly fieldType: 'Attribute'
  readonly supplier?: Supplier<ValueType>
  readonly virtual: false
}

type RelationType = SetDifference<FieldType, 'Attribute'>

interface RelationField<
  TRelationType extends RelationType,
  From extends Entity<From>,
  To extends Entity<To>,
  TReverseField extends keyof To
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
  export interface OneToOneBuilder<From extends Entity<From>> {
    <To extends Entity<To>>(to: Class<To>): {
      ref(
        reverseField: EntityKeys.RelationKeys<To, From, 'OneToOne'>
      ): RelationField<'OneToOne', From, To, any>
      virtualRef(
        reverseField: EntityKeys.RelationKeys<To, From, 'OneToOne'>
      ): RelationField<'OneToOne', From, To, any>
    }
  }

  export interface OneToManyBuilder<From extends Entity<From>> {
    <To extends Entity<To>>(to: Class<To>): {
      ref(
        reverseField: EntityKeys.RelationKeys<To, From, 'ManyToOne'>
      ): RelationField<'OneToMany', From, To, any>
    }
  }

  export interface ManyToOneBuilder<From extends Entity<From>> {
    <To extends Entity<To>>(to: Class<To>): {
      noRef(): RelationField<'ManyToOne', From, To, any>
      ref(
        reverseField: EntityKeys.RelationKeys<To, From, 'OneToMany'>
      ): RelationField<'ManyToOne', From, To, any>
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
        virtualRef(
          reverseField: EntityKeys.RelationKeys<To, From, 'ManyToMany'>,
          throughField: EntityKeys.RelationKeys<Through, From, 'ManyToOne'>
        ): ManyToManyField<From, To, Through, any, any>
      }
    }
  }
}
