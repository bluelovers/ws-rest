# README

    ws-rest

```
yarn add router-uri-convert
```

```ts
let source = `/users/:user`;

let actual = routerToRfc6570(source);
let expected = `/users/{+user}`;

expect(actual).to.be.deep.equal(expected);

expect(rfc6570ToRouter(actual)).to.be.deep.equal(source);
```
