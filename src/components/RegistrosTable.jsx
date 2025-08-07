import { Calendar, Trash2 } from "lucide-react";
import { DateUtils } from "../utils/dateUtils";
import { JORNADA_PADRAO } from "../utils/dateUtils";

const RegistrosTable = ({
  registrosMes,
  onAtualizarRegistro,
  onRemoverRegistro,
  onHandleTimeChange,
}) => {
  return (
    <div className="table-card fade-in">
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Entrada</th>
              <th>Saída</th>
              <th>Horas Trabalhadas</th>
              <th>Resultado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {registrosMes.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="empty-state">
                    <Calendar size={48} />
                    <h3>Nenhum registro encontrado</h3>
                    <p>Clique em "Adicionar Dia" para começar</p>
                  </div>
                </td>
              </tr>
            ) : (
              registrosMes.map((registro) => {
                const horasTrabalhadas = DateUtils.calcularHorasTrabalhadas(
                  registro.entrada,
                  registro.saida
                );

                // CORREÇÃO: Só calcular diferença se houver horas trabalhadas
                let diferenca = 0;
                let mostrarResultado = false;

                if (horasTrabalhadas > 0) {
                  diferenca = horasTrabalhadas - JORNADA_PADRAO;
                  mostrarResultado = true;
                }

                return (
                  <tr key={registro.id}>
                    <td>
                      <input
                        type="date"
                        value={registro.data}
                        onChange={(e) =>
                          onAtualizarRegistro(
                            registro.id,
                            "data",
                            e.target.value
                          )
                        }
                        className="input"
                      />
                    </td>

                    <td>
                      <input
                        type="time"
                        value={
                          registro.entrada
                            ? DateUtils.formatarHora(
                                registro.entrada
                              ).substring(0, 5)
                            : ""
                        }
                        onChange={(e) =>
                          onHandleTimeChange(
                            registro.id,
                            "entrada",
                            e.target.value
                          )
                        }
                        className="input"
                      />
                    </td>

                    <td>
                      <input
                        type="time"
                        value={
                          registro.saida
                            ? DateUtils.formatarHora(registro.saida).substring(
                                0,
                                5
                              )
                            : ""
                        }
                        onChange={(e) =>
                          onHandleTimeChange(
                            registro.id,
                            "saida",
                            e.target.value
                          )
                        }
                        className="input"
                      />
                    </td>

                    <td>
                      <span className="badge blue">
                        {horasTrabalhadas > 0
                          ? DateUtils.formatarMinutos(horasTrabalhadas)
                          : "0:00h"}
                      </span>
                    </td>

                    <td>
                      {mostrarResultado ? (
                        <span
                          className={`badge ${
                            diferenca > 0
                              ? "green"
                              : diferenca < 0
                              ? "red"
                              : "gray"
                          }`}
                        >
                          {DateUtils.formatarMinutos(diferenca)}
                        </span>
                      ) : (
                        <span className="badge gray">0:00h</span>
                      )}
                    </td>

                    <td>
                      <button
                        onClick={() => onRemoverRegistro(registro.id)}
                        className="btn btn-danger"
                        title="Excluir registro"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistrosTable;
