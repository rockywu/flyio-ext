/**
 * Created by rocky on 2019/2/21.
 */
import FlyIOExt from "./flyio-ext"
import Fly from "flyio/dist/npm/fly"
import EngineWrapper from "flyio/dist/npm/engine-wrapper"

let isProd = process.env.NODE_ENV == 'production'
/**
 * 微信小程序适配器
 * 重新包装微信请求封装
 */
function wxRequest(request, responseCallback) {
  var con = {
    method: request.method,
    url: request.url,
    header: request.headers,
    data: request.body||{},
    dataType: request.parseJson ? 'json': (request.responseType || 'text'),
    success(res) {
      !isProd && console.log('request-success', res)
      responseCallback({
        statusCode: res.statusCode,
        responseText: res.data,
        headers: res.header,
        statusMessage: res.errMsg
      })
    },
    fail(res) {
      !isProd && console.log('request-fail', res)
      responseCallback({
        statusCode: res.statusCode||0,
        statusMessage: res.errMsg
      })
    },
    complete(res) {
    }
  }
  wx.request(con)
}


let engine = EngineWrapper(wxRequest)

const wxFly = function() {
  return new Fly(engine);
}

export default new FlyIOExt(wxFly);
