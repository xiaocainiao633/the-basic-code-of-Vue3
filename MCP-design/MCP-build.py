# 客户端职责:
from anthropic import Anthropic
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

class MCPClient:
    def __init__(self):
        self.anthropic = Anthropic()
        self.session = None

    async def connect_to_server(self, server_script_path: str):
        """连接到 MCP 服务器"""
        server_params = StdioServerParameters(
            command="python",
            args=[server_script_path],
        )

        stdio_transport = await stdio_client(server_params)
        self.stdio, self.write = stdio_transport
        self.session = ClientSession(self.stdio, self.write)

        await self.session.initialize()

    async def process_query(self, query: str) -> str:
        """处理用户查询"""
        # 获取可用工具
        tools = await self.session.list_tools()

        # 发送查询到 AI 模型
        response = self.anthropic.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4096,
            messages=[{"role": "user", "content": query}],
            tools=[{
                "name": tool.name,
                "description": tool.description,
                "input_schema": tool.inputSchema
            } for tool in tools.tools]
        )

        # 处理工具调用
        if response.stop_reason == "tool_use":
            tool_results = []
            for content in response.content:
                if content.type == "tool_use":
                    result = await self.session.call_tool(
                        content.name,
                        content.input
                    )
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": content.id,
                        "content": result.content
                    })

            # 将工具结果发送回 AI
            final_response = self.anthropic.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4096,
                messages=[
                    {"role": "user", "content": query},
                    {"role": "assistant", "content": response.content},
                    {"role": "user", "content": tool_results}
                ]
            )
            return final_response.content[0].text

        return response.content[0].text


# 使用示例:
async def main():
    client = MCPClient()
    # 连接到数据库服务器
    await client.connect_to_server("database_server.py")
    # 处理查询
    result = await client.process_query(
        "帮我创建一个名为张三，邮箱是zhangsan@example.com的用户"
    )
    print(result)

# 运行
import asyncio
asyncio.run(main())
