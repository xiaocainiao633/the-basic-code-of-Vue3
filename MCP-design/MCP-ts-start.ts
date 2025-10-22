// 接下来的几个文件：MCP-ts，介绍MCP Typescript SDK核心
// npm install @modelcontextprotocol/sdk进行安装
// 让我们创建一个简单的MCP服务器，暴露计算器工具和一些数据

import { MCPServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/transports/stdio.js';
import { z } from 'zod';

// 创建MCP服务器
const server = new MCPServer({
  name: "demo-server",
  version: "1.0.0"
});

// 添加加法工具
server.registerTool("add", 
  {
    title: "加法工具",
    description: "将两个数字相加",
    inputSchema: { a: z.number(), b: z.number() }
  },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a+b) }]
  })
)

// 添加动态问候资源
server.registerResource(
  "greeting",
  new ResourceTemplate("greeting://{name}", {list: undefined}),
  {
    title: "问候资源",
    description: "动态问候生成器"
  },
  async (uri, { name }) => ({
    contents: [{
      uri: uri.href,
      text: `你好，${name}!`
    }]
  })
)

// 连接到标准输入输出
const transport = new StdioServerTransport();
await server.connect(transport);


// 请求任何参数的补全
const result = await client.complete({
  ref: {
    type: "ref/prompt",  // 或 "ref/resource"
    name: "example"      // 或 uri: "template://..."
  },
  argument: {
    name: "argumentName",
    value: "partial"     // 用户已输入的内容
  },
  context: {             // 可选：包含已解析的先前参数
    arguments: {
      previousArg: "value"
    }
  }
});

// 使用registerTool（推荐）
server.registerTool("my_tool", {
  title: "我的工具",              // 优先显示
  annotations: {
    title: "注解标题"    // 若title存在则忽略
  }
}, handler);

// 使用带注解的旧版API
server.tool("my_tool", "描述", {
  title: "注解标题"      // 此处生效
}, handler);

// https://juejin.cn/post/7517532575008866367