import type { BookClient } from '@/lib/contracts/book-client'
import { MockBookClient } from './mock-book-client'

export { MockBookClient } from './mock-book-client'
export type { BookClient } from '@/lib/contracts/book-client'

/**
 * Single swap point for the transport. When the FastAPI backend ships, return
 * a WebSocket-backed `BookClient` here (e.g. when NEXT_PUBLIC_BOOKEY_WS_URL is
 * set); no component needs to change.
 */
export function createBookClient(): BookClient {
  return new MockBookClient()
}
