# ws-rest README

    Imgbb's API v1 allows to upload pictures.

## install

```
yarn add imgbb
```

## demo

```ts
import ApiClient from 'imgbb';
import consoleDebug from 'restful-decorator/lib/util/debug';
import fs from 'fs-extra';

(async () =>
{

 let api = new ApiClient({
  token: 'YOUR_CLIENT_API_KEY',
 });

 let ret = await api.upload({
   /**
    * A binary file, base64 data, or a URL for an image. (up to 16MB)
    */
   image: await fs.readFile('./miku_small.png'),
  })
  .catch(e => consoleDebug.red.dir(e))
 ;

 console.dir(ret);

})();
```

