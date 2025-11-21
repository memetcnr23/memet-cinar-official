rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    /*********** KULLANICI PROFİLLERİ ***********/
    match /users/{uid} {
      allow read: if true;
      allow create, update: if request.auth != null && request.auth.uid == uid;
      allow delete: if false;
    }

    /*********** ŞARKI SÖZLERİ ***********/
    match /lyrics/{songKey} {
      allow read: if true;
      allow create, update: if request.auth != null
        && request.resource.data.keys().hasAll(['text'])
        && request.resource.data.text is string
        && request.resource.data.text.size() > 0
        && request.resource.data.text.size() <= 5000;
      allow delete: if false;
    }
  }
}
