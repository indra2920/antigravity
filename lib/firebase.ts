import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
        console.error("Missing Firebase Credentials:", {
            projectId: !!projectId,
            clientEmail: !!clientEmail,
            privateKey: !!privateKey
        });
        throw new Error("Missing Firebase Credentials in .env");
    }

    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
        console.log('Firebase Admin Initialized');
    } catch (error) {
        console.error('Firebase admin initialization error', error);
        throw error; // Re-throw to prevent using uninitialized app
    }
}

// Only export if initialized successfully
const firestore = admin.firestore();

export { firestore };
