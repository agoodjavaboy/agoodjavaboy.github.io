# Postgresql跨库查询

使用Postgresql进行跨库连接查询有很多种方法，以下介绍使用dblink插件的用法：

1. 添加`dblink`插件到当前数据库中，那在当前数据库里就能连接其他数据库了，而不需要在被连接的数据库里添加此插件：

```sql
create extension dblink;
```

2. 在添加了插件之后，就可以通过`dblink`方法进行数据查询了：

```sql
select * from dblink('
	host=目标数据库IP 
	port=目标数据库端口 
	dbname=目标数据库名 
	user=连接用户 
	password=连接用户密码','
	在目标数据库中执行的查询语句
') as t(
	取出目标数据库每个列的类型与列名
)
```

3. 具体执行语法如下：

```sql
select * from dblink('
	host=127.0.0.1 
	port=5432 
	dbname=postgresql 
	user=postgresql 
	password=postgresql','
	select * from user_entity	
') as t(
	id int8, username varchar
)
```

4. 安装PostgreSQL数据库之后，默认是只接受本地访问连接。如果想在其他主机上访问PostgreSQL数据库服务器，就需要进行相应的配置。

   **pg_hba.conf**：配置对数据库的访问权限。

```
# TYPE DATABASE  USER    CIDR-ADDRESS     METHOD

# "local" is for Unix domain socket connections only
local all    all               trust
# IPv4 local connections:
host  all    all    127.0.0.1/32     trust
host  all    all    192.168.1.0/24    md5
# IPv6 local connections:
host  all    all    ::1/128       trust
```

> 上边的第7行是新添加的内容，表示允许网段192.168.1.0上的所有主机使用所有合法的数据库用户名访问数据库，并提供加密的密码验证。其中，数字24是子网掩码，表示允许192.168.1.0–192.168.1.255的计算机访问！

​	**postgresql.conf**：配置PostgreSQL数据库服务器的相应的参数。

​	将数据库服务器的监听模式修改为监听所有主机发出的连接请求：定位到#listen_addresses='localhost'，PostgreSQL安装完成后，默认是只接受来在本机localhost的连接请求。将行开头的#去掉，将行内容修改为listen_addresses='*'来允许数据库服务器监听来自任何主机的连接请求。