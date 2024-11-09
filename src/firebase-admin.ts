import { App, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import "server-only";

import serviceKey from "@/service_key.json";

let app: App;

if (getApps().length === 0) {
    app = initializeApp({
        // @ts-expect-error The type definition of cert don't account for es6. This should be fine
        credential: cert(serviceKey),
    });
} else {
    app = getApp();
}

const adminDb = getFirestore(app);

export { app as adminApp, adminDb };
