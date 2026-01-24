# md-card

纯前端 Markdown 分享卡片工具：实时预览、微信友好纯文本复制、高清 PNG 导出、多主题皮肤。

## 功能
- Markdown 渲染（markdown-it + DOMPurify）
- 一键复制微信友好纯文本排版
- 导出高清 PNG（2x/3x）
- 主题切换并持久化到 localStorage
- 可选水印开关

## 安装运行

```bash
npm install
npm run dev
```

构建生产包：

```bash
npm run build
```

本地预览：

```bash
npm run preview
```

## Cloudflare Pages 部署

1. 在 Cloudflare Pages 创建新项目并连接仓库。
2. 构建命令：`npm run build`
3. 构建输出目录：`dist`
4. 部署完成后即可通过 Pages 域名访问。

> 这是纯静态站点，无需后端配置。
