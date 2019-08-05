# README.md

    extend axios with a set of plugins

## install

```
yarn add @node-novel/axios-extend
```

```ts
import extendAxios from '@node-novel/axios-extend'
import _axios from 'axios';

const { axios, setupCacheConfig, mixinCacheConfig } = extendAxios(_axios)
```