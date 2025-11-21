rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Kullanıcı profilleri
    match /users/{uid} {
      // Herkes kullanıcı profillerini okuyabilir (isteğe göre kapatılabilir)
      allow read: if true;

      // Sadece kendi profilini yazabilir / güncelleyebilir
      allow write: if request.auth != null && request.auth.uid == uid;
    }

    // Şarkı sözleri koleksiyonu
    match /lyrics/{songKey} {
      // Herkes şarkı sözlerini görebilir
      allow read: if true;

      // Sadece giriş yapan kullanıcılar söz kaydedebilir/güncelleyebilir
      allow create, update: if request.auth != null
        && request.resource.data.text is string
        && request.resource.data.text.size() > 0
        && request.resource.data.text.size() <= 5000;

      // Silme işlemini kapattım (istersen burada da kural yazıp açabilirsin)
      allow delete: if false;
    }

    // Diğer her şey kapalı
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
