import { useSyncExternalStore } from 'react';

const subscribe = (callback) => {
  const observer = new MutationObserver(callback);
  observer.observe(document.body.parentElement, { attributes: true, subtree: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
};

const getSnapshot = () => !!document.querySelector('.dark');

const useDarkMode = () => useSyncExternalStore(subscribe, getSnapshot);

export default useDarkMode;
