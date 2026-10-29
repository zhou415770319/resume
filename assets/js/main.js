(function(){
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===== 终端打字效果 ===== */
  var TERM_LINES = [
    { p: "$", c: "whoami" },
    { p: ">", c: "周飞", k: true },
    { p: ">", c: "高级前端开发工程师 · 求职中", k: true },
    { p: "$", c: "cat intro.txt" },
    { p: ">", c: "8 年前端开发 · 4 年 iOS 开发", d: true },
    { p: ">", c: "擅长 Vue 全套技术栈 · 前端工程化", d: true },
    { p: ">", c: "大型数据中台 / 可视化项目设计能力", d: true },
    { p: ">", c: "0-1 架构设计 · 技术选型 · 项目管理", d: true },
    { p: "$", c: "npm run contact" },
    { p: ">", c: "tel: 13552417395", b: true },
    { p: ">", c: "mail: zhou415770319@163.com", b: true },
    { p: "$", c: "_", cursor: true }
  ];
  var termBody = document.getElementById("termBody");
  function renderTermFull(){
    var html = "";
    TERM_LINES.forEach(function(l){
      var cls = l.k ? "k" : (l.d ? "d" : (l.b ? "b" : ""));
      html += '<div class="term-line"><span class="p">' + l.p + '</span> <span class="' + cls + '">' + l.c + "</span></div>";
    });
    html += '<div class="term-line"><span class="p">$</span> <span class="c">_</span><span class="term-cursor"></span></div>';
    termBody.innerHTML = html;
  }
  function renderTermAnimated(){
    termBody.innerHTML = "";
    var idx = 0, lineIdx = 0;
    var cursorLine = null;
    function tick(){
      if (lineIdx >= TERM_LINES.length) {
        var last = document.createElement("div");
        last.className = "term-line";
        last.innerHTML = '<span class="p">$</span> <span class="c">_</span><span class="term-cursor"></span>';
        termBody.appendChild(last);
        return;
      }
      var l = TERM_LINES[lineIdx];
      var cls = l.k ? "k" : (l.d ? "d" : (l.b ? "b" : ""));
      var line = document.createElement("div");
      line.className = "term-line";
      line.innerHTML = '<span class="p">' + l.p + '</span> <span class="' + cls + '">' + l.c + "</span>";
      if (l.cursor) line.innerHTML = '<span class="p">$</span> <span class="c">_</span><span class="term-cursor"></span>';
      termBody.appendChild(line);
      lineIdx++;
      var delay = l.p === "$" ? 340 : (l.cursor ? 140 : 260);
      setTimeout(tick, delay);
    }
    tick();
  }
  if (reduceMotion) { renderTermFull(); } else { renderTermAnimated(); }

  /* ===== 导航滚动高亮 + 顶栏背景 ===== */
  var navLinks = document.querySelectorAll("[data-nav]");
  var sections = [];
  ["about","skills","projects","side-projects","experience","gallery"].forEach(function(id){
    var el = document.getElementById(id);
    if (el) sections.push(el);
  });
  function onScroll(){
    var y = window.scrollY || document.documentElement.scrollTop;
    var current = "";
    sections.forEach(function(sec){
      if (y + 90 >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach(function(a){
      if (a.dataset.nav === current) a.classList.add("active");
      else a.classList.remove("active");
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ===== 汉堡菜单 ===== */
  var burger = document.getElementById("navBurger");
  var linksWrap = document.getElementById("navLinks");
  burger.addEventListener("click", function(){
    var open = linksWrap.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  linksWrap.addEventListener("click", function(e){
    if (e.target.tagName === "A" && linksWrap.classList.contains("open")) {
      linksWrap.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  /* ===== 滚动揭示 ===== */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function(el){ el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function(el){ io.observe(el); });
  }

  /* ===== 工作经历折叠 ===== */
  document.querySelectorAll(".tl-fold").forEach(function(btn){
    btn.addEventListener("click", function(){
      var extra = btn.nextElementSibling;
      var show = extra.classList.toggle("show");
      btn.classList.toggle("open", show);
      btn.setAttribute("aria-expanded", show ? "true" : "false");
      btn.firstChild.textContent = show ? "收起职责详情 " : "展开职责详情 ";
    });
  });

  /* ===== 多图网格折叠 / 展开（超过两张才启用）===== */
  function setupFoldableGrids(selector){
    document.querySelectorAll(selector).forEach(function(grid){
      var shots = grid.querySelectorAll(".shot");
      if (shots.length <= 2) return;
      var wrap = document.createElement("div");
      wrap.className = "fold-wrap folded";
      grid.parentNode.insertBefore(wrap, grid);
      wrap.appendChild(grid);
      grid.classList.add("fold-body");

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "fold-toggle";
      btn.setAttribute("aria-expanded", "false");
      btn.innerHTML = '展开全部截图 <span class="fold-count">' + shots.length + ' 张</span> <span class="arr">▾</span>';
      wrap.appendChild(btn);

      btn.addEventListener("click", function(){
        var open = wrap.classList.toggle("open");
        wrap.classList.toggle("folded", !open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        btn.firstChild.textContent = open ? "收起截图 " : "展开全部截图 ";
      });
    });
  }
  setupFoldableGrids(".project-shots .shot-grid");
  setupFoldableGrids(".gallery-grid");

  /* ===== 灯箱 ===== */
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbTitle = document.getElementById("lbTitle");
  var lbCount = document.getElementById("lbCount");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");
  var lbClose = document.getElementById("lbClose");
  var lbList = [];
  var lbIndex = 0;

  function collectShots(btn){
    var group = btn.closest("[data-group]");
    if (!group) return [btn];
    var shots = Array.prototype.slice.call(group.querySelectorAll(".shot"));
    if (shots.indexOf(btn) === -1) shots = [btn];
    return shots;
  }
  function showLightbox(idx){
    if (!lbList.length) return;
    lbIndex = (idx + lbList.length) % lbList.length;
    var s = lbList[lbIndex];
    lbImg.src = s.dataset.src;
    lbImg.alt = s.dataset.name || "";
    lbTitle.textContent = s.dataset.name || "";
    lbCount.textContent = lbList.length > 1 ? (lbIndex + 1) + " / " + lbList.length : "";
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  document.addEventListener("click", function(e){
    var btn = e.target.closest(".shot");
    if (btn) {
      lbList = collectShots(btn);
      showLightbox(lbList.indexOf(btn));
    }
  });
  function closeLightbox(){
    lb.classList.remove("open");
    document.body.style.overflow = "";
    lbImg.src = "";
  }
  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", function(){ showLightbox(lbIndex - 1); });
  lbNext.addEventListener("click", function(){ showLightbox(lbIndex + 1); });
  document.addEventListener("keydown", function(e){
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showLightbox(lbIndex - 1);
    if (e.key === "ArrowRight") showLightbox(lbIndex + 1);
  });
  lb.addEventListener("click", function(e){
    if (e.target === lb) closeLightbox();
  });
})();
