import {
  DUNGEON_ROOM_ROLES,
  type DungeonRoomRole,
  type EnvironmentId,
} from "../../types";

export type DungeonRoomDescriptions = Readonly<Record<DungeonRoomRole, string>>;

interface LocationWriting {
  type: string;
  landmark: string;
  history: string;
  conflict: string;
  danger: string;
  secret: string;
  opportunities: string;
  hook: string;
}

interface QuestWriting {
  title: string;
  giver: string;
  objective: string;
  complication: string;
  context: string;
  stages: string;
  opposition: string;
  escalation: string;
  failure: string;
  alternative: string;
  reward: string;
}

interface EncounterWriting {
  title: string;
  situation: string;
  threat: string;
  twist: string;
  choice: string;
  setup: string;
  actors: string;
  escalation: string;
  interaction: string;
  outcomes: string;
  aftermath: string;
}

interface RumorWriting {
  subject: string;
  claim: string;
  truth: string;
  source: string;
  variations: string;
  clues: string;
  interested: string;
  consequence: string;
  context: string;
}

interface DungeonWriting {
  name: string;
  overview: string;
  rooms: DungeonRoomDescriptions;
}

export interface EnvironmentWritingProfile {
  name: string;
  setting: string;
  texture: string;
  inhabitants: string;
  regionNoun: string;
  npcRole: string;
  npcCompanion: string;
  location: LocationWriting;
  quest: QuestWriting;
  encounter: EncounterWriting;
  rumor: RumorWriting;
  dungeon: DungeonWriting;
}

export const ROOM_DEVELOPMENT: DungeonRoomDescriptions = {
  Entrada: "A entrada informa o risco antes de cobrá-lo. Pistas visíveis permitem preparar a travessia, enquanto sinais de passagem recente mostram que o complexo reage a visitantes.",
  Exploração: "Três detalhes podem ser examinados sem perigo imediato. Cada um revela uma informação útil sobre os ocupantes, as rotas disponíveis ou o propósito original do lugar.",
  Desafio: "O obstáculo possui causa, sinais e mais de uma solução. Força bruta funciona, mas altera o ambiente e cria uma consequência que será percebida nas salas seguintes.",
  Encruzilhada: "As rotas anunciam diferenças concretas por meio de sons, correntes de ar e rastros. Uma oferece rapidez; outra oferece informação; a terceira evita uma ameaça conhecida.",
  Segredo: "A passagem oculta pode ser descoberta por observação, não por adivinhação. Seu conteúdo explica uma parte do complexo e concede uma vantagem para um conflito posterior.",
  Armadilha: "O mecanismo protege algo específico e apresenta indícios antes de disparar. Desarmá-lo, contorná-lo ou acioná-lo de propósito produz benefícios e riscos diferentes.",
  Refúgio: "O espaço permite descansar, conversar e reorganizar recursos. Vestígios de ocupação recente, porém, indicam que o abrigo não permanecerá seguro por muito tempo.",
  Contratempo: "Uma mudança física altera a rota de retorno sem apagar o progresso. O grupo precisa escolher entre gastar recursos, revelar sua presença ou aceitar um caminho desconhecido.",
  Encontro: "Os presentes têm objetivo, receio e algo que podem oferecer. Eles não começam hostis, mas respondem rapidamente a ameaças, mentiras e demonstrações de respeito.",
  Revelação: "Evidências de salas anteriores se unem numa explicação clara. A descoberta muda o objetivo imediato e aponta pelo menos duas maneiras de agir antes do confronto.",
  Confronto: "A oposição usa o terreno, protege algo importante e aceita condições além da rendição total. Interromper seu plano é urgente; decidir o destino dos envolvidos continua aberto.",
  Recompensa: "O prêmio é identificável, útil e ligado à história do complexo. Levá-lo resolve uma necessidade imediata, mas chama a atenção de alguém que conhece seu verdadeiro valor.",
};

function completeRooms(rooms: DungeonRoomDescriptions): DungeonRoomDescriptions {
  for (const role of DUNGEON_ROOM_ROLES) {
    if (!rooms[role].trim()) throw new Error(`Descrição ausente para ${role}`);
  }
  return rooms;
}

export const ENVIRONMENT_WRITING: Readonly<Record<EnvironmentId, EnvironmentWritingProfile>> = {
  wilderness: {
    name: "Marco do Horizonte Partido",
    setting: "pelas terras abertas, entre chapadas, brejos e campos varridos pelo vento",
    texture: "O vento dobra o capim em ondas, carrega poeira avermelhada e apaga pegadas rasas antes do meio-dia.",
    inhabitants: "Pastores sazonais, batedores, curandeiras itinerantes e pequenas comunidades conhecem os poucos pontos de água.",
    regionNoun: "as terras abertas",
    npcRole: "guia que lê mudanças no tempo e conhece as rotas entre os poços",
    npcCompanion: "uma montaria resistente, treinada para encontrar água e permanecer imóvel durante tempestades",
    location: {
      type: "Entreposto de pedra construído ao redor de um poço profundo e de três caminhos de caravana.",
      landmark: "Duas colunas inclinadas sustentam placas de bronze que giram com o vento e apontam rotas diferentes conforme a estação.",
      history: "O entreposto surgiu depois que viajantes de comunidades rivais cavaram o poço juntos durante uma seca de sete meses.",
      conflict: "Os pastores desejam reservar a água para os rebanhos; os condutores de caravana afirmam que o antigo acordo garante passagem livre.",
      danger: "Uma frente de poeira aproxima-se pelo oeste. Ela encobre ravinas, assusta animais e reduz a orientação a poucos passos.",
      secret: "Sob a borda do poço, marcas de medição provam que alguém retirou água durante as noites em que o acesso deveria estar fechado.",
      opportunities: "O lugar oferece água limpa, animais descansados, notícias de três rotas e um mirante capaz de revelar movimentos a quilômetros de distância.",
      hook: "Uma criança encontrou no fundo de um balde um medalhão pertencente a uma caravana desaparecida no mês anterior.",
    },
    quest: {
      title: "A Caravana Antes da Tempestade",
      giver: "a responsável pelo poço comunitário, eleita por famílias de três rotas",
      objective: "encontrar a caravana desaparecida e recuperar seu registro de carga antes da chegada da tempestade",
      complication: "As marcas deixadas pela caravana se dividem junto a uma ravina, como se parte dos viajantes tivesse seguido sob coerção.",
      context: "A carga inclui remédios e ferramentas prometidos a comunidades que já consumiram suas reservas.",
      stages: "Confirmar a última parada da caravana; atravessar a rota antes que a poeira apague os sinais; localizar sobreviventes e decidir como transportar a carga restante.",
      opposition: "Um grupo de cobradores controla o desfiladeiro e afirma possuir um contrato que lhe dá direito sobre toda a carga.",
      escalation: "A tempestade fecha primeiro a rota curta, depois alcança os pontos de água e por fim impede qualquer viagem sem abrigo.",
      failure: "Duas comunidades ficam sem remédios, e os cobradores passam a controlar o único caminho seguro durante a estação.",
      alternative: "O grupo pode comprovar a fraude no contrato e reunir testemunhas das caravanas, evitando uma disputa pela força.",
      reward: "Provisões para uma longa viagem, direito de usar os poços comunitários e um mapa atualizado das rotas sazonais.",
    },
    encounter: {
      title: "O Círculo dos Carros",
      situation: "Três carroças formam uma barreira ao redor de famílias e animais exaustos. Batedores armados observam a poeira que cresce no horizonte.",
      threat: "Uma manada assustada corre na direção do abrigo e pode destruir as carroças antes que a tempestade chegue.",
      twist: "Os batedores provocaram a debandada para afastar predadores, mas calcularam mal a direção do vento.",
      choice: "O grupo pode desviar a manada, reforçar o círculo ou conduzir as famílias até uma formação rochosa que talvez já esteja ocupada.",
      setup: "Cordas vibram, animais puxam arreios e uma faixa escura cobre metade do céu. Há poucos minutos para preparar qualquer solução.",
      actors: "Condutores de caravana protegem crianças e carga; dois batedores escondem sua responsabilidade; pastores procuram animais perdidos.",
      escalation: "A primeira fileira da manada atravessa o acampamento quando as rajadas mais fortes tornam gritos e sinais difíceis de perceber.",
      interaction: "Valas rasas, lonas, sinos, fogo controlado e o próprio formato das carroças podem redirecionar animais ou criar uma passagem segura.",
      outcomes: "Salvar a carga conquista a gratidão dos condutores. Priorizar as pessoas evita feridos, mas deixa recursos valiosos espalhados pelo campo.",
      aftermath: "Quando a poeira baixa, pegadas de uma criatura solitária aparecem entre as marcas da manada e seguem na direção oposta.",
    },
    rumor: {
      subject: "As luzes do Poço Sem Lua",
      claim: "Dizem que luzes azuis percorrem os campos durante a madrugada e param sobre poços cuja água desaparecerá antes do amanhecer.",
      truth: "As luzes vêm de lanternas cobertas usadas por ladrões de água. O grupo marca os poços escolhidos com sais que brilham quando recebem orvalho.",
      source: "Uma pastora viu as luzes de uma elevação distante e encontrou o reservatório de sua família quase vazio no dia seguinte.",
      variations: "Alguns juram que as luzes caminham sozinhas; outros afirmam ouvir rodas, vozes abafadas ou o choro de animais sedentos.",
      clues: "Sulcos estreitos de carroça, gotas de cera azul e marcas recentes de corda aparecem junto aos poços afetados.",
      interested: "Famílias sem água querem respostas, enquanto comerciantes que lucram com a escassez pagam para ridicularizar o relato.",
      consequence: "Seguir as luzes revela o depósito clandestino, mas deixa os demais poços sem vigilância durante uma noite.",
      context: "A história se espalhou entre acampamentos depois que três reservatórios secaram apesar de não apresentarem rachaduras.",
    },
    dungeon: {
      name: "Santuário sob o Vento",
      overview: "Um observatório semienterrado liga cisternas, túneis de manutenção e câmaras usadas para registrar tempestades. Saqueadores procuram o mecanismo que localiza água subterrânea.",
      rooms: completeRooms({
        Entrada: "Três monólitos cercam uma escadaria tomada pela areia. Ranhuras no chão revelam onde placas de pedra deslizam quando o vento sopra do oeste.",
        Exploração: "Mapas de couro ressecado pendem de cilindros giratórios. Furos, manchas de sal e pequenas pedras coloridas registram poços que não aparecem em mapas atuais.",
        Desafio: "Uma ponte estreita cruza uma cisterna vazia, enquanto contrapesos rangem nas paredes. Redistribuir o peso estabiliza a travessia e abre o acesso inferior.",
        Encruzilhada: "Três túneis recebem correntes de ar distintas: um traz cheiro de chuva, outro carrega vozes e o terceiro sopra areia marcada por pegadas recentes.",
        Segredo: "Uma pedra do mapa central pode ser pressionada e revela um nicho com registros de nascentes. A última anotação indica um poço deliberadamente selado.",
        Armadilha: "Placas de pressão liberam areia de reservatórios no teto. Pequenos montes junto às juntas e riscos de pá tornam o mecanismo visível antes do disparo.",
        Refúgio: "Uma sala de vigia conserva bancos, mantas e um jarro vedado. A abertura superior oferece visão da entrada e mostra sinais de uma tempestade próxima.",
        Contratempo: "Uma rajada move as placas externas e bloqueia o caminho conhecido. Um duto de manutenção continua aberto, mas desce para uma área parcialmente inundada.",
        Encontro: "Dois saqueadores feridos defendem um carrinho de registros. Eles perderam companheiros adiante e trocam informações por água, luz ou passagem segura.",
        Revelação: "O mecanismo central não prevê tempestades; ele mede a retirada de água subterrânea. Os registros mostram que a escassez atual foi provocada por extração deliberada.",
        Confronto: "A líder dos saqueadores opera uma bomba antiga numa câmara circular. Fechar as válvulas salva o aquífero, mas pode romper os condutos sob seus aliados.",
        Recompensa: "Um astrolábio de bronze localiza água pela vibração de sua agulha. O estojo também contém os nomes de quem financiou a extração clandestina.",
      }),
    },
  },
  forest: {
    name: "Clareira do Sino Verde",
    setting: "na mata antiga, sob copas espessas e trilhas que mudam com a chuva",
    texture: "Folhas molhadas abafam passos, raízes atravessam o caminho e gotas pesadas caem muito depois de a chuva terminar.",
    inhabitants: "Coletores de resina, guardiões de trilha, lenhadores, eremitas e animais territoriais dividem a mata.",
    regionNoun: "a floresta",
    npcRole: "batedor que reconhece árvores feridas, rastros recentes e mudanças nas trilhas",
    npcCompanion: "uma ave de plumagem escura, capaz de imitar assobios usados pelos guardiões da mata",
    location: {
      type: "Clareira comunitária formada ao redor de uma árvore oca onde viajantes deixam mensagens e oferendas.",
      landmark: "Um sino coberto por trepadeiras pende dentro do tronco. Seu som muda conforme a direção de onde alguém se aproxima.",
      history: "A clareira marcou durante gerações o limite entre áreas de coleta, caça e preservação acordadas por comunidades vizinhas.",
      conflict: "Novas árvores marcadas para corte aparecem além do limite permitido, e cada grupo acusa o outro de avançar durante a noite.",
      danger: "Uma doença escurece as folhas mais altas e atrai insetos agressivos para as árvores saudáveis.",
      secret: "As marcas de corte foram feitas por ferramentas diferentes das usadas pelas comunidades locais e seguem um desenho visto do alto.",
      opportunities: "Ervas medicinais, resina valiosa, abrigo elevado e três trilhas pouco conhecidas ficam acessíveis a quem conquistar a confiança dos guardiões.",
      hook: "O sino tocou sozinho durante três noites, sempre pouco antes de uma nova árvore adoecer.",
    },
    quest: {
      title: "A Doença da Nascente",
      giver: "uma guardiã de trilha que representa coletores e famílias instaladas na orla da mata",
      objective: "localizar a origem da doença das árvores e impedir que alcance a nascente central",
      complication: "A única amostra intacta está numa área que os guardiões fecharam depois do desaparecimento de dois exploradores.",
      context: "A floresta fornece água, alimento e remédios para várias comunidades; queimá-la ou abandoná-la não é uma opção aceitável.",
      stages: "Comparar as primeiras árvores afetadas; seguir insetos e marcas de ferramenta; alcançar a origem da contaminação e decidir como isolá-la.",
      opposition: "Coletores clandestinos espalham a doença para enfraquecer árvores antigas e retirar uma resina rara sem resistência.",
      escalation: "A cada dia, os insetos alcançam uma nova trilha e obrigam famílias a abandonar postos de coleta.",
      failure: "A nascente fica contaminada, os animais migram e comunidades rivais iniciam uma disputa pelas áreas ainda saudáveis.",
      alternative: "Expor os compradores da resina e oferecer proteção aos trabalhadores pode desmontar a operação sem destruir seus acampamentos.",
      reward: "Remédios preparados pelos coletores, acesso às trilhas protegidas e sementes capazes de purificar solo contaminado.",
    },
    encounter: {
      title: "A Árvore que Caminha",
      situation: "Lenhadores cercam uma árvore jovem cujas raízes se arrancaram do solo. Guardiões exigem que ninguém se aproxime.",
      threat: "A árvore avança de forma desajeitada em direção a um acampamento, derrubando troncos e assustando animais pelo caminho.",
      twist: "Uma criatura pequena está presa entre as raízes e guia o movimento na tentativa de voltar à nascente.",
      choice: "O grupo pode imobilizar a árvore, abrir caminho até a nascente ou convencer os presentes a ajudar numa operação que todos consideram perigosa.",
      setup: "Galhos estalam acima das tendas, raízes grossas levantam terra úmida e pássaros abandonam a área em bandos.",
      actors: "Lenhadores querem proteger o acampamento; guardiões desejam preservar a árvore; a criatura presa reage a vozes calmas e luz suave.",
      escalation: "Fogo acidental alcança a vegetação seca quando alguém tenta assustar a árvore com uma tocha.",
      interaction: "Cordas presas a troncos, canais de água, música, terreno inclinado e a remoção cuidadosa de raízes podem alterar o percurso.",
      outcomes: "Levar a árvore à nascente conquista aliados entre os guardiões. Derrubá-la salva o acampamento, mas revela a criatura ferida diante de todos.",
      aftermath: "No local onde a árvore estava, surge uma cavidade com ferramentas recentes e frascos usados para tratar madeira clandestinamente.",
    },
    rumor: {
      subject: "O coro sob as raízes",
      claim: "Caçadores afirmam que vozes chamam pessoas pelo nome sob as árvores mais antigas e oferecem caminhos que não existiam no dia anterior.",
      truth: "Tubos de madeira enterrados conectam antigos postos de vigia. Alguém voltou a usá-los para conduzir viajantes longe de uma área proibida.",
      source: "Uma coletora ouviu a voz de sua irmã falecida e seguiu as instruções até encontrar uma trilha recém-bloqueada.",
      variations: "Alguns ouvem parentes mortos; outros escutam a própria voz ou assobios conhecidos apenas pelos guardiões.",
      clues: "Pequenos furos nos troncos, resina removida recentemente e cordões de fibra ligam árvores distantes.",
      interested: "Guardiões temem que a rede seja profanada; contrabandistas querem preservar o medo que mantém curiosos afastados.",
      consequence: "Seguir a rede revela quem transmite as mensagens e conduz o grupo até a área que todos tentam esconder.",
      context: "O boato reapareceu quando trilhas seguras começaram a terminar diante de barreiras construídas durante a noite.",
    },
    dungeon: {
      name: "Raízes do Sino Verde",
      overview: "Galerias sob a árvore central ligam santuários de sementes, canais de água e postos de vigia. Fungos invasores avançam por passagens abertas por coletores clandestinos.",
      rooms: completeRooms({
        Entrada: "Uma fenda entre raízes desce até uma porta de madeira viva. Cortes recentes mostram onde cunhas foram usadas sem despertar os espinhos da moldura.",
        Exploração: "Prateleiras de barro guardam sementes rotuladas por estação e altitude. Algumas gavetas estão vazias, e pegadas cobertas de pólen seguem para o leste.",
        Desafio: "Raízes entrelaçadas bloqueiam um canal e acumulam água escura. Soltar a pressão abre a passagem, mas exige direcionar a corrente para outra galeria.",
        Encruzilhada: "Três túneis separam-se ao redor de uma árvore subterrânea. Um recebe luz, outro carrega água limpa e o terceiro exala o cheiro doce dos fungos.",
        Segredo: "Um padrão de folhas gravado na parede indica uma porta flexível. Atrás dela, registros ligam cada semente guardada a uma comunidade da região.",
        Armadilha: "Vagens pendentes liberam pólen entorpecente quando galhos baixos são tocados. Insetos adormecidos no chão revelam o alcance do mecanismo natural.",
        Refúgio: "Uma plataforma seca possui redes, ervas e recipientes de água filtrada. Alguém esteve aqui recentemente e deixou uma mensagem sob uma tigela.",
        Contratempo: "Uma raiz rompe o piso e separa a passagem em dois níveis. O desvio superior é exposto; o inferior atravessa água onde algo grande se move.",
        Encontro: "Três coletores cercados por fungos pedem ajuda para retirar caixas roubadas. Eles discordam sobre abandonar a carga ou queimar a galeria.",
        Revelação: "As caixas contêm sementes tratadas com o mesmo fungo que adoece a floresta. Os rótulos mostram que a contaminação foi planejada para se espalhar.",
        Confronto: "A responsável pela operação prepara a abertura do reservatório de esporos. Ela ameaça contaminar as sementes restantes se não receber passagem livre.",
        Recompensa: "Um estojo vivo preserva sementes em qualquer clima e indica quando o solo é seguro. Dentro dele há contratos assinados pelos compradores da resina.",
      }),
    },
  },
  city: {
    name: "Pátio das Sete Janelas",
    setting: "entre ruas populosas, oficinas apertadas e passagens mantidas fora dos mapas oficiais",
    texture: "Pregões, martelos e rodas de carroça se misturam ao cheiro de pão, tinta, chuva sobre pedra e canais mal cobertos.",
    inhabitants: "Artesãos, carregadores, comerciantes, mensageiros, guardas e famílias antigas disputam espaço e influência.",
    regionNoun: "a cidade",
    npcRole: "mensageiro que conhece atalhos, horários de patrulha e relações entre os bairros",
    npcCompanion: "um cão pequeno treinado para levar bilhetes por passagens onde uma pessoa não conseguiria entrar",
    location: {
      type: "Pátio comercial cercado por prédios estreitos, balcões de oficina e sete janelas que pertencem a famílias rivais.",
      landmark: "Um relógio público sem ponteiros abre pequenas portinholas em horários conhecidos apenas pelos moradores mais antigos.",
      history: "O pátio nasceu sobre um mercado coberto destruído por incêndio e conserva acessos para depósitos que nunca foram registrados.",
      conflict: "Uma reforma ameaça expulsar oficinas e famílias, enquanto o consórcio responsável afirma que a estrutura corre risco de desabar.",
      danger: "Vigas cedem sob os prédios do lado norte, e qualquer tumulto pode bloquear as duas saídas mais largas.",
      secret: "Os laudos de risco foram alterados para incluir edifícios seguros e excluir um depósito pertencente ao consórcio.",
      opportunities: "O pátio oferece contatos em vários ofícios, acesso aos telhados, passagens subterrâneas e notícias que ainda não chegaram às autoridades.",
      hook: "Uma das sete janelas acende todas as noites num prédio oficialmente vazio, e mensageiros deixam pacotes no parapeito.",
    },
    quest: {
      title: "Os Laudos das Sete Janelas",
      giver: "uma representante das oficinas, escolhida numa assembleia que o consórcio se recusa a reconhecer",
      objective: "obter os laudos originais da reforma e apresentá-los antes da votação do conselho",
      complication: "Os documentos estão divididos entre um arquivo municipal e o escritório particular do engenheiro responsável.",
      context: "A reforma pode melhorar a segurança do bairro, mas o projeto atual transfere propriedades públicas para investidores ligados ao conselho.",
      stages: "Identificar quem alterou os registros; recuperar as duas partes do laudo; reunir testemunhas e apresentar a prova durante a sessão pública.",
      opposition: "Agentes do consórcio compram silêncio, espalham avisos falsos de interdição e usam guardas privados para controlar os acessos.",
      escalation: "Novos despejos começam ao amanhecer, e cada oficina vazia permite que o consórcio feche outra passagem do pátio.",
      failure: "As famílias perdem suas casas, as passagens subterrâneas são seladas e o consórcio assume o comércio do bairro.",
      alternative: "Provar que o depósito do consórcio é o ponto mais instável pode suspender toda a reforma até uma inspeção independente.",
      reward: "Serviços gratuitos de artesãos, abrigo seguro no bairro e acesso à rede de mensageiros das sete janelas.",
    },
    encounter: {
      title: "A Procissão Interrompida",
      situation: "Uma procissão ocupa a rua principal quando guardas fecham o portão adiante. Carregadores com uma maca não conseguem retornar.",
      threat: "A multidão comprime pessoas contra barracas e paredes, enquanto um cavalo assustado tenta romper a linha dos guardas.",
      twist: "A pessoa levada na maca transporta provas contra o oficial que ordenou o bloqueio e finge estar inconsciente.",
      choice: "O grupo pode abrir espaço para a maca, negociar a abertura do portão ou conduzir a multidão por uma passagem que atravessa propriedade privada.",
      setup: "Sinos, cantos e ordens contraditórias impedem que os presentes compreendam o que acontece a poucos metros.",
      actors: "Devotos querem concluir a procissão; guardas temem perder o controle; comerciantes protegem suas lojas; os carregadores procuram uma saída discreta.",
      escalation: "Alguém lança uma pedra, o cavalo derruba uma barraca e os guardas interpretam o acidente como início de uma revolta.",
      interaction: "Balcões, toldos, sinos, carroças e acessos aos telhados permitem criar rotas, sinais visíveis ou barreiras temporárias.",
      outcomes: "Evitar o confronto mantém o bairro aberto. Forçar a passagem salva a prova, mas permite que o oficial justifique novas patrulhas.",
      aftermath: "Entre os objetos caídos surge um selo municipal ligado a documentos que deveriam estar guardados no arquivo central.",
    },
    rumor: {
      subject: "A oitava janela",
      claim: "Moradores juram que uma oitava janela aparece em paredes diferentes depois da meia-noite e recebe cartas destinadas a pessoas desaparecidas.",
      truth: "A janela é uma moldura portátil usada por mensageiros clandestinos para marcar pontos de coleta sem revelar a rede completa.",
      source: "Um aprendiz entregou uma carta no local indicado e, na manhã seguinte, encontrou apenas uma parede recém-pintada.",
      variations: "Alguns dizem que a janela muda de bairro; outros afirmam que ela surge apenas para quem escreveu um nome proibido.",
      clues: "Resíduos da mesma tinta, marcas de ganchos e envelopes dobrados de maneira idêntica aparecem nos locais citados.",
      interested: "Famílias procuram notícias dos desaparecidos; autoridades desejam localizar a rede; chantagistas tentam inserir mensagens falsas.",
      consequence: "Acompanhar uma coleta revela um arquivo de correspondências e expõe um mensageiro que protege várias testemunhas.",
      context: "O boato cresceu quando cartas sem destinatário começaram a receber respostas com informações que somente os desaparecidos conheciam.",
    },
    dungeon: {
      name: "Galerias da Oitava Janela",
      overview: "Depósitos, cisternas e corredores de serviço formam uma rede sob o bairro antigo. Mensageiros clandestinos e agentes do consórcio disputam arquivos escondidos.",
      rooms: completeRooms({
        Entrada: "Uma escada sob uma oficina termina diante de um portão de ferro sem fechadura. Marcas de tinta nas barras indicam quais peças giram em conjunto.",
        Exploração: "Nichos numerados guardam caixas de entrega, ferramentas e bilhetes sem assinatura. Um mapa de turnos mostra quando cada acesso fica sem vigilância.",
        Desafio: "Um elevador de carga parou entre dois níveis e bloqueia o corredor. Correntes, contrapesos e uma escada lateral permitem soluções com riscos diferentes.",
        Encruzilhada: "Três galerias seguem sob bairros distintos. Cheiro de tinta vem da esquerda, vozes ecoam adiante e água de chuva corre pela passagem mais baixa.",
        Segredo: "A parede atrás de um armário conserva a planta original do mercado. Uma anotação revela salas apagadas dos registros depois do incêndio.",
        Armadilha: "Fios presos a sinos percorrem a altura dos tornozelos e alertam postos distantes. Poeira limpa ao redor das âncoras denuncia o sistema.",
        Refúgio: "Uma antiga sala de descanso contém mesa, fogareiro e rotas de fuga anotadas. Canecas ainda úmidas mostram que os mensageiros voltam com frequência.",
        Contratempo: "Água de chuva invade a galeria inferior e arrasta caixas contra as grades. O caminho seco passa por um depósito ocupado por guardas privados.",
        Encontro: "Mensageiros armados protegem uma testemunha e confundem o grupo com agentes do consórcio. Eles aceitam verificar nomes, selos e histórias.",
        Revelação: "Os arquivos provam que o consórcio financiou os dois lados de conflitos recentes. A reforma serve para destruir as últimas cópias dos contratos.",
        Confronto: "O engenheiro responsável prepara fogo numa câmara de documentos. Ele oferece os laudos originais em troca de passagem e proteção contra seus empregadores.",
        Recompensa: "Um livro-caixa codificado registra pagamentos, propriedades e identidades falsas. Sua capa contém a chave para abrir cofres de correspondência pela cidade.",
      }),
    },
  },
  coast: {
    name: "Cais da Maré de Vidro",
    setting: "ao longo do litoral, entre falésias, enseadas, ilhas rasas e construções castigadas pelo sal",
    texture: "Cordas molhadas rangem, gaivotas disputam restos e ondas batem sob as tábuas com força crescente.",
    inhabitants: "Pescadores, barqueiros, mergulhadores, faroleiros e comerciantes acompanham ventos e marés antes de tomar decisões.",
    regionNoun: "o litoral",
    npcRole: "piloto que conhece bancos de areia, correntes traiçoeiras e sinais de tempestade",
    npcCompanion: "uma lontra treinada para recuperar cabos, chaves e pequenos objetos levados pela água",
    location: {
      type: "Cais protegido por quebra-mares antigos, armazéns de sal e um farol construído sobre a rocha.",
      landmark: "Uma lente verde no topo do farol projeta linhas sobre a água quando a maré alcança o ponto mais baixo.",
      history: "O cais foi fundado por famílias que resgataram juntas os sobreviventes de um naufrágio e dividiram a carga encontrada.",
      conflict: "Barqueiros querem fechar a enseada por segurança; comerciantes exigem que os navios partam antes que os contratos expirem.",
      danger: "A maré sobe por canais sob o cais e pode isolar armazéns, romper amarras e arrastar pessoas para baixo das plataformas.",
      secret: "Registros de atracação mostram que um navio sem bandeira descarrega caixas durante as noites em que o farol permanece apagado.",
      opportunities: "O cais oferece embarcações rápidas, mapas de correntes, mergulhadores experientes e acesso a cavernas visíveis apenas na maré baixa.",
      hook: "O farol emitiu um sinal proibido, e uma embarcação respondeu de algum ponto além da neblina.",
    },
    quest: {
      title: "O Navio sem Bandeira",
      giver: "a faroleira responsável pelos sinais de navegação e pelos registros de entrada na enseada",
      objective: "alcançar o navio sem bandeira e descobrir por que ele responde a um código usado apenas em naufrágios",
      complication: "A embarcação está presa num banco de areia que desaparecerá sob vários metros de água quando a maré virar.",
      context: "Três barcos de pesca sumiram depois de seguir o mesmo sinal, e as famílias recusam novas buscas sem uma explicação.",
      stages: "Confirmar o código enviado pelo farol; atravessar a neblina antes da mudança da maré; abordar o navio e decidir o destino de sua carga.",
      opposition: "Contrabandistas mantêm tripulantes como reféns e usam falsos pedidos de socorro para afastar patrulhas do cais.",
      escalation: "A maré cobre rotas de retorno, a neblina reduz a visibilidade e uma tempestade empurra o navio contra os recifes.",
      failure: "O navio afunda com provas e reféns, enquanto os contrabandistas continuam usando o sinal para controlar a enseada.",
      alternative: "Responder ao código com uma mensagem falsa pode atrair o comando dos contrabandistas até uma área preparada para negociação.",
      reward: "Direito de passagem nos barcos locais, uma bússola ajustada às correntes e parte legal da carga recuperada.",
    },
    encounter: {
      title: "O Barco sob o Cais",
      situation: "Batidas regulares ecoam sob as plataformas. Pescadores afirmam que vêm de um barco preso nas estacas, mas ninguém consegue vê-lo.",
      threat: "A maré sobe e comprime a embarcação contra a estrutura, ameaçando derrubar parte do cais sobre quem estiver dentro.",
      twist: "Os ocupantes esconderam o barco de propósito porque transportam uma testemunha perseguida pelos guardas do porto.",
      choice: "O grupo pode libertar o barco, entregar os ocupantes ou ganhar tempo enquanto investiga por que a testemunha é procurada.",
      setup: "Água gelada cobre degraus, tábuas se curvam e cada onda desloca o casco alguns centímetros.",
      actors: "Pescadores querem salvar o cais; guardas procuram contrabandistas; os ocupantes protegem uma pessoa que carrega registros do porto.",
      escalation: "Uma amarra se rompe, o barco gira sob a plataforma e guardas fecham as saídas em terra.",
      interaction: "Cabos, guinchos, boias, barcos menores e a abertura controlada de uma seção do cais podem mudar o risco.",
      outcomes: "Salvar todos preserva o cais e expõe os registros. Entregar os ocupantes encerra o perigo imediato, mas a prova desaparece sob custódia.",
      aftermath: "Um compartimento quebrado libera moedas cobertas pelo selo de um navio declarado perdido muitos anos antes.",
    },
    rumor: {
      subject: "O sino debaixo da maré",
      claim: "Nas noites sem vento, um sino toca sob a água e cada badalada anuncia o retorno de um navio que nunca chegou ao porto.",
      truth: "O sino pertence a uma torre submersa e é acionado por correntes alteradas depois que mergulhadores removeram parte de sua estrutura.",
      source: "Uma barqueira contou as badaladas e percebeu que sempre começam pouco antes de caixas clandestinas aparecerem na praia.",
      variations: "Alguns associam cada toque a um naufrágio; outros juram ver luzes movendo-se sob a superfície.",
      clues: "Fragmentos de bronze, cordas novas e marcas de arrasto aparecem na praia após as noites em que o sino toca.",
      interested: "Mergulhadores buscam o restante da torre; contrabandistas usam o som para coordenar entregas; famílias querem respostas sobre navios perdidos.",
      consequence: "Mergulhar até a torre revela a rota das caixas e desperta a atenção de quem vigia o local a partir das falésias.",
      context: "O boato voltou quando uma criança encontrou na praia um sino de mão com o nome de um navio desaparecido.",
    },
    dungeon: {
      name: "Torre sob a Maré",
      overview: "Uma torre inclinada e cavernas conectadas ficam acessíveis durante poucas horas. Contrabandistas removeram suportes antigos e desestabilizaram câmaras cheias de água.",
      rooms: completeRooms({
        Entrada: "Degraus cobertos de cracas descem quando a maré recua. Faixas sem limo indicam até onde a água voltará e quais apoios foram usados recentemente.",
        Exploração: "Uma sala de mapas conserva placas de marfim com linhas de corrente. Peças ausentes correspondem às rotas onde navios desapareceram.",
        Desafio: "Uma galeria inundada separa duas plataformas e recebe ondas por uma fenda. Comportas laterais podem reduzir a corrente ou abrir outra câmara.",
        Encruzilhada: "Três passagens têm níveis de água diferentes. Uma sobe à torre, outra segue vozes abafadas e a terceira revela luzes sob a superfície.",
        Segredo: "Um mosaico de peixes esconde alavancas entre as escamas. A combinação correta abre um depósito seco com registros de antigos faroleiros.",
        Armadilha: "Uma porta estanque libera água quando aberta sem equalizar a pressão. Gotas nas juntas e uma roda travada anunciam o perigo.",
        Refúgio: "Uma bolsa de ar permanece numa câmara alta com bancos de pedra e velas recentes. Marcas na parede contam o tempo seguro até a maré.",
        Contratempo: "A água cobre a escada de retorno antes do previsto. Uma abertura na parede conduz para cima, mas exige abandonar equipamentos volumosos.",
        Encontro: "Mergulhadores rivais protegem um companheiro ferido e um sino retirado da torre. Eles negociam remédios, informação e ajuda para sair.",
        Revelação: "Os mapas mostram que os naufrágios ocorreram após alterações deliberadas nos sinais do farol. A torre servia para conferir códigos, não para produzi-los.",
        Confronto: "A chefe dos contrabandistas tenta desprender a lente central enquanto a câmara alaga. Ela possui reféns e conhece a única saída ainda seca.",
        Recompensa: "Uma bússola de marfim aponta para sinais luminosos, não para o norte. Os registros próximos identificam quem alterou o farol e comprou as cargas roubadas.",
      }),
    },
  },
  ruins: {
    name: "Pátio da Coroa Rachada",
    setting: "entre salões desabados, muralhas partidas e monumentos cobertos por cinza e vegetação",
    texture: "Pedras soltas estalam sob os pés, mosaicos aparecem entre a poeira e ecos atravessam paredes que já não existem.",
    inhabitants: "Escavadores, famílias deslocadas, estudiosos, vigias e saqueadores ocupam setores diferentes das ruínas.",
    regionNoun: "as ruínas",
    npcRole: "explorador que reconhece técnicas de construção, símbolos de risco e sinais de desabamento",
    npcCompanion: "um pequeno lagarto de pedra que desperta perto de inscrições antigas e procura superfícies aquecidas",
    location: {
      type: "Pátio cerimonial cercado por colunas quebradas, abrigos improvisados e entradas para níveis soterrados.",
      landmark: "Uma coroa de pedra partida ao meio permanece suspensa por correntes sobre o mosaico central.",
      history: "O pátio era usado para juramentos públicos até que uma disputa sucessória dividiu a cidade e terminou com o abandono do complexo.",
      conflict: "Famílias usam os salões como moradia; estudiosos querem isolar a área; saqueadores vendem peças retiradas das estruturas ainda ocupadas.",
      danger: "Escavações recentes removeram suportes e criaram rachaduras que atravessam pisos, paredes e cisternas antigas.",
      secret: "O mosaico registra um acordo de sucessão diferente daquele preservado pelos cronistas e reconhece uma linhagem apagada.",
      opportunities: "As ruínas oferecem abrigo, artefatos históricos, rotas subterrâneas e documentos capazes de alterar disputas atuais.",
      hook: "A metade desaparecida da coroa surgiu num mercado próximo, ainda coberta por argamassa fresca.",
    },
    quest: {
      title: "A Metade da Coroa",
      giver: "uma representante das famílias abrigadas nas ruínas e responsável por negociar com estudiosos",
      objective: "recuperar a metade da coroa e descobrir de qual setor ela foi retirada antes que a estrutura desabe",
      complication: "O comprador da peça possui autorização oficial, mas o documento descreve uma escavação em outro ponto das ruínas.",
      context: "A retirada abriu uma rachadura sob os abrigos e pode destruir provas históricas junto com as moradias.",
      stages: "Rastrear a venda da peça; identificar a escavação clandestina; estabilizar o setor e decidir onde a coroa deve permanecer.",
      opposition: "Um colecionador financia saqueadores, autoridades e falsos laudos para transformar patrimônio público em propriedade particular.",
      escalation: "Cada tremor derruba outra passagem e força famílias a se concentrarem em salões cada vez mais frágeis.",
      failure: "O setor desaba, as famílias perdem o abrigo e o colecionador culpa os moradores pela destruição das provas.",
      alternative: "Expor os laudos falsos e organizar uma escavação pública pode obrigar o comprador a devolver a peça sem confronto.",
      reward: "Direito de consultar os arquivos encontrados, abrigo seguro nas ruínas e uma relíquia legalmente cedida pelas famílias.",
    },
    encounter: {
      title: "O Muro que se Lembra",
      situation: "Um trecho de muralha repete em voz alta frases pronunciadas diante dele. Uma multidão se reúne para ouvir o depoimento de alguém morto há séculos.",
      threat: "As vibrações soltam pedras do arco superior, e pessoas se empurram para chegar mais perto da parede.",
      twist: "Uma estudiosa manipula a ordem das frases com batidas discretas para produzir uma acusação conveniente.",
      choice: "O grupo pode dispersar a multidão, revelar a manipulação ou usar o mecanismo para recuperar o restante do depoimento.",
      setup: "Cada palavra ecoa por salões vazios, poeira cai das juntas e o arco range quando a multidão responde.",
      actors: "Moradores buscam justiça, estudiosos disputam interpretação, guardas protegem a área e a manipuladora tenta concluir sua demonstração.",
      escalation: "Uma frase menciona uma família presente, provoca acusações e leva os guardas a fechar a saída principal.",
      interaction: "Batidas, posição diante do muro, objetos de metal e o bloqueio de determinadas cavidades alteram as frases reproduzidas.",
      outcomes: "Recuperar o depoimento completo revela um fato histórico. Derrubar a parte instável salva a multidão, mas destrói parte da memória.",
      aftermath: "Atrás de uma pedra solta aparece um compartimento com o instrumento usado para registrar as vozes originais.",
    },
    rumor: {
      subject: "A rainha sem rosto",
      claim: "Viajantes dizem que uma figura coroada percorre as ruínas ao entardecer e apaga o rosto de estátuas que pronunciam seu verdadeiro nome.",
      truth: "Alguém remove traços específicos das estátuas para ocultar a linhagem representada no mosaico central.",
      source: "Uma vigia viu a figura trabalhando e encontrou pó de pedra, ferramentas finas e uma lista de monumentos.",
      variations: "Alguns descrevem um espírito; outros falam numa pessoa mascarada ou em várias figuras usando o mesmo manto.",
      clues: "As estátuas danificadas pertencem ao mesmo período, e todas conservam marcas de um cinzel fabricado recentemente.",
      interested: "Herdeiros, estudiosos e colecionadores procuram controlar a interpretação da linhagem apagada.",
      consequence: "Vigiar a próxima estátua revela a pessoa responsável e expõe documentos que ligam a destruição a uma autoridade atual.",
      context: "O boato começou depois que nomes antigos reapareceram em documentos encontrados sob os abrigos das famílias.",
    },
    dungeon: {
      name: "Arquivo da Coroa Partida",
      overview: "Salões administrativos, cofres e passagens de serviço sobrevivem sob o pátio. Saqueadores retiraram suportes e libertaram mecanismos criados para proteger documentos.",
      rooms: completeRooms({
        Entrada: "Uma rampa soterrada termina em portas de bronze deformadas. Escoras recentes sustentam o teto, e números pintados indicam a ordem segura de removê-las.",
        Exploração: "Estantes tombadas dividem um arquivo coberto de pó. Selos, datas e espaços vazios mostram quais documentos foram procurados primeiro.",
        Desafio: "O piso de mosaico cede sobre uma câmara inferior. Distribuir peso pelas figuras intactas permite atravessar sem destruir as imagens restantes.",
        Encruzilhada: "Três corredores exibem brasões diferentes. Um está reforçado, outro recebe ar fresco e o terceiro contém rastros de caixas arrastadas.",
        Segredo: "Uma sequência de nomes repetidos abre o painel atrás do registro de sucessão. O nicho guarda a versão que foi retirada das crônicas oficiais.",
        Armadilha: "Pesos de pedra caem quando documentos são retirados sem substituição. Tábuas quebradas e pilhas de cascalho revelam o padrão dos disparos anteriores.",
        Refúgio: "Uma sala de escribas conserva bancos, lamparinas e água em jarros lacrados. Anotações recentes indicam turnos de saqueadores e pontos frágeis.",
        Contratempo: "Uma coluna se desloca e bloqueia a rota de retorno. Um duto estreito contorna o desabamento, mas passa sobre o arquivo principal.",
        Encontro: "Famílias escondidas protegem documentos retirados dos saqueadores. Elas temem estudiosos e exigem garantias antes de mostrar o material.",
        Revelação: "Os registros provam que a cidade não caiu numa batalha; seus líderes ordenaram a evacuação após romper o acordo de sucessão.",
        Confronto: "O financiador da escavação tenta remover o cofre central com roldanas. O esforço ameaça derrubar o pátio onde as famílias estão abrigadas.",
        Recompensa: "O cofre contém a matriz dos selos reais e cartas que reconhecem a linhagem apagada. Uma peça menor permite autenticar outros documentos antigos.",
      }),
    },
  },
  underground: {
    name: "Câmara do Eco Profundo",
    setting: "sob a terra, entre minas antigas, cisternas, pontes estreitas e túneis sem luz natural",
    texture: "Gotas marcam o tempo, correntes de ar atravessam fendas e fungos pálidos desenham bordas ao longo das paredes.",
    inhabitants: "Mineiros, carregadores, comunidades profundas, exploradores e criaturas adaptadas à escuridão conhecem setores diferentes.",
    regionNoun: "os túneis subterrâneos",
    npcRole: "prospector que interpreta ecos, correntes de ar e rachaduras antes de escolher uma passagem",
    npcCompanion: "um besouro luminoso criado numa caixa ventilada e treinado para reagir a gases perigosos",
    location: {
      type: "Estação subterrânea construída onde túneis de mineração encontram uma cisterna e uma antiga via de transporte.",
      landmark: "Um conjunto de placas metálicas transforma ecos em notas diferentes e indica quando alguma galeria muda de forma.",
      history: "A estação foi aberta por comunidades que precisavam compartilhar água, ventilação e rotas de fuga durante uma longa interdição da superfície.",
      conflict: "Mineiros querem reabrir uma galeria produtiva; moradores afirmam que as escavações enfraquecem a cisterna e contaminam o ar.",
      danger: "Gases sem cheiro acumulam-se nas partes baixas, enquanto vibrações recentes desprendem lascas do teto.",
      secret: "Os registros de ventilação mostram desvios noturnos de ar para uma instalação que não aparece em nenhuma planta.",
      opportunities: "A estação oferece água filtrada, ferramentas, guias, acesso a rotas profundas e minerais usados para produzir luz duradoura.",
      hook: "As placas de eco começaram a tocar uma nota reservada a desabamentos, embora nenhuma galeria conhecida tenha cedido.",
    },
    quest: {
      title: "O Ar Roubado",
      giver: "a responsável pela ventilação, escolhida por mineiros e famílias da estação",
      objective: "localizar a galeria ausente das plantas e interromper o desvio de ar antes da troca de turno",
      complication: "O fluxo roubado mantém vivas pessoas instaladas numa seção isolada que a administração declarou vazia.",
      context: "Fechar o desvio protege a estação, mas condena os ocupantes ocultos; mantê-lo aberto expõe centenas de pessoas aos gases.",
      stages: "Comparar registros de eco e ventilação; atravessar as galerias baixas; encontrar a instalação oculta e criar uma divisão segura do ar.",
      opposition: "Supervisores escondem trabalhadores sem registro e desviam recursos para manter uma operação de mineração clandestina.",
      escalation: "A qualidade do ar piora por setores, as luzes enfraquecem e o próximo turno entra nos túneis sem conhecer o risco.",
      failure: "A estação é evacuada às pressas, trabalhadores ficam presos e a operação clandestina sela as provas atrás de um desabamento.",
      alternative: "Abrir uma chaminé antiga até a superfície pode ventilar os dois setores, mas revela a instalação para quem controla a região acima.",
      reward: "Cristais de luz, ferramentas de escavação, acesso às rotas profundas e apoio das comunidades resgatadas.",
    },
    encounter: {
      title: "A Última Lâmpada",
      situation: "Mineiros e famílias disputam a última caixa de cristais luminosos enquanto uma equipe permanece presa numa galeria escura.",
      threat: "As luzes instaladas apagam uma a uma, e algo se move nas áreas que ficam sem iluminação.",
      twist: "A criatura atraída pela escuridão foge de vibrações; os gritos e golpes usados para afastá-la apenas a conduzem até as pessoas.",
      choice: "O grupo pode levar os cristais ao resgate, iluminar a estação ou criar um caminho de vibrações para afastar a criatura.",
      setup: "O brilho azul diminui, vozes ecoam de túneis diferentes e cada pessoa segura sua fonte de luz junto ao corpo.",
      actors: "Mineiros querem resgatar colegas; famílias protegem crianças; a responsável pelo estoque procura uma solução que não abandone nenhum setor.",
      escalation: "Uma luz cai e se quebra, a criatura muda de direção e uma passagem lateral começa a ceder.",
      interaction: "Placas de eco, carrinhos, trilhos, ferramentas e cristais quebrados permitem controlar som, movimento e iluminação.",
      outcomes: "Coordenar os presentes permite o resgate e preserva parte da luz. Priorizar um setor salva vidas agora, mas rompe a confiança da estação.",
      aftermath: "A criatura deixa presa ao corpo uma etiqueta metálica usada apenas na instalação que não aparece nas plantas.",
    },
    rumor: {
      subject: "A estação abaixo da estação",
      claim: "Mineiros dizem ouvir outro turno trabalhando sob a cisterna, embora as plantas mostrem apenas rocha maciça naquele nível.",
      truth: "Uma instalação clandestina funciona abaixo da estação e transmite vibrações pelos antigos trilhos de carga.",
      source: "Uma operadora de guincho reconheceu a sequência de golpes usada para anunciar troca de equipe e respondeu sem receber retorno.",
      variations: "Alguns falam em mineiros mortos; outros descrevem máquinas, cantos ou pedidos de socorro sob a água.",
      clues: "Poeira recente sobe por fendas, o nível da cisterna baixa durante a noite e ferramentas somem sempre no mesmo turno.",
      interested: "Famílias procuram desaparecidos; supervisores escondem a operação; comerciantes desejam acesso ao minério extraído.",
      consequence: "Seguir as vibrações revela uma entrada técnica e faz os responsáveis anteciparem o fechamento da instalação.",
      context: "O boato existe há meses, mas ganhou urgência quando uma resposta correta veio de baixo durante um teste de segurança.",
    },
    dungeon: {
      name: "Estação sob a Cisterna",
      overview: "Uma instalação clandestina ocupa galerias de manutenção e poços abandonados. O desvio de ventilação mantém trabalhadores presos e desperta algo sensível a vibrações.",
      rooms: completeRooms({
        Entrada: "Uma grade atrás da cisterna esconde degraus que descem junto aos canos. Parafusos polidos e marcas de luva mostram que ela é aberta regularmente.",
        Exploração: "Um posto de controle registra fluxo de ar, turnos e consumo de água. Números alterados à mão revelam um grupo não incluído nas listas oficiais.",
        Desafio: "Uma ponte de trilhos cruza um poço sem fundo visível. Travessas danificadas podem ser reforçadas ou o carrinho pode servir de contrapeso.",
        Encruzilhada: "Três galerias conduzem ar em direções diferentes. Uma leva vozes, outra recebe calor e a terceira contém pegadas que terminam diante da parede.",
        Segredo: "Placas de eco ocultam uma alavanca afinada para responder a uma nota específica. O painel aberto revela mapas e nomes de trabalhadores clandestinos.",
        Armadilha: "Uma válvula libera gás quando a porta seguinte é forçada. Besouros imóveis, chama reduzida e um aviso raspado tornam o risco perceptível.",
        Refúgio: "Uma câmara ventilada conserva macas, água e cristais de luz. Um diário registra falhas recentes e uma rota de emergência ainda desobstruída.",
        Contratempo: "Um tremor desloca os trilhos e fecha a passagem de retorno. Um poço de ventilação oferece saída, mas sobe perto das máquinas em funcionamento.",
        Encontro: "Trabalhadores exaustos guardam ferramentas como armas e acreditam que o grupo veio selar a galeria. Eles precisam de ar, comida e prova contra os supervisores.",
        Revelação: "Os mapas mostram que a extração perfurou a parede de uma cavidade maior. As vibrações da operação despertaram a criatura que agora ronda a estação.",
        Confronto: "O supervisor tenta explodir a ligação com a instalação e abandonar trabalhadores e provas. Os detonadores também sustentam parte do sistema de ventilação.",
        Recompensa: "Um diapasão mineral localiza vazios e fontes de ar através da pedra. Os livros próximos registram toda a operação e seus financiadores.",
      }),
    },
  },
};
