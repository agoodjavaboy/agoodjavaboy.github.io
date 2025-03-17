import{_ as a,c as n,o as i,aF as p}from"./chunks/framework.CvyoTX4A.js";const e="/assets/9-project-structure.D7FcHKDk.jpg",o=JSON.parse('{"title":"7-创建Maven工程","description":"","frontmatter":{},"headers":[],"relativePath":"mds/1-👾后端开发/1-Java/3-Maven/7-创建Maven工程.md","filePath":"mds/1-👾后端开发/1-Java/3-Maven/7-创建Maven工程.md"}'),t={name:"mds/1-👾后端开发/1-Java/3-Maven/7-创建Maven工程.md"};function l(h,s,k,r,c,d){return i(),n("div",null,s[0]||(s[0]=[p(`<h1 id="_7-创建maven工程" tabindex="-1">7-创建Maven工程 <a class="header-anchor" href="#_7-创建maven工程" aria-label="Permalink to &quot;7-创建Maven工程&quot;">​</a></h1><h2 id="maven-创建工程" tabindex="-1">Maven - 创建工程 <a class="header-anchor" href="#maven-创建工程" aria-label="Permalink to &quot;Maven - 创建工程&quot;">​</a></h2><p>Maven 使用**原型（archetype）**插件创建工程。要创建一个简单的 Java 应用，我们将使用 maven-archetype-quickstart 插件。在下面的例子中，我们将在 C:\\MVN 文件夹下创建一个基于 maven 的 java 应用工程。</p><p>我们打开命令控制台，跳转到 C:\\MVN 目录，并执行下面的 <strong>mvn</strong> 命令。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>C:\\MVN&gt;mvn archetype:generate</span></span>
<span class="line"><span>-DgroupId=com.companyname.bank </span></span>
<span class="line"><span>-DartifactId=consumerBanking </span></span>
<span class="line"><span>-DarchetypeArtifactId=maven-archetype-quickstart </span></span>
<span class="line"><span>-DinteractiveMode=false</span></span></code></pre></div><p>Maven 将开始处理，并将创建完成的 java 应用工程结构。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>INFO] Scanning for projects...</span></span>
<span class="line"><span>[INFO] Searching repository for plugin with prefix: &#39;archetype&#39;.</span></span>
<span class="line"><span>[INFO] -------------------------------------------------------------------</span></span>
<span class="line"><span>[INFO] Building Maven Default Project</span></span>
<span class="line"><span>[INFO]    task-segment: [archetype:generate] (aggregator-style)</span></span>
<span class="line"><span>[INFO] -------------------------------------------------------------------</span></span>
<span class="line"><span>[INFO] Preparing archetype:generate</span></span>
<span class="line"><span>[INFO] No goals needed for project - skipping</span></span>
<span class="line"><span>[INFO] [archetype:generate {execution: default-cli}]</span></span>
<span class="line"><span>[INFO] Generating project in Batch mode</span></span>
<span class="line"><span>[INFO] -------------------------------------------------------------------</span></span>
<span class="line"><span>[INFO] Using following parameters for creating project </span></span>
<span class="line"><span> from Old (1.x) Archetype: maven-archetype-quickstart:1.0</span></span>
<span class="line"><span>[INFO] -------------------------------------------------------------------</span></span>
<span class="line"><span>[INFO] Parameter: groupId, Value: com.companyname.bank</span></span>
<span class="line"><span>[INFO] Parameter: packageName, Value: com.companyname.bank</span></span>
<span class="line"><span>[INFO] Parameter: package, Value: com.companyname.bank</span></span>
<span class="line"><span>[INFO] Parameter: artifactId, Value: consumerBanking</span></span>
<span class="line"><span>[INFO] Parameter: basedir, Value: C:\\MVN</span></span>
<span class="line"><span>[INFO] Parameter: version, Value: 1.0-SNAPSHOT</span></span>
<span class="line"><span>[INFO] project created from Old (1.x) Archetype in dir: C:\\MVN\\consumerBanking</span></span>
<span class="line"><span>[INFO] ------------------------------------------------------------------</span></span>
<span class="line"><span>[INFO] BUILD SUCCESSFUL</span></span>
<span class="line"><span>[INFO] ------------------------------------------------------------------</span></span>
<span class="line"><span>[INFO] Total time: 14 seconds</span></span>
<span class="line"><span>[INFO] Finished at: Tue Jul 10 15:38:58 IST 2012</span></span>
<span class="line"><span>[INFO] Final Memory: 21M/124M</span></span>
<span class="line"><span>[INFO] ------------------------------------------------------------------</span></span></code></pre></div><p>现在跳转到 C:/MVN 目录。有将看到一个名为 consumerBanking 的 java 应用工程（就像在 artifactId 中设定的一样）。Maven 使用一套标准的目录结构，就像这样：</p><p><img src="`+e+`" alt="Java application project structure"></p><p>使用上面的例子，我们可以知道下面几个关键概念：</p><table tabindex="0"><thead><tr><th style="text-align:left;">文件夹结构</th><th style="text-align:left;">描述</th></tr></thead><tbody><tr><td style="text-align:left;">consumerBanking</td><td style="text-align:left;">包含 src 文件夹和 pom.xml</td></tr><tr><td style="text-align:left;">src/main/java contains</td><td style="text-align:left;">java 代码文件在包结构下（com/companyName/bank）。</td></tr><tr><td style="text-align:left;">src/main/test contains</td><td style="text-align:left;">测试代码文件在包结构下（com/companyName/bank）。</td></tr><tr><td style="text-align:left;">src/main/resources</td><td style="text-align:left;">包含了 图片 / 属性 文件（在上面的例子中，我们需要手动创建这个结构）。</td></tr></tbody></table><p>Maven 也创建了一个简单的 Java 源文件和 Java 测试文件。打开 C:\\MVN\\consumerBanking\\src\\main\\java\\com\\companyname\\bank 文件夹，可以看到 App.java 文件。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">package</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> com.companyname.bank;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * Hello world!</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> */</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> App</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> static</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> main</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">( </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[] </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">args</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> )</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        System.out.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">println</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">( </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Hello World!&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> );</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>打开 C:\\MVN\\consumerBanking\\src\\test\\java\\com\\companyname\\bank 文件夹，可以看到 AppTest.java。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">package</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> com.companyname.bank;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> junit.framework.Test;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> junit.framework.TestCase;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> junit.framework.TestSuite;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * Unit test for simple App.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> */</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> AppTest</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> extends</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> TestCase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     * Create the test case</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     * </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@param</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> testName</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> name of the test case</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     */</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> AppTest</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">( String </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">testName</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> )</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        super</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">( testName );</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     * </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@return</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> the suite of tests being tested</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     */</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> static</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Test </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">suite</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> TestSuite</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">( AppTest.class );</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     * Rigourous Test :-)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     */</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> testApp</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        assertTrue</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">( </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> );</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>开发人员需要将他们的文件按照上面表格中提到的结构放置好，接下来 Maven 将会搞定所有构建相关的复杂任务。</p>`,16)]))}const E=a(t,[["render",l]]);export{o as __pageData,E as default};
