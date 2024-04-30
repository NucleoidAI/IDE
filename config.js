const config = {
  name: "IDE",
  base: "/ide",
  api: "https://nuc.land/ide/api",
  expert: "https://nuc.land/ide/api/expert",
  oauth: {
    accessTokenUrl: "http://localhost:3000/oauth",
    clientId: "0c2844d3d19dc9293fc5",
    redirectUri: "http://localhost:5173/callback",
    oauthUrl: "https://github.com/login/oauth/authorize",
  },
  sandbox: "https://nuc.land/sandbox",
};

export default config;
