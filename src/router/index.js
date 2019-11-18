import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 解决重复点击报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  mode: "history",
  base: process.env.ROUTER_BASE,
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      redirect: '/dashboard',
      meta: { requireAuth: true },
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve),
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      meta: { title: '自述文件' },
      children: [
        {
          path: '/dashboard',
          component: resolve => require(['../components/page/Dashboard.vue'], resolve),
          meta: { requireAuth: true, title: '首页' },
        },
        {
          path: '/newMembers',
          component: resolve => require(['../components/page/datalist/BaseTable.vue'], resolve),
          meta: { requireAuth: true, title: '报名信息' },
        },
        {
          path: '/tabs',
          component: resolve => require(['../components/page/Tabs.vue'], resolve),
          meta: { requireAuth: true, title: 'tab选项卡' },
        },
        {
          path: '/addProject',
          component: resolve => require(['../components/page/formcorrelation/AddProject.vue'], resolve),
          meta: { requireAuth: true, title: '发布获奖项目' },
        },
        {
          path: '/editor',
          component: resolve => require(['../components/page/formcorrelation/VueEditor.vue'], resolve),
          meta: { requireAuth: true, title: '富文本编辑器' },
        },
        {
          path: '/markdown',
          component: resolve => require(['../components/page/formcorrelation/Markdown.vue'], resolve),
          meta: { requireAuth: true, title: 'Markdown编辑器' },
        },
        {
          path: '/upload',
          component: resolve => require(['../components/page/formcorrelation/Upload.vue'], resolve),
          meta: { requireAuth: true, title: '文件上传' },
        },
        {
          path: '/projectlist',
          component: resolve => require(['../components/page/datalist/ProjectList.vue'], resolve),
          meta: { requireAuth: true, title: '项目列表' },
        },
        {
          path: '/memberlist',
          component: resolve => require(['../components/page/datalist/MemberList.vue'], resolve),
          meta: { requireAuth: true, title: '成员列表' },
        }
      ]
    },
    {
      path: '/404',
      component: resolve => require(['../components/page/404.vue'], resolve),
      meta: { requireAuth: true, title: '404' },
    }
  ]
})
export default router
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (localStorage.getItem("token") != null) { // 判断本地是否存在token
      next()
    } else {
      // 未登录,跳转到登陆页面
      next({
        path: '/login'
      })
    }
  } else {
    if (localStorage.getItem("token") != null) {
      next('/');
    } else {
      next();
    }
  }
})