export const userType = `
  type User {
    id: ID!
    firstName: String!
    lastName: String
    email: String!
    gender: Gender!
    dob: Date
    bio: String
    language: String
    avatarUrl: String
    linkedinId: String
    facebookId: String
    twitterId: String
  }
  enum Gender {
    male
    female
    unknown
  }
  extend type Query {
    me: User!
    getAllUsers: [User!]!
  }
  extend type Mutation {
    register(firstName: String!, lastName: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): LoginResponse!
    updateMe(firstName: String!, lastName: String!, email: String!, gender: Gender!, dob: Date, bio: String, language: String, linkedinId: String, facebookId: String, twitterId: String): User!
  }
  type LoginResponse {
    token: String!
    refreshToken: String!
  }
`;
