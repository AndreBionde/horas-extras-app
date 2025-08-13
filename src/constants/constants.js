/**
 * Constantes da Aplicação de Controle de Horas Extras
 * 
 * Este arquivo centraliza todas as configurações e constantes utilizadas
 * em toda a aplicação, facilitando manutenção e personalizações futuras.
 */

// ===============================
// CONFIGURAÇÕES DE JORNADA
// ===============================

/**
 * Jornada padrão de trabalho em minutos
 * 
 * Define quantos minutos constituem uma jornada completa de trabalho.
 * Usado como base para calcular horas extras e débitos.
 * 
 * @constant {number}
 * @default 420 (7 horas × 60 minutos)
 * 
 * @example
 * // Para alterar para 8 horas:
 * export const JORNADA_PADRAO = 8 * 60; // 480 minutos
 * 
 * // Para jornada de 6 horas:
 * export const JORNADA_PADRAO = 6 * 60; // 360 minutos
 */
export const JORNADA_PADRAO = 7 * 60;

/**
 * Escalas de trabalho disponíveis
 * 
 * Define as diferentes jornadas que o usuário pode selecionar.
 * Cada escala contém informações sobre horas diárias e dias úteis.
 * 
 * @constant {Array<Object>}
 * @readonly
 * 
 * @property {string} id - Identificador único da escala
 * @property {string} nome - Nome amigável da escala
 * @property {string} descricao - Descrição detalhada da escala
 * @property {number} horasPorDia - Horas por dia em minutos
 * @property {Array<number>} diasUteis - Dias da semana trabalhados (0=Dom, 1=Seg...)
 * @property {number} horasSemana - Total de horas por semana
 * @property {boolean} [personalizavel] - Se permite personalização
 */
export const ESCALAS_TRABALHO = [
  {
    id: 'escala_5x2_8h',
    nome: '5x2 - 8h/dia',
    descricao: 'Segunda a Sexta, 8 horas por dia',
    horasPorDia: 8 * 60,
    diasUteis: [1, 2, 3, 4, 5], // Segunda a Sexta
    horasSemana: 40
  },
  {
    id: 'escala_6x1_7h',
    nome: '6x1 - 7h/dia',
    descricao: 'Segunda a Sábado, 7 horas por dia',
    horasPorDia: 7 * 60,
    diasUteis: [1, 2, 3, 4, 5, 6], // Segunda a Sábado
    horasSemana: 42
  },
  {
    id: 'escala_5x2_6h',
    nome: '5x2 - 6h/dia',
    descricao: 'Segunda a Sexta, 6 horas por dia',
    horasPorDia: 6 * 60,
    diasUteis: [1, 2, 3, 4, 5], // Segunda a Sexta
    horasSemana: 30
  },
  {
    id: 'escala_personalizada',
    nome: 'Personalizada',
    descricao: 'Configurar horários personalizados',
    horasPorDia: 7 * 60, // padrão
    diasUteis: [1, 2, 3, 4, 5, 6], // padrão
    horasSemana: 42,
    personalizavel: true
  }
];

/**
 * Escala padrão do sistema
 * 
 * @constant {string}
 * @default 'escala_6x1_7h'
 */
export const ESCALA_PADRAO = 'escala_6x1_7h';

// ===============================
// CONFIGURAÇÕES DE CALENDÁRIO
// ===============================

/**
 * Lista ordenada dos meses do ano em português brasileiro
 * 
 * Utilizada em seletores de período e formatação de datas.
 * O índice corresponde ao mês JavaScript (Janeiro = 0).
 * 
 * @constant {Array<string>}
 * @readonly
 */
export const MESES = [
  'Janeiro',    // índice 0
  'Fevereiro',  // índice 1
  'Março',      // índice 2
  'Abril',      // índice 3
  'Maio',       // índice 4
  'Junho',      // índice 5
  'Julho',      // índice 6
  'Agosto',     // índice 7
  'Setembro',   // índice 8
  'Outubro',    // índice 9
  'Novembro',   // índice 10
  'Dezembro'    // índice 11
];

/**
 * Versões abreviadas dos meses (3 caracteres)
 * 
 * Útil para interfaces compactas ou gráficos com espaço limitado.
 * 
 * @constant {Array<string>}
 * @readonly
 */
export const MESES_ABREV = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

// ===============================
// PALETA DE CORES
// ===============================

/**
 * Paleta de cores padronizada para gráficos e interface
 * 
 * Cores consistentes em toda a aplicação garantem:
 * - Identidade visual coesa
 * - Melhor UX com significados consistentes
 * - Facilidade de manutenção e personalização
 * - Acessibilidade com contraste adequado
 * 
 * @constant {Object}
 * @readonly
 * 
 * @property {string} primary - Cor principal da aplicação (azul)
 * @property {string} success - Cor para indicar sucesso/positivo (verde)
 * @property {string} warning - Cor para alertas/atenção (amarelo/laranja)
 * @property {string} danger - Cor para erros/negativo (vermelho)
 * @property {string} info - Cor informativa (azul claro)
 * @property {string} neutral - Cor neutra para textos secundários (cinza)
 */
export const CORES = {
  // Cor primária - utilizada em elementos principais da interface
  primary: '#667eea',   // Azul gradiente elegante
  
  // Cor de sucesso - horas extras, resultados positivos, confirmações
  success: '#10b981',   // Verde esmeralda moderno
  
  // Cor de aviso - alertas não críticos, metas próximas do limite
  warning: '#f59e0b',   // Âmbar dourado vibrante
  
  // Cor de perigo - débitos, erros críticos, exclusões
  danger: '#ef4444',    // Vermelho vibrante e claro
    
  // Cor neutra - textos secundários, bordas, fundos discretos
  neutral: '#6b7280'    // Cinza médio balanceado
};

// ===============================
// CONFIGURAÇÕES DE DIAS ÚTEIS
// ===============================

/**
 * Configuração padrão dos dias da semana considerados úteis
 * 
 * Array com os índices dos dias da semana que são considerados
 * dias úteis para cálculo de jornada esperada por padrão.
 * 
 * JavaScript: 0=Domingo, 1=Segunda, 2=Terça, 3=Quarta, 4=Quinta, 5=Sexta, 6=Sábado
 * 
 * @constant {Array<number>}
 * @default [1, 2, 3, 4, 5, 6] (Segunda a Sábado)
 * 
 * @example
 * // Para incluir domingos como dia útil:
 * export const DIAS_UTEIS = [0, 1, 2, 3, 4, 5, 6];
 * 
 * // Para trabalhar apenas de segunda a sexta:
 * export const DIAS_UTEIS = [1, 2, 3, 4, 5];
 * 
 */
export const DIAS_UTEIS = [1, 2, 3, 4, 5, 6]; // Segunda a Sábado

/**
 * Nomes completos dos dias da semana em português brasileiro
 * 
 * @constant {Array<string>}
 * @readonly
 */
export const DIAS_SEMANA = [
  'Domingo',    // índice 0
  'Segunda',    // índice 1  
  'Terça',      // índice 2
  'Quarta',     // índice 3
  'Quinta',     // índice 4
  'Sexta',      // índice 5
  'Sábado'      // índice 6
];

/**
 * Versões abreviadas dos dias da semana
 * 
 * @constant {Array<string>}
 * @readonly
 */
export const DIAS_SEMANA_ABREV = [
  'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
];

// ===============================
// CONFIGURAÇÕES DE ARMAZENAMENTO
// ===============================

/**
 * Chaves padronizadas para localStorage
 * 
 * Centraliza as chaves para evitar conflitos, facilitar mudanças
 * e garantir consistência no armazenamento local.
 * 
 * @constant {Object}
 * @readonly
 * 
 * @property {string} REGISTROS - Dados principais dos registros de ponto
 * @property {string} CONFIGURACOES - Configurações personalizadas do usuário  
 * @property {string} ESCALA_TRABALHO - Escala de trabalho selecionada
 * @property {string} CACHE_CALCULOS - Cache de cálculos pesados
 * @property {string} VERSAO_DADOS - Versão dos dados para migrations
 */
export const STORAGE_KEYS = {
  // Dados principais - registros de entrada/saída
  REGISTROS: 'registrosHorasExtras',
  
  // Configurações do usuário - preferências e personalizações
  CONFIGURACOES: 'configuracoesHorasExtras',
  
  // Escala de trabalho ativa
  ESCALA_TRABALHO: 'escalaTrabalhoSelecionada'
};

// ===============================
// MENSAGENS E TEXTOS DA INTERFACE
// ===============================

/**
 * Mensagens padronizadas de feedback para o usuário
 * 
 * Centraliza todos os textos da interface para facilitar:
 * - Internacionalização (i18n) futura
 * - Manutenção da consistência textual
 * - Personalização de mensagens
 * - Correções ortográficas centralizadas
 * 
 * @constant {Object}
 * @readonly
 */
export const MENSAGENS = {
  /**
   * Mensagens de confirmação - ações irreversíveis
   */
  CONFIRMACAO: {
    ALTERAR_ESCALA: 'Alterar a escala de trabalho irá recalcular todas as métricas. Confirma ?',
  },
  
  /**
   * Mensagens de alerta - situações que requerem atenção
   */
  ALERTA: {
    LIMITE_DIAS: 'Você já registrou {current} de {max} dias úteis possíveis para este mês.',
  }
};

/**
 * Tooltips e textos de ajuda contextuais
 * 
 * Textos explicativos que aparecem ao passar o mouse sobre elementos,
 * ajudando os usuários a compreender funcionalidades.
 * 
 * @constant {Object}
 * @readonly
 */
export const TOOLTIPS = {
  // Ações principais
  ADICIONAR_DIA: 'Adicionar novo registro de dia trabalhado',
  EXPORTAR_CSV: 'Baixar relatório completo em formato CSV para análise externa',
  IMPORTAR_CSV: 'Carregar registros de um arquivo CSV previamente exportado',
  GERAR_PDF: 'Gerar relatório visual profissional em formato PDF',
  LIMPAR_DADOS: 'Remover todos os registros permanentemente (ação irreversível)',
  
  // Informações contextuais
  LIMITE_DIAS: 'Você já registrou {current} de {max} dias úteis possíveis para este período',
  ESCALA_TRABALHO: 'Selecionar escala de trabalho para ajustar cálculos de horas extras'
};