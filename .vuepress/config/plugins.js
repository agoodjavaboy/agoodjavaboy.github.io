module.exports = [
    //返回顶部
    ['@vuepress/back-to-top', true],
    //图片放大
    ['@vuepress/medium-zoom', {
        selector: 'img',
        options: {
            margin: 16
        }
    }],
    // 评论
    ['@vssue/vuepress-plugin-vssue', {
        platform: 'gitee',
        owner: 'agoodjavaboy',
        repo: 'agoodjavaboy',
        clientId: 'b141abf86a81e08ec03ee9898edf70d293c252fa0bcf6314e13e69a366d6e896',
        clientSecret: '711d4875825c9ca0c9ea1759a395e60124f4ccefd8f2721eb0fa59ee816050eb',
    }],
    // 全局搜索
    [['vuepress-plugin-code-copy', true]],
    ['@vuepress/search', {
        searchMaxSuggestions: 10
    }]
]