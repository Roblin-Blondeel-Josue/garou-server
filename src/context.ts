import { verify } from 'jsonwebtoken';
import express from 'express';
import { db } from './db';
import { getIp } from './utils/getIp';
import { env } from './env';

type ContextUser = {
  id: string;
  email: string;
  role: string;
  status: string;
} | null;

export interface Context {
  user: ContextUser;
  request: express.Request;
  response: express.Response;
  ip: string;
}

export interface Token {
  id: string;
  exp: number;
  iat: number;
  iss: string;
}

declare module 'express-session' {
  interface SessionData {
    userId: string;
    region: string;
  }
}

export default async function context(context: any): Promise<Context> {
  const ip = getIp(context.req);
  let user: ContextUser = null;
  try {
    if (context.req.session?.userId) {
      let prismaUser = await db.user.findUnique({
        where: { id: context.req.session?.userId },
        select: {
          id: true,
          role: true,
          email: true,
          status: true,
        },
      });
      if (prismaUser) {
        user = {
          ...prismaUser,
          role: prismaUser?.role ? prismaUser.role : 'Joueur',
        };
      }
      console.log(`${user?.email} is logged in with session`);
    } else {
      let bearerToken: string | null = null;
      const { authorization } = context?.req?.headers;
      if (authorization) {
        bearerToken = authorization;
      }
      if (bearerToken) {
        const bearerTokenArray: Array<string> = bearerToken.split(' ');
        let token = bearerTokenArray[1];
        const verifiedToken = verify(token, env.TOKEN_SECRET, {
          issuer: env.ISSUER,
        }) as any;
        if (verifiedToken && verifiedToken.userId) {
          let id = verifiedToken.userId;
          if (!id || id === undefined || id === '') {
            user = null;
          } else {
            let prismaUser = await db.user.findUnique({
              where: { id },
              select: {
                id: true,
                role: true,
                email: true,
              },
            });
            if (prismaUser) {
              user = {
                ...prismaUser,
                role: prismaUser?.role ? prismaUser.role : 'Joueur',
              };
            }
            console.log(`${user?.email} is logged in with token`);
          }
        }
      }
    }

    return {
      user,
      request: context.req,
      response: context.res,
      ip,
    };
  } catch (e: any) {
    console.error('context', e?.message);
    return {
      user,
      request: context.req,
      response: context.res,
      ip,
    };
  }
}
