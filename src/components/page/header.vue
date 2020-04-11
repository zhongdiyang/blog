<template>
  <header>
    <div class="wrapbox">
      <div class="nav fl">
        <ul>
          <li>
            <router-link :to="{ path: '/' }">
              <i class="iconfont icon-shouye"></i>
              首页
            </router-link>
          </li>
          <li><router-link :to="{ path: '/classify' }">
            <i class="iconfont icon-shenghuo"></i>
            前端小记
          </router-link></li>
          <!-- <li><router-link :to="{ path: '/' }">
            <i class="iconfont icon-xuexi"></i>
            代码点滴
          </router-link></li> -->
          <li><router-link :to="{ path: '/about' }">
            <i class="iconfont icon-wode"></i>
            关于我
          </router-link></li>
          <li><router-link :to="{ path: '/rest' }">
            <i class="iconfont icon-liuyanban"></i>
            小憩一下
          </router-link></li>
        </ul>
      </div>
      <!--<div class="login fr">
        <a href="javascript:void(0)" onclick="zdyLogin.login(0);">
          <i class="iconfont icon-denglu"></i>
          登录
        </a>
        <span class="mlr">|</span>
        <a href="javascript:void(0)" onclick="zdyLogin.login(1);">
          <i class="iconfont icon-zhuce"></i>
          注册
        </a>
      </div>-->
    </div>
  </header>
</template>

<style lang='css'>
  header{
    width: 100%;
    height: 42px;
    background: #2d3640;
  }
  /*header部分*/
  header{
    width: 100%;
    height: 42px;
    background: #2d3640;
  }
  header ul li{
    float: left;
    margin-right: 1px;
  }
  header a{
    font-size: 14px;
    padding: 12px 18px;
    line-height: 42px;
    border-radius: 2px;
    color: #fff;
    /* transition: border-radius .8s linear; */
    transition: background .8s linear;
  }
  header a i{
    color: #fff;
    font-size: 14px;
    transition: color .8s linear;
  }
  header a:hover{
    background: #ec7829;
    color: #fff;
    border-radius: 5px;
  }
  header a:hover i{
    color: #fff;
  }
</style>
