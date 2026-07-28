import type { ToneId } from "../../types";

export interface ToneWritingProfile {
  npcFrame: string;
  npcColor: string;
  npcMotive: string;
  npcPressure: string;
  npcThreat: string;
  locationMood: string;
  locationLandmark: string;
  locationHook: string;
  locationPressure: string;
  locationSecret: string;
  questComplication: string;
  questReward: string;
  questContext: string;
  questOpposition: string;
  questEscalation: string;
  questFailure: string;
  questAlternative: string;
  encounterPressure: string;
  encounterTwist: string;
  encounterChoice: string;
  encounterEscalation: string;
  encounterAftermath: string;
  rumorClaim: string;
  rumorTruth: string;
  rumorInterested: string;
  rumorConsequence: string;
  rumorContext: string;
  dungeonTheme: string;
  dungeonOverview: string;
  dungeonRoom: string;
}

export const TONE_WRITING: Readonly<Record<ToneId, ToneWritingProfile>> = {
  grim: {
    npcFrame: "uma perda que ninguém conseguiu reparar",
    npcColor: "contido, atento e marcado por noites mal dormidas",
    npcMotive: "impedir que outra família pague pelo mesmo erro",
    npcPressure: "A comunidade exige uma resposta, embora já tenha escolhido um culpado conveniente.",
    npcThreat: "uma decisão antiga ainda ameaça pessoas que não participaram dela",
    locationMood: "As conversas cessam quando alguém menciona os desaparecidos, e todas as portas são fechadas antes do anoitecer.",
    locationLandmark: "Nomes riscados na superfície lembram quem não voltou para casa.",
    locationHook: "Os moradores pedem ajuda porque a próxima perda já pode ser prevista.",
    locationPressure: "O medo transforma vizinhos em acusadores e torna qualquer demora mais perigosa.",
    locationSecret: "A verdade não inocenta todos, mas prova que o sacrifício mais recente poderia ter sido evitado.",
    questComplication: "O contratante omitiu uma morte ocorrida na primeira tentativa de cumprir a missão.",
    questReward: "A recompensa inclui reparação para quem sofreu as consequências do conflito.",
    questContext: "A missão começa tarde demais para impedir todo o dano, mas ainda há tempo para proteger os sobreviventes.",
    questOpposition: "A oposição prefere destruir a prova a admitir que se beneficiou da tragédia.",
    questEscalation: "Cada atraso elimina uma rota de fuga e coloca outra pessoa sob suspeita.",
    questFailure: "Se o grupo falhar, a comunidade repetirá a solução cruel que adotou da última vez.",
    questAlternative: "Uma confissão pública pode encerrar a perseguição, desde que alguém aceite responder pelo que fez.",
    encounterPressure: "Uma pessoa ferida perde forças enquanto os presentes discutem quem merece ser salvo.",
    encounterTwist: "O responsável imediato agiu para proteger alguém e agora não consegue recuar sem expor essa pessoa.",
    encounterChoice: "Qualquer solução preserva uma vida e abandona outra necessidade urgente.",
    encounterEscalation: "O pânico se espalha, e antigos ressentimentos passam a orientar as ações dos envolvidos.",
    encounterAftermath: "Mesmo uma vitória deixa um nome a ser lembrado e uma dívida que não desaparece.",
    rumorClaim: "Quem conta a história sempre acrescenta uma vítima, porque o medo tornou o exagero mais convincente que os fatos.",
    rumorTruth: "O núcleo do relato é verdadeiro, mas sua causa expõe uma tentativa desesperada de evitar uma perda maior.",
    rumorInterested: "Uma autoridade alimenta o boato para desviar a culpa de decisões recentes.",
    rumorConsequence: "A investigação salva possíveis vítimas, mas força a comunidade a reconhecer sua participação no problema.",
    rumorContext: "O boato se espalha em funerais, filas de racionamento e conversas mantidas longe das autoridades.",
    dungeonTheme: "Vestígios de uma escolha cruel",
    dungeonOverview: "Cada setor revela quem foi sacrificado para manter o lugar funcionando e quem ainda lucra com esse silêncio.",
    dungeonRoom: "Sinais recentes mostram que o perigo continua ativo e que alguém será atingido se o grupo simplesmente recuar.",
  },
  whimsical: {
    npcFrame: "uma confusão que ganhou regras próprias",
    npcColor: "cordial, inquieto e cheio de hábitos difíceis de explicar",
    npcMotive: "resolver a trapalhada antes que alguém a transforme em tradição",
    npcPressure: "Cada tentativa de simplificar o problema cria uma exceção ainda mais inconveniente.",
    npcThreat: "uma cadeia de mal-entendidos já mobiliza gente demais",
    locationMood: "Objetos trocam de lugar sem ajuda, placas contradizem umas às outras e os moradores tratam o absurdo como parte da rotina.",
    locationLandmark: "O marco ainda cumpre uma função prática, embora cada morador ofereça uma explicação diferente e igualmente improvável.",
    locationHook: "Os habitantes procuram alguém de fora porque todas as soluções locais já viraram parte do problema.",
    locationPressure: "Duas regras igualmente ridículas entram em vigor ao mesmo tempo e ninguém aceita suspendê-las.",
    locationSecret: "A explicação é simples, porém tão constrangedora que três pessoas preferem sustentar o mistério.",
    questComplication: "O objeto ou a pessoa procurada foi registrado com três nomes diferentes e entregue ao destinatário errado.",
    questReward: "Além do pagamento, o grupo recebe um favor surpreendentemente útil de alguém improvável.",
    questContext: "A missão começou como uma tarefa banal e cresceu porque cada participante tentou corrigir o erro sem consultar os demais.",
    questOpposition: "A oposição explora a confusão entre registros, ordens e responsabilidades para continuar agindo sem assumir a culpa.",
    questEscalation: "Novos curiosos chegam, repetem instruções incompletas e transformam o problema em espetáculo público.",
    questFailure: "Se ninguém intervier, a solução improvisada será oficializada e passará a ser aplicada a todos.",
    questAlternative: "O impasse pode terminar com uma demonstração pública que exponha a contradição sem humilhar seus responsáveis.",
    encounterPressure: "A solução que parece mais óbvia cria um segundo problema sempre que alguém a executa sem coordenar os presentes.",
    encounterTwist: "A aparente confusão resulta de várias decisões compreensíveis tomadas sem que seus responsáveis conversassem entre si.",
    encounterChoice: "O grupo pode restaurar a ordem anterior ou aproveitar a confusão para criar uma solução melhor.",
    encounterEscalation: "Cada intervenção bem-intencionada cria um novo obstáculo até que os presentes coordenem suas ações.",
    encounterAftermath: "A história será contada por anos, embora ninguém concorde sobre quem realmente resolveu a situação.",
    rumorClaim: "A versão mais popular acrescenta um detalhe impossível porque ele torna a história muito melhor.",
    rumorTruth: "O acontecimento central é real; a explicação envolve erros acumulados e interesses menores, não a grande conspiração descrita nas versões populares.",
    rumorInterested: "Artistas, comerciantes e autoridades disputam o direito de apresentar a versão oficial.",
    rumorConsequence: "Investigar encerra a confusão, mas também destrói uma oportunidade lucrativa para parte da comunidade.",
    rumorContext: "O boato circula em canções, desenhos apressados e apostas sobre qual será o próximo acontecimento absurdo.",
    dungeonTheme: "Engrenagens de um erro magnífico",
    dungeonOverview: "O complexo foi adaptado tantas vezes que cada solução engenhosa interfere em outra sala de maneira inesperada.",
    dungeonRoom: "O perigo é evidente o bastante para ser levado a sério, embora seu funcionamento revele uma lógica deliciosamente equivocada.",
  },
  heroic: {
    npcFrame: "uma oportunidade concreta de proteger a região",
    npcColor: "franco, disciplinado e disposto a dividir responsabilidades",
    npcMotive: "garantir que outras pessoas possam escolher o próprio futuro",
    npcPressure: "A comunidade precisa de um exemplo de coragem que não dependa de sacrifícios inúteis.",
    npcThreat: "uma força organizada avança sobre quem não consegue se defender",
    locationMood: "Bandeiras remendadas continuam erguidas, e os moradores transformam cada espaço disponível em abrigo, oficina ou posto de vigia.",
    locationLandmark: "Sinais de reparos sucessivos mostram que muitas pessoas contribuíram para manter o marco de pé.",
    locationHook: "Os habitantes sabem o que precisa ser feito, mas não têm gente suficiente para agir em todas as frentes.",
    locationPressure: "Duas medidas necessárias competem pelos mesmos recursos e exigem uma decisão transparente.",
    locationSecret: "Os registros públicos omitiram a contribuição de pessoas cuja participação ainda pode alterar a disputa atual.",
    questComplication: "A missão exige proteger também quem se opôs ao contratante e agora está preso na mesma ameaça.",
    questReward: "A recompensa fortalece a comunidade e concede ao grupo apoio para uma causa futura.",
    questContext: "O pedido oferece uma chance real de proteger a região e provar que a cooperação continua possível sob pressão.",
    questOpposition: "A oposição controla recursos e informação, mas perde apoio sempre que o grupo protege alguém sem exigir lealdade.",
    questEscalation: "A ameaça concentra forças contra o ponto mais vulnerável e obriga os aliados a coordenar suas ações.",
    questFailure: "Se o grupo falhar, a região continuará reagindo, porém com menos recursos, coordenação e confiança.",
    questAlternative: "Unir grupos rivais em torno de uma ação comum pode alcançar o objetivo sem uma vitória militar.",
    encounterPressure: "Pessoas vulneráveis estão no caminho da ameaça e precisam de uma rota segura agora.",
    encounterTwist: "Uma pessoa ligada à oposição tenta proteger inocentes, mesmo que isso signifique desobedecer aos próprios aliados.",
    encounterChoice: "O grupo decide entre conter a ameaça, conduzir a evacuação ou conquistar um aliado importante.",
    encounterEscalation: "A oposição testa as defesas em vários pontos e tenta separar quem trabalha em conjunto.",
    encounterAftermath: "O resultado se torna exemplo para outras comunidades, que passam a esperar uma posição clara do grupo.",
    rumorClaim: "A história é repetida como prova de que a região ainda consegue enfrentar seus perigos quando age em conjunto.",
    rumorTruth: "A parte verificável do relato oferece uma vantagem concreta a quem compartilhar informações e coordenar esforços.",
    rumorInterested: "Lideranças rivais desejam associar seus nomes ao acontecimento e controlar o que ele inspira.",
    rumorConsequence: "A investigação revela aliados esquecidos e oferece à comunidade uma forma mais honesta de organizar a próxima ação.",
    rumorContext: "O boato circula entre vigias, mensageiros e famílias que procuram razões para continuar resistindo.",
    dungeonTheme: "Provas deixadas por quem resistiu",
    dungeonOverview: "As salas preservam recursos, rotas e decisões de pessoas que defenderam o lugar sem esperar resgate.",
    dungeonRoom: "Cada obstáculo pode ser vencido pela cooperação e oferece uma vantagem concreta para quem protege os demais.",
  },
  mysterious: {
    npcFrame: "um padrão que aparece em acontecimentos separados",
    npcColor: "reservado, preciso e atento a detalhes que os outros ignoram",
    npcMotive: "compreender o padrão antes que sua última etapa se complete",
    npcPressure: "Toda resposta elimina uma hipótese e torna as possibilidades restantes mais inquietantes.",
    npcThreat: "uma presença que se comunica por sinais e coincidências",
    locationMood: "Sons chegam de direções erradas, sombras repetem movimentos antigos e pequenos detalhes mudam quando deixam de ser observados.",
    locationLandmark: "Um detalhe repetido no marco parece ornamental até ser comparado com sinais encontrados em outros pontos do lugar.",
    locationHook: "Os moradores procuram alguém sem ligação com as disputas locais para interpretar sinais que todos já aprenderam a temer.",
    locationPressure: "Cada grupo possui uma parte da explicação e protege o próprio fragmento como se fosse a verdade inteira.",
    locationSecret: "A evidência aponta para alguém de fora do lugar e conecta o problema atual a acontecimentos tratados como isolados.",
    questComplication: "A prova confirma o objetivo da missão, mas contradiz tudo o que o contratante afirmou sobre sua origem.",
    questReward: "A recompensa inclui acesso a um arquivo, uma rota ou um nome que responde a outra pergunta importante.",
    questContext: "O pedido nasce de uma sequência de coincidências que deixa de parecer acidental quando colocada na ordem correta.",
    questOpposition: "A oposição apaga conexões, troca registros e age apenas quando pode fazer cada incidente parecer isolado.",
    questEscalation: "Um novo sinal surge a cada atraso e demonstra que o padrão está se aproximando de sua conclusão.",
    questFailure: "Se o grupo falhar, a verdade permanecerá oculta e o próximo acontecimento parecerá não ter relação com os anteriores.",
    questAlternative: "Uma solução indireta pode usar a rotina da oposição para fazê-la revelar o que tenta esconder.",
    encounterPressure: "Alguém parece antecipar os movimentos do grupo porque observa sinais que os demais ainda não relacionaram.",
    encounterTwist: "O que parecia uma ação deliberada é uma reação repetida a um detalhe presente na cena.",
    encounterChoice: "O grupo decide entre interromper o fenômeno, segui-lo até a origem ou permitir que ele complete uma etapa.",
    encounterEscalation: "Detalhes desconexos passam a se repetir até formarem uma instrução reconhecível.",
    encounterAftermath: "O acontecimento termina sem explicação completa e deixa uma pista precisa para quem decidir continuar.",
    rumorClaim: "As versões divergem nos nomes e motivos, mas repetem a mesma sequência de imagens.",
    rumorTruth: "Detalhes incompatíveis vieram de testemunhas que observaram partes diferentes do mesmo processo.",
    rumorInterested: "Estudiosos e agentes discretos procuram os relatos originais antes que sejam comparados.",
    rumorConsequence: "A investigação revela uma conexão verdadeira e faz com que a força por trás dela perceba o grupo.",
    rumorContext: "A história aparece em margens de livros, conversas interrompidas e desenhos feitos por pessoas que nunca se encontraram.",
    dungeonTheme: "O desenho oculto entre as salas",
    dungeonOverview: "Posições, inscrições e trajetos repetem uma sequência cuja finalidade só aparece quando o complexo é observado como um todo.",
    dungeonRoom: "O detalhe mais importante não está escondido; ele apenas parece comum até ser comparado com o que surgiu nas salas anteriores.",
  },
};
