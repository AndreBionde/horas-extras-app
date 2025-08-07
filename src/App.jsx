import React, { useState, useEffect, useMemo } from "react";
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
    if (!carregamentoInicial) {
      console.log("Salvando no localStorage:", registros);
      localStorage.setItem("registrosHorasExtras", JSON.stringify(registros));
    }
  }, [registros, carregamentoInicial]);

  // Filtrar registros do mês atual
  const registrosMes = useMemo(() => {
    const filtrados = registros
      .filter((reg) => {
        const data = new Date(reg.data + "T00:00:00");
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

      if (horasTrabalhadas > 0) {
        if (diferenca > 0) {
          totalExtras += diferenca;
        } else if (diferenca < 0) {
          totalDebito += Math.abs(diferenca);
        }
      }
    });

    const diasUteis = DateUtils.obterDiasUteis(mesAtual, anoAtual);
    const horasEsperadas = DateUtils.calcularHorasEsperadas(mesAtual, anoAtual);

    const percentualCumprido =
      horasEsperadas > 0
        ? ((horasTrabalhadasTotal / horasEsperadas) * 100).toFixed(1)
        : 0;

    return {
      totalExtras,
      totalDebito,
      saldoFinal: totalExtras - totalDebito,
      horasTrabalhadasTotal,
      diasUteis,
      diasTrabalhados: registrosMes.length,
      horasEsperadas,
      percentualCumprido,
    };
  }, [registrosMes, mesAtual, anoAtual]);

  const adicionarRegistro = () => {
    if (resumo.diasTrabalhados >= resumo.diasUteis) {
      alert(
        `Você já atingiu o limite de ${resumo.diasUteis} dias úteis para este mês.`
      );
      return;
    }

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
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
        const dataCompleta = new Date(registro.data + "T00:00:00");
        dataCompleta.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        atualizarRegistro(id, campo, dataCompleta.toISOString());
      }
    } else {
      atualizarRegistro(id, campo, "");
    }
  };

  // NOVA FUNÇÃO - Exportar para CSV
  const exportarDados = () => {
    try {
      // Cabeçalho do CSV
      const cabecalho = [
        "Data",
        "Entrada",
        "Saída",
        "Horas Trabalhadas",
        "Diferença da Jornada",
        "Status",
      ];

      // Converter registros para linhas CSV
      const linhasCSV = registros.map((registro) => {
        const horasTrabalhadas = DateUtils.calcularHorasTrabalhadas(
          registro.entrada,
          registro.saida
        );

        const diferenca =
          horasTrabalhadas > 0 ? horasTrabalhadas - JORNADA_PADRAO : 0;

        let status = "Normal";
        if (diferenca > 0) status = "Hora Extra";
        if (diferenca < 0) status = "Débito";
        if (horasTrabalhadas === 0) status = "Sem Registro";

        return [
          DateUtils.formatarData(registro.data),
          registro.entrada ? DateUtils.formatarHora(registro.entrada) : "",
          registro.saida ? DateUtils.formatarHora(registro.saida) : "",
          horasTrabalhadas > 0
            ? DateUtils.formatarMinutos(horasTrabalhadas)
            : "0:00h",
          horasTrabalhadas > 0 ? DateUtils.formatarMinutos(diferenca) : "0:00h",
          status,
        ];
      });

      // Adicionar linha de resumo
      const resumoLinha = [
        "--- RESUMO DO PERÍODO ---",
        "",
        "",
        DateUtils.formatarMinutos(resumo.horasTrabalhadasTotal),
        DateUtils.formatarMinutos(resumo.saldoFinal),
        `${resumo.diasTrabalhados}/${resumo.diasUteis} dias`,
      ];

      // Combinar tudo
      const todasLinhas = [cabecalho, ...linhasCSV, [""], resumoLinha];

      // Converter para texto CSV
      const csvContent = todasLinhas
        .map((linha) => linha.map((campo) => `"${campo}"`).join(","))
        .join("\n");

      // Criar e baixar arquivo
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `horas-extras-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert("Dados exportados com sucesso em formato CSV!");
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      alert("Erro ao exportar dados. Tente novamente.");
    }
  };

  // NOVA FUNÇÃO - Importar de CSV
  const importarDados = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      alert("Por favor, selecione um arquivo CSV válido.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target.result;
        const linhas = csvContent.split("\n");

        if (linhas.length < 2) {
          alert("Arquivo CSV vazio ou inválido.");
          return;
        }

        const cabecalho = linhas[0]
          .split(",")
          .map((col) => col.replace(/"/g, "").trim());

        // Verificar se tem as colunas esperadas
        const colunasEsperadas = ["Data", "Entrada", "Saída"];
        const temColunasBasicas = colunasEsperadas.some((col) =>
          cabecalho.some((header) => header.includes(col))
        );

        if (!temColunasBasicas) {
          alert(
            "Arquivo CSV não possui as colunas esperadas (Data, Entrada, Saída)."
          );
          return;
        }

        // Processar linhas de dados
        const registrosImportados = [];

        for (let i = 1; i < linhas.length; i++) {
          const linha = linhas[i].trim();
          if (!linha || linha.startsWith("---") || linha.includes("RESUMO"))
            continue;

          const campos = linha
            .split(",")
            .map((campo) => campo.replace(/"/g, "").trim());

          if (campos.length >= 3 && campos[0] && !campos[0].startsWith("---")) {
            try {
              // Converter data
              let dataFormatada = campos[0];
              if (dataFormatada.includes("/")) {
                const [dia, mes, ano] = dataFormatada.split("/");
                dataFormatada = `${ano}-${mes.padStart(2, "0")}-${dia.padStart(
                  2,
                  "0"
                )}`;
              }

              // Converter horários
              const entradaStr = campos[1];
              const saidaStr = campos[2];

              let entradaISO = "";
              let saidaISO = "";

              if (entradaStr && entradaStr !== "") {
                const [horaE, minE] = entradaStr
                  .split(":")
                  .map((x) => parseInt(x));
                if (!isNaN(horaE) && !isNaN(minE)) {
                  const entradaDate = new Date(dataFormatada + "T00:00:00");
                  entradaDate.setHours(horaE, minE, 0, 0);
                  entradaISO = entradaDate.toISOString();
                }
              }

              if (saidaStr && saidaStr !== "") {
                const [horaS, minS] = saidaStr
                  .split(":")
                  .map((x) => parseInt(x));
                if (!isNaN(horaS) && !isNaN(minS)) {
                  const saidaDate = new Date(dataFormatada + "T00:00:00");
                  saidaDate.setHours(horaS, minS, 0, 0);
                  saidaISO = saidaDate.toISOString();
                }
              }

              registrosImportados.push({
                id: `${Date.now()}_${Math.random()
                  .toString(36)
                  .substr(2, 9)}_${i}`,
                data: dataFormatada,
                entrada: entradaISO,
                saida: saidaISO,
              });
            } catch (error) {
              console.warn(`Erro na linha ${i + 1}:`, error);
              continue;
            }
          }
        }

        if (registrosImportados.length === 0) {
          alert("Nenhum registro válido encontrado no arquivo CSV.");
          return;
        }

        if (
          window.confirm(
            `Foram encontrados ${registrosImportados.length} registros válidos.\n` +
              `Deseja substituir todos os dados atuais pelos dados importados?`
          )
        ) {
          setRegistros(registrosImportados);
          alert(
            `${registrosImportados.length} registros importados com sucesso!`
          );
        }
      } catch (error) {
        console.error("Erro ao processar CSV:", error);
        alert(
          "Erro ao processar arquivo CSV. Verifique o formato e tente novamente."
        );
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  };

  const limparDados = () => {
    if (
      window.confirm(
        "Tem certeza que deseja limpar TODOS os dados? Esta ação não pode ser desfeita."
      )
    ) {
      if (
        window.confirm(
          "ATENÇÃO: Todos os registros serão perdidos permanentemente. Confirma?"
        )
      ) {
        setRegistros([]);
        localStorage.removeItem("registrosHorasExtras");
        alert("Todos os dados foram removidos.");
      }
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
          diasTrabalhados={resumo.diasTrabalhados}
          onExportarDados={exportarDados}
          onImportarDados={importarDados}
          onLimparDados={limparDados}
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

          <SummaryCard
            title="Total Trabalhado"
            value={DateUtils.formatarMinutos(resumo.horasTrabalhadasTotal)}
            type="neutral"
            icon="chart"
            subtitle={`${resumo.percentualCumprido}% da meta mensal`}
          />

          <SummaryCard
            title="Horas Esperadas"
            value={DateUtils.formatarMinutos(resumo.horasEsperadas)}
            type="neutral"
            icon="chart"
            subtitle={`Meta do mês (${JORNADA_PADRAO / 60}h/dia)`}
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
