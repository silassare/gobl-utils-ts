# About

Gobl typescript utilities for web app.

# Reviving entities from JSON

Importing the package changes nothing global. To turn serialized entities (marked with `__gobl__`, or
recognized from their exact set of columns) back into instances of the registered classes, opt in:

```ts
import { goblJSONReviver, parseGoblJSON } from 'gobl-utils-ts';

const data = parseGoblJSON(text); // or JSON.parse(text, goblJSONReviver)
```

# Changes in 2.0.0

-   Importing the package no longer replaces the global `JSON.parse`: use `parseGoblJSON()` or
    `goblJSONReviver`.
-   `cacheKey()` is always a string: the primary key value (`0` included), or, for a composite primary key,
    the JSON array of its values in column name order; `null` when a primary key value is missing.
-   `toInstance()` no longer removes the marker from the data it is given; `register()` no longer sorts the
    entity class's `COLUMNS`.
-   `_bool()` returns `null` for `null` / `undefined`; `_int()` returns `null` for them and for what is not a
    number.

# Notes

To prevent conflict between:

-   entity class property name and column magic getter and setter
-   entity class method and column method (getter and setter)

We only use:

-   a prefix with a single `_` for property
-   camelCase method name avoiding prefixing with `get` or `set`

So don't use: `getSomething`, `setSomething` or `our_property`

Use instead: `_getSomething`, `_setSomething`, `doSomething` or `_our_property`
