# JWT简介与实现

## Token

token思想可理解为临时且唯一的密码。一般情况下Java项目的token都会使用UUID生成来保证唯一，通过缓存（redis）的有效期机制实现token的临时性。实际项目中，token的性质与session相似，但是session是存储在服务器端，服务器重启则会清空。session中的内容类似token存放在缓存中的内容，session的id类似token作为key。

如果session在大型项目中使用，是和其他缓存同时存放在服务器上的，这会拖慢服务器的性能。在访问量较大的项目中，一般使用token替代session。使用token的情况下，是依赖redis等缓存服务器的。

### token使用

- 前后端分离项目登录流程使用token来记忆用户登录状态流程如下：

  1. 用户输入账号和密码并验证通过。
  2. 使用UUID生成token。
  3. 将token缓存到redis中，key即token值，value即用户ID。
  4. 将token返回到客户端，客户端将token作为cookie存储。

- 前后端分离时检测用户登录状态流程如下：

  1. 客户端将cookie中的token值发送到服务器端。
  2. 服务器接收到token后再redis中获取到用户ID。
  3. 再去持久层数据库中根据ID获取用户信息响应给客户端。 


### token的优点

1. 安全性：客户端只会看到UUID或其他加密信息，不会直接看到用户ID或者其他敏感信息，并且隐藏了参数的真实性。
2. 临时且唯一，不会出现冲突，并且可以通过Redis控制使用时长。

JWT的认证信息全部存储在客户端，服务端不存储客户端认证信息：

![image-20200915160328541](media/image-20200915160328541.png)

## JWT

JSON Web Token (JWT)是一个开放标准(RFC 7519)，它定义了一种紧凑的、自包含的方式，用于作为JSON对象在各方之间（前端到后端，或者多个后台系统之间）安全地传输信息。也就是将token中存储的数据按照json（数据交换格式，轻量级跨语言的格式，可以减少带宽且可读性高）格式进行包装传输。JWT和token的设计思想基本一致。

token：下列场景中使用JSON Web Token是很有用的：
1. Authorization (授权) : 这是使用JWT的最常见场景，与token的使用方式相同。一旦用户登录，后续每个请求都将包含JWT，允许用户访问该令牌允许的路由、服务和资源。单点登录是现在广泛使用的JWT的一个特性，因为它的开销很小，并且可以轻松地跨域使用。
2. Information Exchange (信息交换) : 对于安全的在各方之间传输信息而言，JSON Web Tokens无疑是一种很好的方式。因为JWTs可以被签名，例如，用公钥/私钥对，你可以确定发送人就是它们所说的那个人。另外，由于签名是使用头和有效负载计算的，您还可以验证内容没有被篡改。

> JWT是一种思想，通过语言实现的一种授权和登录方式。并没有实际的API和框架包装实现。

### JWT的应用

在实际生产中，使用JWT进行认证的步骤：

1. 前端通过web表单提交用户名密码到后端接口，一般为http post请求，也可以使用SSL加密（https协议）避免敏感数据被嗅探。
2. 后端核对用户名和密码后，将用户唯一表时作为JWT的内容，并添加头部信息和盐值加密后生成JWT。
3. 将生成的JWT发送到客户端，使其保存在本地缓存或cookie中。
4. 客户端在请求服务端时，将JWT放入HTTP Header的认证位置（Authorization），避免XSS和XSRF问题。
5. 后端检查JWT的正确有效性，检查JWT是否过期，检查Token的接收方是否为本服务器。
6. 验证通过后使用JWT中的用户信息进行逻辑操作，响应内容。

### JWT的优势

1. 简洁：通过URL/POST参数或者在HTTP header发送，因为数据量小，传输速度也很快。
2. 自包含：JWT的内容中可以包含用户所需要的所有信息，避免了多次查询数据库。
3. 因为Token是JSON加密的形式保存在客户端的，所以JWT是跨语言的，原则上任何web形式都支持。
4. 不需要服务器保存会话信息，比较适合分布式微服务项目。

**优点：**

1. 减去服务器端的压力，在高并发时减轻缓存服务器的压力。
2. 查询效率比token高，不用去redis中查询内容，直接解密即可。
3. 不容易被客户端篡改加密文件。

**缺点：**

1. 不方便控制销毁时机，因为没有在缓存服务器里，只是通过http请求不停交换。所以要在JWT的payload中添加一个时间戳，用于控制JWT的有效期。
2. JWT的payLoad内容过多，会占用过多的带宽负载。

### session的问题

1. 多个不同的客户端访问服务器都将在服务器中创建session实例，随着认证用户的增多，服务端的内存开销会增大。
2. 用户认证后，服务端所记录的客户端的认证信息时保存在服务端内存中的，只有客户端将请求发送到服务器上时才能拿到授权的资源，这样在分布式的应用中，限制了负载均衡的能力。
3. session是基于cookie进行用户识别的，cookie如果被截获就容易出现跨站请求伪造攻击。
4. 在前后端分离项目中，用户的一次请求要被转发多次，如果使用session就要每次都携带sessionid来定位用户的信息session。在访问量较大时，会增加服务器的压力，并且多次的请求访问容易被截获cookie从而导致CSRF（跨站伪造请求攻击）攻击。如果后端采用多节点部署，还涉及session共享机制。

### session与JWT

此前记录用户登录状态通常使用session的方式：因为HTTP请求是无状态的，也就是在客户端发送请求服务端接收请求后会话就结束了，所有的数据都清空了，在每次请求服务器的时候并不知道是哪个客户端发送的请求，所以出现了session，用于记录每个客户端的标识，当然这个标识也就是通过cookie在每个请求中携带而促成的。

> HTTP协议本身是一种无状态的协议，服务器并不能知道是哪个客户端发出的请求，这就意味着如果用户向服务器提供了用户名和密码进行认证后，再一次发送请求要重新认证。所以为了让服务器记忆并识别每个客户端和客户端的认证，只能在服务器中存储一份客户端认证信息，这份信息会在响应时传递给客户端并保存为cookie，以便于再一次访问服务器时用于参考客户端认证状态，这就是传统的基于session的认证。

## JWT组成部分

1. header 头部：标记令牌的类型（JWT类型），以及使用什么算法。

   ```json
   {
       "alg":"HS256",
       "typ":"JWT"
   }
   ```

2. PayLoad 载荷：JWT中存放的内容，可以是任何内容但是必须要用json格式存放，要注意其中不能存放敏感的数据。

   ```json
   {
       "id":1,
       "name":"hello",
       "admin":true
   }
   ```

3. signature 签名：载荷和头部内容以及随机盐（签名）的总和，再采用MD5加密之后生成的密文。

---

![image-20200826133441243](media/image-20200826133441243.png)

> JWT的各个部分都是JSON字符串。在`.`前后进行分段，第一段表示base64运算后的header，第二段表示base64运算后的PayLoad也就是明文数据，第三部分为MD5加盐加密之后的PayLoad。
>
> 第一段和第二段内容都仅仅是base64进行编码的，通过某种技术是可以破解的，所以第一段和第二段都不要存放敏感信息。
>
> 第三段内容的作用也就是解决数据完整性以及防篡改的功能，如果JWT被拦截，并修改了第二段中的内容，那重复加密的过程所得到的结果是无法获得第三段内容的，也就证明此JWT已被篡改，已经失效。

### 常见加密

1. 单向加密：MD5，只能暴力破解但是不能解密逆运算。
2. 双向加密/对称加密：aes，des，可解密。
3. 非对称加密：rsa，可解密。

因为任何加密方式都可能被非法解密，所以在原字符中加入随机字符作为盐值，干扰解密算法的执行。在可逆运算的加密中，盐值可被称为密钥，在不可逆运算的加密中，盐值可称为签名。

## JWT代码实现

> 不同的写法通过不同的第三方依赖Jar包构成。

### 写法一

#### JWT加密

```xml
<!-- 引入的依赖 -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.49</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.6.0</version>
</dependency>
<dependency>
    <groupId>commons-codec</groupId>
    <artifactId>commons-codec</artifactId>
    <version>1.10</version>
</dependency>
```

```java
//导包详情
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.codec.digest.DigestUtils;
import java.util.Base64;
```

```java
private static String SIGN_Key = "c38g";
@Test
void contextLoads() {
    //封装header
    JSONObject header = new JSONObject();
    header.put("alg","HS256");
    //封装payLoad
    JSONObject payLoad = new JSONObject();
    payLoad.put("phone","18888888888");
    //加密payLoad生成加密值
    String sign = DigestUtils.md5Hex(payLoad.toJSONString()+SIGN_Key);
    //生成JWT结果
    String jwt =
        Base64.getEncoder().encodeToString(header.toJSONString().getBytes())+"."+
        Base64.getEncoder().encodeToString(payLoad.toJSONString().getBytes())+"."+
        sign;
    //展示jwt结果
    System.out.println(jwt);
}
//eyJhbGciOiJIUzI1NiJ9.eyJwaG9uZSI6IjE4ODg4ODg4ODg4In0=.ff07792cb1ce5f8d3c6d6845b1adefcb
```

> 可以在JWT官网验证jwt结果的正确性：https://jwt.io/

![image-20200826142809827](media/image-20200826142809827.png)

#### JWT解密/验证

​	默认全部使用MD5加密方式，如果payload加盐加密之后的内容与生成的密文相同，则表示此payload没有被篡改过，可以使用，如果不同则无法反编译或已被篡改。

```java
//继续上面的代码
String[] split = jwt.split("\\.");
String payload = new String(Base64.getDecoder().decode(split[1].getBytes()));
System.out.println(DigestUtils.md5Hex(payLoad+SIGN_KEY).equals(sign));
System.out.println(payload);
/*
true
{"phone":"18888888888"}
*/
```

### 写法二

```xml
<!-- 导入依赖 -->
<dependency>
    <groupId>com.auth0</groupId>
    <artifactId>java-jwt</artifactId>
    <version>3.4.0</version>
</dependency>
```

#### 令牌的获取

```java
//创建token信息

public static void main(String[] args) {
    //预制header里的内容，内容为空使用默认内容
    Map<String,Object> header = new HashMap<String,Object>();
    //设置JWT过期事件，设置为20秒
    Calendar instance = Calendar.getInstance();
    instance.add(Calendar.SECOND,20);

    String token = JWT.create() //创建
        .withHeader(header) //存入头信息
        .withClaim("userId",123)    //存入载荷内容
        .withClaim("userName","hello")  //存入载荷内容
        .withExpiresAt(instance.getTime())  //设置过期时间
        .sign(Algorithm.HMAC256("!QW@WE#R#!"));     //加盐

    System.out.println(token);
}
```

<font color='red'>eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.</font>
<font color='green'>eyJ1c2VyTmFtZSI6ImhlbGxvIiwiZXhwIjoxNjAwMTYwOTM4LCJ1c2VySWQiOjEyM30.</font>
<font color='yellow'>L7h9--YypHIJEarPXc_Gn5ZLI33u_mMTOWcqf3vq-8s</font>

#### 令牌的验证

```java
public static void test(String token){
    Verification verification = JWT.require(Algorithm.HMAC256("!QW@WE#R#!"));
    JWTVerifier jwtVerifier = verification.build(); //JWT验证对象

    DecodedJWT decodedJWT = jwtVerifier.verify(token);  //进行解码

    String header = decodedJWT.getHeader();

    //使用getClaim方式只能获取到最后一次加入的claim，不能获取所有的claim
    int userId = decodedJWT.getClaim("userId").asInt();
    String userName = decodedJWT.getClaim("userName").asString();
    //获取过期时间
    Date date = decodedJWT.getExpiresAt();

    //使用getClaims可以获得所有的claim信息
    Map data = decodedJWT.getClaims();
}
```

#### 常见异常

1. SigntureVerificationException：签名不一致，验证失效。
2. TokenExpiredException：令牌过期异常。
3. AlgorithmMismatchException：解密和加密时使用的算法不一致，算法不匹配异常。
4. InvalidClaimException：失效的payload载荷异常，可能被篡改。

#### 工具类

```java
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.util.Calendar;
import java.util.Map;

public class JWTUtil {
    //设置默认的 盐值/签名/密钥
    private static final String TOKEN = "token!@#$234QWEqwe";

    /**
     * 生成token
     * @param map 传入payload
     * @return JWT token
     */
    public static String getToken(Map<String,String> map){
        JWTCreator.Builder builder = JWT.create();
        map.forEach((k,v)->{
            builder.withClaim(k,v);
        });
        Calendar instance = Calendar.getInstance();
        instance.add(Calendar.DATE,7);
        builder.withExpiresAt(instance.getTime());
        return builder.sign(Algorithm.HMAC256(TOKEN)).toString();
    }

    /**
     * 验证token
     * @param token JWT token
     */
    public static void verify(String token){
        JWT.require(Algorithm.HMAC256(TOKEN)).build().verify(token);
    }

    /**
     * 获取token中的载荷内容
     * @param token 载荷内容
     * @return
     */
    public static DecodedJWT getToken(String token){
        return JWT.require(Algorithm.HMAC256(TOKEN)).build().verify(token);
    }
}
```


