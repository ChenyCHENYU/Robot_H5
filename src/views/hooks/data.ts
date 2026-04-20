export interface HookItem {
  name: string;
  title: string;
  desc: string;
  route: string;
  icon: string;
  color: string;
}

export interface HookCategory {
  label: string;
  items: HookItem[];
}

export const hookCategories: HookCategory[] = [
  {
    label: '影像采集',
    items: [
      {
        name: 'useCamera',
        title: '拍照相册',
        desc: '拍照/相册选取 + 自动压缩',
        route: '/hooks/camera',
        icon: 'ph:camera-bold',
        color: '#007AFF',
      },
      {
        name: 'useVideoRecorder',
        title: '视频录制',
        desc: '实时预览 + 录制 + 回放',
        route: '/hooks/video-recorder',
        icon: 'ph:film-strip-bold',
        color: '#FF9500',
      },
      {
        name: 'useAudioRecorder',
        title: '录音',
        desc: '录音 + 暂停恢复 + 播放',
        route: '/hooks/audio-recorder',
        icon: 'ph:microphone-bold',
        color: '#FF3B30',
      },
    ],
  },
  {
    label: '定位扫描',
    items: [
      {
        name: 'useLocation',
        title: 'GPS 定位',
        desc: '单次/持续定位 + 坐标展示',
        route: '/hooks/location',
        icon: 'ph:map-pin-bold',
        color: '#34C759',
      },
      {
        name: 'useQrScanner',
        title: '扫码识别',
        desc: '二维码/条形码扫描',
        route: '/hooks/qr-scanner',
        icon: 'ph:qr-code-bold',
        color: '#5856D6',
      },
      {
        name: 'useNfc',
        title: 'NFC',
        desc: 'NFC 标签读写',
        route: '/hooks/nfc',
        icon: 'ph:contactless-payment-bold',
        color: '#FF9500',
      },
    ],
  },
  {
    label: '文件处理',
    items: [
      {
        name: 'useFileUpload',
        title: '文件上传',
        desc: '分片上传 + 进度条 + 断点续传',
        route: '/hooks/file-upload',
        icon: 'ph:cloud-arrow-up-bold',
        color: '#0071E3',
      },
      {
        name: 'useFileDownload',
        title: '文件下载',
        desc: '流式下载 + 进度跟踪',
        route: '/hooks/file-download',
        icon: 'ph:cloud-arrow-down-bold',
        color: '#5AC8FA',
      },
      {
        name: 'useFilePreview',
        title: '文件预览',
        desc: 'PDF / Office / 图片在线预览',
        route: '/hooks/file-preview',
        icon: 'ph:eye-bold',
        color: '#8E8E93',
      },
    ],
  },
  {
    label: '系统能力',
    items: [
      {
        name: 'useBluetooth',
        title: '蓝牙连接',
        desc: '扫描设备 + 配对连接',
        route: '/hooks/bluetooth',
        icon: 'ph:bluetooth-bold',
        color: '#007AFF',
      },
      {
        name: 'useOfflineStorage',
        title: '离线存储',
        desc: 'IndexedDB 键值存储 + 同步队列',
        route: '/hooks/offline-storage',
        icon: 'ph:database-bold',
        color: '#5856D6',
      },
      {
        name: 'usePushNotification',
        title: '推送通知',
        desc: '消息接收 + 通知注册',
        route: '/hooks/push-notification',
        icon: 'ph:bell-bold',
        color: '#FF9500',
      },
      {
        name: 'usePermission',
        title: '权限管理',
        desc: '系统权限查询 + 请求 + 监听',
        route: '/hooks/permission',
        icon: 'ph:key-bold',
        color: '#FF3B30',
      },
    ],
  },
  {
    label: '创意工具',
    items: [
      {
        name: 'useSignature',
        title: '手写签名',
        desc: 'Canvas 签名板 + 撤销 + 保存',
        route: '/hooks/signature',
        icon: 'ph:pen-nib-bold',
        color: '#FF2D55',
      },
      {
        name: 'useWatermark',
        title: '图片水印',
        desc: '文字水印叠加 + 位置/透明度调节',
        route: '/hooks/watermark',
        icon: 'ph:drop-bold',
        color: '#34C759',
      },
    ],
  },
];
