import { ESCALAS_TRABALHO, ESCALA_PADRAO } from '../constants/constants';

/**
 * DateUtils - Biblioteca completa de utilitários para manipulação de datas e cálculos temporais
 *
 * Esta biblioteca centraliza todas as operações relacionadas a:
 * - Formatação de datas e horários para exibição
 * - Cálculos precisos de jornada de trabalho
 * - Validação de consistência temporal
 * - Geração de datasets para visualizações
 * - Integração com diferentes escalas de trabalho
 * - Estatísticas avançadas de produtividade
 *
 * Todas as funções são puras (sem efeitos colaterais), otimizadas para performance
 * e incluem tratamento robusto de erros para garantir estabilidade da aplicação.
 *
 */
export const DateUtils = {

  // ===============================
  // FORMATAÇÃO E APRESENTAÇÃO
  // ===============================

  /**
   * Formata data para o padrão brasileiro (DD/MM/AAAA)
   *
   * Converte datas ISO (YYYY-MM-DD) ou objetos Date para formato
   * legível brasileiro, com tratamento especial para fusos horários
   * e prevenção de problemas de UTC.
   *
   * @param {string|Date} data - Data a ser formatada (ISO string ou Date object)
   * @returns {string} Data formatada no padrão brasileiro (ex: "15/03/2024")
   *
   * @example
   * DateUtils.formatarData("2024-03-15");     // "15/03/2024"
   * DateUtils.formatarData(new Date());       // "15/03/2024"
   * DateUtils.formatarData("");               // ""
   * DateUtils.formatarData(null);             // ""
   */
  formatarData: (data) => {
    if (!data) return '';
    
    try {
      // Garantir timezone local para evitar problemas de conversão UTC
      // Para strings ISO, adicionar horário para forçar timezone local
      const dateObj = typeof data === 'string' 
        ? new Date(data + "T00:00:00") 
        : new Date(data);
        
      // Validar se a data resultante é válida
      if (isNaN(dateObj.getTime())) {
        console.warn(`⚠️ Data inválida recebida: ${data}`);
        return '';
      }
      
      // Usar formatação nativa do navegador para português brasileiro
      return dateObj.toLocaleDateString('pt-BR');
      
    } catch (error) {
      console.error('❌ Erro ao formatar data:', error, 'Input:', data);
      return '';
    }
  },

  /**
   * Formata horário para exibição no formato 24h (HH:MM)
   *
   * Converte ISO strings completas ou objetos Date para formato
   * de hora legível, considerando timezone brasileiro.
   *
   * @param {string|Date} hora - Horário a ser formatado (ISO string ou Date object)
   * @returns {string} Hora formatada no formato 24h (ex: "08:30", "17:45")
   *
   * @example
   * DateUtils.formatarHora("2024-03-15T08:30:00Z");  // "08:30"
   * DateUtils.formatarHora(new Date());              // "14:23"
   * DateUtils.formatarHora("");                      // ""
   */
  formatarHora: (hora) => {
    if (!hora) return '';
    
    try {
      const dateObj = new Date(hora);
      
      // Validar se o horário resultante é válido
      if (isNaN(dateObj.getTime())) {
        console.warn(`⚠️ Horário inválido recebido: ${hora}`);
        return '';
      }
      
      // Formatação nativa com timezone brasileiro para consistência
      return dateObj.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'America/Sao_Paulo'
      });
      
    } catch (error) {
      console.error('❌ Erro ao formatar hora:', error, 'Input:', hora);
      return '';
    }
  },

  /**
   * Formata duração em minutos para formato legível com indicação visual
   *
   * Converte duração numérica em minutos para formato de horas legível,
   * incluindo sinal visual para facilitar identificação:
   * - Valores positivos: +1:30h (horas extras - verde)
   * - Valores negativos: -0:45h (horas em débito - vermelho)
   * - Zero: 0:00h (jornada exata - neutro)
   *
   * @param {number} minutos - Duração em minutos (pode ser negativa)
   * @returns {string} Duração formatada com sinal visual
   *
   * @example
   * DateUtils.formatarMinutos(90);    // "+1:30h"
   * DateUtils.formatarMinutos(-45);   // "-0:45h"
   * DateUtils.formatarMinutos(0);     // "0:00h"
   * DateUtils.formatarMinutos(420);   // "+7:00h"
   */
  formatarMinutos: (minutos) => {
    // Caso especial: zero minutos
    if (minutos === 0) return '0:00h';
    
    // Calcular horas e minutos usando valor absoluto
    const horas = Math.floor(Math.abs(minutos) / 60);
    const minutosRestantes = Math.abs(minutos) % 60;
    
    // Determinar sinal visual
    const sinal = minutos < 0 ? '-' : minutos > 0 ? '+' : '';
    
    // Formatar com zero à esquerda nos minutos
    return `${sinal}${horas}:${minutosRestantes.toString().padStart(2, '0')}h`;
  },

  // ===============================
  // CÁLCULOS DE JORNADA TRABALHADA
  // ===============================

  /**
   * Calcula duração total trabalhada entre horários de entrada e saída
   *
   * Função central para determinar tempo efetivamente trabalhado em um dia,
   * com validações robustas e tratamento de casos extremos:
   * - Horários inválidos ou ausentes
   * - Problemas de fuso horário
   * - Jornadas muito longas (possíveis erros)
   * - Validação de ordem cronológica
   *
   * @param {string|Date} entrada - Horário de entrada (ISO string ou Date)
   * @param {string|Date} saida - Horário de saída (ISO string ou Date)
   * @returns {number} Duração trabalhada em minutos (0 se inválido)
   *
   * @example
   * DateUtils.calcularHorasTrabalhadas(
   *   "2024-03-15T08:00:00Z", 
   *   "2024-03-15T17:00:00Z"
   * ); // 540 minutos (9 horas)
   *
   * DateUtils.calcularHorasTrabalhadas("", "");           // 0 (horários vazios)
   * DateUtils.calcularHorasTrabalhadas("08:00", "17:00"); // 0 (formato inválido)
   */
  calcularHorasTrabalhadas: (entrada, saida) => {
    // Validação inicial: ambos os horários devem estar presentes
    if (!entrada || !saida) {
      return 0;
    }
    
    try {
      // Converter para objetos Date
      const entradaDate = new Date(entrada);
      const saidaDate = new Date(saida);
      
      // Validar se são datas/horários válidos
      if (isNaN(entradaDate.getTime()) || isNaN(saidaDate.getTime())) {
        console.warn('⚠️ Horários inválidos detectados:', { entrada, saida });
        return 0;
      }
      
      // Calcular diferença em milissegundos
      const diferencaMs = saidaDate.getTime() - entradaDate.getTime();
      
      // Validar ordem cronológica: saída deve ser posterior à entrada
      if (diferencaMs < 0) {
        console.warn('⚠️ Horário de saída anterior à entrada:', { entrada, saida });
        return 0;
      }
      
      // Converter milissegundos para minutos (arredondar para baixo)
      const minutos = Math.floor(diferencaMs / (1000 * 60));
      
      // Alertar sobre jornadas suspeitamente longas (mais de 12h)
      if (minutos > 12 * 60) {
        console.warn(`⚠️ Jornada muito longa detectada: ${(minutos / 60).toFixed(1)}h`);
      }
      
      return minutos;
      
    } catch (error) {
      console.error('❌ Erro ao calcular horas trabalhadas:', error, { entrada, saida });
      return 0;
    }
  },

  // ===============================
  // INTEGRAÇÃO COM ESCALAS DE TRABALHO
  // ===============================

  /**
   * Obtém configuração completa da escala de trabalho
   *
   * Busca informações detalhadas da escala especificada ou retorna
   * configuração padrão segura caso a escala não seja encontrada.
   * Utilizada como base para todos os cálculos de jornada.
   *
   * @param {string} escalaId - Identificador da escala de trabalho
   * @returns {Object} Configuração completa da escala
   * @returns {string} returns.id - ID único da escala
   * @returns {string} returns.nome - Nome descritivo da escala
   * @returns {string} returns.descricao - Descrição detalhada
   * @returns {number} returns.horasPorDia - Horas diárias em minutos
   * @returns {number} returns.horasSemana - Total de horas semanais
   * @returns {Array<number>} returns.diasUteis - Dias da semana trabalhados (0=Dom, 6=Sáb)
   *
   * @example
   * const escala = DateUtils.obterEscalaInfo('escala_6x1_7h');
   * console.log(escala.horasPorDia);  // 420 (7 horas em minutos)
   * console.log(escala.diasUteis);    // [1, 2, 3, 4, 5, 6] (seg-sáb)
   */
  obterEscalaInfo: (escalaId) => {
    if (!escalaId) {
      console.warn('⚠️ ID de escala não fornecido, usando escala padrão');
      escalaId = ESCALA_PADRAO;
    }
    
    // Buscar escala no array de escalas disponíveis
    const escala = ESCALAS_TRABALHO.find(e => e.id === escalaId);
    
    if (!escala) {
      console.warn(`⚠️ Escala '${escalaId}' não encontrada, usando fallback`);
      // Retornar primeira escala disponível como fallback seguro
      return ESCALAS_TRABALHO[0] || {
        id: 'fallback',
        nome: 'Padrão',
        descricao: 'Escala padrão de fallback',
        horasPorDia: 420, // 7 horas
        horasSemana: 42,
        diasUteis: [1, 2, 3, 4, 5, 6] // Segunda a sábado
      };
    }
    
    return escala;
  },

  /**
   * Calcula quantidade de dias úteis no mês baseado na escala
   *
   * Conta apenas os dias da semana que são considerados dias de trabalho
   * na escala especificada, percorrendo todo o mês calendário.
   *
   * @param {number} mes - Mês para cálculo (0-11, onde 0=Janeiro)
   * @param {number} ano - Ano para cálculo (ex: 2024)
   * @param {string} escalaId - ID da escala de trabalho
   * @returns {number} Total de dias úteis no mês para a escala
   *
   * @example
   * // Para março de 2024 com escala 6x1 (segunda a sábado)
   * DateUtils.obterDiasUteis(2, 2024, 'escala_6x1_7h'); // 26 dias
   * 
   * // Para março de 2024 com escala 5x2 (segunda a sexta)
   * DateUtils.obterDiasUteis(2, 2024, 'escala_5x2_8h'); // 21 dias
   */
  obterDiasUteis: (mes, ano, escalaId = ESCALA_PADRAO) => {
    try {
      // Obter configuração da escala
      const escalaInfo = DateUtils.obterEscalaInfo(escalaId);
      
      // Calcular último dia do mês
      const diasNoMes = new Date(ano, mes + 1, 0).getDate();
      let diasUteis = 0;
      
      // Iterar por todos os dias do mês
      for (let dia = 1; dia <= diasNoMes; dia++) {
        const data = new Date(ano, mes, dia);
        const diaSemana = data.getDay(); // 0=Domingo, 1=Segunda, ..., 6=Sábado
        
        // Verificar se este dia da semana é dia útil na escala
        if (escalaInfo.diasUteis.includes(diaSemana)) {
          diasUteis++;
        }
      }
      
      console.log(`📅 ${diasUteis} dias úteis em ${mes + 1}/${ano} (${escalaInfo.nome})`);
      return diasUteis;
      
    } catch (error) {
      console.error('❌ Erro ao calcular dias úteis:', error);
      return 0;
    }
  },

  /**
   * Calcula total de horas que deveriam ser trabalhadas no mês
   *
   * Multiplica a quantidade de dias úteis pela jornada diária da escala
   * para estabelecer a meta mensal de horas trabalhadas.
   *
   * @param {number} mes - Mês para cálculo (0-11)
   * @param {number} ano - Ano para cálculo
   * @param {string} escalaId - ID da escala de trabalho
   * @returns {number} Total de minutos esperados no mês
   *
   * @example
   * // Para escala 7h/dia com 26 dias úteis em março
   * DateUtils.calcularHorasEsperadas(2, 2024, 'escala_6x1_7h'); 
   * // Retorna: 10920 minutos (182 horas)
   */
  calcularHorasEsperadas: (mes, ano, escalaId = ESCALA_PADRAO) => {
    const diasUteis = DateUtils.obterDiasUteis(mes, ano, escalaId);
    const escalaInfo = DateUtils.obterEscalaInfo(escalaId);
    
    const horasEsperadas = diasUteis * escalaInfo.horasPorDia;
    
    console.log(`🎯 Meta mensal: ${(horasEsperadas / 60).toFixed(1)}h (${diasUteis} dias × ${escalaInfo.horasPorDia / 60}h)`);
    return horasEsperadas;
  },

  // ===============================
  // VALIDAÇÕES E CONSISTÊNCIA
  // ===============================

  /**
   * Valida consistência e lógica de horários de entrada/saída
   *
   * Aplica regras de negócio para detectar inconsistências:
   * - Horários em ordem incorreta (saída antes da entrada)
   * - Jornadas excessivamente longas (>12h)
   * - Jornadas muito curtas (<30min - possível erro)
   * - Formatos inválidos
   *
   * @param {string|Date} entrada - Horário de entrada
   * @param {string|Date} saida - Horário de saída
   * @returns {Object} Resultado da validação
   * @returns {boolean} returns.valido - Se os horários são válidos
   * @returns {string} returns.mensagem - Mensagem de erro (se inválido) ou string vazia
   *
   * @example
   * const resultado = DateUtils.validarHorarios("08:00", "17:00");
   * if (!resultado.valido) {
   *   console.error("Erro:", resultado.mensagem);
   * }
   */
  validarHorarios: (entrada, saida) => {
    // Permitir horários vazios (registro ainda sendo preenchido)
    if (!entrada || !saida) {
      return { valido: true, mensagem: '' };
    }
    
    try {
      const entradaDate = new Date(entrada);
      const saidaDate = new Date(saida);
      
      // Validar se são datas/horários válidos
      if (isNaN(entradaDate.getTime()) || isNaN(saidaDate.getTime())) {
        return { 
          valido: false, 
          mensagem: 'Horários com formato inválido detectados' 
        };
      }
      
      // Validar ordem cronológica
      if (saidaDate <= entradaDate) {
        return { 
          valido: false, 
          mensagem: 'Horário de saída deve ser posterior ao de entrada' 
        };
      }
      
      // Calcular duração para validações adicionais
      const horasTrabalhadas = DateUtils.calcularHorasTrabalhadas(entrada, saida);
      
      // Validar jornada máxima razoável (12 horas)
      if (horasTrabalhadas > 12 * 60) {
        return { 
          valido: false, 
          mensagem: 'Jornada superior a 12 horas - verifique os horários' 
        };
      }
      
      // Validar jornada mínima suspeita (menos de 30 min)
      if (horasTrabalhadas < 30) {
        return { 
          valido: false, 
          mensagem: 'Jornada muito curta (menos de 30 minutos) - possível erro' 
        };
      }
      
      return { valido: true, mensagem: '' };
      
    } catch (error) {
      console.error('❌ Erro na validação de horários:', error);
      return { 
        valido: false, 
        mensagem: 'Erro interno na validação dos horários' 
      };
    }
  },

  // ===============================
  // GERAÇÃO DE DATASETS PARA GRÁFICOS
  // ===============================

  /**
   * Gera dataset completo para visualizações gráficas e dashboards
   *
   * Cria array estruturado com dados de todos os dias do mês, incluindo:
   * - Dias com registros (dados reais de entrada/saída)
   * - Dias sem registros (preenchidos com zeros para continuidade)
   * - Cálculos de horas trabalhadas, extras e débitos
   * - Meta diária para linha de referência nos gráficos
   * - Flags de identificação para personalização visual
   *
   * Este dataset é essencial para:
   * - Gráficos de linha contínuos
   * - Comparações visuais com metas
   * - Identificação de padrões mensais
   * - Análises de produtividade
   *
   * @param {Array} registros - Array de registros do período
   * @param {number} mes - Mês para geração (0-11)
   * @param {number} ano - Ano para geração
   * @param {string} escalaId - ID da escala de trabalho
   * @returns {Array} Dataset completo formatado para gráficos
   *
   * @example
   * const dadosGrafico = DateUtils.gerarDadosGraficos(
   *   registrosMes, 2, 2024, 'escala_6x1_7h'
   * );
   * // Retorna array com 31 objetos (um para cada dia de março)
   * // Cada objeto contém: dia, data, horasTrabalhadas, horasExtras, etc.
   */
  gerarDadosGraficos: (registros, mes, ano, escalaId = ESCALA_PADRAO) => {
    console.log('📊 Gerando dataset para gráficos...');
    console.log(`📅 Período: ${mes + 1}/${ano}`);
    console.log(`📋 Registros disponíveis: ${registros?.length || 0}`);
    
    // Informações básicas do período
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const escalaInfo = DateUtils.obterEscalaInfo(escalaId);
    const metaDiaria = escalaInfo.horasPorDia; // Meta em minutos
    
    console.log(`🎯 Meta diária: ${(metaDiaria / 60).toFixed(1)}h`);
    console.log(`📅 Total de dias no mês: ${diasNoMes}`);
    
    const dadosProcessados = [];
    
    // Debug: exibir exemplo de estrutura de registro
    if (registros?.length > 0) {
      console.log('📋 Estrutura do registro:', Object.keys(registros[0]));
    }
    
    // Processar cada dia do mês sequencialmente
    for (let dia = 1; dia <= diasNoMes; dia++) {
      // Formato ISO para busca precisa: YYYY-MM-DD
      const dataISO = `${ano}-${(mes + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
      
      // Buscar registro correspondente a este dia específico
      const registroEncontrado = registros?.find(registro => {
        const match = registro.data === dataISO;
        
        // Log detalhado para os primeiros dias (debugging)
        if (dia <= 3) {
          console.log(`🔍 Dia ${dia}: buscando '${dataISO}' → ${match ? '✅ encontrado' : '❌ não encontrado'}`);
          if (registro.data && dia === 1) {
            console.log(`   Exemplo de data no registro: '${registro.data}'`);
          }
        }
        
        return match;
      });
      
      // Calcular horas trabalhadas para este dia
      const horasTrabalhadasMinutos = registroEncontrado 
        ? DateUtils.calcularHorasTrabalhadas(registroEncontrado.entrada, registroEncontrado.saida)
        : 0;
      
      // Calcular diferença em relação à meta (para extras/débitos)
      const diferencaMinutos = horasTrabalhadasMinutos > 0 
        ? horasTrabalhadasMinutos - metaDiaria 
        : 0;
      
      // Formato de exibição da data para eixo X dos gráficos
      const dataDisplay = `${dia.toString().padStart(2, '0')}/${(mes + 1).toString().padStart(2, '0')}`;
      
      // Criar objeto de dados estruturado para este dia
      const dadoDia = {
        dia,                                                               // Número do dia (1-31)
        data: dataDisplay,                                                // DD/MM para rótulos de eixo
        dataCompleta: dataISO,                                           // YYYY-MM-DD para referência
        horasTrabalhadas: Number((horasTrabalhadasMinutos / 60).toFixed(2)), // Horas decimais para gráficos
        horasExtras: diferencaMinutos > 0 ? Number((diferencaMinutos / 60).toFixed(2)) : 0,
        horasDebito: diferencaMinutos < 0 ? Number((Math.abs(diferencaMinutos) / 60).toFixed(2)) : 0,
        meta: Number((metaDiaria / 60).toFixed(2)),                      // Meta em horas decimais
        temRegistro: !!registroEncontrado,                              // Flag para dias com dados
        // Campos adicionais para análises avançadas
        produtividade: metaDiaria > 0 ? Number(((horasTrabalhadasMinutos / metaDiaria) * 100).toFixed(1)) : 0,
        status: horasTrabalhadasMinutos === 0 ? 'sem-registro' : 
                diferencaMinutos > 0 ? 'extras' : 
                diferencaMinutos < 0 ? 'debito' : 'meta'
      };
      
      dadosProcessados.push(dadoDia);
      
      // Log para dias com registros ou dias extremos (início/fim do mês)
      if (registroEncontrado || dia <= 2 || dia >= diasNoMes - 1) {
        const emoji = registroEncontrado ? '✅' : '⭕';
        console.log(`${emoji} Dia ${dia}: ${dadoDia.horasTrabalhadas}h (${dadoDia.status})`);
      }
    }
    
    // Estatísticas finais do dataset
    const diasComRegistros = dadosProcessados.filter(d => d.temRegistro).length;
    const totalHoras = dadosProcessados.reduce((acc, d) => acc + d.horasTrabalhadas, 0);
    
    console.log(`📊 Dataset gerado com sucesso:`);
    console.log(`   • ${dadosProcessados.length} dias processados`);
    console.log(`   • ${diasComRegistros} dias com registros`);
    console.log(`   • ${totalHoras.toFixed(1)}h total trabalhadas`);
    
    return dadosProcessados;
  },

  // ===============================
  // UTILITÁRIOS AUXILIARES
  // ===============================

  /**
   * Converte string de horário (HH:MM) para minutos desde meia-noite
   *
   * Utilitário para facilitar cálculos e comparações de horários
   * quando se trabalha apenas com horários (sem data).
   *
   * @param {string} horario - Horário no formato HH:MM
   * @returns {number} Minutos desde 00:00 (ex: "08:30" → 510)
   *
   * @example
   * DateUtils.converterHorarioParaMinutos("08:30"); // 510 (8h30 em minutos)
   * DateUtils.converterHorarioParaMinutos("17:45"); // 1065 (17h45 em minutos)
   * DateUtils.converterHorarioParaMinutos("");      // 0
   */
  converterHorarioParaMinutos: (horario) => {
    if (!horario || typeof horario !== 'string') {
      return 0;
    }
    
    try {
      const [horas, minutos] = horario.split(':').map(Number);
      
      if (isNaN(horas) || isNaN(minutos)) {
        console.warn(`⚠️ Horário inválido: ${horario}`);
        return 0;
      }
      
      // Validar faixas válidas
      if (horas < 0 || horas > 23 || minutos < 0 || minutos > 59) {
        console.warn(`⚠️ Horário fora do intervalo válido: ${horario}`);
        return 0;
      }
      
      return (horas * 60) + minutos;
    } catch (error) {
      console.error('❌ Erro ao converter horário:', error);
      return 0;
    }
  },

  /**
   * Obtém informações sobre primeiro e último dia útil do mês
   *
   * Útil para relatórios, validações de período e análises
   * que precisam considerar apenas dias efetivamente trabalhados.
   *
   * @param {number} mes - Mês para análise (0-11)
   * @param {number} ano - Ano para análise
   * @param {string} escalaId - ID da escala de trabalho
   * @returns {Object} Informações sobre extremos dos dias úteis
   * @returns {number|null} returns.primeiro - Primeiro dia útil do mês (1-31)
   * @returns {number|null} returns.ultimo - Último dia útil do mês (1-31)
   * @returns {number} returns.total - Total de dias úteis no mês
   *
   * @example
   * const extremos = DateUtils.obterExtremosDiasUteis(2, 2024, 'escala_6x1_7h');
   * console.log(extremos.primeiro); // 1 (se 1º de março for dia útil)
   * console.log(extremos.ultimo);   // 30 (se 30 de março for dia útil)
   * console.log(extremos.total);    // 26 (total de dias úteis em março)
   */
  obterExtremosDiasUteis: (mes, ano, escalaId = ESCALA_PADRAO) => {
    const escalaInfo = DateUtils.obterEscalaInfo(escalaId);
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    
    let primeiroDiaUtil = null;
    let ultimoDiaUtil = null;
    
    // Percorrer todos os dias do mês procurando primeiro e último dia útil
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const data = new Date(ano, mes, dia);
      const diaSemana = data.getDay(); // 0=Dom, 1=Seg, ..., 6=Sáb
      
      if (escalaInfo.diasUteis.includes(diaSemana)) {
        if (!primeiroDiaUtil) {
          primeiroDiaUtil = dia; // Primeiro encontrado
        }
        ultimoDiaUtil = dia; // Sempre atualiza para o último encontrado
      }
    }
    
    const total = DateUtils.obterDiasUteis(mes, ano, escalaId);
    
    return {
      primeiro: primeiroDiaUtil,
      ultimo: ultimoDiaUtil,
      total
    };
  },

  /**
   * Calcula estatísticas avançadas e insights do período
   *
   * Computa métricas adicionais para análises detalhadas:
   * - Médias e extremos de jornada
   * - Consistência do desempenho
   * - Distribuição de dias acima/abaixo da meta
   * - Indicadores de produtividade
   *
   * @param {Array} registros - Registros do período para análise
   * @param {string} escalaId - ID da escala de trabalho
   * @returns {Object} Estatísticas calculadas
   * @returns {number} returns.mediaDiaria - Média de minutos trabalhados por dia
   * @returns {number} returns.maiorJornada - Maior jornada registrada (em minutos)
   * @returns {number} returns.menorJornada - Menor jornada registrada (em minutos)
   * @returns {number} returns.diasAcimaMeta - Quantidade de dias com horas extras
   * @returns {number} returns.diasAbaixoMeta - Quantidade de dias com déficit
   * @returns {number} returns.consistencia - Índice de consistência (0-100)
   *
   * @example
   * const stats = DateUtils.calcularEstatisticas(registrosMes, 'escala_6x1_7h');
   * console.log(`Média diária: ${stats.mediaDiaria / 60}h`);
   * console.log(`Consistência: ${stats.consistencia}%`);
   */
  calcularEstatisticas: (registros, escalaId = ESCALA_PADRAO) => {
    // Valores padrão para casos sem dados
    const estatisticasVazias = {
      mediaDiaria: 0,
      maiorJornada: 0,
      menorJornada: 0,
      diasAcimaMeta: 0,
      diasAbaixoMeta: 0,
      consistencia: 0
    };

    if (!Array.isArray(registros) || registros.length === 0) {
      return estatisticasVazias;
    }

    const escalaInfo = DateUtils.obterEscalaInfo(escalaId);
    
    // Calcular jornadas válidas (apenas dias com entrada e saída)
    const jornadas = registros
      .map(registro => DateUtils.calcularHorasTrabalhadas(registro.entrada, registro.saida))
      .filter(horas => horas > 0); // Filtrar apenas jornadas válidas

    if (jornadas.length === 0) {
      return estatisticasVazias;
    }

    // Cálculos básicos
    const totalMinutos = jornadas.reduce((acc, horas) => acc + horas, 0);
    const mediaDiaria = totalMinutos / jornadas.length;
    const maiorJornada = Math.max(...jornadas);
    const menorJornada = Math.min(...jornadas);
    
    // Análise de distribuição em relação à meta
    const diasAcimaMeta = jornadas.filter(horas => horas > escalaInfo.horasPorDia).length;
    const diasAbaixoMeta = jornadas.filter(horas => horas < escalaInfo.horasPorDia).length;
    
    // Cálculo de consistência (baseado na variação em relação à média)
    let consistencia = 0;
    if (jornadas.length > 1) {
      // Calcular variância
      const variancia = jornadas.reduce((acc, horas) => {
        return acc + Math.pow(horas - mediaDiaria, 2);
      }, 0) / jornadas.length;
      
      const desvioPadrao = Math.sqrt(variancia);
      
      // Converter para índice de consistência (0-100)
      // Menor desvio = maior consistência
      if (mediaDiaria > 0) {
        const coeficienteVariacao = desvioPadrao / mediaDiaria;
        consistencia = Math.max(0, Math.min(100, 100 - (coeficienteVariacao * 100)));
      }
    } else {
      // Com apenas uma jornada, consistência é máxima
      consistencia = 100;
    }

    return {
      mediaDiaria: Math.round(mediaDiaria),
      maiorJornada: Math.round(maiorJornada),
      menorJornada: Math.round(menorJornada),
      diasAcimaMeta,
      diasAbaixoMeta,
      consistencia: Math.round(consistencia)
    };
  },

  /**
   * Gera resumo textual inteligente do desempenho
   *
   * Cria insights automáticos baseados nos dados, fornecendo
   * análise contextualizada do desempenho do usuário.
   *
   * @param {Object} resumo - Dados de resumo do período
   * @param {Object} estatisticas - Estatísticas avançadas
   * @returns {Array<string>} Array de insights textuais
   *
   * @example
   * const insights = DateUtils.gerarInsights(resumo, estatisticas);
   * insights.forEach(insight => console.log(insight));
   */
  gerarInsights: (resumo, estatisticas) => {
    const insights = [];
    
    // Análise de cumprimento de meta
    if (resumo.percentualCumprido >= 100) {
      insights.push(`🎯 Excelente! Você cumpriu ${resumo.percentualCumprido}% da meta mensal.`);
    } else if (resumo.percentualCumprido >= 80) {
      insights.push(`📈 Bom desempenho! ${resumo.percentualCumprido}% da meta atingida.`);
    } else {
      insights.push(`⚠️ Meta em ${resumo.percentualCumprido}%. Considere ajustar a rotina.`);
    }
    
    // Análise de saldo
    if (resumo.saldoFinal > 60) { // Mais de 1h de saldo
      insights.push(`✅ Você tem ${DateUtils.formatarMinutos(resumo.saldoFinal)} de saldo positivo!`);
    } else if (resumo.saldoFinal < -60) { // Mais de 1h de déficit
      insights.push(`🔴 Atenção: ${DateUtils.formatarMinutos(Math.abs(resumo.saldoFinal))} em débito.`);
    }
    
    // Análise de consistência
    if (estatisticas.consistencia >= 80) {
      insights.push(`🔄 Sua jornada é muito consistente (${estatisticas.consistencia}%).`);
    } else if (estatisticas.consistencia < 50) {
      insights.push(`📊 Jornadas variáveis detectadas. Considere maior regularidade.`);
    }
    
    // Análise de produtividade
    const mediaHoras = estatisticas.mediaDiaria / 60;
    if (mediaHoras > (resumo.escalaInfo?.horasPorDia / 60 || 7) + 1) {
      insights.push(`💪 Média de ${mediaHoras.toFixed(1)}h/dia - acima da meta!`);
    }
    
    return insights;
  }
};