import{_ as n,c as s,o as t,aF as e}from"./chunks/framework.CvyoTX4A.js";const p="/assets/12-site-project-structure.8GyUjIEV.jpg",i="/assets/12-consumer-web-page.Uv6egK2X.jpg",m=JSON.parse('{"title":"10-工程文档","description":"","frontmatter":{},"headers":[],"relativePath":"mds/1-👾后端开发/1-Java/3-Maven/10-工程文档.md","filePath":"mds/1-👾后端开发/1-Java/3-Maven/10-工程文档.md"}'),l={name:"mds/1-👾后端开发/1-Java/3-Maven/10-工程文档.md"};function r(o,a,c,d,g,u){return t(),s("div",null,a[0]||(a[0]=[e(`<h1 id="_10-工程文档" tabindex="-1">10-工程文档 <a class="header-anchor" href="#_10-工程文档" aria-label="Permalink to &quot;10-工程文档&quot;">​</a></h1><h2 id="maven-工程文档" tabindex="-1">Maven - 工程文档 <a class="header-anchor" href="#maven-工程文档" aria-label="Permalink to &quot;Maven - 工程文档&quot;">​</a></h2><p>本教程将教你如何创建应用程序的文档。那么让我们开始吧，在 C:/ MVN 目录下，创建你的 java <strong>consumerBanking</strong> 应用程序。打开 <strong>consumerBanking</strong> 文件夹并执行以下 <strong>mvn</strong> 命令。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>C:\\MVN&gt;mvn site</span></span></code></pre></div><p>Maven 将开始构建工程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[INFO] Scanning for projects...</span></span>
<span class="line"><span>[INFO] -------------------------------------------------------------------</span></span>
<span class="line"><span>[INFO] Building consumerBanking</span></span>
<span class="line"><span>[INFO]task-segment: [site]</span></span>
<span class="line"><span>[INFO] -------------------------------------------------------------------</span></span>
<span class="line"><span>[INFO] [site:site {execution: default-site}]</span></span>
<span class="line"><span>[INFO] artifact org.apache.maven.skins:maven-default-skin: </span></span>
<span class="line"><span>checking for updates from central</span></span>
<span class="line"><span>[INFO] Generating &quot;About&quot; report.</span></span>
<span class="line"><span>[INFO] Generating &quot;Issue Tracking&quot; report.</span></span>
<span class="line"><span>[INFO] Generating &quot;Project Team&quot; report.</span></span>
<span class="line"><span>[INFO] Generating &quot;Dependencies&quot; report.</span></span>
<span class="line"><span>[INFO] Generating &quot;Continuous Integration&quot; report.</span></span>
<span class="line"><span>[INFO] Generating &quot;Source Repository&quot; report.</span></span>
<span class="line"><span>[INFO] Generating &quot;Project License&quot; report.</span></span>
<span class="line"><span>[INFO] Generating &quot;Mailing Lists&quot; report.</span></span>
<span class="line"><span>[INFO] Generating &quot;Plugin Management&quot; report.</span></span>
<span class="line"><span>[INFO] Generating &quot;Project Summary&quot; report.</span></span>
<span class="line"><span>[INFO] -------------------------------------------------------------------</span></span>
<span class="line"><span>[INFO] BUILD SUCCESSFUL</span></span>
<span class="line"><span>[INFO] -------------------------------------------------------------------</span></span>
<span class="line"><span>[INFO] Total time: 16 seconds</span></span>
<span class="line"><span>[INFO] Finished at: Wed Jul 11 18:11:18 IST 2012</span></span>
<span class="line"><span>[INFO] Final Memory: 23M/148M</span></span>
<span class="line"><span>[INFO] -------------------------------------------------------------------</span></span></code></pre></div><p><img src="`+p+'" alt="img"></p><p>打开 C:\\MVN\\consumerBanking\\target\\site 文件夹。点击 index.html 就可以看到文档了。</p><p><img src="'+i+'" alt="img"></p><p>Maven 使用称作 Doxia 的文件处理引擎创建文档，它将多个源格式的文件转换为一个共通的文档模型。要编写工程文档，你可以使用以下能够被 Doxia 解析的几种常用格式来编写。</p><table tabindex="0"><thead><tr><th style="text-align:left;">格式名称</th><th style="text-align:left;">描述</th><th style="text-align:left;">引用</th></tr></thead><tbody><tr><td style="text-align:left;">XDoc</td><td style="text-align:left;">Maven 1.x 版本的文档格式</td><td style="text-align:left;"><a href="http://jakarta.apache.org/site/jakarta-site2.html" target="_blank" rel="noreferrer">http://jakarta.apache.org/site/jakarta-site2.html</a></td></tr><tr><td style="text-align:left;">FML</td><td style="text-align:left;">FAQ 文档格式</td><td style="text-align:left;"><a href="http://maven.apache.org/doxia/references/fml-format.html" target="_blank" rel="noreferrer">http://maven.apache.org/doxia/references/fml-format.html</a></td></tr><tr><td style="text-align:left;">XHTML</td><td style="text-align:left;">可扩展 HTML 格式</td><td style="text-align:left;"><a href="http://en.wikipedia.org/wiki/XHTML" target="_blank" rel="noreferrer">http://en.wikipedia.org/wiki/XHTML</a></td></tr></tbody></table>',11)]))}const f=n(l,[["render",r]]);export{m as __pageData,f as default};
