import { Content, Source, Vod, VodId } from '@spec/schema.fixture'
import { testType } from '@spec/utils'
import { EntityKeys, RelationType } from './fields'

// @dts-jest:group EntityKeys ->
describe('fields', () => {
  it('EntityKeys ->', () => {
    // @dts-jest:pass:snap Attribute<Vod>
    testType<EntityKeys.Attribute<Vod>>()

    // @dts-jest:pass:snap Relation<Vod, *>
    testType<EntityKeys.Relation<Vod, RelationType>>()

    // @dts-jest:pass:snap Relation<Vod ,OneToOne>
    testType<EntityKeys.Relation<Vod, 'OneToOne'>>()

    // @dts-jest:pass:snap Relation<Vod, OneToMany>
    testType<EntityKeys.Relation<Vod, 'OneToMany'>>()

    // @dts-jest:pass:snap Relation<Vod, ManyToOne>
    testType<EntityKeys.Relation<Vod, 'ManyToOne'>>()

    // @dts-jest:pass:snap Relation<Vod, ManyToMany>
    testType<EntityKeys.Relation<Vod, 'ManyToMany'>>()

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
