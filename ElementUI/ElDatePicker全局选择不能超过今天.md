## main.ts 中添加

```typescript
import ElementPlus, { ElDatePicker } from "element-plus";
import dayjs from "dayjs";

/** 默认不能大于今天 */
ElDatePicker.props.disabledDate.validator = (v) => {
  return dayjs(v) > dayjs();
};
```
