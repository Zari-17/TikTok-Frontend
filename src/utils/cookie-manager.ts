import { getCookie, setCookie, deleteCookie, hasCookie } from "cookies-next/client";
import { NextPageContext } from "next";
import { getCookie as getCookieAtServer } from "cookies-next/server";

export const clientCookieManager = {
  set(name: string, value: string, days: number) {
    setCookie(name, value, {
      expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    });
  },

  get(name: string) {
    return getCookie(name);
  },

  delete(name: string) {
    deleteCookie(name);
  },

  has(name: string) {
    return hasCookie(name);
  },
};

export const serverCookieManager = (nextPage: NextPageContext) => {
  return {
    async get(name: string) {
      return await getCookieAtServer(name, { req: nextPage.req, res: nextPage.res });
    },
  };
};
