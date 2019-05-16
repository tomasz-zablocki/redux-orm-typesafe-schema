// noinspection ES6UnusedImports
import {
  Model,
  ModelAttributeFields,
  ModelRelationField,
  ModelRelationFields,
  MutableQuerySet,
  QuerySet,
  Ref,
  Repository,
  Session,
  TypedModel
} from './mapped'
import { Source, Vod } from '@spec/schema.fixture'
import { testType } from '@spec/utils'
import { Unionize } from 'utility-types'

// @dts-jest:group ModelRelationField
it('ModelRelationField', () => {
  // @dts-jest:pass:snap
  testType<ModelRelationField<Vod, 'sources'>>()
  // @dts-jest:pass:snap
  testType<ModelRelationField<Vod, 'vodId'>>()
  // @dts-jest:pass:snap
  testType<ModelRelationField<Vod, 'contents'>>()
  // @dts-jest:pass:snap
  testType<ModelRelationField<Source, 'vod'>>()
})

// @dts-jest:group Ref
it('Ref', () => {
  // @dts-jest:pass:snap Ref<Vod>
  testType<Unionize<Ref<Vod>>>()
})
