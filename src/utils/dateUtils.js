export const JORNADA_PADRAO = 7 * 60; // 7 horas em minutos

export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const DateUtils = {
  formatarData: (data) => {
    if (!data) return '';
    const date = new Date(data + "T00:00:00"); // Forçar interpretação local
    return date.toLocaleDateString('pt-BR');
  },

  formatarHora: (hora) => {
    if (!hora) return '';
    const date = new Date(hora);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  },

  formatarMinutos: (minutos) => {
    // CORREÇÃO: Melhor tratamento do zero
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
      
      // Verificar se as datas são válidas
      if (isNaN(entradaDate.getTime()) || isNaN(saidaDate.getTime())) {
        return 0;
      }
      
      const diffMs = saidaDate.getTime() - entradaDate.getTime();
      
      // Se a diferença for negativa (saída antes da entrada), retornar 0
      if (diffMs < 0) return 0;
      
      return Math.floor(diffMs / (1000 * 60)); // retorna minutos
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
        
        // 0 = Domingo, 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado
        // Considerando segunda a sábado (1 a 6) como dias úteis - folga apenas no domingo
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
    // Calcular horas esperadas baseado nos dias úteis
    const diasUteis = DateUtils.obterDiasUteis(mes, ano);
    return diasUteis * (7 * 60); // 7 horas por dia em minutos
  }
};