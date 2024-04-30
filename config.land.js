const config = {
  name: "IDE",
  base: "/ide",
  api: "https://nuc.land/ide/api",
  expert: "https://nuc.land/ide/api/expert",
  oauth: {
    accessTokenUrl: "https://nuc.land/ide/api/oauth",
    clientId: "c391f0f4f1ad600a20ef",
    redirectUri: "https://nuc.land/callback/ide",
    oauthUrl: "https://github.com/login/oauth/authorize",
  },
  sandbox: "https://nuc.land/sandbox",
};

export default config;
