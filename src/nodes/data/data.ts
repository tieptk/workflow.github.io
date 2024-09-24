import { nanoid } from 'nanoid';

export const dataListFlow = [
  {
    id: nanoid(8),
    name: 'Tag added',
    key: 'tag',
    icon: '/src/assets/icons/icon-tag.svg',
    description: (
      `<ul>
      <li>Send more relevant content</ li >
      <li>Track people's interests</li>
      <li> Turn new shoppers into regulars </li></ul>`
    ),
  },
  {
    id: nanoid(8),
    name: 'Signs up for Email',
    key: 'sign-up',
    icon: '/src/assets/icons/icon-signs.svg',
    description: (
      `<ul><li>Welcome new signups</li><li>Introduce your brand</li><li>Turn new contacts into new customers</li></ul>`
    )
  },
  {
    id: nanoid(8),
    name: 'Birthday',
    key: 'birthday',
    icon: '/src/assets/icons/icon-birthday.svg',
    description:
      (`<ul class="description-1lOza"><li>Send a special discount</li><li>Offer a free gift</li><li>Just say 'happy birthday'</li></ul>`),
  },
  {
    id: nanoid(8),
    name: 'Sent an email',
    key: 'send-an-email',
    icon: '/src/assets/icons/icon-email.svg',
    description: 'Contacts will enter the map when sent a bulk email.',
  },
  {
    id: nanoid(8),
    name: 'Buys a specific product',
    key: 'buy-product',
    icon: '/src/assets/icons/icon-buy.svg',
    description: 'You haven’t connected your store.',
  },
];

export const mainNode = [
  {
    key: 'sign-up',
    id: nanoid(8),
    type: 'input',
    icon: '/src/assets/icons/icon-signs.svg',
    name: 'Signs up for Email',
    position: { x: 250, y: 100 },
  },
  {
    id: nanoid(8),
    key: 'tag',
    type: 'input',
    icon: '/src/assets/icons/icon-tag.svg',
    name: 'Set a tag',
    position: { x: 250, y: 100 },
  },
  {
    id: nanoid(8),
    key: 'birthday',
    type: 'default',
    icon: '/src/assets/icons/icon-birthday.svg',
    name: 'Contact Birthday',
    position: { x: 250, y: 100 },
  },
  {
    id: nanoid(8),
    key: 'send-an-email',
    type: 'default',
    icon: '/src/assets/icons/icon-email.svg',
    name: 'Sent an email',
    position: { x: 250, y: 100 },
  },
  {
    id: nanoid(8),
    key: 'buy-product',
    type: 'default',
    icon: '/src/assets/icons/icon-buy.svg',
    name: 'Buys a specific product',
    position: { x: 250, y: 100 },
  },
];