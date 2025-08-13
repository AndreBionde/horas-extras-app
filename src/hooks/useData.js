import { useState, useEffect, useMemo } from 'react';
import { ESCALAS_TRABALHO, ESCALA_PADRAO, STORAGE_KEYS } from '../constants/constants';
import { DateUtils } from '../utils/dateUtils';

/**
 * Hook personalizado para gerenciamento de dados com suporte a escalas
 */
export const useData = () => {
  const [registros, setRegistros] = useState([]);
  const [mesAtual, setMesAtual] = useState(new Date().getMonth());
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());
  const [escalaAtual, setEscalaAtual] = useState(ESCALA_PADRAO);
  const [carregamentoInicial, setCarregamentoInicial] = useState(true);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    // Carregar registros
    const dados = localStorage.getItem(STORAGE_KEYS.REGISTROS);
    if (dados) {
      try {
        const registrosSalvos = JSON.parse(dados);
        console.log("Carregando dados do localStorage:", registrosSalvos);
        setRegistros(Array.isArray(registrosSalvos) ? registrosSalvos : []);
      } catch (error) {
        console.error("Erro ao carregar dados do localStorage:", error);
        setRegistros([]);
      }
    }

    // Carregar escala de trabalho
    const escalaSalva = localStorage.getItem(STORAGE_KEYS.ESCALA_TRABALHO);
    if (escalaSalva && ESCALAS_TRABALHO.find(e => e.id === escalaSalva)) {
      setEscalaAtual(escalaSalva);
    }

    setCarregamentoInicial(false);
  }, []);

  // Salvar registros no localStorage sempre que mudarem
  useEffect(() => {
    if (!carregamentoInicial) {
      console.log("Salvando dados no localStorage:", registros);
      localStorage.setItem(STORAGE_KEYS.REGISTROS, JSON.stringify(registros));
    }
  }, [registros, carregamentoInicial]);

  // Salvar escala de trabalho no localStorage sempre que mudar
  useEffect(() => {
    if (!carregamentoInicial) {
      console.log("Salvando escala de trabalho:", escalaAtual);
      localStorage.setItem(STORAGE_KEYS.ESCALA_TRABALHO, escalaAtual);
    }
  }, [escalaAtual, carregamentoInicial]);

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

  // Calcular resumo do mês com base na escala atual
  const resumo = useMemo(() => {
    const escalaInfo = DateUtils.obterEscalaInfo(escalaAtual);
    let totalExtras = 0;
    let totalDebito = 0;
    let horasTrabalhadasTotal = 0;

    registrosMes.forEach((registro) => {
      const horasTrabalhadas = DateUtils.calcularHorasTrabalhadas(registro.entrada, registro.saida);
      horasTrabalhadasTotal += horasTrabalhadas;
      const diferenca = horasTrabalhadas - escalaInfo.horasPorDia;

      if (horasTrabalhadas > 0) {
        if (diferenca > 0) {
          totalExtras += diferenca;
        } else if (diferenca < 0) {
          totalDebito += Math.abs(diferenca);
        }
      }
    });

    const diasUteis = DateUtils.obterDiasUteis(mesAtual, anoAtual, escalaAtual);
    const horasEsperadas = DateUtils.calcularHorasEsperadas(mesAtual, anoAtual, escalaAtual);
    const percentualCumprido = horasEsperadas > 0 ? 
      ((horasTrabalhadasTotal / horasEsperadas) * 100).toFixed(1) : 0;

    return {
      totalExtras,
      totalDebito,
      saldoFinal: totalExtras - totalDebito,
      horasTrabalhadasTotal,
      diasUteis,
      diasTrabalhados: registrosMes.length,
      horasEsperadas,
      percentualCumprido,
      escalaInfo, // Incluir informações da escala no resumo
    };
  }, [registrosMes, mesAtual, anoAtual, escalaAtual]);

  return {
    registros,
    setRegistros,
    mesAtual,
    setMesAtual,
    anoAtual,
    setAnoAtual,
    escalaAtual,
    setEscalaAtual,
    registrosMes,
    resumo,
    carregamentoInicial
  };
};