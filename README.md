# ⏱️ Horas Extras App

Aplicação React para controle de **horas extras**, **horas em débito** e **dias trabalhados** ao longo do mês. Permite registrar horários de entrada e saída e calcula automaticamente o saldo de horas com base em uma jornada padrão.

---

## 🚀 Funcionalidades

- 📅 Seleção de mês e ano para análise
- ⏰ Registro de horários de entrada e saída por dia
- ✅ Cálculo automático de:
  - Horas trabalhadas por dia
  - Diferença em relação à jornada padrão (7h)
  - Total de horas extras, débito e saldo do mês
- 📊 Resumo visual com badges e ícones
- 💾 Persistência dos dados via `localStorage`
- 🔒 Limite de registros com base nos dias úteis do mês

---

## 📋 Regra de Jornada

- **Jornada diária padrão:** 7 horas (420 minutos)
- **Escala de trabalho:** 6 dias por semana com **folga aos domingos**
- **Dias úteis** considerados: de **segunda a sábado**

Essa regra serve como base para o cálculo de **horas esperadas**, **saldo** e **controle de limite mensal**.

---

## 🛠️ Tecnologias Utilizadas

- **React**
- **Lucide React** (ícones)
- **CSS Modules** ou CSS comum (estilização dos componentes)
- `localStorage` para persistência local dos dados
- Utilitários customizados para manipulação de datas e cálculos (`dateUtils`)

---

## 📁 Estrutura do Projeto

├── components/
│ ├── Header.jsx
│ ├── Controls.jsx
│ ├── RegistrosTable.jsx
│ └── SummaryCard.jsx
├── utils/
│ └── dateUtils.js
├── App.jsx
├── index.js
└── styles/

```

```
