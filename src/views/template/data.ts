export interface DomainItem {
  code: string;
  name: string;
  slug: string;
  desc: string;
  icon: string;
  color: string;
}

export const domainList: DomainItem[] = [
  {
    code: '00',
    name: '公共需求',
    slug: 'common',
    desc: '通用基础模块 · 公共服务',
    icon: 'ph:buildings-bold',
    color: '#8E8E93',
  },
  {
    code: '02',
    name: '设备管理',
    slug: 'device',
    desc: '设备台账 · 巡检维修 · 备件管理',
    icon: 'ph:wrench-bold',
    color: '#007AFF',
  },
  {
    code: '03',
    name: '物流管理',
    slug: 'logistics',
    desc: '仓储调度 · 出入库 · 物料追踪',
    icon: 'ph:truck-bold',
    color: '#FF9500',
  },
  {
    code: '04',
    name: '计量管理',
    slug: 'metering',
    desc: '计量器具 · 检定校准 · 数据采集',
    icon: 'ph:scales-bold',
    color: '#5856D6',
  },
  {
    code: '06',
    name: '安全管理',
    slug: 'safety',
    desc: '隐患排查 · 安全培训 · 事故管理',
    icon: 'ph:shield-warning-bold',
    color: '#FF3B30',
  },
  {
    code: '07',
    name: '能源管理',
    slug: 'energy',
    desc: '能耗监测 · 节能分析 · 用能优化',
    icon: 'ph:lightning-bold',
    color: '#FFCC00',
  },
  {
    code: '08',
    name: '环保管理',
    slug: 'environment',
    desc: '排放监测 · 环评管理 · 废弃物处理',
    icon: 'ph:leaf-bold',
    color: '#34C759',
  },
  {
    code: '09',
    name: '安防管理',
    slug: 'security',
    desc: '视频监控 · 门禁管理 · 应急响应',
    icon: 'ph:video-camera-bold',
    color: '#FF2D55',
  },
  {
    code: '12',
    name: '品质管控',
    slug: 'quality',
    desc: '质量检验 · 不合格品 · SPC 分析',
    icon: 'ph:seal-check-bold',
    color: '#0071E3',
  },
  {
    code: '13',
    name: '营销管理',
    slug: 'marketing',
    desc: '客户管理 · 合同订单 · 售后服务',
    icon: 'ph:megaphone-bold',
    color: '#5AC8FA',
  },
];
