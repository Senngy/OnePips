import { Permission, Role } from '../../../generated/prisma/client.js';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: Object.values(Permission),

  [Role.ADMIN]: [
    Permission.LEADS_READ,
    Permission.LEADS_WRITE,
    Permission.LEADS_DELETE,

    Permission.APPLICATIONS_READ,
    Permission.APPLICATIONS_WRITE,

    Permission.BOOKINGS_READ,
    Permission.BOOKINGS_WRITE,

    Permission.PAYMENTS_READ,
    Permission.PAYMENTS_WRITE,

    Permission.EVENTS_READ,
    Permission.EVENTS_WRITE,
    Permission.EVENTS_DELETE,

    Permission.COMMUNITY_READ,
    Permission.COMMUNITY_WRITE,

    Permission.SETTINGS_MANAGE,

    Permission.USERS_READ,
    Permission.USERS_MANAGE,

    Permission.FILES_UPLOAD,
  ],

  [Role.MANAGER]: [
    Permission.LEADS_READ,
    Permission.LEADS_WRITE,

    Permission.APPLICATIONS_READ,

    Permission.BOOKINGS_READ,

    Permission.EVENTS_READ,
  ],

  [Role.EDITOR]: [
    Permission.EVENTS_READ,
    Permission.EVENTS_WRITE,

    Permission.COMMUNITY_READ,
    Permission.COMMUNITY_WRITE,

    Permission.FILES_UPLOAD,
  ],

  [Role.VIEWER]: [
    Permission.LEADS_READ,
    Permission.APPLICATIONS_READ,
    Permission.BOOKINGS_READ,
    Permission.EVENTS_READ,
    Permission.COMMUNITY_READ,
  ],

  [Role.CUSTOMER]: [],
};
