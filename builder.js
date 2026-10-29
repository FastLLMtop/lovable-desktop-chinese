const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const WORKDIR = "/Users/p/.gemini/antigravity/scratch/lovable-i18n";
const EXTRACTED_DIR = path.join(WORKDIR, "extracted");
const OUTPUT_PACK_DIR = path.join(WORKDIR, "chinese-pack");

console.log("[1/5] 开始汉化处理...");

// 1. 读取 main.js
const mainJsPath = path.join(EXTRACTED_DIR, "dist", "main.js");
let mainJs = fs.readFileSync(mainJsPath, "utf8");

// 替换原生菜单和弹窗文本
const mainReplacements = [
  // App Menu
  ['label:"Check for Updates..."', 'label:"检查更新..."'],
  ['label:"Preferences\\u2026"', 'label:"偏好设置…"'],
  ['{role:"about"}', '{role:"about",label:"关于 Lovable"}'],
  ['{role:"services"}', '{role:"services",label:"服务"}'],
  ['{role:"hide"}', '{role:"hide",label:"隐藏 Lovable"}'],
  ['{role:"hideOthers"}', '{role:"hideOthers",label:"隐藏其他"}'],
  ['{role:"unhide"}', '{role:"unhide",label:"显示全部"}'],
  ['{role:"quit"}', '{role:"quit",label:"退出 Lovable"}'],

  // File Menu
  ['label:"File"', 'label:"文件"'],
  ['label:"Open Current Page in Browser"', 'label:"在浏览器中打开当前页面"'],
  ['label:"New Chat"', 'label:"新建对话"'],
  ['label:"Close Window"', 'label:"关闭窗口"'],

  // Edit Menu
  ['label:"Edit"', 'label:"编辑"'],
  ['{role:"undo"}', '{role:"undo",label:"撤销"}'],
  ['{role:"redo"}', '{role:"redo",label:"重做"}'],
  ['{role:"cut"}', '{role:"cut",label:"剪切"}'],
  ['{role:"copy"}', '{role:"copy",label:"复制"}'],
  ['{role:"paste"}', '{role:"paste",label:"粘贴"}'],
  ['{role:"selectAll"}', '{role:"selectAll",label:"全选"}'],
  ['label:"Copy Last Dictation"', 'label:"复制上次听写"'],
  ['label:"Paste Last Dictation"', 'label:"粘贴上次听写"'],
  ['label:"Find"', 'label:"查找"'],
  ['label:"Find Next"', 'label:"查找下一个"'],
  ['label:"Find Previous"', 'label:"查找上一个"'],

  // View Menu
  ['label:"View"', 'label:"视图"'],
  ['label:"Back"', 'label:"后退"'],
  ['label:"Forward"', 'label:"前进"'],
  ['label:"Reload"', 'label:"重新加载"'],
  ['label:"Force Reload"', 'label:"强制重新加载"'],
  ['label:"Clear Cache and Reload"', 'label:"清除缓存并重新加载"'],
  ['label:"Zoom In"', 'label:"放大"'],
  ['label:"Zoom Out"', 'label:"缩小"'],
  ['label:"Actual Size"', 'label:"实际大小"'],
  ['label:"Toggle Full Screen"', 'label:"切换全屏"'],
  ['label:"Toggle Developer Tools"', 'label:"切换开发者工具"'],
  ['label:"Next Chat"', 'label:"下一个对话"'],
  ['label:"Previous Chat"', 'label:"上一个对话"'],
  ['label:o===9?"Last Chat":`Chat ${o}`', 'label:o===9?"最后一个对话":`对话 ${o}`'],

  // Window Menu
  ['label:"Window"', 'label:"窗口"'],
  ['{role:"minimize"}', '{role:"minimize",label:"最小化"}'],
  ['{role:"zoom"}', '{role:"zoom",label:"缩放"}'],
  ['{role:"front"}', '{role:"front",label:"前置全部窗口"}'],
  ['{role:"window"}', '{role:"window",label:"窗口"}'],

  // Help Menu
  ['label:"Help"', 'label:"帮助"'],
  ['label:"Lovable Support"', 'label:"Lovable 官方技术支持"'],
  ['label:"Lovable Docs"', 'label:"Lovable 官方文档"'],
  ['label:"System Status"', 'label:"系统运行状态"'],

  // Dialogs
  ['buttons:t.highRisk?["Deny","Allow"]:["Deny","Allow","Always Allow"]', 'buttons:t.highRisk?["拒绝","允许"]:["拒绝","允许","始终允许"]'],
  ['title:"Allow local MCP server"', 'title:"允许本地 MCP 服务"'],
  ['message:"Leave this page?",detail:"Changes you made may not be saved.",buttons:["Leave","Stay"]', 'message:"确定离开此页面？",detail:"未保存的修改可能会丢失。",buttons:["离开","留下"]']
];

let mainReplacedCount = 0;
for (const [from, to] of mainReplacements) {
  if (mainJs.includes(from)) {
    mainJs = mainJs.replace(from, to);
    mainReplacedCount++;
  }
}
fs.writeFileSync(mainJsPath, mainJs, "utf8");
console.log(`[2/5] main.js 替换完成，匹配替换 ${mainReplacedCount}/${mainReplacements.length} 项`);

// 2. 注入 preload.js i18n 引擎
const preloadJsPath = path.join(EXTRACTED_DIR, "dist", "preload.js");
let preloadJs = fs.readFileSync(preloadJsPath, "utf8");

const i18nEngineCode = `
/* ================= Lovable Chinese Localization Engine ================= */
(function() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const exactDict = {
    // 基础导航与边栏
    "New": "新建对话",
    "Search": "搜索",
    "Search...": "搜索...",
    "Projects": "项目",
    "Connectors": "连接器",
    "Recent chats": "最近对话",
    "No chats yet": "暂无对话",
    "Upgrade to Pro": "升级到 Pro",
    "Unlock more features": "解锁更多高级特性",
    "All projects": "所有项目",
    "Recent": "最近",
    "Settings": "设置",
    "Account": "账户",
    "Preferences": "偏好设置",
    "偏好设置": "偏好设置",
    "Workspace": "工作区",
    "Workspaces": "工作区",
    "Create workspace": "创建工作区",
    "Billing": "账单与订阅",
    "Usage": "用量统计",
    "Members": "成员",
    "Go back": "返回",
    "< Go back": "< 返回",

    // 项目筛选下拉菜单 (Projects Filter Menu)
    "Recents": "最近项目",
    "Recent projects": "最近项目",
    "No recent projects": "暂无最近项目",
    "Created by me": "我创建的项目",
    "Shared with me": "与我共享的项目",
    "See all projects": "查看所有项目",
    "Published": "已发布",
    "Starred": "已加星标",
    "Archived": "已归档",

    // 输入框 '+' 动作菜单 (Chat Input Action Menu)
    "Import project to Lovable": "导入项目到 Lovable",
    "Attach": "添加附件",
    "Add context": "添加上下文",
    "Databases": "数据库",
    "Database": "数据库",
    "Knowledge": "知识库",

    // 工作区切换下拉菜单 (Workspace Switcher Menu)
    "Free Plan": "免费版套餐",
    "Pro Plan": "Pro 专业版套餐",
    "1 member": "1 位成员",
    "Invite members": "邀请成员",
    "Invite member": "邀请成员",
    "Credits": "可用额度",
    "Daily credits reset at midnight UTC": "每日额度于 UTC 午夜重置",
    "New workspace": "新建工作区",
    "Turn Pro": "升级为 Pro 专业版",
    "Upgrade": "立即升级",

    // 用户下拉菜单 (Avatar Menu)
    "Profile": "个人资料",
    "Inbox": "收件箱",
    "Account settings": "账户设置",
    "Community": "开发者社区",
    "Appearance": "外观",
    "Support": "技术支持",
    "Documentation": "官方文档",
    "Sign out": "退出登录",
    "Log out": "退出登录",
    "Logout": "退出登录",
    "Sign in": "登录",

    // 设置中心侧边栏分类
    "Plans & credit usage": "套餐与额度用量",
    "Credit usage": "额度用量",
    "Slack": "Slack 协同",
    "Access": "访问控制",
    "People": "成员管理",
    "Groups": "用户组",
    "Identity": "身份认证",
    "API keys & OAuth": "API 密钥与 OAuth",
    "API keys": "API 密钥",
    "OAuth": "OAuth 授权",
    "Customization": "自定义配置",
    "Instructions": "指令规范",
    "Skills": "技能 (Skills)",
    "Templates": "项目模板",
    "Announcements": "公告通知",
    "Events & Hooks": "事件与 Webhooks",
    "Connector settings": "连接器设置",
    "Build & deploy": "构建与部署",
    "Git": "Git 仓库",
    "Build secrets": "构建密钥",
    "Managed registry": "托管镜像源",
    "MCP server": "MCP 服务端",
    "Workspace domains": "工作区域名",
    "Security": "安全",
    "Privacy & security": "隐私与安全",
    "Security center": "安全中心",
    "Audit logs": "审计日志",
    "Data exports": "数据导出",
    "Devices & apps": "设备与应用",
    "This Mac": "当前 Mac 设备",
    "Workspace settings": "工作区设置",

    // 当前 Mac 设备 (This Mac) 页面
    "Device": "设备信息",
    "Desktop app": "桌面客户端",
    "Connected local-tool provider": "已连接本地工具提供程序",
    "Local MCPs": "本地 MCP",
    "Available while this desktop app is connected": "仅在当前桌面客户端保持连接时可用",
    "0 servers": "0 个服务",
    "Not set up": "未设置",
    "Local MCP servers": "本地 MCP 服务端",
    "Live tool status from this desktop app. Available only while this device is connected.": "来自此桌面客户端的实时工具状态。仅在当前设备连接时可用。",
    "Add custom MCP": "添加自定义 MCP",
    "Not enabled": "未启用",
    "Figma desktop": "Figma 桌面版",
    "Paper desktop": "Paper 桌面版",
    "Design tools from Figma Desktop": "来自 Figma 桌面版的设计工具",
    "Design tools from Paper Desktop": "来自 Paper 桌面版的设计工具",

    // 设备与应用 (Devices & apps) 页面
    "Connect messaging apps to chat with Lovable about projects in this workspace. Other workspaces have their own connections.": "关联即时通讯应用，即可在其中与 Lovable 针对此工作区的项目进行对话。其他工作区拥有独立的连接配置。",
    "Telegram": "Telegram",
    "Connect to Telegram": "连接 Telegram",
    "Set up": "去配置",
    "On your desktop": "在你的电脑桌面",
    "Fast, light, with local MCP support.": "极速轻量，深度集成原生本地 MCP 支持。",
    "Lovable for macOS": "Lovable macOS 版",
    "Organize your projects with tabs and leverage local MCPs in your workflows.": "借助多标签页管理你的所有项目，并在开发流程中无缝调用本地 MCP 服务。",
    "Download for macOS (Apple Silicon)": "下载 macOS 版 (Apple 芯片)",
    "All downloads": "所有平台安装包",
    "Pick the installer that matches your machine.": "选择适合你的电脑系统的安装程序。",
    "macOS (Apple Silicon)": "macOS (Apple 芯片)",
    "macOS (Intel)": "macOS (Intel 芯片)",
    "Windows": "Windows",
    "Not connected": "未连接",
    "Connected": "已连接",

    // 安全 (Security) 页面
    "Protect access to your account.": "保护你的账户访问安全。",
    "Re-authentication required": "需要重新认证身份",
    "Reauthenticate": "重新认证",
    "For security, please re-authenticate to manage two-factor settings.": "出于安全考虑，请重新验证密码以管理双重身份验证 (2FA) 设置。",
    "Log out everywhere": "退出所有设备登录",
    "End your sessions on all devices and browsers, including this one.": "注销所有设备与浏览器中的登录会话（包括当前客户端）。",

    // 偏好设置 (Preferences) 页面
    "Personalize how Lovable works for you.": "自定义 Lovable 为你服务的工作方式。",
    "Agent permissions": "智能体权限管理",
    "Manage": "管理",
    "Choose what the agent may do without asking you first.": "设置智能体在不向你确认的情况下允许直接执行的操作。",
    "Language": "界面语言",
    "Choose the language Lovable uses for your account.": "选择 Lovable 在你账户中使用的界面语言。",
    "English": "英语 (English)",
    "Default project region": "默认项目数据所在区域",
    "Where your new projects store their data.": "设置你新建项目存储数据的地理区域。",
    "Closest to me": "离我最近 (自动)",
    "Chat suggestions": "对话建议与引导",
    "Show helpful suggestions in the chat interface to enhance your experience.": "在对话界面中显示实用的输入建议，提升交互体验。",
    "Tips & tricks": "实用技巧与提示",
    "Show tips in chat and on the preview while Lovable works.": "在 Lovable 生成与构建期间，在对话区和预览区展示实用技巧。",
    "Message queue": "消息排队模式",
    "Messages you send while the agent is working wait in a queue. Disable this setting to send new messages straight into the running task.": "智能体执行任务时，你发送的新消息将进入队列等待。关闭此项可将新消息直接插入正在运行的任务。",
    "Long-running credit check-ins": "长任务额度提醒",
    "Check in when a single message reaches your preset credit threshold to avoid unexpected costs during large tasks.": "当单条对话消耗达到你预设的额度阈值时主动暂停确认，防止大型复杂任务产生意外支出。",
    "Check-in level (credits)": "提醒阈值 (额度 Credits)",
    "Notification threshold, not a strict cap. The run might go slightly over.": "此值为提醒阈值，而非硬性上限。实际运行消耗可能会略微超出。",
    "Generation complete sound": "生成完成提示音",
    "Plays a satisfying sound notification when a generation is finished.": "在 AI 生成与构建完成时播放提示音。",
    "First generation": "仅初次生成完成时",
    "Every generation": "每次生成完成时",
    "Never": "从不播放",

    // 账户设置 (Account settings) 页面
    "Showcase skills": "技能展示",
    "Beta": "公测",
    "No skills yet. Build apps that get real usage to unlock skills to showcase on your LinkedIn profile.": "暂无展示技能。构建拥有真实用户的应用以解锁可在 LinkedIn 上展示的技能。",
    "Learn how to unlock skills": "了解如何解锁技能",
    "Control how you appear on Lovable.": "管理你在 Lovable 中的公开展示信息。",
    "Change name, location, avatar, and banner on your profile.": "修改个人主页中的姓名、所在地、头像及横幅。",
    "Open profile": "打开个人主页",
    "Username": "用户名",
    "Your public identifier and profile URL.": "你的公开唯一标识及个人主页链接。",
    "Email": "电子邮箱",
    "Your email address associated with your account.": "关联至你账户的电子邮箱地址。",
    "Profile visibility": "个人资料公开度",
    "Control who can see your public profile.": "控制谁可以查看你的公开主页。",
    "Public": "公开",
    "Private": "私密",
    "Login methods": "登录方式",
    "Manage accounts linked for login.": "管理用于登录的关联账户。",
    "Password": "密码",
    "Primary": "主要",
    "Link company account": "关联企业账户",
    "Use your organization's single sign-on.": "使用你所在企业的单点登录 (SSO)。",
    "Link account": "关联账户",
    "Danger zone": "危险区域",
    "Delete account": "注销账户",
    "Permanently delete your account and all associated data.": "永久删除你的账户及所有关联数据。",

    // 首页与创建
    "What's the vision": "今天有什么构想",
    "What's the vision?": "今天有什么构想？",
    "Build": "构建",
    "Chat": "对话",
    "Import a project": "导入项目",
    "Import a website": "导入网站",
    "Import project": "导入项目",
    "Import website": "导入网站",
    "Import from GitHub": "从 GitHub 导入",
    "Connect a repository": "连接代码仓库",

    // 输入框占位符提示
    "Ask Lovable to build a landing page for my": "让 Lovable 帮我构建一个落地页...",
    "Ask Lovable to build": "让 Lovable 构建",
    "Ask Lovable to create": "让 Lovable 创建",
    "Ask Lovable anything...": "向 Lovable 输入你的需求...",
    "Ask anything...": "输入任何需求...",
    "Type a message...": "输入消息...",

    // 常用按钮与操作
    "Preview": "预览",
    "Code": "代码",
    "Changes": "代码变更",
    "Files": "文件",
    "Console": "控制台",
    "Terminal": "终端",
    "Publish": "发布",
    "Published": "已发布",
    "Publishing...": "发布中...",
    "Deploy": "部署",
    "Deployed": "已部署",
    "Deploying...": "部署中...",
    "Share": "分享",
    "Export": "导出",
    "Download": "下载",
    "Download ZIP": "下载 ZIP",
    "Download project": "下载项目",
    "Open in Editor": "在编辑器中打开",
    "Open in browser": "在浏览器中打开",
    "Open in VS Code": "在 VS Code 中打开",
    "Fork": "分叉 (Fork)",
    "Fork project": "分叉项目",
    "History": "历史记录",
    "Version history": "版本历史",
    "Revert": "回退版本",
    "Restore": "恢复",
    "Restore version": "恢复到此版本",
    "Save": "保存",
    "Saved": "已保存",
    "Saving...": "正在保存...",
    "Save changes": "保存更改",
    "Cancel": "取消",
    "Confirm": "确认",
    "Delete": "删除",
    "Delete project": "删除项目",
    "Rename": "重命名",
    "Rename project": "重命名项目",
    "Close": "关闭",
    "Done": "完成",
    "Back": "返回",
    "Next": "下一步",
    "Retry": "重试",
    "Copy": "复制",
    "Copied!": "已复制！",
    "Copied to clipboard": "已复制到剪贴板",
    "Send": "发送",
    "Stop": "停止",
    "Stop generating": "停止生成",
    "Generating...": "正在生成...",
    "Thinking...": "思考中...",

    // 通用操作
    "Theme": "主题",
    "Light": "浅色",
    "Dark": "深色",
    "System": "跟随系统",
    "General": "通用",
    "Shortcuts": "快捷键",
    "Feedback": "用户反馈",
    "Are you sure?": "确定要执行吗？",
    "This action cannot be undone.": "此操作无法撤销。"
  };

  const regexRules = [
    [/^What's the vision,\\s*(.+)\\?$/i, "今天有什么构想，$1？"],
    [/^Free Plan\\s*[•·]\\s*(\\d+)\\s+members?$/i, "免费版 • $1 位成员"],
    [/^(\\d+)\\s+members?$/i, "$1 位成员"],
    [/^(\\d+)\\s+left$/i, "剩余 $1 点"],
    [/^Messaging in\\s+(.+)$/i, "$1 中的即时通讯"],
    [/^Link Telegram to chat with Lovable about (.+) projects via DMs\\.?$/i, "关联 Telegram，以便通过私信与 Lovable 就 $1 的项目展开对话。"],
    [/^Connect a Slack workspace so your team can chat with Lovable about (.+) via @menti.*$/i, "连接 Slack 工作区，以便团队可以通过 @提及 与 Lovable 就 $1 展开协作。"],
    [/^(.+)'s Lovable$/i, "$1 的 Lovable"],
    [/^Ask Lovable to (create|build|creat)\\s*(.*)$/i, "让 Lovable $1 $2"],
    [/^Ask Lovable\\s*(.*)$/i, "向 Lovable 提出：$1"],
    [/^(\\d+)\\s+chats?$/i, "$1 个对话"],
    [/^(\\d+)\\s+servers?$/i, "$1 个服务"],
    [/^Last edited\\s+(.+)$/i, "最后编辑于 $1"],
    [/^Created\\s+(?!by me)(.+)$/i, "创建于 $1"],
    [/^Updated\\s+(.+)$/i, "更新于 $1"]
  ];

  function translateText(text) {
    if (!text || typeof text !== "string") return null;
    const trimmed = text.trim();
    if (!trimmed) return null;

    // 1. 精确匹配 (优先完整短语)
    if (exactDict[trimmed]) {
      return text.replace(trimmed, exactDict[trimmed]);
    }

    // 2. 去除尾随标点（如冒号、省略号、箭头、问号）的弹性匹配
    const clean = trimmed.replace(/[:：…\\.\\->→]*$/, "").trim();
    if (clean && clean !== trimmed && exactDict[clean]) {
      const suffix = trimmed.slice(clean.length);
      const trans = exactDict[clean] + (suffix.includes("->") || suffix.includes("→") ? " →" : suffix);
      return text.replace(trimmed, trans);
    }

    // 3. 正则动态匹配
    for (let i = 0; i < regexRules.length; i++) {
      const [re, rep] = regexRules[i];
      if (re.test(trimmed)) {
        let res = trimmed.replace(re, rep);
        res = res.replace("create", "创建").replace("build", "构建").replace("creat", "创建");
        return text.replace(trimmed, res);
      }
    }
    return null;
  }

  const ignoreTags = new Set(["SCRIPT", "STYLE", "PRE", "CODE", "TEXTAREA"]);

  function shouldIgnore(node) {
    if (!node) return true;
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (ignoreTags.has(node.tagName)) return true;
      if (node.isContentEditable) return true;
      if (node.classList && (
        node.classList.contains("monaco-editor") ||
        node.classList.contains("cm-editor") ||
        node.classList.contains("hljs")
      )) return true;
    }
    const parent = node.parentElement;
    if (parent) {
      if (ignoreTags.has(parent.tagName)) return true;
      if (parent.isContentEditable) return true;
      if (parent.closest && parent.closest("pre, code, textarea, .monaco-editor, [contenteditable='true']")) return true;
    }
    return false;
  }

  function walkAndTranslate(root) {
    if (!root || shouldIgnore(root)) return;

    if (root.nodeType === Node.ELEMENT_NODE) {
      if (root.hasAttribute && root.hasAttribute("placeholder")) {
        const ph = root.getAttribute("placeholder");
        const trans = translateText(ph);
        if (trans && trans !== ph) root.setAttribute("placeholder", trans);
      }
      if (root.hasAttribute && root.hasAttribute("title")) {
        const title = root.getAttribute("title");
        const trans = translateText(title);
        if (trans && trans !== title) root.setAttribute("title", trans);
      }
      if (root.hasAttribute && root.hasAttribute("aria-label")) {
        const aria = root.getAttribute("aria-label");
        const trans = translateText(aria);
        if (trans && trans !== aria) root.setAttribute("aria-label", trans);
      }
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (shouldIgnore(node)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let curr = walker.nextNode();
    while (curr) {
      const trans = translateText(curr.nodeValue);
      if (trans && trans !== curr.nodeValue) {
        curr.nodeValue = trans;
      }
      curr = walker.nextNode();
    }
  }

  let isTranslating = false;
  function handleMutations(mutations) {
    if (isTranslating) return;
    isTranslating = true;
    try {
      for (let i = 0; i < mutations.length; i++) {
        const m = mutations[i];
        if (m.type === "childList") {
          for (let j = 0; j < m.addedNodes.length; j++) {
            walkAndTranslate(m.addedNodes[j]);
          }
        } else if (m.type === "characterData") {
          if (!shouldIgnore(m.target)) {
            const trans = translateText(m.target.nodeValue);
            if (trans && trans !== m.target.nodeValue) {
              m.target.nodeValue = trans;
            }
          }
        } else if (m.type === "attributes") {
          if (!shouldIgnore(m.target) && (m.attributeName === "placeholder" || m.attributeName === "title")) {
            const val = m.target.getAttribute(m.attributeName);
            const trans = translateText(val);
            if (trans && trans !== val) {
              m.target.setAttribute(m.attributeName, trans);
            }
          }
        }
      }
    } catch (e) {
      // 静默处理避免中断主业务渲染
    } finally {
      isTranslating = false;
    }
  }

  function initObserver() {
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", initObserver);
      return;
    }
    walkAndTranslate(document.body);
    const observer = new MutationObserver(handleMutations);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label"]
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initObserver);
  } else {
    initObserver();
  }
})();
/* ================= End Lovable Chinese Localization ================= */
`;

preloadJs += "\n" + i18nEngineCode;
fs.writeFileSync(preloadJsPath, preloadJs, "utf8");
console.log("[3/5] preload.js 增强字典注入完成");

// 3. 语法自检验证
console.log("[4/5] 执行语法自检...");
execSync(`node -c "${mainJsPath}"`);
execSync(`node -c "${preloadJsPath}"`);
console.log("  语法自检全部通过！");

// 4. 打包输出
console.log("[5/5] 打包输出独立汉化包...");
fs.mkdirSync(OUTPUT_PACK_DIR, { recursive: true });

const targetAsar = path.join(OUTPUT_PACK_DIR, "app.asar");
execSync(`npx @electron/asar pack "${EXTRACTED_DIR}" "${targetAsar}"`);
console.log(`  成功生成汉化文件: ${targetAsar} (${(fs.statSync(targetAsar).size / (1024 * 1024)).toFixed(2)} MB)`);

console.log("全部构建任务完成！");
