const config = {
  base: "/",
  api: "http://localhost:3000",
  oauth: {
    accessTokenUrl: "http://localhost:3000/oauth",
    clientId: "0c2844d3d19dc9293fc5",
    redirectUri: "http://localhost:5173/ide/login",
    oauthUrl: "https://github.com/login/oauth/authorize",
  },
  sandbox: "https://nuc.land/sandbox",
};

export default config;
