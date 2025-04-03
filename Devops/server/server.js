
const http = require('http');

// 创建一个 HTTP 服务器
const server = http.createServer((req, res) => {
    // 打印接收到的请求方法和 URL
    console.log(`Request Method: ${req.method}`);
    console.log(`Request URL: ${req.url}`);

    // 输出接收到的数据
    let body = '';

    // 监听请求数据
    req.on('data', chunk => {
        body += chunk.toString(); // 将 Buffer 转换为字符串
    });

    // 当数据接收完毕时
    req.on('end', () => {
        console.log(`Request Body: ${body}`);
        // 发送响应
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Received your data!');
    });
});

// 服务器监听 3000 端口
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running at http://192.168.1.221:${PORT}`);
});