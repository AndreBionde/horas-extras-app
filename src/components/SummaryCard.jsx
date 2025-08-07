import { Clock, Clock4, Clock8, Calendar } from "lucide-react";

const SummaryCard = ({ title, value, type, icon }) => {
  const getIcon = () => {
    if (icon === "calendar") return <Calendar size={24} />;

    switch (type) {
      case "positive":
        return <Clock4 size={24} />; // Ícone de relógio mostrando 4 horas (seta para direita)
      case "negative":
        return <Clock8 size={24} />; // Ícone de relógio mostrando 8 horas (seta para baixo)
      default:
        return <Clock size={24} />; // Ícone de relógio padrão
    }
  };

  const getCardClass = () => {
    if (icon === "calendar") return "summary-card neutral";
    return `summary-card ${type}`;
  };

  const getTextClass = () => {
    if (icon === "calendar") return "neutral";
    return type;
  };

  const getIconClass = () => {
    if (icon === "calendar") return "summary-icon neutral";
    return `summary-icon ${type}`;
  };

  return (
    <div className={`${getCardClass()} fade-in`}>
      <div className="summary-content">
        <div className="summary-text">
          <h3>{title}</h3>
          <p className={getTextClass()}>{value}</p>
        </div>
        <div className={getIconClass()}>{getIcon()}</div>
      </div>
    </div>
  );
};

export default SummaryCard;
