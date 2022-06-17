/**
 * 工具作用：
 * 1. 快速将md文件及其中媒体文件进行解析并部署
 * 2. 快速构建头部导航栏和侧边目录栏
 *
 * 工具规约：
 * 1. 所有文档目录结构固定，不可改动
 * 2. 所有笔记写到md文件夹中，且其中必须存在二级目录
 * 3. 所有媒体文件必须在md文件同级别的media文件夹中
 *
 * @type {path.PlatformPath | path}
 */




const path = require('path');
const fs = require('fs')

readDir(path.resolve("./md"))

/**
 * 读取文件目录中心
 * 文档根目录下有两层子目录，文件在第二层子目录中
 * @param rootPath 文档根目录
 */
function readDir(rootPath){
    let sidebar = "";
    let navbar = "";
    deleteDir(path.resolve("./.vuepress/public/md"));

    let oneDirs = fs.readdirSync(rootPath);
    oneDirs = orderByName(oneDirs);
    oneDirs.forEach(function(oneDir){
        let navItems = "";
        let twoDirs = fs.readdirSync(rootPath + "\\" + oneDir);
        twoDirs = orderByName(twoDirs);
        twoDirs.forEach(function(twoDir){
            let mdFiles = fs.readdirSync(rootPath + "\\" + oneDir + "\\" + twoDir);
            mdFiles = orderByName(mdFiles);
            sidebar += sidebarItemBuild(rootPath + "\\" + oneDir + "\\" + twoDir,mdFiles);
            navItems += navItemBuild(rootPath + "\\" + oneDir + "\\" + twoDir,mdFiles);
            mdFiles.forEach(function(mdFile){
                //从底层目录中找到media并复制到开放区域
                mediaCopy(rootPath + "\\" + oneDir + "\\" + twoDir + "\\" + mdFile);
            })
        })
        navbar += navBuild(oneDir, rootPath + "\\" + oneDir, navItems);
    })

    //navbar部署
    fs.writeFile(
        path.resolve("./.vuepress/config/nav.js"),
        "module.exports = [" + navbar + "]",
        (err) => {
            if (err) throw err;
        }
    );

    //sidebar部署
    fs.writeFile(
        path.resolve("./.vuepress/config/sidebar.js"),
        "module.exports = {" + sidebar + "}",
        (err) => {
            if (err) throw err;
        }
    );
}

/**
 * 删除文件夹
 * @param url
 */
function deleteDir(url){
    var files = [];

    if( fs.existsSync(url) ) {  //判断给定的路径是否存在

        files = fs.readdirSync(url);   //返回文件和子目录的数组
        files.forEach(function(file,index){
            var curPath = path.join(url,file);

            if(fs.statSync(curPath).isDirectory()) { //同步读取文件夹文件，如果是文件夹，则函数回调
                deleteDir(curPath);
            } else {
                fs.unlinkSync(curPath);    //是指定文件，则删除
            }

        });

        fs.rmdirSync(url); //清除文件夹
    }else{
        console.log("给定的路径不存在！");
    }
}

/**
 * nav 整体部署
 * @param name
 * @param path
 * @param items
 * @returns {string}
 */
function navBuild(name,path,items){
    return `{
        "src": "${path.replace(/\\/g,"/")}",
        "text": "${name}",
        "items": [
            ${items}
        ]
    },`;
}

/**
 * nav 单个item部署
 * @param itemName
 * @param childrens
 * @returns {string}
 */
function navItemBuild(itemName,childrens){
    //获取第一章内容
    let firstMd = "";
    for(let i in childrens){
        if(childrens[i]!='media'){
            firstMd = childrens[i];
            break;
        }
    }
    //如果没有第一章则无数据返回
    if(!firstMd){
        return "";
    }
    //item组建
    let itemTemplate = `{
                "link": "${(path.resolve(itemName).replace(path.resolve('./'),"")+"/"+firstMd).replace(/\\/g,"/")}",
                "src": "${itemName.replace(/\\/g,"/")}",
                "text": "${path.basename(itemName)}"
            },`;
    return itemTemplate;
}

/**
 * 单个sidebar元素构建
 * @param itemName 当前节点名称
 * @param childrens 其中的子元素集合
 * @return 单个sidebar元素
 */
function sidebarItemBuild(itemName,childrens){
    //去除media文件夹
    let finalChildrens = [];
    childrens.forEach(function (item) {
        if(item != 'media'){
            finalChildrens.push(item);
        }
    })
    childrens = finalChildrens;

    //sidebar单元素组装
    let selfPathStr = new String(path.resolve("./"));
    let template = `
    "${itemName.replace(selfPathStr,'')}\\": [
        {
            "children": ${JSON.stringify(childrens)},
            "collapsable": false,
            "sidebarDepth": 10,
            "title": "${path.basename(itemName)}"
        }
    ],`;

    //字符转换并返回
    return template.replace(/\\/g,"/");
}

/**
 * 媒体文件夹（media文件夹） 创建并复制内容到public可访问区域
 * @param filePath media文件夹路径
 */
function mediaCopy(filePath){
    //文件名称判断
    let baseName = path.basename(filePath);
    if(baseName!='media'){
        return;
    }
    //文件类型判断
    let isDirectory = fs.lstatSync(filePath).isDirectory();
    if(!isDirectory){
        return;
    }
    //进行操作的文件夹地址
    let filePathStr = new String(path.resolve(filePath));
    //当前文件地址
    let selfPathStr = new String(path.resolve("./"));
    //操作文件夹到目标目录地址
    let projectPublicPathStr = new String(path.resolve("./.vuepress/public"));

    //读取文件夹下所有内容
    fs.readdirSync(path.resolve(filePath)).forEach(function(file){
        //源文件地址
        let sourcePath = filePath + "\\" + file;
        //目标地址
        let targetPath = projectPublicPathStr+filePathStr.replace(selfPathStr,'') + "\\" + file;
        //创建文件夹
        mkdirsSync(projectPublicPathStr+filePathStr.replace(selfPathStr,''));
        //开始复制
        fs.writeFileSync(targetPath, fs.readFileSync(sourcePath));
    });
}

/**
 * 递归创建文件夹
 * @param dirname 文件夹名称
 * @return 创建结果
 */
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

/**
 * 对文件名进行排序，文件名前几位数字为排序序号，如无序号则随机靠前排序
 * @param fileNames 文件名集合
 * @return 排序结果
 */
function orderByName(fileNames){
    // 排序规则
    var compare = function (item1, item2) {
        let x = readFileNameNumber(item1);
        let y = readFileNameNumber(item2);
        if(x==null || y==null){
            if(x==y==null){
                return 0;
            }
            if(x==null && y!=null){
                return -1;
            }
            if(x!=null && y==null){
                return 1
            }
        }else{
            if (x > y) {
                return 1;
            } else if (x < y) {
                return -1;
            } else {
                return 0;
            }
        }
    }

    //执行排序并返回
    return fileNames.sort(compare);
}

/**
 * 获取文件名前的数字
 * @param fileName 文件名称
 * @return number 返回开头数字，如果没有数字返回空
 */
function readFileNameNumber(fileName){
    let regstart = new RegExp("^\\d+");
    let result = fileName.match(regstart);
    if(result){
        return Number(result.toString());
    }
    return null;
}