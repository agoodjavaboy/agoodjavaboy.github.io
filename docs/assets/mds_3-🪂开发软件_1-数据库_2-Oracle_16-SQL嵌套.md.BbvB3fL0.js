import{_ as i,c as a,o as n,aF as l}from"./chunks/framework.CvyoTX4A.js";const y=JSON.parse('{"title":"SQL嵌套","description":"","frontmatter":{},"headers":[],"relativePath":"mds/3-🪂开发软件/1-数据库/2-Oracle/16-SQL嵌套.md","filePath":"mds/3-🪂开发软件/1-数据库/2-Oracle/16-SQL嵌套.md"}'),h={name:"mds/3-🪂开发软件/1-数据库/2-Oracle/16-SQL嵌套.md"};function p(k,s,t,e,r,d){return n(),a("div",null,s[0]||(s[0]=[l(`<h1 id="sql嵌套" tabindex="-1">SQL嵌套 <a class="header-anchor" href="#sql嵌套" aria-label="Permalink to &quot;SQL嵌套&quot;">​</a></h1><h2 id="作为表使用" tabindex="-1">作为表使用 <a class="header-anchor" href="#作为表使用" aria-label="Permalink to &quot;作为表使用&quot;">​</a></h2><ul><li><p><strong>可以将查询的结果,当做一个临时表或者一个值或者一组值来使用.</strong></p></li><li><p>将一条SQL语句查询出来的表格形式的结果,当做一个表来使用.</p></li><li><p>使用<code>( )</code>将一个SQL语句包裹起来,像对待一个表一样去对待这条SQL语句.</p></li><li><p>括号中的表同样可以起别名,可以通过别名来定位到某列中.</p></li><li><p>括号中的表具有普通表名同样的作用.</p></li><li><p>可以将思路细化,根据多层不同的SQL嵌套来确保求结果的过程无误.</p></li></ul><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- 示例:查询工资在5000到10000之间,但是工资不是8200和9000的人,并且这些人要在2000年入职的名字.</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- 入职日期在2000年人的名字.</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">select</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> concat</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(first_name,last_name) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    -- 排除工资是8200和9000的人</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    select</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> from</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    (</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        --查询工资在5000-10000之间的人</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        select</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        from</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> employees </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        where</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> salary </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">between</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 5000</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> and</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 10000</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    )</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    where</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> salary </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">not</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> in</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8200</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">9000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">where</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> to_char(hire_date,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;yyyy&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;2000&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><h2 id="作为一组值使用" tabindex="-1">作为一组值使用 <a class="header-anchor" href="#作为一组值使用" aria-label="Permalink to &quot;作为一组值使用&quot;">​</a></h2><ul><li>如果要将查出来的结果作为一组值使用,必须是一列,可以是多个值.</li><li>一般情况下,作为一组值使用,都是在in上使用.</li></ul><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- 示例:查出工资排名前三的人们(注意,可能工资前三的不是三个人)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- 使用每个人的工资与前三工资进行比较</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">select</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> employees</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">where</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> salary </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    -- 求出全公司前三的工资</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    select</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> from</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    (</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        -- 求出所有的不重复的工资</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        select distinct</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> e</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">salary</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        from</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> employees e </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        order by</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> e</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">salary</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> desc</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    )</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    where</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> rownum</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><h2 id="作为一个值使用" tabindex="-1">作为一个值使用 <a class="header-anchor" href="#作为一个值使用" aria-label="Permalink to &quot;作为一个值使用&quot;">​</a></h2><ul><li>如果说作为一个值来使用,必须保证得到的结果是一列一个值.</li></ul><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- 示例:查询公司最高工资的人.</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- 得到拿最高工资的人</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">select</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> employees </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">where</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> salary </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    -- 得到全公司最高工资</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    select</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> max</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(salary) </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    from</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> employees      </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/*相比上面的程序,下面的程序只能得到一个用户,如果多个人都拿公司最高薪,也是显示一个人.*/</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">select</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> from</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> employees </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">where</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> rownum</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> order by</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> salary </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">desc</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div>`,10)]))}const g=i(h,[["render",p]]);export{y as __pageData,g as default};
