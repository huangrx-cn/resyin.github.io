---
title: 简易的 HTTP 基础（一）
tags: [HTTP]
categories: "HTTP"
comments: true
---

# HTTP 

*HyperText Transfer Protocol* 超文本转移协议。

目前主流版本为 **HTTP/1.1** ，标准为[RFC](http://www.ietf.org/rfc/rfc2616.txt)。

<!-- more -->

# TCP/IP 协议族

是互联网相关各类协议族的总称，通常使用的网络均是在 TCP/IP 协议族上运作的。

HTTP 为其一个子集。

### TCP/IP 协议族的分层

- 应用层 
- 传输层 
- 网络层 
- 数据链路层

**应用层**

决定了向用户提供应用服务时通信的活动。

- FTP *File Transfer Protocol*
- DNS *Domain Name System*
- HTTP 

**传输层**

对处于网络连接的设备提供数据传输。

- TCP *Transmission Control Protocol*
- UDP *User Data Protocol*

**网络层**

网络互连层，用来处理网络上流动的数据包（网络传输的最小单位）。规定了如何选择路径将数据包传给目标设备。

**链路层**

网络接口层，用来处理连接网络的硬件部分。包括操作系统、硬件驱动、网卡等。

### TCP/IP 协议族的通信传输流

通过分层的顺序在设备间通信。

1. 客户端在应用层以 HTTP 协议发送一个 HTTP 请求
2. 为传输方便，传输层以 TCP 协议将从应用层接收到的 HTTP 请求报文进行处理：将报文标记序号以及端口号
3. 网络层以 IP 协议将应用层处理后的数据做进一步处理：添加作为通信目的地的 MAC 地址
4. 服务器在链路层接收网络层数据，并按序向上传递到服务器的应用层，完成一次由客户端到服务器的 HTTP 请求

数据的封装：发送端在层与层间会增加属于该层的首部信息，接收端层与层间会消去属于该层的首部信息。于是最后得到的是最初的 HTTP 数据。

### TCP/IP 协议族的 IP

*Internet Protocol* 网际协议，处于网络层，用于指定传输目的地的地址。主要包括：

- IP 地址，指定节点地址（可变）
- MAC *Media Access Control Address* 地址，指定网卡地址（不变）

ARP *Address Resolution Protocol* 地址解析协议，可以根据 IP 地址反查出 MAC 地址。所以 IP 间通信主要依赖 MAC 。

Routing 路由选择，当往某 IP 地址发送数据但 ARP 未解析出 MAC 时，会先将数据发往已知的 MAC 做路由中转。该过程可能会重复多次，直到将数据发送到某 MAC ，该 MAC 即 IP 地址所在的 MAC 。


### TCP/IP 协议族的 TCP

处于传输层，主要为数据提供可靠的字节流服务，在发送端将报文段分割为数据包进行传输；并在接收端将数据包重组为报文段。

为确保数据安全，TCP 采用了 three-way handshaking 3次握手策略。

1. 发送端将带有 SYN *synchronize* 标志的数据包发送给接收端
2. 接收端将带有 SYN/ACK *acknowledgement* 标志的数据包发送给发送端用来确认可以传输
3. 发送端将带有 ACK 标志的数据包再发给接收端表示握手结束

### TCP/IP 协议族的 DNS

与 HTTP 同处于应用层。提供域名与 IP 地址间的解析服务。

域名比起 IP 地址的数字更容易被记住，所以通常情况我们以域名来访问网络。然而计算机更容易处理数字表示的 IP 地址。所以需使用 DNS 将域名解析为 IP 地址；也可以将 IP 地址转为域名。

### URI & URL

- URI *Uniform Resource Identifier* 统一资源标识符，用于表示某一网络资源
- URL *Uniform Resource Locator* 统一资源定位符，用于表示某一网络地点，通常所说的网址

由于地址也可视为资源的一种，所以 URL 为 URI 的子集。

URI 的格式：

`http://user:pass@localhost:port/dir/res?param=value`

- http: 应用层协议
- user:pass 认证信息，可省略
- localhost 服务器地址
- port 服务器端口号
- dir 资源所在的路径
- res 资源文件
- param 参数，可省略
- value 参数值，可省略

# HTTP 协议

HTTP 协议是 stateless 无状态协议：不对请求和响应之间的状态进行保存，不对请求和响应做持久化处理。也就是说当次请求与响应，与之前的请求与响应无关。但有时我们需要状态保存，所以引入了 Cookie 。

### Request 请求

HTTP 协议规定，请求从客户端出发。客户端会发送类似这样的 HTTP 请求报文：

```
method URI HTTP/1.1
Host: 
Connection: 
Accept: 
User-Agent: 
Accept-Encoding: 
Accept-Language: 
Cookie:
...

...
```

- 第一行描述了请求方法，访问的资源，HTTP 协议版本
- 第二行到第九行，描述了可选的请求首部信息，即 Request Header
- 第十行为空行，用于区分 Header 与 Body 
- 第十一行开始描述请求的主体，即 Request Body 

#### Request Method 请求方法

###### GET

用于获取资源。

###### POST

用于提交数据，同时也可以获取资源。

GET也可以用于提交数据，但是由于是将请求信息拼接到 URI 中，使请求信息可见，所以存在安全隐患，并不建议以 GET 提交数据。

###### PUT

用于传输文件。将文件内容置于请求主体中传输。但是 PUT 方法不能身份认证，所以人人可以传输文件存在安全隐患，所以不建议使用。

###### HEAD

用于返回 Response Header 响应首部。与 GET 方法区分：GET 主要是获取资源，即 Response Body 主体部分。

###### DELETE

用于删除文件。与 PUT 方法相反。

###### OPTIONS

用于查询 URI 所支持的 Request Method 请求方法。

###### TRACE

用于路径追踪。不常用。

###### CONNECT

用于在与代理服务器通信时建立隧道，主要使用 SSL *Secure Sockets Layer* 安全套阶层与 TLS *Transport Layer Security* 传输层安全协议把通信内容加密后传输。

###### LINK&UNLINK

HTTP/1.0 中的方法，HTTP/1.1 已弃用。

### Response 响应

```
HTTP/1.1 status-code status-phrase
Server
Date:
Content-Length:
 
<html>
...
...
```

- 第一行描述了 HTTP 协议版本，状态码，状态短语
- 第二行到第四行，描述了响应首部信息，即 Response Header
- 第五行为空行，用于区分 Header 与 Body 
- 第六行开始描述响应的主体，即 Response Body

### Cookie 状态管理

通过在请求与响应报文中写入 Cookie 信息来控制客户端的状态。

1. 客户端第一次请求服务器时，服务器生成一个 Cookie 并在响应时把该 Cookie 设置在 Response Header 中的 Set-Cookie 内
2. 客户端收到服务器的响应，保存 Response Header 中 Set-Cookie 的 Cookie 
3. 客户端再次请求服务器时会自动在请求 Request Header 中的 Cookie 内添加 Cookie ，服务器得到这个 Cookie ，识别出这是之前传给某客户端的 Cookie ，于是找到了该客户端，获取其之前请求与响应的状态

# 参考 & 引用

- 图解 HTTP
- HTTP 权威指南

