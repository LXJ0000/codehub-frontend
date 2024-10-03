// 当前文件用于把图标组件注册成全局组件
import {
  HomeOutlined,
  PartitionOutlined,
  SettingOutlined,
  TeamOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PoweroffOutlined,
  LockOutlined,
  UserOutlined,
  BarChartOutlined,
  UsergroupDeleteOutlined,
  SendOutlined,
  ScheduleOutlined,
  CarOutlined,
  RightOutlined,
  LikeOutlined,
  LikeFilled,
  StarOutlined,
  StarFilled,
  ShareAltOutlined,
  BellOutlined,
  MessageOutlined,
  SmileOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  BulbOutlined,
  WechatOutlined,
  QqOutlined,
} from '@ant-design/icons-vue'

// 以上图标都需要全局注册
const icons = [
  HomeOutlined,
  PartitionOutlined,
  SettingOutlined,
  TeamOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PoweroffOutlined,
  LockOutlined,
  UserOutlined,
  BarChartOutlined,
  UsergroupDeleteOutlined,
  SendOutlined,
  ScheduleOutlined,
  CarOutlined,
  RightOutlined,
  LikeOutlined,
  LikeFilled,
  StarOutlined,
  StarFilled,
  ShareAltOutlined,
  BellOutlined,
  MessageOutlined,
  SmileOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  BulbOutlined,
  WechatOutlined,
  QqOutlined,
]

// app.use({ install(){ } })
export default {
  install(app) {
    // 遍历图标集合
    icons.forEach((icon) => {
      // 注册全局组件
      app.component(icon.displayName, icon)
    })
  },
}
