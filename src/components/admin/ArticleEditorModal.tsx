import React, { useState, useEffect, useMemo, Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Save, Check, AlertTriangle, Bug, Eye, Edit3, ShieldCheck,
  ShieldAlert, Sparkles, ExternalLink, Image as ImageIcon,
  Upload, X, RefreshCw, FileText, Clock, Tag, Calendar, CheckCircle2,
  Info, AlertCircle, Link2, Copy
} from 'lucide-react';
import { Article, ArticleLanguage, ArticleTranslation, MediaItem } from '../../types';
import { ArticleContent } from '../article/ArticleContent';
import { downloadArticleExport } from '../../lib/articleExport';
import { useLanguage } from '../../context/LanguageContext';
import { localizeArticleArea } from '../../lib/articleLocalization';

const ARTICLE_AREAS = [
  'ICS Security', 'Artificial Intelligence', 'Network Engineering', 'Power Grid Security',
  'Vulnerability Analysis', 'Threat Intelligence', 'Technical Standards', 'Regulation Update',
];

// Error Boundary for Live Preview
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class PreviewErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Preview render error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-rose-950/40 border border-rose-800/80 rounded-lg text-rose-300 font-mono text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-rose-400">
            <Bug className="w-5 h-5" />
            <span>BUG DETECTADO NA RENDERIZAÇÃO DA PÁGINA</span>
          </div>
          <p>
            O conteúdo inserido possui caracteres ou sintaxe que gerou uma exceção no componente de renderização:
          </p>
          <pre className="p-3 bg-black/60 rounded border border-rose-900/60 overflow-x-auto text-[11px] text-rose-200">
            {this.state.error?.message || 'Erro desconhecido'}
          </pre>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-3 py-1 bg-rose-900 hover:bg-rose-800 text-white rounded text-[11px]"
          >
            Tentar Renderizar Novamente
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

interface ArticleEditorModalProps {
  article: Partial<Article>;
  existingArticles: Article[];
  onClose: () => void;
  onSave: (article: Article) => Promise<void>;
  uploadImage: (file: File) => Promise<MediaItem>;
  onOpenMediaPicker: (mode: 'cover' | 'content') => void;
}

interface BugReportItem {
  id: string;
  type: 'error' | 'warning' | 'pass';
  title: string;
  message: string;
  field?: keyof Article;
  fixAction?: {
    label: string;
    action: () => void;
  };
}

export function ArticleEditorModal({
  article,
  existingArticles,
  onClose,
  onSave,
  uploadImage,
  onOpenMediaPicker
}: ArticleEditorModalProps) {
  const { language } = useLanguage();
  // Form State
  const [editorId] = useState(() => article.id || Date.now().toString());
  const [title, setTitle] = useState(article.title || '');
  const [slug, setSlug] = useState(article.slug || '');
  const [area, setArea] = useState(article.area || 'ICS Security');
  const [readTime, setReadTime] = useState(article.readTime || '10 min read');
  const [date, setDate] = useState(article.date || new Date().toISOString().split('T')[0]);
  const [summary, setSummary] = useState(article.summary || '');
  const [content, setContent] = useState(article.content || '');
  const [coverImage, setCoverImage] = useState(article.coverImage || '');
  const [published, setPublished] = useState(article.published ?? true);
  const [sourceLanguage, setSourceLanguage] = useState<ArticleLanguage>(article.sourceLanguage ?? 'pt');
  const [translations, setTranslations] = useState<Article['translations']>(() => structuredClone(article.translations ?? {}));

  // Editor Tabs
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'diagnostics'>('editor');

  // UI Feedback States
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveFeedbackMessage, setSaveFeedbackMessage] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingContentImg, setIsUploadingContentImg] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Mark dirty whenever values change
  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
    if (saveState === 'saved') setSaveState('idle');
  };

  // Helper to slugify
  const generateSlugFromTitle = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Initialize slug if empty
  useEffect(() => {
    if (!slug && title) {
      setSlug(generateSlugFromTitle(title));
    }
  }, []);

  // Sync external updates from Media Picker (library)
  useEffect(() => {
    if (article.coverImage !== undefined && article.coverImage !== coverImage) {
      setCoverImage(article.coverImage);
      setIsDirty(true);
    }
  }, [article.coverImage]);

  useEffect(() => {
    if (article.content !== undefined && article.content !== content) {
      setContent(article.content);
      setIsDirty(true);
    }
  }, [article.content]);

  // Compute Word Count & Auto Read Time
  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  const autoReadTime = useMemo(() => {
    const minutes = Math.max(1, Math.ceil(wordCount / 180));
    return `${minutes} min read`;
  }, [wordCount]);

  // Real-Time Bug & Quality Diagnostic Engine
  const diagnosticReport = useMemo(() => {
    const items: BugReportItem[] = [];

    // 1. Title Validation
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      items.push({
        id: 'title-empty',
        type: 'error',
        title: 'Título ausente',
        message: 'O título do artigo é obrigatório para visualização e indexação da página.',
        field: 'title'
      });
    } else if (cleanTitle.length < 8) {
      items.push({
        id: 'title-short',
        type: 'warning',
        title: 'Título muito conciso',
        message: 'Títulos com menos de 8 caracteres podem prejudicar o SEO e clareza do tópico.',
        field: 'title'
      });
    } else {
      items.push({
        id: 'title-ok',
        type: 'pass',
        title: 'Título válido e legível',
        message: `Título com ${cleanTitle.length} caracteres configurado corretamente.`
      });
    }

    // 2. Slug Validation & Route Integrity
    const cleanSlug = slug.trim();
    if (!cleanSlug) {
      items.push({
        id: 'slug-empty',
        type: 'error',
        title: 'Slug da rota não definido',
        message: 'As rotas /en|pt|es/articles/[slug] ficarão inacessíveis sem um identificador de URL.',
        field: 'slug',
        fixAction: {
          label: 'Gerar do Título',
          action: () => {
            const newSlug = generateSlugFromTitle(title) || `article-${Date.now()}`;
            setSlug(newSlug);
            markDirty();
          }
        }
      });
    } else {
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(cleanSlug)) {
        items.push({
          id: 'slug-invalid',
          type: 'error',
          title: 'Slug com caracteres inválidos',
          message: 'O slug deve conter apenas letras minúsculas sem acentos, números e hífens (ex: analise-malware-plc).',
          field: 'slug',
          fixAction: {
            label: 'Normalizar Slug',
            action: () => {
              setSlug(generateSlugFromTitle(cleanSlug));
              markDirty();
            }
          }
        });
      } else {
        // Collision check
        const isDuplicate = existingArticles.some(
          a => a.id !== article.id && a.slug === cleanSlug
        );
        if (isDuplicate) {
          items.push({
            id: 'slug-duplicate',
            type: 'error',
            title: 'Conflito de rota (Slug duplicado)',
            message: `Já existe outro artigo publicado utilizando o slug "/en/articles/${cleanSlug}". Escolha um slug único para evitar conflito de rotas.`,
            field: 'slug',
            fixAction: {
              label: 'Adicionar sufixo numérico',
              action: () => {
                setSlug(`${cleanSlug}-2`);
                markDirty();
              }
            }
          });
        } else {
          items.push({
            id: 'slug-ok',
            type: 'pass',
            title: 'Slug da rota válido e único',
            message: `Acessível em /en/articles/${cleanSlug}`
          });
        }
      }
    }

    // 3. Summary / Abstract Validation
    const cleanSummary = summary.trim();
    if (!cleanSummary) {
      items.push({
        id: 'summary-empty',
        type: 'error',
        title: 'Resumo / Abstract obrigatório',
        message: 'O resumo é utilizado na tag OpenGraph, cards da home, meta description de SEO e parágrafo de introdução.',
        field: 'summary'
      });
    } else if (cleanSummary.length < 25) {
      items.push({
        id: 'summary-short',
        type: 'warning',
        title: 'Resumo muito curto',
        message: 'Recomendamos um resumo com pelo menos 40 caracteres para bom destaque nos cards técnicos.',
        field: 'summary'
      });
    } else {
      items.push({
        id: 'summary-ok',
        type: 'pass',
        title: 'Resumo configurado para SEO & OpenGraph',
        message: `${cleanSummary.length} caracteres estruturados para os cards.`
      });
    }

    // 4. Markdown Syntax & Layout Bug Detection
    const codeFenceMatches = content.match(/```/g) || [];
    if (codeFenceMatches.length % 2 !== 0) {
      items.push({
        id: 'code-fence-unclosed',
        type: 'error',
        title: 'Bloco de código não finalizado (Bug de layout)',
        message: 'Detectado número ímpar de delimitadores ```. Faltam crases triplas ``` para fechar um bloco de código, o que transformaria o restante da página em texto pré-formatado.',
        field: 'content',
        fixAction: {
          label: 'Fechar bloco com ```',
          action: () => {
            setContent(prev => prev + '\n```\n');
            markDirty();
          }
        }
      });
    } else {
      items.push({
        id: 'code-fence-ok',
        type: 'pass',
        title: 'Sintaxe de código íntegra',
        message: 'Todos os blocos de código foram fechados com segurança.'
      });
    }

    // Check broken markdown links: [text]( without closing )
    const brokenLinkRegex = /\[([^\]]+)\]\(([^)\s]*)$/m;
    if (brokenLinkRegex.test(content)) {
      items.push({
        id: 'broken-link-syntax',
        type: 'warning',
        title: 'Link Markdown com parêntese aberto',
        message: 'Foi identificada uma sintaxe de link iniciada sem o fechamento com parêntese `)` correspondente.',
        field: 'content'
      });
    }

    // Check empty body
    if (!content.trim()) {
      items.push({
        id: 'content-empty',
        type: 'warning',
        title: 'Corpo do artigo em branco',
        message: 'O artigo não contém conteúdo Markdown detalhado além do resumo.',
        field: 'content'
      });
    } else {
      items.push({
        id: 'content-ok',
        type: 'pass',
        title: 'Conteúdo Markdown verificado',
        message: `${wordCount} palavras registradas no corpo editorial.`
      });
    }

    // 5. Cover Image Validation
    if (coverImage) {
      const isHttp = coverImage.startsWith('http://') || coverImage.startsWith('https://');
      const isLocal = coverImage.startsWith('/images/') || coverImage.startsWith('data:image/');
      if (!isHttp && !isLocal) {
        items.push({
          id: 'cover-invalid-protocol',
          type: 'error',
          title: 'URL de imagem inválida',
          message: 'A URL da imagem de capa deve começar com https://, /images/ ou data:image/.',
          field: 'coverImage'
        });
      } else {
        items.push({
          id: 'cover-ok',
          type: 'pass',
          title: 'Imagem de capa configurada',
          message: 'URL válida para banner de destaque e OpenGraph.'
        });
      }
    } else {
      items.push({
        id: 'cover-empty',
        type: 'warning',
        title: 'Nenhuma imagem de capa selecionada',
        message: 'Artigos sem imagem de capa utilizam o banner padrão do laboratório.',
        field: 'coverImage'
      });
    }

    // 6. Read Time
    if (!readTime) {
      items.push({
        id: 'readtime-empty',
        type: 'warning',
        title: 'Tempo de leitura não informado',
        message: 'O tempo estimado de leitura está vazio.',
        field: 'readTime',
        fixAction: {
          label: `Aplicar cálculo auto (${autoReadTime})`,
          action: () => {
            setReadTime(autoReadTime);
            markDirty();
          }
        }
      });
    }

    return items;
  }, [title, slug, summary, content, coverImage, readTime, existingArticles, article.id, wordCount, autoReadTime]);

  const errors = useMemo(() => diagnosticReport.filter(d => d.type === 'error'), [diagnosticReport]);
  const warnings = useMemo(() => diagnosticReport.filter(d => d.type === 'warning'), [diagnosticReport]);
  const passes = useMemo(() => diagnosticReport.filter(d => d.type === 'pass'), [diagnosticReport]);

  const translationError = (['en', 'pt', 'es'] as ArticleLanguage[])
    .filter(language => language !== sourceLanguage)
    .some(language => {
      const translation = translations?.[language];
      if (published) return !translation?.title.trim() || !translation.summary.trim() || !translation.content?.trim();
      const started = Boolean(translation?.title.trim() || translation?.summary.trim() || translation?.content?.trim());
      return started && (!translation?.title.trim() || !translation.summary.trim());
    });
  const hasCriticalBugs = errors.length > 0 || translationError;

  const updateTranslation = (language: ArticleLanguage, field: keyof ArticleTranslation, value: string) => {
    setTranslations(previous => ({
      ...previous,
      [language]: {
        title: previous?.[language]?.title ?? '',
        summary: previous?.[language]?.summary ?? '',
        ...previous?.[language],
        [field]: value,
      },
    }));
    markDirty();
  };

  const getEditedArticle = (): Article => {
    const cleanTranslations: Article['translations'] = {};
    for (const [language, translation] of Object.entries(translations ?? {}) as [ArticleLanguage, ArticleTranslation][]) {
      if (language === sourceLanguage || (!translation.title.trim() && !translation.summary.trim() && !translation.content?.trim())) continue;
      cleanTranslations[language] = {
        title: translation.title.trim(),
        summary: translation.summary.trim(),
        ...(translation.content?.trim() ? { content: translation.content.trim() } : {}),
      };
    }
    return {
      ...article,
      id: article.id || editorId,
      slug: slug.trim() || generateSlugFromTitle(title) || `article-${Date.now()}`,
      title: title.trim(), summary: summary.trim(), content: content.trim(), area,
      readTime: readTime.trim() || autoReadTime, date,
      coverImage: coverImage.trim() || undefined, published, views: article.views ?? 0,
      sourceLanguage,
      translations: Object.keys(cleanTranslations).length ? cleanTranslations : undefined,
    };
  };

  const handleExport = () => {
    try {
      downloadArticleExport(getEditedArticle());
      setSaveState('idle');
      setSaveFeedbackMessage('Arquivo exportado com as alterações atuais. Importe-o no projeto e envie ao GitHub para publicar.');
    } catch (error) {
      setSaveState('error');
      setSaveFeedbackMessage(error instanceof Error ? error.message : 'Falha ao exportar.');
    }
  };

  // Save changes handler
  const handleSaveChanges = async (closeModalAfter = false) => {
    // If there are critical bugs preventing safe rendering
    if (hasCriticalBugs) {
      setSaveState('error');
      setSaveFeedbackMessage(translationError
        ? published
          ? 'Não foi possível salvar: para publicar, inglês, português e espanhol precisam de título, resumo e corpo completos.'
          : 'Não foi possível salvar: toda tradução iniciada precisa de título e resumo.'
        : `Não foi possível salvar: ${errors.length} bug(s) crítico(s) detectado(s). Corrija os campos destacados.`);
      if (!translationError) setActiveTab('diagnostics');
      return;
    }

    setSaveState('saving');
    const updatedArticle = getEditedArticle();

    try {
      await onSave(updatedArticle);
      setIsDirty(false);
      setSaveState('saved');
      setSaveFeedbackMessage('Alteração enviada ao GitHub. O Cloudflare Pages está preparando a nova versão do blog.');

      if (closeModalAfter) {
        onClose();
      } else {
        setTimeout(() => {
          setSaveState(previous => previous === 'saved' ? 'idle' : previous);
        }, 4000);
      }
    } catch (err: any) {
      setSaveState('error');
      setIsDirty(true);
      setSaveFeedbackMessage(`${err?.message || 'Não foi possível confirmar a gravação.'} A edição continua aberta. Use Exportar artigo para guardar uma cópia.`);
    }
  };

  // Keyboard shortcut Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveChanges(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasCriticalBugs, translationError, title, slug, summary, content, area, readTime, date, coverImage, published, sourceLanguage, translations, article, onSave]);

  // Upload Handlers
  const handleCoverUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      try {
        setIsUploadingCover(true);
        const item = await uploadImage(files[0]);
        setCoverImage(item.url);
        markDirty();
      } catch (error) {
        setSaveState('error');
        setSaveFeedbackMessage(error instanceof Error ? error.message : 'Falha ao salvar a imagem. A edição foi mantida.');
      } finally {
        setIsUploadingCover(false);
      }
    }
  };

  const handleContentImageUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      try {
        setIsUploadingContentImg(true);
        const item = await uploadImage(files[0]);
        const cleanName = files[0].name.replace(/\.[^/.]+$/, '');
        const markdownImage = `\n\n![${cleanName}](${item.url})\n\n`;
        setContent(prev => (prev || '') + markdownImage);
        markDirty();
      } catch (error) {
        setSaveState('error');
        setSaveFeedbackMessage(error instanceof Error ? error.message : 'Falha ao salvar a imagem. A edição foi mantida.');
      } finally {
        setIsUploadingContentImg(false);
      }
    }
  };

  // Live article URL for preview
  const liveArticleUrl = `/en/articles/${slug || article.slug || ''}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-5xl h-[94vh] flex flex-col bg-[#090a0f] border border-cyan-800/80 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] hud-border"
      >
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-gray-800 bg-gray-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded border ${hasCriticalBugs ? 'bg-rose-950/40 border-rose-800/80 text-rose-400' : 'bg-cyan-950/40 border-cyan-800/80 text-cyan-400'}`}>
              {hasCriticalBugs ? <Bug className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white font-sans tracking-wide">
                  {article.id ? 'Editar Artigo Técnico' : 'Criar Novo Artigo'}
                </h2>
                {isDirty && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-950 border border-amber-800/80 text-amber-300">
                    Alterações Não Salvas
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-gray-500 truncate max-w-xs sm:max-w-md">
                {title ? title : 'Sem título definido'} {slug ? `• /en/articles/${slug}` : ''}
              </p>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center gap-2">
            {/* Save Button in Header */}
            <button
              type="button"
              onClick={() => handleSaveChanges(false)}
              disabled={saveState === 'saving'}
              className={`px-3.5 py-1.5 rounded text-xs font-mono font-bold uppercase transition-all duration-200 flex items-center gap-1.5 shadow-sm ${
                saveState === 'saved'
                  ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                  : hasCriticalBugs
                  ? 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_12px_rgba(6,182,212,0.35)]'
              }`}
              title="Salvar alterações no banco local (Atalho: Ctrl+S)"
            >
              {saveState === 'saving' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : saveState === 'saved' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvo!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar neste navegador</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                if (isDirty && !window.confirm('Você possui alterações não salvas. Deseja realmente fechar o editor?')) {
                  return;
                }
                onClose();
              }}
              className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-800 transition-colors"
              title="Fechar editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation & Live Bug Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-2 bg-[#06070a] border-b border-gray-800/80 text-xs font-mono shrink-0">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'editor'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900/60'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editor de Artigo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900/60'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview em Tempo Real</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('diagnostics')}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'diagnostics'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Validador de Bugs</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                hasCriticalBugs
                  ? 'bg-rose-500 text-black'
                  : warnings.length > 0
                  ? 'bg-amber-500 text-black'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                {errors.length > 0 ? `${errors.length} bugs` : `${warnings.length} alertas`}
              </span>
            </button>
          </div>

          {/* Real-time Status Badge */}
          <div className="flex items-center gap-2">
            {hasCriticalBugs ? (
              <button
                type="button"
                onClick={() => setActiveTab('diagnostics')}
                className="px-2.5 py-1 rounded bg-rose-950/60 border border-rose-800/80 text-rose-300 flex items-center gap-1.5 hover:bg-rose-900/40 transition-colors"
              >
                <Bug className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span className="font-bold">{errors.length} BUG(S) IMPEDINDO GRAVAÇÃO</span>
              </button>
            ) : warnings.length > 0 ? (
              <button
                type="button"
                onClick={() => setActiveTab('diagnostics')}
                className="px-2.5 py-1 rounded bg-amber-950/50 border border-amber-800/80 text-amber-300 flex items-center gap-1.5 hover:bg-amber-900/40 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>0 BUGS • {warnings.length} Alertas de Qualidade</span>
              </button>
            ) : (
              <div className="px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">0 BUGS DETECTADOS • PÁGINA ÍNTEGRA</span>
              </div>
            )}
          </div>
        </div>

        {/* Global Save Feedback Banner */}
        <AnimatePresence>
          {saveFeedbackMessage && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`px-4 sm:px-6 py-2 text-xs font-mono flex items-center justify-between border-b ${
                saveState === 'error'
                  ? 'bg-rose-950/80 border-rose-800/80 text-rose-200'
                  : 'bg-emerald-950/80 border-emerald-800/80 text-emerald-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {saveState === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <span>{saveFeedbackMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setSaveFeedbackMessage('')}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* TAB 1: FORM EDITOR */}
          {activeTab === 'editor' && (
            <div className="space-y-5 max-w-4xl mx-auto font-mono text-xs">
              {/* Title Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-gray-300 font-semibold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    Título do Artigo <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] text-gray-500 font-mono">
                    {title.length} caracteres
                  </span>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={e => {
                    setTitle(e.target.value);
                    markDirty();
                  }}
                  className={`w-full px-3.5 py-2.5 bg-gray-950 border text-gray-100 text-sm font-sans focus:outline-none rounded transition-colors ${
                    !title.trim()
                      ? 'border-rose-800/80 focus:border-rose-500'
                      : 'border-gray-800 focus:border-cyan-500'
                  }`}
                  placeholder="Ex: Engenharia Reversa de Protocolos Proprietários de PLCs"
                />
                {!title.trim() && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Campo obrigatório para salvar e renderizar a página.
                  </p>
                )}
              </div>

              {/* Slug / Route URL Configuration */}
              <div className="p-3 bg-gray-950/70 border border-gray-800/80 rounded-lg space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-gray-300 font-semibold flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                    Identificador de Rota (Slug URL) <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newSlug = generateSlugFromTitle(title) || `article-${Date.now()}`;
                      setSlug(newSlug);
                      markDirty();
                    }}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
                    title="Gerar automaticamente com base no título atual"
                  >
                    <Sparkles className="w-3 h-3" /> Gerar do Título
                  </button>
                </div>

                <div className="flex items-center">
                  <span className="px-3 py-2 bg-gray-900 border border-r-0 border-gray-800 text-gray-500 text-xs font-mono rounded-l select-none">
                    /en/articles/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={e => {
                      setSlug(e.target.value);
                      markDirty();
                    }}
                    className="flex-1 px-3 py-2 bg-gray-950 border border-gray-800 text-cyan-300 text-xs font-mono focus:border-cyan-500 rounded-r"
                    placeholder="engenharia-reversa-plcs"
                  />
                </div>
                <p className="text-[11px] text-gray-500">
                  URL canônica inglesa da publicação. Ex: <span className="text-cyan-400">/en/articles/{slug || 'article-slug'}</span>
                </p>
              </div>

              {/* Grid: Area, Read Time, Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1.5 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-cyan-400" /> Área de Pesquisa
                  </label>
                  <select
                    value={area}
                    onChange={e => {
                      setArea(e.target.value);
                      markDirty();
                    }}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-cyan-300 focus:border-cyan-500 rounded text-xs"
                  >
                    {!ARTICLE_AREAS.includes(area) && (
                      <option value={area}>{localizeArticleArea(area, language)}</option>
                    )}
                    {ARTICLE_AREAS.map(value => (
                      <option key={value} value={value}>{localizeArticleArea(value, language)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" /> Tempo de Leitura
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setReadTime(autoReadTime);
                        markDirty();
                      }}
                      className="text-[10px] text-cyan-400 hover:underline"
                      title="Calcular com base na contagem de palavras"
                    >
                      Auto ({autoReadTime})
                    </button>
                  </div>
                  <input
                    type="text"
                    value={readTime}
                    onChange={e => {
                      setReadTime(e.target.value);
                      markDirty();
                    }}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-gray-200 focus:border-cyan-500 rounded text-xs"
                    placeholder="10 min read"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-cyan-400" /> Data de Publicação
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => {
                      setDate(e.target.value);
                      markDirty();
                    }}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-gray-200 focus:border-cyan-500 rounded text-xs"
                  />
                </div>
              </div>

              {/* Cover Image Section */}
              <div className="p-3 bg-gray-950/70 border border-gray-800/80 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-gray-300 font-semibold flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    Imagem de Capa (JPG, GIF, PNG, WebP)
                  </label>
                  {coverImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setCoverImage('');
                        markDirty();
                      }}
                      className="text-[11px] font-mono text-rose-400 hover:text-rose-300 underline"
                    >
                      Remover Capa
                    </button>
                  )}
                </div>

                {coverImage ? (
                  <div className="relative rounded overflow-hidden border border-cyan-800/60 bg-gray-900 max-h-48 group">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-full h-36 object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 text-cyan-300 rounded text-[10px] font-mono border border-cyan-900/50">
                      Preview Ativo da Imagem
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-800 rounded p-3 text-center bg-gray-900/20">
                    <p className="text-gray-500 text-xs font-mono">
                      Nenhuma imagem selecionada. Envie um arquivo ou insira uma URL de imagem.
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={coverImage}
                    onChange={e => {
                      setCoverImage(e.target.value);
                      markDirty();
                    }}
                    className="flex-1 px-3 py-2 bg-gray-900 border border-gray-800 text-cyan-300 focus:border-cyan-500 rounded text-xs font-mono"
                    placeholder="URL da imagem (https://... ou /images/...)"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <label className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-xs font-mono cursor-pointer transition-colors flex items-center gap-1.5 border border-gray-700">
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      {isUploadingCover ? 'Enviando...' : 'Upload Imagem'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                        onChange={handleCoverUploadFile}
                        disabled={isUploadingCover}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => onOpenMediaPicker('cover')}
                      className="px-3 py-2 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/60 rounded text-xs font-mono transition-colors flex items-center gap-1.5"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      Biblioteca
                    </button>
                  </div>
                </div>
              </div>

              {/* Summary / Abstract */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-gray-300 font-semibold flex items-center gap-1.5">
                    Resumo / Abstract Editorial <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] text-gray-500 font-mono">
                    {summary.length} caracteres
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={e => {
                    setSummary(e.target.value);
                    markDirty();
                  }}
                  className={`w-full px-3 py-2.5 bg-gray-950 border text-gray-200 text-xs font-sans leading-relaxed focus:outline-none rounded transition-colors ${
                    !summary.trim()
                      ? 'border-rose-800/80 focus:border-rose-500'
                      : 'border-gray-800 focus:border-cyan-500'
                  }`}
                  placeholder="Síntese técnica de 2 a 3 frases explicando o escopo, metodologia e principais conclusões da pesquisa..."
                />
                {!summary.trim() && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Campo obrigatório para exibição nos cards e metadados.
                  </p>
                )}
              </div>

              {/* Article Content Markdown */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <label className="text-gray-300 font-semibold flex items-center gap-1.5">
                    Conteúdo do Artigo (Markdown Técnico Suportado)
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="px-2.5 py-1 bg-gray-900 hover:bg-gray-800 text-cyan-300 border border-cyan-900/60 rounded text-[11px] font-mono cursor-pointer transition-colors flex items-center gap-1">
                      <Upload className="w-3 h-3 text-cyan-400" />
                      {isUploadingContentImg ? 'Inserindo...' : 'Inserir Imagem/GIF'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                        onChange={handleContentImageUploadFile}
                        disabled={isUploadingContentImg}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => onOpenMediaPicker('content')}
                      className="px-2.5 py-1 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 rounded text-[11px] font-mono transition-colors flex items-center gap-1"
                    >
                      <ImageIcon className="w-3 h-3 text-cyan-400" />
                      Biblioteca
                    </button>
                  </div>
                </div>

                <textarea
                  rows={14}
                  value={content}
                  onChange={e => {
                    setContent(e.target.value);
                    markDirty();
                  }}
                  className="w-full px-3.5 py-3 bg-gray-950 border border-gray-800 text-gray-200 focus:border-cyan-500 rounded font-mono text-xs leading-relaxed"
                  placeholder="## Introdução&#10;Escreva a análise técnica aqui...&#10;&#10;```python&#10;# PoC ou script técnico&#10;```&#10;&#10;![Diagrama de Rede](url-da-imagem.png)"
                />
                <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-500 font-mono mt-1 gap-2">
                  <span>💡 {wordCount} palavras • Suporte a blocos de código com syntax highlighting, tabelas, diagramas e GIFs.</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" /> Ver Preview em Tempo Real →
                  </button>
                </div>
              </div>

              {/* Article-owned language versions */}
              <div className="p-4 bg-gray-950/70 border border-gray-800/80 rounded-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Idiomas do artigo</h3>
                    <p className="mt-1 text-[11px] text-gray-500">
                      O idioma original guarda a versão principal. Para publicar, os outros dois idiomas precisam de título, resumo e corpo completos.
                    </p>
                  </div>
                  <label className="text-xs text-gray-400">
                    Idioma original
                    <select
                      value={sourceLanguage}
                      onChange={event => {
                        const nextLanguage = event.target.value as ArticleLanguage;
                        setSourceLanguage(nextLanguage);
                        setTranslations(previous => {
                          const next = { ...previous };
                          delete next[nextLanguage];
                          return next;
                        });
                        markDirty();
                      }}
                      className="ml-2 px-2 py-1.5 bg-gray-900 border border-gray-700 text-cyan-300 rounded font-mono"
                    >
                      <option value="pt">Português</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </label>
                </div>

                {(['en', 'pt', 'es'] as ArticleLanguage[]).filter(language => language !== sourceLanguage).map(language => {
                  const translation = translations?.[language] ?? { title: '', summary: '', content: '' };
                  const label = language === 'en' ? 'English' : language === 'pt' ? 'Português' : 'Español';
                  const started = Boolean(translation.title || translation.summary || translation.content);
                  return (
                    <details key={language} open={started} className="border border-gray-800 rounded bg-gray-900/30">
                      <summary className="cursor-pointer px-3 py-2 text-xs font-mono text-cyan-300">
                        {label} {translation.content?.trim() ? '• corpo traduzido' : started ? '• somente metadados' : '• não configurado'}
                      </summary>
                      <div className="p-3 pt-2 space-y-3 border-t border-gray-800">
                        <input
                          value={translation.title}
                          onChange={event => updateTranslation(language, 'title', event.target.value)}
                          placeholder={`Título em ${label}`}
                          className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-gray-200 focus:border-cyan-500 rounded text-xs"
                        />
                        <textarea
                          rows={3}
                          value={translation.summary}
                          onChange={event => updateTranslation(language, 'summary', event.target.value)}
                          placeholder={`Resumo em ${label}`}
                          className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-gray-200 focus:border-cyan-500 rounded text-xs"
                        />
                        <textarea
                          rows={8}
                          value={translation.content ?? ''}
                          onChange={event => updateTranslation(language, 'content', event.target.value)}
                          placeholder={`Corpo completo em ${label}${published ? ' (obrigatório para publicar)' : ' (pode ser concluído antes da publicação)'}`}
                          className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-gray-200 focus:border-cyan-500 rounded font-mono text-xs leading-relaxed"
                        />
                      </div>
                    </details>
                  );
                })}
                {translationError && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {published
                      ? 'Preencha título, resumo e corpo nos dois idiomas adicionais.'
                      : 'Preencha título e resumo em cada tradução iniciada.'}
                  </p>
                )}
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-2 pt-2 p-3 bg-gray-950/60 border border-gray-800/80 rounded-lg">
                <input
                  type="checkbox"
                  id="modal_published_check"
                  checked={published}
                  onChange={e => {
                    setPublished(e.target.checked);
                    markDirty();
                  }}
                  className="accent-cyan-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="modal_published_check" className="text-gray-300 cursor-pointer font-sans text-xs">
                  Pronto para publicar ao importar no projeto (Status: <span className={published ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{published ? 'PRONTO PARA PUBLICAR' : 'RASCUNHO LOCAL'}</span>)
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE PREVIEW MODE */}
          {activeTab === 'preview' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="p-3 bg-cyan-950/20 border border-cyan-800/50 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span>PREVIEW EM TEMPO REAL: Renderização idêntica à visualização pública em /en/articles/{slug || 'preview'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded text-[11px] flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Voltar ao Editor
                </button>
              </div>

              <PreviewErrorBoundary>
                <div className="border border-gray-800 rounded-xl p-4 sm:p-8 bg-[#050505] shadow-2xl">
                  {/* Article Header */}
                  <header className="border-b border-gray-800 pb-6 mb-8">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-gray-500 mb-4">
                      <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
                        <Tag className="w-3.5 h-3.5 shrink-0" /> {localizeArticleArea(area, language)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 shrink-0" /> {date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 shrink-0" /> {readTime || autoReadTime}
                      </span>
                      <span>•</span>
                      <span className="text-cyan-300 font-mono">
                        {(article.views ?? 0)} visualizações
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-6 font-sans">
                      {title || <span className="text-gray-600">[Título não preenchido]</span>}
                    </h1>

                    <p className="text-base sm:text-lg text-gray-300 font-sans leading-relaxed border-l-2 border-cyan-500 pl-4 py-2 bg-cyan-950/20 rounded-r">
                      {summary ? summary : <span className="text-gray-500 italic">[Resumo não preenchido]</span>}
                    </p>
                  </header>

                  {/* Cover Image in Preview */}
                  {coverImage && (
                    <div className="mb-8 rounded-lg overflow-hidden border border-gray-800 shadow-xl max-h-[420px]">
                      <img
                        src={coverImage}
                        alt={title}
                        className="w-full h-auto object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).alt = '[Falha ao carregar imagem]';
                        }}
                      />
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="max-w-none">
                    {content ? (
                      <ArticleContent content={content} />
                    ) : (
                      <div className="p-8 border border-dashed border-gray-800 rounded text-center text-gray-500 font-mono text-xs">
                        Nenhum conteúdo digitado ainda. Retorne ao editor para escrever o artigo em Markdown.
                      </div>
                    )}
                  </div>
                </div>
              </PreviewErrorBoundary>
            </div>
          )}

          {/* TAB 3: DIAGNOSTICS & BUG VALIDATOR */}
          {activeTab === 'diagnostics' && (
            <div className="max-w-4xl mx-auto space-y-6 font-mono text-xs">
              {/* Summary Card */}
              <div className={`p-4 sm:p-5 rounded-xl border ${
                hasCriticalBugs
                  ? 'bg-rose-950/30 border-rose-800/80 text-rose-200'
                  : warnings.length > 0
                  ? 'bg-amber-950/30 border-amber-800/80 text-amber-200'
                  : 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {hasCriticalBugs ? (
                    <Bug className="w-6 h-6 text-rose-400" />
                  ) : warnings.length > 0 ? (
                    <AlertTriangle className="w-6 h-6 text-amber-400" />
                  ) : (
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  )}
                  <div>
                    <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-white">
                      {hasCriticalBugs
                        ? `${errors.length} BUG(S) CRÍTICO(S) DETECTADO(S)`
                        : warnings.length > 0
                        ? `${warnings.length} PONTOS DE ATENÇÃO / QUALIDADE`
                        : 'PÁGINA 100% VÁLIDA E LIVRE DE BUGS'}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      {hasCriticalBugs
                        ? 'O artigo não pode ser salvo ou exibido com segurança até que os bugs abaixo sejam corrigidos.'
                        : 'O artigo está sintaticamente íntegro e validado para publicação sem quebras de layout.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Bug List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest border-b border-gray-800 pb-2">
                  Checklist de Integridade do Artigo ({diagnosticReport.length} Verificações)
                </h4>

                {diagnosticReport.map(item => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      item.type === 'error'
                        ? 'bg-rose-950/30 border-rose-800/80 text-rose-200'
                        : item.type === 'warning'
                        ? 'bg-amber-950/20 border-amber-800/60 text-amber-200'
                        : 'bg-gray-950/40 border-gray-800/60 text-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {item.type === 'error' ? (
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      ) : item.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{item.title}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                            item.type === 'error'
                              ? 'bg-rose-900/60 text-rose-300'
                              : item.type === 'warning'
                              ? 'bg-amber-900/60 text-amber-300'
                              : 'bg-emerald-900/40 text-emerald-300'
                          }`}>
                            {item.type.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                    </div>

                    {item.fixAction && (
                      <button
                        type="button"
                        onClick={item.fixAction.action}
                        className="px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 rounded text-xs font-mono shrink-0 transition-colors"
                      >
                        {item.fixAction.label}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Footer (Always Visible) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-t border-gray-800 bg-gray-950/95 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            {hasCriticalBugs ? (
              <span className="text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Corrija os {errors.length} bug(s) para habilitar o salvamento.
              </span>
            ) : isDirty ? (
              <span className="text-amber-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                Alterações pendentes • Pressione Ctrl+S ou clique em Salvar Alterações.
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {saveState === 'saved' ? 'Gravação conferida neste navegador.' : 'Use Salvar neste navegador ou Exportar artigo para guardar esta edição.'}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleExport}
              disabled={saveState === 'saving' || hasCriticalBugs}
              className="px-4 py-2 border border-cyan-800 text-cyan-300 rounded text-xs font-mono disabled:opacity-50"
            >
              Exportar artigo
            </button>
            <button
              type="button"
              onClick={() => {
                if (isDirty && !window.confirm('Você possui alterações não salvas. Deseja cancelar?')) {
                  return;
                }
                onClose();
              }}
              className="px-4 py-2 border border-gray-800 text-gray-400 hover:text-white rounded text-xs font-mono transition-colors"
            >
              Cancelar
            </button>

            {/* Salvar e Fechar */}
            <button
              type="button"
              onClick={() => handleSaveChanges(true)}
              disabled={saveState === 'saving' || hasCriticalBugs}
              className={`px-4 py-2 rounded text-xs font-mono font-semibold transition-colors border ${
                hasCriticalBugs
                  ? 'border-gray-800 text-gray-600 cursor-not-allowed'
                  : 'border-cyan-800/80 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300'
              }`}
              title="Salva e fecha a janela do editor"
            >
              Salvar e Fechar
            </button>

            {/* Botão Primário: Salvar Alterações */}
            <button
              type="button"
              onClick={() => handleSaveChanges(false)}
              disabled={saveState === 'saving' || hasCriticalBugs}
              className={`px-5 py-2 font-mono font-bold text-xs uppercase rounded transition-all duration-200 flex items-center gap-2 shadow-lg ${
                hasCriticalBugs
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                  : saveState === 'saved'
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              }`}
            >
              {saveState === 'saving' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : saveState === 'saved' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>✓ Salvo com Sucesso!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar neste navegador</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
