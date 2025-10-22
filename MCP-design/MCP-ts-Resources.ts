// 资源是向LLMs暴露数据的方式。它们类似于REST API中的GET端点——提供数据但不应执行重大计算或有副作用：

// 静态资源
server.registerResource(
  "config",
  "config://app",
  {
    title: "应用程序配置",
    description: "应用程序配置数据",
    mimeType: "text/plain"
  },
  async (uri) => ({
    contents: [{
      uri: uri.href,
      text: "App configuration here"
    }]
  })
);

// 动态资源与参数
server.registerResource(
  "user-profile",
  new ResourceTemplate("users://{userId}/profile", { list: undefined }),
  {
    title: "用户资料",
    description: "用户个人信息"
  },
  async (uri, { userId }) => ({
    contents: [{
      uri: uri.href,
      text: `Profile data for user ${userId}`
    }]
  })
);

// 带上下文感知补全的资源
server.registerResource(
  "repository",
  new ResourceTemplate("github://repos/{owner}/{repo}", {
    list: undefined,
    complete: {
      // 基于已解析参数提供智能补全
      repo: (value, context) => {
        if (context?.arguments?.["owner"] === "org1") {
          return ["project1", "project2", "project3"].filter(r => r.startsWith(value));
        }
        return ["default-repo"].filter(r => r.startsWith(value));
      }
    }
  }),
  {
    title: "GitHub仓库",
    description: "仓库信息"
  },
  async (uri, { owner, repo }) => ({
    contents: [{
      uri: uri.href,
      text: `Repository: ${owner}/${repo}`
    }]
  })
);
