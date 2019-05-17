import { createReducer, createSelector, register } from './lib'
import { Orm } from './types/redux-orm'
import * as actions from '@spec/action.fixture'
import { Authorship, Book, Genre, Person, ISBN } from '@spec/schema.fixture'
import { combineReducers } from 'redux'
import { configureStore } from '@spec/utils'

const registerSchema = () =>
  register(new Orm(), {
    Book,
    Person,
    Genre,
    Authorship,
    ISBN
  })

describe('Repositories', () => {
  describe('Book repository', () => {
    it('create with required fields only', () => {
      //given
      const { Book } = registerSchema()

      Book.create({
        isbn: '0-306-40615-2.',
        genre: 'genre-1',
        links: { description: 'http://api/Books/Book-1.html' },
        id: 'Book-1',
        title: 'Gone With The Wind'
      })

      //when
      const book = Book.withId('Book-1')

      //then
      expect(book).toBeDefined()
      expect(book!!.links.description).toEqual('http://api/Books/Book-1.html')
    })

    it('create with optional attribute fields', () => {
      //given
      const { Book } = registerSchema()

      Book.create({
        isbn: '0-306-40615-2.',
        links: { description: 'http://api/Books/Book-1.html' },
        id: 'book-1',
        title: 'title-1',
        year: 1944,
        genre: 'genre-1'
      })

      //when
      const book = Book.withId('book-1')

      //then
      expect(book).toBeDefined()
      expect(book!!.title).toBeDefined()
      expect(book!!.title).toEqual('title-1')
    })

    it('create with optional one-to-one relation fields', () => {
      //given
      const { Book, Genre, ISBN } = registerSchema()

      ISBN.create({
        id: '0-306-40615-2.'
      })

      Genre.create({
        id: 'genre-1',
        name: 'drama'
      })

      Book.create({
        isbn: '0-306-40615-2.',
        links: { description: 'http://api/Books/Book-1.html' },
        genre: 'genre-1',
        title: 'Gone with the wind',
        id: 'book-1'
      })

      //when
      const book = Book.withId('book-1')

      //then
      expect(book).toBeDefined()
      expect(book!!.genre).toBeDefined()
      expect(book!!.genre.books.toRefArray()).toHaveLength(1)
    })

    it('create many-to-many relations using models', () => {
      //given
      const { Book, Authorship, Person } = registerSchema()

      //when
      Book.create({
        isbn: '0-306-40615-2.',
        links: { description: 'http://api/Books/Book-1.html' },
        genre: 'genre-1',
        title: 'Gone with the wind',
        id: 'Book-1',
        year: 1944
      })
      Person.create({ id: 'Person-1', firstName: 'John', lastName: 'Smith' })
      Person.create({ id: 'Person-2', firstName: 'Jane', lastName: 'Smith' })

      const book = Book.withId('Book-1')

      if (!book) throw 'Book missing'

      Person.all()
        .toModelArray()
        .forEach(person => book.authors.add(person))

      const authorships = Authorship.all()

      //then
      expect(authorships).toBeDefined()
      expect(authorships.toModelArray()).toHaveLength(2)
    })

    it('create many-to-many relations using id', () => {
      //given
      const { Book, Authorship, Person } = registerSchema()

      //when
      Book.create({
        isbn: '0-306-40615-2.',
        links: { description: 'http://api/Books/Book-1.html' },
        genre: 'genre-1',
        title: 'Gone with the wind',
        id: 'Book-1',
        year: 1944
      })
      Person.create({ id: 'Person-1', firstName: 'John', lastName: 'Smith' })
      Person.create({ id: 'Person-2', firstName: 'Jane', lastName: 'Smith' })

      const book = Book.withId('Book-1')

      if (!book) throw 'Book missing'

      Person.all()
        .toRefArray()
        .forEach(person => book.authors.add(person.id))

      const authorships = Authorship.all()

      //then
      expect(authorships).toBeDefined()
      expect(authorships.toModelArray()).toHaveLength(2)
    })

    describe('Selectors', () => {
      it('should select expected data', () => {
        //given
        const orm = new Orm()
        const session = register(orm, {
          Book,
          Person,
          Authorship,
          Genre,
          ISBN
        })

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
                Persons: bookModel.authors.toRefArray()
              }))
          }
        )

        //when
        store.dispatch(insertGenre({ id: 'genre-1', name: 'drama' }))
        store.dispatch(
          insertPerson({ id: 'person-1', firstName: 'John', lastName: 'Doe' })
        )
        store.dispatch(
          insertPerson({ id: 'person-2', firstName: 'John', lastName: 'Wayne' })
        )
        store.dispatch(
          insertBook({
            isbn: '0-306-40615-2',
            id: 'book-1',
            links: { description: 'url://book-1' },
            authors: ['person-1'],
            genre: 'genre-1',
            title: 'Gone with the wind'
          })
        )
        store.dispatch(
          updateBook({ id: 'book-1', authors: ['person-1', 'person-2'] })
        )

        const selectResult = selector(store.getState().db)

        //then
        expect(selectResult).toBeDefined()
        expect(selectResult).toHaveLength(1)
        expect(selectResult[0].links.description).toEqual('url://book-1')
        expect(selectResult[0].Persons).toHaveLength(2)
      })
    })
  })
})
