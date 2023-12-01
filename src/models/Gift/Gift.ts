import { builder } from '../../builder';

export const Gift = builder.prismaObject('Gift', {
  name: 'Gift',
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    cost: t.exposeString('cost', { nullable: true }),
  }),
});

import './queries/gifts';
import './mutations/createGift';
import './mutations/deleteGift';
import './mutations/updateGift';
import { nullable } from 'zod';
