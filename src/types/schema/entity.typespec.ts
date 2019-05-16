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
import { Content, Source, Vod, VodContent, VodId } from '@spec/schema.fixture'
import { testType } from '@spec/utils'
// noinspection ES6UnusedImports
import { Entity } from './entity'

// @dts-jest:group Entity class ->
describe('Entity class ->', () => {
  it('Vod ->', () => {
    // @dts-jest:pass:snap
    testType<Vod>()

    // @dts-jest:pass:snap
    testType<ReturnType<Vod['entityClass']>>()

    // @dts-jest:pass:snap
    testType<Vod['id']>()

    // @dts-jest:pass:snap
    testType<Vod['title']>()

    // @dts-jest:pass:snap
    testType<Vod['links']>()

    // @dts-jest:pass:snap
    testType<Vod['vodId']>()

    // @dts-jest:pass:snap
    testType<Vod['sources']>()

    // @dts-jest:pass:snap
    testType<Vod['contents']>()

    // @dts-jest:pass:snap
    testType<ReturnType<Required<Vod['links']>['supplier']>>()
  })
})
