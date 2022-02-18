const express = require('express');
//使用express-graphql
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
//solve cors issue
const cors = require('cors');

const app = express();
//allow cross-origin requests
app.use(cors());

mongoose.connect('mogodb-url', { useUnifiedTopology: true });
mongoose.connection.once('open', () => {
  console.log('connected to My DB');
});

app.use(
  '/graphql',
  graphqlHTTP({
    //傳入schema結構 告訴graphql 資料長什麼樣子
    schema,
    //open graphiql tool 可以在domain/graphql下看到此GUI 右側可以看到自動產生的document
    //記得要訪問string類型壹定要用雙引號
    graphiql: true,
  })
);
// setup nodejs and listen to 4000
app.listen(4000, () => {
  console.log('Listening on port 4000');
});
