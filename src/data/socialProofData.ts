/**
 * REGISTRO CENTRAL DE PROVA SOCIAL
 * ---------------------------------------------------------------------------
 * Substitua os campos abaixo pelos seus arquivos e registros reais.
 *
 * Dica para arquivos locais:
 * - Coloque o vídeo vertical (.mp4 / .webm) e a imagem do print (.png / .jpg / .webp)
 *   dentro da pasta `/public/prova-social/`.
 * - Referencie nos campos `videoUrl`, `posterUrl` ou `imageUrl` usando o caminho
 *   a partir da raiz (ex: '/prova-social/depoimento-01.mp4').
 * - Deixe como string vazia (`''`) enquanto quiser exibir o marcador visual
 *   preparado para substituição.
 */

export interface VideoTestimonialItem {
  id: string;
  label: string;
  orientation: 'landscape' | 'portrait';
  authorName: string;
  authorRole: string;
  context: string;
  durationHint: string;
  videoUrl: string;
  posterUrl?: string;
}

export interface ConversationPrintItem {
  id: string;
  label: string;
  channel: string;
  authorLabel: string;
  context: string;
  imageUrl: string;
  placeholderLines: string[];
}

export const SOCIAL_PROOF_HEADER = {
  kicker: 'O que dizem sobre o trabalho',
  title: 'A experiência também fala.',
  subtitle:
    'Resultados, relações e experiências compartilhadas por quem já trabalhou comigo.',
};

export const SOCIAL_PROOF_VIDEO: VideoTestimonialItem = {
  id: 'video-principal',
  label: 'Depoimento em vídeo · Principal',
  orientation: 'portrait',
  authorName: 'Depoimento Dra. Bruna',
  authorRole: 'Médica · Clínica especializada em odontologia',
  context: 'Presença digital e estruturação de CRM',
  durationHint: 'Formato 9:16 · Depoimento em vídeo',
  videoUrl: 'https://youtube.com/shorts/lrhIuCBxF9g?feature=share',
  posterUrl: 'https://i.ytimg.com/vi/lrhIuCBxF9g/hqdefault.jpg',
};

export const SOCIAL_PROOF_PRINT: ConversationPrintItem = {
  id: 'print-conversa-01',
  label: 'Print de conversa · Feedback direto',
  channel: 'WhatsApp / Mensagem real',
  authorLabel: 'Nome · Cliente ou parceiro',
  context: 'Registro espontâneo após entrega',
  imageUrl: '',
  placeholderLines: [
    'Espaço reservado para captura real de conversa.',
    'Ideal para feedbacks espontâneos enviados após uma entrega ou etapa concluída.',
  ],
};
