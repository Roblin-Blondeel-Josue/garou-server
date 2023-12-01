import { builder, paginationArgs, paginationPrismaArgs } from '../../builder';
import { hasRoles } from '../../utils/hasRoles';

import './queries/me';
import './queries/user';
import './queries/users';
import './queries/usersCount';
import './queries/isUsernameTaken';

import './mutations/signIn';
import './mutations/signUp';
import './mutations/signOut';
import './mutations/updateUser';
import './mutations/updatePassword';
import './mutations/deleteUser';
import './mutations/endOnboarding';
import './mutations/forgotPassword';
import './mutations/resetPassword';

export const User = builder.prismaObject('User', {
  name: 'User',
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', {
      type: 'DateTime',
      authScopes(parent, args, ctx, info) {
        if (hasRoles(ctx?.user, 'admin')) return true;
        return ctx?.user?.id === parent.id;
      },
    }),
    updatedAt: t.expose('updatedAt', {
      type: 'DateTime',
      nullable: true,
      authScopes(parent, args, ctx, info) {
        if (hasRoles(ctx?.user, 'admin')) return true;
        return ctx?.user?.id === parent.id;
      },
    }),
    email: t.exposeString('email'),
    username: t.exposeString('username', {
      nullable: true,
    }),
    firstName: t.exposeString('firstName', {
      nullable: true,
    }),
    lastName: t.exposeString('lastName', {
      nullable: true,
    }),
    birthDate: t.expose('birthDate', {
      type: 'DateTime',
      nullable: true,
    }),
    role: t.exposeString('role', {
      nullable: true,
    }),
  }),
});

export enum UserStatusEnum {
  created = 'created',
  onboarded = 'onboarded',
  validated = 'validated',
  blocked = 'blocked',
}

export const UserStatusEnumType = builder.enumType('UserStatusEnumType', {
  values: ['created', 'onboarded', 'validated'] as const,
});
