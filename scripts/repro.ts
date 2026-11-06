import { PayloadSDK } from '@payloadcms/sdk'

import type { Config } from '../src/payload-types'

const baseURL = process.env.PAYLOAD_API_URL || 'http://localhost:3000/api'

let lastURL = ''
const sdk = new PayloadSDK<Config>({
  baseURL,
  fetch: (input, init) => {
    lastURL = new Request(input).url
    return fetch(input, init)
  },
})

// The post has a title in fr and no title in en.
// The en locale falls back to fr.
const post = await sdk.create({
  collection: 'posts',
  data: { title: 'Titre en français' },
  locale: 'fr',
})

const sdkPost = await sdk.findByID({
  collection: 'posts',
  fallbackLocale: false,
  id: post.id,
  locale: 'en',
})
console.log('SDK request URL:', lastURL)
console.log('SDK title with fallbackLocale: false (expected null):', sdkPost.title)

const restPost: { title?: null | string } = await (
  await fetch(`${baseURL}/posts/${post.id}?locale=en&fallback-locale=false`)
).json()
console.log('REST title with fallback-locale=false:', restPost.title ?? null)
