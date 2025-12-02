# Firebase Security Rules

To enable the "Upload to Database" functionality, you need to update your Firebase Security Rules for both **Storage** and **Firestore**.

## 1. Storage Rules
Go to **Firebase Console > Storage > Rules** and replace the existing rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow anyone to read and write to the uploads folder
    // WARNING: For production, add authentication checks (request.auth != null)
    match /uploads/{allPaths=**} {
      allow read, write: if true;
    }
    
    // Default rule for other paths
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## 2. Firestore Rules
Go to **Firebase Console > Firestore Database > Rules** and replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read and write file metadata
    // WARNING: For production, add authentication checks
    match /files/{document=**} {
      allow read, write: if true;
    }
    
    // Default rule
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

> **Note:** These rules allow public access to facilitate testing. For a production app, you should implement Firebase Authentication and restrict access to authenticated users only.
