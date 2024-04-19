## vue3 + TypeScript + ECharts 组件

1. （建议父组件可以创建 shallowRef 的 option，赋值的时候直接给整个 option 赋值）
2. ts 按需引入
3. 去除 overflow: hidden 这样在组件外面也能看到 tooltip，有需要自行添加即可
4. 明确 emit 事件名，有需要自行添加其他事件

### echarts.ts 参考在 [TypeScript 中按需引入](https://echarts.apache.org/handbook/zh/basics/import#%E5%9C%A8-typescript-%E4%B8%AD%E6%8C%89%E9%9C%80%E5%BC%95%E5%85%A5)

后续可以通过这个组件拿到 echarts 和 option 类型，需要增加也在这里增加

```ts
import * as echarts from "echarts/core";
import {
  BarChart,
  // 系列类型的定义后缀都为 SeriesOption
  BarSeriesOption,
  LineChart,
  LineSeriesOption,
} from "echarts/charts";
import {
  // 数据集组件
  DatasetComponent,
  DatasetComponentOption,
  GridComponent,
  GridComponentOption,
  TitleComponent,
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,

  // 内置数据转换器组件 (filter, sort)
  TransformComponent,
} from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
>;

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

export type { ECOption };

export default echarts;
```

### echarts.vue

```vue
<script lang="ts" setup>
import { debounce } from "lodash-es";
import echarts from "./echarts";
import type { ECOption } from "./echarts";

const props = defineProps<{
  option: ECOption;
}>();

const emit = defineEmits<IEmit>();
type EventNames = "mouseover" | "mouseout" | "click" | "legendselectchanged";
interface IEmit {
  (event: "click", params: any, chart: ReturnType<typeof echarts.init>): void;
  (
    event: "resize",
    params: { width: number; height: number },
    chart: ReturnType<typeof echarts.init>
  ): void;
}
let chart: ReturnType<typeof echarts.init>;
const echartsRef = ref<HTMLDivElement>();
let destroyFunc: () => void;

const getEchartsInstance = () => chart;
function setOption(option?: ECOption) {
  option && chart!.setOption({ ...option });
}
function initChartEvent() {
  chart!.on("click" as string, (params) => {
    emit("click", params, chart!);
  });
}
function makeEchartsResponsive() {
  const targetNode = echartsRef.value!;
  const resizeDebounced = debounce(() => {
    chart!.resize();
  }, 50);
  const resizeObserver = new ResizeObserver((targets) => {
    resizeDebounced();
    const [target] = targets;
    emit(
      "resize",
      { width: target.contentRect.width, height: target.contentRect.height },
      chart!
    );
  });
  resizeObserver.observe(targetNode);
  destroyFunc = () => {
    resizeObserver.disconnect();
  };
}

onMounted(() => {
  chart = echarts.init(echartsRef.value!);
  setOption(props.option);
  initChartEvent();
  makeEchartsResponsive();
});

onUnmounted(() => {
  chart && chart.dispose();
  destroyFunc && destroyFunc();
});

watch(
  () => props.option,
  (option) => {
    setOption(option);
  },
  { deep: true }
);

defineExpose({
  getEchartsInstance,
});
</script>

<template>
  <div ref="echartsRef" class="echarts" />
</template>

<style scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
```

### fontSize 跟随页面宽度响应式变化

1. 除了容器大小响应式，同时加入 fontSize 响应式变化（最好是默认 viewPortWidth 为 0，即关闭字体响应式变化，需要的话传入设计稿页面宽度）
2. 采用的 echarts 的 get、set 来快捷操作 option 对象
3. 提供了一个 getObjectPaths 函数来获取对象的所有属性的 path
4. 注意点，echarts 普通合并模式，series 这种数组，需要找到对应 name、id 所在的项，不然数据都是新增
5. 这里默认的 setOption 没用采用合并模式，需要传入整个图表的配置

```vue
<script setup>
import { cloneDeep, debounce, get, set } from "lodash";
import * as echarts from "echarts";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { getObjectPaths } from "@/utils/utils";

const props = defineProps({
  option: {
    type: Object,
    required: true,
  },
  viewPortWidth: {
    type: Number,
    default: 1920, // 0 关闭自适应
  },
});

const emit = defineEmits([
  "resize",
  "mouseover",
  "mouseout",
  "click",
  "legendselectchanged",
]);

let chart;
const echartsRef = ref();
let destroyFunc;

const defaultResizingOption = {}; // 自适应配置（echarts 普通合并模式，需要用到name、id）
const fontSizePaths = new Set(); // fontSize 需要的 key

const getEchartsInstance = () => chart;
function setOption(option) {
  option && chart.setOption({ ...option }, true);
  // 这里没有走echarts合并模式，所以就不传参数，直接拿到echarts实例的option。
  // 如果是echarts合并模式，需要传入option，并且要想办法拿到echarts默认的option。
  collectFontSizePath();
}

// 注册echarts事件到Vue组件
function initChartEvent() {
  const emitEvents = ["mouseover", "mouseout", "click", "legendselectchanged"];
  emitEvents.forEach((eventName) => {
    chart.on(eventName, (params) => {
      emit(eventName, params, chart);
    });
  });
}

// echarts 容器大小自适应
function makeChartsResponsive() {
  const targetNode = echartsRef.value;
  const resizeDebounced = debounce(() => {
    chart.resize();
    setFontSize(); // resize的时候也要重新设置字体大小
  }, 50);
  const resizeObserver = new ResizeObserver((targets) => {
    resizeDebounced();
    const [target] = targets;
    const { width, height } = target.contentRect;
    emit("resize", { width, height }, chart);
  });
  resizeObserver.observe(targetNode);
  destroyFunc = () => {
    resizeObserver.disconnect();
  };
}

// 拿到option中所有的fontSize（包括基础的id、name）
function collectFontSizePath(option) {
  option === undefined && (option = chart.getOption());
  const pathList = getObjectPaths(option);
  const optionPathList = pathList.filter((path) => !path.includes("data"));
  const basePathList = optionPathList.filter(
    (path) => path.endsWith(".name") || path.endsWith("id")
  );
  const fontSizePathList = optionPathList.filter((path) =>
    path.endsWith(".fontSize")
  );
  basePathList.forEach((path) =>
    set(defaultResizingOption, path, get(option, path))
  );
  fontSizePathList.forEach((path) => {
    let fontSize = get(option, path);
    if (typeof fontSize === "string" && fontSize.endsWith("px"))
      fontSize = Number(fontSize.replace("px", "")) || 12;

    set(defaultResizingOption, path, fontSize);
    fontSizePaths.add(path);
  });
  setFontSize();
}

// 遍历收集到的fontSize，根据页面宽度重新设置字体大小
function setFontSize() {
  if (!props.viewPortWidth) return;
  const width = document.body.clientWidth;
  const ratio = width / props.viewPortWidth;
  const fontSizeOption = cloneDeep(defaultResizingOption);
  fontSizePaths.forEach((path) => {
    const fontSize = get(defaultResizingOption, path);
    const newFontSize = Number((ratio * fontSize).toFixed(5)); // 精度
    set(fontSizeOption, path, newFontSize);
  });
  chart.setOption(fontSizeOption);
}

onMounted(() => {
  chart = echarts.init(echartsRef.value);
  setOption(props.option);
  initChartEvent();
  makeChartsResponsive();
});

onUnmounted(() => {
  chart && chart.dispose();
  destroyFunc && destroyFunc();
});

watch(
  () => props.option,
  (option) => {
    setOption(option);
  }
  // { deep: true }, // 如果默认不走echarts合并模式，就不需要deep了
);

defineExpose({
  getEchartsInstance,
});
</script>

<template>
  <div ref="echartsRef" class="echarts" />
</template>

<style scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
```

```js
function getObjectPaths(object) {
  const paths = [];
  const getPaths = (obj, path) => {
    if (obj && typeof obj === "object") {
      Object.keys(obj).forEach((key) => {
        getPaths(obj[key], path ? `${path}.${key}` : key);
      });
    } else {
      paths.push(path);
    }
  };
  getPaths(object, "");
  return paths;
}
```

## 一些 echarts 技巧

### 增量更新

setOption 默认会合并 option

### legend 超出省略

通过这个配置可以看看 echarts 的 format 有什么功能

```js
import { format as echartsFormat } from "echarts";

const legend = {
  formatter(name) {
    return echartsFormat.truncateText(name, 80, undefined, "…", undefined);
  },
  tooltip: {
    show: true,
  },
};
```

### echarts 使用数据集 在轴为 time 会无法显示

echarts 使用数据集 在轴为 time 会无法显示，可以在每个 serise 加上 encode 指定维度

```js
const series = {
  encode: {
    x: ["time"],
    y: ["dimension_name"],
  },
};
```

## 基础组件（Vue2）

组件特点：

自适应容器大小，始终撑满容器
彻底解决因为外层容器不可见导致 echarts 10px 的问题
将 echarts 事件以 vue 事件抛出

### ResizeObserver(容器大小变化监听方案 1)

可以使用 ResizeObserver 这个 Web API 来监听容器的大小变化，使用的时候注意下兼容性哦

```vue
<script>
import * as echarts from "echarts";
import { debounce } from "lodash";

export default {
  name: "EchartsDynamicResize",
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      chart: null,
      destroyFunc: null,
    };
  },
  watch: {
    options: {
      handler(val) {
        this.setOption(val);
      },
      deep: true,
    },
  },
  mounted() {
    this.chart = echarts.init(this.$refs.echarts);
    this.setOption(this.options);
    this.initChartEvent();
    this.makeEchartsResponsive();
  },
  beforeUnmount() {
    this.chart && this.chart.dispose();
    this.destroyFunc && this.destroyFunc();
  },
  methods: {
    getEchartsInstance() {
      return this.chart;
    },
    setOption(option) {
      this.chart && this.chart.setOption(option);
    },
    // 注册echarts事件到Vue组件
    initChartEvent() {
      const emitEvents = [
        "mouseover",
        "mouseout",
        "click",
        "legendselectchanged",
      ];
      emitEvents.forEach((eventName) => {
        this.chart.on(eventName, (params) => {
          this.$emit(eventName, params, this.chart);
        });
      });
    },
    // echarts 容器大小自适应
    makeEchartsResponsive() {
      const targetNode = this.$refs.echarts;
      const resizeDebounced = debounce(() => {
        this.chart.resize();
      }, 50);
      const resizeObserver = new ResizeObserver(() => {
        resizeDebounced();
      });
      resizeObserver.observe(targetNode);
      this.destroyFunc = () => {
        resizeObserver.disconnect();
      };
    },
  },
};
</script>

<template>
  <div ref="echarts" class="echarts" />
</template>

<style scoped>
.echarts {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
```

### element-resize-detector（容器大小变化坚挺方案 2）

也可以选择这个库来监听元素的大小变化，这里只是改变监听方案，其他是和之前的一样的

```js
import elementResizeDetector from "element-resize-detector";

const data = {
  makeEchartsResponsive() {
    if (!this.$refs.echarts) return;

    // element-resize-detector
    const erd = elementResizeDetector();
    const targetNode = this.$refs.echarts;
    const resizeDebounced = debounce(() => {
      this.myChart.resize();
    }, 50);
    erd.listenTo(targetNode, resizeDebounced);
    this.destroyFunc = () => {
      erd.removeListener(targetNode, resizeDebounced);
    };
  },
};
```
