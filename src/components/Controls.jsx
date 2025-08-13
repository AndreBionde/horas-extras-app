import React from "react";
import {
  Download,
  Upload,
  Trash2,
  Plus,
  FileText,
  Settings,
} from "lucide-react";
import {
  MESES,
  TOOLTIPS,
  MENSAGENS,
  ESCALAS_TRABALHO,
} from "../constants/constants";

/**
 * Componente Controls - Painel principal de controles da aplicação
 *
 * Funcionalidades principais:
 * - Seleção de período (mês/ano) e escala de trabalho
 * - Adição de novos registros com validação de limite
 * - Exportação/importação de dados CSV
 * - Geração de relatórios PDF
 * - Limpeza de dados com confirmação dupla
 *
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {number} props.mesAtual - Mês selecionado (0-11)
 * @param {Function} props.setMesAtual - Função para alterar o mês
 * @param {number} props.anoAtual - Ano selecionado
 * @param {Function} props.setAnoAtual - Função para alterar o ano
 * @param {string} props.escalaAtual - ID da escala de trabalho selecionada
 * @param {Function} props.setEscalaAtual - Função para alterar a escala
 * @param {Function} props.onAdicionarRegistro - Callback para adicionar registro
 * @param {number} props.diasTrabalhados - Dias já registrados no período
 * @param {Function} props.onExportarDados - Callback para exportar CSV
 * @param {Function} props.onImportarDados - Callback para importar CSV
 * @param {Function} props.onLimparDados - Callback para limpar dados
 * @param {Function} props.onGerarPDF - Callback para gerar PDF
 * @param {number} props.diasUteis - Total de dias úteis no período
 */
export const Controls = ({
  mesAtual,
  setMesAtual,
  anoAtual,
  setAnoAtual,
  escalaAtual,
  setEscalaAtual,
  onAdicionarRegistro,
  diasTrabalhados,
  onExportarDados,
  onImportarDados,
  onLimparDados,
  onGerarPDF,
  diasUteis,
}) => {
  /**
   * Array de anos disponíveis (2 anos passados até 7 anos futuros)
   * Memorizado para evitar recálculos desnecessários
   */
  const anos = React.useMemo(() => {
    const anoAtualSistema = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => anoAtualSistema - 2 + i);
  }, []);

  /**
   * Verifica se ainda é possível adicionar dias ao período atual
   */
  const podeAdicionarDia = React.useMemo(() => {
    return diasTrabalhados < diasUteis;
  }, [diasTrabalhados, diasUteis]);

  /**
   * Informações da escala de trabalho atual
   * Com fallback para primeira escala disponível
   */
  const escalaInfo = React.useMemo(() => {
    return (
      ESCALAS_TRABALHO.find((e) => e.id === escalaAtual) || ESCALAS_TRABALHO[0]
    );
  }, [escalaAtual]);

  /**
   * Manipula mudança no seletor de mês
   */
  const handleMesChange = React.useCallback(
    (e) => {
      setMesAtual(parseInt(e.target.value, 10));
    },
    [setMesAtual]
  );

  /**
   * Manipula mudança no seletor de ano
   */
  const handleAnoChange = React.useCallback(
    (e) => {
      setAnoAtual(parseInt(e.target.value, 10));
    },
    [setAnoAtual]
  );

  /**
   * Manipula mudança na escala de trabalho com confirmação
   */
  const handleEscalaChange = React.useCallback(
    (e) => {
      const novaEscala = e.target.value;
      if (window.confirm(MENSAGENS.CONFIRMACAO.ALTERAR_ESCALA)) {
        setEscalaAtual(novaEscala);
      }
    },
    [setEscalaAtual]
  );

  /**
   * Adiciona novo registro com validação de limite
   */
  const handleAdicionarClick = React.useCallback(() => {
    if (!podeAdicionarDia) {
      alert(MENSAGENS.ALERTA.LIMITE_DIAS.replace("{dias}", diasUteis));
      return;
    }
    onAdicionarRegistro();
  }, [podeAdicionarDia, onAdicionarRegistro, diasUteis]);

  /**
   * Aciona o input de arquivo para importação
   */
  const handleImportarClick = React.useCallback(() => {
    const importInput = document.getElementById("import-input");
    if (importInput) {
      importInput.click();
    } else {
      console.error("Elemento import-input não encontrado");
    }
  }, []);

  /**
   * Remove todos os dados com confirmação dupla
   */
  const handleLimparClick = React.useCallback(() => {
    onLimparDados();
  }, [onLimparDados]);

  // Estados dinâmicos do botão adicionar
  const textoAdicionar = podeAdicionarDia
    ? "Adicionar Dia"
    : `Limite (${diasTrabalhados}/${diasUteis})`;

  const tooltipAdicionar = !podeAdicionarDia
    ? TOOLTIPS.LIMITE_DIAS?.replace("{current}", diasTrabalhados)?.replace(
        "{max}",
        diasUteis
      ) || "Limite atingido"
    : TOOLTIPS.ADICIONAR_DIA || "Adicionar novo registro";

  return (
    <div className="controls-card">
      <div className="controls-content">
        <div className="controls-wrapper">
          {/* Configurações de Escala */}
          <div className="controls-config">
            <label className="controls-label">
              <Settings size={20} aria-hidden="true" />
              Configurações
            </label>

            <div className="controls-scale-selector">
              <select
                value={escalaAtual}
                onChange={handleEscalaChange}
                className="select select-scale"
                title={
                  TOOLTIPS.ESCALA_TRABALHO || "Selecione a escala de trabalho"
                }
                aria-label="Escala de trabalho"
              >
                {ESCALAS_TRABALHO.map((escala) => (
                  <option key={escala.id} value={escala.id}>
                    {escala.nome}
                  </option>
                ))}
              </select>

              {/* Informações da escala atual */}
              {escalaInfo && (
                <div className="scale-info" role="status" aria-live="polite">
                  <span className="scale-description">
                    {escalaInfo.descricao}
                  </span>
                  <span className="scale-hours">
                    {escalaInfo.horasSemana}h/semana
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Seleção de Período */}
          <div className="controls-period">
            <label className="controls-label">Período de Análise</label>

            <div className="controls-selects">
              <select
                value={mesAtual}
                onChange={handleMesChange}
                className="select"
                title="Selecione o mês para análise"
                aria-label="Mês para análise"
              >
                {MESES.map((mes, index) => (
                  <option key={index} value={index}>
                    {mes}
                  </option>
                ))}
              </select>

              <select
                value={anoAtual}
                onChange={handleAnoChange}
                className="select"
                title="Selecione o ano para análise"
                aria-label="Ano para análise"
              >
                {anos.map((ano) => (
                  <option key={ano} value={ano}>
                    {ano}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="controls-actions">
            <button
              onClick={handleAdicionarClick}
              disabled={!podeAdicionarDia}
              className="btn-premium"
              title={tooltipAdicionar}
              aria-label={`${textoAdicionar}. ${
                podeAdicionarDia ? "" : "Limite atingido"
              }`}
            >
              <Plus size={16} aria-hidden="true" />
              {textoAdicionar}
            </button>

            <button
              onClick={onGerarPDF}
              className="btn-action btn-danger"
              title={TOOLTIPS.GERAR_PDF || "Gerar relatório em PDF"}
              aria-label="Gerar relatório em PDF"
            >
              <FileText size={16} aria-hidden="true" />
              Gerar PDF
            </button>

            <button
              onClick={onExportarDados}
              className="btn-action btn-success"
              title={TOOLTIPS.EXPORTAR_CSV || "Exportar dados em CSV"}
              aria-label="Exportar dados em CSV"
            >
              <Download size={16} aria-hidden="true" />
              Exportar CSV
            </button>

            <button
              onClick={handleImportarClick}
              className="btn-action btn-info"
              title={TOOLTIPS.IMPORTAR_CSV || "Importar dados de CSV"}
              aria-label="Importar dados de arquivo CSV"
            >
              <Upload size={16} aria-hidden="true" />
              Importar CSV
            </button>

            {/* Input file oculto para importação */}
            <input
              id="import-input"
              type="file"
              accept=".csv"
              onChange={onImportarDados}
              style={{ display: "none" }}
              aria-label="Arquivo CSV para importação"
            />

            <button
              onClick={handleLimparClick}
              className="btn-action btn-danger"
              title={TOOLTIPS.LIMPAR_DADOS || "Limpar todos os dados"}
              aria-label="Limpar todos os dados registrados"
            >
              <Trash2 size={16} aria-hidden="true" />
              Limpar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
