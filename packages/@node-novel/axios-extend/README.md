# README.md

    <description>

## install

```
yarn add @node-novel/axios-extend
```

```ts
import extendAxios from '@node-novel/axios-extend'
import _axios from 'axios';

const { axios, setupCacheConfig, mixinCacheConfig } = extendAxios(_axios)
```