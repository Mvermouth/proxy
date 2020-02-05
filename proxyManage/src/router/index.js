import Vue from 'vue'
import Router from 'vue-router'

/*页面组件*/
//登录
import Login from '@/components/login/index'
//首页
import Index from '@/components/index/index'
//pid管理
import Pidmanage from '@/components/pidmanage/index'
//收益列表
import Incomemanage from '@/components/incomemanage/index'
//邀请码
import Invitecode from '@/components/invitecode/index'
//收益分成
import Revenueshare from '@/components/revenueshare/index'
//群主收益
import Ownerincome from '@/components/ownerincome/index'
//账户管理
import Accountmanage from '@/components/accountmanage/index'
//b淘宝客订单
//import Relations_order from '@/components/relations_order/index'
import NotFound from '@/components/notFound/index'
/*页面组件*/


/*UI组件*/
import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);
/*UI组件*/

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      components: {
      	default:Login
      }
    },{
      path: '/index',
      name: 'index',
      components: {
      	default:Index
      }
      ,children:[{
        path:"pidmanage",
        component:Pidmanage
      },{
        path:"incomemanage",
        component:Incomemanage
      },{
        path:"accountmanage",
        component:Accountmanage
      },{
        path:"invitecode",
        component:Invitecode
      },{
        path:"revenueshare",
        component:Revenueshare
      }]
    },{
      path: '/ownerincome',
      name: 'ownerincome',
      components: {
        default:Ownerincome
      }
    },{path:'*',component:NotFound}
  ]
})