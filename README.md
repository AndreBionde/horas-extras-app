# ⏱️ Sistema de Controle de Horas Extras

Uma aplicação **React** moderna e elegante para controle profissional de horas extras, horas em débito e gestão completa da jornada de trabalho. Interface premium com **glassmorphism** e **dashboards interativos**.

---

## 🎯 **Visão Geral**

O **Sistema de Controle de Horas Extras** é uma solução completa para profissionais que precisam acompanhar sua jornada de trabalho com precisão e estilo. A aplicação oferece:

- 📊 **Dashboard Interativo** com gráficos dinâmicos (linha, área, barras, pizza)
- 🧮 **Cálculo Automático** de horas extras, débitos e saldo final
- 📅 **Análise Mensal** completa com insights inteligentes
- 🎨 **Interface Premium** com efeitos glassmorphism e animações
- 📱 **100% Responsiva** - desktop, tablet e mobile
- 💾 **Persistência Local** - dados salvos automaticamente no navegador
- 📈 **Relatórios Avançados** - exportação em CSV e PDF
- ⚙️ **Escalas Personalizáveis** - diferentes jornadas de trabalho

---

## ✨ **Funcionalidades Principais**

### 🗓️ **Gestão de Períodos**

- **Seleção Intuitiva:** Navegue entre meses e anos facilmente
- **Múltiplas Escalas:** Suporte a diferentes jornadas (6x1, 5x2, personalizada)
- **Dias Úteis Inteligentes:** Calcula automaticamente baseado na escala selecionada
- **Limite Automático:** Impede registros além dos dias úteis do mês
- **Validação de Datas:** Previne inconsistências nos dados

### ⏰ **Controle de Horários**

- **Interface Amigável:** Inputs visuais para entrada e saída
- **Validação em Tempo Real:** Alertas imediatos para horários inválidos
- **Detecção de Inconsistências:** Identifica jornadas muito longas ou incorretas
- **Correção Automática:** Sugestões para corrigir dados inconsistentes
- **Cálculo Automático:** Horas extras e débitos calculados instantaneamente

### 📊 **Analytics e Dashboards**

- **4 Tipos de Gráficos:** Linha, área, barras e pizza
- **Insights Automáticos:** Análises inteligentes do seu desempenho
- **Métricas Avançadas:**
  - Horas extras acumuladas
  - Horas em débito
  - Saldo final mensal
  - Percentual de cumprimento da meta
  - Média diária trabalhada
  - Comparativo com dias úteis
  - Índice de consistência

### ⚙️ **Escalas de Trabalho**

- **Escala 6x1 (7h/dia):** Segunda a sábado, 7 horas diárias
- **Escala 6x1 (8h/dia):** Segunda a sábado, 8 horas diárias
- **Escala 5x2 (8h/dia):** Segunda a sexta, 8 horas diárias
- **Personalização:** Configure sua própria escala de trabalho

### 💾 **Gestão de Dados**

- **Persistência Automática:** Dados salvos automaticamente no navegador
- **Exportação CSV:** Relatórios detalhados para Excel/Google Sheets
- **Geração de PDF:** Relatórios visuais prontos para impressão
- **Importação de Dados:** Migre dados de planilhas existentes
- **Backup e Restore:** Proteção total dos seus registros

### 🎨 **Experience Premium**

- **Glassmorphism UI:** Efeitos de vidro fosco modernos
- **Micro-animações:** Transições suaves e responsivas
- **Feedback Visual:** Estados de loading, validação e erro
- **Mobile First:** Otimizado para dispositivos móveis

---

## 📋 **Sistema de Escalas**

### ⚙️ **Escalas Disponíveis**

```
📅 Escala 6x1 (7h/dia):
   • Dias: Segunda a Sábado (6 dias)
   • Jornada: 7 horas diárias
   • Total: 42 horas semanais

📅 Escala 6x1 (8h/dia):
   • Dias: Segunda a Sábado (6 dias)
   • Jornada: 8 horas diárias
   • Total: 48 horas semanais

📅 Escala 5x2 (8h/dia):
   • Dias: Segunda a Sexta (5 dias)
   • Jornada: 8 horas diárias
   • Total: 40 horas semanais
```

### 🔢 **Lógica de Cálculos**

- **Horas Esperadas:** `Dias Úteis × Horas da Escala`
- **Horas Extras:** `Quando > horas da escala no dia`
- **Horas Débito:** `Quando < horas da escala no dia`
- **Saldo Final:** `Total de Extras - Total de Débitos`
- **Percentual Cumprido:** `(Horas Trabalhadas / Horas Esperadas) × 100`

---

## 🚀 **Instalação e Configuração**

### 📋 **Pré-requisitos**

```bash
Node.js 16.0+
npm 8.0+ ou yarn 1.22+
Navegador moderno com suporte a ES6+
```

### ⚡ **Instalação Rápida**

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/controle-horas-extras.git
cd controle-horas-extras

# 2. Instale as dependências
npm install
# ou
yarn install

# 3. Inicie o servidor de desenvolvimento
npm start
# ou
yarn start

# 4. Abra no navegador
# http://localhost:3000
```

### 🏗️ **Build para Produção**

```bash
# Build otimizado
npm run build
# ou
yarn build

# Serve local (opcional)
npm install -g serve
serve -s build
```

### 📦 **Dependências Principais**

```json
{
  "react": "^18.0.0",
  "recharts": "^2.8.0",
  "lucide-react": "^0.263.1",
  "jspdf": "^2.5.1"
}
```

---

## 📖 **Como Usar**

### 1️⃣ **Primeiro Acesso**

1. **Selecione a Escala:** Escolha sua jornada de trabalho no painel superior
2. **Selecione o Período:** Escolha mês e ano no painel superior
3. **Visualize os Dias Úteis:** Sistema calcula automaticamente baseado na escala

### 2️⃣ **Registrando Horários**

```
🔹 Clique em "Adicionar Dia"
🔹 Selecione a data de trabalho
🔹 Insira horário de entrada (ex: 08:00)
🔹 Insira horário de saída (ex: 16:30)
🔹 Sistema calcula automaticamente horas e diferenças
```

### 3️⃣ **Acompanhando Performance**

- **📊 Cards de Resumo:** Visualize métricas em tempo real
- **📈 Dashboard Interativo:** Analise tendências e padrões
- **💡 Insights Automáticos:** Receba sugestões personalizadas
- **📅 Comparativos:** Veja progresso mensal e consistência

### 4️⃣ **Exportação e Backup**

```
📤 Exportar CSV: Relatório completo para planilhas
📄 Gerar PDF: Relatório visual formatado
💾 Backup Automático: Dados salvos no navegador
📥 Importar Dados: Migre de planilhas existentes
```

---

## ⚙️ **Personalização**

### 🕐 **Adicionando Nova Escala**

```javascript
// Em src/constants/constants.js
export const ESCALAS_TRABALHO = [
  // Escalas existentes...
  {
    id: "escala_personalizada",
    nome: "Personalizada 4x3",
    descricao: "4 dias trabalhados, 3 dias de folga",
    horasPorDia: 480, // 8 horas em minutos
    horasSemana: 32, // Total semanal
    diasUteis: [1, 2, 3, 4], // Segunda a quinta
  },
];
```

---

## 📊 **Formatos de Dados**

### 📤 **Formato CSV de Exportação**

```csv
Data,Entrada,Saída,Horas Trabalhadas,Diferença da Jornada,Status,Escala
2024-01-15,08:00:00,16:00:00,8:00h,+1:00h,Hora Extra,6x1 (7h)
2024-01-16,08:30:00,16:30:00,8:00h,+1:00h,Hora Extra,6x1 (7h)
2024-01-17,09:00:00,15:30:00,6:30h,-0:30h,Débito,6x1 (7h)
--- RESUMO DO PERÍODO ---,,,56:30h,+2:30h,15/22 dias,6x1 (7h)
--- CONFIGURAÇÃO DA ESCALA ---,6x1 (7h),Segunda a Sábado,7h/dia,42h/semana,,
```

### 📥 **Formato de Importação Aceito**

- **CSV padrão** com colunas obrigatórias: Data, Entrada, Saída
- **Formato de data:** YYYY-MM-DD ou DD/MM/YYYY
- **Formato de hora:** HH:MM (24h)
- **Encoding:** UTF-8 recomendado
- **Separador:** Vírgula (,)

### 💾 **Estrutura de Dados Interna**

```javascript
// Estrutura de um registro
{
  id: "1640995200000_abc123def",  // ID único
  data: "2024-01-15",             // Data ISO (YYYY-MM-DD)
  entrada: "2024-01-15T08:00:00.000Z",  // ISO timestamp
  saida: "2024-01-15T16:00:00.000Z"     // ISO timestamp
}
```

---

## 🔒 **Privacidade e Segurança**

### 🛡️ **Proteção Total dos Dados**

- **🏠 100% Local:** Dados nunca saem do seu navegador
- **🚫 Zero Tracking:** Sem cookies de rastreamento ou analytics
- **🔐 Controle Total:** Você possui e gerencia seus dados
- **💾 Backup Manual:** Exporte quando e como quiser
- **🗑️ Limpeza Fácil:** Delete dados com confirmação dupla

### 💾 **Armazenamento Local**

- **localStorage:** Persistência automática no navegador
- **Compatibilidade:** Funciona em todos os navegadores modernos
- **Capacidade:** Até 5-10MB de dados (suficiente para anos de registros)
- **Performance:** Acesso instantâneo aos dados

---

## 🆘 **Solução de Problemas**

### ❓ **Problemas Comuns**

**Dados não aparecem após importação:**

- Verificar formato CSV (vírgula como separador)
- Confirmar encoding UTF-8
- Validar formato de datas (DD/MM/YYYY ou YYYY-MM-DD)

**Gráficos não carregam:**

- Verificar se há registros no período selecionado
- Limpar cache do navegador
- Verificar console para erros JavaScript

**Cálculos incorretos:**

- Verificar se escala selecionada está correta
- Confirmar horários de entrada/saída
- Validar se não há registros duplicados

---

### 🏆 **Casos de Uso Reais**

- **Freelancers:** Controle de projetos e clientes
- **Consultores:** Acompanhamento de horas faturáveis
- **CLT:** Gestão de horas extras e banco de horas
- **Autônomos:** Organização da jornada de trabalho
- **Estudantes:** Controle de horas de estágio

---

**⭐ Se este projeto te ajudou, deixe uma estrela no GitHub!**

---
