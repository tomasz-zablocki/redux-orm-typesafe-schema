import { Content, Source, Vod, VodContent, VodId } from '@spec/schema.fixture'
import { createReducer, createSelector, register } from './lib'
import { Orm } from './types/redux-orm'
import * as actions from '@spec/action.fixture'
import { combineReducers } from 'redux'
import { configureStore } from '@spec/utils'

const registerSchema = () =>
  register(new Orm(), {
    Vod,
    Source,
    VodId,
    Content,
    VodContent
  })

describe('Repositories', () => {
  describe('Vod repository', () => {
    it('create with required fields only', () => {
      //given
      const { Vod } = registerSchema()

      Vod.create({
        links: { self: 'http://api/vods/vod-1.html' },
        id: 'vod-1'
      })

      //when
      const vod = Vod.withId('vod-1')

      //then
      expect(vod).toBeDefined()
      expect(vod!!.links.self).toEqual('http://api/vods/vod-1.html')
    })

    it('create with optional attribute fields', () => {
      //given
      const { Vod } = registerSchema()

      Vod.create({
        links: { self: 'http://api/vods/vod-1.html' },
        id: 'vod-1',
        title: 'title-1'
      })

      //when
      const vod = Vod.withId('vod-1')

      //then
      expect(vod).toBeDefined()
      expect(vod!!.title).toBeDefined()
      expect(vod!!.title).toEqual('title-1')
    })

    it('create with optional one-to-one relation fields', () => {
      //given
      const { Vod, VodId } = registerSchema()

      VodId.create({
        id: 'root-id'
      })

      Vod.create({
        links: { self: 'http://api/vods/vod-1.html' },
        id: 'vod-1',
        vodId: 'root-id'
      })

      //when
      const vod = Vod.withId('vod-1')

      //then
      expect(vod).toBeDefined()
      expect(vod!!.vodId).toBeDefined()
      expect(vod!!.vodId.vod.id).toEqual('vod-1')
    })

    it('create many-to-many relations using models', () => {
      //given
      const { Vod, Content, VodContent } = registerSchema()

      //when
      Vod.create({
        links: { self: 'http://api/vods/vod-1.html' },
        id: 'vod-1',
        vodId: 'root-id'
      })
      Content.create({ id: 'content-1', type: 'MOVIE' })
      Content.create({ id: 'content-2', type: 'PREVIEW' })

      const vod = Vod.withId('vod-1')

      if (!vod) throw 'vod missing'

      Content.all()
        .toModelArray()
        .forEach(content => vod.contents.add(content))

      const vodContents = VodContent.all()

      //then
      expect(vodContents).toBeDefined()
      expect(vodContents.toModelArray()).toHaveLength(2)
    })

    it('create many-to-many relations using id', () => {
      //given
      const { Vod, Content, VodContent } = registerSchema()

      //when
      Vod.create({
        links: { self: 'http://api/vods/vod-1.html' },
        id: 'vod-1',
        vodId: 'root-id'
      })
      Content.create({ id: 'content-1', type: 'MOVIE' })
      Content.create({ id: 'content-2', type: 'PREVIEW' })

      const vod = Vod.withId('vod-1')

      if (!vod) throw 'vod missing'

      vod.contents.add('content-1')
      vod.contents.add('content-2')

      const vodContents = VodContent.all()

      //then
      expect(vodContents).toBeDefined()
      expect(vodContents.toModelArray()).toHaveLength(2)
    })
  })
})

describe('Selectors', () => {
  it('should select expected data', () => {
    //given
    const orm = new Orm()
    const session = register(orm, {
      Vod,
      Source,
      VodId,
      Content,
      VodContent
    })

    const { insertVod, updateVod, insertSource, deleteSource } = actions
    const reducers = {
      db: createReducer(orm)
    }
    const rootReducer = combineReducers<any, any>(reducers)
    const store = configureStore(rootReducer)
    type Session = typeof session
    const selector = createSelector(
      orm,
      (session: Session) => {
        return session.Vod.all()
          .toModelArray()
          .map(vodModel => ({
            ...vodModel.ref,
            sources: vodModel.sources.toRefArray()
          }))
      }
    )

    //when
    store.dispatch(insertVod({ id: 'vod-1', links: { self: 'v ://vod-1' } }))
    store.dispatch(updateVod({ title: 'title-1' }))
    store.dispatch(
      insertSource({ id: 'source-1', type: 'MOVIE', vod: 'vod-1' })
    )
    store.dispatch(
      insertSource({ id: 'source-2', type: 'MOVIE', vod: 'vod-1' })
    )
    store.dispatch(
      insertSource({ id: 'source-3', type: 'MOVIE', vod: 'vod-1' })
    )
    store.dispatch(deleteSource('source-1'))

    const selectResult = selector(store.getState().db)

    //then
    expect(selectResult).toBeDefined()
    expect(selectResult).toHaveLength(1)
    expect(selectResult[0].links.self).toEqual('v ://vod-1')
    expect(selectResult[0].sources).toHaveLength(2)
  })
})
