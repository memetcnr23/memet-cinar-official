// server.js

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

// .env dosyasındaki anahtarı kullan
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

// LONCA YAPAY ZEKA ENDPOINT
app.post("/lonca-ai", async (req, res) => {
  const userMessage = (req.body && req.body.message) || "";

  if (!userMessage.trim()) {
    return res.json({
      answer: "Boş bir mesaj gönderdin, birkaç kelime daha ekleyebilirsin 🙂",
    });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // istersen gpt-4o da yazabilirsin
      messages: [
        {
          role: "system",
          content:
            "Sen Türkçe konuşan, Memet Çınar'ın web paneli için özel lonca yapay zekâ asistanısın. " +
            "Kullanıcıya oyun temalı, samimi ama saygılı bir dille cevap ver. Küfür / hakaret yok. " +
            "Bilgi sorularında net ol, matematik işlemlerini düzgün hesapla, istenirse şarkı sözü taslakları üret.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      temperature: 0.7,
    });

    const answer =
      completion.choices?.[0]?.message?.content ||
      "Şu an cevap üretemedim, cümleyi biraz daha net yazar mısın?";

    res.json({ answer });
  } catch (err) {
    console.error("OpenAI hata:", err);
    res.status(500).json({
      answer:
        "Sunucu tarafında bir hata oluştu. API anahtarı doğru mu, internet bağlantısı var mı kontrol eder misin?",
    });
  }
});

// SUNUCUYU BAŞLAT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Lonca AI sunucusu http://localhost:" + PORT + " üzerinde çalışıyor");
});
