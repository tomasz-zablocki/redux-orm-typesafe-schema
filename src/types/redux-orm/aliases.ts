import {
  attr,
  fk,
  many,
  Model,
  ModelFields,
  oneToOne,
  ORM,
  ORMCommonState,
  Session
} from 'redux-orm'

export {
  OrmFields,
  ModelFields as OrmModelFields,
  ORM as Orm,
  OrmModelClass,
  ORMCommonState as OrmState,
  Model as OrmModel,
  OrmSession
}

const OrmFields = {
  attr,
  fk,
  many,
  oneToOne
}

type OrmSession = Session<ORMCommonState>

type OrmModelClass = typeof Model
