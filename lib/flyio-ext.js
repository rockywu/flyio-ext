'use strict';
/**
 * Created by rocky on 2019/1/9.
 * flyio-ext补充flyio为提供的接口配置项设定
 *
 * ext分为
 * 1、配置模块
 * 2、拦截器设定
 *
 *
 */
const fn = (v) => v

const typeErrMsg = (k, t) => `The parameter ${k} type must be a ${t}`

class FlyIOExt {

  /**
   * 注册拦截器行为
   * @param name
   * @param request
   * @param response
   */
  registerInterceptor(name, {request = fn, response = fn}) {
    if(!name || typeof name !== 'string') {
      throw new TypeError('The parameter name type must be a string');
      return
    }
    console.log("registerInterceptor", name)
    this._interceptors[name] = {
      request,
      response
    }
  }

  /**
   * 批量注册api
   * @param name api集群名称
   * @param config api集群基本配置
   * config: {
   *   headers:{}, //http请求头，
   *   baseURL:"", //请求基地址
   *   timeout:0,//超时时间，为0时则无超时限制
   *   //是否自动将Content-Type为“application/json”的响应数据转化为JSON对象，默认为true
   *   parseJson:true,
   *   params:{}, //默认公共的url get参数
   *   withCredentials:false, //跨域时是否发送cookie
   *   interceptors: [], //公共拦截器
   * }
   * @param apis 各api配置
   */
  registerApis(name, config = {}, apis = {}) {
    if(!name || typeof name !== 'string') {
      throw new TypeError(typeErrMsg('name', 'string'))
    }
    if(!config || typeof config !== 'object') {
      throw new TypeError(typeErrMsg('config', 'object'))
    }
    if(!apis || typeof apis !== 'object') {
      throw new TypeError(typeErrMsg('apis', 'object'))
    }
    this._apis[name] = {
      config,
      apis
    }
  }

  constructor(fly) {
    /**
     * 拦截器模块集
     */
    this._interceptors = {}
    /**
     * 存储所有api，每个api以模块声明
     */
    this._apis = {}
    /**
     * 环境对象fly对象
     */
    this._fly = fly;
  }

  /**
   * 获取数据
   * @param name
   */
  fetch(name, body = {}, config = {}) {
    let tmp = name.split(".")
    let root = tmp.shift();
    let child = tmp.join(".");
    let {_apis, _interceptors} = this;
    let rootOpt = null, childOpt = null;
    if(!(rootOpt = _apis[root]) || ! (childOpt = rootOpt.apis[child]) ) {
      throw new ReferenceError(`调用的${name}不存在`)
    }
    //执行拦截器合并去重
    let interceptors = Array.from(new Set([...childOpt.interceptors || [], ...rootOpt.config.interceptors || []]));
    //检查拦截器是否都存在
    interceptors = interceptors.map(key => {
      if(!_interceptors[key]) {
        throw new ReferenceError(`不存在名为${key}的拦截器`)
      }
      return _interceptors[key];
    })
    let fly = new this._fly()
    Object.assign(fly.config, rootOpt.config)
    //注册request拦截器
    fly.interceptors.request.use(req => {
      return interceptors.reduce((prev, curv) => {
        return curv.request(prev)
      }, req)
    });
    //注册response拦截器
    fly.interceptors.response.use(res => {
      return interceptors.reduceRight((prev, curv) => {
        return curv.response(prev)
      }, res)
    }, err => {
      console.log(`出现网络异常`, err)
      return err;
    });
    //执行接口调用
    return fly.request(childOpt.url, body,  Object.assign({}, childOpt, config, {
      headers: Object.assign({}, childOpt.headers|| {}, config.headers || {}),
      params : Object.assign({}, childOpt.params || {}, config.params || {})
    }))
  }
}

export default FlyIOExt
