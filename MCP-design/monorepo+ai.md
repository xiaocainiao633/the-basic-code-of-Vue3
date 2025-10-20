# MCP-design:

一个简单的总结文档:介绍 monorepo 架构大致流程,以及在此架构下调用 Ai 的小例子,
该目录下先记录一下 MCP,vue3 的源码后续整体更新

## monorepo 架构介绍:

另一个项目中用到了 monorepo,在这里作为简单介绍,仓库中完整的 vue3 源码的构建方式

**基本配置:**
node.js(>=20) typescript 支持 pnpm 管理工具

### 主要是以下几步:

1.创建目录后: pnpm init -y , 会出现 packages.json 文件. 2.添加 ts 版本和 compile:"tsc"命令. 3.创建配置文件: pnpm-workspace.yaml 并添加:

```
packages:
  - 'packages/*'
  - 'apps/*'
这两个目录下的所有包都会被当作子包
```

###### 以 apps 目录为例:

采用常见的 C/S 架构:则创建 client 和 server 目录分别进行管理即可:
server 文件下: pnpm init -y 进行初始化,此时内部不需要依赖配置,因为是可以依赖外层的配置
将脚本配置导入:

```
server/package.json:
"type": "module",
"scripts": {
  "compile": "tsc",
  "dev": "node dist/index.js"
}
```

执行:pnpm tsc --init 生成 tsconfig.json 配置文件
此时再执行 pnpm compile 不会报错,并且编译依赖,一定要先构建再执行

## 插入 ai

1.下载 ollama: ollama -v 查看版本 ollama ls 查看已安装模型, ollama run 对应模型即可

**回到 monorepo 中来**
在 sever/package.json 文件中安装相关的依赖

```
"dependencies": {
  "langchain": "0.3.31",
  "@langchain/core": "0.3.72",
  "@langchain/ollama": "0.2.3",
  "@langchain/community": "0.3.53"
},
"devDependencies": {
  "@types/node": "24.0.15"
}
```

pnpm i 进行安装
**以 src 目录下的 prompt.ts 为例:**

```
import { ChatPllama } from "@langchain/ollama"
import { HumanMessage } from "@langchain/core/messages"
import http from "node:http"

const llm = new ChatOllama({
  model: "qwen3:0.6b"
})

const app = http.createServer(async(req, res) => {
  const result = await llm.invoke([
    ["system", "请将中文翻译为英文"],
    new HumanMessage({
      content: "你好"
    })
  ])
  res.setHeader("Content-Type", "text/plain;chartset=utf-8")
  res.send(result.content)
})

app.listen(3000, () => {
  console.log("server is running at 3000")
})
```

**rag.ts:示例**

```
import { OllamaEmbeddings } from "@langchain/ollama"

import { MemoryVectorStore } from "langchain/vectorstores/memory"

const embeddings = new OllamaEmbeddings({
  model: "mxbai-embed-large:latest",
  baseUrl: "http://localhost:11434"
})

const test = "我是a,我在b"

async function run() {
  // 存储
  const vectorStore =  await MemoryVectorStore.feomDocuments([
    {
      pageContent: text,
      metadata: {
        name: 'b'
      }
    }
  ], embeddings)

  //检索
  //一个向量
  const vector = await embeddings.embedQuery('a在哪?')

  //检索内容
  const result = await vectorStore.similaritySearchVectoeWithScore(vector, 1)
}

run()
```
