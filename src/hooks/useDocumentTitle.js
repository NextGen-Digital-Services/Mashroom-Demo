import { useEffect } from 'react';
import { siteConfig } from '../data/siteConfig';

export const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} | ${siteConfig.subtitle}`;
  }, [title]);
};
