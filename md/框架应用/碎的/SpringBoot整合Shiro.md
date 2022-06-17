# SpringBoot整合Shiro

## 导入依赖并测试

> 使用一个Spring Boot的空项目开始构建。

1. 导入SpringMVC依赖：

   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-web</artifactId>
   </dependency>
   ```

2. 测试MVC：创建控制层并书写controller接口：

   ```java
   @Controller
   @RequestMapping("/user")
   public class UserController {
       @RequestMapping("/hello")
       @ResponseBody
       public String hello(){
           return "hello";
       }
   }
   ```

3. 导入thymeleaf模板引擎依赖：

   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-thymeleaf</artifactId>
   </dependency>
   ```

4. 测试thymeleaf模板引擎：控制层添加方法：

   ```java
   @RequestMapping("/goIndex")
   public String goIndex(Model model){
       //将数据存入Model对象
       model.addAttribute("name","jack");
       //跳转页面路径：页面书写在src/main/resources/templates路径下
       return "index.html";
   }
   ```

   html内容如下（thymeleaf3.0之前对html格式要求严格，否则会报错）：

   ```html
   <!DOCTYPE html>
   <html lang="en" xmlns:th="http://www.w3.org/1999/xhtml">
   <head>
       <meta charset="UTF-8">
       <title>Title</title>
   </head>
   <body>
       <h1 th:text="${name}"></h1>
   </body>
   </html>
   ```

5. 导入Shiro依赖：

   ```xml
   <dependency>
       <groupId>org.apache.shiro</groupId>
       <artifactId>shiro-spring</artifactId>
       <version>1.4.0</version>
   </dependency>
   ```

## 自定义Realm源

> realm的主要作用就是获取认证和授权的源，可能是一个数据库也可以是个配置文件。

```java
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;

public class UserRealm extends AuthorizingRealm {
    //执行授权逻辑
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        System.out.println("执行授权逻辑");
        return null;
    }

    //执行认证逻辑
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        System.out.println("执行认证逻辑");
        return null;
    }
}
```

## 编写Shiro配置类

> 最基本也是最关键的配置类，后续将根据需求和业务的增多进行修改。

```java
import com.example.springboot_shiro.shiro.UserRealm;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/*Shiro配置类*/
@Configuration
public class ShiroConfig {
    //创建ShiroFilterFactoryBean
    @Bean
    public ShiroFilterFactoryBean getShiroFilterFactoryBean(@Qualifier("securityManager") DefaultWebSecurityManager securityManager){
        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
        //设置安全管理器
        shiroFilterFactoryBean.setSecurityManager(securityManager);
        return shiroFilterFactoryBean;
    }

    //创建DefaultWebSecurity
    @Bean(name = "securityManager")
    public DefaultWebSecurityManager getDefaultWebSecurityManager(@Qualifier("userRealm")UserRealm userRealm){
        DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
        //关联一个realm
        securityManager.setRealm(userRealm);
        return securityManager;
    }

    //创建Realm
    @Bean(name = "userRealm")
    public UserRealm getRealm(){
        return new UserRealm();
    }
}
```

## 设置默认跳转页面

修改Shiro总配置类来设置默认跳转登录页面，当然要存在此请求以及相关静态资源页面：

```java
//创建ShiroFilterFactoryBean
@Bean
public ShiroFilterFactoryBean getShiroFilterFactoryBean(@Qualifier("securityManager") DefaultWebSecurityManager securityManager){
    ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
    //设置安全管理器
    shiroFilterFactoryBean.setSecurityManager(securityManager);
    //设置默认登录页面
    shiroFilterFactoryBean.setLoginUrl("/user/login");
    return shiroFilterFactoryBean;
}
```

## 使用过滤器实现认证资源拦截

1. 首先要构建多个资源，模拟资源的拦截功能：

   ```
   shiroProject
       └─src
          └─main
             ├─java
             │  └─com
             │      └─example
             │          └─springboot_shiro
             │              │  SpringbootShiroApplication.java：项目启动类
             │              ├─config
             │              │      ShiroConfig.java：Shiro总配置
             │              ├─controller
             │              │      UserController.java：控制层测试
             │              └─shiro
             │                      UserRealm.java：Realm源配置
             └─resources
                 │  application.properties：项目总配置文件
                 └─templates
                     │  index.html：首页，增加跳转到添加页面和修改页面的超链接
                     └─user
                             add.html：添加页面，内容为空
                             update.html：修改页面，内容为空
   ```

2. thymeleaf中的模板都要通过一个控制层进行跳转：在UserController中添加方法跳转：

   ```java
   @RequestMapping("/add")
   public String add(){
       return "user/add.html";
   }
   
   @RequestMapping("/update")
   public String update(){
       return "user/update.html";
   }
   ```

   超链接路径书写：

   ```html
   <a href="add">添加页面</a><br>
   <a href="update">修改页面</a><br>
   ```

3. 修改ShiroConfig总配置类，根据要求拦截资源：

   ```java
   //创建ShiroFilterFactoryBean
   @Bean
   public ShiroFilterFactoryBean getShiroFilterFactoryBean(@Qualifier("securityManager") DefaultWebSecurityManager securityManager){
       ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
       //设置安全管理器
       shiroFilterFactoryBean.setSecurityManager(securityManager);
       //添加内置过滤器
       Map<String,String> filterMap = new LinkedHashMap<String,String>();
       filterMap.put("/user/add","authc");
       filterMap.put("/user/update","authc");
       shiroFilterFactoryBean.setFilterChainDefinitionMap(filterMap);
       return shiroFilterFactoryBean;
   }
   ```

   filterMap中的value可选择的填写以下几种：

   - anon：无需认证（登录）可以访问。
   - authc：必须认证（登录）才可以访问。
   - user：如果使用rememberMe（记住我）功能才能访问。
   - perms：访问该资源必须得到资源权限（授权）。
   - role：访问该资源必须得到角色权限（授权）。

   > Shiro拦截成功后，将默认跳转到login.jsp页面。

4. 使用通配符的方式批量进行资源拦截：

   ```java
   //创建ShiroFilterFactoryBean
   @Bean
   public ShiroFilterFactoryBean getShiroFilterFactoryBean(@Qualifier("securityManager") DefaultWebSecurityManager securityManager){
       ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
       //设置安全管理器
       shiroFilterFactoryBean.setSecurityManager(securityManager);
       //添加内置过滤器
       Map<String,String> filterMap = new LinkedHashMap<String,String>();
       //        filterMap.put("/user/add","authc");
       //        filterMap.put("/user/update","authc");
       filterMap.put("/user/*","authc");
       shiroFilterFactoryBean.setFilterChainDefinitionMap(filterMap);
       //设置默认登录页面
       shiroFilterFactoryBean.setLoginUrl("/user/login");
       return shiroFilterFactoryBean;
   }
   ```

5. 设置可放行的资源路径：

   ```java
   //创建ShiroFilterFactoryBean
   @Bean
   public ShiroFilterFactoryBean getShiroFilterFactoryBean(@Qualifier("securityManager") DefaultWebSecurityManager securityManager){
       ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
       //设置安全管理器
       shiroFilterFactoryBean.setSecurityManager(securityManager);
       //添加内置过滤器
       Map<String,String> filterMap = new LinkedHashMap<String,String>();
       //        filterMap.put("/user/add","authc");
       //        filterMap.put("/user/update","authc");
       //设置无需拦截的资源:放开的资源要在统配资源之前放行
       filterMap.put("/user/goIndex","anon");
       filterMap.put("/user/*","authc");
       shiroFilterFactoryBean.setFilterChainDefinitionMap(filterMap);
       //设置默认登录页面
       shiroFilterFactoryBean.setLoginUrl("/user/login");
       return shiroFilterFactoryBean;
   }
   ```

## 使用自定义验证实现登录

1. 修改登录页面内容：

   ```html
   <body>
       <font color="red" th:text="${msg}"></font>
       <form method="post" action="toLogin">
           用户名：<input name="username"><br>
           密码：<input name="password"><br>
           <input type="submit">
       </form>
   </body>
   ```

2. 提供登录请求，login用于跳转页面，toLogin用于登录请求：

   ```java
   @RequestMapping("/login")
   public String login(){
       return "user/login.html";
   }
   
   @RequestMapping("/toLogin")
   public String toLogin(String username,String password,Model model){
       //使用Shiro进行认证编写
       //1. 获取subject
       Subject subject = SecurityUtils.getSubject();
       //2. 封装用户数据
       UsernamePasswordToken token = new UsernamePasswordToken(username,password);
       //3. 执行登录方法
       try {
           //如果登录方法没有任何异常则登录成功
           subject.login(token);
       }catch (UnknownAccountException e){
           e.printStackTrace();
           model.addAttribute("msg","用户名不存在");
           return "user/login";
       }catch (IncorrectCredentialsException e){
           e.printStackTrace();
           model.addAttribute("msg","密码错误");
           return "user/login";
       }
       return "redirect:goIndex";
   }
   ```

3. 执行登录，控制台输出没有此用户异常，并跳转回登录页显示异常信息：

   ```shell
   执行认证逻辑
   org.apache.shiro.authc.UnknownAccountException: Realm [com.example.springboot_shiro.shiro.UserRealm@3973be8d] was unable to find account data for the submitted AuthenticationToken [org.apache.shiro.authc.UsernamePasswordToken - 123, rememberMe=false].
   ```

## 自定义Realm认证逻辑

修改UserRealm中的代码：

```java
//执行认证逻辑
@Override
protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
    System.out.println("执行认证逻辑");

    //假定用户名和密码
    final String realname = "123";
    final String realpass = "123";

    //判断用户名与密码
    //1. 判断用户名
    UsernamePasswordToken token = (UsernamePasswordToken)authenticationToken;
    if(!token.getUsername().equals(realname))
        return null;//返回空则抛出用户名未找到异常
    //2. 判断密码:使用SimpleAuthenticationInfo类进行自动判断
    AuthenticationInfo info = new SimpleAuthenticationInfo("",realpass,"");

    return info;
}
```

## 整合MyBatis实现用户登录

1. 导入持久层要用到的依赖：

   ```xml
   <!--导入连接池-->
   <dependency>
       <groupId>com.alibaba</groupId>
       <artifactId>druid</artifactId>
       <version>1.0.9</version>
   </dependency>
   <!--持久层依赖：使用postgresql-->
   <dependency>
       <groupId>org.postgresql</groupId>
       <artifactId>postgresql</artifactId>
       <version>42.2.5</version>
   </dependency>
   <!--导入mybatis启动器-->
   <dependency>
       <groupId>org.mybatis.spring.boot</groupId>
       <artifactId>mybatis-spring-boot-starter</artifactId>
       <version>1.1.1</version>
   </dependency>
   ```

2. 修改application.properties内容，书写数据库连接相关配置：

   ```properties
   ##数据库连接配置：
   spring.datasource.driverClassName = org.postgresql.Driver
   spring.datasource.url = jdbc:postgresql://192.168.101.78:5432/postgres
   spring.datasource.username = postgres
   spring.datasource.password = postgres
   
   ##阿里连接池配置
   spring.datasource.tyle=com.alibaba.druid.pool.DruidDataSource
   
   ##Mybatis别名扫描
   mybatis.type-aliases-package=com.example.springbootshiro.domain
   ```

3. 创建数据库表格：

   ```sql
   -- 创建用户表
   CREATE TABLE user_entity (
     id serial NOT NULL,
     name varchar(255),
     pass varchar(255),
     PRIMARY KEY ("id")
   );
   -- 插入一条记录
   insert into user_entity(name,pass) values('aaa','123');
   ```

4. 创建domain包，并创建user实体类/创建Mybatis的Sql映射文件及接口文件：

   ```
   springbootshiro
   	└─src
   	   └─main
   		  ├─java
   		  │  └─com
   		  │      └─example
   		  │          └─springbootshiro
   		  │              │  SpringbootShiroApplication.java：启动类
   		  │              │
   		  │              ├─config
   		  │              │      ShiroConfig.java：Shiro总配置类
   		  │              │
   		  │              ├─controller
   		  │              │      UserController.java：用户控制层
   		  │              │
   		  │              ├─domain
   		  │              │      UserEntity.java：用户实体类（与user_entity对应）
   		  │              │
   		  │              ├─mapper
   		  │              │      UserMapper.java：用户持久层接口
   		  │              │
   		  │              ├─service
   		  │              │  │  UserService.java：用户业务层接口
   		  │              │  │
   		  │              │  └─impl
   		  │              │          UserServiceImpl.java：用户业务层实现
   		  │              │
   		  │              └─shiro
   		  │                      UserRealm.java：用户验证源配置
   		  │
   		  └─resources
   			  │  application.properties：总配置文件
   			  │
   			  ├─mapper
   			  │      UserMapper.xml：用户Mapper
   			  │
   			  └─templates
   				  │  index.html：首页
   				  │
   				  └─user
   						  add.html：添加页面
   						  login.html：展示页面
   						  update.html：登录页面
   ```

   mapper文件中的内容：

   > 如果使用IDEA，它会把src文件夹下的java文件编译到target里面，但是xml文件不会。xml文件要放在resource中才能生效，但是Eclipse就没有这种约束。

   ```xml
   <?xml version="1.0" encoding="utf-8" ?>
   <!DOCTYPE mapper
           PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
           "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
   <mapper namespace="com.example.springbootshiro.mapper.UserMapper">
       <select id="getUserByName" parameterType="string" resultType="userEntity">
           select * from user_entity where name = ##{value};
       </select>
   </mapper>
   ```

5. 在启动类上添加Mapper文件扫描：

   ```java
   @SpringBootApplication
   @MapperScan("com.example.springbootshiro.mapper")
   public class SpringbootShiroApplication {
       public static void main(String[] args) {
           SpringApplication.run(SpringbootShiroApplication.class, args);
       }
   }
   ```

6. 修改Realm类中的验证规则，通过调用Service的方法来获取用户信息：

   ```java
   //执行认证逻辑
   @Override
   protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
       System.out.println("执行认证逻辑");
   
       //判断用户名与密码
       UsernamePasswordToken token = (UsernamePasswordToken)authenticationToken;
       UserEntity user = userService.getUserByName(token.getUsername());
       //1. 判断用户是否存在
       if(user == null)
           return null;//返回空则抛出用户名未找到异常
       //2. 判断密码:使用SimpleAuthenticationInfo类进行自动判断
       AuthenticationInfo info = new SimpleAuthenticationInfo("",user.getPass(),"");
   
       return info;
   }
   ```

## 使用授权过滤器实现用户授权

1. 修改ShiroConfig中的过滤器代码，添加拦截授权内容：

   > Map中单个请求的拦截要在统配拦截之前。

   ```java
   //创建ShiroFilterFactoryBean
   @Bean
   public ShiroFilterFactoryBean getShiroFilterFactoryBean(@Qualifier("securityManager") DefaultWebSecurityManager securityManager){
       ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
       //设置安全管理器
       shiroFilterFactoryBean.setSecurityManager(securityManager);
       //添加内置过滤器
       Map<String,String> filterMap = new LinkedHashMap<String,String>();
       //        filterMap.put("/user/add","authc");
       //        filterMap.put("/user/update","authc");
       //设置无需拦截的资源:放开的资源要在统配资源之前放行
       filterMap.put("/user/goIndex","anon");
       filterMap.put("/user/toLogin","anon");
       //设置授权过滤器
       filterMap.put("/user/add","perms[user:add]");
       filterMap.put("/user/*","authc");
       shiroFilterFactoryBean.setFilterChainDefinitionMap(filterMap);
       //设置默认登录页面
       shiroFilterFactoryBean.setLoginUrl("/user/login");
       return shiroFilterFactoryBean;
   }
   ```

2. 授权未成功，将跳转到“未授权”的提示页面，修改ShrioConfig的内容设置未授权页面的路径：

   ```java
   //创建ShiroFilterFactoryBean
   @Bean
   public ShiroFilterFactoryBean getShiroFilterFactoryBean(@Qualifier("securityManager") DefaultWebSecurityManager securityManager){
       ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
       //设置安全管理器
       shiroFilterFactoryBean.setSecurityManager(securityManager);
       //添加内置过滤器
       Map<String,String> filterMap = new LinkedHashMap<String,String>();
       //        filterMap.put("/user/add","authc");
       //        filterMap.put("/user/update","authc");
       //设置无需拦截的资源:放开的资源要在统配资源之前放行
       filterMap.put("/user/goIndex","anon");
       filterMap.put("/user/toLogin","anon");
       //设置授权过滤器
       filterMap.put("/user/add","perms[user:add]");
       filterMap.put("/user/*","authc");
       shiroFilterFactoryBean.setFilterChainDefinitionMap(filterMap);
       //设置默认登录页面
       shiroFilterFactoryBean.setLoginUrl("/user/login");
       //设置未授权提示页面
       shiroFilterFactoryBean.setUnauthorizedUrl("/user/unauthor");
       return shiroFilterFactoryBean;
   }
   ```

   > 这里将直接跳转到index页面中，通过name作用域传值提示：

   ```java
   @RequestMapping("/unauthor")
   public String unauthor(Model model){
       model.addAttribute("name","资源未授权");
       return "index.html";
   }
   ```

3. 在UserRealm中添加授权，对所有请求添加放行权限：

   ```java
   //执行授权逻辑
   @Override
   protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
       System.out.println("执行授权逻辑");
       //准备授权对象
       SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
       //添加权限
       info.addStringPermission("user:add");
       return info;
   }
   ```

## 关联数据库实现动态权限控制

1. 在用户表中添加一列字段，用于表示权限标识符，并相应的修改实体类：

   ```sql
   alter table user_entity add perms varchar(30);
   ```

2. 给不同用户设置不同权限：

   ![image-20200827193709357](media/image-20200827193709357.png)

3. service以及dao层添加方法：通过ID获取用户信息：

   ```xml
   <mapper namespace="com.example.springbootshiro.mapper.UserMapper">
       <select id="getUserByName" parameterType="string" resultType="userEntity">
           select * from user_entity where name = ##{value};
       </select>
       <select id="getUserById" parameterType="int" resultType="userEntity">
           select * from user_entity where id = ##{value};
       </select>
   </mapper>
   ```

4. 在UserRealm中查询数据库获取权限进行授权：

   > 要在认证逻辑的判断密码的方法的第一个参数中传入查询出来的用户对象，才能在授权方法中获得到当前登录的用户。

   ```java
   //执行授权逻辑
   @Override
   protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
       System.out.println("执行授权逻辑");
       //准备授权对象
       SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
       //获取到当前登录的用户
       Subject subject = SecurityUtils.getSubject();
       UserEntity user = (UserEntity)subject.getPrincipal();//这里取出的就是认证方法中存入的用户实例
       UserEntity result = userService.getUserById(user.getId());
       //进行授权
       info.addStringPermission(result.getPerms());
   
       return info;
   }
   
   //执行认证逻辑
   @Override
   protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
       System.out.println("执行认证逻辑");
   
       //判断用户名与密码
       UsernamePasswordToken token = (UsernamePasswordToken)authenticationToken;
       UserEntity user = userService.getUserByName(token.getUsername());
       //1. 判断用户是否存在
       if(user == null)
           return null;//返回空则抛出用户名未找到异常
       //2. 判断密码:使用SimpleAuthenticationInfo类进行自动判断
       AuthenticationInfo info = new SimpleAuthenticationInfo(user,user.getPass(),"");
   
       return info;
   }
   ```

5. 在ShiroConfig中，对update资源也添加权限拦截：

   ```java
   //创建ShiroFilterFactoryBean
   @Bean
   public ShiroFilterFactoryBean getShiroFilterFactoryBean(@Qualifier("securityManager") DefaultWebSecurityManager securityManager){
       ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
       //设置安全管理器
       shiroFilterFactoryBean.setSecurityManager(securityManager);
       //添加内置过滤器
       Map<String,String> filterMap = new LinkedHashMap<String,String>();
       //        filterMap.put("/user/add","authc");
       //        filterMap.put("/user/update","authc");
       //设置无需拦截的资源:放开的资源要在统配资源之前放行
       filterMap.put("/user/goIndex","anon");
       filterMap.put("/user/toLogin","anon");
       //设置授权过滤器
       filterMap.put("/user/add","perms[user:add]");
       filterMap.put("/user/update","perms[user:update]");
       filterMap.put("/user/*","authc");
       shiroFilterFactoryBean.setFilterChainDefinitionMap(filterMap);
       //设置默认登录页面
       shiroFilterFactoryBean.setLoginUrl("/user/login");
       //设置未授权提示页面
       shiroFilterFactoryBean.setUnauthorizedUrl("/user/unauthor");
       return shiroFilterFactoryBean;
   }
   ```

## Thymeleaf与Shiro整合

1. 导入一个thymeleaf扩展的依赖：

   ```xml
   <!--thymeleaf+shiro-->
   <dependency>
       <groupId>com.github.theborakompanioni</groupId>
       <artifactId>thymeleaf-extras-shiro</artifactId>
       <version>2.0.0</version>
   </dependency>
   ```

2. 在ShiroConfig中配置ShiroDialect，也就是向Spring容器中添加一个ShiroDialect的实例：

   ```java
   @Bean
   public ShiroDialect getShiroDialect(){
       return new ShiroDialect();
   }
   ```

3. 可以使用Shiro的标签，在页面中控制显示的内容：

   ```html
   <a shiro:hasPermission="user:add" href="add">添加页面</a>
   <a shiro:hasPermission="user:update" href="update">修改页面</a>
   ```

> 2022年1月13日创建