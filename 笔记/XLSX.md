### el-table 导出 Excel 表格

```js
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

const handleExportExcel = () => {
  // console.log('XLSX', XLSX)
  // console.log('table:', document.querySelector('.table-wrapper'))
  /* 从表生成工作簿对象 */
  var wb = XLSX.utils.table_to_book(document.querySelector(".table-wrapper"));
  /* 获取二进制字符串作为输出 */
  var wbout = XLSX.write(wb, {
    bookType: "xlsx",
    bookSST: true,
    type: "array",
  });
  try {
    FileSaver.saveAs(
      //Blob 对象表示一个不可变、原始数据的类文件对象。
      //Blob 表示的不一定是JavaScript原生格式的数据。
      //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
      //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
      new Blob([wbout], { type: "application/octet-stream" }),
      //设置导出文件名称
      "查询分析表.xlsx"
    );
  } catch (e) {
    if (typeof console !== "undefined") {
      console.log(e, wbout);
    }
  }
};
```
