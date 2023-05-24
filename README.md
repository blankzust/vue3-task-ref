## Desc

vue 3 ref的封装，包装具有优先级的一组ref数组

## Install

```shell
# with npm
npm i vue3-task-ref

# with yarn
yarn add vue3-task-ref

# with pnpm
pnpm add vue3-task-ref
```

## Use

- 单组优先级
```html
<template>
  <div>
    <button v-if="showDialog1" @click="showDialog1 = false">按钮1</button>
    <button v-if="showDialog2" @click="showDialog2 = false">按钮2</button>
    <button v-if="showDialog3" @click="showDialog3 = false">按钮3</button>
  </div>
<template>
<script setup>
  import { defaultTaskContainer } from 'vue3-task-ref';

  const showDialog1 = defaultTaskContainer.taskRef({
    val: false,
    no: 1
  });
  const showDialog2 = defaultTaskContainer.taskRef({
    val: false,
    no: 2
  });

  const showDialog3 = defaultTaskContainer.taskRef({
    val: false,
    no: 3
  });

  // 用setTimeout模拟请求
  setTimeout(() => {
    showDialog1.value = true;
  }, 100)
  setTimeout(() => {
    showDialog2.value = true;
  }, 100)
  setTimeout(() => {
    showDialog3.value = true;
  }, 100)
</script>
```
![单组优先级.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7cb8911e79149cfbfcc659ef289d2d8~tplv-k3u1fbpfcp-watermark.image?)

- 多组优先级

```html
<template>
  <div>
    <button v-if="showDialog1" @click="showDialog1 = false">按钮1</button>
    <button v-if="showDialog2" @click="showDialog2 = false">按钮2</button>
    <button v-if="showDialog3" @click="showDialog3 = false">按钮3</button>
  </div>
<template>
<script setup>
  import { createTaskContainer } from 'vue3-task-ref';

  const container1 = createTaskContainer();
  const container2 = createTaskContainer();

  const showDialog1 = container1.taskRef({
    val: false,
    no: 1
  });
  const showDialog2 = container1.taskRef({
    val: false,
    no: 2
  });

  const showDialog3 = container2.taskRef({
    val: false,
    no: 1
  });

  const showDialog4 = container2.taskRef({
    val: false,
    no: 2
  });

  // 用setTimeout模拟请求
  setTimeout(() => {
    showDialog1.value = true;
  }, 100)
  setTimeout(() => {
    showDialog2.value = true;
  }, 100)
  setTimeout(() => {
    showDialog3.value = true;
  }, 100)
  setTimeout(() => {
    showDialog4.value = true;
  }, 100)
</script>
```
![分组优先级.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6007c9b778ce4373be6fdcd07fd3df2f~tplv-k3u1fbpfcp-watermark.image?)

- 自定义超时时间（默认为100ms）

```html
<template>
  <div>
    <button v-if="showDialog1" @click="showDialog1 = false">按钮1</button>
    <button v-if="showDialog2" @click="showDialog2 = false">按钮2</button>
    <button v-if="showDialog3" @click="showDialog3 = false">按钮3</button>
  </div>
<template>
<script setup>
  import { defaultTaskContainer } from 'vue3-task-ref';

  const showDialog1 = defaultTaskContainer.taskRef({
    val: false,
    no: 1,
  });
  const showDialog2 = defaultTaskContainer.taskRef({
    val: false,
    no: 2,
    timeout: 1000
  });

  const showDialog3 = defaultTaskContainer.taskRef({
    val: false,
    no: 3
  });

  // 用setTimeout模拟请求
  setTimeout(() => {
    // 小于默认超时时间100毫秒返回，已超时
    showDialog1.value = true;
  }, 200)
  setTimeout(() => {
    // 小于1000毫秒返回，未超时
    showDialog2.value = true;
  }, 800)
  setTimeout(() => {
    showDialog3.value = true;
  }, 100)
</script>
```

![超时.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11c7ed58e72243ccbfd774173bf30826~tplv-k3u1fbpfcp-watermark.image?)
