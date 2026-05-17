import { useTranslation } from 'react-i18next';

export function useLocalized() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.substring(0, 2) || 'ky';

  const getField = (obj, fieldBase) => {
    return obj[`${fieldBase}_${lang}`] || obj[`${fieldBase}_ky`] || '';
  };

  return { lang, getField };
}
