redux-orm-typesafe-schema
=========================

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Maintainability](https://api.codeclimate.com/v1/badges/cec304c8bc8574674c0d/maintainability)](https://codeclimate.com/github/tomasz-zablocki/redux-orm-typesafe-schema/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/cec304c8bc8574674c0d/test_coverage)](https://codeclimate.com/github/tomasz-zablocki/redux-orm-typesafe-schema/test_coverage)
[![build](https://img.shields.io/circleci/project/github/tomasz-zablocki/redux-orm-typesafe-schema.svg?style=flat-square)](https://circleci.com/gh/tomasz-zablocki/redux-orm-typesafe-schema)
[![npm](https://img.shields.io/npm/v/redux-orm-typesafe-schema.svg?color=green&style=popout-square)](https://www.npmjs.com/package/redux-orm-typesafe-schema)

A small typesafe wrapper around redux-orm.

Features: 
* typed Models
* typed static Repositories
* typed QuerySet  
* redux-orm Session with inferred Model types

# Install

`npm install --save redux-orm-typesafe-schema`

# Usage

Follow steps below to define typesafe redux-orm schema. 

Refer to [spec case](src/lib.spec.ts) for complete example.

## 1. Define entities

Extends `Entity` class to define schema:

```typescript
import {Entity} from 'redux-orm-typesafe-schema'

class Book extends Entity<Book> {
  modelName = 'Book' as const //required modelName mapping to redux-orm static modelName
  id = this.attribute<string>() //required id attribute
}
```

## 2. Define fields and relations

```typescript
import {Entity} from 'redux-orm-typesafe-schema'

// extend Entity class
class Book extends Entity<Book> {
  modelName = 'Book' as const 
  id = this.attribute<string>() 
  
  // an optional default value supplier may be provided
  title = this.attribute<string>(() => 'Gone With The Wind') 
  
  // attributes and relations can be optional
  // optionality is enforced further on when using models
  year? = this.attribute<number>()  
  
  // serializable structures may be used as attributes 
  links = this.attribute<{ 
    description?: string
    cover?: string
  }>()
  
  // available relations include: 
  // - oneToOne 
  // - oneToMany
  // - manyToOne
  // - manyToMany
  // contrary to redux-orm API, relation properties have to be defined on both sides of relationship
   
  // one to one relation
  // ref call takes backwards relation field name as argument and is typechecked for integrity
  isbn? = this.oneToOne(ISBN).ref('book')
  
  // many to one relation 
  genre = this.manyToOne(Genre).ref('books') 
  
  // many to many relation 
  // for many to many relations, ref call takes two arguments: fields on both backwards and through Models 
  authors = this.manyToMany(Person)
    .through(Authorship)
    .ref('books', 'book')
  }
}
```

## 3. Define reducers 

Example uses utilities from `typesafe-actions` module, but any standard redux actions may be used

```typescript
import {Entity} from 'redux-orm-typesafe-schema'
import * as actions from './actions'
import {ActionType} from 'typesafe-actions'

type RootAction = ActionType<typeof actions>

class Book extends Entity<Book> {
  modelName = 'Book' as const 
  id = this.attribute<string>() 
  title = this.attribute<string>(() => 'Gone With The Wind') 
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
  }
  
  // enforce type safety by constraining action type
  // second argument is a mapped Repository type 
  // Repository is a typed, mapped type counterpart of a static functionality of redux-orm Model class 
  reduce(action: RootAction, repository: Repository<Book>) {
    switch (action.type) {
      case getType(actions.insertBook):
        repository.create(action.payload)
        break
      case getType(actions.updateBook):
        repository.upsert(action.payload)
        break
      default:
        break
    }   
  }
}
```

## 4. Redux integration 

### 4.1. Define actions 

```typescript
import { createStandardAction } from 'typesafe-actions'

// mapped type which makes properties optional with an exception of id property
import { UpdatePayload } from 'redux-orm-typesafe-schema'

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

export const insertBook = createStandardAction('INSERT_BOOK').map(
  (book: BookPayload) => ({ payload: book })
)

export const updateBook = createStandardAction('UPDATE_BOOK').map(
  (book: UpdatePayload<BookPayload>) => ({ payload: book })
)
```

### 4.2. Configure store and root orm reducer 

```typescript
import { Orm, createReducer, register } from 'redux-orm-typesafe-schema'
import { combineReducers, createStore } from 'redux'
 
// import entity classes
import { Authorship, Book, Genre, Person, ISBN } from './my-schema'
 

// initialize orm instance
const orm = new Orm()

// register entities
const session = register(orm, {
  Book,
  Person,
  Authorship,
  Genre,
  ISBN
})


// initialize orm reducer 
const db = createReducer(orm)

// initialize root reducer
const rootReducer = combineReducers<any, any>({
  db 
  // ...other reducers
})

// create redux store
const store = createStore(rootReducer)
```

### 4.3. Typed selectors 

```typescript
import { createSelector, register, createReducer, Orm} from 'redux-orm-typesafe-schema'
import { Authorship, Book, Genre, Person, ISBN } from './my-schema'
import {combineReducers, createStore} from 'redux'

const orm = new Orm()

const session = register(orm, {
  Book,
  Person,
  Authorship,
  Genre,
  ISBN
})

const rootReducer = combineReducers<any, any>({
  db :createReducer(orm)
})

const store = createStore(rootReducer)

// extract Session type from registered session instance 
type Session = typeof session

// session contains all Model classes
// Model classes are strictly typed according to registered entity definitions 
const bookWithAuthorsSelector = (session: Session) => {
                                    return session.Book.all()
                                      .toModelArray()
                                      .map(bookModel => ({
                                        ...bookModel.ref,
                                        Persons: bookModel.authors.toRefArray()
                                      }))
                                  }

// create ORM selector                                 
const selector = createSelector(
  orm,
  bookWithAuthorsSelector
)

// selector requires state's orm db branch as input
const bookWithAuthorsData = selector(store.getState().db)
```