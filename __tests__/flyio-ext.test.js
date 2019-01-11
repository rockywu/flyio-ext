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
  interceptors: [DEFAULT]
}, {
  ccc: {
    url: "ccc.php",
    method: "get",
  }
})

fie.registerInterceptor(DEFAULT, {
  request: (req) => {
    req.body.a = 1;
    return req
  },
  response: (res)=> {
    if(!res.data.a7) {
      res.data.a7 = []
    }
    res.data.a7.push(1)
    return res
  }
})

fie.fetch("name.ccc", {
  name: 1,
  age: 23
}, {
  params : {
    ddd : 1,
    ccc: 2
  }
}).then(v => {
  console.log("ccc", v.data)
})


