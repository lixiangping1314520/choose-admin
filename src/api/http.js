import axios from 'axios'
import qs from 'qs'
import _ from 'underscore'
import { Loading, Message } from 'element-ui'

export default{
	install(Vue, options){	
		Vue.prototype.$httpRequest = function(options){
			if (!options.path) return;				
         // http请求拦截器
        var loadinginstace;
          axios.interceptors.request.use(config => {
         // element ui Loading方法
        //  loadinginstace = Loading.service({ fullscreen: true })
         return config
         }, error => {
            loadinginstace.close()
           Message.error({
           message: '加载超时'
            })
           return Promise.reject(error)
         })
          // http响应拦截器
          axios.interceptors.response.use(data => {// 响应成功关闭loading
        //    loadinginstace.close()
           return data
           }, error => {
        //    loadinginstace.close()
           return Promise.reject(error)
           });
			// axios.defaults.headers.common['Authorization'] = this.$cookie.get('token') || '';
			axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';
			axios.defaults.headers.get['content-Type'] = 'application/x-www-form-urlencoded';
			let defaults = {};
			let args = _.extend(defaults, options.args || {});
			if (options.type == 'post'){
				axios({
					// baseURL: 'http://172.16.201.236:8080',
					baseURL: 'https://www.lixiangping.cn:44/',
					method: options.type,
					url: options.path,
					data: args
				}).then((resp) => {
					console.log(resp.status);
					if (resp.status == '200'){
						options.success(resp.data);
						// if (resp.data.code == '200'){
						// 	options.success(resp.data.data);
						// }
						// else if (resp.data.code == '202'){
						// 	options.fail(resp.data.msg);
						// 	console.log(resp.data)
						// }else{
						// 	options.failll(resp.data.msg);
						// }
					}else if (resp.status=='0') {
						console.log(resp.data)
							options.fail(resp.data);
					}
				});
			}
			else if(options.type == 'get'){				 
				axios({
					// baseURL: 'http://172.16.201.14:8080/',
					baseURL: 'https://www.lixiangping.cn/',
					method: options.type,
					url: options.path,
					params: args,
				}).then((resp) => {
					if (resp.status == '1'){
						// if (resp.data.code == '200'){
						// 	options.success(resp.data.data);
						// }
						// else if (resp.data.code == '202'){
						// 	options.fail(resp.data.msg);
						// }
					}
					else {
                       return
					}
				})
				.catch((err)=>{
                   return;
                  alert(111)
                });
			}
			
		}
	}
}