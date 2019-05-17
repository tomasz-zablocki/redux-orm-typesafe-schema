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
import { Authorship, Book, Genre } from '@spec/schema.fixture'
import { testType } from '@spec/utils'
import { Unionize } from 'utility-types'

// @dts-jest:group ModelRelationField
it('ModelRelationField', () => {
  // @dts-jest:pass:snap
  testType<ModelRelationField<Book, 'authors'>>()
  // @dts-jest:pass:snap
  testType<ModelRelationField<Book, 'genre'>>()
  // @dts-jest:pass:snap
  testType<ModelRelationField<Authorship, 'author'>>()
  // @dts-jest:pass:snap
  testType<ModelRelationField<Genre, 'books'>>()
})

// @dts-jest:group Ref
it('Ref', () => {
  // @dts-jest:pass:snap Ref<Book>
  testType<Unionize<Ref<Book>>>()
})
