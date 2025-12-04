# 🎬 Video Demo Scripts

Bu klasörde video çekimi için iki yardımcı script bulunmaktadır.

## 📹 demo-script.sh - Otomatik Demo

**Ne yapar?**
- Repo'yu sıfırdan klonlar
- Tüm bağımlılıkları kurar
- Playground'u başlatır
- Örnek proje oluşturur
- Testleri çalıştırır
- Şablonları gösterir

**Nasıl kullanılır?**

### 1. Ekran kaydını başlat
- **macOS:** `Cmd + Shift + 5` → "Record Entire Screen"
- **Loom:** Loom uygulamasını aç → "Record Screen"

### 2. Scripti çalıştır
```bash
cd ~/zazy/zama-bounty-hub
./demo-script.sh
```

### 3. Adımları takip et
Script her adımda duracak ve `ENTER` tuşuna basmanızı bekleyecek.

**Her adımda ne yapmalısınız:**
1. Ekranda çıkan komutları okuyun
2. `ENTER`'a basın
3. Çıktıyı izleyin (2-3 saniye)
4. Sonraki adıma geçin

### 4. Tarayıcıyı göster
Script "Playground running" dediğinde:
- Tarayıcıda `http://localhost:3000` açın
- FHE Simulator'ı kullanın
- Template kartlarını gösterin
- Terminal'e dönün ve `ENTER`'a basın

### 5. Kaydı durdur
Demo bitince ekran kaydını durdurun.

---

## 🔗 add-video-link.sh - Video Linki Ekleyici

**Ne yapar?**
- Video linkinizi README.md'ye ekler
- Otomatik commit yapar
- GitHub'a pushlar

**Nasıl kullanılır?**

### 1. Videoyu yükle
- YouTube'a "Unlisted" olarak yükleyin
- Veya Loom'da paylaşın

### 2. Linki kopyala
- YouTube: `https://youtu.be/VIDEO_ID`
- Loom: `https://loom.com/share/VIDEO_ID`

### 3. Scripti çalıştır
```bash
cd ~/zazy/zama-bounty-hub
./add-video-link.sh
```

### 4. Linki yapıştır
```
📹 Enter your demo video link:
   Link: [BURAYA YAPIŞTIRIN]
```

### 5. Onayla
```
🚀 Ready to commit and push to GitHub?
   Continue? (y/n): y
```

Script otomatik olarak:
- ✅ README.md'yi güncelleyecek
- ✅ Git commit yapacak
- ✅ GitHub'a pushlayacak

---

## 💡 İpuçları

### Demo Script İçin
- **Yavaş konuşun:** Her adımı açıklayın
- **Pause yapın:** Çıktıları izleyicinin görmesi için bekleyin
- **Hata olursa:** `Ctrl+C` ile durdurun, scripti yeniden başlatın

### Video Kaydı İçin
- **Mikrofon:** Arka plan gürültüsünü minimize edin
- **Ekran:** 1920x1080 çözünürlük kullanın
- **Terminal Font:** 14-16pt (okunabilir olmalı)
- **Süre:** 3-4 dakika ideal

### Temizlik
Demo sonrası temizlik için:
```bash
# Playground'u durdur
kill [PID]  # Script size PID'yi verecek

# Demo dosyalarını sil
rm -rf ~/Desktop/zama-demo
```

---

## 🎯 Hızlı Başlangıç

**Tek komutla video çekimi:**
```bash
# 1. Ekran kaydını başlat (Cmd + Shift + 5)
# 2. Scripti çalıştır
./demo-script.sh

# 3. Her adımda ENTER'a bas
# 4. Playground'u tarayıcıda göster
# 5. Kaydı durdur
# 6. Videoyu yükle
# 7. Linki ekle
./add-video-link.sh
```

---

## ❓ Sorun Giderme

**"Permission denied" hatası:**
```bash
chmod +x demo-script.sh add-video-link.sh
```

**"npm: command not found":**
```bash
# Node.js yüklü değil, önce yükleyin:
brew install node
```

**Playground başlamıyor:**
```bash
# Port 3000 kullanımda olabilir
lsof -ti:3000 | xargs kill
```

**Script ortada takılıyor:**
```bash
# Ctrl+C ile durdurun
# Temizlik yapın:
rm -rf ~/Desktop/zama-demo
# Yeniden başlatın
./demo-script.sh
```

---

## 📊 Beklenen Süre

| Adım | Süre |
|------|------|
| Klonlama | 5-10 saniye |
| Bağımlılık kurulumu | 30-60 saniye |
| Playground başlatma | 5-10 saniye |
| Proje oluşturma | 30-45 saniye |
| Test çalıştırma | 10-15 saniye |
| **Toplam** | **~2-3 dakika** |

---

**Hazırsınız!** 🚀 Ekran kaydını başlatın ve `./demo-script.sh` komutunu çalıştırın.
