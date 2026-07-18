/**
 * Árvore de decisão do assistente guiado. Sem IA: cada nó tem mensagens fixas
 * e opções clicáveis que levam a outro nó (ou navegam para uma página).
 */
export interface BotOption {
  label: string;
  next: string;
  /** Se definido, também navega para esta rota do painel. */
  to?: string;
}

export interface BotNode {
  id: string;
  messages: string[];
  options: BotOption[];
}

const backToStart: BotOption = { label: "↩ Voltar ao início", next: "inicio" };

export const chatbotNodes: Record<string, BotNode> = {
  inicio: {
    id: "inicio",
    messages: [
      "Olá! Sou o assistente do Aluga+ 👋",
      "Escolha um assunto que eu te guio pelas respostas — rapidinho e sem rodeios.",
    ],
    options: [
      { label: "📱 Acesso NFC e fechaduras", next: "nfc" },
      { label: "💰 Pagamentos e repasses", next: "pagamentos" },
      { label: "⛓️ Contratos e blockchain", next: "contratos" },
      { label: "🔧 Manutenção", next: "manutencao" },
      { label: "👥 Equipe e permissões", next: "equipe" },
      { label: "🧑 Falar com um atendente", next: "humano" },
    ],
  },

  nfc: {
    id: "nfc",
    messages: [
      "As fechaduras conectadas abrem por tag NFC de aproximação ou por liberação remota no painel.",
      "Cada acionamento fica registrado no histórico, com quem entrou, onde e quando.",
    ],
    options: [
      { label: "Como cadastrar uma tag nova?", next: "nfc-cadastro" },
      { label: "O inquilino perdeu a tag", next: "nfc-perda" },
      { label: "Abrir a tela de Acessos NFC", next: "nfc-abrir", to: "/dono/acessos" },
      backToStart,
    ],
  },
  "nfc-cadastro": {
    id: "nfc-cadastro",
    messages: [
      "Em Acessos NFC → Tags cadastradas, toque em uma tag virgem no leitor e vincule ao portador e ao imóvel.",
      "Tags de prestadores podem ter validade — depois da data, a fechadura recusa sozinha.",
    ],
    options: [
      { label: "Abrir Acessos NFC", next: "nfc-abrir", to: "/dono/acessos" },
      { label: "Outra dúvida de NFC", next: "nfc" },
      backToStart,
    ],
  },
  "nfc-perda": {
    id: "nfc-perda",
    messages: [
      "Sem pânico: revogue a tag perdida em Acessos NFC e ela para de abrir na hora.",
      "Depois é só cadastrar uma tag nova para o inquilino — o histórico da antiga fica guardado.",
    ],
    options: [{ label: "Abrir Acessos NFC", next: "nfc-abrir", to: "/dono/acessos" }, backToStart],
  },
  "nfc-abrir": {
    id: "nfc-abrir",
    messages: ["Prontinho, te levei para a tela de Acessos NFC. Precisa de mais alguma coisa?"],
    options: [{ label: "Outra dúvida de NFC", next: "nfc" }, backToStart],
  },

  pagamentos: {
    id: "pagamentos",
    messages: [
      "O inquilino paga como preferir: Pix, boleto registrado, cartão de crédito ou carteira digital — no site, no app ou pelo WhatsApp.",
      "O split é automático: 92% vai para você, 5% é a taxa Aluga+ e 3% vai para o fundo de reserva.",
    ],
    options: [
      { label: "Quando cai o repasse?", next: "pagamentos-repasse" },
      { label: "E se o pagamento falhar?", next: "pagamentos-falha" },
      { label: "Abrir a tela de Pagamentos", next: "pagamentos-abrir", to: "/dono/pagamentos" },
      backToStart,
    ],
  },
  "pagamentos-repasse": {
    id: "pagamentos-repasse",
    messages: [
      "Depende do método: Pix cai no mesmo dia (D+0), boleto em D+1, carteiras em D+2 e cartão em D+30.",
      "O repasse já chega dividido pelo split — sem precisar transferir nada manualmente.",
    ],
    options: [{ label: "Outra dúvida de pagamentos", next: "pagamentos" }, backToStart],
  },
  "pagamentos-falha": {
    id: "pagamentos-falha",
    messages: [
      "No cartão, a plataforma faz retentativas inteligentes nos dias seguintes.",
      "Se continuar falhando, o inquilino recebe um Pix copia-e-cola automático — e você acompanha tudo no Financeiro.",
    ],
    options: [{ label: "Outra dúvida de pagamentos", next: "pagamentos" }, backToStart],
  },
  "pagamentos-abrir": {
    id: "pagamentos-abrir",
    messages: ["Te levei para a tela de Pagamentos. Mais alguma coisa?"],
    options: [{ label: "Outra dúvida de pagamentos", next: "pagamentos" }, backToStart],
  },

  contratos: {
    id: "contratos",
    messages: [
      "Cada contrato de locação vira um smart contract na blockchain: registro público, imutável e auditável.",
      "A caução fica em escrow — travada no contrato — e é liberada automaticamente com a vistoria aprovada.",
    ],
    options: [
      { label: "Isso vale juridicamente?", next: "contratos-juridico" },
      { label: "Quanto custa registrar?", next: "contratos-custo" },
      { label: "Abrir a tela de Blockchain", next: "contratos-abrir", to: "/dono/blockchain" },
      backToStart,
    ],
  },
  "contratos-juridico": {
    id: "contratos-juridico",
    messages: [
      "O contrato tradicional (PDF assinado) continua valendo normalmente — o registro on-chain entra como prova extra de integridade e data.",
      "Qualquer alteração gera um novo hash, então ninguém muda uma vírgula sem deixar rastro.",
    ],
    options: [{ label: "Outra dúvida de contratos", next: "contratos" }, backToStart],
  },
  "contratos-custo": {
    id: "contratos-custo",
    messages: [
      "Quase nada: usamos a rede Polygon, e cada registro custa em média R$ 0,04 de gás.",
      "Esse custo já está incluso na sua mensalidade — você não paga nada à parte.",
    ],
    options: [{ label: "Outra dúvida de contratos", next: "contratos" }, backToStart],
  },
  "contratos-abrir": {
    id: "contratos-abrir",
    messages: ["Te levei para a tela de Blockchain. Mais alguma coisa?"],
    options: [{ label: "Outra dúvida de contratos", next: "contratos" }, backToStart],
  },

  manutencao: {
    id: "manutencao",
    messages: [
      "Chamados de manutenção ficam na tela Manutenção, com status e histórico por imóvel.",
    ],
    options: [
      { label: "Abrir um chamado urgente", next: "manutencao-urgente" },
      { label: "Ver chamados abertos", next: "manutencao-abrir", to: "/dono/manutencao" },
      backToStart,
    ],
  },
  "manutencao-urgente": {
    id: "manutencao-urgente",
    messages: [
      "Para urgências (vazamento, fechadura travada, falta de energia), registre o chamado como 'urgente' na tela de Manutenção.",
      "Prestadores parceiros recebem na hora — e você pode dar acesso temporário por tag NFC com validade.",
    ],
    options: [
      { label: "Abrir Manutenção", next: "manutencao-abrir", to: "/dono/manutencao" },
      backToStart,
    ],
  },
  "manutencao-abrir": {
    id: "manutencao-abrir",
    messages: ["Te levei para a tela de Manutenção. Mais alguma coisa?"],
    options: [backToStart],
  },

  equipe: {
    id: "equipe",
    messages: [
      "Você pode convidar gestores, financeiro, manutenção e até o seu contador — cada um com um papel.",
      "O RBAC define o que cada papel enxerga e edita, módulo por módulo.",
    ],
    options: [
      { label: "Como convidar alguém?", next: "equipe-convite" },
      { label: "Quais papéis existem?", next: "equipe-papeis" },
      { label: "Abrir Administração", next: "equipe-abrir", to: "/dono/administracao" },
      backToStart,
    ],
  },
  "equipe-convite": {
    id: "equipe-convite",
    messages: [
      "Em Administração, clique em 'Convidar membro', informe nome, e-mail e o papel.",
      "A pessoa recebe o convite por e-mail e já entra com as permissões certas.",
    ],
    options: [
      { label: "Abrir Administração", next: "equipe-abrir", to: "/dono/administracao" },
      backToStart,
    ],
  },
  "equipe-papeis": {
    id: "equipe-papeis",
    messages: [
      "São cinco: Administrador (tudo), Gestor (operação), Financeiro (cobranças), Manutenção (chamados) e Visualizador (só leitura).",
      "E você pode ajustar a matriz de permissões papel por papel, módulo por módulo.",
    ],
    options: [
      { label: "Abrir Administração", next: "equipe-abrir", to: "/dono/administracao" },
      backToStart,
    ],
  },
  "equipe-abrir": {
    id: "equipe-abrir",
    messages: ["Te levei para a tela de Administração. Mais alguma coisa?"],
    options: [backToStart],
  },

  humano: {
    id: "humano",
    messages: [
      "Claro! Nosso time atende de segunda a sexta, das 8h às 18h.",
      "WhatsApp: (85) 99999-0000 · E-mail: suporte@alugaflow.com.br",
      "Se preferir, deixe a conversa registrada no chat do imóvel que retornamos por lá.",
    ],
    options: [
      { label: "Abrir Conversas", next: "humano-abrir", to: "/dono/conversas" },
      backToStart,
    ],
  },
  "humano-abrir": {
    id: "humano-abrir",
    messages: ["Te levei para as Conversas. Até já! 👋"],
    options: [backToStart],
  },
};
