import { DateUtils } from '../utils/dateUtils';
import { PDFUtils } from '../utils/PDFUtils';

/**
 * Serviços para manipulação de dados com suporte a escalas de trabalho
 * 
 * Este módulo centraliza todas as operações de CRUD (Create, Read, Update, Delete)
 * e funcionalidades avançadas como importação/exportação de dados.
 * 
 * Principais responsabilidades:
 * - Gerenciamento do ciclo de vida dos registros
 * - Validação de regras de negócio
 * - Importação e exportação de dados
 * - Geração de relatórios
 * - Integração com utilitários de data e PDF
 * 
 * @namespace DataService
 */
export const DataService = {
  
  // ===============================
  // OPERAÇÕES CRUD DE REGISTROS
  // ===============================
  
  /**
   * Adiciona novo registro de dia trabalhado
   * 
   * Aplica validações de negócio antes da criação:
   * - Verifica se não excede o limite de dias úteis
   * - Define data padrão baseada no período atual
   * - Gera ID único para o registro
   * - Inicializa com horários vazios para preenchimento posterior
   * 
   * @param {Array} registros - Array atual de registros
   * @param {Function} setRegistros - Setter do estado de registros
   * @param {Object} resumo - Objeto com estatísticas do período
   * @param {number} mesAtual - Mês atual (0-11)
   * @param {number} anoAtual - Ano atual
   * @param {string} escalaAtual - ID da escala de trabalho
   */
  adicionarRegistro: (registros, setRegistros, resumo, mesAtual, anoAtual, escalaAtual) => {
    // Validação de limite: verificar se já atingiu o máximo de dias úteis
    if (resumo.diasTrabalhados >= resumo.diasUteis) {
      alert(`⚠️ Limite atingido! Você já registrou ${resumo.diasUteis} dias úteis para este mês.`);
      return;
    }

    // Determinar data padrão para o novo registro
    const hoje = new Date();
    const ehMesAtual = mesAtual === hoje.getMonth() && anoAtual === hoje.getFullYear();

    let dataParaUsar;
    if (ehMesAtual) {
      // Se estiver visualizando o mês atual, usar data de hoje
      dataParaUsar = hoje;
    } else {
      // Se estiver em outro período, usar primeiro dia do mês
      dataParaUsar = new Date(anoAtual, mesAtual, 1);
    }

    // Converter para formato ISO (YYYY-MM-DD)
    const dataFormatada = dataParaUsar.toISOString().split("T")[0];

    // Criar novo registro com estrutura padrão
    const novoRegistro = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // ID único
      data: dataFormatada,
      entrada: "",  // Será preenchido pelo usuário
      saida: "",    // Será preenchido pelo usuário
    };

    console.log("➕ Adicionando novo registro:", novoRegistro);

    // Adicionar ao array de registros
    setRegistros((registrosAtuais) => [...registrosAtuais, novoRegistro]);
  },

  /**
   * Remove registro específico após confirmação
   * 
   * Aplica dupla confirmação para evitar exclusões acidentais
   * e remove o registro do array de forma imutável.
   * 
   * @param {Function} setRegistros - Setter do estado de registros
   * @param {string} id - ID único do registro a ser removido
   */
  removerRegistro: (setRegistros, id) => {
    // Confirmação de segurança
    const confirmacao = window.confirm(
      "🗑️ Tem certeza que deseja excluir este registro?\n\nEsta ação não pode ser desfeita."
    );
    
    if (confirmacao) {
      console.log("🗑️ Removendo registro:", id);
      
      // Filtrar array removendo o registro com o ID especificado
      setRegistros((registrosAtuais) => 
        registrosAtuais.filter((registro) => registro.id !== id)
      );
    }
  },

  /**
   * Atualiza campo específico de um registro
   * 
   * Permite modificação granular de qualquer campo do registro
   * mantendo imutabilidade do estado.
   * 
   * @param {Function} setRegistros - Setter do estado de registros
   * @param {string} id - ID do registro a ser atualizado
   * @param {string} campo - Nome do campo (data, entrada, saida)
   * @param {any} valor - Novo valor para o campo
   */
  atualizarRegistro: (setRegistros, id, campo, valor) => {
    console.log(`✏️ Atualizando registro ${id}: ${campo} = ${valor}`);
    
    setRegistros((registrosAtuais) =>
      registrosAtuais.map((registro) => 
        registro.id === id 
          ? { ...registro, [campo]: valor }  // Atualizar campo específico
          : registro                         // Manter registro inalterado
      )
    );
  },

  /**
   * Manipula mudanças em campos de horário (entrada/saída)
   * 
   * Converte input de time (HH:MM) para ISO string completa,
   * considerando a data do registro para criar timestamp correto.
   * 
   * @param {Array} registros - Array atual de registros
   * @param {Function} setRegistros - Setter do estado de registros
   * @param {string} id - ID do registro
   * @param {string} campo - "entrada" ou "saida"
   * @param {string} valor - Horário no formato HH:MM ou string vazia
   */
  handleTimeChange: (registros, setRegistros, id, campo, valor) => {
    if (valor) {
      // Encontrar o registro correspondente
      const registro = registros.find((r) => r.id === id);
      
      if (registro) {
        // Extrair horas e minutos do input
        const [hours, minutes] = valor.split(":");
        
        // Criar data completa combinando data do registro com horário
        const dataCompleta = new Date(registro.data + "T00:00:00");
        dataCompleta.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        // Converter para ISO string e atualizar
        DataService.atualizarRegistro(
          setRegistros, 
          id, 
          campo, 
          dataCompleta.toISOString()
        );
      }
    } else {
      // Limpar horário (valor vazio)
      DataService.atualizarRegistro(setRegistros, id, campo, "");
    }
  },

  // ===============================
  // GERAÇÃO DE RELATÓRIOS
  // ===============================

  /**
   * Gera relatório PDF do período atual
   * 
   * Delega para PDFUtils a geração do arquivo, tratando
   * erros e fornecendo feedback ao usuário.
   * 
   * @param {Array} registrosMes - Registros do período atual
   * @param {Object} resumo - Estatísticas calculadas
   * @param {number} mesAtual - Mês atual
   * @param {number} anoAtual - Ano atual
   * @param {string} escalaAtual - ID da escala de trabalho
   */
  gerarPDF: async (registrosMes, resumo, mesAtual, anoAtual, escalaAtual) => {
    try {
      console.log("📄 Iniciando geração de PDF...");
      
      const sucesso = await PDFUtils.gerarRelatorioPDF(
        registrosMes, 
        resumo, 
        mesAtual, 
        anoAtual, 
        escalaAtual
      );
      
      if (sucesso) {
        alert("✅ Relatório PDF gerado com sucesso!");
      } else {
        alert("❌ Erro ao gerar relatório PDF.");
      }
    } catch (error) {
      console.error("❌ Erro ao gerar PDF:", error);
      alert("❌ Erro inesperado ao gerar relatório PDF.");
    }
  },

  // ===============================
  // IMPORTAÇÃO E EXPORTAÇÃO DE DADOS
  // ===============================

  /**
   * Exporta dados para arquivo CSV
   * 
   * Gera arquivo CSV completo com:
   * - Dados detalhados de cada registro
   * - Cálculos de horas e diferenças
   * - Resumo do período
   * - Configurações da escala aplicada
   * 
   * @param {Array} registros - Todos os registros do sistema
   * @param {Object} resumo - Estatísticas do período atual
   * @param {string} escalaAtual - ID da escala de trabalho
   */
  exportarDados: (registros, resumo, escalaAtual) => {
    try {
      console.log("📤 Iniciando exportação de dados...");
      
      // Obter informações da escala atual
      const escalaInfo = DateUtils.obterEscalaInfo(escalaAtual);
      
      // Definir cabeçalho do CSV
      const cabecalho = [
        "Data", 
        "Entrada", 
        "Saída", 
        "Horas Trabalhadas", 
        "Diferença da Jornada", 
        "Status", 
        "Escala"
      ];

      // Processar cada registro para linha do CSV
      const linhasCSV = registros.map((registro) => {
        // Calcular métricas do registro
        const horasTrabalhadas = DateUtils.calcularHorasTrabalhadas(
          registro.entrada, 
          registro.saida
        );
        const diferenca = horasTrabalhadas > 0 
          ? horasTrabalhadas - escalaInfo.horasPorDia 
          : 0;

        // Determinar status baseado na diferença
        let status = "Normal";
        if (diferenca > 0) status = "Hora Extra";
        if (diferenca < 0) status = "Débito";
        if (horasTrabalhadas === 0) status = "Sem Registro";

        // Retornar linha formatada
        return [
          DateUtils.formatarData(registro.data),
          registro.entrada ? DateUtils.formatarHora(registro.entrada) : "",
          registro.saida ? DateUtils.formatarHora(registro.saida) : "",
          horasTrabalhadas > 0 ? DateUtils.formatarMinutos(horasTrabalhadas) : "0:00h",
          horasTrabalhadas > 0 ? DateUtils.formatarMinutos(diferenca) : "0:00h",
          status,
          escalaInfo.nome,
        ];
      });

      // Linha de resumo do período
      const resumoLinha = [
        "--- RESUMO DO PERÍODO ---", 
        "", 
        "",
        DateUtils.formatarMinutos(resumo.horasTrabalhadasTotal),
        DateUtils.formatarMinutos(resumo.saldoFinal),
        `${resumo.diasTrabalhados}/${resumo.diasUteis} dias`,
        escalaInfo.nome,
      ];

      // Linha de configuração da escala
      const configEscalaLinha = [
        "--- CONFIGURAÇÃO DA ESCALA ---", 
        escalaInfo.nome,
        escalaInfo.descricao,
        `${escalaInfo.horasPorDia / 60}h/dia`,
        `${escalaInfo.horasSemana}h/semana`,
        "",
        ""
      ];

      // Combinar todas as linhas
      const todasLinhas = [
        cabecalho, 
        ...linhasCSV, 
        [""], 
        resumoLinha, 
        [""], 
        configEscalaLinha
      ];

      // Converter para formato CSV
      const csvContent = todasLinhas
        .map((linha) => linha.map((campo) => `"${campo}"`).join(","))
        .join("\n");

      // Criar e baixar arquivo
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      // Nome do arquivo baseado na escala e data
      const nomeArquivo = `horas-extras-${escalaInfo.nome
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')}-${new Date().toISOString().split("T")[0]}.csv`;

      link.href = url;
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert("✅ Dados exportados com sucesso em formato CSV!");
      console.log("📤 Exportação concluída:", nomeArquivo);

    } catch (error) {
      console.error("❌ Erro ao exportar CSV:", error);
      alert("❌ Erro ao exportar dados. Tente novamente.");
    }
  },

  /**
   * Importa dados de arquivo CSV
   * 
   * Processa arquivo CSV com validações robustas:
   * - Verifica formato de arquivo
   * - Valida estrutura de colunas
   * - Converte formatos de data e hora
   * - Gera IDs únicos para novos registros
   * - Substitui dados atuais após confirmação
   * 
   * @param {Function} setRegistros - Setter do estado de registros
   * @param {Event} event - Evento do input file
   */
  importarDados: (setRegistros, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar extensão do arquivo
    if (!file.name.toLowerCase().endsWith(".csv")) {
      alert("❌ Por favor, selecione um arquivo CSV válido.");
      return;
    }

    console.log("📥 Iniciando importação de:", file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target.result;
        const linhas = csvContent.split("\n");

        // Validar se arquivo não está vazio
        if (linhas.length < 2) {
          alert("❌ Arquivo CSV vazio ou inválido.");
          return;
        }

        // Analisar cabeçalho para validar estrutura
        const cabecalho = linhas[0].split(",").map((col) => col.replace(/"/g, "").trim());
        const colunasEsperadas = ["Data", "Entrada", "Saída"];
        const temColunasBasicas = colunasEsperadas.some((col) =>
          cabecalho.some((header) => header.includes(col))
        );

        if (!temColunasBasicas) {
          alert("❌ Arquivo CSV não possui as colunas esperadas (Data, Entrada, Saída).");
          return;
        }

        const registrosImportados = [];

        // Processar cada linha de dados
        for (let i = 1; i < linhas.length; i++) {
          const linha = linhas[i].trim();
          
          // Pular linhas vazias, resumos ou configurações
          if (!linha || 
              linha.startsWith("---") || 
              linha.includes("RESUMO") || 
              linha.includes("CONFIGURAÇÃO")) {
            continue;
          }

          const campos = linha.split(",").map((campo) => campo.replace(/"/g, "").trim());

          // Validar se linha tem dados suficientes
          if (campos.length >= 3 && campos[0] && !campos[0].startsWith("---")) {
            try {
              // Processar data
              let dataFormatada = campos[0];
              if (dataFormatada.includes("/")) {
                // Converter DD/MM/YYYY para YYYY-MM-DD
                const [dia, mes, ano] = dataFormatada.split("/");
                dataFormatada = `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
              }

              const entradaStr = campos[1];
              const saidaStr = campos[2];

              // Processar horários
              let entradaISO = "";
              let saidaISO = "";

              if (entradaStr && entradaStr !== "") {
                const [horaE, minE] = entradaStr.split(":").map((x) => parseInt(x));
                if (!isNaN(horaE) && !isNaN(minE)) {
                  const entradaDate = new Date(dataFormatada + "T00:00:00");
                  entradaDate.setHours(horaE, minE, 0, 0);
                  entradaISO = entradaDate.toISOString();
                }
              }

              if (saidaStr && saidaStr !== "") {
                const [horaS, minS] = saidaStr.split(":").map((x) => parseInt(x));
                if (!isNaN(horaS) && !isNaN(minS)) {
                  const saidaDate = new Date(dataFormatada + "T00:00:00");
                  saidaDate.setHours(horaS, minS, 0, 0);
                  saidaISO = saidaDate.toISOString();
                }
              }

              // Criar registro importado
              registrosImportados.push({
                id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${i}`,
                data: dataFormatada,
                entrada: entradaISO,
                saida: saidaISO,
              });
              
            } catch (error) {
              console.warn(`⚠️ Erro na linha ${i + 1}:`, error);
              continue;
            }
          }
        }

        // Validar se encontrou registros válidos
        if (registrosImportados.length === 0) {
          alert("❌ Nenhum registro válido encontrado no arquivo CSV.");
          return;
        }

        // Confirmar substituição dos dados
        const confirmacao = window.confirm(
          `📊 Foram encontrados ${registrosImportados.length} registros válidos.\n\n` +
          `⚠️ Deseja substituir todos os dados atuais pelos dados importados?\n\n` +
          `Esta ação não pode ser desfeita.`
        );
        
        if (confirmacao) {
          setRegistros(registrosImportados);
          alert(`✅ ${registrosImportados.length} registros importados com sucesso!`);
          console.log("📥 Importação concluída:", registrosImportados.length, "registros");
        }
        
      } catch (error) {
        console.error("❌ Erro ao processar CSV:", error);
        alert("❌ Erro ao processar arquivo CSV. Verifique o formato e tente novamente.");
      }
    };

    // Iniciar leitura do arquivo
    reader.readAsText(file);
    
    // Limpar input para permitir reimportação do mesmo arquivo
    event.target.value = "";
  },

  // ===============================
  // GERENCIAMENTO DE DADOS
  // ===============================

  /**
   * Remove todos os dados da aplicação
   * 
   * Aplica dupla confirmação para evitar perda acidental de dados
   * e limpa tanto o estado quanto o localStorage (quando disponível).
   * 
   * @param {Function} setRegistros - Setter do estado de registros
   */
  limparDados: (setRegistros) => {
    // Primeira confirmação
    const primeiraConfirmacao = window.confirm(
      "🗑️ Tem certeza que deseja limpar TODOS os dados?\n\n" +
      "Esta ação removerá permanentemente:\n" +
      "• Todos os registros de ponto\n" +
      "• Histórico de horas trabalhadas\n" +
      "• Configurações salvas\n\n" +
      "Esta ação não pode ser desfeita."
    );
    
    if (primeiraConfirmacao) {
      // Segunda confirmação para maior segurança
      const segundaConfirmacao = window.confirm(
        "⚠️ ATENÇÃO: CONFIRMAÇÃO FINAL\n\n" +
        "Todos os registros serão perdidos permanentemente.\n\n" +
        "Tem certeza absoluta que deseja continuar?"
      );
      
      if (segundaConfirmacao) {
        console.log("🗑️ Iniciando limpeza completa dos dados...");
        
        // Limpar estado da aplicação
        setRegistros([]);
        
        // Limpar localStorage (quando disponível)
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem("registrosHorasExtras");
            localStorage.removeItem("escalaTrabalho");
            console.log("🗑️ localStorage limpo");
          }
        } catch (error) {
          console.warn("⚠️ Erro ao limpar localStorage:", error);
        }
        
        alert("✅ Todos os dados foram removidos com sucesso.");
        console.log("🗑️ Limpeza concluída");
      }
    }
  }
};