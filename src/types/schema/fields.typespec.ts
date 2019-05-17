import { Book, Genre, Person } from '@spec/schema.fixture'
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

    // @dts-jest:pass:snap OneToOne<Book, Genre>
    testType<EntityKeys.OneToOne<Book, Genre>>()

    // @dts-jest:pass:snap OneToMany<Book, Person>
    testType<EntityKeys.OneToMany<Book, Person>>()

    // @dts-jest:pass:snap ManyToOne<Person, Book>
    testType<EntityKeys.ManyToOne<Person, Book>>()
  })
})
