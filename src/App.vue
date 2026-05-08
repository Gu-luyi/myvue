<template>
  <div class="app">
     <router-view></router-view>
      <van-tabbar route>
        <van-tabbar-item icon="home-o" replace to="/index">首页</van-tabbar-item>
        <van-tabbar-item icon="search" replace to="/order">订单</van-tabbar-item>
        <van-tabbar-item icon="friends-o" replace to="/jiesuan">结算</van-tabbar-item>
        <van-tabbar-item icon="setting-o" replace to="/my">我的</van-tabbar-item>
      </van-tabbar>
  </div>
</template>
<script>
export default {

}
</script>
<style scoped>
  
</style>