import { Entity, EntitySchema, Field } from './types/schema'
import {
  createOrmSelector,
  createReducer,
  Orm,
  OrmFields,
  OrmModelClass,
  OrmModelFields,
  OrmSelector,
  OrmSession,
  OrmState,
  Repository,
  Session,
  TypedModel,
  UpdatePayload
} from './types/redux-orm'
import { Class } from 'utility-types'

export {
  register,
  createSelector,
  createReducer,
  Repository,
  UpdatePayload,
  Session,
  TypedModel
}

type OrmSchema<TEntitySchema extends EntitySchema> = {
  [K in keyof TEntitySchema]: any extends OrmModelClass ? OrmModelClass : never
}

function register<TEntitySchema extends EntitySchema>(
  orm: Orm,
  entitySchema: TEntitySchema
): Session<TEntitySchema> {
  let ormSchema = {} as OrmSchema<TEntitySchema>

  for (let k in entitySchema) {
    if (entitySchema.hasOwnProperty(k)) {
      const entity = new entitySchema[k]()
      ormSchema = {
        ...ormSchema,
        [k]: createModelClass(entity)
      }
    }
  }

  orm.register(...Object.values(ormSchema))

  return sessionRepositories(entitySchema, orm.session(orm.getEmptyState()))
}

function isField(value: [string, any]): value is [string, Field] {
  return (
    typeof value[1] === 'object' &&
    'fieldType' in value[1] &&
    'virtual' in value[1] &&
    !value[1]['virtual']
  )
}

function createOrmDescriptor(field: Field) {
  const { attr, oneToOne, fk, many } = OrmFields

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

function createModelClass<E extends Entity<E>>(entity: E): OrmModelClass {
  const typedModel = class extends TypedModel<E> {
    static modelName = entity.modelName
  } as OrmModelClass

  let fields: OrmModelFields = {}

  Object.entries(entity)
    .filter(isField)
    .filter(([, field]) => !field.virtual)
    .forEach(([key, field]) => (fields[key] = createOrmDescriptor(field)))

  typedModel.fields = fields

  typedModel.reducer = (
    action: any,
    modelClass: OrmModelClass,
    session: OrmSession
  ) =>
    entity.reduce(
      action,
      modelRepository(entity.entityClass(), modelClass),
      session as any
    )

  return typedModel
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

function createSelector<E extends EntitySchema, Result>(
  orm: Orm,
  ormSelector: OrmSelector<E, Result>
): (state: OrmState) => Result {
  return createOrmSelector<OrmState, Result>(orm, ormSelector as any)
}
