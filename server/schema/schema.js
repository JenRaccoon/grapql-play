const graphql = require('graphql');
// interact with mongo
const Patient = require('../models/patient');
const Organization = require('../models/organization');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;
const _ = require('lodash');

//fake data for test
// const patients = [
//   { name: 'John', gender: 'male', id: '1', orgId: '1' },
//   { name: 'May', gender: 'female', id: '2', orgId: '2' },
//   { name: 'Mark', gender: 'female', id: '2', orgId: '1' },
//   { name: 'Leo', gender: 'female', id: '2', orgId: '2' },
// ];

// const organizations = [
//   { name: 'JUBO', bedNum: 25, id: '1' },
//   { name: 'Bonjour', bedNum: 10, id: '2' },
// ];

//define type
const PatientType = new GraphQLObjectType({
  name: 'Patient',
  //把他wrap在function內
  fields: () => ({
    //define each fields type
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    gender: { type: GraphQLString },
    orgId: {
      type: OrgType,
      resolve(parent, args) {
        console.log(parent);
        //parent是原本查詢id得到的patient
        //拿出patient的orgId並到organizations資料內查詢
        return Organization.findById(parent.orgId);
      },
    },
  }),
});

const OrgType = new GraphQLObjectType({
  name: 'Organization',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    bedNum: { type: GraphQLInt },
    patients: {
      type: new GraphQLList(PatientType),
      resolve(parent, args) {
        console.log(parent);
        return Patient.find({ orgId: parent.id });
      },
    },
  }),
});

//define the root when we make a query (jump into query)
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    //important!
    // 規定 query時要攜帶哪先參數來詢問 patient 這裏要求query要帶著id
    //那前端就可以用 patient(id:'123'){ ... //what we want to get from queried patient such as name gender}
    patient: {
      type: PatientType,
      args: { id: { type: GraphQLID } },
      //resolve function 用來處理我們要從哪裡取資料
      //parent 和資料之間的relationship有關
      resolve(parent, args) {
        //code to get data from db/other source
        console.log(typeof args.id);
        return Patient.findById(args.id);
      },
    },
    organization: {
      type: OrgType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Organization.findById(args.id);
      },
    },
    patients: {
      type: new GraphQLList(PatientType),
      resolve(parent, args) {
        return Patient.find({});
      },
    },
    organizations: {
      type: new GraphQLList(OrgType),
      resolve(parent, args) {
        return Organization.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addPatient: {
      type: PatientType,
      args: {
        //use GraphQLNonNull 要求欄位勢必填
        name: { type: new GraphQLNonNull(GraphQLString) },
        gender: { type: new GraphQLNonNull(GraphQLString) },
        orgId: { type: GraphQLString },
      },
      resolve(parent, args) {
        //save new patient to db
        let patient = new Patient({
          name: args.name,
          gender: args.gender,
          orgId: args.orgId,
        });
        //use return in order to show what u add in graphiql
        return patient.save();
      },
    },
    addOrg: {
      type: OrgType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        bedNum: { type: GraphQLInt },
        // patients: {
        //   type: GraphQLList,
        // },
      },
      resolve(parent, args) {
        //save new patient to db
        let org = new Organization({
          name: args.name,
          bedNum: args.bedNum,
        });
        //use return in order to show what u add in graphiql
        return org.save();
      },
    },
    updatePatient: {
      type: PatientType,
      args: {
        id: { type: GraphQLID },
        name: {
          type: new GraphQLNonNull(GraphQLString),
        },
        gender: { type: GraphQLString },
      },
      resolve(parent, args) {
        return Patient.findOneAndUpdate(
          { _id: args.id },
          { name: args.name, gender: args.gender },
          { new: true }
        );
      },
    },
    deletePatient: {
      type: PatientType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Patient.findOneAndDelete({ _id: args.id });
      },
    },
  },
});
module.exports = new GraphQLSchema({
  //把定義好的query傳出去
  query: RootQuery,
  mutation: Mutation,
});
