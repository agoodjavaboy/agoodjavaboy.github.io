# 1-Maven简介与安装

Apache Maven 是一套软件工程管理和整合工具。基于项目对象模型（POM）的概念，通过一个中央信息管理模块，Maven 能够管理项目的构建、报告和文档。 本教程将教你如何在使用 Java 开发的工程中，或者任何其他编程语言中使用 Maven。

## 环境要求

Maven 是一个基于 Java 的工具，所以要做的第一件事情就是安装 JDK。

## 系统要求

| 项目     | 要求                                                         |
| :------- | :----------------------------------------------------------- |
| JDK      | Maven 3.3 要求 JDK 1.7 或以上 Maven 3.2 要求 JDK 1.6 或以上 Maven 3.0/3.1 要求 JDK 1.5 或以上 |
| 内存     | 没有最低要求                                                 |
| 磁盘     | Maven 自身安装需要大约 10 MB 空间。除此之外，额外的磁盘空间将用于你的本地 Maven 仓库。你本地仓库的大小取决于使用情况，但预期至少 500 MB |
| 操作系统 | 没有最低要求                                                 |

## 下载Maven

从以下网址下载 Maven 3.2.5：**http://maven.apache.org/download.html**

## 解压Maven文件

解压文件到你想要的位置来安装 Maven 3.2.5，你会得到 apache-maven-3.2.5 子目录。

| 操作系统 | 位置 (根据你的安装位置而定)                                  |
| :------- | :----------------------------------------------------------- |
| Windows  | `C:\Program Files\Apache Software Foundation\apache-maven-3.2.5` |
| Linux    | `/usr/local/apache-maven`                                    |
| Mac      | `/usr/local/apache-maven`                                    |

## 配置环境变量

添加 M2_HOME、M2、MAVEN_OPTS 到环境变量中。

| 操作系统 | 输出                                                         |
| :------- | :----------------------------------------------------------- |
| Windows  | 使用系统属性设置环境变量。 M2_HOME=C:\Program Files\Apache Software Foundation\apache-maven-3.2.5 M2=%M2_HOME%\bin MAVEN_OPTS=-Xms256m -Xmx512m |
| Linux    | 打开命令终端设置环境变量。 export M2_HOME=/usr/local/apache-maven/apache-maven-3.2.5 export M2=$M2_HOME/bin export MAVEN_OPTS=-Xms256m -Xmx512m |
| Mac      | 打开命令终端设置环境变量。 export M2_HOME=/usr/local/apache-maven/apache-maven-3.2.5 export M2=$M2_HOME/bin export MAVEN_OPTS=-Xms256m -Xmx512m |

现在添加 M2 变量到系统“Path”变量中

| 操作系统 | 输出                                    |
| :------- | :-------------------------------------- |
| Windows  | 添加字符串 “;%M2%” 到系统“Path”变量末尾 |
| Linux    | export PATH=$M2:$PATH                   |
| Mac      | export PATH=$M2:$PATH                   |

## 验证安装结果

现在打开控制台，执行以下 **mvn** 命令。

| 操作系统 | 输出           | 命令                              |
| :------- | :------------- | :-------------------------------- |
| Windows  | 打开命令控制台 | `c:\> mvn --version`              |
| Linux    | 打开命令终端   | `$ mvn --version`                 |
| Mac      | 打开终端       | `machine:~ joseph$ mvn --version` |

最后，验证以上命令的输出，应该是像下面这样：

| 操作系统 | 输出                                                         |
| :------- | :----------------------------------------------------------- |
| Windows  | Apache Maven 3.2.5 (r801777; 2009-08-07 00:46:01+0530) Java version: 1.6.0_21 Java home: C:\Program Files\Java\jdk1.6.0_21\jre |
| Linux    | Apache Maven 3.2.5 (r801777; 2009-08-07 00:46:01+0530) Java version: 1.6.0_21 Java home: C:\Program Files\Java\jdk1.6.0_21\jre |
| Mac      | Apache Maven 3.2.5 (r801777; 2009-08-07 00:46:01+0530) Java version: 1.6.0_21 Java home: C:\Program Files\Java\jdk1.6.0_21\jre |