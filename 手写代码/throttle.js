const WebSocket  = require('ws');
const wss = new WebSocket.Server({port:8000});
wss.on('connectin',(ws) => {
    ws.on('message',(message) => {
        wss.clients.forEach((client) => {
            if(client.readyState ===WebSocket.OPEN) {
                client.send(message);
            }
        })
    })
})axios.interceptors.request.use(config =>  {
    const token = locatoStorage.getItem('token');
    if(token){
        config.headers.AUthorization =`Bearer ${token}`;

    }
    if(config.method === 'post' || config.method === 'put' {
        config.data = JSON.stringify(config.data);
    })
    //3.添加请求时间戳防止缓存
    config.params = {
        ...config.params,
        _t: Date.now();
    }
})