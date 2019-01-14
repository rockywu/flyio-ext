'use strict';

// import {assert} from 'chai'
const fie = require('../lib/node').default

// describe('flyio-ext', () => {
//     it('needs tests', () => {
//       assert.equal(3, 3)
//     });
// });

const DEFAULT = '_DEFAULT_'

fie.registerApis("name", {
  baseURL: "http://127.0.0.1",
  headers: {
    "content-type":"application/x-www-form-urlencoded"
  },
  parseJson:false,
  interceptors: [DEFAULT]
}, {
  ccc: {
    url: "ccc.php",
    method: "post",
  }
})

fie.registerInterceptor(DEFAULT, {
  request: (req) => {
    return req
  },
  response: (res)=> {
    return res
  }
})

fie.fetch("name.ccc", {
  name: 22,
  age: 23
}, {
  params : {
    name : 2,
    age: 3
  }
}).then(v => {
  console.log("ccc", v.data)
})


