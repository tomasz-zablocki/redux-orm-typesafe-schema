import { Entity } from '../types/schema'
import { ActionType, getType, isActionOf } from 'typesafe-actions'
import { Repository } from '../types/redux-orm'
import * as actions from './action.fixture'

export { Genre, GenreName, Book, Authorship, Person, ISBN }

type RootAction = ActionType<typeof actions>

class Book extends Entity<Book> {
  modelName = 'Book' as const
  id = this.attribute<string>()
  title = this.attribute<string>()
  year? = this.attribute<number>()
  links = this.attribute<{
    description?: string
    cover?: string
  }>()
  isbn? = this.oneToOne(ISBN).ref('book')
  genre = this.manyToOne(Genre).ref('books')
  authors = this.manyToMany(Person)
    .through(Authorship)
    .ref('books', 'book')

  reduce(action: RootAction, repository: Repository<Book>) {
    switch (action.type) {
      case getType(actions.insertBook):
        repository.create(action.payload)
        break
      case getType(actions.updateBook):
        repository.upsert(action.payload)
        break
      case getType(actions.updateBookAuthors):
        const { bookId, authors } = action.payload
        const book = repository.withId(bookId)
        if (book) {
          const currentAuthors = book.authors
            .toRefArray()
            .map(authorRef => authorRef.id)

          authors.forEach(authorId => {
            if (!currentAuthors.includes(authorId)) book.authors.add(authorId)
          })
        }
        break
      default:
        break
    }
  }
}

class ISBN extends Entity<ISBN> {
  modelName = 'ISBN' as const
  id = this.attribute<string>()
  book? = this.oneToOne(Book).ref('isbn')

  reduce(action: RootAction, repository: Repository<ISBN>) {
    if (isActionOf(actions.insertBook, action)) {
      repository.create({ id: action.payload.isbn })
    }
  }
}

type GenreName = 'action' | 'drama' | 'thriller'

class Genre extends Entity<Genre> {
  modelName = 'Genre' as const
  id = this.attribute<string>()
  name = this.attribute<GenreName>()
  books = this.oneToMany(Book).ref('genre')

  reduce(action: RootAction, repository: Repository<Genre>) {
    if (isActionOf(actions.insertGenre, action)) {
      repository.create(action.payload)
    }
  }
}

class Person extends Entity<Person> {
  modelName = 'Person' as const
  id = this.attribute<string>()
  firstName = this.attribute<string>()
  lastName = this.attribute<string>()
  books = this.manyToMany(Book)
    .through(Authorship)
    .ref('authors', 'author')

  reduce(action: RootAction, repository: Repository<Person>) {
    switch (action.type) {
      case getType(actions.insertPerson):
        repository.create(action.payload)
        if (action.payload.books) {
          action.payload.books.forEach(bookId =>
            repository.withId(action.payload.id)!!.books.add(bookId)
          )
        }
        break
      case getType(actions.updatePerson):
        repository.update(action.payload)
        if (action.payload.books) {
          action.payload.books.forEach(bookId =>
            repository.withId(action.payload.id)!!.books.add(bookId)
          )
        }
        break
      default:
        break
    }
  }
}

class Authorship extends Entity<Authorship> {
  modelName = 'Authorship' as const
  id = this.attribute<string>()
  book = this.manyToOne(Book).ref()
  author = this.manyToOne(Person).ref()
}
