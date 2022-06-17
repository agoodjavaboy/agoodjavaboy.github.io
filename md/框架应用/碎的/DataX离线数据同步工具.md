# DataX离线数据同步工具

DataX 是阿里巴巴集团内被广泛使用的离线数据同步工具/平台，实现包括 MySQL、SQL Server、Oracle、PostgreSQL、HDFS、Hive、HBase、OTS、ODPS 等各种异构数据源之间高效的数据同步功能。

DataX本身作为数据同步框架，将不同数据源的同步抽象为从源头数据源读取数据的Reader插件，以及向目标端写入数据的Writer插件，理论上DataX框架可以支持任意数据源类型的数据同步工作。同时DataX插件体系作为一套生态系统, 每接入一套新数据源该新加入的数据源即可实现和现有的数据源互通。

DataX本身作为**数据同步框架**，将不同数据源的同步抽象为从源头数据源读取数据的Reader插件，以及向目标端写入数据的Writer插件，理论上DataX框架可以支持任意数据源类型的数据同步工作。同时DataX插件体系作为一套生态系统, 每接入一套新数据源该新加入的数据源即可实现和现有的数据源互通。

![img](media/v2-d859cdf5ab281aaa382b45f675941591_720w.jpg)

资料：[快速入手指南](https://github.com/alibaba/DataX/blob/master/userGuid.md) [插件开发宝典](https://github.com/alibaba/DataX/blob/master/dataxPluginDev.md)

## 框架设计

DataX本身作为离线数据同步框架，采用Framework + plugin架构构建。将数据源读取和写入抽象成为Reader/Writer插件，纳入到整个同步框架中。

![img](media/v2-1b8c9810156b24356df8e5435b4dac89_720w.jpg)

- Reader：Reader为数据采集模块，负责采集数据源的数据，将数据发送给Framework。

- Writer： Writer为数据写入模块，负责不断向Framework取数据，并将数据写入到目的端。

- Framework：Framework用于连接reader和writer，作为两者的数据传输通道，并处理缓冲，流控，并发，数据转换等核心技术问题。

## Job&Task概念

在DataX的逻辑模型中包括job、task两个维度，通过**将job进行task拆分**，然后**将task合并到taskGroup**进行运行。**job实例运行在jobContainer容器中**，它是所有任务的master，负责**初始化、拆分、调度、运行、回收、监控和汇报**，但它并不做实际的数据同步操作。 Job拆分成Task，在分别在框架提供的容器中执行，插件只需要实现Job和Task两部分逻辑。

- Job: Job是DataX用以描述从一个源头到一个目的端的同步作业，是DataX数据同步的最小业务单元。比如：从一张mysql的表同步到odps的一个表的特定分区。

- Task: Task是为最大化而把Job拆分得到的最小执行单元。比如：读一张有1024个分表的mysql分库分表的Job，拆分成1024个读Task，用若干个并发执行。

- TaskGroup: 描述的是一组Task集合。在同一个TaskGroupContainer执行下的Task集合称之为TaskGroup。

- JobContainer: Job执行器，负责Job全局拆分、调度、前置语句和后置语句等工作的工作单元。类似Yarn中的JobTracker。

- TaskGroupContainer: TaskGroup执行器，负责执行一组Task的工作单元，类似Yarn中的TaskTracker。

![img](media/6302559-055bd5b7efdf4633.png)

## 执行过程

1. DataX完成单个数据同步的作业，我们称之为Job，DataX接受到一个Job之后，将启动一个进程来完成整个作业同步过程。DataX Job模块是单个作业的中枢管理节点，承担了数据清理、子任务切分(将单一作业计算转化为多个子Task)、TaskGroup管理等功能。
2. DataXJob启动后，会根据不同的源端切分策略，将Job切分成多个小的Task(子任务)，以便于并发执行。Task便是DataX作业的最小单元，每一个Task都会负责一部分数据的同步工作。
3. 切分多个Task之后，DataX Job会调用Scheduler模块，根据配置的并发数据量，将拆分成的Task重新组合，组装成TaskGroup(任务组)。每一个TaskGroup负责以一定的并发（可在json配置文件中配置）运行完毕分配好的所有Task，默认单个任务组的并发数量为5。
4. 每一个Task都由TaskGroup负责启动，Task启动后，会固定启动Reader—>Channel—>Writer的线程来完成任务同步工作。
5. DataX作业运行起来之后， Job监控并等待多个TaskGroup模块任务完成，等待所有TaskGroup任务完成后Job成功退出。否则，异常退出。

**工作流程介绍：**

工作流程大概就是用Reader模块从源数据库读数据，在Storage模块里将Reader模块读到的数据交换给Write模块，Write模块将数据写进目的数据库。

- DoubleQueue：设立两块空间，一个存储源数据，一个存储目标数据。在开始，空间A和空间B都是空的，loading 任务从源数据库向A空间加载数据，A空间满后再向B空间加载数据，同时dumping任务将A空间数据转储到目的数据库。A空间清空后，交换AB两者的任务，即A空间的任务换成loading，B空间的任务换成dumping。不断重复上述操作。

- RAMStorage：基于DoubleQueue，用内存作为数据交换的空间

- 基于RAMStorage的数据操纵接口：LineSender和LineReceiver

- LineSender的作用：Reader用LineSender来放数据到Storage对象中。

**在LineSender接口里，主要有这几个接口：**

- createLine():构造一个将要被用来交换数据的Line对象

- sendToWriter(Line line): 用来将一个Line对象put到Storage抽象类里。

- flush()用来将buffer的数据flush到Storage对象中。

- LineReceiver的作用：Writer用LineReceiver来从到Storage对象中获取数据。在LineReceiver接口里，主要有一个接口：getFromReader():获取下一个Storage中的Line对象。

基于RAMStorage的批量数据交换：BufferedLineExchanger。内部初始化一个指定大小的数组缓冲，默认大小64 ，在push数据时会先写满64个数组再单次写入DoubleQueue队列，Poll时返回的大小可能会小于64个单位，由当时数组的实际大小决定。

![img](media/6302559-f7f564b1fd2c1f55.png)

## 使用过程

**环境要求：**

- Linux
- JDK 1.8+
- Python 2.6.x
- Apache Maven 3.x

1. 下载DataX工具包：[DataX下载地址](http://datax-opensource.oss-cn-hangzhou.aliyuncs.com/datax.tar.gz)，下载后解压到本地，进入bin路径，启动自检：

   ```shell
   $ cd  {YOUR_DATAX_HOME}/bin
   $ python {YOUR_DATAX_HOME}/bin/datax.py {YOUR_DATAX_HOME}/job/job.json
   ```

2. 创建作业配置文件（json格式），展示配置模板：

   ```shell
   $ cd  {YOUR_DATAX_HOME}/bin
   $  python datax.py -r streamreader -w streamwriter
   DataX (UNKNOWN_DATAX_VERSION), From Alibaba !
   Copyright (C) 2010-2015, Alibaba Group. All Rights Reserved.
   Please refer to the streamreader document:
       https://github.com/alibaba/DataX/blob/master/streamreader/doc/streamreader.md 
   
   Please refer to the streamwriter document:
        https://github.com/alibaba/DataX/blob/master/streamwriter/doc/streamwriter.md 
    
   Please save the following configuration as a json file and  use
        python {DATAX_HOME}/bin/datax.py {JSON_FILE_NAME}.json 
   to run the job.
   
   {
       "job": {
           "content": [
               {
                   "reader": {
                       "name": "streamreader", 
                       "parameter": {
                           "column": [], 
                           "sliceRecordCount": ""
                       }
                   }, 
                   "writer": {
                       "name": "streamwriter", 
                       "parameter": {
                           "encoding": "", 
                           "print": true
                       }
                   }
               }
           ], 
           "setting": {
               "speed": {
                   "channel": ""
               }
           }
       }
   }
   ```

3. 可通过模板文件创建个人json文件：

   ```json
   {
     "job": {
       "content": [
         {
           "reader": {
             "name": "streamreader",
             "parameter": {
               "sliceRecordCount": 10,
               "column": [
                 {
                   "type": "long",
                   "value": "10"
                 },
                 {
                   "type": "string",
                   "value": "hello，你好，世界-DataX"
                 }
               ]
             }
           },
           "writer": {
             "name": "streamwriter",
             "parameter": {
               "encoding": "UTF-8",
               "print": true
             }
           }
         }
       ],
       "setting": {
         "speed": {
           "channel": 5
          }
       }
     }
   }
   ```

4. 启动上文中的json文件，并打印内容：

   ```shell
   $ cd {YOUR_DATAX_DIR_BIN}
   $ python datax.py ./xxx.json 
   ```

   ```
   2015-12-17 11:20:25.263 [job-0] INFO  JobContainer - 
   任务启动时刻                    : 2015-12-17 11:20:15
   任务结束时刻                    : 2015-12-17 11:20:25
   任务总计耗时                    :                 10s
   任务平均流量                    :              205B/s
   记录写入速度                    :              5rec/s
   读出记录总数                    :                  50
   读写失败总数                    :                   0
   ```

## 与Azkaban整合使用

1. 创建DataX的配置json：

   ```json
   {
   	"job": {
   		"setting": {
   			"speed": {
   				"channel": 1
   			}
   		},
   		"content": [
   			{
   				"reader": {
   					"name": "postgresqlreader",
   					"parameter": {
   						"username": "$user",
   						"password": "$password",
   						"where": "",
   						"connection": [{
   							"querySql": [
   								"一个查询语句"
   							],
   							"jdbcUrl": [
   								"jdbc:postgresql://$dataBaseUrl:$dataPort/$dataBaseName"
   							]
   						}]
   					}
   				},
   				"writer": {
   					"name": "postgresqlwriter",
   					"parameter": {
   						"username": "$targetUser",
   						"password": "$targetPassword",
   						"column": [
   							"插入表的列名"
   						],
   						"preSql": [
   							"执行迁移前在写入目标中执行的sql"
   						],
   
   						"connection": [{
   							"jdbcUrl": "jdbc:postgresql://$targetDataBaseUrl:$targetPort/$targetDataBaseName",
   							"table": [
   								"目标表名"
   							]
   						}]
   					}
   				}
   			}
   		]
   	}
   }
   ```

   > 在json中所写的`$`将会在启动此py文件的时候对其进行赋值。

2. 书写python启动指令：

   ```shell
   python /指向datax的bin路径下的datax.py/bin/datax.py -p "-Duser=替换值$user -Dpassword=替换值$password -DdataBaseUrl=替换值$dataBaseUrl -DdataPort=替换值$dataPort -DdataBaseName=替换值$dataBaseName -DtargetUser=替换值$targetUser -DtargetPassword=替换值$targetPassword -DtargetDataBaseUrl=替换值$targetDataBaseUrl -DtargetPort=替换值$targetPort -DtargetDataBaseName=替换值$targetDataBaseName" /指向json文件所在路径/xxx.json
   ```

3. 创建job文件并压缩：

   ```properties
   type=command                                                    
   command=python /指向datax的bin路径下的datax.py/bin/datax.py -p "-Duser=替换值$user -Dpassword=替换值$password -DdataBaseUrl=替换值$dataBaseUrl -DdataPort=替换值$dataPort -DdataBaseName=替换值$dataBaseName -DtargetUser=替换值$targetUser -DtargetPassword=替换值$targetPassword -DtargetDataBaseUrl=替换值$targetDataBaseUrl -DtargetPort=替换值$targetPort -DtargetDataBaseName=替换值$targetDataBaseName" /指向json文件所在路径/xxx.json
   ```

4. 上传并启动。
