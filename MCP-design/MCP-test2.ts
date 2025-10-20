import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  {
    name: "file-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 注册工具:
server.setRequestHandler("tools/list", async () => {
  return {
    tools: [
      {
        name: "read_file",
        description: "读取文件内容",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "文件路径",
            },
          },
          required: ["path"],
        },
      },
    ],
  };
});

// 处理工具调用
server.setRequestHandler("tools/call", async (request) => {
  if(request.params.name === "read_file") {
    const fs = await import("fs/promises");
    const content = await fs.readFile(request.params.path, "utf-8");
    return {
      content: [
        {
          type: "text",
          text: content,
        }
      ]
    }
  }
  throw new Error("未知工具");
})

// 启动服务器
const transport = new StdioServerTransport();
await server.connect(transport);