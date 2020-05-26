export const signup = (email: string, password: string) => `mutation {
  signup(signUpInput: { email: "${email}", password: "${password}" }) {
    id
  }
}`;

export const createPost = (title: string, body?: string) => `mutation {
  createPost(postInput: { title: "${title}", body: "${body}" }) {
    id
    title
    author {
      email
    }
  }
}`;
