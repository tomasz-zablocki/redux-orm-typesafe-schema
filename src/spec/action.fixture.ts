import { createStandardAction } from 'typesafe-actions'
import { SourceType } from '@spec/schema.fixture'

type Links = { self: string }

type VodPayload = { id: string; title?: string; vodId?: string; links: Links }
type SourcePayload = { id: string; type: SourceType; vod: string }

export const insertVod = createStandardAction('INSERT_VOD').map(
  (vod: VodPayload) => ({ payload: vod })
)

export const insertSource = createStandardAction('INSERT_SOURCE').map(
  (source: SourcePayload) => ({ payload: source })
)

export const deleteSource = createStandardAction('DELETE_SOURCE').map(
  (sourceId: string) => ({ payload: sourceId })
)

export const updateVod = createStandardAction('UPDATE_VOD').map(
  (vod: Partial<VodPayload>) => ({ payload: vod })
)
