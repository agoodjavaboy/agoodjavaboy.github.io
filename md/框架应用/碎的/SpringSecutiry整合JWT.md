# SpringSecutiry整合JWT

## 创建项目

创建一个SpringBoot项目，并通过构建工具导入相关的依赖：

![image-20210125151141986](media/image-20210125151141986.png)

然后再添加`jsonwebtoken`的依赖：

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.9.1</version>
</dependency>
```

在项目中创建类：

![微信截图_20210125153228](media/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20210125153228.png)

## 类的详细信息介绍

> JwtAccessDeniedHandler和JwtAuthenticationEntryPoint的作用是用户访问没有授权资源和携带错误token的错误返回处理信息类，要使用这两个类只需要在security的配置文件中配置一下就可以用了。

### JwtAccessDeniedHandler

当用户没有授权的时候，返回指定的信息：

```java
@Component
public class jwtAccessDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AccessDeniedException e) throws IOException, ServletException {
        System.out.println("用户访问没有授权资源");
        System.out.println(e.getMessage());
        httpServletResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, e==null?"用户访问没有授权资源":e.getMessage());
    }
}
```

### JwtAuthenticationEntryPoint

当用户访问时未携带正确的token值时，返回指定的信息：

```java
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AuthenticationException e) throws IOException, ServletException {
        System.out.println("用户访问资源没有携带正确的token");
        System.out.println(e.getMessage());
        httpServletResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, e==null?"用户访问资源没有携带正确的token":e.getMessage());
    }
}
```

### UserDetailsService

直接继承`org.springframework.security.core.userdetails.UserDetailsService`，在输入密码进行登录的时候，会在此类中进行验证。此处使用常量规定密码，生产中应使用数据库数据：

```java
@Service
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        UserDetails userDetails  = User.withUsername(s).password(new BCryptPasswordEncoder().encode("123456"))
                .authorities("user").build();
        return userDetails;
    }
}
```

### JwtTokenUtils

用于生成和验证JWT信息：

```java
public class JwtTokenUtils {
    public static final String TOKEN_HEADER = "Authorization";
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String SECRET = "jwtsecret";
    public static final String ISS = "echisan";

    private static final Long EXPIRATION = 60 * 60 * 3L; //过期时间3小时

    private static final String ROLE = "role";

    //创建token
    public static String createToken(String username, String role, boolean isRememberMe){
        Map map = new HashMap();
        map.put(ROLE, role);
        return Jwts.builder()
                .signWith(SignatureAlgorithm.HS512, SECRET)
                .setClaims(map)
                .setIssuer(ISS)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION * 1000))
                .compact();
    }

    //从token中获取用户名(此处的token是指去掉前缀之后的)
    public static String getUserName(String token){
        String username;
        try {
            username = getTokenBody(token).getSubject();
        } catch (    Exception e){
            username = null;
        }
        return username;
    }

    public static String getUserRole(String token){
        return (String) getTokenBody(token).get(ROLE);
    }

    private static Claims getTokenBody(String token){
        Claims claims = null;
        try{
            claims = Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).getBody();
        } catch(ExpiredJwtException e){
            e.printStackTrace();
        } catch(UnsupportedJwtException e){
            e.printStackTrace();
        } catch(MalformedJwtException e){
            e.printStackTrace();
        } catch(SignatureException e){
            e.printStackTrace();
        } catch(IllegalArgumentException e){
            e.printStackTrace();
        }
        return claims;
    }

    //是否已过期
    public static boolean isExpiration(String token){
        try{
            return getTokenBody(token).getExpiration().before(new Date());
        } catch(Exception e){
            System.out.println(e.getMessage());
        }
        return true;
    }
}
```

### JwtAuthenticationFilter

用于验证JWT信息，将请求中携带的token信息解析并设置到Spring Security的上下文中。然后通过这些信息进行用户信息的查验：

```java
public class JwtAuthenticationFilter extends BasicAuthenticationFilter {
    public JwtAuthenticationFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        String tokenHeader = request.getHeader(JwtTokenUtils.TOKEN_HEADER);
        //如果请求头中没有Authorization信息则直接放行了
        if(tokenHeader == null || !tokenHeader.startsWith(JwtTokenUtils.TOKEN_PREFIX)){
            chain.doFilter(request, response);
            return;
        }
        //如果请求头中有token,则进行解析，并且设置认证信息
        if(!JwtTokenUtils.isExpiration(tokenHeader.replace(JwtTokenUtils.TOKEN_PREFIX,""))){
            //设置上下文
            UsernamePasswordAuthenticationToken authentication = getAuthentication(tokenHeader);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        super.doFilterInternal(request, response, chain);
    }

    //获取用户信息
    private UsernamePasswordAuthenticationToken getAuthentication(String tokenHeader){
        String token = tokenHeader.replace(JwtTokenUtils.TOKEN_PREFIX, "");
        String username = JwtTokenUtils.getUserName(token);
        // 获得权限 添加到权限上去
        String role = JwtTokenUtils.getUserRole(token);
        List<GrantedAuthority> roles = new ArrayList<GrantedAuthority>();
        roles.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return role;
            }
        });
        if(username != null){
            return new UsernamePasswordAuthenticationToken(username, null,roles);
        }
        return null;
    }
}
```

### SecurityJwtConfig

配置Spring Security所需的配置内容：

```java
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true) // 开启prePostEnabled注解方式授权
public class SecurityJwtConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private JwtAccessDeniedHandler jwtAccessDeniedHandler;

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable().authorizeRequests()
                .antMatchers(HttpMethod.OPTIONS,"/**")
                .permitAll()
                .antMatchers("/").permitAll()
                //login 不拦截
                .antMatchers("/login").permitAll()
                .anyRequest().authenticated()
                //授权
                .and()
                // 禁用session
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        // 使用自己定义的拦截机制，拦截jwt
        http.addFilterBefore(new JwtAuthenticationFilter(authenticationManager()), UsernamePasswordAuthenticationFilter.class)
                //授权错误信息处理
                .exceptionHandling()
                //用户访问资源没有携带正确的token
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                //用户访问没有授权资源
                .accessDeniedHandler(jwtAccessDeniedHandler);
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        //使用的密码比较方式
        return  new BCryptPasswordEncoder();
    }
}
```

### Error

用于在系统报错后做错误输出控制：

```java
@RestControllerAdvice
public class Error {
    @ExceptionHandler(BadCredentialsException.class)
    public void badCredentialsException(BadCredentialsException e){
        System.out.println(e.getMessage());
    }
}
```

## 启动类

启动类同样用作控制层接收，其中一个方法用于获取登录信息，另外两个设置了访问权限。在未来进行访问测试时，就将访问此类中的三个控制方法：

```java
@SpringBootApplication
@RestController
public class SecutiryjwtApplication {

    public static void main(String[] args) {
        SpringApplication.run(SecutiryjwtApplication.class, args);
    }

    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    public SecutiryjwtApplication(AuthenticationManagerBuilder authenticationManagerBuilder) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
    }
    
    @GetMapping("/")
    public String index(){
        return "security jwt";
    }

    @PostMapping("/login")
    public String login(@RequestParam String u, @RequestParam String p){
        // 登陆验证
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(u, p);
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(token);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        //创建jwt信息
        String token1 = JwtTokenUtils.createToken(u,"bxsheng", true);
        return token1;
    }

    @GetMapping("/role")
    @PreAuthorize("hasAnyAuthority('bxsheng')")
    public String roleInfo(){
        return "需要获得bxsheng权限，才可以访问";
    }

    @GetMapping("/roles")
    @PreAuthorize("hasAnyAuthority('kdream')")
    public String rolekdream(){
        return "需要获得kdream权限，才可以访问";
    }
}
```

## 进行访问测试

### 访问需要授权的资源

如果没有token而进入授权资源中，将会进入`JwtAuthenticationEntryPoint`，并打印响应错误信息：

![image-20210125160713244](media/image-20210125160713244.png)

![image-20210125160727173](media/image-20210125160727173.png)

### 获取Token信息

在控制类中调用login方法，即可获取token信息。在`UserDetailsService`中设置了用户名为`user`，密码是`123456`。当使用错误信息时将报出异常，将自动进入`Error`类的错误：

![image-20210125161328413](media/image-20210125161328413.png)

![image-20210125161338370](media/image-20210125161338370.png)

当使用正确的用户名和密码时，将获取有效的token串：

![image-20210125161454982](media/image-20210125161454982.png)

### 再次访问需要授权的资源

当通过正确的用户名和验证码获得了token数据后，就可以通过这条数据访问受权限控制的资源了。要将此token串放在Header请求头中，规定key值为Authorization，并在token前添加Bearer前缀，以空格与token隔开：

![image-20210125163722177](media/image-20210125163722177.png)

### 越权访问资源

当然在登录且获得到了可用的token之后，访问权限不足的资源会在控制台打印权限不足字样：

![image-20210125164018746](media/image-20210125164018746.png)

![image-20210125164045973](media/image-20210125164045973.png)