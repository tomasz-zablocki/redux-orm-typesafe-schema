// noinspection ES6UnusedImports
import { $Keys, Class, Unionize } from 'utility-types'
// noinspection ES6UnusedImports
import {
  AttributeField,
  EntityBuilders,
  EntityKeys,
  Field,
  FieldType,
  ManyToManyField,
  ManyToOneField,
  OneToManyField,
  OneToOneField,
  RelationField,
  RelationType
} from './fields'
// noinspection ES6UnusedImports
import {
  Orm,
  OrmModel,
  OrmModelClass,
  OrmSession,
  OrmState
} from '../redux-orm/aliases'
// noinspection ES6UnusedImports
import { Content, schema, Source, Vod, VodId } from '@spec/schema.fixture'
import { testType } from '@spec/utils'
import { Entity } from './entity'

// @dts-jest:group Types
describe('Entity class spec', () => {
  it('Entity ', () => {
    // @dts-jest:pass:snap
    testType<Vod>()
    // @dts-jest:pass:snap
    testType<Entity<Vod>>()
    // @dts-jest:pass:snap
    testType<Class<Vod>>()

    const vodClass = new Vod().entityClass()
    // @dts-jest:pass:snap
    testType<typeof vodClass>()
    // @dts-jest:pass:snap
    testType<Entity<Vod>>()

    // @dts-jest:pass:snap
    testType<Vod['sources']>()
    // @dts-jest:pass:snap
    testType<Vod['title']>()
    // @dts-jest:pass:snap
    testType<Vod['links']>()
    // @dts-jest:pass:snap
    testType<ReturnType<Required<Vod['links']>['supplier']>>()

    // @dts-jest:pass:snap
    testType<Vod['links']>()
  })
})
