# iLang (I Language) — 跨平台人机通信标准协议

**🌐 语言:** [English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Português](README.pt.md) | [Русский](README.ru.md) | [العربية](README.ar.md)

---

正如HTTP标准化了网页通信，SQL标准化了数据库查询，**iLang标准化了人类与AI的对话方式**。一个开放协议，已在ChatGPT、Claude、Gemini、DeepSeek、Kimi、Qwen、GLM上测试。

iLang 是首个将希腊数学符号正式定义为 AI 间通信原语动词的协议，也是首个将 AI 判断力定义为可计算向量空间的协议（11维度，4公理，模糊数学基础）。

`::STATE{@PROTOCOL, version:5.0, status:public_preview, genesis:2026-03-04}`

**官网:** [ilang.ai](https://ilang.ai)
**研究:** [research.ilang.ai](https://research.ilang.ai)
**AI See:** [i.ilang.ai](https://i.ilang.ai)

## iLang能做什么

| 能力 | 说明 |
|------|------|
| **压缩** | 提示词减少 7% 到 68%，取决于原文有多啰嗦。token更少，成本更低 |
| **知无不答** | AI直接、完整回答，不回避，不加免责声明 |
| **保护隐私** | 压缩后发送更少数据，天然减少信息暴露 |
| **跨平台** | 同一条指令已在ChatGPT、Claude、Gemini、DeepSeek、Kimi、Qwen、GLM上测试 |
| **链式指令** | `[VERB]=>[VERB]=>[OUT]` 一行构建多步工作流 |

## 30秒上手

复制官网 [ilang.ai](https://ilang.ai) 的协议头，粘贴到AI对话框，AI回复5项能力列表即握手完成。

## 已测试平台

ChatGPT ✅ | Claude ✅ | Gemini ✅ | DeepSeek ✅ | Kimi ✅ | Qwen ✅ | GLM ✅

## 压缩前后对比

**同一条六步请求**：日常写法 169 token → iLang 链 54 token，减少 68%；精简写法 58 token → 54 token，减少 7%（tiktoken cl100k_base 实测，两段原文见 [ilang.ai/prompt-compression/](https://ilang.ai/prompt-compression/)）

**压缩前**：Go to this website, extract all the text content from the page, clean it up and format it as readable Markdown. Remove any navigation menus, ads, or irrelevant content. Just give me the main article text.

**压缩后**：
```
[GET:@SRC|path=url]
=>[FMT|fmt=md]
=>[OUT]
```

## AI See — 让AI看网页

```
i.ilang.ai/https://任意网址
```
粘贴到AI对话框，AI即可阅读完整网页并回复。零配置，零成本。

## 常见问题

**需要学语法吗？** 不需要。跟AI说"帮我用iLang压缩这段话"即可。

**主流大模型都能用吗？** iLang 已在 ChatGPT、Claude、Gemini、DeepSeek、Kimi、Qwen、GLM 上测试，各模型结果见 [ilang.ai/benchmark/](https://ilang.ai/benchmark/)（2026年5月测试）。

**免费吗？** 是的。开放协议，MIT许可证。

## 链接

- [协议与工具](https://ilang.ai)
- [协议规范](https://ilang.ai/spec/)
- [完整字典](https://github.com/ilang-ai/ilang-dict)
- [研究论文](https://research.ilang.ai)
- [AI See](https://i.ilang.ai)

## 许可证

MIT License. © 2026 iLang Research, iLang Inc., Canada.
