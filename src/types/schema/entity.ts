import { Class } from 'utility-types'
import {
  AttributeField,
  EntityBuilders,
  EntityKeys,
  RelationType,
  ReverseRelation,
  Serializable,
  Supplier
} from './fields'
import { Repository, Session } from '../redux-orm'
import { AnyAction } from 'redux'
import RelationBuilder = EntityBuilders.RelationBuilder
import ManyToManyBuilder = EntityBuilders.ManyToManyBuilder

export {
  FieldType,
  Field,
  RelationType,
  RelationField,
  AttributeField,
  ManyToManyField,
  EntityKeys,
  EntityBuilders
} from './fields'

abstract class Entity<E extends Entity<E>> {
  abstract readonly modelName: string

  entityClass(): Class<E> {
    return this.constructor as Class<E>
  }

  reduce(
    action: AnyAction,
    repository: Repository<E>,
    repositories?: Session<any>
  ): void {}

  attribute<ValueType extends Serializable>(
    supplier?: Supplier<ValueType>
  ): AttributeField<E, ValueType> {
    return {
      fieldType: 'Attribute',
      from: this.entityClass(),
      supplier
    }
  }

  oneToOne: RelationBuilder<E, 'OneToOne'> = to => ({
    ref: reverseField => this._ref(to, 'OneToOne', reverseField)
  })

  oneToMany: RelationBuilder<E, 'OneToMany'> = to => ({
    ref: reverseField => this._ref(to, 'OneToMany', reverseField)
  })

  manyToOne: RelationBuilder<E, 'ManyToOne'> = to => ({
    ref: reverseField => this._ref(to, 'ManyToOne', reverseField)
  })

  manyToMany: ManyToManyBuilder<E> = to => ({
    through: through => ({
      ref: (reverseField, throughReverseField) => ({
        ...this._ref(to, 'ManyToMany', reverseField),
        through,
        throughReverseField
      })
    })
  })

  private _ref = <To extends Entity<To>, TRelation extends RelationType>(
    to: Class<To>,
    fieldType: TRelation,
    reverseField?: EntityKeys.RelationKeys<To, E, ReverseRelation<TRelation>>
  ) => ({ to, from: this.entityClass(), reverseField, fieldType })
}

export { Entity }
