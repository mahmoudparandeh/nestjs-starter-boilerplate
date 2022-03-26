import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebasePayload } from './firebase-payload.interface';
import { FirebaseOptions } from './firebase-options.interface';

@Injectable()
export class FirebaseService {
  async sendMessageToDevice(
    deviceIds: string | string[],
    payload?: FirebasePayload,
    options?: FirebaseOptions,
  ) {
    await admin.messaging().sendToDevice(deviceIds, payload, options);
  }

  async sendMessageToTopic(
    topic: string,
    payload?: FirebasePayload,
    options?: FirebaseOptions,
  ) {
    await admin.messaging().sendToTopic(topic, payload, options);
  }
}
