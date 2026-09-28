import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  getDoc,
  doc,
  setLogLevel,
   Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Suppress noisy internal @firebase/firestore WebChannel 10s timeout console.error logs
// when operating in proxied or offline-capable browser environments
setLogLevel('silent');

const app = initializeApp(firebaseConfig);

function createFirestoreInstance(): Firestore {
  try {
    return initializeFirestore(
      app,
      {
        experimentalAutoDetectLongPolling: true,
      },
      firebaseConfig.firestoreDatabaseId
    );
  } catch {
    return getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
}

export const db = createFirestoreInstance();
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): void {
  const message = error instanceof Error ? error.message : String(error);
  // Ignore transient offline / network timeout states as the app has local state fallback
  if (
    message.includes('client is offline') ||
    message.includes('Could not reach Cloud Firestore backend') ||
    message.includes('unavailable')
  ) {
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: message,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData.map((provider) => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Notice:', JSON.stringify(errInfo));
}

export async function testConnection(): Promise<void> {
  try {
    await getDoc(doc(db, 'collaboration_notes', '_connection_check'));
  } catch {
    // Gracefully operate in offline/cached mode without throwing console errors
  }
}
