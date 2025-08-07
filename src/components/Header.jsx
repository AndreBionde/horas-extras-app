import { Clock } from "lucide-react";

const Header = () => {
  return (
    <div className="header">
      <div className="header-container">
        <div className="header-title-wrapper">
          <div className="header-icon">
            <Clock size={32} />
          </div>
          <h1 className="header-title">Controle de Horas Extras</h1>
        </div>
        <p className="header-subtitle">
          Gerencie suas horas de trabalho com precisão e elegância
        </p>
      </div>
    </div>
  );
};

export default Header;
