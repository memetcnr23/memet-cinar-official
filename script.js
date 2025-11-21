rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    /*********** KULLANICI PROFİLLERİ ***********/
    match /users/{uid} {

      // Herkes kullanıcı profillerini okuyabilir
      allow read: if true;

      // Sadece kendi dokümanını oluşturup/güncelleyebilir
      allow create, update: if request.auth != null
                            && request.auth.uid == uid;

      // Silmeye izin yok
      allow delete: if false;
    }

    /*********** ŞARKI SÖZLERİ ***********/
    match /lyrics/{songKey} {

      // Herkes şarkı sözlerini okuyabilir
      allow read: if true;

      // Yalnızca giriş yapan kullanıcılar söz kaydedebilir / güncelleyebilir
      allow create, update: if request.auth != null
        // 'text' alanı mutlaka olmalı
        && request.resource.data.keys().hasAll(['text'])
        // string olmalı
        && request.resource.data.text is string
        // boş olmasın
        && request.resource.data.text.size() > 0
        // çok uzun olmasın
        && request.resource.data.text.size() <= 5000;

      // Söz silinmesin (istersen açabilirsin)
      allow delete: if false;
    }
  }
}
