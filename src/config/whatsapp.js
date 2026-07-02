const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '+212xxxxxxxxx';

const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`;

const getWhatsAppUrl = (text) => {
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(text)}`;
};

module.exports = { WHATSAPP_NUMBER, WHATSAPP_BASE_URL, getWhatsAppUrl };
