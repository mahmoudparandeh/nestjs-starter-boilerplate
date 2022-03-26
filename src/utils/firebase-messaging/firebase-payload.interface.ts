import { DataMessagePayload } from 'firebase-admin/lib/messaging/messaging-api';

export interface FirebasePayload {
  data?: DataMessagePayload;
  notification?: NotificationPayload;
}

export interface NotificationPayload {
  title?: string;
  body?: string;
  image?: string;
  tag?: string;
  icon?: string;
  badge?: string;
  color?: string;
  sound?: string;
  bodyLocKey?: string;
  bodyLocArgs?: string;
  clickAction?: string;
  titleLocKey?: string;
  titleLocArgs?: string;
  [key: string]: string | undefined;
}
