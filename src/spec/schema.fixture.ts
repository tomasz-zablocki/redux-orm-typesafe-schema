import { Entity } from '../types/schema'
import { wireSchema } from '../wire-schema'
import { ActionType } from 'typesafe-actions'
import { Orm, Repository } from '../types/redux-orm'

export { schema, Vod, VodContent, VodId, Content, Source }

type Links = { self: string }

class Vod extends Entity<Vod> {
  modelName = 'Vod' as const
  id = this.attribute<string>()
  title = this.attribute<string>()
  links = this.attribute<Links>()
  sources = this.oneToMany(Source).ref('vod')
  vodId = this.oneToOne(VodId).ref('vod')
  contents = this.manyToMany(Content)
    .through(VodContent)
    .ref('vods', 'vod')

  reduce<AType extends ActionType<any>>(
    action: AType,
    repository: Repository<Vod>
  ) {}
}

type SourceType = 'MOVIE' | 'PREVIEW' | 'POSTER'

class Source extends Entity<Source> {
  modelName = 'Source' as const
  type = this.attribute<SourceType>()
  vod = this.manyToOne(Vod).ref('sources')

  reduce<AType extends ActionType<any>>(
    action: AType,
    repository: Repository<Source>
  ) {}
}

class VodId extends Entity<VodId> {
  modelName = 'VodId' as const
  vod = this.oneToOne(Vod).virtualRef('vodId')
}

class Content extends Entity<Content> {
  modelName = 'Content' as const
  vods = this.manyToMany(Vod)
    .through(VodContent)
    .virtualRef('contents', 'content')
}

class VodContent extends Entity<VodContent> {
  modelName = 'VodContent' as const
  vod = this.manyToOne(Vod).noRef()
  content = this.manyToOne(Content).noRef()
}

const schema = wireSchema(new Orm(), {
  Vod,
  Source,
  VodId,
  Content,
  VodContent
})
