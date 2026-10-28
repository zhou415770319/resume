# 部署手册：GitHub Pages + 子域名 resume.feiyumdm.cn

> 本目录是纯静态站点（HTML / CSS / JS + 本地图片），无后端、无数据库。
> 托管方案：**GitHub Pages**（免费、自带 HTTPS、支持自定义域名）。
> 站点绑定子域名 `resume.feiyumdm.cn`；主域 `feiyumdm.cn` 与本站无关，保持原状即可。
> 域名 DNS 当前由 **Cloudflare** 管理（NS：henrik.ns.cloudflare.com / nelci.ns.cloudflare.com）。

---

## 一、整体流程总览

```
本地静态文件（已就绪）
   │
   ├─ 1. GitHub 创建公开仓库
   ├─ 2. 本地 git 初始化 → 提交 → 关联远程 → 推送
   ├─ 3. 仓库 Settings → Pages 开启（main 分支 / 根目录）
   ├─ 4. 仓库 Settings → Pages → Custom domain 填 resume.feiyumdm.cn
   ├─ 5. Cloudflare DNS：子域名 resume 一条 CNAME → zhou415770319.github.io
   └─ 6. 等待 DNS 传播与证书签发 → 勾选 Enforce HTTPS → 验证访问
```

- 预计耗时：操作本身 20 分钟内；DNS 传播与证书签发可能需要几分钟到 24 小时。
- 费用：GitHub Pages 免费；域名续费按你在域名注册商处的原有费用。

---

## 二、本地目录现状（已准备好，无需改动）

```
resume-site/
├── index.html              # 站点主页面（样式、脚本全部内联）
├── CNAME                   # 内容：resume.feiyumdm.cn（GitHub Pages 自定义域名记录）
├── README.md
├── .gitignore
└── assets/
    └── images/             # 15 张项目截图，相对路径引用，不依赖任何外部 CDN
```

> 说明：此前图片引用的临时 CDN 链接已全部失效（返回 404），现已改为本地 `assets/images/` 相对路径，推送到 GitHub 后图片可长期稳定访问。

---

## 三、阶段 A：创建 GitHub 仓库

### 方式 1：网页创建（推荐，最简单）

1. 登录 https://github.com
2. 右上角 **+** → **New repository**
3. 填写：
   - Repository name：建议 `feiyumdm-cv`（或 `resume`、`portfolio`）
   - 选择 **Public**（GitHub Pages 免费版要求公开仓库）
   - **不要**勾选 "Add a README"、不要选 .gitignore / license
4. 点击 **Create repository**
5. 创建完成后，页面显示远程地址，格式为：
   `https://github.com/zhou415770319/resume.git`

### 方式 2：gh CLI（当前本机 gh 未登录）

如需命令行创建，先在终端执行 `gh auth login` 完成浏览器授权，再运行：

```powershell
gh repo create resume --public --source=. --remote=origin --push
```

---

## 四、阶段 B：本地初始化 Git 并推送

在 `resume-site` 目录下依次执行（PowerShell）：

```powershell
cd "D:\zhoufei\100-工作\105-找工作\10500-总\resume-site"

git init
git add .
git commit -m "feat: 个人简历网站初版"
git branch -M main

# 将下面地址替换为你在阶段 A 创建的仓库地址
git remote add origin https://github.com/zhou415770319/resume.git

git push -u origin main
```

### 推送时的身份认证

- 首次推送会弹出 GitHub 登录授权窗口，按提示授权即可。
- 若要求输入密码：**不要填登录密码**，需要使用 GitHub Personal Access Token（PAT）：
  GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token，勾选 `repo` 权限，生成后复制作为密码粘贴。

### 提交后核对

```powershell
git status          # 应显示 nothing to commit, working tree clean
git remote -v       # 应显示 origin 指向你的仓库地址
```

---

## 五、阶段 C：开启 GitHub Pages

1. 打开仓库页面 → **Settings**（顶部标签栏，若看不到请展开下拉菜单）
2. 左侧菜单 **Code, planning, and automation** → **Pages**
3. **Build and deployment** → **Source**：选择 `Deploy from a branch`
4. **Branch**：选择 `main`，文件夹选 `/(root)`，点击 **Save**
5. 等待 1～2 分钟，页面上会出现提示：
   `Your site is live at https://zhou415770319.github.io/resume/`
6. 先用这个默认地址访问一次，确认页面、截图都正常显示。

---

## 六、阶段 D：在 GitHub 绑定子域名 resume.feiyumdm.cn

1. 仓库 → **Settings** → **Pages**
2. **Custom domain** 输入框填写：`resume.feiyumdm.cn`，点击 **Save**
3. GitHub 会自动在仓库根目录生成/更新 `CNAME` 文件（本目录已预置，内容一致，无需手动改）
4. 页面会显示域名检测状态：
   - 提示 **DNS check successful** 即绑定成功；
   - 若显示红色警告，先完成阶段 E 的 DNS 配置，再等待检测通过。
5. 域名检测通过后，勾选 **Enforce HTTPS**（证书签发后才可勾选，可能需要等待一段时间，最长 24 小时）。

---

## 七、阶段 E：Cloudflare DNS 配置（关键）

域名 NS 指向 Cloudflare，因此在 **Cloudflare 控制台**操作：

1. 登录 https://dash.cloudflare.com → 选择 `feiyumdm.cn`
2. 左侧 **DNS** → **Records**
3. 确认没有其他 `resume` 开头的旧记录；若有指向其他地址的同名记录，先删除。

### 7.1 子域名 CNAME —— 共 1 条

| Type | Name | Value | Proxy status |
| --- | --- | --- | --- |
| CNAME | `resume` | `zhou415770319.github.io` | DNS only（灰色云朵） |

> 注意：
> - CNAME 的值**只写 `zhou415770319.github.io`**，不要带仓库名 `resume`，不要写成 `*.pages.github.io`。
> - 子域名方案**不需要**为主域 `@` 添加任何 A 记录，也不需要配置 `www`。

### 7.2 代理状态说明（避免踩坑）

- 首次绑定期间，**云朵保持灰色（DNS only）**。Cloudflare 橙色代理（Proxied）会在 DNS 与 GitHub 之间多一层，容易导致证书校验失败、重定向循环。
- 等 `https://resume.feiyumdm.cn` 可以正常访问、HTTPS 正常后，如确需 Cloudflare CDN 加速，再把云朵切为橙色，并将 **SSL/TLS → Overview** 模式设为 **Full (Strict)**。
- 不要使用 `*.feiyumdm.cn` 通配符记录，存在域名被劫持风险。

---

## 八、阶段 F：验证部署是否成功

### 8.1 DNS 解析检查（PowerShell）

```powershell
# resume 子域应 CNAME 到 zhou415770319.github.io
Resolve-DnsName resume.feiyumdm.cn -Type CNAME

# 可继续查看最终 A 记录解析
Resolve-DnsName resume.feiyumdm.cn -Type A
```

### 8.2 浏览器访问验证

- `https://resume.feiyumdm.cn` —— 应直接打开简历站，地址栏显示安全锁。
- 逐屏滚动检查：项目截图、H5 页面、按钮、灯箱放大预览均正常。
- GitHub 仓库 Settings → Pages 中，Custom domain 下方应显示绿色提示 `DNS check successful`，并出现 `Enforce HTTPS` 勾选框。

---

## 九、后续更新网站内容

以后修改了 `index.html` 或图片后，在 `resume-site` 目录执行：

```powershell
git add .
git commit -m "update: 说明本次修改内容"
git push
```

GitHub Pages 会自动重新发布，通常 1～2 分钟内生效。无需重新配置域名。

---

## 十、常见问题排查

| 现象 | 原因与处理 |
| --- | --- |
| 域名打开 404 | DNS 尚未传播完成；或 GitHub Pages 未开启；等待几分钟后刷新。 |
| 图片仍然打不开 | 确认 `assets/images/` 目录及图片已 `git push` 到远程仓库；路径必须是相对路径 `assets/images/xxx.png`。 |
| 提示重定向循环 / HTTPS 证书错误 | Cloudflare 处于橙色代理状态。先改为 DNS only（灰云）；若已开代理，SSL/TLS 模式必须为 **Full (Strict)**。 |
| `Enforce HTTPS` 勾选框是灰色 | GitHub 尚未签发完证书。DNS 生效后等待几小时，选项会自动可用。 |
| 子域名无法访问 / 报 404 | 检查 CNAME 记录名是否为 `resume`、值是否为 `zhou415770319.github.io`（不带仓库名），记录类型必须是 CNAME。 |
| 仓库改了内容但线上没变 | 浏览器缓存：强制刷新（Ctrl+F5）；确认推送成功且 Pages 构建完成（仓库 Actions 无失败记录）。 |
| GitHub Pages 提示域名被占用 | 该域名可能曾被其他仓库绑定过：在 GitHub 设置页点 **Remove** 解除旧绑定后重新保存。 |

---

## 十一、关键参考来源

- GitHub 官方文档：[Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
