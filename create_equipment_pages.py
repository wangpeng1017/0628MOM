#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量创建设备管理模块页面
"""

pages = {
    "maintenance-repair.html": {
        "title": "维护维修管理",
        "subtitle": "故障报修、工单派发、维修验收全流程管理",
        "stats": [
            {"label": "待处理工单", "value": "12", "color": "yellow", "icon": "clock"},
            {"label": "进行中工单", "value": "8", "color": "blue", "icon": "tools"},
            {"label": "本月完成", "value": "156", "color": "green", "icon": "check-circle"},
            {"label": "平均响应时间", "value": "2.5h", "color": "purple", "icon": "stopwatch"}
        ],
        "table_title": "维修工单列表",
        "headers": ["工单编号", "设备名称", "故障描述", "报修人", "维修人员", "优先级", "状态", "创建时间", "操作"],
        "sample_data": [
            ["WO-2024-001", "全自动贴片机", "吸嘴故障", "张三", "李工", "高", "进行中", "2024-10-28 09:00"],
            ["WO-2024-002", "逆变器测试台", "传感器异常", "李四", "王工", "中", "待派工", "2024-10-28 10:30"],
            ["WO-2024-003", "激光焊接机", "激光头偏移", "王五", "赵工", "高", "已完成", "2024-10-27 14:20"],
        ]
    },
    "preventive-maintenance.html": {
        "title": "计划性维护",
        "subtitle": "保养计划制定、SOP管理、自动生成保养工单",
        "stats": [
            {"label": "保养策略", "value": "45", "color": "blue", "icon": "calendar-alt"},
            {"label": "本周计划", "value": "23", "color": "green", "icon": "tasks"},
            {"label": "执行中", "value": "8", "color": "orange", "icon": "cog"},
            {"label": "执行率", "value": "95%", "color": "purple", "icon": "chart-line"}
        ],
        "table_title": "保养计划列表",
        "headers": ["计划编号", "设备名称", "保养类型", "保养周期", "负责人", "下次保养", "状态", "操作"],
        "sample_data": [
            ["PM-2024-001", "全自动贴片机", "月度保养", "每月1号", "李工", "2024-11-01", "待执行"],
            ["PM-2024-002", "逆变器测试台", "季度保养", "每季度末", "王工", "2024-12-31", "计划中"],
            ["PM-2024-003", "激光焊接机", "周保养", "每周一", "赵工", "2024-11-04", "执行中"],
        ]
    },
    "inspection-management.html": {
        "title": "点巡检管理",
        "subtitle": "巡检路线规划、巡检任务执行、异常快速上报",
        "stats": [
            {"label": "巡检路线", "value": "12", "color": "blue", "icon": "route"},
            {"label": "今日任务", "value": "8", "color": "green", "icon": "clipboard-list"},
            {"label": "发现异常", "value": "3", "color": "red", "icon": "exclamation-triangle"},
            {"label": "完成率", "value": "92%", "color": "purple", "icon": "percentage"}
        ],
        "table_title": "巡检任务列表",
        "headers": ["任务编号", "巡检路线", "巡检人", "设备数量", "计划时间", "完成时间", "异常数", "状态", "操作"],
        "sample_data": [
            ["INS-2024-001", "A车间日巡", "张工", "15台", "2024-10-28 08:00", "2024-10-28 09:30", "1", "已完成"],
            ["INS-2024-002", "B车间日巡", "李工", "12台", "2024-10-28 09:00", "-", "0", "进行中"],
            ["INS-2024-003", "C车间周巡", "王工", "20台", "2024-10-28 14:00", "-", "0", "待开始"],
        ]
    },
    "spare-parts-management.html": {
        "title": "备品备件管理",
        "subtitle": "备件库存、出入库管理、智能预警补货",
        "stats": [
            {"label": "备件种类", "value": "328", "color": "blue", "icon": "boxes"},
            {"label": "库存总值", "value": "¥2.5M", "color": "green", "icon": "dollar-sign"},
            {"label": "低库存预警", "value": "15", "color": "red", "icon": "bell"},
            {"label": "本月消耗", "value": "¥85K", "color": "purple", "icon": "chart-bar"}
        ],
        "table_title": "备件库存列表",
        "headers": ["备件编码", "备件名称", "规格型号", "当前库存", "安全库存", "单位", "单价", "状态", "操作"],
        "sample_data": [
            ["SP-001", "伺服电机", "SGMJV-04ADE6S", "5", "3", "台", "¥3,500", "正常"],
            ["SP-002", "传感器", "E2E-X5ME1", "2", "5", "个", "¥280", "低库存"],
            ["SP-003", "轴承", "6205-2RS", "50", "20", "个", "¥45", "正常"],
        ]
    },
    "predictive-maintenance.html": {
        "title": "预测性维护",
        "subtitle": "设备健康监测、故障预警、剩余寿命预测",
        "stats": [
            {"label": "监测设备", "value": "85", "color": "blue", "icon": "heartbeat"},
            {"label": "健康设备", "value": "78", "color": "green", "icon": "check"},
            {"label": "预警设备", "value": "5", "color": "orange", "icon": "exclamation"},
            {"label": "异常设备", "value": "2", "color": "red", "icon": "times-circle"}
        ],
        "table_title": "设备健康监测列表",
        "headers": ["设备编号", "设备名称", "健康指数", "预警类型", "预测RUL", "最后更新", "状态", "操作"],
        "sample_data": [
            ["EQ-2024-001", "全自动贴片机", "92分", "-", "正常", "2024-10-28 10:00", "健康"],
            ["EQ-2024-003", "激光焊接机", "65分", "振动异常", "15天", "2024-10-28 10:05", "预警"],
            ["EQ-2024-007", "伺服电机测试台", "45分", "温度过高", "5天", "2024-10-28 10:10", "异常"],
        ]
    },
    "knowledge-base.html": {
        "title": "知识库管理",
        "subtitle": "维修案例沉淀、SOP文档、智能推荐",
        "stats": [
            {"label": "知识条目", "value": "286", "color": "blue", "icon": "book"},
            {"label": "维修案例", "value": "156", "color": "green", "icon": "wrench"},
            {"label": "SOP文档", "value": "89", "color": "purple", "icon": "file-alt"},
            {"label": "本月新增", "value": "12", "color": "orange", "icon": "plus"}
        ],
        "table_title": "知识库列表",
        "headers": ["编号", "标题", "类型", "设备类别", "创建人", "评分", "浏览量", "创建时间", "操作"],
        "sample_data": [
            ["KB-001", "贴片机吸嘴故障排查方法", "维修案例", "贴片机", "李工", "5.0", "156", "2024-09-15"],
            ["KB-002", "逆变器月度保养SOP", "SOP文档", "逆变器", "王工", "4.8", "89", "2024-08-20"],
            ["KB-003", "伺服电机定位不准问题解决", "维修案例", "伺服电机", "赵工", "4.9", "203", "2024-10-10"],
        ]
    },
    "oee-analysis.html": {
        "title": "OEE统计分析",
        "subtitle": "设备综合效率分析、六大损失统计、持续改进",
        "stats": [
            {"label": "整体OEE", "value": "75.5%", "color": "blue", "icon": "chart-pie"},
            {"label": "时间稼动率", "value": "85.2%", "color": "green", "icon": "clock"},
            {"label": "性能稼动率", "value": "90.8%", "color": "purple", "icon": "tachometer-alt"},
            {"label": "质量合格率", "value": "97.6%", "color": "orange", "icon": "check-double"}
        ],
        "table_title": "设备OEE分析",
        "headers": ["设备名称", "OEE", "时间稼动率", "性能稼动率", "质量合格率", "主要损失", "改进建议", "操作"],
        "sample_data": [
            ["全自动贴片机", "82.5%", "90.0%", "95.0%", "96.5%", "换型调试", "优化换型流程"],
            ["逆变器测试台", "68.3%", "75.0%", "88.0%", "103.5%", "故障停机", "加强预防性维护"],
            ["组件层压机", "65.2%", "85.0%", "90.0%", "85.0%", "质量损失", "改进工艺参数"],
        ]
    }
}

# HTML模板
html_template = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="bg-gray-50">
    <div class="p-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
            <p class="text-sm text-gray-600">{subtitle}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
{stats_html}
        </div>

        <div class="bg-white rounded-lg shadow">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold">{table_title}</h3>
                    <div class="flex space-x-2">
                        <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            <i class="fas fa-plus mr-2"></i>新增
                        </button>
                        <button class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                            <i class="fas fa-download mr-2"></i>导出
                        </button>
                    </div>
                </div>
            </div>
            
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left"><input type="checkbox" class="rounded"></th>
{headers_html}
                    </tr>
                </thead>
                <tbody>
{rows_html}
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>'''

stat_template = '''            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">{label}</p>
                        <p class="text-3xl font-bold text-{color}-600">{value}</p>
                    </div>
                    <div class="w-12 h-12 bg-{color}-100 rounded-lg flex items-center justify-center">
                        <i class="fas fa-{icon} text-{color}-600 text-xl"></i>
                    </div>
                </div>
            </div>'''

# 生成页面
import os
output_dir = "pages/equipment"

for filename, config in pages.items():
    # 生成统计卡片HTML
    stats_html = "\n".join([
        stat_template.format(**stat) for stat in config["stats"]
    ])
    
    # 生成表头HTML
    headers_html = "\n".join([
        f'                        <th class="px-6 py-3 text-left text-sm">{h}</th>'
        for h in config["headers"]
    ])
    
    # 生成数据行HTML
    rows = []
    for i, row_data in enumerate(config["sample_data"], 1):
        cells = [f'<td class="px-6 py-4 font-medium text-blue-600">{row_data[0]}</td>']
        cells.extend([f'<td class="px-6 py-4">{cell}</td>' for cell in row_data[1:]])
        cells.append('<td class="px-6 py-4"><button class="text-blue-600 hover:text-blue-800 mr-2">详情</button><button class="text-gray-600 hover:text-gray-800">编辑</button></td>')
        
        row_html = f'                    <tr class="border-t hover:bg-gray-50"><td class="px-6 py-4"><input type="checkbox" class="rounded"></td>{"".join(cells)}</tr>'
        rows.append(row_html)
    
    rows_html = "\n".join(rows)
    
    # 生成完整HTML
    html_content = html_template.format(
        title=config["title"],
        subtitle=config["subtitle"],
        stats_html=stats_html,
        table_title=config["table_title"],
        headers_html=headers_html,
        rows_html=rows_html
    )
    
    # 写入文件
    filepath = os.path.join(output_dir, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"Created: {filepath}")

print("\n所有页面创建完成！")
