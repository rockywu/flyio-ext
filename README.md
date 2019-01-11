## `flyio-ext`

一个简单的调用封装，可以使用多个自定义拦截器功能的flyio

暂时只维护了es6模式，未做es5编译，有需要编译的，可以自行解决

支持:

- **`import fie from 'flyio-ext/lib/h5'`** (游览器环境)
- **`import fie from 'flyio-ext/lib/node'`** (node环境)
- **`import fie from 'flyio-ext/lib/wx'`** (微信小程序环境)
- **`import fie from 'flyio-ext/lib/ap'`** (支付宝小程序环境)

### Install

`npm install --save flyio-ext`

### Usage


#### 注册拦截器

**fie.registerInterceptor(name, {request:(req) => req}, response:(res) =>res }**

**name** `String` 拦截名称

**options** `Object` 拦截器对象 

- **options.request(req)** `Function` 
  
  请求对象拦截函数,入参：req 请返回修改后的req对象
  
- **options.response(res)** `Function` 
  
  响应对象拦截函数,入参：res 请返回修改后的res对象

#### 注册api集

**fie.registerApis(name, config, apiConfigs)**

**name** `String` Api集名称

**config** `Object` Api集公共配置

**apiConfigs** `Object` Api集各api配置

#### 调用注册过的api

**fie.fetch(name, body, config)**

**name** `String` Api名称 见Demo

**body** `Object`

**config** `Object`

### interceptor 执行顺序

如注册拦截器: [INTERCEPTOR1,INTERCEPTOR2, INTERCEPTOR3]

顺序:

`INTERCEPTOR1.request` **→** `INTERCEPTOR21.request` **→** `INTERCEPTOR3.request` **→** `fetch` **↓** 

`INTERCEPTOR1.response` **←** `INTERCEPTOR21.response` **←** `INTERCEPTOR3.response` **←**

### Demo
```
/**
 * h5、node、wx、ap 环境下均可以使用一下方式进行开发使用
 * 已node环境为例
 */
import fie from 'flyio-ext/lib/node'


/**
 * 注册api集合
 */
fie.registerApis('base1', {
  //公共配置 
  baseURL: "BASE_URI1",
  headers: {
    'content-type': 'application/x-www-form-urlencoded'
  },
  parseJson:true, //期望返回数据格式
  interceptors: [INTERCEPTOR_DEFAULT]
}, {
  test: {
    url: 'test.php',
    method: 'post',
    interceptors: [INTERCEPTOR_DEFAULT1, INTERCEPTOR_DEFAULT2]
  },
  getName: {
    url: 'app/getUserInfo.php',
    method: 'get',
    interceptors: [INTERCEPTOR_DEFAULT1, INTERCEPTOR_DEFAULT, INTERCEPTOR_DEFAULT2]
  }
})

fie.registerApis('base2', {
  //公共配置 
  baseURL: "BASE_URI2",
  headers: {
    'content-type': 'application/x-www-form-urlencoded'
  },
  parseJson:true, //期望返回数据格式
  interceptors: [INTERCEPTOR_DEFAULT]
}, {
  test: {
    url: 'test.php',
    method: 'post',
    interceptors: [INTERCEPTOR_DEFAULT1, INTERCEPTOR_DEFAULT2]
  },
  getName: {
    url: 'app/getUserInfo.php',
    method: 'get',
    interceptors: [INTERCEPTOR_DEFAULT1, INTERCEPTOR_DEFAULT, INTERCEPTOR_DEFAULT2]
  }
})

/**
 * 设定拦截器
 */
fie.registerInterceptor(INTERCEPTOR_DEFAULT, {
  request (req) {
    return req
  },
  response (res) {
    return res
  }
})

/**
 * 设定拦截器1
 */
fie.registerInterceptor(INTERCEPTOR_DEFAULT1, {
  request (req) {
    return req
  },
  response (res) {
    return res
  }
})

/**
 * 设定拦截器2
 */
fie.registerInterceptor(INTERCEPTOR_DEFAULT2, {
  request (req) {
    return req
  },
  response (res) {
    return res
  }
})

fie.fetch("base1.test", {
  bodyData1: "1",
  bodyData2: "2",
}, {
  params: {
    paramsData1: 1,
    paramsData2:2
  },
  headers: {}
}).then(v => {
  console.log(v);
});
```

### 自定义平台扩展

`import FlyIOExt from 'flyio-ext'`

使用方式：

[flyio](https://www.npmjs.com/package/flyio)构造函数

new FlyIOExt(flyio)

```
/**
 * 这个为支付小程序扩展模块实现
 * Created by rocky on 2019/1/9.
 */
import FlyIOExt from "flyio-ext"
import Fly from "flyio/dist/npm/fly"
import EngineWrapper from "flyio/dist/npm/engine-wrapper"

/**
 * 支付宝请求封装
 */
function ap(request, responseCallback) {
  let {url, headers, method, body, params, timeout, parseJson} = request;
  my.httpRequest({
    url,
    headers,
    method,
    data: body,
    timeout: timeout || 60 * 1000,
    dataType: parseJson ? 'json': "text",
    success: function(res) {
      console.log("my.httpRequest-success", res)
      responseCallback({
        responseText: res.data,
        statusCode: res.status,
        errMsg:"",
        headers: res.headers
      })
    },
    fail: function(err) {
      console.log("my.httpRequest-fail", err)
      responseCallback({
        responseText: err.data || "",
        statusCode: err.status || "",
        errMsg: err.error || "",
        headers: err.headers ||{}
      })
    }
  })
}

let engine = EngineWrapper(ap)

const apFly = function() {
  return new Fly(engine);
}

export default new FlyIOExt(apFly);
```


