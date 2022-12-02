# &lt;umd-today-feed&gt; element

## Installation

```
$ yarn add @universityofmaryland/todayfeed
```

## Basic Usage

#### Import the Today Feed in your js if you bundle using a transpile with babel or typescript.

```js
import '@universityofmaryland/todayfeed';
```

#### HTML usage

```html
<umd-today-feed
  token="ty5hts_R6EWaNT8zBYqVT8edynE0f9cK"
  categories="92335,92357"
></umd-today-feed>
```

## Attribute options

1. Bearer Token (required) - token to authenicate for today feed
2. Categories - ids for categories/taxonomies. Defaults to all events if not entered

## License

Distributed under the MIT license. See LICENSE for details.
