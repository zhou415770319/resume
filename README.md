# 周飞 · 个人简历网站

高级前端开发工程师个人作品集简历站点，纯静态页面（原生 HTML / CSS / JavaScript，无框架、无构建步骤），托管于 GitHub Pages，绑定自定义域名 `feiyumdm.cn`。

## 目录结构

```
resume-site/
├── index.html              # 网站主页面（全部样式与脚本内联）
├── CNAME                   # GitHub Pages 自定义域名记录
├── README.md
├── .gitignore
└── assets/
    └── images/             # 项目截图（本地相对路径引用，不依赖外部 CDN）
```

## 本地预览

直接用浏览器打开 `index.html` 即可，无需安装依赖、无需启动服务。

## 技术说明

- 单文件页面：HTML、CSS、JS 全部内联在 `index.html`
- 图片均为本地资源，相对路径 `assets/images/...` 引用
- 响应式布局，适配桌面端与移动端
- 深色主题，品牌蓝 `#235FED`

## 部署

- 仓库地址：https://github.com/zhou415770319/resume
- 发布方式：GitHub Pages（`main` 分支根目录）
- 完整搭建与域名绑定步骤见 [DEPLOY.md](./DEPLOY.md)；日常更新只需 `git add` → `commit` → `push`，GitHub Pages 会自动重新发布。
