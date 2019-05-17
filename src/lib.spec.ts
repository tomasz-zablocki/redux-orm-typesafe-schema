import { createReducer, createSelector, register } from './lib'
import { Orm } from './types/redux-orm'
import * as actions from '@spec/action.fixture'
import { Authorship, Book, Genre, Person, ISBN } from '@spec/schema.fixture'
import { combineReducers } from 'redux'
import { configureStore } from '@spec/utils'

const testData = {
  book1: {
    isbn: '0-306-40615-2',
    links: {
      description: 'http://books/0306406152.html',
      cover: 'http://books/0306406152.jpg'
    },
    genre: 'genre-1',
    title: 'Gone with the wind',
    id: 'book-1',
    year: 1944
  },
  book2: {
    isbn: '0-406-30615-2',
    links: {
      description: 'http://books/0406306152.html'
    },
    genre: 'genre-2',
    title: 'Noticia de un secuestro',
    id: 'book-2',
    year: 1996
  },
  person1: {
    id: 'person-1',
    firstName: 'John',
    lastName: 'Smith'
  },
  person2: {
    id: 'person-2',
    firstName: 'Jane',
    lastName: 'Doe'
  },
  genre: { id: 'genre-1', name: 'drama' as const }
}

describe('lib', () => {
  const registerSchema = (orm: Orm) =>
    register(orm, {
      Book,
      Person,
      Genre,
      Authorship,
      ISBN
    })

  describe('Repository', () => {
    const { book1, book2, person1, person2 } = testData

    it('create with required fields only', () => {
      //given
      const { Book } = registerSchema(new Orm())

      const { genre, id, title } = book1

      Book.create({
        id,
        genre,
        title,
        links: {}
      })

      //when
      const book = Book.withId(book1.id)

      //then
      expect(book).toBeDefined()
      expect(book!!.title).toEqual(book1.title)
    })

    it('create with optional attribute fields', () => {
      //given
      const { Book } = registerSchema(new Orm())

      const { id, title, year, links, genre } = book1

      Book.create({ id, title, year, links, genre })

      //when
      const book = Book.withId(book1.id)

      //then
      expect(book).toBeDefined()
      expect(book!!.year).toBeDefined()
      expect(book!!.year).toEqual(book1.year)
    })

    it('create with optional one-to-one relation fields', () => {
      //given
      const { Book, ISBN } = registerSchema(new Orm())

      ISBN.create({
        id: book1.isbn
      })

      const { id, title, links, genre, isbn } = book1

      Book.create({ id, title, isbn, links, genre })

      //when
      const book = Book.withId(book1.id)

      //then
      expect(book).toBeDefined()
      expect(book!!.isbn).toBeDefined()
      expect(book!!.isbn.book.title).toEqual(book1.title)
    })

    it('create many-to-many relations using models', () => {
      //given
      const { Book, Authorship, Person } = registerSchema(new Orm())

      //when
      const book = Book.create(book1)
      const author1 = Person.create(person1)
      const author2 = Person.create(person2)

      book.authors.add(author1)
      book.authors.add(author2)

      //then
      expect(Authorship.all().toRefArray()).toHaveLength(2)
    })

    it('create many-to-many relations using id', () => {
      //given
      const { Book, Authorship, Person } = registerSchema(new Orm())

      //when
      const person = Person.create(person1)
      Book.create(book1)
      Book.create(book2)

      Book.all()
        .toRefArray()
        .forEach(book => person.books.add(book.id))

      //then
      expect(Authorship.all().toModelArray()).toHaveLength(2)
    })
  })

  describe('Selectors', () => {
    it('should select expected data', () => {
      //given
      const { book1, person1, person2, genre } = testData
      const orm = new Orm()
      const session = registerSchema(orm)
      const { insertBook, updateBook, insertPerson, insertGenre } = actions
      const reducers = {
        db: createReducer(orm)
      }
      const rootReducer = combineReducers<any, any>(reducers)
      const store = configureStore(rootReducer)

      type Session = typeof session

      const selector = createSelector(
        orm,
        (session: Session) => {
          return session.Book.all()
            .toModelArray()
            .map(bookModel => ({
              ...bookModel.ref,
              authors: bookModel.authors.toRefArray()
            }))
        }
      )

      //when
      store.dispatch(insertGenre(genre))
      store.dispatch(insertPerson(person1))
      store.dispatch(insertPerson(person2))
      store.dispatch(insertBook({ ...book1, authors: [person1.id] }))
      store.dispatch(
        updateBook({
          id: book1.id,
          authors: [person1.id, person2.id]
        })
      )

      const selectResult = selector(store.getState().db)

      //then
      expect(selectResult).toBeDefined()
      expect(selectResult).toHaveLength(1)
      expect(selectResult[0].links.description).toEqual(book1.links.description)
      expect(selectResult[0].authors).toHaveLength(2)
      expect(selectResult[0].authors[0].firstName).toEqual(person1.firstName)
      expect(selectResult[0].authors[1].lastName).toEqual(person2.lastName)
    })
  })
})
