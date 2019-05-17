import { Book, ISBN, Person } from '@spec/schema.fixture'
import { testType } from '@spec/utils'
import { EntityKeys, RelationType } from './fields'

// @dts-jest:group EntityKeys ->
describe('fields', () => {
  it('EntityKeys ->', () => {
    // @dts-jest:pass:snap Attribute<Book>
    testType<EntityKeys.Attribute<Book>>()

    // @dts-jest:pass:snap Relation<Book, *>
    testType<EntityKeys.Relation<Book, RelationType>>()

    // @dts-jest:pass:snap Relation<Book, OneToOne>
    testType<EntityKeys.Relation<Book, 'OneToOne'>>()

    // @dts-jest:pass:snap Relation<Book, OneToMany>
    testType<EntityKeys.Relation<Book, 'OneToMany'>>()

    // @dts-jest:pass:snap Relation<Book, ManyToOne>
    testType<EntityKeys.Relation<Book, 'ManyToOne'>>()

    // @dts-jest:pass:snap Relation<Book, ManyToMany>
    testType<EntityKeys.Relation<Book, 'ManyToMany'>>()

    // @dts-jest:pass:snap OneToOne<Book, ISBN>
    testType<EntityKeys.RelationKeys<Book, ISBN, 'OneToOne'>>()

    // @dts-jest:pass:snap ManyToMany<Book, Person>
    testType<EntityKeys.RelationKeys<Book, Person, 'ManyToMany'>>()

    // @dts-jest:pass:snap ManyToMany<Person, Book>
    testType<EntityKeys.RelationKeys<Person, Book, 'ManyToMany'>>()
  })
})
