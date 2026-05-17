const WHATSAPP_NUMBER = '996555000000';

export function getWhatsAppLink(message = '') {
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
}
