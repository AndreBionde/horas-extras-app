export const JORNADA_PADRAO = 7 * 60; // 7 horas em minutos

export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const DateUtils = {
  formatarData: (data) => {
    if (!data) return '';
    const date = new Date(data + "T00:00:00");
    return date.toLocaleDateString('pt-BR');
  },

  formatarHora: (hora) => {
    if (!hora) return '';
    const date = new Date(hora);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  },

  formatarMinutos: (minutos) => {
    if (minutos === 0) return '0:00h';
    
    const horas = Math.floor(Math.abs(minutos) / 60);
    const mins = Math.abs(minutos) % 60;
    const sinal = minutos < 0 ? '-' : minutos > 0 ? '+' : '';
    return `${sinal}${horas}:${mins.toString().padStart(2, '0')}h`;
  },

  calcularHorasTrabalhadas: (entrada, saida) => {
    if (!entrada || !saida) return 0;
    
    try {
      const entradaDate = new Date(entrada);
      const saidaDate = new Date(saida);
      
      if (isNaN(entradaDate.getTime()) || isNaN(saidaDate.getTime())) {
        return 0;
      }
      
      const diffMs = saidaDate.getTime() - entradaDate.getTime();
      if (diffMs < 0) return 0;
      
      return Math.floor(diffMs / (1000 * 60));
    } catch (error) {
      console.error('Erro ao calcular horas trabalhadas:', error);
      return 0;
    }
  },

  obterDiasUteis: (mes, ano) => {
    try {
      const diasNoMes = new Date(ano, mes + 1, 0).getDate();
      let diasUteis = 0;
      
      for (let dia = 1; dia <= diasNoMes; dia++) {
        const data = new Date(ano, mes, dia);
        const diaSemana = data.getDay();
        
        // 0 = Domingo, 1-6 = Segunda a Sábado (dias úteis)
        if (diaSemana >= 1 && diaSemana <= 6) {
          diasUteis++;
        }
      }
      
      return diasUteis;
    } catch (error) {
      console.error('Erro ao calcular dias úteis:', error);
      return 0;
    }
  },

  calcularHorasEsperadas: (mes, ano) => {
    // CORREÇÃO: Calcular horas esperadas baseado nos dias úteis corretos
    const diasUteis = DateUtils.obterDiasUteis(mes, ano);
    return diasUteis * JORNADA_PADRAO; // 7 horas por dia útil em minutos
  },

  // Nova funcionalidade: validação de horários
  validarHorarios: (entrada, saida) => {
    if (!entrada || !saida) return { valido: true, mensagem: '' };
    
    const entradaDate = new Date(entrada);
    const saidaDate = new Date(saida);
    
    if (saidaDate <= entradaDate) {
      return { valido: false, mensagem: 'Horário de saída deve ser posterior ao de entrada' };
    }
    
    const horasTrabalhadas = DateUtils.calcularHorasTrabalhadas(entrada, saida);
    if (horasTrabalhadas > 12 * 60) { // Mais de 12 horas
      return { valido: false, mensagem: 'Jornada superior a 12 horas detectada' };
    }
    
    return { valido: true, mensagem: '' };
  }
};