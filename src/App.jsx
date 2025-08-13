import { DateUtils } from "./utils/dateUtils";
import { useData } from "./hooks/useData";
import { DataService } from "./services/dataService";
import { Header } from "./components/Header";
import { SummaryCard } from "./components/SummaryCard";
import { Controls } from "./components/Controls";
import { Dashboard } from "./components/Dashboard";
import { RegistrosTable } from "./components/RegistrosTable";

/**
 * Aplicação Principal - Sistema de Controle de Horas Extras
 *
 * Componente raiz que orquestra toda a aplicação:
 * - Gerencia estado global através do hook useData
 * - Coordena comunicação entre componentes
 * - Implementa layout principal responsivo
 * - Suporte a múltiplas escalas de trabalho
 *
 */
const App = () => {
  // ===============================
  // HOOKS E ESTADO GLOBAL
  // ===============================

  /**
   * Hook personalizado para gerenciamento de dados
   *
   * Centraliza toda lógica de estado, persistência e cálculos:
   * - registros: Array com todos os registros de ponto
   * - registrosMes: Registros filtrados pelo período atual
   * - resumo: Métricas calculadas (horas extras, débitos, etc.)
   * - escalaAtual: Escala de trabalho selecionada
   */
  const {
    registros,
    setRegistros,
    mesAtual,
    setMesAtual,
    anoAtual,
    setAnoAtual,
    escalaAtual,
    setEscalaAtual,
    registrosMes,
    resumo,
  } = useData();

  // ===============================
  // HANDLERS DE AÇÕES
  // ===============================

  /**
   * Adiciona novo registro de dia trabalhado
   *
   * Valida limites de dias úteis antes da criação
   */
  const adicionarRegistro = () =>
    DataService.adicionarRegistro(
      registros,
      setRegistros,
      resumo,
      mesAtual,
      anoAtual,
      escalaAtual
    );

  /**
   * Remove registro específico
   *
   * @param {string} id - ID único do registro
   */
  const removerRegistro = (id) => DataService.removerRegistro(setRegistros, id);

  /**
   * Atualiza campo específico de um registro
   *
   * @param {string} id - ID do registro
   * @param {string} campo - Nome do campo (data, entrada, saida)
   * @param {any} valor - Novo valor para o campo
   */
  const atualizarRegistro = (id, campo, valor) =>
    DataService.atualizarRegistro(setRegistros, id, campo, valor);

  /**
   * Manipula mudanças em campos de horário (entrada/saída)
   *
   * Converte formato de time input para ISO string
   *
   * @param {string} id - ID do registro
   * @param {string} campo - "entrada" ou "saida"
   * @param {string} valor - Horário no formato HH:MM
   */
  const handleTimeChange = (id, campo, valor) =>
    DataService.handleTimeChange(registros, setRegistros, id, campo, valor);

  /**
   * Gera relatório PDF do período atual
   */
  const gerarPDF = () =>
    DataService.gerarPDF(registrosMes, resumo, mesAtual, anoAtual, escalaAtual);

  /**
   * Exporta dados para arquivo CSV
   */
  const exportarDados = () =>
    DataService.exportarDados(registros, resumo, escalaAtual);

  /**
   * Importa dados de arquivo CSV
   *
   * @param {Event} event - Evento do input file
   */
  const importarDados = (event) =>
    DataService.importarDados(setRegistros, event);

  /**
   * Remove todos os dados da aplicação
   *
   * Inclui confirmações de segurança
   */
  const limparDados = () => DataService.limparDados(setRegistros);

  // ===============================
  // RENDER PRINCIPAL
  // ===============================

  return (
    <div className="app-container">
      {/* Cabeçalho com branding */}
      <Header />

      {/* Container principal com layout responsivo */}
      <div className="main-container">
        {/* Painel de controles com seletor de escala */}
        <Controls
          mesAtual={mesAtual}
          setMesAtual={setMesAtual}
          anoAtual={anoAtual}
          setAnoAtual={setAnoAtual}
          escalaAtual={escalaAtual}
          setEscalaAtual={setEscalaAtual}
          onAdicionarRegistro={adicionarRegistro}
          diasTrabalhados={resumo.diasTrabalhados}
          onExportarDados={exportarDados}
          onImportarDados={importarDados}
          onLimparDados={limparDados}
          onGerarPDF={gerarPDF}
          diasUteis={resumo.diasUteis}
        />

        {/* Grid de cards de resumo */}
        <div className="summary-grid">
          {/* Card: Horas Extras */}
          <SummaryCard
            title="Horas Extras"
            value={DateUtils.formatarMinutos(resumo.totalExtras)}
            type="positive"
            icon="trend-up"
          />

          {/* Card: Horas em Débito */}
          <SummaryCard
            title="Horas em Débito"
            value={DateUtils.formatarMinutos(resumo.totalDebito)}
            type="negative"
            icon="trend-down"
          />

          {/* Card: Saldo Final */}
          <SummaryCard
            title="Saldo Final"
            value={DateUtils.formatarMinutos(resumo.saldoFinal)}
            type={
              resumo.saldoFinal > 0
                ? "positive"
                : resumo.saldoFinal < 0
                ? "negative"
                : "neutral"
            }
            icon="activity"
          />

          {/* Card: Dias Trabalhados */}
          <SummaryCard
            title="Dias Trabalhados"
            value={`${resumo.diasTrabalhados}/${resumo.diasUteis}`}
            type="neutral"
            icon="calendar"
          />

          {/* Card: Total Trabalhado */}
          <SummaryCard
            title="Total Trabalhado"
            value={DateUtils.formatarMinutos(resumo.horasTrabalhadasTotal)}
            type="neutral"
            icon="chart"
            subtitle={`${resumo.percentualCumprido}% da meta mensal`}
          />

          {/* Card: Horas Esperadas com info da escala */}
          <SummaryCard
            title="Horas Esperadas"
            value={DateUtils.formatarMinutos(resumo.horasEsperadas)}
            type="neutral"
            icon="chart"
            subtitle={`Meta: ${
              resumo.escalaInfo?.horasPorDia / 60 || 7
            }h/dia (${resumo.escalaInfo?.nome || "Padrão"})`}
          />
        </div>

        {/* Dashboard com gráficos interativos */}
        <Dashboard
          dados={registrosMes}
          resumo={resumo}
          mes={mesAtual}
          ano={anoAtual}
          escalaAtual={escalaAtual}
        />

        {/* Tabela de registros detalhados */}
        <RegistrosTable
          registrosMes={registrosMes}
          onAtualizarRegistro={atualizarRegistro}
          onRemoverRegistro={removerRegistro}
          onHandleTimeChange={handleTimeChange}
          escalaAtual={escalaAtual}
        />
      </div>
    </div>
  );
};

export default App;
