<h1 align="center"><pre>@stablyhq/stably-node-sdk</pre></h1>

<p align="center">
  <a href="https://www.npmjs.com/package/@mux/mux-node"><img src="https://img.shields.io/npm/v/@stablyhq/stably" title="NPM" /></a>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@stablyhq/stably">NPM</a>
</p>

# Installation
`npm install @stablyhq/stably --save`
or
`yarn add @stablyhq/stably`

# Usage

**1) Initialize**

```node
import { Analytics } from 'stablyhq/stably'

const analytics = Analytics("YOUR_WRITE_KEY")
```
You can find your write key at https://app.stably.dev/

**1) Call**
Re-use the above analytics instance and call track with your event name:
```node
analytics.track("account_creation_start")
```

# Development
To build, you can run `npm run build`.

To have updated versions sent with the library, you'll want to first run `npm run gen`

# Contributing
Please feel free to open issues or pull requests. We love any feedback!
