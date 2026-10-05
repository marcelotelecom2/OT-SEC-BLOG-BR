import React from 'react';
import Markdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sanitizeExternalUrl } from '../../lib/sanitizeUrl';

interface ArticleContentProps {
  content: string;
  className?: string;
}

const markdownComponents: Components = {
  h1: ({ children, ...props }) => (
    <h1
      className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-12 mb-6 tracking-tight font-sans leading-tight"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="text-xl sm:text-2xl md:text-[28px] font-bold text-white mt-12 mb-5 pt-6 border-t border-gray-800/80 tracking-tight font-sans leading-snug flex items-center gap-3"
      {...props}
    >
      <span className="w-1.5 h-6 bg-cyan-400 rounded-full shrink-0 inline-block" />
      <span>{children}</span>
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="text-lg sm:text-xl md:text-[22px] font-semibold text-gray-100 mt-8 mb-3 tracking-tight font-sans leading-snug"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4
      className="text-base sm:text-lg font-semibold text-gray-200 mt-6 mb-2 tracking-tight font-sans"
      {...props}
    >
      {children}
    </h4>
  ),
  p: ({ children, ...props }) => (
    <p
      className="mb-6 leading-[1.75] text-[16px] sm:text-[18px] text-gray-300 font-sans font-normal break-words"
      {...props}
    >
      {children}
    </p>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-white" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic text-gray-200" {...props}>
      {children}
    </em>
  ),
  ul: ({ children, ...props }) => (
    <ul
      className="my-6 ml-6 list-disc space-y-2.5 text-[16px] sm:text-[18px] text-gray-300 leading-[1.75] marker:text-cyan-400"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="my-6 ml-6 list-decimal space-y-2.5 text-[16px] sm:text-[18px] text-gray-300 leading-[1.75] marker:text-cyan-400 marker:font-mono"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="pl-1.5" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-cyan-500 bg-cyan-950/20 rounded-r-lg px-5 py-4 my-8 text-gray-200 font-sans leading-[1.75] text-[17px] sm:text-[19px] italic shadow-sm [&>p]:mb-0"
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: ({ ...props }) => (
    <hr className="my-10 border-t border-gray-800/80" {...props} />
  ),
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith('http://') || href?.startsWith('https://');
    const safeHref = isExternal ? sanitizeExternalUrl(href) || '#' : href || '#';
    return (
      <a
        href={safeHref}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/40 hover:decoration-cyan-400 transition-colors font-medium"
        {...props}
      >
        {children}
      </a>
    );
  },
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-8 border border-gray-800/90 rounded-lg bg-gray-950/40 shadow-md">
      <table className="w-full text-left border-collapse text-sm sm:text-base font-sans" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-gray-900/80 border-b border-gray-800 text-gray-200 text-xs sm:text-sm uppercase font-mono tracking-wider" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => (
    <tbody className="divide-y divide-gray-800/60 text-gray-300" {...props}>
      {children}
    </tbody>
  ),
  th: ({ children, ...props }) => (
    <th className="py-3 px-4 font-semibold text-gray-100" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="py-3 px-4 leading-relaxed" {...props}>
      {children}
    </td>
  ),
  tr: ({ children, ...props }) => (
    <tr className="hover:bg-gray-900/30 transition-colors" {...props}>
      {children}
    </tr>
  ),
  pre: ({ children, ...props }) => (
    <pre
      className="my-8 overflow-x-auto rounded-lg border border-gray-800 bg-gray-950/90 p-4 sm:p-5 font-mono text-xs sm:text-sm text-gray-200 leading-relaxed shadow-inner"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }: any) => {
    const isCodeBlock = className && String(className).startsWith('language-');
    if (isCodeBlock) {
      return (
        <code className={`font-mono text-gray-200 ${className || ''}`} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded bg-gray-800/80 px-1.5 py-0.5 font-mono text-[0.875em] text-cyan-300 border border-gray-700/50"
        {...props}
      >
        {children}
      </code>
    );
  },
  img: ({ src, alt, ...props }) => {
    const safeSrc = sanitizeExternalUrl(src) || src || '';
    return (
      <figure className="my-8 sm:my-10 w-full">
        <img
          src={safeSrc}
          alt={alt || ''}
          className="w-full h-auto rounded-lg border border-gray-800 shadow-xl object-cover"
          loading="lazy"
          {...props}
        />
        {alt && (
          <figcaption className="mt-2.5 text-center text-xs sm:text-sm font-mono text-gray-400 tracking-wide">
            {alt}
          </figcaption>
        )}
      </figure>
    );
  }
};

export function ArticleContent({ content, className = '' }: ArticleContentProps) {
  return (
    <div className={`article-editorial-content ${className}`}>
      <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </Markdown>
    </div>
  );
}
