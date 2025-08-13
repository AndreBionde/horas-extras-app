import { Clock } from "lucide-react";

/**
 * Componente Header - Cabeçalho principal da aplicação
 *
 * Responsável por exibir a identidade visual da aplicação:
 * - Título principal com ícone temático
 * - Descrição das funcionalidades principais
 *
 */
export const Header = () => (
  <header className="header">
    <div className="header-container">
      {/* Título principal com ícone */}
      <div className="header-title-wrapper">
        <div className="header-icon">
          <Clock size={32} aria-hidden="true" />
        </div>

        <h1 className="header-title">Controle de Horas Extras</h1>
      </div>

      {/* Subtítulo descritivo */}
      <p className="header-subtitle">
        Dashboard avançado com relatórios e gráficos interativos
      </p>
    </div>
  </header>
);
