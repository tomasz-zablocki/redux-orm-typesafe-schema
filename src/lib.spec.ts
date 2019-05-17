import { createReducer, createSelector, register } from './lib'
import { Orm } from './types/redux-orm'
import * as actions from '@spec/action.fixture'
import { Authorship, Book, Genre, Person, ISBN } from '@spec/schema.fixture'
import { combineReducers } from 'redux'
import { configureStore } from '@spec/utils'

describe('Repositories', () => {
  const registerSchema = (orm: Orm) =>
    register(orm, {
      Book,
      Person,
      Genre,
      Authorship,
      ISBN
    })

  const book1Payload = {
    isbn: '0-306-40615-2',
    links: {
      description: 'http://api/books/book-1.html',
      cover: 'http://api/books/book-1.jpeg'
    },
    genre: 'genre-1',
    title: 'Gone with the wind',
    id: 'book-1',
    year: 1944
  }
  const book2Payload = {
    isbn: '0-406-30615-2',
    links: {
      description: 'http://api/books/book-2.html',
      cover: 'http://api/books/book-2.jpeg'
    },
    genre: 'genre-2',
    title: 'Noticia de un secuestro',
    id: 'book-2',
    year: 1996
  }
  const person1Payload = {
    id: 'person-1',
    firstName: 'John',
    lastName: 'Smith'
  }
  const person2Payload = {
    id: 'person-2',
    firstName: 'Jane',
    lastName: 'Doe'
  }
  const genrePayload = { id: 'genre-1', name: 'drama' as const }

  describe('Book repository', () => {
    it('create with required fields only', () => {
      //given
      const { Book } = registerSchema(new Orm())

      const { genre, id, title } = book1Payload

      Book.create({
        id,
        genre,
        title,
        links: {}
      })

      //when
      const book = Book.withId(book1Payload.id)

      //then
      expect(book).toBeDefined()
      expect(book!!.title).toEqual(book1Payload.title)
    })

    it('create with optional attribute fields', () => {
      //given
      const { Book } = registerSchema(new Orm())

      const { id, title, year, links, genre } = book1Payload

      Book.create({ id, title, year, links, genre })

      //when
      const book = Book.withId(book1Payload.id)

      //then
      expect(book).toBeDefined()
      expect(book!!.year).toBeDefined()
      expect(book!!.year).toEqual(book1Payload.year)
    })

    it('create with optional one-to-one relation fields', () => {
      //given
      const { Book, ISBN } = registerSchema(new Orm())

      ISBN.create({
        id: book1Payload.isbn
      })

      const { id, title, links, genre, isbn } = book1Payload

      Book.create({ id, title, isbn, links, genre })

      //when
      const book = Book.withId(book1Payload.id)

      //then
      expect(book).toBeDefined()
      expect(book!!.isbn).toBeDefined()
      expect(book!!.isbn.book.title).toEqual(book1Payload.title)
    })

    it('create many-to-many relations using models', () => {
      //given
      const { Book, Authorship, Person } = registerSchema(new Orm())

      //when
      const book = Book.create(book1Payload)
      const person1 = Person.create(person1Payload)
      const person2 = Person.create(person2Payload)

      book.authors.add(person1)
      book.authors.add(person2)

      //then
      expect(Authorship.all().toRefArray()).toHaveLength(2)
    })

    it('create many-to-many relations using id', () => {
      //given
      const { Book, Authorship, Person } = registerSchema(new Orm())

      //when
      const person = Person.create(person1Payload)
      Book.create(book1Payload)
      Book.create(book2Payload)

      Book.all()
        .toRefArray()
        .forEach(book => person.books.add(book.id))

      //then
      expect(Authorship.all().toModelArray()).toHaveLength(2)
    })

    describe('Selectors', () => {
      it('should select expected data', () => {
        //given
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
        store.dispatch(insertGenre(genrePayload))
        store.dispatch(insertPerson(person1Payload))
        store.dispatch(insertPerson(person2Payload))
        store.dispatch(
          insertBook({ ...book1Payload, authors: [person1Payload.id] })
        )
        store.dispatch(
          updateBook({
            id: book1Payload.id,
            authors: [person1Payload.id, person2Payload.id]
          })
        )

        const selectResult = selector(store.getState().db)

        //then
        expect(selectResult).toBeDefined()
        expect(selectResult).toHaveLength(1)
        expect(selectResult[0].links.description).toEqual(
          book1Payload.links.description
        )
        expect(selectResult[0].authors).toHaveLength(2)
      })
    })
  })
})
