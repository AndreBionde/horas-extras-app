import { useState, useEffect } from "react";
import { Calendar, Trash2, AlertTriangle } from "lucide-react";
import { JORNADA_PADRAO } from "../constants/constants";
import { DateUtils } from "../utils/dateUtils";

/**
 * Componente RegistrosTable - Tabela interativa de registros de trabalho
 *
 * Funcionalidades principais:
 * - Exibição em formato tabela responsivo
 * - Validação em tempo real de horários
 * - Edição inline de dados (data, entrada, saída)
 * - Cálculo automático de horas trabalhadas e diferenças
 * - Indicadores visuais para resultados (extras/débito)
 * - Alertas para horários inválidos
 *
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.registrosMes - Array com registros do período atual
 * @param {Function} props.onAtualizarRegistro - Callback para atualizar registro
 * @param {Function} props.onRemoverRegistro - Callback para remover registro
 * @param {Function} props.onHandleTimeChange - Callback específico para mudanças de horário
 */
export const RegistrosTable = ({
  registrosMes,
  onAtualizarRegistro,
  onRemoverRegistro,
  onHandleTimeChange,
}) => {
  const [alertas, setAlertas] = useState({});

  /**
   * Valida horários em tempo real sempre que registros mudam
   * Armazena mensagens de erro por ID do registro
   */
  useEffect(() => {
    const novosAlertas = {};
    registrosMes.forEach((registro) => {
      if (registro.entrada && registro.saida) {
        const validacao = DateUtils.validarHorarios(
          registro.entrada,
          registro.saida
        );
        if (!validacao.valido) {
          novosAlertas[registro.id] = validacao.mensagem;
        }
      }
    });
    setAlertas(novosAlertas);
  }, [registrosMes]);

  // Estilos do componente
  const tableStyle = {
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.08) 100%)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "1.5rem",
    overflow: "hidden",
    marginBottom: "2rem",
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "0.5rem",
    padding: "0.75rem",
    color: "white",
    fontSize: "0.9rem",
    width: "100%",
    minWidth: "120px",
  };

  /**
   * Estilos para badges de status baseados no tipo
   */
  const badgeStyle = (type) => ({
    padding: "0.5rem 1rem",
    borderRadius: "2rem",
    fontSize: "0.8rem",
    fontWeight: "600",
    display: "inline-block",
    ...getBadgeColors(type),
  });

  /**
   * Define cores dos badges baseado no tipo de resultado
   */
  const getBadgeColors = (type) => {
    switch (type) {
      case "green":
        return { background: "rgba(16,185,129,0.3)", color: "#34d399" };
      case "red":
        return { background: "rgba(239,68,68,0.3)", color: "#f87171" };
      case "blue":
        return { background: "rgba(59,130,246,0.3)", color: "#93c5fd" };
      default:
        return {
          background: "rgba(107,114,128,0.3)",
          color: "rgba(255,255,255,0.8)",
        };
    }
  };

  // Estado vazio - nenhum registro encontrado
  if (registrosMes.length === 0) {
    return (
      <div style={tableStyle}>
        <div
          style={{
            padding: "4rem 2rem",
            textAlign: "center",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <Calendar size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "0.75rem",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            Nenhum registro encontrado
          </h3>
          <p style={{ fontSize: "1rem", opacity: 0.7 }}>
            Clique em "Adicionar Dia" para começar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={tableStyle}>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "768px",
          }}
        >
          {/* Cabeçalho da tabela */}
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.1)" }}>
              {[
                "Data",
                "Entrada",
                "Saída",
                "Horas Trabalhadas",
                "Resultado",
                "Ações",
              ].map((header) => (
                <th
                  key={header}
                  style={{
                    padding: "1.5rem",
                    textAlign: "left",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    color: "rgba(255,255,255,0.9)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Corpo da tabela */}
          <tbody>
            {registrosMes.map((registro) => {
              // Cálculos para cada linha
              const horasTrabalhadas = DateUtils.calcularHorasTrabalhadas(
                registro.entrada,
                registro.saida
              );
              let diferenca = 0;
              let mostrarResultado = false;

              if (horasTrabalhadas > 0) {
                diferenca = horasTrabalhadas - JORNADA_PADRAO;
                mostrarResultado = true;
              }

              const hasAlert = alertas[registro.id];

              return (
                <tr
                  key={registro.id}
                  style={{
                    background: hasAlert
                      ? "rgba(239,68,68,0.1)"
                      : "transparent",
                    transition: "background 0.3s ease",
                  }}
                >
                  {/* Coluna Data */}
                  <td
                    style={{
                      padding: "1.5rem",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
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
                        style={inputStyle}
                      />
                      {hasAlert && (
                        <AlertTriangle size={16} style={{ color: "#f87171" }} />
                      )}
                    </div>
                    {/* Mensagem de alerta */}
                    {hasAlert && (
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "#f87171",
                          marginTop: "0.25rem",
                        }}
                      >
                        {hasAlert}
                      </div>
                    )}
                  </td>

                  {/* Coluna Entrada */}
                  <td
                    style={{
                      padding: "1.5rem",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <input
                      type="time"
                      value={
                        registro.entrada
                          ? DateUtils.formatarHora(registro.entrada).substring(
                              0,
                              5
                            )
                          : ""
                      }
                      onChange={(e) =>
                        onHandleTimeChange(
                          registro.id,
                          "entrada",
                          e.target.value
                        )
                      }
                      style={inputStyle}
                    />
                  </td>

                  {/* Coluna Saída */}
                  <td
                    style={{
                      padding: "1.5rem",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
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
                        onHandleTimeChange(registro.id, "saida", e.target.value)
                      }
                      style={inputStyle}
                    />
                  </td>

                  {/* Coluna Horas Trabalhadas */}
                  <td
                    style={{
                      padding: "1.5rem",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <span style={badgeStyle("blue")}>
                      {horasTrabalhadas > 0
                        ? DateUtils.formatarMinutos(horasTrabalhadas)
                        : "0:00h"}
                    </span>
                  </td>

                  {/* Coluna Resultado (Extras/Débito) */}
                  <td
                    style={{
                      padding: "1.5rem",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    {mostrarResultado ? (
                      <span
                        style={badgeStyle(
                          diferenca > 0
                            ? "green"
                            : diferenca < 0
                            ? "red"
                            : "gray"
                        )}
                      >
                        {DateUtils.formatarMinutos(diferenca)}
                      </span>
                    ) : (
                      <span style={badgeStyle("gray")}>0:00h</span>
                    )}
                  </td>

                  {/* Coluna Ações */}
                  <td
                    style={{
                      padding: "1.5rem",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <button
                      onClick={() => onRemoverRegistro(registro.id)}
                      style={{
                        background: "rgba(239,68,68,0.3)",
                        color: "#fca5a5",
                        border: "1px solid rgba(239,68,68,0.3)",
                        borderRadius: "0.5rem",
                        padding: "0.75rem",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      title="Excluir registro"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
