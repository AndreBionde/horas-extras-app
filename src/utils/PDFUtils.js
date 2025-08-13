import { MESES, JORNADA_PADRAO } from '../constants/constants';
import { DateUtils } from './dateUtils';

/**
 * Gerador de relatórios PDF usando jsPDF
 * IMPORTANTE: Instalar jsPDF com: npm install jspdf
 */

// Importar jsPDF
import jsPDF from 'jspdf';

export const PDFUtils = {
  /**
   * Gerar relatório PDF completo
   */
  gerarRelatorioPDF: async (dados, resumo, mes, ano) => {
    try {
      // Criar nova instância do jsPDF
      const pdf = new jsPDF();
      
      // Configurações
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPos = margin;
      
      // Cabeçalho com fundo azul
      pdf.setFillColor(30, 60, 114); // #1e3c72
      pdf.rect(0, 0, pageWidth, 25, 'F');
      
      pdf.setTextColor(255, 255, 255); // Branco
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RELATÓRIO DE HORAS EXTRAS', pageWidth / 2, 15, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${MESES[mes]} ${ano}`, pageWidth / 2, 22, { align: 'center' });
      
      // Resetar cor do texto para preto
      pdf.setTextColor(0, 0, 0);
      yPos = 40;
      
      // Resumo
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RESUMO MENSAL', margin, yPos);
      
      yPos += 15;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      const resumoItems = [
        `Dias Trabalhados: ${resumo.diasTrabalhados}/${resumo.diasUteis}`,
        `Horas Trabalhadas: ${DateUtils.formatarMinutos(resumo.horasTrabalhadasTotal)}`,
        `Horas Extras: ${DateUtils.formatarMinutos(resumo.totalExtras)}`,
        `Horas em Débito: ${DateUtils.formatarMinutos(resumo.totalDebito)}`,
        `Saldo Final: ${DateUtils.formatarMinutos(resumo.saldoFinal)}`,
        `Percentual Cumprido: ${resumo.percentualCumprido}%`
      ];
      
      resumoItems.forEach(item => {
        pdf.text(item, margin, yPos);
        yPos += 8;
      });
      
      // Espaço antes da tabela
      yPos += 15;
      
      // Título da tabela
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('REGISTROS DETALHADOS', margin, yPos);
      yPos += 15;
      
      // Cabeçalho da tabela
      pdf.setFillColor(240, 240, 240); // Cinza claro
      pdf.rect(margin, yPos - 5, pageWidth - (margin * 2), 10, 'F');
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Data', margin + 5, yPos + 2);
      pdf.text('Entrada', margin + 35, yPos + 2);
      pdf.text('Saída', margin + 70, yPos + 2);
      pdf.text('H. Trabalhadas', margin + 100, yPos + 2);
      pdf.text('Diferença', margin + 150, yPos + 2);
      
      yPos += 15;
      
      // Dados da tabela
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      
      dados.forEach((registro, index) => {
        // Verificar se precisa de nova página
        if (yPos > pageHeight - 40) {
          pdf.addPage();
          yPos = margin;
          
          // Repetir cabeçalho da tabela na nova página
          pdf.setFillColor(240, 240, 240);
          pdf.rect(margin, yPos - 5, pageWidth - (margin * 2), 10, 'F');
          pdf.setFont('helvetica', 'bold');
          pdf.text('Data', margin + 5, yPos + 2);
          pdf.text('Entrada', margin + 35, yPos + 2);
          pdf.text('Saída', margin + 70, yPos + 2);
          pdf.text('H. Trabalhadas', margin + 100, yPos + 2);
          pdf.text('Diferença', margin + 150, yPos + 2);
          yPos += 15;
          pdf.setFont('helvetica', 'normal');
        }
        
        // Linha zebrada
        if (index % 2 === 0) {
          pdf.setFillColor(250, 250, 250);
          pdf.rect(margin, yPos - 3, pageWidth - (margin * 2), 8, 'F');
        }
        
        pdf.setTextColor(0, 0, 0);
        pdf.text(DateUtils.formatarData(registro.data), margin + 5, yPos + 2);
        pdf.text(DateUtils.formatarHora(registro.entrada), margin + 35, yPos + 2);
        pdf.text(DateUtils.formatarHora(registro.saida), margin + 70, yPos + 2);
        
        const horasTrabalhadas = DateUtils.calcularHorasTrabalhadas(registro.entrada, registro.saida);
        pdf.text(DateUtils.formatarMinutos(horasTrabalhadas), margin + 100, yPos + 2);
        
        const diferenca = horasTrabalhadas > 0 ? horasTrabalhadas - JORNADA_PADRAO : 0;
        
        // Colorir diferença
        if (diferenca > 0) {
          pdf.setTextColor(16, 185, 129); // Verde para extras
        } else if (diferenca < 0) {
          pdf.setTextColor(239, 68, 68); // Vermelho para débito
        } else {
          pdf.setTextColor(0, 0, 0); // Preto para neutro
        }
        
        pdf.text(DateUtils.formatarMinutos(diferenca), margin + 150, yPos + 2);
        
        yPos += 8;
      });
      
      // Rodapé
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setTextColor(102, 102, 102); // Cinza
        pdf.setFontSize(8);
        pdf.text(
          `Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
        pdf.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      }
      
      // Salvar o PDF
      const fileName = `relatorio-horas-${MESES[mes].toLowerCase()}-${ano}.pdf`;
      pdf.save(fileName);
      
      return true;
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      return false;
    }
  },
  
  /**
   * Gerar PDF com resumo simples (versão mais leve)
   */
  gerarResumoSimples: async (resumo, mes, ano) => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPos = 30;
      
      // Título
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Resumo de Horas - ${MESES[mes]} ${ano}`, pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 30;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      const items = [
        `Dias Trabalhados: ${resumo.diasTrabalhados}/${resumo.diasUteis}`,
        `Horas Trabalhadas: ${DateUtils.formatarMinutos(resumo.horasTrabalhadasTotal)}`,
        `Horas Extras: ${DateUtils.formatarMinutos(resumo.totalExtras)}`,
        `Horas em Débito: ${DateUtils.formatarMinutos(resumo.totalDebito)}`,
        `Saldo Final: ${DateUtils.formatarMinutos(resumo.saldoFinal)}`,
        `Percentual Cumprido: ${resumo.percentualCumprido}%`
      ];
      
      items.forEach(item => {
        pdf.text(item, 30, yPos);
        yPos += 10;
      });
      
      pdf.save(`resumo-horas-${MESES[mes].toLowerCase()}-${ano}.pdf`);
      return true;
      
    } catch (error) {
      console.error('Erro ao gerar resumo PDF:', error);
      return false;
    }
  }
};