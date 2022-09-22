<script setup lang="ts"></script>

<template>
  <a-config-provider :locale="zhCN">
    <router-view />
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const locale = ref(zhCN.locale)
    return {
      zhCN,
    }
  },
})
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  /*overflow: hidden;*/
}
</style>
