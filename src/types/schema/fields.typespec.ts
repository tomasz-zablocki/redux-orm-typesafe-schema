import { Content, Source, Vod, VodId } from '@spec/schema.fixture'
import { testType } from '@spec/utils'
import { EntityKeys } from './fields'

// @dts-jest:group EntityKeys
describe('Entity Field types', () => {
  it('EntityKeys', () => {
    // @dts-jest:pass:snap Attributes<Vod>
    testType<EntityKeys.Attributes<Vod>>()
    // @dts-jest:pass:snap Relations<Vod,OneToOne>
    testType<EntityKeys.Relations<Vod, 'OneToOne'>>()
    // @dts-jest:pass:snap Relations<Vod, OneToMany>
    testType<EntityKeys.Relations<Vod, 'OneToMany'>>()
    // @dts-jest:pass:snap Relations<Vod, ManyToOne>
    testType<EntityKeys.Relations<Vod, 'ManyToOne'>>()
    // @dts-jest:pass:snap Relations<Vod, ManyToMany>
    testType<EntityKeys.Relations<Vod, 'ManyToMany'>>()
    // @dts-jest:pass:snap OneToOne<Vod, VodId>
    testType<EntityKeys.OneToOne<Vod, VodId>>()
    // @dts-jest:pass:snap OneToMany<Vod, Source>
    testType<EntityKeys.OneToMany<Vod, Source>>()
    // @dts-jest:pass:snap ManyToOne<Source, Vod>
    testType<EntityKeys.ManyToOne<Source, Vod>>()
    // @dts-jest:pass:snap ManyToMany<Vod, Content>
    testType<EntityKeys.ManyToMany<Vod, Content>>()
    // @dts-jest:pass:snap OneToOne<VodId, Vod>
    testType<EntityKeys.OneToOne<VodId, Vod>>()
    // @dts-jest:pass:snap ManyToMany<Content, Vod>
    testType<EntityKeys.ManyToMany<Content, Vod>>()
  })
})
