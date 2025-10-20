@mcp.tool()
async def get_today_events() -> str:
    """获取今天的日程安排"""
    # 连接 Google Calendar API
    events = calendar_api.get_events(date=today)
    return format_events(events)

@mcp.tool()
async def create_event(title: str, start_time: str, duration: int) -> str:
    """创建新的日程事件"""
    event = calendar_api.create_event(title, start_time, duration)
    return f"事件创建成功: {event.id}"

# design_spec_server.py
@mcp.resource()
async def get_design_spec(component_name: str) -> str:
    """获取组件设计规范"""
    spec = load_spec(component_name)
    return spec.to_json()

@mcp.tool()
async def generate_component(spec: dict) -> str:
    """根据规范生成组件代码"""
    code = code_generator.generate(spec)
    return code


# Multi-server setup
servers = [
    "sales_db_server",      # 销售数据库
    "hr_api_server",        # 人力资源 API
    "finance_server",       # 财务系统
]

# AI 可以跨系统查询
query = """
分析一下上季度销售业绩与人员投入的关系，
并给出下季度的人力资源建议
"""
