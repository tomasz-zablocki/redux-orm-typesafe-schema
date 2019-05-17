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
import { testType } from '@spec/utils'
// noinspection ES6UnusedImports
import { Entity } from './entity'
import { Book } from '@spec/schema.fixture'

// @dts-jest:group Entity class ->
describe('Entity class ->', () => {
  it('Book ->', () => {
    // @dts-jest:pass:snap
    testType<Book>()

    // @dts-jest:pass:snap
    testType<ReturnType<Book['entityClass']>>()

    // @dts-jest:pass:snap
    testType<Book['id']>()

    // @dts-jest:pass:snap
    testType<Book['title']>()

    // @dts-jest:pass:snap
    testType<Book['authors']>()

    // @dts-jest:pass:snap
    testType<Book['genre']>()

    // @dts-jest:pass:snap
    testType<Book['links']>()
  })
})
