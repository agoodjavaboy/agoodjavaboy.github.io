import { defineConfig } from 'vitepress';
import nav from './nav.mjs';
import sidebar from './sidebar.mjs'

export default defineConfig({
  lang:"zh",// 本站语言
  title: "移动空间",//页签标题
  description: "文档数据仓储",//网页描述
  head: [['link', { rel: 'icon', href: 'media/logo.png' }]],//页签图标
  themeConfig: {//主题配置
    siteTitle: "移动空间-文档数据仓储",//所有页面标题
    logo: "/media/logo.png",//页面标题前的LOGO
    search:{//搜索设置
      provider: 'local',//本地搜索模式
      options: {
        locales: {
          root: {//坑，不要写zh，要写root
            translations: {
              button: {//首页搜索按钮
                buttonText: '搜索文档',//搜索按钮样式
              },
              modal: {//打开窗口内容
                noResultsText: '无法找到相关结果',//无结果提示
                resetButtonTitle: '清除查询条件',//输入框清空提示
                footer: {//打开窗口的脚部内容
                  selectText: '选择',//选中提示
                  navigateText: '切换',//切换提示
                  closeText: '关闭'//关闭提示
                }
              }
            }
          }
        }
      }
    },
    docFooter: { prev: '上一篇', next: '下一篇' },//文档页脚
    editLink: {//在线编辑功能
      pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',//编辑链接
      text: '在线编辑此文档'//点击按钮提示
    },
    lastUpdated:{//最后一次更新
      text: "最近更新时间",//内容提示
      formatOptions: {//时间格式化
        dateStyle: 'full',//年月日格式
        timeStyle: 'medium'//时分秒格式
      }
    },
    footer: {//页脚信息
      message: 'I can eat glass, it doesn\'t hurt me.',//消息，提示语
      copyright: 'Copyright © 2024 <a href="https://beian.miit.gov.cn/" target="_blank">鲁ICP备18039033号-1</a> <a href="/wiki/document/dev/">🗑️垃圾桶</a>'//提示语下的版权信息
    },
    socialLinks: [//友情链接快捷方式
      { 
        icon: {//图标内容，通常使用svg代码
          svg: '<svg t="1709218150568" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1468" width="200" height="200"><path d="M0 0m184.32 0l655.36 0q184.32 0 184.32 184.32l0 655.36q0 184.32-184.32 184.32l-655.36 0q-184.32 0-184.32-184.32l0-655.36q0-184.32 184.32-184.32Z" fill="#EC5D85" p-id="1469"></path><path d="M512 241.96096h52.224l65.06496-96.31744c49.63328-50.31936 89.64096 0.43008 63.85664 45.71136l-34.31424 51.5072c257.64864 5.02784 257.64864 43.008 257.64864 325.03808 0 325.94944 0 336.46592-404.48 336.46592S107.52 893.8496 107.52 567.90016c0-277.69856 0-318.80192 253.14304-324.95616l-39.43424-58.368c-31.26272-54.90688 37.33504-90.40896 64.68608-42.37312l60.416 99.80928c18.18624-0.0512 41.18528-0.0512 65.66912-0.0512z" fill="#EF85A7" p-id="1470"></path><path d="M512 338.5856c332.8 0 332.8 0 332.8 240.64s0 248.39168-332.8 248.39168-332.8-7.75168-332.8-248.39168 0-240.64 332.8-240.64z" fill="#EC5D85" p-id="1471"></path><path d="M281.6 558.08a30.72 30.72 0 0 1-27.47392-16.97792 30.72 30.72 0 0 1 13.73184-41.216l122.88-61.44a30.72 30.72 0 0 1 41.216 13.74208 30.72 30.72 0 0 1-13.74208 41.216l-122.88 61.44a30.59712 30.59712 0 0 1-13.73184 3.23584zM752.64 558.08a30.60736 30.60736 0 0 1-12.8512-2.83648l-133.12-61.44a30.72 30.72 0 0 1-15.04256-40.7552 30.72 30.72 0 0 1 40.76544-15.02208l133.12 61.44A30.72 30.72 0 0 1 752.64 558.08zM454.656 666.88a15.36 15.36 0 0 1-12.288-6.1952 15.36 15.36 0 0 1 3.072-21.49376l68.5056-50.91328 50.35008 52.62336a15.36 15.36 0 0 1-22.20032 21.23776l-31.5904-33.024-46.71488 34.72384a15.28832 15.28832 0 0 1-9.13408 3.04128z" fill="#EF85A7" p-id="1472"></path><path d="M65.536 369.31584c15.03232 101.90848 32.84992 147.17952 44.544 355.328 14.63296 2.18112 177.70496 10.04544 204.05248-74.62912a16.14848 16.14848 0 0 0 1.64864-10.87488c-30.60736-80.3328-169.216-60.416-169.216-60.416s-10.36288-146.50368-11.49952-238.83776zM362.25024 383.03744l34.816 303.17568h34.64192L405.23776 381.1328zM309.52448 536.28928h45.48608l16.09728 158.6176-31.82592 1.85344zM446.86336 542.98624h45.80352V705.3312h-33.87392zM296.6016 457.97376h21.39136l5.2736 58.99264-18.91328 2.26304zM326.99392 457.97376h21.39136l2.53952 55.808-17.408 1.61792zM470.62016 459.88864h19.456v62.27968h-19.456zM440.23808 459.88864h22.20032v62.27968h-16.62976z" fill="#FFFFFF" p-id="1473"></path><path d="M243.56864 645.51936a275.456 275.456 0 0 1-28.4672 23.74656 242.688 242.688 0 0 1-29.53216 17.52064 2.70336 2.70336 0 0 1-4.4032-1.95584 258.60096 258.60096 0 0 1-5.12-29.57312c-1.41312-12.1856-1.95584-25.68192-2.16064-36.36224 0-0.3072 0-2.5088 3.01056-1.90464a245.92384 245.92384 0 0 1 34.22208 9.5744 257.024 257.024 0 0 1 32.3584 15.17568c0.52224 0.256 2.51904 1.4848 0.09216 3.77856z" fill="#EB5480" p-id="1474"></path><path d="M513.29024 369.31584c15.03232 101.90848 32.84992 147.17952 44.544 355.328 14.63296 2.18112 177.70496 10.04544 204.05248-74.62912a16.14848 16.14848 0 0 0 1.64864-10.87488c-30.60736-80.3328-169.216-60.416-169.216-60.416s-10.36288-146.50368-11.49952-238.83776zM810.00448 383.03744l34.816 303.17568h34.64192L852.992 381.1328zM757.27872 536.28928h45.48608l16.09728 158.6176-31.82592 1.85344zM894.6176 542.98624h45.80352V705.3312H906.5472zM744.35584 457.97376h21.39136l5.2736 58.99264-18.91328 2.26304zM774.74816 457.97376h21.39136l2.53952 55.808-17.408 1.61792zM918.3744 459.88864h19.456v62.27968h-19.456zM887.99232 459.88864h22.20032v62.27968h-16.62976z" fill="#FFFFFF" p-id="1475"></path><path d="M691.32288 645.51936a275.456 275.456 0 0 1-28.4672 23.74656 242.688 242.688 0 0 1-29.53216 17.52064 2.70336 2.70336 0 0 1-4.4032-1.95584 258.60096 258.60096 0 0 1-5.12-29.57312c-1.41312-12.1856-1.95584-25.68192-2.16064-36.36224 0-0.3072 0-2.5088 3.01056-1.90464a245.92384 245.92384 0 0 1 34.22208 9.5744 257.024 257.024 0 0 1 32.3584 15.17568c0.52224 0.256 2.51904 1.4848 0.09216 3.77856z" fill="#EB5480" p-id="1476"></path></svg>',
        },
        link: "https://weifang.sdjtip.com/"//点击图标会跳转的链接
      },
      { 
        icon: {
          svg: '<svg t="1709218231946" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2583" width="200" height="200"><path d="M849.92 51.2H174.08c-67.8656 0-122.88 55.0144-122.88 122.88v675.84c0 67.8656 55.0144 122.88 122.88 122.88h675.84c67.8656 0 122.88-55.0144 122.88-122.88V174.08c0-67.8656-55.0144-122.88-122.88-122.88z m-80.38912 605.91104c-32.82432 77.88032-90.5728 128.10752-171.7504 151.20384a284.83584 284.83584 0 0 1-94.592 10.39872c-66.60096-3.7888-124.29824-28.9536-172.90752-74.4448-47.95392-44.88192-77.85472-100.06016-88.25856-164.83328-14.15168-88.10496 7.55712-167.10656 64.96256-235.61216 31.5392-37.632 70.8864-64.75264 116.77696-82.26304 15.81568-6.03648 33.1264-0.41984 41.8048 13.39392 8.86272 14.10048 6.78912 32.25088-5.49888 43.48416-3.47136 3.1744-7.85408 5.67808-12.2368 7.46496-69.95968 28.56448-116.18304 78.86848-134.53824 152.22784-17.81248 71.17824-2.06336 136.33024 43.41248 193.73056 28.50304 35.98336 65.32608 60.14976 109.89568 72.01792 28.80512 7.66976 57.91744 8.17152 87.25504 3.6352 30.27456-4.67968 58.5472-14.63296 83.90656-31.99488 34.8928-23.88992 59.74528-55.75168 72.17664-96.26624 10.74176-34.9952 11.10528-70.31296-2.16064-105.04192-10.6752-27.94496-29.5424-49.45408-53.20704-67.18464-12.6464-9.472-26.21952-16.87552-41.69728-20.50048-0.70144-0.16384-1.41824-0.24576-2.69824-0.45056 2.11456 8.09984 4.08064 15.79008 6.10816 23.45984 4.91008 18.5088 9.92256 36.98688 14.75072 55.51616 10.48576 40.2688 0.34304 75.55584-27.392 105.62048-25.6512 27.81184-58.31168 39.9104-95.77472 36.28544-41.70752-4.0448-71.4752-26.6752-90.90048-63.32416-10.17344-19.18976-14.56128-39.87456-15.37024-61.5168-1.29024-34.4576 6.75328-66.27328 26.49088-94.70976 21.20192-30.54592 50.57024-50.14016 85.26336-62.32576 2.73408-0.95744 5.49376-1.82784 8.69888-2.8928-1.86368-7.08608-3.81952-14.0032-5.49376-20.992-2.31424-9.60512-5.28384-19.15904-6.44608-28.91776-3.44064-28.8512 5.42208-53.95968 25.35936-74.96704 16.32256-17.2032 36.12672-28.11904 59.84256-31.37536 2.61632-0.3584 5.2224-0.75776 7.82336-1.13664h10.68032c6.20544 1.00864 12.48256 1.72544 18.62144 3.07712 21.57056 4.75136 40.88832 14.30016 57.9328 28.29824 11.1872 9.18016 15.75424 21.15584 12.51328 35.34336-2.90304 12.75392-11.06432 21.34016-23.64928 25.0112-11.89376 3.47136-22.656 0.83968-32.43008-6.99392-12.38016-9.92256-26.12224-16.7936-42.59328-15.32416-13.95712 1.24416-27.31008 15.92832-26.112 29.04064 0.5376 5.86752 2.6368 11.5968 4.12672 17.36192 2.6368 10.19392 5.34016 20.36736 8.01792 30.5408 0.46592 1.75616 0.896 3.15904 3.34848 3.29216 37.51936 2.048 71.32672 14.25408 101.44768 36.8896 29.6192 22.26176 53.87264 48.96768 70.12864 82.52928 11.92448 24.63232 18.6112 50.64192 20.3776 77.94688 2.36544 36.28544-1.8944 71.7824-16.01536 105.29792z" fill="#D81E06" p-id="2584"></path><path d="M548.52096 462.01344l-8.77568-33.19808c-20.54656 6.528-38.29248 16.49664-51.58912 33.08544-17.80224 22.21568-21.35552 47.73376-15.67232 74.8544 2.94912 14.08 9.83552 26.13248 21.92384 34.54464 15.11424 10.5216 35.69664 10.06592 51.50208-0.87552 16.1536-11.1872 23.3472-29.22496 18.62656-47.72864-5.1712-20.26496-10.66496-40.45312-16.01536-60.68224z" fill="#D81E06" p-id="2585"></path></svg>',
        },
        link: "https://xianxia.sdjtip.com/"
      },
      { 
        icon: {
          svg: '<svg t="1701852167147" class="icon" viewBox="0 0 1210 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1772" width="200" height="200"><path d="M186.181818 0h837.818182a186.181818 186.181818 0 0 1 186.181818 186.181818v651.636364a186.181818 186.181818 0 0 1-186.181818 186.181818H186.181818a186.181818 186.181818 0 0 1-186.181818-186.181818V186.181818a186.181818 186.181818 0 0 1 186.181818-186.181818z m100.398546 719.592727c4.328727-0.418909 6.423273-3.025455 6.004363-7.261091-0.698182-5.632-2.653091-10.705455-3.258182-16.477091-3.444364-31.650909 28.718545-102.493091 42.542546-132.142545C393.681455 429.614545 393.774545 430.917818 392.285091 417.186909c-0.837818-7.121455-13.172364-31.557818-25.739636-30.301091-13.405091 1.396364-64.465455 38.818909-79.26691 49.524364-10.938182 7.819636-20.014545 13.172364-19.456 26.903273-0.139636 2.885818-0.279273 10.984727 5.02691 10.426181 1.954909-0.279273 10.658909-4.933818 12.474181-6.190545l43.892364-21.829818 1.117091 0.837818a1441.512727 1441.512727 0 0 0-74.24 135.168c-10.658909 22.621091-25.6 77.265455-23.086546 100.957091 2.653091 24.576 23.738182 25.646545 43.194182 33.605818a24.669091 24.669091 0 0 0 10.379637 3.304727z m416.674909-279.458909c-2.094545-18.944-7.121455-42.263273-29.509818-46.685091 3.072-3.723636 14.522182-4.933818 13.963636-10.146909-1.117091-10.426182-27.229091-30.580364-46.964364-28.532363-31.325091 3.258182-100.957091 48.034909-138.286545 98.39709-31.325091 42.496-59.578182 104.820364-53.713455 158.161455 4.514909 40.215273 35.095273 80.430545 79.127273 72.471273 115.106909-20.200727 185.297455-152.855273 175.383273-243.665455z m-85.178182 121.018182l-42.496 47.569455c-9.914182 11.124364-38.865455 32.395636-53.248 33.88509-13.451636 1.396364-18.478545-25.786182-18.897455-34.816-2.513455-49.012364 28.253091-120.226909 109.614546-177.152 0.279273 2.885818 1.861818 8.378182 5.725091 7.959273 4.794182-0.558545 15.36-19.316364 27.973818-20.712727 13.451636-1.396364 20.293818 16.058182 21.410909 25.925818 3.351273 31.278545-31.464727 91.927273-50.082909 117.294546z m357.282909-149.876364c-2.094545-18.897455-7.121455-42.216727-29.509818-46.638545 3.072-3.723636 14.522182-4.933818 13.963636-10.146909-1.117091-10.426182-27.229091-30.580364-46.964363-28.532364-31.325091 3.258182-100.957091 48.034909-138.286546 98.397091-31.325091 42.496-59.578182 104.820364-53.713454 158.161455 4.514909 40.215273 35.095273 80.430545 79.127272 72.471272 115.246545-20.200727 185.437091-152.855273 175.383273-243.665454z m-85.178182 121.018182l-42.496 47.616c-9.914182 11.124364-38.865455 32.395636-53.248 33.885091-13.451636 1.396364-18.478545-25.786182-18.897454-34.816-2.513455-49.012364 28.253091-120.226909 109.614545-177.152 0.279273 2.885818 1.954909 8.378182 5.725091 7.959273 4.794182-0.558545 15.36-19.316364 27.973818-20.712727 13.451636-1.396364 20.293818 16.058182 21.410909 25.925818 3.351273 31.278545-31.325091 91.787636-50.082909 117.294545z m-79.546182 171.287273c19.037091-3.072 54.132364-7.447273 54.132364-7.447273-364.544 21.829818-621.149091 129.117091-616.680727 127.069091 0 0-14.382545 9.169455 0 15.592727 7.307636 3.304727 49.524364-15.639273 49.524363-15.639272 289.559273-100.817455 623.476364-127.069091 623.476364-127.069091-39.563636 1.536-110.452364 7.447273-110.452364 7.447272z m110.452364 20.945454c-400.430545 23.877818-616.634182 127.069091-616.634182 127.069091s-14.429091 9.169455 0 15.639273c7.261091 3.258182 49.524364-15.639273 49.524364-15.639273 300.032-104.587636 301.288727-101.841455 623.476363-127.069091-39.563636 1.536-110.312727 7.447273-110.312727 7.447273 18.850909-2.932364 53.992727-7.447273 53.992727-7.447273zM232.727273 186.181818h526.941091a23.272727 23.272727 0 1 0 0-46.545454H232.727273a23.272727 23.272727 0 0 0 0 46.545454z m0 93.090909h263.447272a23.272727 23.272727 0 1 0 0-46.545454H232.727273a23.272727 23.272727 0 0 0 0 46.545454z" fill="#409EFF" p-id="1773"></path></svg>',
        },
        link: "https://exams.sdjtip.com/"
      }
    ],
    outline:{//每页子菜单内容
      label:"本页内容",//标题
      level:2//最大层级
    },
    nav: nav,
    sidebar: sidebar,
  }
})