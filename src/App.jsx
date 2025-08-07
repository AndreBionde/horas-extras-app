import { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import SummaryCard from "./components/SummaryCard";
import Controls from "./components/Controls";
import RegistrosTable from "./components/RegistrosTable";
import { DateUtils } from "./utils/dateUtils";
import { JORNADA_PADRAO } from "./utils/dateUtils";

const App = () => {
  const [registros, setRegistros] = useState([]);
  const [mesAtual, setMesAtual] = useState(new Date().getMonth());
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());
  const [carregamentoInicial, setCarregamentoInicial] = useState(true);

  // Carregar dados do localStorage
  useEffect(() => {
    const dados = localStorage.getItem("registrosHorasExtras");
    if (dados) {
      try {
        const registrosSalvos = JSON.parse(dados);
        console.log("Carregando do localStorage:", registrosSalvos);
        setRegistros(Array.isArray(registrosSalvos) ? registrosSalvos : []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setRegistros([]);
      }
    }
    setCarregamentoInicial(false);
  }, []);

  // Salvar no localStorage sempre que registros mudarem
  useEffect(() => {
    // Só salva após o carregamento inicial estar completo
    if (!carregamentoInicial) {
      console.log("Salvando no localStorage:", registros);
      localStorage.setItem("registrosHorasExtras", JSON.stringify(registros));
    }
  }, [registros, carregamentoInicial]);

  // Filtrar registros do mês atual - CORREÇÃO PRINCIPAL
  const registrosMes = useMemo(() => {
    const filtrados = registros
      .filter((reg) => {
        const data = new Date(reg.data + "T00:00:00"); // Forçar interpretação local
        const registroMes = data.getMonth();
        const registroAno = data.getFullYear();

        return registroMes === mesAtual && registroAno === anoAtual;
      })
      .sort((a, b) => new Date(a.data) - new Date(b.data));

    return filtrados;
  }, [registros, mesAtual, anoAtual]);

  // Calcular resumo do mês
  const resumo = useMemo(() => {
    let totalExtras = 0;
    let totalDebito = 0;
    let horasTrabalhadasTotal = 0;

    registrosMes.forEach((registro) => {
      const horasTrabalhadas = DateUtils.calcularHorasTrabalhadas(
        registro.entrada,
        registro.saida
      );
      horasTrabalhadasTotal += horasTrabalhadas;
      const diferenca = horasTrabalhadas - JORNADA_PADRAO;

      // Só calcular diferença se houver horas trabalhadas
      if (horasTrabalhadas > 0) {
        if (diferenca > 0) {
          totalExtras += diferenca;
        } else if (diferenca < 0) {
          totalDebito += Math.abs(diferenca);
        }
      }
    });

    return {
      totalExtras,
      totalDebito,
      saldoFinal: totalExtras - totalDebito,
      horasTrabalhadasTotal,
      diasUteis: DateUtils.obterDiasUteis(mesAtual, anoAtual),
      diasTrabalhados: registrosMes.length,
    };
  }, [registrosMes, mesAtual, anoAtual]);

  const adicionarRegistro = () => {
    // Verificar se ainda pode adicionar dias (não deve chegar aqui se o botão estiver desabilitado)
    if (resumo.diasTrabalhados >= resumo.diasUteis) {
      alert(
        `Você já atingiu o limite de ${resumo.diasUteis} dias úteis para este mês.`
      );
      return;
    }

    // Se estamos no mês/ano atual, usar a data de hoje
    // Se não, usar o dia 1 do mês selecionado
    const hoje = new Date();
    const ehMesAtual =
      mesAtual === hoje.getMonth() && anoAtual === hoje.getFullYear();

    let dataParaUsar;
    if (ehMesAtual) {
      dataParaUsar = hoje;
    } else {
      dataParaUsar = new Date(anoAtual, mesAtual, 1);
    }

    const dataFormatada = dataParaUsar.toISOString().split("T")[0];

    const novoRegistro = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // ID mais único
      data: dataFormatada,
      entrada: "",
      saida: "",
    };

    setRegistros((prev) => [...prev, novoRegistro]);
  };

  const removerRegistro = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      setRegistros((prev) => prev.filter((reg) => reg.id !== id));
    }
  };

  const atualizarRegistro = (id, campo, valor) => {
    setRegistros((prev) =>
      prev.map((reg) => (reg.id === id ? { ...reg, [campo]: valor } : reg))
    );
  };

  const handleTimeChange = (id, campo, valor) => {
    if (valor) {
      const registro = registros.find((r) => r.id === id);
      if (registro) {
        const [hours, minutes] = valor.split(":");
        const dataCompleta = new Date(registro.data + "T00:00:00"); // Forçar interpretação local
        dataCompleta.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        atualizarRegistro(id, campo, dataCompleta.toISOString());
      }
    } else {
      atualizarRegistro(id, campo, "");
    }
  };

  return (
    <div className="app-container">
      <Header />

      <div className="main-container">
        <Controls
          mesAtual={mesAtual}
          setMesAtual={setMesAtual}
          anoAtual={anoAtual}
          setAnoAtual={setAnoAtual}
          onAdicionarRegistro={adicionarRegistro}
          diasTrabalhados={resumo.diasTrabalhados} // Passar o número de dias trabalhados
        />

        <div className="summary-grid">
          <SummaryCard
            title="Horas Extras"
            value={DateUtils.formatarMinutos(resumo.totalExtras)}
            type="positive"
          />

          <SummaryCard
            title="Horas em Débito"
            value={DateUtils.formatarMinutos(resumo.totalDebito)}
            type="negative"
          />

          <SummaryCard
            title="Saldo Final"
            value={DateUtils.formatarMinutos(resumo.saldoFinal)}
            type={
              resumo.saldoFinal > 0
                ? "positive"
                : resumo.saldoFinal < 0
                ? "negative"
                : "neutral"
            }
          />

          <SummaryCard
            title="Dias Trabalhados"
            value={`${resumo.diasTrabalhados}/${resumo.diasUteis}`}
            type="neutral"
            icon="calendar"
          />
        </div>

        <RegistrosTable
          registrosMes={registrosMes}
          onAtualizarRegistro={atualizarRegistro}
          onRemoverRegistro={removerRegistro}
          onHandleTimeChange={handleTimeChange}
        />
      </div>
    </div>
  );
};

export default App;
