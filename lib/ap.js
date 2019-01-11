/**
 * Created by rocky on 2019/1/9.
 */
import FlyIOExt from "./flyio-ext"
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
