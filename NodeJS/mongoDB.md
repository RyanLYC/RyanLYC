## [mongoDB](https://www.mongodb.com/docs/manual/)

### [插入](https://www.mongodb.com/docs/manual/tutorial/insert-documents/)
- insertOne(doc)
- insertMany

### [更新](https://www.mongodb.com/docs/manual/tutorial/update-documents/)
- replaceOne全部替换
- updateOne(filter,updateDoc)部分替换

#### 更新操作符
- <update operator>: { <field1>: <value1>, ... },
- $set
- $inc 自增
- $rename 重命名
- $unset 删除
```js
 {
      $set: {
        "name": 'new-name'
      },
      $inc: {
        “age”: 1
       }
   }
```

#### [数组更新操作符](https://www.mongodb.com/docs/manual/reference/operator/update-array/)
- $push 插入
- $pull 删除特定项
- $pop 删除第一项或者最后一项
- $ 特殊占位符，表示匹配到的元素
- Update Operator Modifiers
  * $each 插入多项
  * $position 在特定位置插入
```js
   $push: {
        "hobbies": { $each: [‘1’, ‘2’]}
      },
      $set: {
          “hobbies.0”: ‘new value 下标’ ,     
          “hobbies.$”: ‘new value 占位符’ ,     
      }
```

### [索引以及分析](https://www.mongodb.com/docs/manual/indexes/)
- createIndex
- listIndexes
- explain()

### [mongoose](https://mongoosejs.com/)
- ORM和ODM的概念
  对象数据模型（Object Data Model，简称 ODM）或对象关系模型（Object Relational Model，简称 ORM）。ODM / ORM 能将网站中的数据表示为 JavaScript 对象，然后将它们映射到底层数据库。一些 ORM 只适用某些特定数据库，还有一些是普遍适用的。Mongoose 是最受欢迎的 ODM。
- 链接数据库
  * connect
  * createConnection
- [Schema](https://mongoosejs.com/docs/guide.html#definition)
- [model](https://mongoosejs.com/docs/models.html)

### 查询
- find
  * [返回为Cursor对象](https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/read-operations/cursor/)
- 格式find(query,findOptions)
- findOne

#### [查询条件](https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/query-document/)
- 格式:{属性:{操作符:value}}
- 比较操作符$gt,$lt......
- 逻辑操作符 $or,$and
- 元素操作符$exists,$type

```js
const condition = {
      $or: [
        { age: { $gt: 30 }},
        { name: 'xiaobao' }
      ]
    }
```

#### 结果过滤 FindOptions
- limit 
- skip
- sor
- projection


```js
const options: FindOptions = {
      limit: 2,
      skip: 4,
      sort: { age: -1 },
      projection: { name: 1 }
    }
```

### [查询数组](https://www.mongodb.com/docs/manual/tutorial/query-arrays/)
- $all 操作符 部分匹配
- 查询单个元素hobbies:'value'

```js
{
  hobbies: { $all: [‘a’, ‘b’]},
  hobbies: ‘item’
}
```

### 删除
- deleteOne(filter)
- deleteMany

### 数据关系
- 内嵌 Embedding
- 引用Referencing
  * 一对多
  * 多对多
- [最佳实践](https://www.mongodb.com/developer/products/mongodb/mongodb-schema-design-best-practices/)

### [聚合Aggregation](https://www.mongodb.com/docs/manual/aggregation/)
- 操作符
  * $match
  * $group
  * $sort
- 计算操作符
  * $sum
  * $avg
  * $min
- [$lookup多集合查询](https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/)
  ```js
    const pipeLine = [
        { $match: { name: 'Nets'} },
        {
          $lookup: {
            from: 'user',
            localField: 'players',
            foreignField: '_id',
            as: "newPlayers"
          }
        }
      ]
  ```
```js
 const pipeLine = [
      { $match: { age: { $gt: 30 }}},
      { $group: { _id: "$team", total: { $sum: "$age"}, count: { $sum: 1 }, avg: { $avg: "$age"}}},
      { $sort: { total: 1 }}
    ]
```


### Demo
```js
import { MongoClient, FindOptions, ObjectId, UpdateFilter, Filter } from 'mongodb'
const url = "mongodb://localhost:27017/"
const client = new MongoClient(url)
const records = [
  {
    name: 'Westbrook',
    age: 32
  },
  {
    name: 'Howard',
    age: 35
  },  
]    
async function run() {
  try {
    await client.connect()
    const db = client.db('hello')
    const res = await db.command({ ping: 1 })
    console.log('connected', res)
    // 数据的插入
    const userCollection = db.collection<{ hobbies: string[]}>('user')
    // const result = await userCollection.insertOne({ name: 'AD', age: 28 })
    // console.log(result)
    // const results = await userCollection.insertMany(records)
    // console.log(results)
    // 查找
    // const result = await userCollection.findOne({ name: 'james' })
    // console.log('the result', result)
    const cursor = userCollection.find()
    // 1 使用 forEach
    // await cursor.forEach(doc => console.log(doc))
    // 2 使用 toArray()
    // const results = await userCollection.find().toArray()
    // console.log('the result array', results)
    // 1 比较操作符
    // const results = await userCollection.find({ age: { $lt: 30 }}).toArray()
    // 2 逻辑操作符
    // const condition = {
    //   $or: [
    //     { age: { $gt: 30 }},
    //     { name: 'xiaobao' }
    //   ]
    // }
    // const results = await userCollection.find(condition).toArray()
    //3 element
    // const results = await userCollection.find({ hobby: { $exists: true }}).toArray()
    // const results = await userCollection.find({ age: { $type: 'number' }}).toArray()
    // console.log('the result array', results)
    // limit
    const options: FindOptions = {
      // limit: 2,
      // skip: 4
      // sort: { age: -1 }
      projection: { name: 1 }
    }
    // const results = await userCollection.find({ age: { $type: 'number' }}, options).toArray()
    // console.log('the result array', results)
    // replace - put
    // update - patch 
    // const replaceDoc = await userCollection.replaceOne({ name: 'james' }, { name: 'LBJ', age: 40 })
    // console.log(replaceDoc)
    // const updateFilter: UpdateFilter<{ name: string, age: number }> = {
    //   $set: {
    //     name: 'Lebron'
    //   },
    //   $inc: {
    //     age: 1
    //   }
    // }
    // update array result
    // const updateFilter: UpdateFilter<{ name: string, age: number, hobbies: string[] }> = {
    //   $set: {
    //     "hobbies.0": 'golf'
    //   },
    // }
    // const updateDoc = await userCollection.updateOne({ _id: new ObjectId('6153d382be72255729c75b7d')}, updateFilter)
    // console.log(updateDoc)
    // search by array element
    // const result = await userCollection.findOne({
    //   hobbies: { $regex: /gol/g }
    // })
    // console.log(result)
    // update array item by search result $
    // const updateFilter: UpdateFilter<{ name: string, age: number, hobbies: string[] }> = {
    //   $set: {
    //     "hobbies.$": 'golf-new'
    //   },
    // }
    // const indexArray = await userCollection.listIndexes().toArray()
    // const updateDoc = await userCollection.updateOne({ 
    //   _id: new ObjectId('6153d382be72255729c75b7d'),
    //   hobbies: 'xyz'
    // }, updateFilter)
    // 索引 mongoDB index
    // let testArr = []
    // for(let i = 1; i<= 50000; i++) {
    //   testArr.push({ type: 'test', name: `test${i}`, age: i})
    // }
    // const result = await userCollection.insertMany(testArr)
    // const result = await userCollection.find({ name: 'test50000'}).explain()
    // const result = await userCollection.find({ _id: new ObjectId('615c1d058dfd4a491e810d0a')}).explain()
    // const result = await userCollection.createIndex({ name: 1 })
    //console.log(result)
    const indexResult = await userCollection.listIndexes().toArray()
    console.log(indexResult)
    // const dropResult = await userCollection.dropIndex('name_1')
    // console.log(dropResult)
  } catch(e) {
    console.error(e)
  } finally {
    await client.close()
  }
}

run()
```