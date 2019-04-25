// noinspection ES6UnusedImports
import {
  Model,
  ModelAttributeFields,
  ModelRelationField,
  ModelRelationFields,
  MutableQuerySet,
  QuerySet,
  Ref,
  Repositories,
  Repository,
  TypedModel
} from './mapped'
import { Source, Vod } from '@spec/schema.fixture'
import { testType } from '@spec/utils'
import { Unionize } from 'utility-types'

// @dts-jest:group redux-orm mapped types
it('Entity mapped types', () => {
  // @dts-jest:pass:snap Ref<Vod> entries
  testType<Unionize<Ref<Vod>>>()
  // @dts-jest:pass:snap Ref<Source> entries
  testType<Unionize<Ref<Source>>>()
  // @dts-jest:pass:snap
  testType<ModelRelationField<Vod, 'sources'>>()
  // @dts-jest:pass:snap
  testType<ModelRelationField<Vod, 'vodId'>>()
  // @dts-jest:pass:snap
  testType<ModelRelationField<Vod, 'contents'>>()
  // @dts-jest:pass:snap
  testType<ModelRelationField<Source, 'vod'>>()
})
