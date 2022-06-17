# Azkaban批量工作流任务调度器

[Azkaban](https://azkaban.github.io/)是由Linkedin开源的一个**批量工作流任务调度器**。用于在一个工作流内以一个特定的顺序运行一组工作和流程。Azkaban定义了一种KV文件格式来建立任务之间的依赖关系，并提供一个易于使用的web用户界面维护和跟踪你的工作流。

可以借助azkaban执行datax所设置的数据同步脚本。

**架构图：**

![img](media/850019206c924ceebe0e0cf96d3dac1d.jpg)

- Azkaban WebServer，是整个调度集群的核心，负责所有作业的管理和调度。
- Azkaban ExecutorServer，整个调度集群中实际运行作业的节点。
- DB，是集群中所有节点运行共用的数据存储，包含作业信息、各种调度元数据等。

## 安装过程

1. 在官网下载以下文件：

   `azkaban-web-server-2.5.0.tar.gz`是服务器；

   `azkaban-executor-server-2.5.0.tar.gz`是执行服务器；

   `azkaban-sql-script-2.5.0.tar.gz`是执行的sql脚本；

2. 执行azkaban提供的sql语句，创建所需的表格。

   ```
   mysql -uroot -p
   mysql> create database azkaban;
   mysql> use azkaban;
   Database changed
   mysql> source /home/fantj/azkaban/azkaban-2.5.0/create-all-sql-2.5.0.sql;
   mysql> show tables;
   +------------------------+
   | Tables_in_azkaban      |
   +------------------------+
   | active_executing_flows |
   | active_sla             |
   | execution_flows        |
   | execution_jobs         |
   | execution_logs         |
   | project_events         |
   | project_files          |
   | project_flows          |
   | project_permissions    |
   | project_properties     |
   | project_versions       |
   | projects               |
   | properties             |
   | schedules              |
   | triggers               |
   +------------------------+
   15 rows in set (0.00 sec)
   ```

3. 创建SSL配置：

   1. 执行`keytool -keystore keystore -alias jetty -genkey -keyalg RSA`，将在当前文件夹里生成keystore证书文件。
   2. 将keystore复制到azkaban web服务器的bin文件夹中。

4. 配置时区，执行指令按指示配置：

   ```shell
   [root@s166 azkaban]# tzselect
   Please identify a location so that time zone rules can be set correctly.
   Please select a continent or ocean.
    1) Africa
    2) Americas
    3) Antarctica
    4) Arctic Ocean
    5) Asia
    6) Atlantic Ocean
    7) Australia
    8) Europe
    9) Indian Ocean
   10) Pacific Ocean
   11) none - I want to specify the time zone using the Posix TZ format.
   #? 5
   Please select a country.
    1) Afghanistan       18) Israel            35) Palestine
    2) Armenia       19) Japan         36) Philippines
    3) Azerbaijan        20) Jordan            37) Qatar
    4) Bahrain       21) Kazakhstan        38) Russia
    5) Bangladesh        22) Korea (North)     39) Saudi Arabia
    6) Bhutan        23) Korea (South)     40) Singapore
    7) Brunei        24) Kuwait            41) Sri Lanka
    8) Cambodia          25) Kyrgyzstan        42) Syria
    9) China         26) Laos          43) Taiwan
   10) Cyprus        27) Lebanon           44) Tajikistan
   11) East Timor        28) Macau         45) Thailand
   12) Georgia       29) Malaysia          46) Turkmenistan
   13) Hong Kong         30) Mongolia          47) United Arab Emirates
   14) India         31) Myanmar (Burma)       48) Uzbekistan
   15) Indonesia         32) Nepal         49) Vietnam
   16) Iran          33) Oman          50) Yemen
   17) Iraq          34) Pakistan
   #? 9
   Please select one of the following time zone regions.
   1) Beijing Time
   2) Xinjiang Time
   #? 1
   
   The following information has been given:
   
       China
       Beijing Time
   
   Therefore TZ='Asia/Shanghai' will be used.
   Local time is now:  Sat Jul 28 18:29:58 CST 2018.
   Universal Time is now:  Sat Jul 28 10:29:58 UTC 2018.
   Is the above information OK?
   1) Yes
   2) No
   #? 1
   
   You can make this change permanent for yourself by appending the line
       TZ='Asia/Shanghai'; export TZ
   to the file '.profile' in your home directory; then log out and log in again.
   
   Here is that TZ value again, this time on standard output so that you
   can use the /usr/bin/tzselect command in shell scripts:
   Asia/Shanghai
   ```

5. 这个配置需要给集群的每个主机设置，因为任务调度离不开准确的时间。我们也可以直接把相关文件拷贝到别的主机作覆盖。

   ```shell
   cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
   ```

   ```shell
   scp /usr/share/zoneinfo/Asia/Shanghai  root@s168:/etc/localtime
   Shanghai                                                                                              100%  388   500.8KB/s   00:00    
   scp /usr/share/zoneinfo/Asia/Shanghai  root@s169:/etc/localtime
   Shanghai   
   ```

6. 修改配置：

   1. 修改服务端配置：

      修改服务端的解压文件目录下的`azkaban.properties`文件，主要修改时区、MySQL配置、SSL密码、文件路径和邮箱配置：

      ```properties
      #Azkaban Personalization Settings
      azkaban.name=Test
      azkaban.label=My Local Azkaban
      azkaban.color=#FF3601
      azkaban.default.servlet.path=/index
      web.resource.dir=web/
      default.timezone.id=Asia/Shanghai
      
      #Azkaban UserManager class
      user.manager.class=azkaban.user.XmlUserManager
      user.manager.xml.file=conf/azkaban-users.xml
      
      #Loader for projects
      executor.global.properties=conf/global.properties
      azkaban.project.dir=projects
      
      database.type=mysql
      mysql.port=3306
      mysql.host=localhost
      mysql.database=azkaban
      mysql.user=root
      mysql.password=root
      mysql.numconnections=100
      
      # Velocity dev mode
      velocity.dev.mode=false
      
      # Azkaban Jetty server properties.
      jetty.maxThreads=25
      jetty.ssl.port=8443
      jetty.port=8081
      jetty.keystore=keystore
      jetty.password=jiaoroot
      jetty.keypassword=jiaoroot
      jetty.truststore=keystore
      jetty.trustpassword=jiaoroot
      
      # Azkaban Executor settings
      executor.port=12321
      
      # mail settings
      mail.sender=844072586@qq.com
      mail.host=smtp.qq.com
      job.failure.email=
      job.success.email=
      
      lockdown.create.projects=false
      
      cache.directory=cache
      ```

   2. 修改`/conf`下的`azkaban-users.xml`文件：

      ```xml
      <azkaban-users>
              <user username="azkaban" password="azkaban" roles="admin" groups="azkaban" />
              <user username="metrics" password="metrics" roles="metrics"/>
              <user username="admin" password="admin" roles="admin">
              
              <role name="admin" permissions="ADMIN" />
              <role name="metrics" permissions="METRICS"/>
      </azkaban-users>
      ```

7. 执行服务器配置，修改`/executor/conf`目录下的`azkaban.properties`：

   ```properties
   #Azkaban
   default.timezone.id=Asia/Shanghai
   
   # Azkaban JobTypes Plugins
   azkaban.jobtype.plugin.dir=plugins/jobtypes
   
   #Loader for projects
   executor.global.properties=conf/global.properties
   azkaban.project.dir=projects
   
   database.type=mysql
   mysql.port=3306
   mysql.host=localhost
   mysql.database=azkaban
   mysql.user=root
   mysql.password=root
   mysql.numconnections=100
   
   # Azkaban Executor settings
   executor.maxThreads=50
   executor.port=12321
   executor.flow.threads=30
   ```

8. 启动项目：

   1. 启动web项目：
   
      ```shell
      nohup bin/azkaban-web-start.sh
      ```
   
   2. 启动服务端项目
   
      ```shell
      bin/azkaban-executor-start.sh
      ```
   
   3. 在启动项目时，要在项目根路径下启动，如果在bin目录下执行启动文件，会使很多css文件加载失败。

## 使用方式

### 单一Job

1. 创建job描述文件：

   ```shell
   vim command.job
   
   #command.job
   type=command                                                    
   command=echo fantj666
   ```

2. 将job文件压缩：

   ```shell
   zip command.job
   ```

3. 在平台创建文件并上传压缩文件：

   ![img](media/5786888-324ed400a42fa942.png)

   ![img](media/5786888-98d49ae08853eec7.png)

   ![img](media/5786888-b86414f532e482ba.png)

### 多个依赖关系Job

1. 创建基本job文件：

   ```properties
   # foo.job
   type=command
   command=echo foo
   ```

2. 创建子job文件：

   ```properties
   # bar.job
   type=command
   dependencies=foo
   command=echo bar
   ```

3. 将所有job资源打包进一个zip文件夹中，再上传：

   ![img](media/5786888-1a55a737bb4e2c91.png)

   ![img](media/5786888-1ae8b79becbcdf52.png)

   ![img](media/5786888-cca333b487bd2cbd.png)