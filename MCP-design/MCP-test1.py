# MCP是开源标准协议,用于连接AI模型和应用程序。MCP设计旨在简化AI模型的集成过程,使开发者能够轻松地将各种AI模型嵌入到他们的应用中。
# MCP设计包括以下关键组件:
# 1. 模型注册: 定义如何注册和发现AI模型,包括模型的元数据(如名称、版本、功能等)。
# 2. 接口规范: 规定模型与应用程序之间的通信协议,包括输入输出格式、请求响应机制等。
# 3. 安全性: 定义访问控制和数据隐私保护措施,确保模型和用户数据的安全。
# 4. 扩展性: 提供机制以支持新模型和功能的添加,确保MCP能够适应不断变化的AI技术。
# 5. 性能监控: 包括模型性能的监控和日志记录,以便开发者能够优化和调试模型的使用。
# MCP包含两个核心层: 数据层和传输层,服务器可以向客户端提供三种类型:
# Resource:
# prompts
# Tools: LLM可调用的可执行函数,实现具体操作:
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("weather")

@mcp.tool()

async def get_weather(city: str) -> str:
    """获取指定城市的天气信息"""
    # 模拟获取天气信息的逻辑
    return f"{city}的天气是晴天，温度25摄氏度。"

# 构建一个MCP服务器实例(使用FastMCP类)
from mcp.sesrver.fastmcp import FastMCP
# 引入数据库操作库
import sqlite3

# 创建MCP服务器实例
mcp = FastMcp("database-server")

@mcp.tool()
async def query_users(limit: int = 10) -> str:
    """查询用户列表"""
    # 连接到SQLite数据库
    conn = sqlite3.connect("app.db")
    # 执行查询操作
    cursor = conn.cursor()
    # 查询用户数据
    cursor.excute("SELECT * FROM users LIMIT ?", (limit,))
    # 获取查询结果
    results = cursor.fetchall()
    # 关闭数据库连接
    conn.close()
    # 返回查询结果
    return str(results)

@mcp.tool()
async def create_user(name: str, email: str) -> str:
    """创建新用户"""
    # 连接到SQLite数据库
    conn = sqlite3.connect("app.db")
    # 执行插入操作
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (name, email) VALUES (?, ?)", (name, email))
    # 提交事务
    conn.commit()
    # 获取新用户ID
    user_id = cursor.lastrowid
    # 关闭数据库连接
    conn.close()
    # 返回新用户ID
    return f"新用户已创建，ID为{user_id}。"

# 启动MCP服务器(使用stdio传输层)
if __name__ == "__main__":
    mcp.run()