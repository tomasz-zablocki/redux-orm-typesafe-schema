import { Class } from 'utility-types'
import { ActionType } from 'typesafe-actions'
import {
  AttributeField,
  EntityBuilders,
  Serializable,
  Supplier
} from './fields'
import { Repositories, Repository } from '../redux-orm'
import OneToOneBuilder = EntityBuilders.OneToOneBuilder
import ManyToManyBuilder = EntityBuilders.ManyToManyBuilder
import ManyToOneBuilder = EntityBuilders.ManyToOneBuilder
import OneToManyBuilder = EntityBuilders.OneToManyBuilder

export {
  FieldType,
  Field,
  RelationType,
  RelationField,
  AttributeField,
  OneToOneField,
  OneToManyField,
  ManyToOneField,
  ManyToManyField,
  EntityKeys,
  EntityBuilders
} from './fields'

abstract class Entity<E extends Entity<E>> {
  readonly _entityClass: Class<E>
  abstract readonly modelName: string

  constructor() {
    this._entityClass = this.constructor as Class<E>
  }

  entityClass() {
    return this._entityClass
  }

  reduce<TActionType extends ActionType<any>>(
    action: TActionType,
    repository: Repository<E>,
    repositories?: Repositories<any>
  ): void {}

  attribute<ValueType extends Serializable>(
    supplier?: Supplier<ValueType>
  ): AttributeField<E, ValueType> {
    return {
      fieldType: 'Attribute',
      from: this._entityClass,
      virtual: false,
      supplier
    }
  }

  oneToOne: OneToOneBuilder<E> = to => {
    return {
      ref: reverseField => ({
        fieldType: 'OneToOne',
        virtual: false,
        from: this._entityClass,
        to,
        reverseField
      }),
      virtualRef: reverseField => ({
        fieldType: 'OneToOne',
        virtual: true,
        from: this._entityClass,
        to,
        reverseField
      })
    }
  }

  oneToMany: OneToManyBuilder<E> = to => ({
    ref: reverseField => ({
      fieldType: 'OneToMany',
      virtual: true,
      from: this._entityClass,
      to,
      reverseField
    })
  })

  manyToOne: ManyToOneBuilder<E> = to => {
    const build = (options?: {}) => ({
      fieldType: 'ManyToOne' as const,
      virtual: false,
      from: this._entityClass,
      to,
      ...options
    })

    return {
      ref: reverseField => build({ reverseField }),
      noRef: build
    }
  }

  manyToMany: ManyToManyBuilder<E> = to => ({
    through: through => ({
      virtualRef: (reverseField, throughReverseField) => ({
        fieldType: 'ManyToMany',
        virtual: true,
        from: this._entityClass,
        to,
        through,
        reverseField,
        throughReverseField
      }),
      ref: (reverseField, throughReverseField) => ({
        fieldType: 'ManyToMany',
        virtual: false,
        from: this._entityClass,
        to,
        through,
        reverseField,
        throughReverseField
      })
    })
  })
}

export { Entity }
