// 允许LLMs通过服务器采取行动。与资源不同，工具预期会执行计算并产生副作用
// 带参数的简单工具
server.registerTool(
  "calculate-bmi",
  {
    title: "BMI计算器",
    description: "计算身体质量指数",
    inputSchema: {
      weightKg: z.number(),
      heightM: z.number()
    }
  },
  async ({ weightKg, heightM }) => ({
    content: [{
      type: "text",
      text: String(weightKg / (heightM * heightM))
    }]
  })
);

// 异步工具与外部API调用
server.registerTool(
  "fetch-weather",
  {
    title: "天气查询器",
    description: "获取城市的天气数据",
    inputSchema: { city: z.string() }
  },
  async ({ city }) => {
    const response = await fetch(`https://api.weather.com/${city}`);
    const data = await response.text();
    return {
      content: [{ type: "text", text: data }]
    };
  }
);

// 返回ResourceLink的工具
server.registerTool(
  "list-files",
  {
    title: "列出文件",
    description: "列出项目文件",
    inputSchema: { pattern: z.string() }
  },
  async ({ pattern }) => ({
    content: [
      { type: "text", text: `找到匹配"${pattern}"的文件:` },
      // ResourceLink允许工具返回引用而无须嵌入完整内容
      {
        type: "resource_link",
        uri: "file:///project/README.md",
        name: "README.md",
        mimeType: "text/markdown",
        description: '自述文件'
      },
      {
        type: "resource_link",
        uri: "file:///project/src/index.ts",
        name: "index.ts",
        mimeType: "text/typescript",
        description: '索引文件'
      }
    ]
  })
);
