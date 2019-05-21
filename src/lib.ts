import {
  Entity,
  EntitySchema,
  Field,
  RelationField,
  RelationType
} from './types/schema'
import {
  createOrmSelector,
  createReducer,
  Orm,
  OrmFields,
  OrmModelClass,
  OrmSelector,
  OrmSession,
  OrmState,
  Repository,
  Session,
  TypedModel
} from './types/redux-orm'
import { Class } from 'utility-types'

export { register, createSelector, createReducer }

function register<TEntitySchema extends EntitySchema>(
  orm: Orm,
  entitySchema: TEntitySchema
): Session<TEntitySchema> {
  type OrmSchema<TEntitySchema extends EntitySchema> = {
    [K in keyof TEntitySchema]: any extends OrmModelClass
      ? OrmModelClass
      : never
  }

  let ormSchema = {} as OrmSchema<TEntitySchema>

  let createdFields: RelationField[] = []

  for (let k in entitySchema) {
    if (entitySchema.hasOwnProperty(k)) {
      const entity = new entitySchema[k]()
      ormSchema = {
        ...ormSchema,
        [k]: createModelClass(createdFields, entity)
      }
    }
  }

  orm.register(...Object.values(ormSchema))

  return sessionRepositories(entitySchema, orm.session(orm.getEmptyState()))
}

function createSelector<E extends EntitySchema, Result>(
  orm: Orm,
  ormSelector: OrmSelector<E, Result>
): (state: OrmState) => Result {
  return createOrmSelector<OrmState, Result>(orm, ormSelector as any)
}

function createModelClass<E extends Entity<E>>(
  installedFields: RelationField[],
  entity: E
): OrmModelClass {
  return class extends TypedModel<E> {
    static modelName = entity.modelName
    static fields = createFieldDescriptors(installedFields, entity)
    static reducer = createBoundReducer(entity)
  } as OrmModelClass
}

function createFieldDescriptors<E extends Entity<E>>(
  installedFields: RelationField[],
  entity: E
) {
  return Object.entries(entity)
    .filter(isField)
    .filter(([, field]) => !reverseFieldCreated(installedFields, field))
    .reduce(
      (prev, [key, field]) => ({
        ...prev,
        [key]: createOrmDescriptor(installedFields, field)
      }),
      {}
    )
}

interface EntityReducer {
  (action: any, modelClass: OrmModelClass, session: OrmSession): void
}

function createBoundReducer<E extends Entity<E>>(entity: E): EntityReducer {
  return (action, modelClass, session) =>
    entity.reduce(
      action,
      modelRepository(entity.entityClass(), modelClass),
      session as any
    )
}

function isField(value: [string, any]): value is [string, Field] {
  return typeof value[1] === 'object' && 'fieldType' in value[1]
}

function createOrmDescriptor(installedFields: RelationField[], field: Field) {
  const { attr, oneToOne, fk, many } = OrmFields

  if (field.fieldType !== 'Attribute') {
    installedFields.push(field)
  }

  switch (field.fieldType) {
    case 'Attribute':
      return attr({ getDefault: field.supplier })
    case 'ManyToOne':
      return fk(new field.to().modelName, field.reverseField)
    case 'ManyToMany':
      return many({
        to: new field.to().modelName,
        relatedName: field.reverseField,
        through: new field.through().modelName
      })
    default:
      return oneToOne(new field.to().modelName, field.reverseField)
  }
}
function modelRepository<E extends Entity<E>>(
  entityClass: Class<E>,
  modelClass: OrmModelClass
): Repository<E> {
  return (modelClass as any) as Repository<E>
}

function sessionRepositories<E extends EntitySchema>(
  entitySchema: EntitySchema,
  session: OrmSession
): Session<E> {
  return (session as any) as Session<E>
}

const isReverseField = (
  field: RelationField,
  otherField: RelationField,
  expectedRelationType: RelationType
) =>
  field.from === otherField.to &&
  field.to === otherField.from &&
  otherField.fieldType === expectedRelationType

const reverseFieldCreated = (
  installedFields: RelationField[],
  field: Field
) => {
  switch (field.fieldType) {
    case 'OneToMany':
      return true
    case 'ManyToOne':
      return false
    case 'OneToOne':
    case 'ManyToMany':
      return installedFields.some(installedField =>
        isReverseField(field, installedField, field.fieldType)
      )
  }
}
