import React from "react";
import { Clock, Clock4, Clock8, Calendar, BarChart3 } from "lucide-react";

const SummaryCard = ({ title, value, type, icon, subtitle }) => {
  const getIcon = () => {
    if (icon === "calendar") return <Calendar size={24} />;
    if (icon === "chart") return <BarChart3 size={24} />;

    switch (type) {
      case "positive":
        return <Clock4 size={24} />;
      case "negative":
        return <Clock8 size={24} />;
      default:
        return <Clock size={24} />;
    }
  };

  const getCardClass = () => {
    if (icon === "calendar" || icon === "chart") return "summary-card neutral";
    return `summary-card ${type}`;
  };

  const getTextClass = () => {
    if (icon === "calendar" || icon === "chart") return "neutral";
    return type;
  };

  const getIconClass = () => {
    if (icon === "calendar" || icon === "chart") return "summary-icon neutral";
    return `summary-icon ${type}`;
  };

  return (
    <div className={`${getCardClass()} fade-in`}>
      <div className="summary-content">
        <div className="summary-text">
          <h3>{title}</h3>
          <p className={getTextClass()}>{value}</p>
          {subtitle && <small className="summary-subtitle">{subtitle}</small>}
        </div>
        <div className={getIconClass()}>{getIcon()}</div>
      </div>
    </div>
  );
};

export default SummaryCard;
