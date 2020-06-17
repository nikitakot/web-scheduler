export const signup = (
  email: string,
  username: string,
  password: string,
) => `mutation {
  signup(
    signUpInput: {
      email: "${email}"
      password: "${password}"
      username: "${username}"
    }
  ) {
    id
    jwt
  }
}
`;

export const createMonitoredEndpoint = (
  name: string,
  url: string,
  interval: number,
) => `
mutation {
  createMonitoredEndpoint(
    monitoredEndpointInput: {
      name: "${name}"
      url: "${url}"
      monitoredInterval: ${interval}
    }
  ) {
    id
    createdAt
  }
}
`;
