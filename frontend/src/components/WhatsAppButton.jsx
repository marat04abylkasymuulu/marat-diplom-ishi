import { FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { getWhatsAppLink } from '../utils/whatsapp';

export default function WhatsAppButton() {
  const { i18n } = useTranslation();

  const messages = {
    ky: 'Саламатсызбы! Курстар жөнүндө маалымат алгым келет.',
    ru: 'Здравствуйте! Хочу узнать о курсах.',
    en: 'Hello! I would like to learn about courses.',
  };

  const lang = i18n.language?.substring(0, 2) || 'ky';
  const message = messages[lang] || messages.ky;

  return (
    <a
      href={getWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-40 rounded-2xl bg-emerald-500 p-4 text-white shadow-2xl shadow-emerald-900/30 ring-4 ring-white/90 transition-all duration-300 hover:scale-105 hover:bg-emerald-400"
      aria-label="WhatsApp"
    >
      <FaWhatsapp size={28} />
      <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-sm font-medium text-slate-800 opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
        WhatsApp
      </span>
    </a>
  );
}
