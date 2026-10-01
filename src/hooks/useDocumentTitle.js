import { useEffect } from 'react';

export const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | [BRAND_NAME]` : '[BRAND_NAME] | Gourmet Italian Mushroom Delicacies';
  }, [title]);
};
