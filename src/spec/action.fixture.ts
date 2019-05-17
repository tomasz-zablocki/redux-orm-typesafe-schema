import { createStandardAction } from 'typesafe-actions'
import { GenreName } from '@spec/schema.fixture'
import { UpdatePayload } from '../index'

type BookPayload = {
  id: string
  isbn: string
  title: string
  year?: number
  authors: string[]
  genre: string
  links: {
    description?: string
    cover?: string
  }
}

type PersonPayload = {
  id: string
  firstName: string
  lastName: string
  books?: string[]
}

type GenrePayload = { id: string; name: GenreName }

export const insertBook = createStandardAction('INSERT_BOOK').map(
  (book: BookPayload) => ({ payload: book })
)

export const updateBook = createStandardAction('UPDATE_BOOK').map(
  (book: UpdatePayload<BookPayload>) => ({ payload: book })
)

export const insertGenre = createStandardAction('INSERT_GENRE').map(
  (genre: GenrePayload) => ({ payload: genre })
)

export const updatePerson = createStandardAction('UPDATE_PERSON').map(
  (person: UpdatePayload<PersonPayload>) => ({
    payload: person
  })
)

export const insertPerson = createStandardAction('INSERT_PERSON').map(
  (person: PersonPayload) => ({ payload: person })
)
