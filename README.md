# Payload SDK `fallbackLocale: false` reproduction

The SDK does not send `fallbackLocale: false` to the REST API, so the request
still uses the fallback locales of the configuration.

This app is the blank template with SQLite, plus:

- a localization config where `en` falls back to `fr`
  ([`src/payload.config.ts`](src/payload.config.ts));
- a `posts` collection with a localized `title`
  ([`src/collections/Posts.ts`](src/collections/Posts.ts));
- a script that reads a post through the SDK
  ([`scripts/repro.ts`](scripts/repro.ts)).

## Steps

1. Install the dependencies and start the dev server:

   ```sh
   pnpm install
   pnpm dev
   ```

2. In another terminal, run the script:

   ```sh
   pnpm repro
   ```

The script creates a post with a title in `fr` and no title in `en`. Then it
reads the post in `en` with the SDK and `fallbackLocale: false`, and with a
plain `fetch` and `fallback-locale=false`.

## Result

```text
$ pnpm repro
SDK request URL: http://localhost:3000/api/posts/1?locale=en
SDK title with fallbackLocale: false (expected null): Titre en français
REST title with fallback-locale=false: null
```

The SDK request URL has no `fallback-locale` parameter, so the SDK returns the
`fr` title. The REST API returns `null` when the request has the parameter.

## Cause

`buildSearchParams` in `packages/sdk/src/utilities/buildSearchParams.ts` adds
`fallback-locale` only when the value is truthy:

```ts
if (args.fallbackLocale) {
  search['fallback-locale'] = String(args.fallbackLocale)
}
```
