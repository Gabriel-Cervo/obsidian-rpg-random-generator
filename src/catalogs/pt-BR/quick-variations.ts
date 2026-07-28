export interface QuickEditorialVariation {
  id: string;
  npc: string;
  location: string;
  quest: string;
  encounter: string;
  rumor: string;
  dungeon: string;
}

export const QUICK_VARIATION_BEATS: readonly QuickEditorialVariation[] = [
  {
    id: "testemunha",
    npc: "Uma testemunha reconheceu seu nome.",
    location: "Uma testemunha viu o marco ser alterado.",
    quest: "Uma testemunha exige proteção para falar.",
    encounter: "A pessoa encurralada admite parte da culpa.",
    rumor: "A testemunha nunca muda o horário do relato.",
    dungeon: "Outro grupo entrou há poucas horas.",
  },
  {
    id: "vestigio",
    npc: "Seu equipamento contradiz a versão pública.",
    location: "Cinzas mornas desmentem o abandono.",
    quest: "Um vestígio denuncia uma emboscada.",
    encounter: "A violência foi encenada para ocultar uma fuga.",
    rumor: "Um objeto confirma o fato, mas aponta outro culpado.",
    dungeon: "Cera fresca revela ocupantes recentes.",
  },
  {
    id: "acordo",
    npc: "Um acordo antigo lhe concede autoridade.",
    location: "Uma placa de pedra ainda obriga comunidades rivais.",
    quest: "Um tratado esquecido pode evitar o confronto.",
    encounter: "Os dois lados esperam que o outro ceda primeiro.",
    rumor: "Um tratado guardado previu o acontecimento.",
    dungeon: "Uma inscrição abre uma rota mais segura.",
  },
  {
    id: "prazo",
    npc: "A única testemunha parte ao amanhecer.",
    location: "O acesso ficará perigoso ao anoitecer.",
    quest: "A prova perde valor ao amanhecer.",
    encounter: "A ameaça piora a cada minuto.",
    rumor: "Os sinais confirmam um prazo até o amanhecer.",
    dungeon: "A passagem se fecha gradualmente.",
  },
  {
    id: "aliado",
    npc: "Um antigo aliado oferece ajuda em segredo.",
    location: "Uma moradora conhece um acesso seguro.",
    quest: "Um aliado conhece a fraqueza da oposição.",
    encounter: "Alguém do lado adversário tenta evitar a violência.",
    rumor: "A melhor fonte trabalha para quem abafa o caso.",
    dungeon: "Um habitante acuado conhece um atalho.",
  },
  {
    id: "objeto",
    npc: "Um objeto comum contém uma prova antiga.",
    location: "Um objeto cotidiano esconde um mapa.",
    quest: "A prova está escondida num objeto banal.",
    encounter: "O item disputado contém uma mensagem.",
    rumor: "Um objeto real deu origem à história.",
    dungeon: "Um utensílio abandonado funciona como chave.",
  },
  {
    id: "rota",
    npc: "A rota segura atravessa terras de um rival.",
    location: "Um caminho secundário surge no momento certo.",
    quest: "A rota mais segura exige pagar passagem.",
    encounter: "Uma saída é rápida; outra revela a origem do perigo.",
    rumor: "Os rastros contradizem a rota citada.",
    dungeon: "Uma passagem estreita contorna o obstáculo.",
  },
  {
    id: "promessa",
    npc: "Uma promessa pública limita suas escolhas.",
    location: "Os moradores aguardam uma promessa antiga.",
    quest: "O contratante prometeu poupar a oposição.",
    encounter: "Uma das partes não pode recuar.",
    rumor: "A história testa uma promessa antiga.",
    dungeon: "Abrir uma porta sela outra passagem.",
  },
  {
    id: "sinal",
    npc: "Um sinal repetido liga ocorrências recentes.",
    location: "O mesmo símbolo aponta para três saídas.",
    quest: "Um sinal recorrente prevê o próximo movimento.",
    encounter: "A ameaça reage a um gesto repetido.",
    rumor: "Um detalhe aparece em todos os relatos.",
    dungeon: "Marcas indicam quais superfícies são seguras.",
  },
  {
    id: "preco",
    npc: "Sua ajuda exige um compromisso futuro.",
    location: "Retirar o recurso prejudicará quem depende dele.",
    quest: "A solução rápida transfere o risco para inocentes.",
    encounter: "A paz imediata exige uma perda irreversível.",
    rumor: "O relato esconde o preço já cobrado.",
    dungeon: "O mecanismo exige um objeto valioso.",
  },
  {
    id: "mensagem",
    npc: "Uma mensagem incompleta pede sua presença.",
    location: "Uma frase interrompida só aparece na saída.",
    quest: "A última mensagem esconde o nome de um cúmplice.",
    encounter: "Uma mensagem prova que ambos ignoram parte da situação.",
    rumor: "O trecho ausente muda o sentido do aviso.",
    dungeon: "As inscrições formam uma mensagem.",
  },
  {
    id: "silencio",
    npc: "Seu silêncio protege um erro menor.",
    location: "A pessoa mais informada deixa pistas sem falar.",
    quest: "O contratante omite um nome importante.",
    encounter: "A pessoa silenciosa controla a única saída.",
    rumor: "O nome ausente revela quem controla as testemunhas.",
    dungeon: "Sinos quebrados exigem uma travessia silenciosa.",
  },
  {
    id: "marca",
    npc: "Uma marca liga seu equipamento a uma organização.",
    location: "Um corte recente altera uma marca antiga.",
    quest: "Uma falsa marca de fronteira ameaça a paz.",
    encounter: "Os adversários usam a mesma marca.",
    rumor: "A marca foi acrescentada para orientar alguém.",
    dungeon: "Símbolos nas soleiras antecipam os perigos.",
  },
  {
    id: "disputa",
    npc: "Duas testemunhas sinceras contam versões incompatíveis.",
    location: "Duas comunidades apresentam reivindicações legítimas.",
    quest: "A ordem original favorece apenas uma das partes.",
    encounter: "Os dois lados possuem razões legítimas.",
    rumor: "Versões contraditórias contêm partes da verdade.",
    dungeon: "Grupos rivais precisam do mesmo recurso.",
  },
  {
    id: "refugio",
    npc: "Seu abrigo coloca os moradores em risco.",
    location: "Um refúgio oculto permite observar o perigo.",
    quest: "O único local seguro abriga fugitivos inocentes.",
    encounter: "A área protegida comporta apenas parte dos presentes.",
    rumor: "A história aponta para um refúgio real.",
    dungeon: "Alguém conhece a sala defensável.",
  },
  {
    id: "heranca",
    npc: "Uma herança traz direitos e dívidas.",
    location: "O herdeiro desconhece que possui o lugar.",
    quest: "A prova revela um herdeiro em perigo.",
    encounter: "O suposto invasor possui um documento legítimo.",
    rumor: "A história preservou o nome errado.",
    dungeon: "Um selo de família abre antigas defesas.",
  },
  {
    id: "ritual",
    npc: "Ela pode conter a ameaça uma única vez.",
    location: "Grupos rivais precisam concluir o ritual juntos.",
    quest: "Um ritual pode adiar a ameaça.",
    encounter: "Um ritual incompleto parece um ataque.",
    rumor: "Os gestos temidos pertencem a uma proteção.",
    dungeon: "Objetos dispersos completam um ritual interrompido.",
  },
  {
    id: "devedor",
    npc: "Um devedor troca acesso pelo perdão.",
    location: "O responsável desviou recursos para pagar uma dívida.",
    quest: "Um devedor conhece a rotina da oposição.",
    encounter: "Uma cobrança legítima virou um impasse.",
    rumor: "O boato pressiona uma pessoa endividada.",
    dungeon: "Registros revelam uma dívida antiga.",
  },
  {
    id: "memoria",
    npc: "Uma lembrança compartilhada explica sua lealdade.",
    location: "Todos recordam o mesmo som.",
    quest: "Uma lembrança esquecida corrige a ordem dos fatos.",
    encounter: "Alguém reconhece a repetição de um desastre.",
    rumor: "Uma imagem sobrevive em todas as versões.",
    dungeon: "Murais revelam uma rotina segura.",
  },
  {
    id: "escolha",
    npc: "Ela pergunta quem receberá a informação primeiro.",
    location: "Duas necessidades competem pelo mesmo recurso.",
    quest: "A prova pode ser entregue, destruída ou publicada.",
    encounter: "O grupo não consegue cumprir todos os objetivos.",
    rumor: "Confirmar cedo ou divulgar agora produzem riscos diferentes.",
    dungeon: "A rota final opõe saída e recompensa.",
  },
];

const quickVariationById = new Map(
  QUICK_VARIATION_BEATS.map((variation) => [variation.id, variation]),
);

export function getQuickVariation(id: string): QuickEditorialVariation {
  const variation = quickVariationById.get(id);
  if (!variation) throw new Error(`Variação rápida desconhecida: ${id}`);
  return variation;
}
