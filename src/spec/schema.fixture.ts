import { Entity } from '../types/schema'
import { ActionType, getType } from 'typesafe-actions'
import { Repository } from '../types/redux-orm'
import * as actions from './action.fixture'

export { Vod, VodContent, VodId, Content, Source }

type Links = { self: string }

type RootAction = ActionType<typeof actions>

class Vod extends Entity<Vod> {
  modelName = 'Vod' as const
  id = this.attribute<string>()
  title? = this.attribute<string>()
  links = this.attribute<Links>()
  sources = this.oneToMany(Source).ref('vod')
  vodId? = this.oneToOne(VodId).ref('vod')
  contents = this.manyToMany(Content)
    .through(VodContent)
    .ref('vods', 'vod')

  reduce(action: RootAction, repository: Repository<Vod>) {
    switch (action.type) {
      case getType(actions.insertVod):
        repository.create(action.payload)
        break
      case getType(actions.updateVod):
        repository.update(action.payload)
        break
      default:
        break
    }
  }
}

export type SourceType = 'MOVIE' | 'PREVIEW' | 'POSTER'

class Source extends Entity<Source> {
  id = this.attribute<string>()
  modelName = 'Source' as const
  type = this.attribute<SourceType>()
  vod = this.manyToOne(Vod).ref('sources')

  reduce(action: RootAction, repository: Repository<Source>) {
    switch (action.type) {
      case getType(actions.insertSource):
        repository.create(action.payload)
        break
      case getType(actions.deleteSource):
        if (repository.hasId(action.payload))
          repository.withId(action.payload)!!.delete()
        break
      default:
        break
    }
  }
}

class VodId extends Entity<VodId> {
  id = this.attribute<string>()
  modelName = 'VodId' as const
  vod? = this.oneToOne(Vod).virtualRef('vodId')
}

export type ContentType = 'MOVIE' | 'PREVIEW' | 'POSTER'

class Content extends Entity<Content> {
  id = this.attribute<string>()
  modelName = 'Content' as const
  type = this.attribute<ContentType>()
  vods = this.manyToMany(Vod)
    .through(VodContent)
    .virtualRef('contents', 'content')
}

class VodContent extends Entity<VodContent> {
  id = this.attribute<string>()
  modelName = 'VodContent' as const
  vod = this.manyToOne(Vod).noRef()
  content = this.manyToOne(Content).noRef()
}
