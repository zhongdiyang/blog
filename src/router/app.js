const app = [
  {
    path: 'article',
    title: '文章',
    name: 'article',
    icon: 'android-document', // 设置在后台使用的字体图标
    redirect: '/admin/article/list',
    component: () => import('@/view/temp'),
    children: [
      { path: 'list', title: '文章列表', fullPath: '/admin/article/list', icon: 'android-list', name: 'article_list', component: () => import('@/view/admin/article/list') },
      { path: 'add', title: '添加文章', fullPath: '/admin/article/add', icon: 'android-add-circle', name: 'article_add', component: () => import('@/view/admin/article/add') },
      { path: 'modify', title: '修改文章', fullPath: '/admin/article/modify', icon: 'android-checkbox-outline', name: 'article_modify', component: () => import('@/view/admin/article/modify') }
    ]
  },
  {
    path: 'analysis',
    title: '分析',
    name: 'analysis',
    icon: 'ios-download-outline',
    component: () => import('@/view/temp'),
    children: [
      { path: 'article_type', title: '文章类别', fullPath: '/admin/analysis/article_type', icon: 'android-list', name: 'article_type', component: () => import('@/view/admin/analysis/article_type') },
      { path: 'article_trend', title: '文章趋势', fullPath: '/admin/analysis/article_trend', icon: 'arrow-graph-up-right', name: 'article_trend', component: () => import('@/view/admin/analysis/article_trend') }
    ]
  },
  {
    path: 'user',
    title: '用户',
    name: 'user',
    icon: 'person-stalker',
    component: () => import('@/view/temp'),
    children: [
      { path: 'user_list', title: '用户列表', fullPath: '/admin/user/user_list', icon: 'person', name: 'user_list', component: () => import('@/view/admin/user/list') }
    ]
  }
]
export default app
