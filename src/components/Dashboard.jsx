import { useState } from "react";
import {
  Activity,
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CORES } from "../constants/constants";
import { DateUtils } from "../utils/dateUtils";

/**
 * Utilitários para formatação de números
 */
const NumberUtils = {
  formatarDecimal: (numero, casas = 2) => {
    if (numero === null || numero === undefined || isNaN(numero)) {
      return "0.00";
    }
    return Number(numero).toFixed(casas);
  },

  formatarMediaDiaria: (totalMinutos, diasTrabalhados) => {
    if (!diasTrabalhados || diasTrabalhados === 0 || !totalMinutos) {
      return "0.00h";
    }
    const mediaHoras = totalMinutos / diasTrabalhados / 60;
    return `${NumberUtils.formatarDecimal(mediaHoras)}h`;
  },
};

/**
 * Hook para detectar responsividade da tela
 */
const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState(() => {
    if (typeof window !== "undefined") {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= 768,
        isSmall: window.innerWidth <= 480,
        isExtraSmall: window.innerWidth <= 360,
      };
    }
    return {
      width: 1200,
      height: 800,
      isMobile: false,
      isSmall: false,
      isExtraSmall: false,
    };
  });

  useState(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= 768,
        isSmall: window.innerWidth <= 480,
        isExtraSmall: window.innerWidth <= 360,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
};

/**
 * Componente Dashboard - Painel de gráficos interativos com design responsivo
 *
 * Funcionalidades:
 * - Múltiplos tipos de gráfico (linha, área, barra, pizza)
 * - Responsividade completa para dispositivos móveis
 * - Sistema de insights automáticos baseado nos dados
 * - Controles dinâmicos para alternar visualizações
 *
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.dados - Array com registros de trabalho
 * @param {Object} props.resumo - Objeto com métricas calculadas
 * @param {number} props.mes - Mês atual para filtro
 * @param {number} props.ano - Ano atual para filtro
 * @param {string} props.escalaAtual - Escala de trabalho ativa
 */
export const Dashboard = ({ dados, resumo, mes, ano, escalaAtual }) => {
  const [graficoAtivo, setGraficoAtivo] = useState("linha");
  const { isMobile, isSmall, isExtraSmall } = useScreenSize();

  // Preparação dos dados para gráficos
  const dadosGraficos = DateUtils.gerarDadosGraficos(
    dados,
    mes,
    ano,
    escalaAtual
  );

  /**
   * Dados para o gráfico de pizza (distribuição de horas)
   */
  const dadosPizza = [
    {
      name: "Horas Extras",
      value: Math.max(0, (resumo?.totalExtras || 0) / 60),
      fill: CORES.success,
    },
    {
      name: "Horas em Débito",
      value: Math.max(0, Math.abs(resumo?.totalDebito || 0) / 60),
      fill: CORES.danger,
    },
    {
      name: "Horas Normais",
      value: Math.max(
        0,
        ((resumo?.horasTrabalhadasTotal || 0) -
          Math.max(0, resumo?.totalExtras || 0)) /
          60
      ),
      fill: CORES.neutral,
    },
  ].filter((item) => item.value > 0);

  // Configurações responsivas
  const alturaGrafico = isExtraSmall
    ? 220
    : isSmall
    ? 250
    : isMobile
    ? 280
    : 350;

  const configPizza = {
    outerRadius: isExtraSmall ? 45 : isSmall ? 55 : isMobile ? 65 : 80,
    innerRadius: isExtraSmall ? 15 : isSmall ? 20 : isMobile ? 25 : 30,
    cx: "50%",
    cy: "50%",
  };

  const tooltipConfig = {
    contentStyle: {
      backgroundColor: "rgba(0,0,0,0.9)",
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: "8px",
      color: "white",
      fontSize: isSmall ? "12px" : "14px",
      padding: isSmall ? "8px" : "12px",
    },
    formatter: (value, name) => [
      typeof value === "number" ? `${value.toFixed(2)}h` : value,
      name,
    ],
    labelFormatter: (label) => {
      if (typeof label === "string" && label.includes("/")) {
        const [dia, mes] = label.split("/");
        return `${dia}/${mes}`;
      }
      return label;
    },
  };

  const gridConfig = {
    strokeDasharray: "3 3",
    stroke: "rgba(255,255,255,0.1)",
  };

  const axisConfig = {
    stroke: "rgba(255,255,255,0.7)",
    fontSize: isSmall ? 10 : 12,
  };

  const xAxisConfig = {
    ...axisConfig,
    tick: {
      fontSize: isExtraSmall ? 8 : isSmall ? 9 : 10,
      fill: "rgba(255,255,255,0.7)",
    },
    tickFormatter: (value) => {
      if (typeof value === "string" && value.includes("/")) {
        return isSmall ? value.split("/")[0] : value;
      }
      return value;
    },
    interval: isExtraSmall ? 2 : isSmall ? 1 : "preserveStartEnd",
    minTickGap: isSmall ? 15 : 20,
    angle: isSmall ? -45 : 0,
    textAnchor: isSmall ? "end" : "middle",
    height: isSmall ? 60 : 40,
  };

  const yAxisConfig = {
    ...axisConfig,
    tick: {
      fontSize: isExtraSmall ? 8 : isSmall ? 9 : 10,
      fill: "rgba(255,255,255,0.7)",
    },
    width: isSmall ? 30 : 40,
  };

  /**
   * Renderiza o gráfico baseado no tipo selecionado
   */
  const renderGrafico = () => {
    const margemBase = {
      top: 20,
      right: isSmall ? 10 : 20,
      left: isSmall ? 5 : 10,
      bottom: isSmall ? 50 : 20,
    };

    switch (graficoAtivo) {
      case "linha":
        return (
          <LineChart data={dadosGraficos} margin={margemBase}>
            <CartesianGrid {...gridConfig} />
            <XAxis dataKey="data" {...xAxisConfig} />
            <YAxis {...yAxisConfig} />
            <Tooltip {...tooltipConfig} />
            {!isSmall && <Legend />}

            <Line
              type="monotone"
              dataKey="horasTrabalhadas"
              stroke={CORES.primary}
              strokeWidth={isSmall ? 2 : 3}
              name="Horas Trabalhadas"
              dot={{
                fill: CORES.primary,
                strokeWidth: 1,
                r: isSmall ? 2 : 3,
              }}
              connectNulls={false}
            />

            <Line
              type="monotone"
              dataKey="meta"
              stroke={CORES.warning}
              strokeDasharray="5 5"
              strokeWidth={isSmall ? 1 : 2}
              name="Meta (Jornada)"
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="horasExtras"
              stroke={CORES.success}
              strokeWidth={isSmall ? 1.5 : 2}
              name="Horas Extras"
              dot={{
                fill: CORES.success,
                strokeWidth: 1,
                r: isSmall ? 2 : 3,
              }}
            />
          </LineChart>
        );

      case "area":
        return (
          <AreaChart data={dadosGraficos} margin={margemBase}>
            <CartesianGrid {...gridConfig} />
            <XAxis dataKey="data" {...xAxisConfig} />
            <YAxis {...yAxisConfig} />
            <Tooltip {...tooltipConfig} />
            {!isSmall && <Legend />}

            <Area
              type="monotone"
              dataKey="horasTrabalhadas"
              stackId="1"
              stroke={CORES.primary}
              fill={CORES.primary + "40"}
              strokeWidth={isSmall ? 1 : 2}
              name="Horas Trabalhadas"
            />

            <Area
              type="monotone"
              dataKey="horasExtras"
              stackId="2"
              stroke={CORES.success}
              fill={CORES.success + "40"}
              strokeWidth={isSmall ? 1 : 2}
              name="Horas Extras"
            />
          </AreaChart>
        );

      case "barra":
        return (
          <BarChart data={dadosGraficos} margin={margemBase}>
            <CartesianGrid {...gridConfig} />
            <XAxis dataKey="data" {...xAxisConfig} />
            <YAxis {...yAxisConfig} />
            <Tooltip {...tooltipConfig} />
            {!isSmall && <Legend />}

            <Bar
              dataKey="horasTrabalhadas"
              fill={CORES.primary}
              name="Horas Trabalhadas"
              radius={[2, 2, 0, 0]}
            />

            <Bar
              dataKey="horasExtras"
              fill={CORES.success}
              name="Horas Extras"
              radius={[2, 2, 0, 0]}
            />

            <Bar
              dataKey="horasDebito"
              fill={CORES.danger}
              name="Horas em Débito"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        );

      case "pizza":
        if (dadosPizza.length === 0) {
          return (
            <div className="empty-state">
              <PieIcon size={48} className="empty-state-icon" />
              <h3>Sem dados para pizza</h3>
              <p>Não há dados suficientes para o gráfico de pizza</p>
            </div>
          );
        }

        return (
          <PieChart
            margin={{
              top: isSmall ? 10 : 20,
              right: isSmall ? 10 : 20,
              left: isSmall ? 10 : 20,
              bottom: isSmall ? 10 : 20,
            }}
          >
            <Pie
              data={dadosPizza}
              {...configPizza}
              labelLine={false}
              label={({ name, percent }) => {
                if (isSmall) {
                  return `${(percent * 100).toFixed(0)}%`;
                }
                return `${name}: ${(percent * 100).toFixed(0)}%`;
              }}
              fill="#8884d8"
              dataKey="value"
              strokeWidth={2}
              stroke="rgba(255,255,255,0.2)"
            >
              {dadosPizza.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                ...tooltipConfig.contentStyle,
                fontSize: isSmall ? "11px" : "13px",
              }}
              formatter={(value) => [`${value.toFixed(1)}h`, ""]}
            />

            {!isSmall && (
              <Legend
                verticalAlign="bottom"
                height={36}
                iconSize={12}
                wrapperStyle={{
                  fontSize: "12px",
                  paddingTop: "10px",
                }}
              />
            )}
          </PieChart>
        );

      default:
        return (
          <div className="empty-state">
            <Activity size={48} className="empty-state-icon" />
            <h3>Tipo de gráfico não encontrado</h3>
            <p>Selecione um tipo de gráfico válido</p>
          </div>
        );
    }
  };

  /**
   * Gera insights automáticos baseados nos dados
   */
  const gerarInsights = () => {
    const insights = [];

    if (resumo?.percentualCumprido >= 100) {
      insights.push(
        <div key="meta-atingida" style={{ color: CORES.success }}>
          ✅ {isSmall ? "Meta atingida!" : "Parabéns! Você atingiu"}{" "}
          {!isSmall &&
            `${NumberUtils.formatarDecimal(
              resumo.percentualCumprido,
              1
            )}% da meta mensal`}
        </div>
      );
    }

    if (resumo?.percentualCumprido < 90) {
      insights.push(
        <div key="meta-baixa" style={{ color: CORES.warning }}>
          ⚠️ {isSmall ? "Abaixo da meta:" : "Atenção: Você está com"}{" "}
          {NumberUtils.formatarDecimal(resumo.percentualCumprido, 1)}%{" "}
          {!isSmall && "da meta mensal"}
        </div>
      );
    }

    if (resumo?.saldoFinal > 0) {
      insights.push(
        <div key="saldo-positivo" style={{ color: CORES.success }}>
          📈 {isSmall ? "Crédito:" : "Saldo positivo:"}{" "}
          {DateUtils.formatarMinutos
            ? DateUtils.formatarMinutos(resumo.saldoFinal)
            : `${NumberUtils.formatarDecimal(resumo.saldoFinal / 60)}h`}
          {!isSmall && " de crédito"}
        </div>
      );
    }

    if (resumo?.saldoFinal < 0) {
      insights.push(
        <div key="saldo-negativo" style={{ color: CORES.danger }}>
          📉 {isSmall ? "Débito:" : "Saldo negativo:"}{" "}
          {DateUtils.formatarMinutos
            ? DateUtils.formatarMinutos(Math.abs(resumo.saldoFinal))
            : `${NumberUtils.formatarDecimal(
                Math.abs(resumo.saldoFinal) / 60
              )}h`}
          {!isSmall && " de débito"}
        </div>
      );
    }

    insights.push(
      <div key="media-diaria">
        📅 {isSmall ? "Média:" : "Média diária:"}{" "}
        {NumberUtils.formatarMediaDiaria(
          resumo?.horasTrabalhadasTotal || 0,
          resumo?.diasTrabalhados || 0
        )}
      </div>
    );

    return insights;
  };

  const tiposGrafico = [
    {
      id: "linha",
      label: isSmall ? "Linha" : "Linha",
      icon: <Activity size={isSmall ? 14 : 16} />,
    },
    {
      id: "area",
      label: isSmall ? "Área" : "Área",
      icon: <TrendingUp size={isSmall ? 14 : 16} />,
    },
    {
      id: "barra",
      label: isSmall ? "Barra" : "Barras",
      icon: <BarChart3 size={isSmall ? 14 : 16} />,
    },
    {
      id: "pizza",
      label: isSmall ? "Pizza" : "Pizza",
      icon: <PieIcon size={isSmall ? 14 : 16} />,
    },
  ];

  return (
    <div className="dashboard-card">
      {/* Cabeçalho com controles */}
      <div className="dashboard-header">
        <h2 style={{ fontSize: isSmall ? "1.25rem" : "1.75rem" }}>
          📊 {isSmall ? "Dashboard" : "Dashboard Interativo"}
        </h2>

        {/* Controles de tipo de gráfico */}
        <div
          className="dashboard-controls"
          style={{
            flexDirection: isSmall ? "column" : "row",
            gap: isSmall ? "0.5rem" : "1rem",
            marginBottom: isSmall ? "1.5rem" : "2rem",
          }}
        >
          {/* Layout responsivo para controles */}
          {isExtraSmall ? (
            <div
              style={{
                display: "flex",
                overflowX: "auto",
                gap: "0.5rem",
                paddingBottom: "0.5rem",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {tiposGrafico.map((grafico) => (
                <button
                  key={grafico.id}
                  onClick={() => setGraficoAtivo(grafico.id)}
                  className={`chart-type-button ${
                    graficoAtivo === grafico.id ? "active" : ""
                  }`}
                  style={{
                    flexShrink: 0,
                    minWidth: "80px",
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.7rem",
                    gap: "0.25rem",
                  }}
                  title={`Visualizar gráfico de ${grafico.label.toLowerCase()}`}
                >
                  {grafico.icon}
                  {grafico.label}
                </button>
              ))}
            </div>
          ) : (
            tiposGrafico.map((grafico) => (
              <button
                key={grafico.id}
                onClick={() => setGraficoAtivo(grafico.id)}
                className={`chart-type-button ${
                  graficoAtivo === grafico.id ? "active" : ""
                }`}
                style={{
                  flex: isSmall ? "1" : "none",
                  padding: isSmall ? "0.75rem 1rem" : "1rem 1.75rem",
                  fontSize: isSmall ? "0.8rem" : "0.95rem",
                  minHeight: isSmall ? "40px" : "52px",
                }}
                title={`Visualizar gráfico de ${grafico.label.toLowerCase()}`}
              >
                {grafico.icon}
                {grafico.label}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Área do gráfico */}
      <div
        className="chart-area"
        style={{
          height: `${alturaGrafico}px`,
          marginBottom: isSmall ? "1rem" : "2rem",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          {renderGrafico()}
        </ResponsiveContainer>
      </div>

      {/* Legenda para gráfico de pizza em telas pequenas */}
      {graficoAtivo === "pizza" && isSmall && dadosPizza.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            justifyContent: "center",
            marginBottom: "1rem",
            padding: "0.75rem",
            background: "rgba(15, 23, 42, 0.6)",
            borderRadius: "0.75rem",
            border: "1px solid rgba(148, 163, 184, 0.2)",
          }}
        >
          {dadosPizza.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                fontSize: "0.75rem",
                color: "#e2e8f0",
                fontWeight: "600",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: item.fill,
                  flexShrink: 0,
                }}
              />
              {item.name}
            </div>
          ))}
        </div>
      )}

      {/* Seção de insights */}
      <div
        className="insights-section"
        style={{
          padding: isSmall ? "1rem" : "2rem",
          marginTop: isSmall ? "1rem" : "2.5rem",
        }}
      >
        <h3
          className="insights-title"
          style={{
            fontSize: isSmall ? "1rem" : "1.25rem",
            marginBottom: isSmall ? "1rem" : "1.5rem",
          }}
        >
          🔍 {isSmall ? "Insights" : "Insights Automáticos"}
        </h3>
        <div
          className="insights-list"
          style={{
            fontSize: isSmall ? "0.8rem" : "1rem",
            gap: isSmall ? "0.5rem" : "0.75rem",
            lineHeight: isSmall ? "1.4" : "1.6",
          }}
        >
          {gerarInsights()}
        </div>
      </div>
    </div>
  );
};
