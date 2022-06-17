# MyBatis 流式查询

- 通常情况下，Mybatis将查询结果返回成一个集合 ，如果集合过大，可能出现内存溢出情况。
- 流式查询表示返回的不再是一个集合，而是一个迭代器，通过迭代器逐条的遍历数据。
- 流式查询过程中，数据库连接必须保持一直打开，并且执行完查询后需要手动的关闭数据库连接。

## MyBatis 流式查询接口

- MyBatis 提供了一个叫 org.apache.ibatis.cursor.Cursor 的接口类用于流式查询，这个接口继承了 java.io.Closeable 和 java.lang.Iterable 接口。所以Cursor 是可关闭/遍历的。

- 除此之外，Cursor 还提供了三个方法：

  | 方法名            | 作用                                                         |
  | ----------------- | ------------------------------------------------------------ |
  | isOpen()          | 用于在取数据之前判断 Cursor 对象是否是打开状态，只有当打开时 Cursor 才能取数据。 |
  | isConsumed()      | 用于判断查询结果是否全部取完。                               |
  | getCurrentIndex() | 返回已经获取了多少条数据                                     |

- 因为 Cursor 实现了迭代器接口，因此在实际使用当中，可以使用lambda表达式完成遍历：

```java
cursor.forEach(rowObject -> {...});
```

## 使用 Cursor 流式接口

Mapper 类：

```java
@Mapper
public interface FooMapper {
    @Select("select * from foo limit #{limit}")
    Cursor<Foo> scan(@Param("limit") int limit);
}
```

> 通过指定 Mapper 方法的返回值为 Cursor 类型，MyBatis 就知道这个查询方法一个流式查询。

Controller 方法调用 Mapper：

```java
@GetMapping("foo/scan/0/{limit}")
public void scanFoo0(@PathVariable("limit") int limit) throws Exception {
    try (Cursor<Foo> cursor = fooMapper.scan(limit)) {  // 1
        cursor.forEach(foo -> {});                      // 2
    }
}
```

> 上面的代码中，fooMapper 是 @Autowired 进来的。注释 1 处调用 scan 方法，得到 Cursor 对象并保证它能最后关闭；2 处则是从 cursor 中取数据。

执行 scanFoo0() 时报错：

```
java.lang.IllegalStateException: A Cursor is already closed.
```

> 在取数据的过程中需要保持数据库连接，而 Mapper 方法通常在执行完后连接就关闭了，因此 Cusor 也一并关闭了。所以，解决这个问题的思路不复杂，保持数据库连接打开即可。至少有三种方案可选。

### 手动开关 SqlSessionFactory

可以用 SqlSessionFactory 来手动打开数据库连接：

```java
@GetMapping("foo/scan/1/{limit}")
public void scanFoo1(@PathVariable("limit") int limit) throws Exception {
    try (
        SqlSession sqlSession = sqlSessionFactory.openSession();  // 1
        Cursor<Foo> cursor =
              sqlSession.getMapper(FooMapper.class).scan(limit)   // 2
    ) {
        cursor.forEach(foo -> { });
    }
}
```

> 上面的代码中，1 处开启了一个 SqlSession （实际上也代表了一个数据库连接），并保证它最后能关闭；2 处使用 SqlSession 来获得 Mapper 对象。这样才能保证得到的 Cursor 对象是打开状态的。

### 事务控制 TransactionTemplate

在 Spring 中，可以用 TransactionTemplate 来执行一个数据库事务，这个过程中数据库连接同样是打开的。代码如下：

```java
@GetMapping("foo/scan/2/{limit}")
public void scanFoo2(@PathVariable("limit") int limit) throws Exception {
    TransactionTemplate transactionTemplate =
            new TransactionTemplate(transactionManager);  // 1

    transactionTemplate.execute(status -> {               // 2
        try (Cursor<Foo> cursor = fooMapper.scan(limit)) {
            cursor.forEach(foo -> { });
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    });
}
```

> 上面的代码中，1 处创建了一个 TransactionTemplate 对象，2 处执行数据库事务，而数据库事务的内容则是调用 Mapper 对象的流式查询。注意这里的 Mapper 对象无需通过 SqlSession 创建。

### 事务控制 @Transactional 注解

这个本质上和方案二一样，代码如下：

```java
@GetMapping("foo/scan/3/{limit}")
@Transactional
public void scanFoo3(@PathVariable("limit") int limit) throws Exception {
    try (Cursor<Foo> cursor = fooMapper.scan(limit)) {
        cursor.forEach(foo -> { });
    }
}
```

> 它仅仅是在原来方法上面加了个 @Transactional 注解。这个方案看上去最简洁，但请注意 Spring 框架当中注解使用的坑：只在外部调用时生效。在当前类中调用这个方法，依旧会报错。

以上是三种实现 MyBatis 流式查询的方法。