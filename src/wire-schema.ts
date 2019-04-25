import {
  Orm,
  OrmFields,
  OrmModelClass,
  OrmModelFields,
  OrmSession,
  Repositories,
  Repository,
  TypedModel
} from './types/redux-orm'
import { Entity, EntitySchema, Field } from './types/schema'
import { Class } from 'utility-types'

export { wireSchema }

type OrmSchema<TEntitySchema extends EntitySchema> = {
  [K in keyof TEntitySchema]: any extends OrmModelClass ? OrmModelClass : never
}

function wireSchema<TEntitySchema extends EntitySchema>(
  orm: Orm,
  entitySchema: TEntitySchema
): Repositories<TEntitySchema> {
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
  return typeof value[1] === 'object' && 'fieldType' in value[1]
}

function createOrmDescriptor(field: Field) {
  const { attr, oneToOne, fk, many } = OrmFields

  switch (field.fieldType) {
    case 'Attribute':
      return attr({ getDefault: field.supplier })
    case 'OneToOne':
      return oneToOne(new field.to().modelName, field.reverseField)
    case 'ManyToOne':
      return fk(new field.to().modelName, field.reverseField)
    case 'ManyToMany':
      return many({
        to: new field.to().modelName,
        relatedName: field.reverseField,
        through: new field.through().modelName
      })
    default:
      throw Error(
        `undefined redux-orm descriptor for field: ${JSON.stringify(field)}`
      )
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
): Repositories<E> {
  return (session as any) as Repositories<E>
}
