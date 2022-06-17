module.exports = {
    port: "8080",
    dest: "docs",
    base: "/",
    markdown: {
        lineNumbers: true,
        externalLinks: {
            target: '_blank', rel: 'noopener noreferrer'
        }
    },
    locales: {
        "/": {
            lang: "zh-CN",
            title: "‍💻文档中心🕵️‍",
            description: "👓向积极拼搏的人生致敬🐱‍"
        }
    },
    head: [
        // ico
        ["link", {rel: "icon", href: "/images/logo.png"}],
        // meta
        ["meta", {name: "robots", content: "all"}],
        ["meta", {name: "author", content: "pdai"}],
        ["meta", {name: "keywords", content: "Java 全栈知识体系, java体系, java知识体系, java框架,java详解,java学习路线,java spring, java面试, 知识体系, java技术体系, java编程, java编程指南,java开发体系, java开发,java教程,java,java数据结构, 算法, 开发基础"}],
        ["meta", {name: "apple-mobile-web-app-capable", content: "yes"}],
    ],
    plugins: require("./config/plugins"),
    themeConfig: {
        logo: "/images/logo.png",
        docsRepo: "realpdai/tech-arch-doc",
        editLinks: false,
        sidebarDepth:0,
        locales: {
            "/": {
                label: "简体中文",
                selectText: "Languages",
                editLinkText: "在 GitHub 上编辑此页",
                lastUpdated: "上次更新",
                nav: require("./config/nav"),
                sidebar: require("./config/sidebar")
            }
        }
    }
};