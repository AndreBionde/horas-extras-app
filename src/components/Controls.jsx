import React from "react";
import { Plus, Download, Upload, Trash2 } from "lucide-react";
import { MESES } from "../utils/dateUtils";
import { DateUtils } from "../utils/dateUtils";

const Controls = ({
  mesAtual,
  setMesAtual,
  anoAtual,
  setAnoAtual,
  onAdicionarRegistro,
  diasTrabalhados,
  onExportarDados,
  onImportarDados,
  onLimparDados,
}) => {
  const anos = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - 2 + i
  );

  const diasUteis = DateUtils.obterDiasUteis(mesAtual, anoAtual);
  const podeAdicionarDia = diasTrabalhados < diasUteis;

  const handleAdicionarRegistro = () => {
    if (podeAdicionarDia) {
      onAdicionarRegistro();
    }
  };

  return (
    <div className="controls-card fade-in">
      <div className="controls-content">
        <div className="controls-wrapper">
          <div className="controls-period">
            <label className="controls-label">Período de Análise</label>
            <div className="controls-selects">
              <div className="select-wrapper">
                <select
                  value={mesAtual}
                  onChange={(e) => setMesAtual(parseInt(e.target.value))}
                  className="select"
                >
                  {MESES.map((mes, index) => (
                    <option key={index} value={index}>
                      {mes}
                    </option>
                  ))}
                </select>
              </div>

              <div className="select-wrapper">
                <select
                  value={anoAtual}
                  onChange={(e) => setAnoAtual(parseInt(e.target.value))}
                  className="select"
                >
                  {anos.map((ano) => (
                    <option key={ano} value={ano}>
                      {ano}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="controls-actions">
            <button
              onClick={handleAdicionarRegistro}
              className="add-button"
              disabled={!podeAdicionarDia}
              title={
                !podeAdicionarDia
                  ? `Limite de ${diasUteis} dias úteis atingido`
                  : "Adicionar novo dia"
              }
            >
              <Plus size={20} />
              {podeAdicionarDia
                ? "Adicionar Dia"
                : `Limite (${diasTrabalhados}/${diasUteis})`}
            </button>

            <button
              onClick={onExportarDados}
              className="btn btn-success"
              title="Exportar dados em CSV"
            >
              <Download size={16} />
              Exportar CSV
            </button>

            <button
              onClick={() => document.getElementById("import-input").click()}
              className="btn btn-info"
              title="Importar dados de CSV"
            >
              <Upload size={16} />
              Importar CSV
            </button>

            <input
              id="import-input"
              type="file"
              accept=".csv"
              onChange={onImportarDados}
              style={{ display: "none" }}
            />

            <button
              onClick={onLimparDados}
              className="btn btn-danger"
              title="Limpar todos os dados"
            >
              <Trash2 size={16} />
              Limpar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
