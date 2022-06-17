# SpringSecurity应用

## 简介

Spring Security作为一款安全框架，主要针对项目中认证和授权进行控制，以轻松快速安全的方式完成对数据访问的控制。

Spring Security的核心功能包括：

- 认证：确认证书，也就是登录相关，通过既定内容判定访问者身份。
- 授权：授予访问权限，不同访问者只能访问定控制的功能和数据。
- 攻击防护：防止伪造身份。

Spring Security的核心是一组过滤器链，得益于Spring Boot的自动配置，他可以在项目启动后自动的对过滤链进行装配。其核心Basic Authentication Filter用来认证。在Spring Security中，一种过滤器将处理一种认证方式。

![1img](media/20190116102342618.jpg)

比如常规使用的用户名+密码方式的认证过滤会经历以下流程：

1. 检查是否为登录请求；
2. 请求中是否包含用户名和密码字段，也就是该过滤器认证所需必要信息；
3. 如果不满足条件则放行给下一种过滤器；

再放行给下一个按照自身职责判定是否是自身需要的信息。

basic的特征就是在请求头中有 `Authorization:Basic xxxx` 的信息。中间可能还有更多的认证过滤器。最后一环是 `FilterSecurityInterceptor`，这里会判定该请求是否能进行访问后台服务，判断的依据是 `BrowserSecurityConfig` 中的配置，如果被拒绝了就会抛出不同的异常（根据具体的原因）。`Exception Translation Filter` 会捕获抛出的错误，然后根据不同的认证方式进行信息的返回提示。

![1img](media/20190813175708861.jpg)

## 入门程序

### 创建项目

使用IDEA创建SpringBoot项目，并引入Spring Web和Spring Security的依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### 登录页

准备一个登录页面，放到`static`文件夹中，提供一个表单提交的功能，作为登录页面：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>login</title>
</head>
<body>
<form action="/login" method="post">
    用户名：<input name="username"><br>
    密码：<input name="password"><br>
    <input type="submit" value="登录">
</form>
</body>
</html>
```

static文件夹中的内容作为项目的静态文件可以直接访问。

### 访问内容

当集成了Spring Security框架之后，在没有任何配置的情况下访问所有的请求都将被定向到一个登录页面：

![1640092471129](media/1640092471129.png)

也就是说在浏览器中访问登录页面的时候，也将访问到此页面。其中用户名默认为user，密码将在控制台中打印，每次启动都将生成新的随机的密码：

![1640092523451](media/1640092523451.png)

在填写正确用户名和密码之后，就可以跳转到登录页面中。

## 常用类解释

### UserDetailsService：获取用户信息

入门程序中，用户名和密码都是Spring Security规定的内容，业务中自定义的用户名和密码。在Spring Security里通过UserDetailsService进行用户信息的获取：

```java
package org.springframework.security.core.userdetails;

public interface UserDetailsService {
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
```

UserDetailsService中loadUserByUsername就是进行用户信息获取的实际流程，需要传入一个用户名，也就是账号，将返回一个用户详细信息。

### UserDetails：用户详细信息

UserDetail是加载用户信息后返回的用户结果，表示一个用户的实例，并且这也是一个接口：

```java
package org.springframework.security.core.userdetails;

import java.io.Serializable;
import java.util.Collection;
import org.springframework.security.core.GrantedAuthority;

public interface UserDetails extends Serializable {
    
    //用户所具有的权限（返回的不能是null）
    Collection<? extends GrantedAuthority> getAuthorities();

    //用户密码
    String getPassword();

    //用户名
    String getUsername();

    //是否过期，过期账号不能登录
    boolean isAccountNonExpired();

    //是否锁定，锁定账号不能登录
    boolean isAccountNonLocked();

    //凭证是否过期，凭证也就是密码
    boolean isCredentialsNonExpired();

    //是否可用
    boolean isEnabled();
}
```

`org.springframework.security.core.userdetails.User`实现了UserDetails，实现了其中基础的方法，但通常会重写自定义的用户实例，不采用Security提供的User实例。

其中，User实现类的构造方法如下：

```java
//构造方法1
public User(String username, String password, Collection<? extends GrantedAuthority> authorities) {
    //调用构造方法2
    this(username, password, true, true, true, true, authorities);
}

//构造方法2
public User(String username, String password, boolean enabled, boolean accountNonExpired, boolean credentialsNonExpired, boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities) {
    //断言传入的用户名和密码是否合规
    Assert.isTrue(username != null && !"".equals(username) && password != null, "Cannot pass null or empty values to constructor");
    //进行实例赋值
    this.username = username;
    this.password = password;
    this.enabled = enabled;
    this.accountNonExpired = accountNonExpired;
    this.credentialsNonExpired = credentialsNonExpired;
    this.accountNonLocked = accountNonLocked;
    this.authorities = Collections.unmodifiableSet(sortAuthorities(authorities));
}
```

**由于此实例是通过UserDetailsService的loadUserByUsername方法返回的，那在返回后的User实例的密码和权限内容都是在loadUserByUsername方法中根据用户名在数据库中获取到的。**

------

权限是最原子的控制单位，多个权限可以交给一个角色，多个角色可以交给一个用户。

userDetailsService中对角色的设置和对权限的设置相同，只是在角色名称前要添加`ROLE_`为前缀，后跟角色的名称：

```java
@Override
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    //模拟用户名不存在的情况
    if(!"admin".equals(username)){
        throw new UsernameNotFoundException("用户并不存在");
    }
    //组装用户信息返回
    return new User(
        "admin",
        new BCryptPasswordEncoder().encode("123"),
        AuthorityUtils.commaSeparatedStringToAuthorityList("admin,normal,ROLE_root")
    );
}
```

### PasswordEncoder：密码加密

数据库中存储的密码通常是加密的，在获取到用户在数据库中存储的加密密码后，还要将用户输入的密码进行同样的加密，进行比对相同后则表示用户登录成功，否则登录失败。

所以进行加密的流程会经常使用，Security将所有的加密流程封装成了PasswordEncoder接口：

```java
package org.springframework.security.crypto.password;

public interface PasswordEncoder {
    //进行加密，传入明文返回密文
    String encode(CharSequence rawPassword);
	//将原始密码与加密密码进行匹配
    boolean matches(CharSequence rawPassword, String encodedPassword);
	
    //是否可以对密码进行加密（暂不了解）
    default boolean upgradeEncoding(String encodedPassword) {
        return false;
    }
}
```

实现时，推荐使用BCryptPasswordEncoder类来进行加密，是一种强散列方法的实现，也是基于哈希算法的单向加密实现。

BCryptPasswordEncoder中的strength属性用来控制生成的密钥的长度，更长的密文发生碰撞的几率会更小，可以对此属性进行赋值来改变生成的密文长度。

## 登录逻辑

### 注入加密算法

在进行自定义登录逻辑时，Spring要求要在容器中存在一个PasswordEncoder的实例，所以直接将BCryptPasswordEncoder注入到容器中即可：

```java
@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder getPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
```

### 获取用户信息

在service实现层中创建实现类，来实现UserDetailsService，并重写loadUserByUsername的方法来完成用户信息的获取：

```java
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return null;
    }
}
```

在此方法中查询数据库，通过用户名查询用户是否存在，如果不存在就可以抛出UsernameNotFoundException的异常。

如果存在用户名所对应的用户，就可以在数据库中获取到用户名和密码（加密的）以及用户的相关权限，封装成UserDetails实例进行返回。注意在此处并未进行用户名和密码正确性的验证，只是将用户的信息进行获取。

------

此处先不创建UserDetails的实现类，而是采用Security提供的User类，并且采用常量的方式来对用户的信息进行模拟：

```java
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //模拟用户名不存在的情况
        if(!"admin".equals(username)){
            throw new UsernameNotFoundException("用户并不存在");
        }
        //组装用户信息返回
        return new User(
                "admin",
                new BCryptPasswordEncoder().encode("123"),
                AuthorityUtils.commaSeparatedStringToAuthorityList("admin,normal")
        );
    }
}
```

上文代码中设置了用户的信息，其中用户名为admin，密码是加密后的123，权限存在两个，一个是admin权限，一个是normal权限。commaSeparatedStringToAuthorityList方法会将字符串根据逗号进行拆分，转换成一个字符串泛型的集合来返回。

### 尝试登录

再次从浏览器中尝试访问login.html页面，虽然访问的页面还是Security提供的登录页面，但填写的密码就成了admin和123。

## 页面配置

### 定义登录页面

将Security的配置类继承WebSecurityConfigurerAdapter类，重写其中的configure方法，注意此方法存在重载方法，需要重写参数为HttpSecurity类型的方法，并在其中规定自定义登录页面和登录的路径。：

```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //自定义表单提交
        http.formLogin()
                //登录验证路径
                .loginProcessingUrl("/login")
                //登录页面
                .loginPage("/login.html");
    }

    //此前对密码工具注入的方法
    @Bean
    public PasswordEncoder getPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }

}
```

**登录路径并不是后台控制层中的登录接口，而是Security在检测到此接口调用的时候就会触发内部的登录流程，而登录页面的确是要在static中声明的页面。**

在重启项目后，发现可以直接访问到登录页面以及其他页面，所以要对登录页面之外的页面进行认证控制。也就是借助http参数调用拦截器，将所有请求进行认证控制，也就是登陆后才可访问：

```java
protected void configure(HttpSecurity http) throws Exception {
    //自定义表单提交
    http.formLogin()
        //登录验证路径
        .loginProcessingUrl("/login")
        //登录页面
        .loginPage("/login.html");
    //使用拦截器拦截所有请求必须认证后访问
    http.authorizeHttpRequests().anyRequest().authenticated();
}
```

如果再次访问登录页面，会不停跳转登录页面从而发生死循环，这是因为没有将登录页面进行放行。所以要放行登录页面为可不登陆访问：

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    //自定义表单提交
    http.formLogin()
        //登录验证路径
        .loginProcessingUrl("/login")
        //登录页面
        .loginPage("/login.html");
    //使用拦截器
    http.authorizeHttpRequests()
        //无条件放行登录页面
        .antMatchers("/login.html").permitAll()
        //拦截所有请求必须认证后访问
        .anyRequest().authenticated();
}
```

并且在配置的最后要将csrf关闭，在后面将介绍csrf的作用：

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    //自定义表单提交
    http.formLogin()
        //登录验证路径
        .loginProcessingUrl("/login")
        //登录页面
        .loginPage("/login.html");
    //使用拦截器
    http.authorizeHttpRequests()
        //无条件放行登录页面
        .antMatchers("/login.html").permitAll()
        //拦截所有请求必须认证后访问
        .anyRequest().authenticated();

    http.csrf().disable();
}

```

**这样在自定义登录页面进行登录的时候就可以使用admin和123进行登录，要注意的是：登录页面中表单的用户名的name必须为username，密码的name必须为password，表单必须以post方式提交，否则Security默认的无法获取参数。可以在UserDetailsServiceImpl中设置断点来查看是否执行了获取用户信息的方法，如果执行了则表示已经执行了登录流程。**

### 定义登录成功后跳转

在登录成功后会跳转到一个错误页面，是因为访问了项目的根路径却没有找到index.html，所以可以编写一个index.html让其自动访问，或者在配置类中设置登录成功后的访问地址。登录成功后的访问地址必须是post请求的，所以要通过控制层来进行跳转：

```java
@Controller
public class UserController {
    @PostMapping("/main")
    public String main(){
        return "redirect:main.html";
    }
}

```

对应的配置如下：

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    //自定义表单提交
    http.formLogin()
        //登录验证路径
        .loginProcessingUrl("/login")
        //登录页面
        .loginPage("/login.html")
        //登录成功后的跳转路径
        .successForwardUrl("/main");
    //使用拦截器
    http.authorizeHttpRequests()
        //无条件放行登录页面
        .antMatchers("/login.html").permitAll()
        //拦截所有请求必须认证后访问
        .anyRequest().authenticated();

    http.csrf().disable();
}

```

### 定义登录成功处理器

successForwardUrl方法所指定的跳转路径只能是一个post请求的路径，是无法跳转到静态页面的。

实际上successForwardUrl方法会调用一个处理器，来进行路径的跳转：

```java
public FormLoginConfigurer<H> successForwardUrl(String forwardUrl) {
    this.successHandler(new ForwardAuthenticationSuccessHandler(forwardUrl));
    return this;
}

```

其中ForwardAuthenticationSuccessHandler类继承了AuthenticationSuccessHandler，构造方法将传入的跳转路径封装到了类中，并提供onAuthenticationSuccess方法进行请求的转发：

```java
public class ForwardAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    private final String forwardUrl;

    public ForwardAuthenticationSuccessHandler(String forwardUrl) {
        Assert.isTrue(UrlUtils.isValidRedirectUrl(forwardUrl), () -> {
            return "'" + forwardUrl + "' is not a valid forward URL";
        });
        this.forwardUrl = forwardUrl;
    }

    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        request.getRequestDispatcher(this.forwardUrl).forward(request, response);
    }
}

```

所以如果要自定义的进行跳转控制，就可以自定义一个SuccessHandler，类似于ForwardAuthenticationSuccessHandler，重写onAuthenticationSuccess方法来进行请求重定向或者转发。要注意的是进行实现的存在两个onAuthenticationSuccess方法，但其中一个参数中存在FilterChain类型参数，此方法已经在接口中具有了默认的实现，是可选的实现，所以直接实现另一个方法即可：

```java
public class AuthenticationSuccessHandlerImpl implements AuthenticationSuccessHandler {

    private String url;

    public AuthenticationSuccessHandlerImpl(String url) {
        this.url = url;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        //进行重定向
        response.sendRedirect(url);
    }
}

```

在配置类中就可以不使用successForwardUrl进行路径配置了，而是配置自定义的跳转处理器：

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    //自定义表单提交
    http.formLogin()
        //设置请求参数名
        .usernameParameter("myname")
        .passwordParameter("mypass")
        //登录验证路径
        .loginProcessingUrl("/login")
        //登录页面
        .loginPage("/login.html")
        //登录成功后的跳转路径
//      .successForwardUrl("/main")
        //登录成功处理器
        .successHandler(new AuthenticationSuccessHandlerImpl("http://www.baidu.com"))
        //登陆失败后跳转路径
        .failureForwardUrl("/loginerror");
    //使用拦截器
    http.authorizeHttpRequests()
        //无条件放行登录页面
        .antMatchers("/login.html").permitAll()
        //放行登陆失败页面
        .antMatchers("/error.html").permitAll()
        //拦截所有请求必须认证后访问
        .anyRequest().authenticated();

    http.csrf().disable();
}

```

Security会自动的调用SuccessHandler的onAuthenticationSuccess方法，传入参数并指定方法内容实现跳转。

在onAuthenticationSuccess的Authentication参数中，可以获取到很多关于用户和认证的信息，其中getPrincipal方法可以获取到登录成功的用户，方法返回一个Object类型，可以强转成Security的内置User类型来打印相关信息：

```java
@Override
public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
    //获取用户信息
    User user = (User)authentication.getPrincipal();
    System.out.println(user.getUsername());
    System.out.println(user.getPassword());//安全起见，密码将打印成一个null
    System.out.println(user.getAuthorities());
    //进行重定向
    response.sendRedirect(url);
}

```

### 定义登录失败后跳转

登录失败后Security会再次跳转到登录页面，如果要在登录失败后跳转到指定的错误页面需要像配置成功后跳转一样提供一个post请求跳转到指定页面，并在配置类中进行配置。注意这里的请求名称不能是error，因为error和index在Spring中都有特殊含义：

```java
@PostMapping("/loginerror")
public String error(){
    return "redirect:error.html";
}

```

然后在配置类中进行配置：

```java
protected void configure(HttpSecurity http) throws Exception {
    //自定义表单提交
    http.formLogin()
        //登录验证路径
        .loginProcessingUrl("/login")
        //登录页面
        .loginPage("/login.html")
        //登录成功后的跳转路径
        .successForwardUrl("/main")
        //登陆失败后跳转路径
        .failureForwardUrl("/loginerror");
    //使用拦截器
    http.authorizeHttpRequests()
        //无条件放行登录页面
        .antMatchers("/login.html").permitAll()
        //拦截所有请求必须认证后访问
        .anyRequest().authenticated();

    http.csrf().disable();
}
```

并且在登录失败之后，并没有认证成功，还需要在权限控制中放行。只需要放行html即可，/error接口因为在Security中配置成了特殊接口所以已经自动放行：

```java
protected void configure(HttpSecurity http) throws Exception {
    //自定义表单提交
    http.formLogin()
        //登录验证路径
        .loginProcessingUrl("/login")
        //登录页面
        .loginPage("/login.html")
        //登录成功后的跳转路径
        .successForwardUrl("/main")
        //登陆失败后跳转路径
        .failureForwardUrl("/loginerror");
    //使用拦截器
    http.authorizeHttpRequests()
        //无条件放行登录页面
        .antMatchers("/login.html").permitAll()
        //放行登陆失败页面
        .antMatchers("/error.html").permitAll()
        //拦截所有请求必须认证后访问
        .anyRequest().authenticated();

    http.csrf().disable();
}
```

### 定义登录失败处理器

和登录成功处理器类似，failureForwardUrl所指定的跳转路径也是post请求的，这也是因为方法所调用的ForwardAuthenticationFailureHandler处理器中执行的是转发操作：

```java
public FormLoginConfigurer<H> failureForwardUrl(String forwardUrl) {
    this.failureHandler(new ForwardAuthenticationFailureHandler(forwardUrl));
    return this;
}
```

ForwardAuthenticationFailureHandler类与ForwardAuthenticationSuccessHandler类似，同样提供构造方法和实现了AuthenticationFailureHandler的onAuthenticationFailure方法， 只是存在一个异常相关的对象作为参数：

```java
public class ForwardAuthenticationFailureHandler implements AuthenticationFailureHandler {
    private final String forwardUrl;

    public ForwardAuthenticationFailureHandler(String forwardUrl) {
        Assert.isTrue(UrlUtils.isValidRedirectUrl(forwardUrl), () -> {
            return "'" + forwardUrl + "' is not a valid forward URL";
        });
        this.forwardUrl = forwardUrl;
    }

    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        request.setAttribute("SPRING_SECURITY_LAST_EXCEPTION", exception);
        request.getRequestDispatcher(this.forwardUrl).forward(request, response);
    }
}
```

所以也可以创建一个自定义的失败处理器，继承AuthenticationFailureHandler并重写方法，进行请求的转发到单独页面：

```java
public class AuthenticationFailureHandlerImpl implements AuthenticationFailureHandler {
    
    private String url;

    public AuthenticationFailureHandlerImpl(String url) {
        this.url = url;
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        response.sendRedirect(url);
    }
}

```

在配置类中配置登陆失败处理器来替代登录失败请求接口：

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    //自定义表单提交
    http.formLogin()
        //登录验证路径
        .loginProcessingUrl("/login")
        //登录页面
        .loginPage("/login.html")
        //登录成功后的跳转路径
//      .successForwardUrl("/main")
        //登录成功处理器
        .successHandler(new AuthenticationSuccessHandlerImpl("http://www.baidu.com"))
        //登陆失败后跳转路径
//      .failureForwardUrl("/loginerror")
        //登录失败处理器
        .failureHandler(new AuthenticationFailureHandlerImpl("/error.html"));
    //使用拦截器
    http.authorizeHttpRequests()
        //无条件放行登录页面
        .antMatchers("/login.html").permitAll()
        //放行登陆失败页面
        .antMatchers("/error.html").permitAll()
        //拦截所有请求必须认证后访问
        .anyRequest().authenticated();

    http.csrf().disable();
}

```

### 定义页面传参

登录页面中表单的用户名的name必须为username，密码的name必须为password，表单必须以post方式提交，否则Security默认的无法获取参数。

因为在进行登录请求的时候，会通过一个UsernamePasswordAuthenticationFilter过滤器，其中规定了参数和请求类型：

```java
public static final String SPRING_SECURITY_FORM_USERNAME_KEY = "username";
public static final String SPRING_SECURITY_FORM_PASSWORD_KEY = "password";
private boolean postOnly = true;

```

可以在配置类中添加配置来更改默认的传递的参数的名称：

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    //自定义表单提交
    http.formLogin()
        //设置请求参数名
        .usernameParameter("myname")
        .passwordParameter("mypass")
        //登录验证路径
        .loginProcessingUrl("/login")
        //登录页面
        .loginPage("/login.html")
        //登录成功后的跳转路径
        .successForwardUrl("/main")
        //登陆失败后跳转路径
        .failureForwardUrl("/loginerror");
    //使用拦截器
    http.authorizeHttpRequests()
        //无条件放行登录页面
        .antMatchers("/login.html").permitAll()
        //放行登陆失败页面
        .antMatchers("/error.html").permitAll()
        //拦截所有请求必须认证后访问
        .anyRequest().authenticated();

    http.csrf().disable();
}

```

那在登录页面的表单中，就可以使用自定义的参数进行请求登录了。

## 认证控制

### anyRequest

在配置类中，曾通过http引用对登录进行过配置：

```java
http.authorizeHttpRequests()
    //无条件放行登录页面
    .antMatchers("/login.html").permitAll()
    //放行登陆失败页面
    .antMatchers("/error.html").permitAll()
    //拦截所有请求必须认证后访问
    .anyRequest().authenticated();

```

通常将需要进行认证控制的页面和请求在链式调用的前部设置，最终都用`anyRequest`对其他没有进行设置认证的请求进行`authenticated`认证控制。也就是在请求进入到认证控制器后，会从前到后的匹配请求路径，然后再合适的路径匹配后进行认证控制，没有请求配置则进行完整的认证控制。

### antMatchers

使用antMatchers对指定的请求进行权限控制，此方法声明：

```java
public C antMatchers(String... antPatterns) {
    Assert.state(!this.anyRequestConfigured, "Can't configure antMatchers after anyRequest");
    return this.chainRequestMatchers(AbstractRequestMatcherRegistry.RequestMatchers.antMatchers(antPatterns));
}

```

可见参数可以同时传入多个String类型的参数，并对路径匹配表达式进行验证。其中路径匹配表达式中可以存在模糊匹配字符：

- 问号表示一个字符
- 星号表示0-N个字符
- 两个星号表示0-N个目录

通常对静态资源进行放行时，就可以采用两个星号的方式：

```java
http.authorizeHttpRequests()
    //无条件放行静态资源
    .antMatchers("/js/**","/css/**","/imgs/**").permitAll()
    //拦截所有请求必须认证后访问
    .anyRequest().authenticated();

```

如果对任意字符结尾的路径的请求进行放行，就可以将星号匹配在中间：

```java
http.authorizeHttpRequests()
    //无条件放行所有后缀为.png的请求
    .antMatchers("/**/*.png").permitAll()
    //拦截所有请求必须认证后访问
    .anyRequest().authenticated();

```

除了可以对路径进行匹配，还可以指定路径的请求方式。重载的antMatchers如下：

```java
public C antMatchers(HttpMethod method, String... antPatterns) {
    Assert.state(!this.anyRequestConfigured, "Can't configure antMatchers after anyRequest");
    return this.chainRequestMatchers(AbstractRequestMatcherRegistry.RequestMatchers.antMatchers(method, antPatterns));
}

```

第一个参数表示请求的方式，从第二个到第N个参数表示的是路径表达式。HttpMethod实际就是个枚举，表示http的各种请求方式：

```java
public enum HttpMethod {
    GET,
    HEAD,
    POST,
    PUT,
    PATCH,
    DELETE,
    OPTIONS,
    TRACE;
    
    ...
}

```

### regexMathcers

antMatchers方法所采用的路径匹配方式是ant路径表达式，regexMatchers采用的是正则表达式，其使用方式是相同的，只是匹配表达式不同。

例如放行所有指定路径结尾的请求：

```java
http.authorizeHttpRequests()
    //无条件放行所有后缀为.png的请求
    .regexMatchers(".+[.]png").permitAll()
    //拦截所有请求必须认证后访问
    .anyRequest().authenticated();

```

并且匹配请求方式的重载方法和antMatchers也是一样的用法。

### mvcMatchers

在使用mvcMatchers时，主要使用的是它后续的servletPath方法：

```java
http.authorizeHttpRequests()
    //无条件放行/user/add请求
    .mvcMatchers("/add").servletPath("/user").permitAll()
    //拦截所有请求必须认证后访问
    .anyRequest().authenticated();

```

servletPath的值是在yml或者properties文件中通过`spring.mvc.servlet.path=/xxx`进行指定的，如果指定了此路径，则本项目所有请求前都必要添加`/xxx`路径后再去访问。

在微服务环境下，不同的服务通常采用不同的访问前缀进行标识，就可以在认证中心通过servletPath辨别不同服务下的同名请求。

实际上在不考虑分服务识别路径的情况下，mvcMatchers与servletPath连用的方式，也可以使用其他matches来完成。

### 访问控制方法

上文中用到的permitAll是放行，也就是不需要认证即可访问，authenticated表示需要进行认证才可以访问，实际上共存在六种访问控制的方式：

1. permitAll：无条件放行
2. denyAll：无条件拒绝访问
3. anonymous：可匿名访问，类似无条件放行，后台指定逻辑有所不同
4. authenticated：认证后访问
5. fullyAuthenticated：完全认证，即使勾选了记住我仍然要重新认证
6. rememberMe：只有记住我后才可访问

## 权限控制

认证管理只是在登录的时候进行使用，控制资源是否要进行登录后才可访问。但是在登陆后分角色的用户还会具有不同的数据操作功能，就可以通过权限来进行控制。

鉴权操作是在认证之后的，认证时在userDetailsService中已经对当前登录用户的权限进行了设置，鉴权也就是对那些权限进行的判断。

### hasAuthority

hasAuthority方法表示只有当具有此权限时资源才可以访问（权限字符严格区分大小写）：

```java
http.authorizeHttpRequests()
    //无条件放行登录页面
    .antMatchers("/login.html").permitAll()
    //放行登陆失败页面
    .antMatchers("/error.html").permitAll()
    //具有admin权限才可以进入show页面
    .antMatchers("/show.html").hasAuthority("admin")
    //拦截所有请求必须认证后访问
    .anyRequest().authenticated();

```

如果不具有权限去访问页面则会出现403权限异常的错误。

### hasAnyAuthority

hasAuthority方法只能指定一个权限的匹配，而hasAnyAuthority可以书写多个权限字段，任何一个字段匹配成功都认为权限有效：

```java
http.authorizeHttpRequests()
    //无条件放行登录页面
    .antMatchers("/login.html").permitAll()
    //放行登陆失败页面
    .antMatchers("/error.html").permitAll()
    //具有admin权限或者user权限才可以进入show页面
    .antMatchers("/show.html").hasAnyAuthority("admin,user")
    //拦截所有请求必须认证后访问
    .anyRequest().authenticated();

```

### hasRole

判断用户是否具有某个角色可以使用hasRole方法，使用方式和hasAuthority相同，在赋值角色名的时候有`ROLE_`前缀的，但在匹配的时候不能填写前缀（权限同样严格区分大小写）：

```java
http.authorizeHttpRequests()
    //无条件放行登录页面
    .antMatchers("/login.html").permitAll()
    //放行登陆失败页面
    .antMatchers("/error.html").permitAll()
    //具有admin权限才可以进入show页面
    .antMatchers("/show.html").hasAnyAuthority("adminN")
    //具有root角色才能进入show页面
    .antMatchers("/show.html").hasRole("root")
    //拦截所有请求必须认证后访问
    .anyRequest().authenticated();

```

### hasAnyRole

使用方式和hasAnyAuthority相同，拥有多个角色中的任意一个就放行：

```java
http.authorizeHttpRequests()
    //无条件放行登录页面
    .antMatchers("/login.html").permitAll()
    //放行登陆失败页面
    .antMatchers("/error.html").permitAll()
    //具有admin权限才可以进入show页面
    .antMatchers("/show.html").hasAnyAuthority("adminN")
    //具有root角色或者admin角色才能进入show页面
    .antMatchers("/show.html").hasAnyRole("root,admin")
    //拦截所有请求必须认证后访问
    .anyRequest().authenticated();

```

### IP控制

除了可以对认证和权限进行控制，还可以对访问者的IP进行控制：

```java
//使用拦截器
http.authorizeRequests()
    //无条件放行登录页面
    .antMatchers("/login.html").permitAll()
    //放行登陆失败页面
    .antMatchers("/error.html").permitAll()
    //具有admin权限才可以进入show页面
    .antMatchers("/show.html").hasAnyAuthority("adminN")
    //具有root角色才能进入show页面
    .antMatchers("/show.html").hasRole("root")
    //只有IP是127.0.0.1的客户端才可以进入show页面
    .antMatchers("/show.html").hasIpAddress("127.0.0.1")
    //拦截所有请求必须认证后访问
    .anyRequest().authenticated();

```

要注意的是，拦截器的方式不能使用`authorizeHttpRequests`，而是`authorizeRequests`才可以使用IP拦截。当请求客户端的IP没有被放行也会出现403错误。

### 定义鉴权失败处理器

类似登录成功处理器和登录失败处理器，鉴权失败处理器也是通过继承一个类然后实现方法并跳转或向页面输出内容来完成处理。

自定义鉴权失败处理器要实现AccessDeniedHandler并实现其中的handle方法：

```java
public class AccessDeniedHanderImpl implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        //设置响应状态码为无权限
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.sendRedirect("/error.html");
    }
}

```

在配置类中可以通过异常控制方法设置自定义的鉴权失败处理器：

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    //自定义表单提交
    http.formLogin()
        //登录验证路径
        .loginProcessingUrl("/login")
        //登录页面
        .loginPage("/login.html")
        //登录成功后的跳转路径
        //                .successForwardUrl("/main")
        //登录成功处理器
        .successHandler(new AuthenticationSuccessHandlerImpl("/show.html"))
        //登陆失败后跳转路径
        //                .failureForwardUrl("/loginerror")
        //登录失败处理器
        .failureHandler(new AuthenticationFailureHandlerImpl("/error.html"));

    //异常处理器
    http.exceptionHandling()
        //鉴权失败认证
        .accessDeniedHandler(new AccessDeniedHanderImpl());

    //使用拦截器
    http.authorizeRequests()
        //无条件放行登录页面
        .antMatchers("/login.html").permitAll()
        //放行登陆失败页面
        .antMatchers("/error.html").permitAll()
        //具有admin权限才可以进入show页面
        .antMatchers("/show.html").hasAnyAuthority("adminN")
        //具有root角色才能进入show页面
        .antMatchers("/show.html").hasRole("root")
        .antMatchers("/show.html").hasIpAddress("127.0.0.1")
        //拦截所有请求必须认证后访问
        .anyRequest().authenticated();

    http.csrf().disable();
}

```

## access表达式

access表达式可以通过access方法来完成，在一个matcher后使用access表达式可以完成更复杂和丰富的权限控制。像对认证和授权以及IP的控制都可以通过access表达式完成。

实际上之前使用的所有有关认证和权限相关的控制方法都是通过access表达式完成的，以permitAll方法为例：

```java
public ExpressionUrlAuthorizationConfigurer<H>.ExpressionInterceptUrlRegistry permitAll() {
    return this.access("permitAll");
}

```

在配置类中使用access方法中传入一个字符串，字符串表达式类似对方法的调用：

```java
//使用拦截器
http.authorizeRequests()
    //无条件放行登录页面
    .antMatchers("/login.html").access("permitAll()")
    .antMatchers("/show.html").access("hasRole('root')");

```

实际上这很类似方法的调用，字符串的参数都是通过单引号传入的。

### 自定义验证方式

在进行自定义的权限控制的时候，可以创建自定义的处理类然后使用access加载来完成。例如将访问页面的名称作为权限在用户中存储：

1. 创建业务类：

   ```java
   @Service
   public class UriAuthCheckService {
       /**
        * 判断权限中是否存在路径访问权限
        * @param request 获取请求路径
        * @param authentication 获取登录用户以及权限集合
        * @return
        */
       public boolean hasPermission(HttpServletRequest request, Authentication authentication){
           //登录用户主体默认是Object类型
           Object obj = authentication.getPrincipal();
           //安全的类型转换
           if(obj instanceof UserDetails){
               //类型转换
               UserDetails details = (UserDetails) obj;
               //判断权限是否存在
               return details.getAuthorities().contains(
                       new SimpleGrantedAuthority(request.getRequestURI())
               );
           }
           //默认返回false
           return false;
       }
   }
   
   ```

   其中，Authorities集合的元素类型是GrantedAuthority，它是一个接口类型，所以在Authorities集合中进行查找的时候，需要创建一个GrantedAuthority的子类实例，这里用到的是SimpleGrantedAuthority子类。

2. 使用access方法进行配置：

   ```java
   @Override
   protected void configure(HttpSecurity http) throws Exception {
       //自定义表单提交
       http.formLogin()
           //登录验证路径
           .loginProcessingUrl("/login")
           //登录页面
           .loginPage("/login.html")
           //登录成功处理器
           .successHandler(new AuthenticationSuccessHandlerImpl("/show.html"))
           //登录失败处理器
           .failureHandler(new AuthenticationFailureHandlerImpl("/error.html"));
   
       //异常处理器
       http.exceptionHandling()
           //鉴权失败认证
           .accessDeniedHandler(new AccessDeniedHanderImpl());
   
       //使用拦截器
       http.authorizeRequests()
           //无条件放行登录页面
           .antMatchers("/login.html").permitAll()
           //放行登陆失败页面
           .antMatchers("/error.html").permitAll()
           .anyRequest().access("@uriAuthCheckService.hasPermission(request,authentication)");
   
       http.csrf().disable();
   }
   
   ```

   @的意思是从内存中获取到实例，其中hasPermission的参数也是由Spring自动注入的。

3. 以上配置文件中，登录成功将前往show页面，但因为用户并不存在/show.html的权限，所以无法正确进入页面，而是进入accessDeniedHandler方法所指定的鉴权失败页面。

   那就要在用户登录后的loadUserByUsername方法中赋予其前往show页面的权限：

   ```java
   public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
       //模拟用户名不存在的情况
       if(!"admin".equals(username)){
           throw new UsernameNotFoundException("用户并不存在");
       }
       //组装用户信息返回
       return new User(
           "admin",
           new BCryptPasswordEncoder().encode("123"),
           AuthorityUtils.commaSeparatedStringToAuthorityList("admin,normal,ROLE_root,/show.html")
       );
   }
   
   ```

## 注解方式

此前对权限和认证的配置都是通过配置类的方式完成的，也可以通过注解的方式。但是注解方式需要通过主启动类上的EnableGlobalMethodSecurity注解来开启其他的注解才能使用。

注解可以写到方法上或者类上，通常写在控制层的方法上。

### @Serured

 首先要在主启动类上将注解开启：

```java
@SpringBootApplication
@EnableGlobalMethodSecurity(securedEnabled = true)
public class SpringsecuritydemoApplication {
	public static void main(String[] args) {
		SpringApplication.run(SpringsecuritydemoApplication.class, args);
	}
}

```

然后在控制层的方法上就可以使用此注解来进行角色判断：

```java
@Secured("ROLE_root")
@GetMapping("/show")
public String show(){
    return "redirect:show.html";
}

```

如果权限不足，还是会跳转到配置类中所设置的权限不足控制器中。如果要配置多个角色，可以如下写法：

```java
@Secured("ROLE_root","ROLE_user")
@GetMapping("/show")
public String show(){
    return "redirect:show.html";
}

```

要注意，此处必须在参数中添加`ROLE_`作为前缀，否则将失效，并且严格区分大小写。

### @PreAuthorize

PreAuthorize和PostAuthorize是类似的，都可以传入access表达式来进行权限控制，pre表示执行前进行验证，post表示执行后进行验证。通常使用pre进行控制。

首先在控制台打开PreAuthorize和PostAuthorize的注解：

```java
@SpringBootApplication
@EnableGlobalMethodSecurity(securedEnabled = true,prePostEnabled = true)
public class SpringsecuritydemoApplication {
	public static void main(String[] args) {
		SpringApplication.run(SpringsecuritydemoApplication.class, args);
	}
}
```

比Serured注解更灵活的是PreAuthorize可以使用access表达式，所以可以使用任意的验证方式，甚至自定义验证方式：

```java
@PreAuthorize("hasAuthority('admin')")
@GetMapping("/show")
public String show(){
    return "redirect:show.html";
}
```

这里要注意的是，此处的access表达式中对角色控制的hasRole方法可以带`ROLE_`前缀，也可以不带，而配置类中必须不能带，Serured注解中必须带。

## RememberMe功能

记住我功能通常使用一个复选框来控制，在登录请求中，传入的参数名必须为remember-me，true则表示开启记住我功能。

记住我还需要持久层的支持，所以要导入JDBC，这里采用Mybatis持久层框架：

```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.1</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```

然后在配置文件中对数据源进行配置：

```properties
spring.datasource.driver-class-name= com.mysql.cj.jdbc.Driver
spring.datasource.url= jdbc:mysql://localhost:3306/security?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Aisa/Shanghai
spring.datasource.username= root
spring.datasource.password= root
```

在配置类中，要填写UserDetailsService方法和持久化控制配置类，所以还要把自定义的UserDetailsService注入或者创建后填入配置：

```java
//注入自定义的业务类
@Autowired
UserDetailsServiceImpl userDetailsService;

@Override
protected void configure(HttpSecurity http) throws Exception {
    //自定义表单提交
    http.formLogin()
        //登录验证路径
        .loginProcessingUrl("/login")
        //登录页面
        .loginPage("/login.html")
        //登录成功处理器
        .successHandler(new AuthenticationSuccessHandlerImpl("/show.html"))
        //登录失败处理器
        .failureHandler(new AuthenticationFailureHandlerImpl("/error.html"));

    //异常处理器
    http.exceptionHandling()
        //鉴权失败认证
        .accessDeniedHandler(new AccessDeniedHanderImpl());

    //使用拦截器
    http.authorizeRequests()
        //无条件放行登录页面
        .antMatchers("/login.html").permitAll()
        //放行登陆失败页面
        .antMatchers("/error.html").permitAll()
        //拦截所有请求必须认证后访问
        .anyRequest().authenticated();

    //设置记住我
    http.rememberMe()
        //设置用户信息读取类
        .userDetailsService(userDetailsService);

    http.csrf().disable();
}

```

还要准备一个PersistentTokenRepository接口的实例，来完成数据库存储工作，可以采用Bean注入的方式或者自定义类。要将PersistentTokenRepository的实现类JdbcTokenRepositoryImpl进行注入，此Bean如果在配置类中声明可能会出现循环依赖，所以建议写到配置类外部：

```java
//注入数据源配置
@Autowired
DataSource dataSource;

@Bean
public PersistentTokenRepository getPersistentTokenRepository(){
    //创建空实例
    JdbcTokenRepositoryImpl jdbcTokenRepository = new JdbcTokenRepositoryImpl();
    //配置数据源
    jdbcTokenRepository.setDataSource(dataSource);
    //是否自动建表，用于存储记住我的用户
    jdbcTokenRepository.setCreateTableOnStartup(true);
    return jdbcTokenRepository;
}

```

自动建表的语句只会在第一次启动项目时使用，再次启动项目就要删除，否则会重复建表导致报错。然后在配置中添加此实例：

```java
@Autowired
UserDetailsServiceImpl userDetailsService;

@Autowired
PersistentTokenRepository persistentTokenRepository;

@Override
protected void configure(HttpSecurity http) throws Exception {
    //自定义表单提交
    http.formLogin()
        //登录验证路径
        .loginProcessingUrl("/login")
        //登录页面
        .loginPage("/login.html")
        //登录成功处理器
        .successHandler(new AuthenticationSuccessHandlerImpl("/show.html"))
        //登录失败处理器
        .failureHandler(new AuthenticationFailureHandlerImpl("/error.html"));

    //异常处理器
    http.exceptionHandling()
        //鉴权失败认证
        .accessDeniedHandler(new AccessDeniedHanderImpl());

    //使用拦截器
    http.authorizeRequests()
        //无条件放行登录页面
        .antMatchers("/login.html").permitAll()
        //放行登陆失败页面
        .antMatchers("/error.html").permitAll()
        //拦截所有请求必须认证后访问
        .anyRequest().authenticated();

    http.rememberMe()
        //设置用户信息读取类
        .userDetailsService(userDetailsService)
        //持久层存储设置类
        .tokenRepository(persistentTokenRepository);

    http.csrf().disable();
}
```

在登录页中添加用于记住我的复选框，name必定为remember-me：

```html
<form action="/login" method="post">
    用户名：<input name="username"><br>
    密码：<input name="password"><br>
    记住我：<input name="remember-me" type="checkbox" value="true"><br>
    <input type="submit" value="登录">
</form>
```

一定要在第二次启动项目时删除自动建表的语句，否则会报错，表中的字段如下：

- username：用户名
- series：主键
- token：令牌
- last_used：最后一次创建时间

默认的失效时间是两周，可以通过配置类进行控制：

```java
http.rememberMe()
    //设置用户信息读取类
    .userDetailsService(userDetailsService)
    //持久层存储设置类
    .tokenRepository(persistentTokenRepository)
    //失效时间，单位为秒
    .tokenValiditySeconds(60);

```

当然也可以更改传入的remember-me参数的名称：

```java
http.rememberMe()
    //设置用户信息读取类
    .userDetailsService(userDetailsService)
    //持久层存储设置类
    .tokenRepository(persistentTokenRepository)
    //失效时间，单位为秒
    .tokenValiditySeconds(60)
    //记住我的参数名
    .rememberMeParameter("remember");

```

## Thymeleaf中的应用

首先要在项目中引入Thymeleaf：

```xml
<dependency>
    <groupId>org.thymeleaf.extras</groupId>
    <artifactId>thymeleaf-extras-springsecurity5</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>

```

未来的html都将放到templates文件夹中，并且要引入文档的规范：

```xml
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity5">

```

所有的模板引擎文件都要通过控制层来进行跳转，所以每个html文件都应有一个相应的控制层访问接口。

### 获取属性值

可以通过以下指令获取当前登录用户的信息：

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity5">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <span sec:authentication="name"></span>=登陆账号<br>
    <span sec:authentication="principal.username"></span>=登陆账号<br>
    <span sec:authentication="credentials"></span>=凭证<br>
    <span sec:authentication="authorities"></span>=权限与角色<br>
    <span sec:authentication="details.remoteAddress"></span>=客户端地址<br>
    <span sec:authentication="details.sessionId"></span>=会话标识<br>
</body>
</html>

```

提供的控制层接口用于访问页面：

```java
@RequestMapping("/details")
public String details(){
    return "/details";
}

```

访问的结果类似如下内容：

```
admin=登陆账号
admin=登陆账号
=凭证
[/show.html, ROLE_root, admin, normal]=权限与角色
0:0:0:0:0:0:0:1=客户端地址
F18D0E3CDA9362CEC197FE87BC3250E9=会话标识

```

### 权限判断

进行权限判断时，类似使用access表达式的方式来进行判断：

```html
<button sec:authorize="hasAuthority('admin')">admin</button>
<button sec:authorize="hasAuthority('normal')">normal</button>
<button sec:authorize="hasAuthority('test')">test</button>
<button sec:authorize="hasRole('root')">ROLE:root</button>
<button sec:authorize="hasRole('master')">ROLE:master</button>

```

如果权限不存在，则不会展示相应的元素。

## 退出登录

退出登录只需要访问`/logout`接口即可，此接口由SpringSecurity提供，访问此接口使用get请求，也就是说可以采用超链接或者按钮的方式来完成。

通过超链接的方式完成退出将自动的跳转到登录页面，并且会在登录页面路径后拼接`?logout`作为参数。

还可以指定的设置跳出后访问的页面，需要在配置类中设置：

```java
http.logout()
    .logoutSuccessUrl("/login.html");
```

这样配置的跳转路径不会拼接任何参数。同样的可以模仿登录成功后处理器的编写来实现自己的退出登录处理器。

还可以设置默认的退出登录接口的路径，在配置类中设置：

```java
http.logout()
    //退出登录路径
    .logoutUrl("/bye")
    //退出登录后访问路径
    .logoutSuccessUrl("/login.html");
```

## csrf

csrf全称Cross Site Request Forgery 跨站域请求伪造，是一种攻击形式，其攻击原理为：当用户登录并信任一个网站后，网站会生成对应的sessionID存储在cookie中，在每次访问时携带cookie与服务端session ID进行匹配从而确定一个用户的身份。当其他网站获取到了所信任网站的cookie之后，相当于已经拥有了访问信任网站的凭证，从而执行任意可执行的接口。

防止csrf攻击Security给出的解决方案是：在所有的请求中必须携带一个服务端生成的token，来判断是否是从当前网站发出的请求，因为token是服务端生成的，并不会保存到浏览器的cookie中，所以盗用的几率会小一些。并且攻击者在发出攻击请求时，要确定所信任网站所生成的token后才可以进行攻击，只要保护好cookie和token，就可以防止其他网站的攻击。

Security默认将打开csrf防护，并且只会处理请求中带有合法的\_csrf参数的请求，否则将视为跨站攻击从而拒绝处理。其他攻击网站虽然可以通过某些手段来获取cookie值，但并不容易获取到页面中的内容或者脚本中的变量值，所以可以在所有页面中添加隐藏的输入框，或者对所有发送的请求的js脚本植入\_csrf参数来正确访问接口。

简单的完成csrf防护首先要在配置类中去除关闭防护的配置：

```java
// http.csrf().disable();
```

然后在所有会发出请求的表单上添加隐藏域来规定_csrf的值，可以通过thymeleaf来获取服务端生成的token后再提交表单：

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity5">
<head>
    <meta charset="UTF-8">
    <title>login</title>
</head>
<body>
<form action="/login" method="post">
    <input type="hidden" name="_csrf" th:value="${_csrf.token}">
    用户名：<input name="username"><br>
    密码：<input name="password"><br>
    记住我：<input name="remember-me" type="checkbox" value="true"><br>
    <input type="submit" value="登录">
</form>
</body>
</html>
```

> 2022年1月13日创建