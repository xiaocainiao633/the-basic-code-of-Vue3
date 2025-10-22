// Prompts 是可复用的模板，帮助 LLM 有效与服务器交互
import { completable } from "@modelcontextprotocol/sdk/server/completable.js";

// 注册代码审查提示
server.registerPrompt(
  "review-code",
  {
    title: "代码审查",
    description: "检查代码的最佳实践和潜在问题",
    argsSchema: { code: z.string() }
  },
  ({ code }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `请审查以下代码：\n\n${code}`
      }
    }]
  })
);

// 带上下文感知补全的提示
server.registerPrompt(
  "team-greeting",
  {
    title: "团队问候",
    description: "为团队成员生成问候语",
    argsSchema: {
      department: completable(z.string(), (value) => {
        // 部门建议
        return ["工程部", "销售部", "市场部", "支持部"].filter(d => d.startsWith(value));
      }),
      name: completable(z.string(), (value, context) => {
        // 基于所选部门的姓名建议
        const department = context?.arguments?.["department"];
        if (department === "工程部") {
          return ["爱丽丝", "鲍勃", "查理"].filter(n => n.startsWith(value));
        } else if (department === "销售部") {
          return ["大卫", "夏娃", "弗兰克"].filter(n => n.startsWith(value));
        } else if (department === "市场部") {
          return ["格蕾丝", "亨利", "艾里斯"].filter(n => n.startsWith(value));
        }
        return ["访客"].filter(n => n.startsWith(value));
      })
    }
  },
  ({ department, name }) => ({
    messages: [{
      role: "assistant",
      content: {
        type: "text",
        text: `你好 ${name}，欢迎加入${department}团队！`
      }
    }]
  })
);
