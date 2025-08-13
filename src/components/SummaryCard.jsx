import {
  Calendar,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Clock4,
  Clock8,
} from "lucide-react";

/**
 * Componente SummaryCard - Card visual para métricas importantes
 *
 * Exibe informações de forma organizada e visualmente atrativa:
 * - Título descritivo da métrica
 * - Valor principal com formatação apropriada
 * - Ícone temático baseado no contexto
 * - Subtítulo opcional para informações complementares
 * - Sistema de cores dinâmico (positivo/negativo/neutro)
 *
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {string} props.title - Título principal (ex: "Horas Extras")
 * @param {string} props.value - Valor a exibir (ex: "+2:30h", "156:30h")
 * @param {string} props.type - Tipo para cores: "positive", "negative", "neutral"
 * @param {string} [props.icon] - Ícone específico: "calendar", "chart", "trend-up", "trend-down", "activity"
 * @param {string} [props.subtitle] - Informação adicional opcional
 *
 */
export const SummaryCard = ({ title, value, type, icon, subtitle }) => {
  /**
   * Seleciona o ícone apropriado baseado na prop icon ou fallback por type
   */
  const getIcon = () => {
    // Ícones específicos têm prioridade
    if (icon === "calendar") return <Calendar size={30} />;
    if (icon === "chart") return <BarChart3 size={30} />;
    if (icon === "trend-up") return <TrendingUp size={30} />;
    if (icon === "trend-down") return <TrendingDown size={30} />;
    if (icon === "activity") return <Activity size={30} />;

    // Fallback baseado no tipo
    switch (type) {
      case "positive":
        return <Clock4 size={30} />;
      case "negative":
        return <Clock8 size={30} />;
      default:
        return <Clock size={30} />;
    }
  };

  /**
   * Define a cor da borda superior baseada no tipo
   */
  const getBorderColor = () => {
    switch (type) {
      case "positive":
        return "#10b981"; // Verde para resultados positivos
      case "negative":
        return "#ef4444"; // Vermelho para resultados negativos
      default:
        return "#6b7280"; // Cinza para valores neutros
    }
  };

  /**
   * Define a cor do texto do valor principal
   */
  const getValueColor = () => {
    switch (type) {
      case "positive":
        return "#34d399";
      case "negative":
        return "#f87171";
      default:
        return "rgba(255,255,255,0.9)";
    }
  };

  return (
    <div
      className={`summary-card ${type}`}
      style={{
        borderTopColor: getBorderColor(),
      }}
    >
      <div className="summary-content">
        {/* Seção de texto */}
        <div className="summary-text">
          <h3 className="summary-title">{title}</h3>
          <p
            className={`summary-value ${type}`}
            style={{ color: getValueColor() }}
          >
            {value}
          </p>
          {subtitle && <span className="summary-subtitle">{subtitle}</span>}
        </div>

        {/* Seção do ícone */}
        <div
          className={`summary-icon ${type}`}
          style={{
            color: getBorderColor(),
          }}
        >
          {getIcon()}
        </div>
      </div>
    </div>
  );
};
