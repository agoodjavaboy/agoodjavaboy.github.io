# SpringWebflux非阻塞控制层框架

![Spring Boot 2.0 WebFlux 教程 | 入门篇](media\155532924213864)

## Webflux与MVC的关系与区别

SpringMVC与SpringWebflux都是应用于MVC层次的框架，用于处理请求接收和响应发送的功能。

MVC是构建在Servlet的API之上的，Servlet是单线程的，所以MVC也采用了同步阻塞式的IO模型。也就是说每次接收到一个请求之后，都会有一个对应的线程去处理，线程之间是不会并发和通讯的。

而Flux是采用的异步非阻塞式的Web框架，能够更加充分的利用多核CPU性能，从而处理更多的并发问题。

如果理解来看，Flux的请求接收方式与AJAX的请求发送方式是很类似的，服务器可以同时接收多个请求并同时处理各个请求的数据，这样确实是可以提高访问量和数据处理速度，毕竟多线程的意义就是尽可能的多使用CPU的性能。但是在多线程操作的时候不可避免的就是数据脏读幻读问题，这个要在实际开发中结合业务考虑解决方案。

### 技术选型

在上文也能看出，flux和MVC并不是一前一后的升级方案，而是处在同一级别的不同技术框架。所以flux并不是mvc的替代方案。

flux是可以运行在Servlet3.1+的容器中的，但其出现的本质还是异步非阻塞IO，如果项目中异步请求很多，并且使用了很多非同步的数据就可以采用flux，否则还是使用，mvc作为常规架构。

其实flux和mvc是可以混用的，可以在一个项目中采用两个框架，在实际应用中依照着不同的需求采用不同的技术框架。

### 异同点

![WebFlux 适用性](media\155533174918637)

**相同点** ：

- 可以采用Spring MVC的注解，方便在两个框架之间转换。
- 都可以使用Tomcat、Jetty、Undertow Servlet容器。

**不同点** ：

- WebFlux 默认情况下采用Netty作为容器。

- WebFlux 不支持MySQL。

- flux异步非阻塞，mvc同步阻塞。在进行debug测试时，mvc更清晰易检测。

- mvc的中央分发器是DispatcherServlet，flux是DispatherHandler，其实现了WebHandler接口。

  ![WebFlux handle 源码分析](media\155541732828610)

  1. 在实际请求过程中，ServletWebExchange对象存放每次Http请求响应内容。

  2. 判断mapping集合是否为空，为空则创建Not Found错误。

  3. 调用具体业务方法，也就是接口方法。

  4. 返回处理结构。

## Webflux的优势

flux采用响应式编程（reactive programming），以reactor库为基础，基于异步和实践驱动，在不扩展硬件的前提下提升访问吞吐量和伸缩性。

但flux并不能使接口的响应时间缩短，仅能做到的是提升吞吐量和伸缩性。也就是之前一个请求访问多长时间还是多长时间，只不过这些请求可以一股脑的塞到控制层里跑接下去的业务，可以让多个所有的请求同时处理，而不是一个一个处理了。

## Webflux的应用场景

异步非阻塞的IO框架比较适合在IO密集的服务中心使用，例如微服务网关。

IO密集型包括：磁盘IO密集型和网络IO密集型。网关类的IO密集就属于网络IO密集型，采用异步非阻塞的方式将有效的提升网管对下游服务转发的吞吐量，毕竟网管仅做一个跳转或连接的功能，业务方面并不采用过多。

![WebFlux网关](media\155541524371593)

## Webflux与SpringBoot的集成

### 添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

### 定义控制层

```java
@RestController
public class HelloWebFluxController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello, WebFlux !";
    }

    @GetMapping("/user")
    public Mono<User> getUser() {
        User user = new User();
        user.setName("Hello, WebFlux !");
        return Mono.just(user);
    }
}
```

在 WebFlux 中，除了Mono外，还有一个Flux，这均能充当响应式编程中发布者的角色，不同的是：

- Mono：返回 0 或 1 个元素，即单个对象。
- Flux：返回 N 个元素，即 List 列表对象。

响应接口的写法与Spring MVC的写法相同，但是在响应内容的时候采用Mono响应方法才能发挥flux的非阻塞+异步的特性。

