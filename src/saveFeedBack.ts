/* eslint-disable @typescript-eslint/no-require-imports */
import fs from 'fs';
const path = require('path');

// Veri seti dosyasının yolunu belirleyin
const dataFilePath = path.join(__dirname, 'feedbackData.json');

// Geri bildirimi JSON dosyasına yazma fonksiyonu
function saveFeedback(newFeedback: { interaction_id: string; user_id: string; timestamp: string; content_generated: { input_prompt: string; response: string; }; user_feedback: { rating: string; feedback_text: string; preferred_response: string; }; feedback_metadata: { device: string; session_duration: number; }; }) {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Dosya okunamadı:', err);
            return;
        }

        let feedbackData = [];
        if (data) {
            feedbackData = JSON.parse(data); // Mevcut veriyi parse et
        }

        feedbackData.push(newFeedback); // Yeni geri bildirimi ekle

        // JSON dosyasına geri bildirimleri yaz
        fs.writeFile(dataFilePath, JSON.stringify(feedbackData, null, 2), (err) => {
            if (err) {
                console.error('Veri dosyaya yazılamadı:', err);
            } else {
                console.log('Geri bildirim başarıyla kaydedildi!');
            }
        });
    });
}

// Test etmek için bir geri bildirim oluştur
const feedback = {
    interaction_id: '12345',
    user_id: 'user_001',
    timestamp: new Date().toISOString(),
    content_generated: {
        input_prompt: 'Verimliliğimi nasıl artırabilirim?',
        response: 'Verimliliğinizi artırmak için şunları deneyebilirsiniz...'
    },
    user_feedback: {
        rating: 'like',
        feedback_text: 'Harika!',
        preferred_response: ''
    },
    feedback_metadata: {
        device: 'desktop',
        session_duration: 45
    }
};

// Geri bildirimi kaydet
saveFeedback(feedback);
