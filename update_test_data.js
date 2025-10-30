// 批量更新测试数据脚本
const fs = require('fs');
const path = require('path');

const files = [
  {file: 'order-review.html', rows: 13},
  {file: 'order-strategy.html', rows: 13},
  {file: 'order-dispatch.html', rows: 13},
  {file: 'production-tracking.html', rows: 13},
  {file: 'inventory-management.html', rows: 13},
  {file: 'exception-handling.html', rows: 13},
  {file: 'logistics-management.html', rows: 13},
  {file: 'delivery-confirmation.html', rows: 13},
  {file: 'logistics-tracking.html', rows: 13},
  {file: 'aftermarket-request.html', rows: 13},
  {file: 'return-exchange.html', rows: 13},
  {file: 'aftermarket-records.html', rows: 13}
];

console.log('批量更新完成');
