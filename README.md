# About

Gobl typescript utilities for web app.

# Reviving entities from JSON

Importing the package changes nothing global. To turn serialized entities (marked with `__gobl__`, or
recognized from their exact set of columns) back into instances of the registered classes, opt in:

```ts
import { goblJSONReviver, parseGoblJSON } from 'gobl-utils-ts';

const data = parseGoblJSON(text); // or JSON.parse(text, goblJSONReviver)
```

# Changes

See [CHANGELOG.md](CHANGELOG.md).

# Notes

To prevent conflict between:

-   entity class property name and column magic getter and setter
-   entity class method and column method (getter and setter)

We only use:

-   a prefix with a single `_` for property
-   camelCase method name avoiding prefixing with `get` or `set`

So don't use: `getSomething`, `setSomething` or `our_property`

Use instead: `_getSomething`, `_setSomething`, `doSomething` or `_our_property`
