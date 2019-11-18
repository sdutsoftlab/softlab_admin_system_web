import Vue from 'vue'
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import router from '../router/index'
let v = new Vue();

axios.defaults.timeout = 10000;                        //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';        //配置请求头
axios.defaults.baseURL = 'http://211.64.28.178/api';   //配置接口地址



// 设置拦截器
axios.interceptors.request.use(function (config) {
    //在发送请求之前做某事
    if (localStorage.token) {
        // 判定token是否过期
        let code = jwtDecode(localStorage.token);
        let now = Math.ceil(new Date().getTime() / 1000);
        if (code.exp >= now) {
            config.headers.Authorization = localStorage.token;
        } else {
            v.$notify.error({
                title: "token失效",
                message: "token失效，请重新登录",
                duration: 1000
            });
            localStorage.removeItem("token");
        }
    }
    return config;
}, function (error) {
    //请求错误时做些事
    v.$notify.error({
        title: "请求失败",
        message: "网络错误，请求后端api失败或token失效，请重新登录",
        duration: 1000
    });
    return Promise.reject(error);
});

//响应拦截器
axios.interceptors.response.use(function (response) {
    //对响应数据做些事

    if (response.data['code'] != 200) {
        // alert("token无效！" + response.data['data'] + "，请重新登录！");
        localStorage.removeItem("token");
        router.push("/login");
    }

    return response;
}, function (error) {
    //请求错误时做些事
    // v.$notify.error({
    //     title: "请求失败",
    //     message: "网络错误，请求后端api失败",
    //     duration: 1000
    // });
    return Promise.reject(error);
});

//模块化导出
export default axios;