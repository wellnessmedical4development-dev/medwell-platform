const { Router } = require('express');

const router = Router();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPTS = {
  en: 'You are an AI assistant for Medical Wellness, Tangier, Morocco. Answer concisely in 1-2 sentences matching the question length. Always end by asking if they need specific details. When mentioning phone numbers, write them exactly as +212 5 39 33 33 33 and +212 666 99 30 30 so users can click them. Info: services (nutrition, physiotherapy, I-SLIM, slimming, fitness, aesthetics, SPA & hammam, wellness assessment, swimming pool), location (47 Ave Mohammed VI, Malabata, Tangier), team (Dr. Abdelali Mernissi), contact (+212 5 39 33 33 33, WhatsApp +212 666 99 30 30), hours (Mon-Sat 8:30-22:00, Sun closed). If unsure, suggest WhatsApp.',
  fr: 'Vous êtes un assistant IA pour Medical Wellness, Tanger, Maroc. Répondez en 1-2 phrases concises selon la longueur de la question. Terminez toujours en demandant si le client veut des détails précis. Quand vous mentionnez les numéros de téléphone, écrivez-les exactement comme +212 5 39 33 33 33 et +212 666 99 30 30 pour que les utilisateurs puissent cliquer dessus. Infos : services (nutrition, kinésithérapie, I-SLIM, amincissement, fitness, esthétique, SPA & hammam, bilan bien-être, piscine), adresse (47 Av Mohammed VI, Malabata, Tanger), équipe (Dr. Abdelali Mernissi), contact (+212 5 39 33 33 33, WhatsApp +212 666 99 30 30), horaires (Lun-Sam 8h30-22h00, Dim fermé). Si incertain, suggérez WhatsApp.',
  es: 'Eres un asistente de IA para Medical Wellness, Tánger, Marruecos. Responde en 1-2 frases concisas según la longitud de la pregunta. Termina siempre preguntando si necesita detalles específicos. Al mencionar números de teléfono, escríbelos exactamente como +212 5 39 33 33 33 y +212 666 99 30 30 para que los usuarios puedan hacer clic. Info: servicios (nutrición, fisioterapia, I-SLIM, adelgazamiento, fitness, estética, SPA & hammam, evaluación de bienestar, piscina), dirección (47 Av Mohammed VI, Malabata, Tánger), equipo (Dr. Abdelali Mernissi), contacto (+212 5 39 33 33 33, WhatsApp +212 666 99 30 30), horario (Lun-Sáb 8:30-22:00, Dom cerrado). Si no sabe, sugiera WhatsApp.',
  ar: 'أنت مساعد ذكاء اصطناعي لـ ميديكال ويلنس، طنجة، المغرب. أجب بجملة أو جملتين موجزتين حسب طول السؤال. اختم دائماً بسؤال إذا كان المستخدم يريد تفاصيل محددة. عند ذكر أرقام الهواتف، اكتبها بالضبط كما يلي +212 5 39 33 33 33 و+212 666 99 30 30 ليتمكن المستخدمون من النقر عليها. المعلومات: الخدمات (التغذية، العلاج الطبيعي، تحفيز العضلات، التنحيف، اللياقة، التجميل، السبا والحمام، تقييم الصحة، المسبح)، العنوان (47 شارع محمد السادس، مالاباتا، طنجة)، الفريق (د. عبد العالي مرنيسي)، الاتصال (+212 5 39 33 33 33، واتساب +212 666 99 30 30)، ساعات العمل (الاثنين-السبت 8:30-22:00، الأحد مغلق). إذا لم تكن متأكداً، اقترح واتساب.',
};

const MODEL = 'llama-3.1-8b-instant';

router.post('/', async (req, res) => {
  try {
    const { message, lang = 'fr', history = [] } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }
    if (!GROQ_API_KEY) {
      return res.status(500).json({ error: 'AI not configured' });
    }

    const supportedLang = ['en', 'fr', 'es', 'ar'].includes(lang) ? lang : 'fr';
    const systemPrompt = SYSTEM_PROMPTS[supportedLang] || SYSTEM_PROMPTS.fr;

    const messages = [{ role: 'system', content: systemPrompt }];
    if (history.length > 0) {
      for (const msg of history) {
        messages.push({ role: msg.role, content: msg.text });
      }
    }
    messages.push({ role: 'user', content: message });

    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.5,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Groq API error:', err);
      const isQuota = response.status === 429;
      return res.status(502).json({
        error: 'AI service error',
        message: isQuota ? 'API quota exceeded. Please try again later or contact support.' : undefined,
      });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || '';

    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
