# Nextjs headroom

This is modern version of the (react-headroom)[https://www.npmjs.com/package/react-headroom] package, adopted to the (nextjs)[https://nextjs.org/] framework.

# Install

`npm install nextjs-headroom`

# Usage

```jsx
import { Headroom } from "nextjs-headroom";

<Headroom>
  <h1>You can put anything you'd like inside the Headroom Component</h1>
</Headroom>
```

# Props

- `pin` - (optional, `boolean`) pin headroom permanently
- `upTolerance` - (optional, `number`) scroll tolerance in px when scrolling up before component is pinned
- `downTolerance` - (optional, `number`) scroll tolerance in px when scrolling down before component is pinned
- `pinStart` - (optional, `number`) Height in px where the header should start and stop pinning. Useful when you have another element above Headroom component
- `style` - (optional, `React.CSSProperties`) custom styles
- `onPin` -  (optional, `function`) callback called when header is pinned
- `onUnpin` -  (optional, `function`) callback called when header is unpinned
- `onUnfix` - (optional, `function`) callback called when header position is no longer fixed
