import { Plus } from "lucide-react";
import { MESES } from "../utils/dateUtils";
import { DateUtils } from "../utils/dateUtils";

const Controls = ({
  mesAtual,
  setMesAtual,
  anoAtual,
  setAnoAtual,
  onAdicionarRegistro,
  diasTrabalhados, // Prop para receber os dias já trabalhados
}) => {
  const anos = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - 2 + i
  );

  // Calcular dias úteis do mês atual
  const diasUteis = DateUtils.obterDiasUteis(mesAtual, anoAtual);

  // Verificar se pode adicionar mais dias
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
              : `Limite Atingido (${diasTrabalhados}/${diasUteis})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
