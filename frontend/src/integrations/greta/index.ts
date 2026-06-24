import { createGretaAuth, useGretaAuthCallback } from "@questlabs/auth-js";

export type { GretaUser } from "@questlabs/auth-js";
export { useGretaAuthCallback };

const gretaAuth = createGretaAuth();

type SignInOptions = {
  redirect_uri?: string;
  extraParams?: Record<string, string>;
};

export const greta = {
  auth: {
    signInWithOAuth: async (provider: "google", opts?: SignInOptions) => {
      const result = await gretaAuth.signInWithOAuth(provider, {
        redirect_uri: opts?.redirect_uri,
        extraParams: { ...opts?.extraParams },
      });
      return result;
    },
  },
};
