var { buildSchema } = require("graphql");
module.exports = buildSchema(`

type allPosts{
    posts:[Post!]!
}   
type Post {
    _id:ID!
    user:User!
    date:String!
    comments:[String!]
    reacts:[String!]
    img:[String!]
}

type User{
    _id:ID!
    email: String!
    name:String!
    phone:String!
    bio:String!
    userToken:String!
    
}
input userInputData{
    email: String!
    password:String!
    name:String!
    bio:String!
    phone:String!
    
}
input userLoginData{
    email: String!
    password:String!
}

type rootMutation{
    creatUser(userinput:userInputData):User!
    loginUser(userinput:userLoginData):User!
}
type RootQuery{
    fetchPosts:allPosts!
    singlPost(id:ID!):Post
    singlUser(id:ID!):User
}
schema{
    query:RootQuery
    mutation:rootMutation
    
}
`);
