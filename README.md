# ⏱️ Controle de Horas Extras

Uma aplicação React moderna e elegante para controle de **horas extras**, **horas em débito** e gestão completa da jornada de trabalho. Interface premium com glassmorphism e animações suaves.

---

## 🎯 **Visão Geral**

Esta aplicação permite registrar e controlar com precisão suas horas de trabalho, oferecendo:

- Cálculo automático de horas extras e débitos
- Análise mensal completa da jornada
- Interface moderna com efeitos visuais premium
- Exportação/importação de dados em formato CSV
- Backup automático e restore de dados
- Validação inteligente de horários

---

## ✨ **Funcionalidades Principais**

### 📅 **Controle Temporal**

- Seleção de mês e ano para análise
- Limite inteligente baseado em dias úteis
- Navegação entre períodos

### ⏰ **Registro de Horários**

- Entrada e saída por dia
- Validação automática de horários
- Alertas para inconsistências
- Interface intuitiva com ícones

### 📊 **Análise e Relatórios**

- **Horas Extras:** Tempo trabalhado além da jornada padrão
- **Horas em Débito:** Tempo não trabalhado na jornada
- **Saldo Final:** Diferença entre extras e débitos
- **Percentual Cumprido:** Meta mensal atingida
- **Dias Trabalhados vs Dias Úteis**

### 💾 **Gestão de Dados**

- Persistência automática via localStorage
- Exportação para CSV
- Importação de dados CSV
- Backup e restore completo

---

## 🎨 **Design Premium**

### **Glassmorphism UI**

- Efeitos de vidro fosco (backdrop-filter)
- Transparências elegantes
- Gradientes modernos
- Animações fluidas

### **Responsividade Total**

- Desktop, tablet e mobile
- Touch-friendly
- Adaptação automática de layout
- Scrollbar customizada

### **Micro-interações**

- Hover effects sutis
- Animações de loading
- Transições suaves
- Feedback visual imediato

---

## 📋 **Regras de Jornada**

### **Configuração Padrão**

- **Jornada diária:** 7 horas (420 minutos)
- **Dias úteis:** Segunda a Sábado
- **Folga:** Domingos
- **Escala:** 6 dias por semana

### **Cálculos**

- **Horas Esperadas:** Dias úteis × 7 horas
- **Horas Extras:** Quando > 7h/dia
- **Horas Débito:** Quando < 7h/dia
- **Saldo Final:** Extras - Débitos

---

## 🛠️ **Tecnologias**

### **Core**

- **React 18+** - Framework principal
- **JavaScript ES6+** - Linguagem
- **CSS3 Premium** - Estilização avançada

### **Bibliotecas**

- **Lucide React** - Ícones modernos
- **Date Utils** - Manipulação de datas
- **CSV Utils** - Importação/exportação

### **Recursos Avançados**

- **localStorage** - Persistência local
- **Backdrop Filter** - Efeitos de vidro
- **CSS Grid/Flexbox** - Layouts responsivos
- **CSS Animations** - Micro-interações

---

## 🚀 **Instalação e Uso**

### **Pré-requisitos**

```bash
Node.js 16+
npm ou yarn
```

### **Instalação**

```bash
# Clone o repositório
git clone [seu-repositorio]

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

### **Build para Produção**

```bash
npm run build
```

---

## 📱 **Como Usar**

### **1. Seleção do Período**

- Escolha mês e ano no painel superior
- Visualize automaticamente os dias úteis

### **2. Registro de Horários**

- Clique em "Adicionar Dia"
- Insira horário de entrada e saída
- Observe validações automáticas

### **3. Acompanhamento**

- Monitore cards de resumo em tempo real
- Identifique padrões e tendências
- Planeje sua jornada

### **4. Gestão de Dados**

- Exporte relatórios em CSV
- Faça backup dos dados
- Importe históricos anteriores

---

## 🎨 **Customização**

### **Jornada de Trabalho**

Altere a constante `JORNADA_PADRAO` em `dateUtils.js`:

```javascript
export const JORNADA_PADRAO = 8 * 60; // 8 horas
```

### **Dias Úteis**

Modifique a função `obterDiasUteis()` para incluir/excluir dias:

```javascript
// Exemplo: incluir domingos
if (diaSemana >= 0 && diaSemana <= 6) {
  diasUteis++;
}
```

### **Temas e Cores**

Ajuste as variáveis CSS no topo do arquivo `index.css`

---

## 📊 **Formato CSV**

### **Exportação**

```csv
Data,Entrada,Saida,Horas Trabalhadas,Diferenca
2024-01-15,08:00,16:00,7:00h,+0:00h
2024-01-16,08:30,17:00,8:30h,+1:30h
```

### **Importação**

- Mesmo formato da exportação
- Suporte a múltiplas colunas
- Validação automática de dados

---

## 🔒 **Privacidade**

- **Dados Locais:** Tudo armazenado no seu navegador
- **Sem Servidor:** Não enviamos dados para nenhum lugar
- **Controle Total:** Você possui e controla seus dados
- **Backup Manual:** Exporte quando quiser

---

- **Documentação:** README.md
- **Issues:** GitHub Issues
- **Discussões:** GitHub Discussions

---
