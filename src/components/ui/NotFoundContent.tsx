import type { ArticleLanguage } from '../../types';

export const NOT_FOUND_MESSAGES = {
  en: {
    title: 'Page not found',
    description: 'This page does not exist or is no longer available.',
    home: 'Go to homepage',
    articles: 'Browse articles',
  },
  pt: {
    title: 'Página não encontrada',
    description: 'Esta página não existe ou não está mais disponível.',
    home: 'Ir para o início',
    articles: 'Explorar artigos',
  },
  es: {
    title: 'Página no encontrada',
    description: 'Esta página no existe o ya no está disponible.',
    home: 'Ir al inicio',
    articles: 'Explorar artículos',
  },
};

export function NotFoundContent({ language }: { language: ArticleLanguage }) {
  const message = NOT_FOUND_MESSAGES[language];
  return (
    <section data-not-found-page className="max-w-3xl mx-auto px-4 py-24 text-center cursor-auto!">
      <p className="font-mono text-cyan-400 text-sm tracking-widest mb-4">404</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{message.title}</h1>
      <p className="text-gray-400 mb-8">{message.description}</p>
      <div className="flex flex-wrap justify-center gap-4">
        <a href="/" className="inline-flex items-center min-h-11 px-5 py-3 rounded bg-cyan-400 text-black font-semibold hover:bg-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 cursor-pointer!">{message.home}</a>
        <a href="/articles" className="inline-flex items-center min-h-11 px-5 py-3 rounded border border-gray-700 text-gray-200 hover:border-cyan-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 cursor-pointer!">{message.articles}</a>
      </div>
    </section>
  );
}
