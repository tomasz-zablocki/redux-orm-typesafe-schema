import { schema } from '@spec/schema.fixture'

describe('Typed Repository specs', () => {
  let { Vod } = schema

  describe('Vod repository', () => {
    it('should insert and fetch expected vods', () => {
      //given
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
  })
})
