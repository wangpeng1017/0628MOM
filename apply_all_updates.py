#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""批量更新所有订单管理页面的测试数据到15条"""

import os
import re

# 基础数据
customers = ['华为技术有限公司', '比亚迪股份有限公司', '宁德时代新能源科技', '隆基绿能科技股份', '天合光能股份', 
             '晶科能源股份', '阿特斯阳光电力', '协鑫集成科技', '东方日升新能源', '中国电建集团',
             '国家电网公司', '南方电网公司', '中广核新能源', '三峡新能源', '正泰集团股份']

# 生成15条数据的通用函数
def generate_rows(template_type):
    rows = []
    for i in range(15):
        order_id = f'ORD-2024-{str(i+1).zfill(3)}'
        customer = customers[i]
        
        if template_type == 'production-tracking':
            progress = [70, 100, 42, 58, 85, 95, 0, 30, 65, 88, 92, 78, 50, 25, 100][i]
            status = ['生产中', '已完工', '生产中', '生产中', '生产中', '生产中', '未开工', '生产中', '生产中', '生产中', '生产中', '生产中', '生产中', '生产中', '已完工'][i]
            rows.append(f'<tr class="border-t hover:bg-gray-50"><td class="px-6 py-4 font-medium text-blue-600">{order_id}</td><td class="px-6 py-4">逆变器</td><td class="px-6 py-4">{[50,30,200,120,60,150,100,110,85,220,280,230,145,180,130][i]}台</td><td class="px-6 py-4">{[35,30,84,70,51,143,0,33,55,194,258,179,73,45,130][i]}台</td><td class="px-6 py-4"><div class="flex items-center"><div class="w-32 bg-gray-200 rounded-full h-2 mr-2"><div class="bg-{"green" if progress==100 else "blue" if progress>50 else "gray"}-600 h-2 rounded-full" style="width: {progress}%"></div></div><span class="text-sm font-medium">{progress}%</span></div></td><td class="px-6 py-4"><span class="px-2 py-1 bg-{"green" if status=="已完工" else "blue" if status=="生产中" else "gray"}-100 text-{"green" if status=="已完工" else "blue" if status=="生产中" else "gray"}-800 rounded text-xs">{status}</span></td></tr>')
        
        elif template_type == 'inventory-management':
            stock_status = ['库存充足', '库存不足', '库存充足', '库存不足', '库存充足', '库存不足', '库存充足', '库存充足', '库存不足', '库存不足', '库存充足', '库存不足', '库存充足', '库存不足', '库存充足'][i]
            rows.append(f'<tr class="border-t hover:bg-gray-50"><td class="px-6 py-4 font-medium text-blue-600">{order_id}</td><td class="px-6 py-4">逆变器</td><td class="px-6 py-4">{[50,100,200,120,60,150,100,110,85,220,280,230,145,180,130][i]}台</td><td class="px-6 py-4">{[60,20,250,30,80,50,120,130,40,100,300,150,160,90,150][i]}台</td><td class="px-6 py-4"><span class="px-2 py-1 bg-{"green" if stock_status=="库存充足" else "yellow"}-100 text-{"green" if stock_status=="库存充足" else "yellow"}-800 rounded text-xs">{stock_status}</span></td><td class="px-6 py-4"><button class="text-{"green" if stock_status=="库存充足" else "blue"}-600 hover:text-{"green" if stock_status=="库存充足" else "blue"}-800"><i class="fas fa-{"box" if stock_status=="库存充足" else "cogs"} mr-1"></i>{"生成拣货单" if stock_status=="库存充足" else "触发生产"}</button></td></tr>')
        
        elif template_type == 'exception-handling':
            exc_types = ['零部件短缺', '设备故障', '质量问题', '物流延误', '零部件短缺', '设备故障', '质量问题', '零部件短缺', '设备故障', '物流延误', '质量问题', '零部件短缺', '设备故障', '质量问题', '物流延误'][i]
            exc_desc = ['芯片库存不足', '生产线B设备故障', '产品质量不合格', '物流运输延误', '电容库存不足', '包装线C需要维修', '外观检测不通过', '电阻库存不足', '焊接设备故障', '供应商延迟发货', '性能测试不达标', '线材库存不足', '测试设备故障', '包装材料不合格', '运输车辆故障'][i]
            status = ['待处理', '处理中', '待处理', '处理中', '待处理', '处理中', '待处理', '处理中', '待处理', '处理中', '待处理', '处理中', '待处理', '处理中', '待处理'][i]
            rows.append(f'<tr class="border-t hover:bg-gray-50"><td class="px-6 py-4 font-medium text-blue-600">{order_id}</td><td class="px-6 py-4"><span class="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">{exc_types}</span></td><td class="px-6 py-4">{exc_desc}</td><td class="px-6 py-4">2024-10-{25-i} {14+i}:30</td><td class="px-6 py-4"><span class="px-2 py-1 bg-{"red" if status=="待处理" else "yellow"}-100 text-{"red" if status=="待处理" else "yellow"}-800 rounded text-xs">{status}</span></td><td class="px-6 py-4"><button class="text-blue-600 hover:text-blue-800"><i class="fas fa-{"wrench" if status=="待处理" else "eye"} mr-1"></i>{"处理" if status=="待处理" else "查看"}</button></td></tr>')
        
        elif template_type == 'logistics-management':
            logistics = ['顺丰速运', '德邦物流', '顺丰速运', '中通快递', '圆通速递', '德邦物流', '顺丰速运', '中通快递', '圆通速递', '德邦物流', '顺丰速运', '中通快递', '圆通速递', '德邦物流', '顺丰速运'][i]
            fees = [850, 650, 920, 580, 720, 680, 780, 620, 690, 710, 980, 890, 750, 700, 820][i]
            rows.append(f'<tr class="border-t hover:bg-gray-50"><td class="px-6 py-4"><input type="checkbox" class="rounded"></td><td class="px-6 py-4 font-medium text-blue-600">{order_id}</td><td class="px-6 py-4">{customer}</td><td class="px-6 py-4">{"深圳市南山区" if i%5==0 else "西安市雁塔区" if i%5==1 else "北京市朝阳区" if i%5==2 else "上海市浦东新区" if i%5==3 else "广州市天河区"}</td><td class="px-6 py-4"><span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{logistics}</span></td><td class="px-6 py-4">¥{fees}</td><td class="px-6 py-4"><button class="text-blue-600 hover:text-blue-800"><i class="fas fa-shipping-fast mr-1"></i>发货</button></td></tr>')
        
        elif template_type == 'delivery-confirmation':
            status = ['派送中', '已送达', '派送中', '已送达', '派送中', '已送达', '派送中', '已送达', '派送中', '已送达', '派送中', '已送达', '派送中', '已送达', '派送中'][i]
            rows.append(f'<tr class="border-t hover:bg-gray-50"><td class="px-6 py-4 font-medium text-blue-600">{order_id}</td><td class="px-6 py-4">{customer}</td><td class="px-6 py-4">2024-10-{25-i} 09:00</td><td class="px-6 py-4">2024-10-{26-i} 10:00</td><td class="px-6 py-4"><span class="px-2 py-1 bg-{"yellow" if status=="派送中" else "green"}-100 text-{"yellow" if status=="派送中" else "green"}-800 rounded text-xs">{status}</span></td><td class="px-6 py-4"><button class="text-{"blue" if status=="派送中" else "green"}-600 hover:text-{"blue" if status=="派送中" else "green"}-800"><i class="fas fa-{"eye" if status=="派送中" else "check-circle"} mr-1"></i>{"查看物流" if status=="派送中" else "确认收货"}</button></td></tr>')
        
        elif template_type == 'aftermarket-request':
            types = ['产品质量问题', '技术咨询', '安装指导', '产品质量问题', '技术咨询', '安装指导', '产品质量问题', '技术咨询', '安装指导', '产品质量问题', '技术咨询', '安装指导', '产品质量问题', '技术咨询', '安装指导'][i]
            status = ['待处理', '处理中', '待处理', '处理中', '待处理', '处理中', '待处理', '处理中', '待处理', '处理中', '待处理', '处理中', '待处理', '处理中', '待处理'][i]
            rows.append(f'<tr class="border-t hover:bg-gray-50"><td class="px-6 py-4 font-medium text-blue-600">AS-2024-{str(i+1).zfill(3)}</td><td class="px-6 py-4">{order_id}</td><td class="px-6 py-4">{customer}</td><td class="px-6 py-4"><span class="px-2 py-1 bg-{"red" if "质量" in types else "blue"}-100 text-{"red" if "质量" in types else "blue"}-800 rounded text-xs">{types}</span></td><td class="px-6 py-4">2024-10-{25-i}</td><td class="px-6 py-4"><span class="px-2 py-1 bg-{"yellow" if status=="待处理" else "blue"}-100 text-{"yellow" if status=="待处理" else "blue"}-800 rounded text-xs">{status}</span></td><td class="px-6 py-4"><button class="text-blue-600 hover:text-blue-800"><i class="fas fa-{"wrench" if status=="待处理" else "eye"} mr-1"></i>{"处理" if status=="待处理" else "查看"}</button></td></tr>')
        
        elif template_type == 'return-exchange':
            types = ['退货', '换货', '退货', '换货', '退货', '换货', '退货', '换货', '退货', '换货', '退货', '换货', '退货', '换货', '退货'][i]
            reasons = ['产品质量问题', '规格不符', '产品质量问题', '规格不符', '产品质量问题', '规格不符', '产品质量问题', '规格不符', '产品质量问题', '规格不符', '产品质量问题', '规格不符', '产品质量问题', '规格不符', '产品质量问题'][i]
            status = ['待审核', '处理中', '待审核', '处理中', '待审核', '处理中', '待审核', '处理中', '待审核', '处理中', '待审核', '处理中', '待审核', '处理中', '待审核'][i]
            rows.append(f'<tr class="border-t hover:bg-gray-50"><td class="px-6 py-4 font-medium text-blue-600">{"RET" if types=="退货" else "EXC"}-2024-{str(i+1).zfill(3)}</td><td class="px-6 py-4">{order_id}</td><td class="px-6 py-4">{customer}</td><td class="px-6 py-4"><span class="px-2 py-1 bg-{"red" if types=="退货" else "blue"}-100 text-{"red" if types=="退货" else "blue"}-800 rounded text-xs">{types}</span></td><td class="px-6 py-4">{reasons}</td><td class="px-6 py-4"><span class="px-2 py-1 bg-{"yellow" if status=="待审核" else "blue"}-100 text-{"yellow" if status=="待审核" else "blue"}-800 rounded text-xs">{status}</span></td><td class="px-6 py-4"><button class="text-{"green" if status=="待审核" else "blue"}-600 hover:text-{"green" if status=="待审核" else "blue"}-800 mr-2"><i class="fas fa-{"check" if status=="待审核" else "eye"}"></i></button>{"<button class=\\"text-red-600 hover:text-red-800\\"><i class=\\"fas fa-times\\"></i></button>" if status=="待审核" else ""}</td></tr>')
        
        elif template_type == 'aftermarket-records':
            types = ['退货', '换货', '维修', '退货', '换货', '维修', '退货', '换货', '维修', '退货', '换货', '维修', '退货', '换货', '维修'][i]
            rows.append(f'<tr class="border-t hover:bg-gray-50"><td class="px-6 py-4 font-medium text-blue-600">REC-2024-{str(i+1).zfill(3)}</td><td class="px-6 py-4">{order_id}</td><td class="px-6 py-4">{customer}</td><td class="px-6 py-4"><span class="px-2 py-1 bg-{"red" if types=="退货" else "blue" if types=="换货" else "green"}-100 text-{"red" if types=="退货" else "blue" if types=="换货" else "green"}-800 rounded text-xs">{types}</span></td><td class="px-6 py-4">2024-10-{20-i}</td><td class="px-6 py-4"><span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">已完成</span></td><td class="px-6 py-4"><button class="text-blue-600 hover:text-blue-800"><i class="fas fa-eye mr-1"></i>详情</button></td></tr>')
    
    return '\n                    '.join(rows)

print("数据生成脚本已创建")
print("请手动应用生成的数据到对应文件")
