"use strict";
(() => {
  var dt = ["water", "mineral", "atmosphere", "energy"];
  var L = "다음 조합에 사용할 수 있어요.",
    Y = [
      {
        id: "water",
        name: "물",
        kind: "base",
        plainSummary: "여러 물질을 녹여 서로 만나게 해 주는 액체예요.",
        inGameEffect: `시작 재료예요. ${L}`,
        scienceDetail:
          "물(H₂O)은 많은 물질을 녹이는 용매라서 물질끼리 만나 반응하기 좋은 환경을 만듭니다. 지금까지 알려진 모든 생물은 물이 있어야 살아갑니다.",
      },
      {
        id: "mineral",
        name: "광물",
        kind: "base",
        plainSummary: "암석을 이루는 단단한 고체 성분이에요.",
        inGameEffect: `시작 재료예요. ${L}`,
        scienceDetail:
          "광물은 일정한 화학 조성과 결정 구조를 가진 자연의 고체입니다. 철\xB7황\xB7인처럼 생물에게 필요한 원소의 공급원이 되기도 합니다.",
      },
      {
        id: "atmosphere",
        name: "대기",
        kind: "base",
        plainSummary: "행성을 둘러싼 기체층이에요.",
        inGameEffect: `시작 재료예요. ${L}`,
        scienceDetail:
          "지구 초기 대기에는 산소가 거의 없었던 것으로 여겨집니다. 대기 중 산소가 크게 늘어난 것은 광합성 생물이 오랫동안 산소를 내놓은 뒤의 일로, 약 24억 년 전의 대산화 사건(Great Oxidation Event)이 대표적입니다.",
      },
      {
        id: "energy",
        name: "에너지",
        kind: "base",
        plainSummary: "햇빛\xB7열\xB7번개처럼 변화를 일으키는 힘이에요.",
        inGameEffect: `시작 재료예요. ${L}`,
        scienceDetail:
          "에너지는 일을 할 수 있는 능력입니다. 생물은 햇빛(빛에너지)이나 화학 반응(화학에너지)에서 에너지를 얻어 몸을 만들고 움직입니다.",
        scienceCaveat:
          "게임의 ‘에너지’ 재료는 여러 에너지원을 하나로 묶은 상징입니다. 화면 위쪽의 ‘진화 에너지’ 자원과는 다른 것입니다.",
      },
      {
        id: "vapor",
        name: "수증기",
        kind: "recipe",
        plainSummary: "물이 데워져 기체가 된 거예요.",
        inGameEffect: L,
        scienceDetail:
          "물은 열을 받으면 증발해 눈에 보이지 않는 기체인 수증기가 됩니다. 주전자에서 하얗게 보이는 김은 수증기가 다시 식어 생긴 작은 물방울입니다.",
      },
      {
        id: "cloud",
        name: "구름",
        kind: "recipe",
        plainSummary:
          "공기 중에 떠 있는 아주 작은 물방울이나 얼음 알갱이들의 모임이에요.",
        inGameEffect: L,
        scienceDetail:
          "수증기가 높은 곳에서 식으면 먼지 같은 작은 입자(응결핵)를 중심으로 응결해 작은 물방울이나 얼음 알갱이가 됩니다. 이것들이 많이 모여 눈에 보이는 것이 구름입니다. 즉 구름은 기체인 수증기가 아니라 응결된 물입니다.",
      },
      {
        id: "rain",
        name: "비",
        kind: "recipe",
        plainSummary: "구름 속 물방울이 커지고 무거워져 떨어지는 거예요.",
        inGameEffect: L,
        scienceDetail:
          "구름 속 물방울이나 얼음 알갱이가 서로 합쳐져 무거워지면 떨어집니다. 비는 육지의 암석을 조금씩 녹이고 깎아(풍화\xB7침식) 광물 성분을 바다로 옮기는 역할도 합니다.",
      },
      {
        id: "sediment",
        name: "퇴적물",
        kind: "recipe",
        plainSummary: "물에 실려 와 바닥에 가라앉아 쌓인 알갱이예요.",
        inGameEffect: L,
        scienceDetail:
          "모래\xB7진흙처럼 물이나 바람에 실려 온 입자가 쌓인 것입니다. 오랜 시간 눌리고 굳으면 퇴적암이 됩니다. 바다 밑과 연안 생물이 사는 바탕이 되기도 합니다.",
      },
      {
        id: "heat",
        name: "지열",
        kind: "recipe",
        plainSummary: "땅속 깊은 곳에서 나오는 열이에요.",
        inGameEffect: L,
        scienceDetail:
          "지구 내부의 열은 지구가 만들어질 때 남은 열과 방사성 원소가 붕괴하며 내는 열에서 옵니다. 이 열이 화산 활동과 뜨거운 물이 솟는 열수 활동을 일으킵니다.",
      },
      {
        id: "hydrothermal",
        name: "열수 환경",
        kind: "recipe",
        plainSummary: "땅속 열로 데워진 물이 바다 밑에서 솟아나는 곳이에요.",
        inGameEffect: `${L} 세계 화면 왼쪽 아래의 주황색 분출구가 원시 바다의 영양분 공급을 나타내요.`,
        scienceDetail:
          "바다 밑 열수 분출구(hydrothermal vent)에서는 뜨겁고 광물이 많이 녹은 물이 솟아납니다. 햇빛이 닿지 않는 곳이지만 화학 에너지를 이용하는 미생물을 바탕으로 생물 군집이 살아갑니다.",
        scienceCaveat:
          "열수 분출구는 생명이 시작된 장소의 후보 가운데 하나로 연구되지만, 실제로 그곳에서 생명이 시작됐는지는 확인되지 않았습니다.",
      },
      {
        id: "nutrients",
        name: "용존 영양분",
        kind: "recipe",
        plainSummary: "물에 녹아 있어서 생물이 이용할 수 있는 영양 재료예요.",
        inGameEffect:
          "발견하면 두 서식지의 영양분 자연 회복이 20% 빨라져요. 바다 생물이 자라는 데 쓰는 자원이에요.",
        scienceDetail:
          "질소\xB7인\xB7철 같은 원소가 물에 녹은 형태(질산염, 인산염 등)로 있을 때 생물이 흡수할 수 있습니다. 바다에서는 이런 영양분이 모자라면 생물이 잘 자라지 못합니다.",
      },
      {
        id: "organic_precursor",
        name: "유기물 전구체",
        kind: "recipe",
        plainSummary: "더 복잡한 유기물의 재료가 될 수 있는 물질이에요.",
        inGameEffect: `세포와 관련된 조합의 재료예요. ${L}`,
        scienceDetail:
          "아미노산이나 핵산 재료처럼 탄소를 포함한 비교적 작은 분자를 가리킵니다. 1953년 밀러-유리 실험(Miller–Urey experiment)은 초기 지구 대기를 흉내 낸 기체에 전기 방전을 일으켜 아미노산이 만들어질 수 있음을 보였습니다.",
        scienceCaveat:
          "초기 지구에서 이런 분자가 어디서, 어떤 조건으로 생겼는지는 여러 가설이 경쟁 중입니다. ‘열수 환경 + 대기’ 조합은 게임을 위한 단순화입니다.",
      },
      {
        id: "membrane",
        name: "원시 막",
        kind: "recipe",
        plainSummary: "안과 밖을 나눌 수 있는 아주 얇은 막이에요.",
        inGameEffect: `원시 세포 조합의 재료예요. ${L}`,
        scienceDetail:
          "지방산 같은 분자는 물속에서 저절로 모여, 안쪽에 물을 품은 작은 주머니(소포, vesicle)를 만들 수 있습니다. 실험실에서는 이런 주머니가 커지거나 나뉘는 모습도 관찰됩니다.",
        scienceCaveat:
          "최초 세포의 막이 실제로 어떤 분자였는지는 아직 가설과 실험 모형 단계입니다.",
      },
      {
        id: "replicator",
        name: "복제 분자",
        kind: "recipe",
        plainSummary: "자기와 닮은 분자를 다시 만드는 데 관여하는 분자예요.",
        inGameEffect: `원시 세포 조합의 재료예요. ${L}`,
        scienceDetail:
          "오늘날 생물은 DNA에 유전 정보를 담고, 단백질 효소의 도움을 받아 복제합니다. RNA는 정보를 담으면서 일부 화학 반응을 돕기도 해서, 초기 생명에서는 RNA가 두 역할을 했다는 ‘RNA 세계 가설(RNA world hypothesis)’이 있습니다.",
        scienceCaveat:
          "RNA 세계는 가설입니다. 게임의 ‘복제 분자’는 특정 분자를 가리키지 않는 상징입니다.",
      },
      {
        id: "protocell",
        name: "원시 세포",
        kind: "recipe",
        plainSummary:
          "막 안에 복제 분자를 담은, 세포의 아주 단순한 모형이에요.",
        inGameEffect:
          "여러 생물 조합의 핵심 재료예요. 도감에 발견해도 세계에 바로 배치되지는 않아요.",
        scienceDetail:
          "원시 세포(protocell)는 막으로 둘러싸인 공간 안에서 분자의 복제와 화학 반응이 함께 일어나는 단순한 구조를 말합니다. 연구자들은 실험실에서 이런 구조를 만들어 ‘생명이 되려면 최소한 무엇이 필요한가’를 탐구합니다.",
        scienceCaveat:
          "최초의 세포가 실제로 어떤 모습이었는지는 알려져 있지 않습니다. 이 항목은 실험\xB7가설 모형을 바탕으로 한 게임 속 단계입니다.",
      },
      {
        id: "metabolic_cycle",
        name: "기초 대사",
        kind: "recipe",
        plainSummary: "생물이 물질을 바꾸며 에너지를 얻고 사용하는 과정이에요.",
        inGameEffect: `초기 생물과 관련된 조합의 재료예요. ${L}`,
        scienceDetail:
          "대사(metabolism)는 몸속에서 일어나는 화학 반응 전체를 가리킵니다. 영양분을 분해해 에너지를 얻는 반응과, 그 에너지로 몸을 이루는 물질을 만드는 반응이 서로 이어져 있습니다.",
        scienceCaveat:
          "게임의 ‘기초 대사’는 수많은 반응을 한 칸으로 묶은 상징입니다.",
      },
      {
        id: "chemosynth_microbe",
        name: "화학합성 미생물",
        kind: "recipe",
        plainSummary: "햇빛 대신 화학 반응에서 에너지를 얻는 작은 생물이에요.",
        inGameEffect:
          "세계에 처음 배치할 수 있는 생산자예요. 원시 바다에서만 살고, 영양분을 먹으며 진화 에너지를 조금씩 만들어요.",
        scienceDetail:
          "화학합성(chemosynthesis) 생물은 황화수소나 수소 같은 물질이 반응할 때 나오는 에너지로 이산화탄소에서 유기물을 만듭니다. 깊은 바다의 열수 분출구 주변에서는 이런 미생물이 먹이사슬의 바탕이 됩니다.",
        scienceCaveat:
          "이런 생물이 오늘날 열수 환경에 산다는 사실이, 생명이 그곳에서 시작됐다는 증거가 되지는 않습니다.",
        species: {
          diet: "물에 녹은 영양분 (게임의 ‘영양분’ 수치)",
          energySource: "화학 반응에서 얻는 에너지 — 빛이 필요 없어요",
          impact: "죽으면 사체가 유기물로 쌓여요. 산소는 만들지 않아요.",
        },
      },
      {
        id: "pigment",
        name: "광반응 색소",
        kind: "recipe",
        plainSummary: "빛을 흡수하는 색을 띤 분자예요.",
        inGameEffect: `광합성 조합의 재료예요. ${L}`,
        scienceDetail:
          "엽록소(chlorophyll) 같은 색소는 특정한 색(파장)의 빛을 흡수해 그 에너지를 화학 반응으로 넘깁니다. 식물이 초록색으로 보이는 것은 엽록소가 초록빛을 덜 흡수하고 많이 반사하기 때문입니다.",
      },
      {
        id: "photosynthesis",
        name: "광합성",
        kind: "recipe",
        plainSummary: "빛을 이용해 이산화탄소로 유기물을 만드는 과정이에요.",
        inGameEffect: `광합성 생물 조합의 재료예요. ${L} 이 게임의 광합성 계통(광합성 미생물\xB7연안 군체)은 산소를 내놓아요.`,
        scienceDetail:
          "광합성(photosynthesis)은 빛에너지로 이산화탄소를 유기물로 바꾸는 과정입니다. 식물\xB7조류\xB7남세균은 물을 분해하면서 산소를 내놓지만, 일부 세균은 물 대신 황화수소 같은 물질을 써서 산소가 나오지 않는 광합성을 합니다.",
        scienceCaveat:
          "게임에서는 ‘광합성 = 산소 생산’으로 단순화했습니다. 모든 광합성이 산소를 내놓지는 않습니다.",
      },
      {
        id: "photo_microbe",
        name: "광합성 미생물",
        kind: "recipe",
        plainSummary: "빛으로 양분을 만들고 산소를 내놓는 작은 생물이에요.",
        inGameEffect:
          "배치하면 산소가 늘어나요. 초식 원생생물의 먹이가 되고, 산소 축적 관찰의 조건이에요.",
        scienceDetail:
          "남세균(cyanobacteria)은 물을 분해하며 산소를 내놓는 광합성을 하는 세균입니다. 이런 미생물은 아주 오랜 시간에 걸쳐 바다와 대기에 산소를 쌓은 주역으로 여겨집니다. 오늘날에도 바다에서 만들어지는 산소의 상당 부분을 작은 광합성 미생물이 담당합니다.",
        scienceCaveat:
          "실제 광합성 미생물은 매우 다양합니다. 게임의 한 종은 공통된 특징만 뽑은 대표 모형입니다.",
        species: {
          diet: "물에 녹은 영양분 + 빛",
          energySource: "빛 (광합성)",
          impact:
            "산소를 늘리고, 초식 원생생물의 먹이가 돼요. 먹히거나 죽으면 유기물이 쌓여요.",
        },
      },
      {
        id: "aerobic_metabolism",
        name: "산소 대사",
        kind: "recipe",
        plainSummary:
          "산소를 써서 영양분에서 에너지를 더 많이 꺼내는 대사예요.",
        inGameEffect:
          "발견하면 초식\xB7포식 원생생물이 필요한 최소 산소가 4 낮아지고, 번식이 20% 빨라져요.",
        scienceDetail:
          "산소 호흡(aerobic respiration)은 포도당 같은 물질을 산소로 끝까지 분해해, 산소 없이 분해할 때보다 훨씬 많은 에너지(ATP)를 얻습니다. 산소가 많아진 환경은 더 활발하게 움직이는 생물이 살 수 있는 조건이 되었다고 여겨집니다.",
      },
      {
        id: "grazer",
        name: "초식 원생생물",
        kind: "recipe",
        plainSummary: "광합성 미생물을 삼켜 먹는 작은 단세포 생물이에요.",
        inGameEffect:
          "광합성 미생물을 먹고 늘어나요. 산소가 10보다 높아야 번식하고, 20 이상이면 제대로 자라요.",
        scienceDetail:
          "원생생물(protist)은 동물\xB7식물\xB7균류에 속하지 않는 진핵생물을 편의상 묶어 부르는 말입니다. 세균보다 크고 세포 안에 핵이 있으며, 세균이나 조류를 삼켜 먹는 종이 많습니다.",
        scienceCaveat:
          "원생생물은 하나의 혈통이 아니라 여러 계통을 모아 부르는 이름입니다. ‘초식’은 게임 속 역할 이름입니다.",
        species: {
          diet: "광합성 미생물 (같은 서식지)",
          energySource: "먹은 먹이를 산소로 분해 (호흡)",
          impact:
            "광합성 미생물 수를 줄이고, 포식 원생생물의 먹이가 돼요. 산소를 조금씩 써요.",
        },
      },
      {
        id: "predator",
        name: "포식 원생생물",
        kind: "recipe",
        plainSummary: "초식 원생생물을 잡아먹는 단세포 생물이에요.",
        inGameEffect:
          "초식 원생생물을 먹어요. 산소가 14보다 높아야 번식하고(24 이상이면 제대로), 진화 에너지를 많이 만들어요.",
        scienceDetail:
          "단세포 생물 가운데에도 다른 원생생물을 사냥하는 종이 있습니다. 짚신벌레를 잡아먹는 디디니움(Didinium)이 잘 알려진 예입니다.",
        scienceCaveat:
          "먹이사슬은 게임을 위해 생산자 → 초식 → 포식의 세 칸으로 단순화했습니다.",
        species: {
          diet: "초식 원생생물 (같은 서식지)",
          energySource: "먹은 먹이를 산소로 분해 (호흡)",
          impact:
            "초식 원생생물 수를 억제해 광합성 미생물이 회복할 여지를 만들어요. 산소를 써요.",
        },
      },
      {
        id: "decomposer",
        name: "분해 미생물",
        kind: "recipe",
        plainSummary:
          "죽은 생물과 찌꺼기를 분해해 영양분으로 되돌리는 미생물이에요.",
        inGameEffect: "유기물을 먹고 영양분으로 바꿔 서식지에 돌려줘요.",
        scienceDetail:
          "분해자(decomposer)는 사체와 배설물 속 유기물을 작은 물질로 분해합니다. 이 과정에서 질소\xB7인 같은 영양분이 다른 생물이 다시 쓸 수 있는 형태로 돌아갑니다(물질 순환).",
        species: {
          diet: "유기물 (사체\xB7찌꺼기)",
          energySource: "유기물을 분해하며 얻는 에너지",
          impact:
            "쌓인 유기물을 줄이고 영양분을 늘려요. 산소를 아주 조금 써요.",
        },
      },
      {
        id: "coastal_habitat",
        name: "연안 환경",
        kind: "recipe",
        plainSummary: "얕은 바닷물에 빛이 잘 드는 해안 가까운 환경이에요.",
        inGameEffect:
          "연안 서식지가 열려요. 광합성 생물\xB7소비자를 연안에도 배치할 수 있어요.",
        scienceDetail:
          "연안은 수심이 얕아 햇빛이 바닥까지 닿는 곳이 많습니다. 강과 비가 육지에서 영양분을 실어 오기 때문에, 먼바다보다 생물이 많이 자라는 경우가 흔합니다.",
      },
      {
        id: "coastal_colony",
        name: "연안 군체",
        kind: "recipe",
        plainSummary: "연안에 모여 층을 이루며 사는 광합성 미생물 무리예요.",
        inGameEffect:
          "연안에만 배치할 수 있어요. 산소가 15보다 높아야 번식하고(25 이상이면 제대로), 산소와 진화 에너지를 많이 만들어요.",
        scienceDetail:
          "남세균 같은 미생물은 얕은 물에서 끈적한 층(미생물 매트)을 이루며 모여 삽니다. 이런 층이 퇴적물을 붙잡으며 쌓여 굳은 구조물을 스트로마톨라이트(stromatolite)라고 하며, 아주 오래된 생명 흔적 가운데 하나로 연구됩니다.",
        scienceCaveat:
          "게임의 ‘연안 군체’는 이런 미생물 매트를 단순화한 모형입니다.",
        species: {
          diet: "물에 녹은 영양분 + 빛",
          energySource: "빛 (광합성)",
          impact:
            "산소를 늘려요. 다른 생물의 먹이로는 쓰이지 않아요(게임 규칙).",
        },
      },
      {
        id: "symbiosis",
        name: "공생",
        kind: "recipe",
        plainSummary:
          "서로 다른 종이 가까이 붙어 관계를 맺고 함께 사는 거예요.",
        inGameEffect:
          "분해 미생물의 영양분 환원이 25% 늘어나요. 서로 돕는 경우(상리공생)를 단순화한 효과예요.",
        scienceDetail:
          "공생(symbiosis)에는 둘 다 이득을 보는 상리공생, 한쪽만 이득을 보는 편리공생, 한쪽이 피해를 보는 기생이 모두 포함됩니다. 진핵세포의 미토콘드리아와 엽록체가 옛 세균에서 비롯되었다는 내부공생설(endosymbiotic theory)도 공생의 예입니다.",
        scienceCaveat:
          "공생이 항상 서로에게 이득인 것은 아닙니다. 게임의 보너스는 서로 돕는 경우만 모델로 삼았습니다.",
      },
      {
        id: "sensory_response",
        name: "초기 감각 반응",
        kind: "recipe",
        plainSummary:
          "빛이나 먹이 냄새 같은 주변 변화를 알아차리고 움직임을 바꾸는 반응이에요.",
        inGameEffect:
          "진화 탭의 최종 실험(빛\xB7먹이 반응 실험)이 열려요. 에너지가 필요 없어요.",
        scienceDetail:
          "세균은 화학 물질의 농도 변화를 감지해 헤엄치는 방향을 바꾸고(화학주성, chemotaxis), 일부 미생물은 빛 쪽으로 움직입니다(주광성, phototaxis). 신경계가 없어도 이런 단순한 감지와 반응이 가능합니다.",
        scienceCaveat:
          "게임의 ‘초기 감각 반응’은 연구 목표를 위한 상징적인 해금이며, 감각이 언제 어떻게 처음 생겼는지를 말하지 않습니다.",
      },
      {
        id: "oxygen_accumulation",
        name: "산소 축적",
        kind: "observation",
        plainSummary:
          "광합성 생물이 내놓은 산소가 바다와 대기에 쌓인 상태예요.",
        inGameEffect:
          "관찰 기록이에요. 원시 세포와 조합하면 산소 대사를 찾을 수 있어요.",
        scienceDetail:
          "지구에서는 산소를 내놓는 광합성이 시작된 뒤에도 산소가 곧바로 쌓이지 않았습니다. 바다에 녹은 철 등과 먼저 반응하며 소모되었고, 아주 오랜 시간에 걸쳐 늘어났습니다.",
        scienceCaveat:
          "게임의 ‘20초 유지’는 실제로 수억 년에 걸친 변화를 크게 압축한 것입니다.",
      },
      {
        id: "trophic_balance",
        name: "먹이사슬 균형",
        kind: "observation",
        plainSummary: "먹고 먹히는 생물들이 한동안 함께 살아남은 상태예요.",
        inGameEffect: "고급 조합 재료예요. 포식 원생생물과 조합해 보세요.",
        scienceDetail:
          "포식자와 먹이의 수는 서로 영향을 주며 오르내립니다. 로트카-볼테라 모형(Lotka–Volterra model)은 이런 관계를 수식으로 나타낸 고전적인 예입니다. 실제 생태계는 먹이 경쟁과 환경 변화 때문에 훨씬 복잡합니다.",
        scienceCaveat:
          "게임의 ‘균형’은 60초 동안 모두 살아남았다는 조건일 뿐, 실제 생태계의 안정성을 판단하는 기준은 아닙니다.",
      },
    ],
    B = Object.fromEntries(Y.map((t) => [t.id, t]));
  function T(t) {
    return B[t]?.name ?? t;
  }
  var C = ["ocean", "coast"],
    D = { ocean: "원시 바다", coast: "연안" },
    I = [
      "chemosynth_microbe",
      "photo_microbe",
      "grazer",
      "predator",
      "decomposer",
      "coastal_colony",
    ],
    g = {
      chemosynth_microbe: {
        id: "chemosynth_microbe",
        name: "화학합성 미생물",
        trophic: "producer",
        photosynthetic: !1,
        habitats: ["ocean"],
        cost: 15,
        seedPop: 6,
        r: 0.12,
        d: 0.02,
        starve: 0.03,
        K: { ocean: 80 },
        demand: 0.01,
        o2Min: -100,
        o2: 0,
        yield: 0.01,
        color: "#d98c3f",
      },
      photo_microbe: {
        id: "photo_microbe",
        name: "광합성 미생물",
        trophic: "producer",
        photosynthetic: !0,
        habitats: ["ocean", "coast"],
        cost: 60,
        seedPop: 6,
        r: 0.15,
        d: 0.02,
        starve: 0.03,
        K: { ocean: 100, coast: 70 },
        demand: 0.008,
        o2Min: -100,
        o2: 0.012,
        yield: 0.012,
        color: "#5fae5a",
      },
      grazer: {
        id: "grazer",
        name: "초식 원생생물",
        trophic: "grazer",
        photosynthetic: !1,
        habitats: ["ocean", "coast"],
        cost: 250,
        seedPop: 5,
        r: 0.14,
        d: 0.025,
        starve: 0.06,
        K: { ocean: 60, coast: 40 },
        demand: 0.05,
        o2Min: 10,
        o2: -0.004,
        yield: 0.035,
        color: "#4f86c6",
      },
      predator: {
        id: "predator",
        name: "포식 원생생물",
        trophic: "predator",
        photosynthetic: !1,
        habitats: ["ocean", "coast"],
        cost: 600,
        seedPop: 4,
        r: 0.12,
        d: 0.03,
        starve: 0.06,
        K: { ocean: 30, coast: 20 },
        demand: 0.06,
        o2Min: 14,
        o2: -0.006,
        yield: 0.08,
        color: "#c2564b",
      },
      decomposer: {
        id: "decomposer",
        name: "분해 미생물",
        trophic: "decomposer",
        photosynthetic: !1,
        habitats: ["ocean", "coast"],
        cost: 120,
        seedPop: 5,
        r: 0.12,
        d: 0.02,
        starve: 0.04,
        K: { ocean: 50, coast: 40 },
        demand: 0.06,
        o2Min: -100,
        o2: -0.002,
        yield: 0.02,
        color: "#8b6f4e",
      },
      coastal_colony: {
        id: "coastal_colony",
        name: "연안 군체",
        trophic: "producer",
        photosynthetic: !0,
        habitats: ["coast"],
        cost: 450,
        seedPop: 5,
        r: 0.1,
        d: 0.015,
        starve: 0.03,
        K: { coast: 60 },
        demand: 0.01,
        o2Min: 15,
        o2: 0.01,
        yield: 0.06,
        color: "#2f9e94",
      },
    },
    ce = { grazer: "photo_microbe", predator: "grazer" },
    lt = 0.5,
    S = {
      nutrientRegen: { ocean: 0.45, coast: 0.3 },
      regenNoise: 0.1,
      initOxygen: 5,
      initNutrients: { ocean: 30, coast: 25 },
      initOrganic: { ocean: 5, coast: 0 },
      oxygenSink: 0.015,
      corpseToOrganic: 0.8,
      decompToNutrient: 0.9,
      abioticDecay: 0.005,
      abioticToNutrient: 0.5,
      extinctBelow: 0.5,
      obsOxygen: { o2: 35, ticks: 20 },
      obsTrophic: { o2: 20, ticks: 60, minPop: 2 },
    };
  var N = {
      discoveryInsight: 2,
      observationInsight: 4,
      firstPlacementInsight: 1,
      originDataPerRebirth: 3,
    },
    pt = 1,
    Ne = { inject: { name: "영양분 주입", cost: 25, amount: 15 } },
    ee = [
      {
        id: "probe",
        name: "탐침 강화",
        desc: "탐침 클릭당 에너지 +1",
        baseCost: 50,
        costMul: 2.2,
        max: 5,
      },
      {
        id: "pump",
        name: "영양 펌프",
        desc: "열린 서식지 영양분 회복 +0.2/초",
        baseCost: 150,
        costMul: 2.5,
        max: 3,
      },
      {
        id: "lamp",
        name: "광원 증폭",
        desc: "광합성 종 번식 +15%",
        baseCost: 300,
        costMul: 2.5,
        max: 2,
      },
    ],
    te = [
      {
        id: "growth",
        name: "번식 이론",
        desc: "모든 종의 번식 +10%",
        cost: 10,
      },
      {
        id: "yield",
        name: "생산 이론",
        desc: "생태계 에너지 생산 +25%",
        cost: 14,
      },
      {
        id: "cheap_inject",
        name: "주입 효율",
        desc: "영양분 주입 비용 −50%",
        cost: 6,
      },
    ],
    A = {
      id: "sensory_study",
      name: "초기 감각 반응 실험",
      cost: 0,
      requires: "sensory_response",
    },
    J = [
      {
        id: "click",
        name: "기본 클릭 강화",
        desc: "탐침 클릭 기본 에너지 +1 / 레벨",
        costs: [2, 4, 6],
      },
      {
        id: "soup",
        name: "원시 수프 비축",
        desc: "새 시뮬레이션을 에너지 60으로 시작",
        costs: [3],
      },
      {
        id: "fertile",
        name: "번식 촉진",
        desc: "모든 종의 번식 +10% / 레벨",
        costs: [3, 5],
      },
    ];
  function de(t, e) {
    return Math.round(t.baseCost * Math.pow(t.costMul, e));
  }
  function mt(t) {
    for (let e = t.length - 1; e >= 0; e--) {
      let n = t.charCodeAt(e);
      if (n >= 44032 && n <= 55203) return n;
      if (/[0-9A-Za-z]/.test(t[e])) return null;
    }
    return null;
  }
  function ut(t) {
    let e = mt(t);
    return e === null ? !1 : (e - 44032) % 28 !== 0;
  }
  function Yt(t) {
    let e = mt(t);
    return e === null ? !1 : (e - 44032) % 28 === 8;
  }
  function $(t, e) {
    let [n, i] = e.split("/");
    return e === "으로/로"
      ? t + (ut(t) && !Yt(t) ? n : i)
      : t + (ut(t) ? n : i);
  }
  var xe = 3;
  function ne() {
    return { trials: 0, records: {} };
  }
  function Oe() {
    let t = {};
    for (let e of I) t[e] = Object.fromEntries(C.map((h) => [h, 0]));
    return t;
  }
  function Fe() {
    let t = {};
    for (let e of C)
      t[e] = { nutrients: S.initNutrients[e], organic: S.initOrganic[e] };
    return { oxygen: S.initOxygen, hab: t };
  }
  function le(t = 1729) {
    return {
      schemaVersion: xe,
      seed: t,
      rng: t | 0,
      tick: 0,
      totalTicks: 0,
      energy: 0,
      energyPerSec: 0,
      env: Fe(),
      pops: Oe(),
      loss: {},
      win: {},
      obsCounter: { oxygen_accumulation: 0, trophic_balance: 0 },
      runUpgrades: {},
      finalResearchDone: !1,
      chapter: chapterDefaults(),
      milestones: [],
      runClicks: 0,
      experiment: ne(),
      insight: 0,
      originData: 0,
      discovered: [...dt],
      claimed: [],
      theories: [],
      perms: {},
      rebirths: 0,
      settings: { briefCards: !1 },
      log: [
        {
          tick: 0,
          kind: "system",
          text: "실험실이 열렸습니다. 실험실 탭에서 두 재료를 골라 조합해 보세요.",
        },
      ],
    };
  }
  var ve = 80;
  function O(t, e, n = "system") {
    (t.log.push({ tick: t.totalTicks, text: e, kind: n }),
      t.log.length > ve && t.log.splice(0, t.log.length - ve));
  }
  function b(t, e) {
    return t.discovered.includes(e);
  }
  function P(t, e) {
    return `${t}@${e}`;
  }
  function ie(t, e) {
    return C.reduce((sum, h) => sum + t.pops[e][h], 0);
  }
  function je(t, e) {
    return t.theories.includes(e);
  }
  function pe(t, e) {
    return t.perms[e] ?? 0;
  }
  function Be(t, e) {
    return t.runUpgrades[e] ?? 0;
  }
  function Ue(t) {
    return b(t, "coastal_habitat");
  }
  function V(t, e) {
    return e === "ocean" || (e === "tide" ? b(t, "tidal_habitat") : Ue(t));
  }
  function ht(t, e) {
    let n = 1;
    return (
      je(t, "growth") && (n += 0.1),
      (n += 0.1 * pe(t, "fertile")),
      g[e].photosynthetic && (n += 0.15 * Be(t, "lamp")),
      (e === "grazer" || e === "predator") &&
        b(t, "aerobic_metabolism") &&
        (n += 0.2),
      n
    );
  }
  function ft(t, e) {
    let n = g[e].o2Min;
    return (e === "grazer" || e === "predator") && b(t, "aerobic_metabolism")
      ? n - 4
      : n;
  }
  function bt(t, e, n) {
    let i = n;
    return (b(t, "nutrients") && (i *= 1.2), (i += 0.2 * Be(t, "pump")), i);
  }
  function gt(t) {
    return b(t, "symbiosis") ? 1.25 : 1;
  }
  function vt(t) {
    return je(t, "yield") ? 1.25 : 1;
  }
  function ye(t) {
    return pt + Be(t, "probe") + pe(t, "click");
  }
  function xt(t) {
    return je(t, "cheap_inject") ? 0.5 : 1;
  }
  var Se = [
    { no: 1, a: "water", b: "energy", out: "vapor" },
    { no: 2, a: "vapor", b: "atmosphere", out: "cloud" },
    { no: 3, a: "cloud", b: "water", out: "rain" },
    { no: 4, a: "water", b: "mineral", out: "sediment" },
    { no: 5, a: "mineral", b: "energy", out: "heat" },
    { no: 6, a: "heat", b: "water", out: "hydrothermal" },
    { no: 7, a: "sediment", b: "rain", out: "nutrients" },
    { no: 8, a: "hydrothermal", b: "atmosphere", out: "organic_precursor" },
    { no: 9, a: "organic_precursor", b: "water", out: "membrane" },
    { no: 10, a: "organic_precursor", b: "energy", out: "replicator" },
    { no: 11, a: "membrane", b: "replicator", out: "protocell" },
    { no: 12, a: "protocell", b: "hydrothermal", out: "metabolic_cycle" },
    { no: 13, a: "protocell", b: "metabolic_cycle", out: "chemosynth_microbe" },
    { no: 14, a: "organic_precursor", b: "atmosphere", out: "pigment" },
    { no: 15, a: "pigment", b: "energy", out: "photosynthesis" },
    { no: 16, a: "protocell", b: "photosynthesis", out: "photo_microbe" },
    {
      no: 17,
      a: "protocell",
      b: "oxygen_accumulation",
      out: "aerobic_metabolism",
    },
    { no: 18, a: "photo_microbe", b: "protocell", out: "grazer" },
    { no: 19, a: "grazer", b: "metabolic_cycle", out: "predator" },
    { no: 20, a: "chemosynth_microbe", b: "sediment", out: "decomposer" },
    { no: 21, a: "sediment", b: "photosynthesis", out: "coastal_habitat" },
    { no: 22, a: "photo_microbe", b: "coastal_habitat", out: "coastal_colony" },
    { no: 23, a: "decomposer", b: "photo_microbe", out: "symbiosis" },
    { no: 24, a: "predator", b: "trophic_balance", out: "sensory_response" },
  ];
  function Ke(t, e) {
    return t < e ? `${t}+${e}` : `${e}+${t}`;
  }
  var Jt = new Map(Se.map((t) => [Ke(t.a, t.b), t]));
  function Zt(t, e) {
    return Jt.get(Ke(t, e));
  }
  function yt(t, e, n) {
    if (!B[e] || !B[n])
      return { kind: "invalid", reason: "알 수 없는 재료입니다." };
    if (!b(t, e) || !b(t, n))
      return { kind: "invalid", reason: "아직 발견하지 않은 재료입니다." };
    let i = Zt(e, n);
    if (!i) return { kind: "fail" };
    if (i.no > 24 && !t.chapter?.entered)
      return {
        kind: "invalid",
        reason: "진화 탭에서 두 번째 장에 먼저 들어가세요.",
      };
    if (b(t, i.out)) return { kind: "known", out: i.out };
    t.discovered.push(i.out);
    let o = ue(t, `disc:${i.out}`, N.discoveryInsight);
    return (
      i.out === "resilient_web" && (t.chapter.completed = true),
      O(
        t,
        `새 발견: ${$(T(e), "과/와")} ${$(T(n), "을/를")} 조합해 ${$(T(i.out), "을/를")} 찾았습니다.`,
        "discovery",
      ),
      { kind: "new", out: i.out, insight: o }
    );
  }
  function ue(t, e, n) {
    return t.claimed.includes(e) ? 0 : (t.claimed.push(e), (t.insight += n), n);
  }
  function St(t, e) {
    return Se.filter(
      (n) =>
        (n.a === e || n.b === e) &&
        (n.no <= 24 || t.chapter?.entered) &&
        !b(t, n.out) &&
        b(t, n.a) &&
        b(t, n.b),
    ).length;
  }
  function $t(t) {
    return Se.filter(
      (e) =>
        (e.no <= 24 || t.chapter?.entered) &&
        !b(t, e.out) &&
        b(t, e.a) &&
        b(t, e.b),
    ).length;
  }
  var Gn = Y.map((t) => t.id);
  function $e(t) {
    let e = (t + 1831565813) | 0,
      n = e;
    return (
      (e = Math.imul(e ^ (e >>> 15), e | 1)),
      (e ^= e + Math.imul(e ^ (e >>> 7), e | 61)),
      { value: ((e ^ (e >>> 14)) >>> 0) / 4294967296, state: n }
    );
  }
  var Qt = 20,
    en = 2,
    tn = 0.12;
  function Z(t, e, n) {
    return Number.isFinite(t) ? (t < e ? e : t > n ? n : t) : e;
  }
  function nn(t, e) {
    return g[t].K[e] ?? 0;
  }
  function on() {
    return {
      births: 0,
      consumed: 0,
      predation: 0,
      starvation: 0,
      natural: 0,
      fed: 1,
      envFit: 1,
    };
  }
  function Et(t) {
    let e = { extinct: [], observed: [] },
      n = t.env,
      i = t.pops,
      o = {};
    for (let l of I) for (let d of C) o[P(l, d)] = on();
    let s = $e(t.rng);
    t.rng = s.state;
    let a = 1 + (s.value * 2 - 1) * S.regenNoise;
    for (let l of C)
      V(t, l) &&
        (n.hab[l].nutrients = Z(
          n.hab[l].nutrients + bt(t, l, S.nutrientRegen[l]) * a,
          0,
          100,
        ));
    let r = Object.fromEntries(C.map((h) => [h, 0]));
    for (let l of C) {
      let d = 0;
      for (let f of I)
        g[f].trophic === "producer" && (d += i[f][l] * g[f].demand);
      let h = n.hab[l].nutrients,
        M = d > 0 ? Math.min(1, h / d) : 1,
        x = d * M;
      n.hab[l].nutrients = Z(h - x, 0, 100);
      for (let f of I)
        g[f].trophic === "producer" &&
          (o[P(f, l)].fed =
            (i[f][l] > 0 ? M : 1) *
            (l === "tide" && g[f].photosynthetic && t.chapter.light === "shade"
              ? 0.3
              : 1));
      for (let f of Object.keys(ce)) {
        let _ = ce[f],
          y = i[f][l];
        if (y <= 0) continue;
        let G =
            y *
            g[f].demand *
            (l === "tide" &&
            ce[f] === "grazer" &&
            b(t, "nursery") &&
            i.macroalgae.tide >= 5
              ? 0.6
              : 1),
          K = i[_][l] * lt,
          W = Math.min(G, K);
        ((i[_][l] = Math.max(0, i[_][l] - W)),
          (o[P(_, l)].predation += W),
          (o[P(f, l)].fed = G > 0 ? W / G : 1),
          (o[P(f, l)].consumed = W));
      }
      let F = i.decomposer[l];
      if (F > 0) {
        let f = F * g.decomposer.demand,
          _ = Math.min(f, n.hab[l].organic);
        ((n.hab[l].organic = Z(n.hab[l].organic - _, 0, 100)),
          (r[l] = _),
          (o[P("decomposer", l)].fed = f > 0 ? _ / f : 1),
          (o[P("decomposer", l)].consumed = _));
      }
    }
    let c = Object.fromEntries(C.map((h) => [h, 0]));
    for (let l of C)
      for (let d of I) {
        let h = P(d, l),
          M = g[d],
          x = i[d][l],
          F = nn(d, l),
          f = o[h];
        if (x <= 0 || F <= 0) {
          i[d][l] = 0;
          continue;
        }
        let _ = ft(t, d),
          y = _ <= -50 ? 1 : Z((n.oxygen - _) / 10, 0, 1);
        f.envFit = y;
        let G = Math.max(0, M.r * ht(t, d) * f.fed * y * x * (1 - x / F)),
          K = M.d * x,
          W = M.starve * (1 - Math.min(f.fed, y)) * x,
          j = x + G - K - W,
          X = K + W;
        (j > F && (j = F),
          j < S.extinctBelow &&
            ((X += Math.max(0, j)), (j = 0), e.extinct.push({ sp: d, h: l })),
          (i[d][l] = j),
          (c[l] += Math.max(0, X)),
          (f.births = G),
          (f.natural = K),
          (f.starvation = W));
      }
    for (let l of C) {
      if (!V(t, l)) continue;
      let d = n.hab[l];
      d.organic = Z(d.organic + c[l] * S.corpseToOrganic, 0, 100);
      let h = d.organic * S.abioticDecay;
      ((d.organic = Z(d.organic - h, 0, 100)),
        (d.nutrients = Z(
          d.nutrients +
            r[l] * S.decompToNutrient * gt(t) +
            h * S.abioticToNutrient,
          0,
          100,
        )));
    }
    let u = n.oxygen;
    for (let l of C)
      for (let d of I) {
        let h = i[d][l];
        if (h <= 0) continue;
        let M = g[d];
        M.o2 > 0
          ? (u += h * M.o2 * o[P(d, l)].fed)
          : M.o2 < 0 && (u += h * M.o2);
      }
    ((u -= u * S.oxygenSink), (n.oxygen = Z(u, 0, 100)));
    let m = 0;
    for (let l of I) m += ie(t, l) * g[l].yield;
    return (
      (m *= vt(t)),
      (t.energyPerSec = m),
      (t.energy += m),
      (t.loss = o),
      rn(t, e),
      sn(t, e),
      e
    );
  }
  function sn(t, e) {
    let n = I.filter((u) => g[u].photosynthetic).reduce(
        (u, m) => u + ie(t, m),
        0,
      ),
      i = t.env.oxygen,
      o = S.obsOxygen;
    ((t.obsCounter.oxygen_accumulation =
      n > 0 && i >= o.o2 ? t.obsCounter.oxygen_accumulation + 1 : 0),
      t.obsCounter.oxygen_accumulation >= o.ticks &&
        kt(t, "oxygen_accumulation", e));
    let s = S.obsTrophic,
      a = ie(t, "grazer"),
      r = ie(t, "predator"),
      c =
        n >= s.minPop &&
        a >= s.minPop &&
        r >= s.minPop &&
        i >= s.o2 &&
        !e.extinct.some(
          (u) =>
            u.sp === "grazer" || u.sp === "predator" || g[u.sp].photosynthetic,
        );
    ((t.obsCounter.trophic_balance = c ? t.obsCounter.trophic_balance + 1 : 0),
      t.obsCounter.trophic_balance >= s.ticks && kt(t, "trophic_balance", e));
  }
  function kt(t, e, n) {
    if (b(t, e)) return;
    t.discovered.push(e);
    let i = ue(t, `obs:${e}`, N.observationInsight);
    (n.observed.push(e),
      O(
        t,
        `관찰 기록: ${$(T(e), "을/를")} 관찰했습니다. 실험실에서 조합 재료로 쓸 수 있습니다.${i ? ` 통찰 +${i}` : ""}`,
        "discovery",
      ));
  }
  function rn(t, e) {
    for (let n of e.extinct) {
      let i = P(n.sp, n.h),
        o = ke(t, n.sp, n.h, t.win[i]);
      (O(
        t,
        `${$(g[n.sp].name, "이/가")} ${D[n.h]}에서 사라졌습니다.${o ? ` ${o}` : ""} 세계 탭에서 다시 도입할 수 있습니다.`,
        "warn",
      ),
        delete t.win[i]);
    }
    for (let n of C)
      for (let i of I) {
        let o = P(i, n),
          s = t.pops[i][n],
          a = t.loss[o],
          r = t.win[o];
        if (s <= 0) {
          delete t.win[o];
          continue;
        }
        if (!r) {
          let m = Ve(i);
          r = t.win[o] = {
            startPop: s,
            births: 0,
            predation: 0,
            starvation: 0,
            natural: 0,
            startPredatorPop: m ? t.pops[m][n] : 0,
          };
          continue;
        }
        if (
          ((r.births += a.births),
          (r.predation += a.predation),
          (r.starvation += a.starvation),
          (r.natural += a.natural),
          t.tick % Qt !== 0)
        )
          continue;
        let c = r.startPop - s;
        if (c >= en && c / r.startPop >= tn) {
          let m = ke(t, i, n, r);
          O(t, m ?? `${$(g[i].name, "이/가")} ${D[n]}에서 줄었습니다.`, "eco");
        }
        let u = Ve(i);
        t.win[o] = {
          startPop: s,
          births: 0,
          predation: 0,
          starvation: 0,
          natural: 0,
          startPredatorPop: u ? t.pops[u][n] : 0,
        };
      }
  }
  function Ve(t) {
    return Object.keys(ce).find((e) => ce[e] === t);
  }
  function ke(t, e, n, i) {
    let o = g[e].name,
      s = t.loss[P(e, n)],
      a = i?.predation ?? s?.predation ?? 0,
      r = i?.starvation ?? s?.starvation ?? 0,
      c = i?.natural ?? s?.natural ?? 0;
    if (a <= 0 && r <= 0 && c <= 0) return null;
    if (a >= r && a >= c) {
      let m = Ve(e),
        l = t.pops[m][n] > (i?.startPredatorPop ?? 0) + 0.5,
        d = g[m].name;
      return l
        ? `${$(d, "이/가")} 늘어나 ${$(o, "이/가")} 줄었습니다.`
        : `${d}의 포식으로 ${$(o, "이/가")} 줄었습니다.`;
    }
    let u = an(t, e, n);
    return r >= c
      ? `${u} ${$(o, "이/가")} 줄었습니다.`
      : s && (s.fed < 0.6 || s.envFit < 0.6)
        ? `${u} 번식이 줄어 ${$(o, "이/가")} 감소했습니다.`
        : `자연 사망이 번식보다 많아 ${$(o, "이/가")} 줄었습니다.`;
  }
  function an(t, e, n) {
    let i = g[e],
      o = t.loss[P(e, n)];
    if (o && o.envFit < o.fed) return "산소가 부족해";
    if (i.trophic === "producer") return "영양분이 부족해";
    if (i.trophic === "decomposer") return "분해할 유기물이 부족해";
    let s = ce[e];
    return s ? `먹이(${g[s].name})가 부족해` : "먹이가 부족해";
  }
  var Ee = class {
    constructor(e, n, i = () => {}) {
      this.sched = e;
      this.onTick = n;
      this.onFrame = i;
      this.acc = 0;
      this.last = 0;
      this.handle = null;
      this.running = !1;
      this.dropped = 0;
      this.ticksRun = 0;
      this.frame = () => {
        if (!this.running) return;
        let e = this.sched.now(),
          n = e - this.last;
        ((this.last = e), n >= 0 || (n = 0), (this.acc += n));
        let i = 0;
        for (; this.acc >= 1e3 && i < 3;)
          ((this.acc -= 1e3), this.onTick(), this.ticksRun++, i++);
        (this.acc >= 1e3 &&
          ((this.dropped += Math.floor(this.acc / 1e3)),
          (this.acc = this.acc % 1e3)),
          this.onFrame(),
          (this.handle = this.sched.request(this.frame)));
      };
    }
    isRunning() {
      return this.running;
    }
    start() {
      this.running ||
        ((this.running = !0),
        (this.last = this.sched.now()),
        (this.acc = 0),
        (this.handle = this.sched.request(this.frame)));
    }
    stop() {
      ((this.running = !1),
        this.handle !== null && this.sched.cancel(this.handle),
        (this.handle = null));
    }
    advance(e) {
      for (let n = 0; n < e; n++) (this.onTick(), this.ticksRun++);
    }
  };
  var U = ["control", "light", "food"],
    he = {
      control: "자극 없음 (대조군)",
      light: "빛 방향 바꾸기",
      food: "먹이 신호",
    },
    v = {
      agents: 16,
      speed: 0.012,
      recordAfter: 50,
      maxSteps: 150,
      stepsPerSecond: 10,
      food: { x: 0.8, y: 0.28 },
      nearFoodRadius: 0.2,
      foodScale: 0.15,
    };
  function me(t) {
    let e = $e(t.rng);
    return ((t.rng = e.state), e.value);
  }
  function Me(t) {
    for (; t > Math.PI;) t -= Math.PI * 2;
    for (; t < -Math.PI;) t += Math.PI * 2;
    return t;
  }
  function Mt(t, e) {
    return (
      1 / (1 + (Math.hypot(t - v.food.x, e - v.food.y) / v.foodScale) ** 2)
    );
  }
  function wt(t, e, n, i) {
    return (t * 31 + U.indexOf(e) * 7919 + n * 104729 + i * 1299709) | 0;
  }
  function It(t, e) {
    let n = {
      cond: t,
      rng: e | 0,
      step: 0,
      lightSide: "left",
      lastChangeStep: 0,
      switches: 0,
      agents: [],
    };
    for (let i = 0; i < v.agents; i++) {
      let o = 0.36 + me(n) * 0.28,
        s = 0.36 + me(n) * 0.28,
        a = me(n) * Math.PI * 2 - Math.PI;
      n.agents.push({ x: o, y: s, h: a, lastC: Mt(o, s) });
    }
    return n;
  }
  function Tt(t, e) {
    t.cond !== "light" ||
      t.lightSide === e ||
      ((t.lightSide = e), (t.lastChangeStep = t.step), (t.switches += 1));
  }
  function we(t) {
    return Math.max(0, t.lastChangeStep + v.recordAfter - t.step);
  }
  function Rt(t) {
    return t.cond === "light" && t.step + v.recordAfter <= v.maxSteps;
  }
  function ze(t) {
    let e = t.lightSide === "left" ? Math.PI : 0;
    for (let n of t.agents) {
      let i = me(t);
      if (t.cond === "control") n.h = Me(n.h + (i - 0.5) * 1.2);
      else if (t.cond === "light")
        n.h = Me(n.h + 0.18 * Me(e - n.h) + (i - 0.5) * 0.8);
      else {
        let o = Mt(n.x, n.y);
        (o > n.lastC
          ? (n.h = Me(n.h + (i - 0.5) * 0.3))
          : (n.h = me(t) * Math.PI * 2 - Math.PI),
          (n.lastC = o));
      }
      ((n.x += Math.cos(n.h) * v.speed),
        (n.y += Math.sin(n.h) * v.speed),
        (n.x = Math.min(0.98, Math.max(0.02, n.x))),
        (n.y = Math.min(0.98, Math.max(0.02, n.y))));
    }
    t.step++;
  }
  function Ie(t) {
    let e = t.agents.length,
      n = t.cond === "light" ? t.lightSide : "right",
      i = n === "left" ? Math.PI : 0,
      o = 0,
      s = 0,
      a = 0,
      r = 0;
    for (let c of t.agents) {
      ((n === "left" ? c.x < 0.5 : c.x >= 0.5) && o++,
        (s += Math.cos(c.h - i)));
      let u = Math.hypot(c.x - v.food.x, c.y - v.food.y);
      ((r += u), u <= v.nearFoodRadius && a++);
    }
    return {
      cond: t.cond,
      step: t.step,
      lightSide: n,
      lightHalf: o / e,
      alignment: s / e,
      nearFood: a / e,
      meanFoodDist: r / e,
      switches: t.switches,
    };
  }
  var H = (t) => `${Math.round(t * 100)}%`,
    cn = (t) => (t === "left" ? "왼쪽" : "오른쪽");
  function Ct(t) {
    let e = v.agents,
      n = (t.step / v.stepsPerSecond).toFixed(1);
    if (t.cond === "control")
      return `${n}초 동안 자극 없이 지켜봤습니다. 오른쪽 절반에 ${Math.round(t.lightHalf * e)}/${e}마리(${H(t.lightHalf)}), 먹이 지점 근처에 ${H(t.nearFood)}가 있었고 방향 일치도는 ${t.alignment.toFixed(2)}입니다. 한쪽으로 몰리지 않고 흩어져 있다면 이 값들이 비교 기준이 됩니다.`;
    if (t.cond === "light") {
      let i = t.switches
        ? ` 관찰 중 빛 방향을 ${t.switches}번 바꿨고, 마지막에는`
        : "";
      return `${i ? `${i.trim()} ` : ""}빛을 ${cn(t.lightSide)}에 두고 ${n}초까지 관찰했습니다. 빛 쪽 절반에 ${Math.round(t.lightHalf * e)}/${e}마리(${H(t.lightHalf)})가 있고, 진행 방향이 빛 쪽과 맞는 정도는 ${t.alignment.toFixed(2)}입니다(1이면 모두 빛을 향함).`;
    }
    return `먹이 신호를 켜고 ${n}초 관찰했습니다. 먹이 지점 근처에 ${Math.round(t.nearFood * e)}/${e}마리(${H(t.nearFood)})가 모였고, 평균 거리는 ${t.meanFoodDist.toFixed(2)}입니다.`;
  }
  function We(t) {
    let e = t.control,
      n = t.light,
      i = t.food;
    if (!e || !n || !i) return null;
    let o = Math.round((n.lightHalf - e.lightHalf) * 100),
      s = Math.round((i.nearFood - e.nearFood) * 100),
      a =
        o >= 20
          ? "뚜렷하게 빛 쪽으로 모였습니다"
          : o > 0
            ? "조금 빛 쪽으로 기울었습니다"
            : "빛 쪽으로 모이지 않았습니다",
      r =
        s >= 20
          ? "먹이 신호 근처로 뚜렷하게 모였습니다"
          : s > 0
            ? "먹이 신호 근처로 조금 모였습니다"
            : "먹이 신호 근처로 모이지 않았습니다";
    return `대조군과 비교하면, 빛 조건에서는 빛 쪽 비율이 ${H(e.lightHalf)} → ${H(n.lightHalf)}(${o >= 0 ? "+" : ""}${o}%p)로 ${a}. 먹이 조건에서는 먹이 근처 비율이 ${H(e.nearFood)} → ${H(i.nearFood)}(${s >= 0 ? "+" : ""}${s}%p)로 ${r}.`;
  }
  function Ye(t, e = Date.now()) {
    return JSON.stringify({ schemaVersion: xe, savedAt: e, state: t });
  }
  function k(t, e, n = -1 / 0, i = 1 / 0) {
    return typeof t == "number" && Number.isFinite(t)
      ? Math.min(i, Math.max(n, t))
      : e;
  }
  function qe(t, e) {
    if (!Array.isArray(t)) return [];
    let n = [];
    for (let i of t)
      typeof i == "string" && e(i) && !n.includes(i) && n.push(i);
    return n;
  }
  function Xe(t) {
    if (!t || typeof t != "object") throw new Error("state 없음");
    let e = t,
      n = le(k(e.seed, 1729)),
      i = { ...n };
    ((i.rng = k(e.rng, n.rng) | 0),
      (i.tick = Math.floor(k(e.tick, 0, 0))),
      (i.totalTicks = Math.floor(k(e.totalTicks, i.tick, 0))),
      (i.energy = k(e.energy, 0, 0)),
      (i.energyPerSec = k(e.energyPerSec, 0, 0)),
      (i.insight = Math.floor(k(e.insight, 0, 0))),
      (i.originData = Math.floor(k(e.originData, 0, 0))),
      (i.rebirths = Math.floor(k(e.rebirths, 0, 0))),
      (i.runClicks = Math.floor(k(e.runClicks, 0, 0))),
      (i.finalResearchDone = e.finalResearchDone === !0));
    let o = qe(e.discovered, (s) => !!B[s]);
    for (let s of n.discovered) o.includes(s) || o.unshift(s);
    ((i.discovered = o),
      (i.claimed = qe(e.claimed, (s) => /^(disc|obs|place):[a-z_]+$/.test(s))),
      (i.theories = qe(e.theories, (s) => te.some((a) => a.id === s))),
      (i.perms = {}));
    for (let s of J) {
      let a = Math.floor(k(e.perms?.[s.id], 0, 0, s.costs.length));
      a > 0 && (i.perms[s.id] = a);
    }
    i.runUpgrades = {};
    for (let s of ee) {
      let a = Math.floor(k(e.runUpgrades?.[s.id], 0, 0, s.max));
      a > 0 && (i.runUpgrades[s.id] = a);
    }
    ((i.env = n.env), (i.env.oxygen = k(e.env?.oxygen, n.env.oxygen, 0, 100)));
    for (let s of C)
      i.env.hab[s] = {
        nutrients: k(
          e.env?.hab?.[s]?.nutrients,
          n.env.hab[s].nutrients,
          0,
          100,
        ),
        organic: k(e.env?.hab?.[s]?.organic, n.env.hab[s].organic, 0, 100),
      };
    i.pops = n.pops;
    for (let s of I)
      for (let a of C) {
        let r = g[s].K[a] ?? 0;
        i.pops[s][a] = k(e.pops?.[s]?.[a], 0, 0, r);
      }
    i.chapter = normalizeChapter(e.chapter, e);
    i.milestones = qe(e.milestones, (x) =>
      ["chapter_one", "tide_compare", "food_web"].includes(x),
    );
    if (e.rebirths > 0 && !i.milestones.includes("chapter_one"))
      i.milestones.push("chapter_one");
    return (
      (i.obsCounter = {
        oxygen_accumulation: Math.floor(
          k(e.obsCounter?.oxygen_accumulation, 0, 0),
        ),
        trophic_balance: Math.floor(k(e.obsCounter?.trophic_balance, 0, 0)),
      }),
      (i.loss = {}),
      (i.win = {}),
      (i.experiment = dn(e.experiment)),
      (i.settings = { briefCards: e.settings?.briefCards === !0 }),
      (i.log = Array.isArray(e.log)
        ? e.log
            .filter((s) => !!s && typeof s.text == "string")
            .slice(-ve)
            .map((s) => ({
              tick: k(s.tick, 0, 0),
              text: String(s.text).slice(0, 300),
              kind: ["system", "eco", "warn", "discovery"].includes(s.kind)
                ? s.kind
                : "system",
            }))
        : n.log),
      i
    );
  }
  function dn(t) {
    let e = ne();
    if (!t || typeof t != "object") return e;
    e.trials = Math.floor(k(t.trials, 0, 0));
    for (let n of U) {
      let i = t.records?.[n];
      if (!i || typeof i != "object") continue;
      let o = {
        cond: n,
        step: Math.floor(k(i.step, 0, 0)),
        lightSide: i.lightSide === "right" ? "right" : "left",
        lightHalf: k(i.lightHalf, 0, 0, 1),
        alignment: k(i.alignment, 0, -1, 1),
        nearFood: k(i.nearFood, 0, 0, 1),
        meanFoodDist: k(i.meanFoodDist, 0, 0, 2),
      };
      if (Object.hasOwn(i, "switches"))
        o.switches = Math.floor(k(i.switches, 0, 0));
      e.records[n] = o;
    }
    return e;
  }
  function ln(t) {
    return {
      ...t,
      experiment: t.experiment ?? ne(),
      settings: t.settings ?? { briefCards: !1 },
    };
  }
  var pn = [
    "discovered",
    "claimed",
    "insight",
    "energy",
    "pops",
    "env",
    "runUpgrades",
    "theories",
    "perms",
    "rebirths",
    "finalResearchDone",
    "originData",
    "tick",
    "totalTicks",
    "seed",
    "rng",
  ];
  function un(t, e) {
    return pn.filter((n) => JSON.stringify(t[n]) !== JSON.stringify(e[n]));
  }
  function validateSavedState(s) {
    if (!s || typeof s !== "object" || Array.isArray(s))
      throw new Error("상태 객체 없음");
    for (const key of ["energy", "insight", "originData", "rebirths"]) {
      if (typeof s[key] !== "number" || !Number.isFinite(s[key]) || s[key] < 0)
        throw new Error(key + " 값 오류");
    }
    for (const key of ["discovered", "claimed", "theories"])
      if (!Array.isArray(s[key]) || s[key].some((x) => typeof x !== "string"))
        throw new Error(key + " 목록 오류");
    if (s.discovered.some((id) => !B[id]))
      throw new Error("지원하지 않는 발견 ID");
    if (s.claimed.some((id) => !/^(disc|obs|place):[a-z_]+$/.test(id)))
      throw new Error("보상 이력 형식 오류");
    if (
      typeof s.finalResearchDone !== "boolean" ||
      !s.perms ||
      !s.env?.hab ||
      !s.pops
    )
      throw new Error("필수 진행 필드 없음");
    if (
      !Number.isFinite(s.env.oxygen) ||
      s.env.oxygen < 0 ||
      s.env.oxygen > 100
    )
      throw new Error("산소 값 오류");
    for (const h of ["ocean", "coast"]) {
      for (const key of ["nutrients", "organic"]) {
        const x = s.env.hab[h]?.[key];
        if (!Number.isFinite(x) || x < 0 || x > 100)
          throw new Error("서식지 값 오류");
      }
      for (const id of I.slice(0, 6)) {
        const x = s.pops[id]?.[h];
        if (!Number.isFinite(x) || x < 0 || x > (g[id].K[h] ?? 0))
          throw new Error("개체군 값 오류");
      }
    }
  }
  function Re(t) {
    if (t === null || t === "") return { status: "empty" };
    let e;
    try {
      e = JSON.parse(t);
    } catch {
      return { status: "rejected", reason: "저장 데이터가 손상되었습니다." };
    }
    if (!e || typeof e != "object" || typeof e.schemaVersion != "number")
      return { status: "rejected", reason: "저장 형식을 알 수 없습니다." };
    if (e.schemaVersion > xe)
      return {
        status: "rejected",
        reason: `더 새로운 버전(v${e.schemaVersion})의 저장입니다.`,
      };
    if (e.schemaVersion < 1 || !Number.isInteger(e.schemaVersion))
      return { status: "rejected", reason: "지원하지 않는 저장 버전입니다." };
    try {
      validateSavedState(e.state);
      if (e.schemaVersion === 1) {
        if (!e.state || typeof e.state != "object")
          throw new Error("state 없음");
        if (!Array.isArray(e.state.discovered) || !e.state.env || !e.state.pops)
          throw new Error("필수 상태 필드 없음");
        let n = Xe(e.state),
          i = Xe(ln(e.state)),
          o = un(n, i);
        return o.length
          ? {
              status: "rejected",
              reason: `저장 이전 검증 실패: ${o.join(", ")}`,
            }
          : { status: "ok", state: i, fromVersion: 1 };
      }
      if (
        !Array.isArray(e.state?.discovered) ||
        !e.state?.env ||
        !e.state?.pops
      )
        throw new Error("필수 상태 필드 없음");
      return { status: "ok", state: Xe(e.state), fromVersion: e.schemaVersion };
    } catch (n) {
      return {
        status: "rejected",
        reason: `저장 데이터가 손상되었습니다. (${n.message})`,
      };
    }
  }
  const managers = new WeakMap();
  function storageManager(storage) {
    if (!managers.has(storage))
      managers.set(storage, new OriginStorage(storage, Re, Ye));
    return managers.get(storage);
  }
  function Pt(storage) {
    return storageManager(storage).load();
  }
  function Je(storage, state) {
    return storageManager(storage).save(state);
  }
  var E = (t) => ({ ok: !1, reason: t });
  function _t(t) {
    let e = ye(t);
    return ((t.energy += e), (t.runClicks += 1), e);
  }
  function De(t, e, n) {
    let i = g[e];
    if (!b(t, e)) return E(`${$(i.name, "을/를")} 아직 발견하지 않았습니다.`);
    if (!i.habitats.includes(n))
      return E(`${$(i.name, "은/는")} ${D[n]}에서 살 수 없습니다.`);
    if (!V(t, n)) return E(`${D[n]} 서식지가 아직 열리지 않았습니다.`);
    let o = i.K[n] ?? 0;
    return t.pops[e][n] >= o - 0.01
      ? E("이미 수용력 한계입니다.")
      : t.energy < i.cost
        ? E(`에너지가 부족합니다 (필요 ${i.cost}).`)
        : { ok: !0 };
  }
  function Ze(t, e, n) {
    let i = De(t, e, n);
    if (!i.ok) return i;
    let o = g[e],
      s = o.K[n] ?? 0,
      a = t.pops[e][n];
    ((t.energy -= o.cost), (t.pops[e][n] = Math.min(s, a + o.seedPop)));
    let r = ue(t, `place:${e}`, N.firstPlacementInsight),
      c = a > 0 ? "보충했습니다" : "도입했습니다";
    return (
      O(
        t,
        `${$(o.name, "을/를")} ${D[n]}에 ${c}.${r ? ` 첫 배치 통찰 +${r}` : ""}`,
        "system",
      ),
      { ok: !0 }
    );
  }
  function Qe(t) {
    return Math.round(Ne.inject.cost * xt(t));
  }
  function Ht(t, e) {
    if (!V(t, e)) return E("서식지가 아직 열리지 않았습니다.");
    let n = Qe(t);
    return t.energy < n
      ? E(`에너지가 부족합니다 (필요 ${n}).`)
      : t.env.hab[e].nutrients >= 99.5
        ? E("영양분이 이미 가득합니다.")
        : ((t.energy -= n),
          (t.env.hab[e].nutrients = Math.min(
            100,
            t.env.hab[e].nutrients + Ne.inject.amount,
          )),
          { ok: !0 });
  }
  function Gt(t, e) {
    let n = ee.find((s) => s.id === e);
    if (!n) return E("알 수 없는 장비입니다.");
    let i = t.runUpgrades[e] ?? 0;
    if (i >= n.max) return E("최대 단계입니다.");
    let o = de(n, i);
    return t.energy < o
      ? E(`에너지가 부족합니다 (필요 ${o}).`)
      : ((t.energy -= o),
        (t.runUpgrades[e] = i + 1),
        { ok: !0, msg: `${n.name} ${i + 1}단계` });
  }
  function Nt(t, e) {
    let n = te.find((i) => i.id === e);
    return n
      ? t.theories.includes(e)
        ? E("이미 정리한 이론입니다.")
        : t.insight < n.cost
          ? E(`통찰이 부족합니다 (필요 ${n.cost}).`)
          : ((t.insight -= n.cost),
            t.theories.push(e),
            O(t, `이론 정리: ${n.name} — ${n.desc}`, "system"),
            { ok: !0 })
      : E("알 수 없는 이론입니다.");
  }
  function Ae(t, e) {
    let n = J.find((i) => i.id === t);
    return !n || e >= n.costs.length ? null : n.costs[e];
  }
  function Ot(t, e) {
    let n = J.find((s) => s.id === e);
    if (!n) return E("알 수 없는 연구입니다.");
    let i = pe(t, e),
      o = Ae(e, i);
    return o === null
      ? E("최대 단계입니다.")
      : t.originData < o
        ? E(`기원 데이터가 부족합니다 (필요 ${o}).`)
        : ((t.originData -= o),
          (t.perms[e] = i + 1),
          O(t, `영구 연구: ${n.name} ${i + 1}단계를 완료했습니다.`, "system"),
          { ok: !0 });
  }
  function fe(t) {
    return b(t, A.requires)
      ? t.finalResearchDone
        ? E("이번 시뮬레이션에서 이미 완료했습니다.")
        : { ok: !0 }
      : E(`${$(T(A.requires), "을/를")} 먼저 발견해야 합니다.`);
  }
  function Ft(t, e) {
    return fe(t).ok
      ? ((t.experiment.trials += 1),
        It(e, wt(t.seed, e, t.rebirths, t.experiment.trials)))
      : null;
  }
  function jt(t, e) {
    let n = fe(t);
    return n.ok
      ? U.includes(e.cond)
        ? we(e) > 0
          ? E(
              `${e.switches ? "빛을 바꾼 뒤 " : ""}${(v.recordAfter / v.stepsPerSecond).toFixed(0)}초 이상 관찰한 뒤 기록할 수 있습니다.`,
            )
          : ((t.experiment.records[e.cond] = Ie(e)),
            { ok: !0, msg: `${he[e.cond]} 결과를 기록했습니다.` })
        : E("알 수 없는 조건입니다.")
      : n;
  }
  function et(t) {
    return U.filter((e) => t.experiment.records[e]).length;
  }
  function tt(t) {
    let e = fe(t);
    return e.ok
      ? et(t) < U.length
        ? E("세 조건을 모두 관찰\xB7기록해야 정리할 수 있습니다.")
        : t.energy < A.cost
          ? E(`에너지가 부족합니다 (필요 ${A.cost}).`)
          : { ok: !0 }
      : e;
  }
  function Bt(t) {
    let e = tt(t);
    return e.ok
      ? ((t.energy -= A.cost),
        (t.finalResearchDone = !0),
        (t.chapter.unlocked = true),
        O(
          t,
          `${$(A.name, "을/를")} 정리했습니다. 이제 여기서 마치거나 두 번째 장을 탐험할 수 있습니다. 첫 장 재시작 보상은 한 번만 받습니다.`,
          "discovery",
        ),
        { ok: !0 })
      : e;
  }
  function nt(t) {
    return t.finalResearchDone && !t.milestones.includes("chapter_one") ? 3 : 0;
  }
  function mn(t) {
    return t.finalResearchDone
      ? { ok: !0 }
      : E(`${$(A.name, "을/를")} 완료해야 재시작할 수 있습니다.`);
  }
  function Ut(t, e) {
    let n = mn(t);
    if (!n.ok) return n;
    if (!e) return E("재시작을 취소했습니다.");
    let i = nt(t);
    return (
      (t.originData += i),
      !t.milestones.includes("chapter_one") && t.milestones.push("chapter_one"),
      (t.chapter.unlocked = true),
      (t.rebirths += 1),
      (t.tick = 0),
      (t.energy = pe(t, "soup") > 0 ? 60 : 0),
      (t.energyPerSec = 0),
      (t.env = Fe()),
      (t.pops = Oe()),
      (t.loss = {}),
      (t.win = {}),
      (t.obsCounter = { oxygen_accumulation: 0, trophic_balance: 0 }),
      (t.runUpgrades = {}),
      (t.finalResearchDone = t.finalResearchDone),
      (t.runClicks = 0),
      (t.experiment = t.experiment),
      O(
        t,
        `시뮬레이션 ${t.rebirths + 1}회차를 시작했습니다. 기원 데이터 +${i}. 발견 도감과 영구 연구는 그대로입니다.`,
        "system",
      ),
      { ok: !0 }
    );
  }
  function Kt(t) {
    t.tick += 1;
    t.totalTicks += 1;
    const result = Et(t);
    chapterTick(t, result);
    return result;
  }
  var hn = 60;
  function se(t) {
    let e = (t * 2654435761) >>> 0;
    return (
      (e ^= e >>> 16),
      (e = Math.imul(e, 2246822507) >>> 0),
      (e ^= e >>> 13),
      (e >>> 0) / 4294967296
    );
  }
  function fn(t) {
    let e = [];
    for (let o of I)
      for (let s of C) {
        let a = t.pops[o][s];
        a > 0 && e.push({ sp: o, h: s, w: Math.pow(a, 0.75) });
      }
    let n = e.reduce((o, s) => o + s.w, 0);
    if (n <= 0) return [];
    let i = Math.min(hn, Math.max(e.length, Math.round(n)));
    return e.map((o) => ({
      sp: o.sp,
      h: o.h,
      n: Math.max(1, Math.floor((o.w / n) * i)),
    }));
  }
  var Pe = class {
    constructor(e, n) {
      this.canvas = e;
      this.reducedMotion = n;
      this.w = 0;
      this.h = 0;
      this.agents = [];
      this.selected = null;
      this.ctx = e.getContext("2d");
    }
    resize() {
      let e = Math.min(2, window.devicePixelRatio || 1),
        n = this.canvas.getBoundingClientRect();
      ((this.w = Math.max(200, Math.round(n.width))),
        (this.h = Math.max(160, Math.round(n.height))),
        (this.canvas.width = Math.round(this.w * e)),
        (this.canvas.height = Math.round(this.h * e)),
        this.ctx.setTransform(e, 0, 0, e, 0, 0));
    }
    habitatRect(e) {
      if (e === "tide")
        return { x0: this.w * 0.78, x1: this.w, y0: 0, y1: this.h };
      let n = this.w * 0.52;
      return e === "ocean"
        ? { x0: 0, x1: n, y0: 0, y1: this.h }
        : { x0: n, x1: this.w * 0.78, y0: 0, y1: this.h };
    }
    band(e) {
      if (["macroalgae", "sponge", "cnidarian"].includes(e)) return [0.25, 0.8];
      switch (e) {
        case "chemosynth_microbe":
          return [0.72, 0.94];
        case "photo_microbe":
          return [0.08, 0.4];
        case "grazer":
          return [0.2, 0.55];
        case "predator":
          return [0.35, 0.7];
        case "decomposer":
          return [0.78, 0.95];
        case "coastal_colony":
          return [0.55, 0.8];
      }
    }
    draw(e, n, i) {
      this.selected = i;
      let { ctx: o, w: s, h: a } = this,
        r = getComputedStyle(this.canvas),
        c = r.getPropertyValue("--sea-deep").trim() || "#173a4d",
        u = r.getPropertyValue("--sea-shallow").trim() || "#3f7f8f",
        m = r.getPropertyValue("--sand").trim() || "#b9a57e",
        l = r.getPropertyValue("--canvas-ink").trim() || "#e8f1f2",
        d = this.reducedMotion() ? 0 : n / 1e3,
        h = e.env.oxygen / 100,
        M = o.createLinearGradient(0, 0, 0, a);
      (M.addColorStop(0, u),
        M.addColorStop(1, c),
        (o.fillStyle = M),
        o.fillRect(0, 0, s, a),
        (o.fillStyle = `rgba(230, 245, 235, ${0.04 + h * 0.18})`),
        o.fillRect(0, 0, s, a * 0.35));
      let x = s * 0.16;
      ((o.fillStyle = "rgba(40, 30, 25, 0.85)"),
        o.beginPath(),
        o.moveTo(x - 22, a),
        o.lineTo(x - 7, a - 26),
        o.lineTo(x + 7, a - 26),
        o.lineTo(x + 22, a),
        o.closePath(),
        o.fill());
      let F = o.createRadialGradient(x, a - 28, 2, x, a - 28, 34);
      (F.addColorStop(0, "rgba(255, 170, 90, 0.55)"),
        F.addColorStop(1, "rgba(255, 170, 90, 0)"),
        (o.fillStyle = F),
        o.fillRect(x - 40, a - 70, 80, 70));
      let f = this.habitatRect("coast");
      ((o.fillStyle = m),
        o.beginPath(),
        o.moveTo(f.x0 - 10, a),
        o.quadraticCurveTo(f.x0 + (f.x1 - f.x0) * 0.4, a * 0.62, f.x1, a * 0.5),
        o.lineTo(f.x1, a),
        o.closePath(),
        (o.globalAlpha = 0.55),
        o.fill(),
        (o.globalAlpha = 1));
      let _ = Math.round(h * 18);
      ((o.strokeStyle = "rgba(235, 248, 250, 0.45)"), (o.lineWidth = 1));
      for (let y = 0; y < _; y++) {
        let G = se(y * 7 + 3) * s,
          K = a - ((se(y * 13 + 1) * a + d * (12 + se(y) * 10)) % a);
        (o.beginPath(),
          o.arc(G, K, 1.5 + se(y * 3) * 1.5, 0, Math.PI * 2),
          o.stroke());
      }
      this.agents = [];
      for (let y of fn(e)) {
        let G = this.habitatRect(y.h),
          [K, W] = this.band(y.sp);
        for (let j = 0; j < y.n; j++) {
          let X = I.indexOf(y.sp) * 1e3 + (y.h === "coast" ? 500 : 0) + j,
            qt = se(X * 3 + 1),
            Xt = se(X * 5 + 2),
            rt = y.sp === "coastal_colony" ? 1.5 : 10,
            at =
              G.x0 + 12 + qt * (G.x1 - G.x0 - 24) + Math.sin(d * 0.6 + X) * rt,
            ct =
              a * (K + Xt * (W - K)) + Math.cos(d * 0.5 + X * 1.7) * rt * 0.5;
          (this.agents.push({ sp: y.sp, h: y.h, idx: j, x: at, y: ct }),
            this.drawAgent(y.sp, at, ct, d + X));
        }
      }
      if (i) {
        ((o.strokeStyle = l), (o.lineWidth = 1.5));
        for (let y of this.agents)
          y.sp === i &&
            (o.beginPath(), o.arc(y.x, y.y, 9, 0, Math.PI * 2), o.stroke());
      }
      (Ue(e) ||
        ((o.fillStyle = "rgba(15, 25, 30, 0.55)"),
        o.fillRect(f.x0, 0, f.x1 - f.x0, a),
        (o.fillStyle = l),
        (o.font = "600 12px system-ui, sans-serif"),
        (o.textAlign = "center"),
        o.fillText("연안 미해금", (f.x0 + f.x1) / 2, a / 2)),
        (o.strokeStyle = "rgba(255,255,255,0.18)"),
        o.setLineDash([4, 4]),
        o.beginPath(),
        o.moveTo(f.x0, 0),
        o.lineTo(f.x0, a),
        o.stroke(),
        o.setLineDash([]),
        (o.fillStyle = l),
        (o.globalAlpha = 0.8),
        (o.font = "600 11px system-ui, sans-serif"),
        (o.textAlign = "left"),
        o.fillText("원시 바다", 8, 16),
        o.fillText("연안", f.x0 + 8, 16),
        o.beginPath(),
        o.moveTo(s * 0.78, 0),
        o.lineTo(s * 0.78, a),
        o.stroke(),
        o.fillText(
          b(e, "tidal_habitat") ? "조간대" : "2장 미해금",
          s * 0.78 + 3,
          32,
        ),
        (o.globalAlpha = 1));
    }
    drawAgent(e, n, i, o) {
      let s = this.ctx;
      switch (
        ((s.fillStyle = g[e].color),
        (s.strokeStyle = "rgba(255,255,255,0.55)"),
        (s.lineWidth = 0.8),
        s.beginPath(),
        e)
      ) {
        case "macroalgae":
          s.ellipse(n, i, 3, 9, 0, 0, Math.PI * 2);
          break;
        case "sponge":
          s.rect(n - 4, i - 5, 8, 10);
          break;
        case "cnidarian":
          s.arc(n, i, 6, Math.PI, Math.PI * 2);
          s.lineTo(n + 3, i + 6);
          s.lineTo(n - 3, i + 6);
          s.closePath();
          break;
        case "chemosynth_microbe": {
          for (let a = 0; a < 6; a++) {
            let r = (Math.PI / 3) * a,
              c = n + Math.cos(r) * 4,
              u = i + Math.sin(r) * 4;
            a === 0 ? s.moveTo(c, u) : s.lineTo(c, u);
          }
          s.closePath();
          break;
        }
        case "photo_microbe":
          s.arc(n, i, 3.6, 0, Math.PI * 2);
          break;
        case "grazer":
          s.ellipse(n, i, 6, 3.6, Math.sin(o) * 0.4, 0, Math.PI * 2);
          break;
        case "predator":
          (s.moveTo(n + 7, i),
            s.lineTo(n - 5, i - 4.5),
            s.lineTo(n - 5, i + 4.5),
            s.closePath());
          break;
        case "decomposer":
          s.rect(n - 2.6, i - 2.6, 5.2, 5.2);
          break;
        case "coastal_colony":
          (s.arc(n - 3, i, 3, 0, Math.PI * 2),
            s.moveTo(n + 6, i),
            s.arc(n + 3, i, 3, 0, Math.PI * 2),
            s.moveTo(n + 3, i - 4),
            s.arc(n, i - 4, 3, 0, Math.PI * 2));
          break;
      }
      (s.fill(), s.stroke());
    }
    pick(e, n) {
      let i = null,
        o = 484;
      for (let s of this.agents) {
        let a = (s.x - e) ** 2 + (s.y - n) ** 2;
        a < o && ((o = a), (i = s));
      }
      return i?.sp ?? null;
    }
  };
  var p = (t, e = document) => e.querySelector(t);
  function R(t) {
    return t.replace(
      /[&<>"']/g,
      (e) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[e],
    );
  }
  function w(t, e) {
    if (t.dataset.sig === e) return !1;
    let n = document.activeElement,
      i = n && t.contains(n) ? n.dataset.fk : void 0;
    return (
      (t.innerHTML = e),
      (t.dataset.sig = e),
      i &&
        t
          .querySelector(`[data-fk="${CSS.escape(i)}"]`)
          ?.focus({ preventScroll: !0 }),
      !0
    );
  }
  function re(t, e) {
    if (e.text)
      for (let n of t.querySelectorAll("[data-v]")) {
        let i = e.text[n.dataset.v];
        i !== void 0 && n.textContent !== i && (n.textContent = i);
      }
    if (e.disabled)
      for (let n of t.querySelectorAll("[data-dis]")) {
        let i = e.disabled[n.dataset.dis];
        i !== void 0 && n.disabled !== i && (n.disabled = i);
      }
    if (e.width)
      for (let n of t.querySelectorAll("[data-w]")) {
        let i = e.width[n.dataset.w];
        if (i !== void 0) {
          let o = `${Math.max(0, Math.min(1, i)) * 100}%`;
          n.style.width !== o && (n.style.width = o);
        }
      }
  }
  function be(t) {
    return Math.floor(t).toLocaleString("ko-KR");
  }
  function Q(t) {
    return (Math.round(t * 10) / 10).toLocaleString("ko-KR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  }
  function it(t) {
    return t <= 0 ? "0" : t < 10 ? Q(t) : be(t);
  }
  function ot(t) {
    let e = Math.floor(t / 60),
      n = t % 60;
    return `${e}:${String(n).padStart(2, "0")}`;
  }
  var _e = class {
    constructor(e, n) {
      this.host = e;
      this.cond = "control";
      this.sim = null;
      this.raf = 0;
      this.lastStepAt = 0;
      this.trails = new Map();
      this.endingDismissed = !1;
      this.timing = {};
      ((n.innerHTML = `
      <div id="exp-head"></div>
      <div id="exp-stage" hidden>
        <div class="seg" role="radiogroup" aria-label="실험 조건">
          ${U.map((i) => `<button type="button" role="radio" class="seg-btn" data-cond="${i}">${he[i]}</button>`).join("")}
        </div>
        <div class="exp-arena"><canvas id="exp-canvas" aria-label="가상 개체 반응 실험 화면. 아래 문장에 같은 측정값이 표시됩니다."></canvas></div>
        <div class="exp-controls">
          <button type="button" class="btn primary" id="exp-run">관찰 시작</button>
          <button type="button" class="btn" id="exp-light" hidden>빛을 오른쪽으로</button>
          <button type="button" class="btn" id="exp-record" disabled>결과 기록</button>
        </div>
        <p class="exp-live small" id="exp-live" aria-live="off"></p>
        <p class="sr-only" id="exp-announce" role="status" aria-live="polite"></p>
      </div>
      <div id="exp-records"></div>
      <div id="exp-done"></div>`),
        (this.head = p("#exp-head", n)),
        (this.stage = p("#exp-stage", n)),
        (this.canvas = p("#exp-canvas", n)),
        (this.live = p("#exp-live", n)),
        (this.recs = p("#exp-records", n)),
        (this.done = p("#exp-done", n)),
        n.addEventListener("click", (i) => {
          let o = i.target,
            s = o.closest("[data-cond]");
          if (s) return this.selectCond(s.dataset.cond);
          let a = o.closest("[data-exp]");
          if (!a) return;
          let r = a.dataset.exp;
          (r === "open" && this.open(),
            r === "complete" && this.complete(),
            r === "stay" &&
              ((this.endingDismissed = !0),
              this.host.save(),
              this.host.toast(
                "저장했습니다. 언제든 세계를 계속 관찰하거나 진화 탭에서 새 시뮬레이션을 시작할 수 있습니다.",
                3600,
              ),
              this.render()),
            r === "rebirth" && this.host.confirmRebirth());
        }),
        p("#exp-run", n).addEventListener("click", () => this.run()),
        p("#exp-record", n).addEventListener("click", () => this.record()),
        p("#exp-light", n).addEventListener("click", () => {
          this.sim &&
            (Tt(this.sim, this.sim.lightSide === "left" ? "right" : "left"),
            this.updateLive(),
            this.draw());
        }),
        window.addEventListener("resize", () => this.resize()));
    }
    get state() {
      return this.host.state;
    }
    isStageOpen() {
      return !this.stage.hidden;
    }
    open() {
      var e;
      fe(this.state).ok &&
        ((this.stage.hidden = !1),
        (e = this.timing).openedAt ?? (e.openedAt = performance.now()),
        this.resize(),
        this.selectCond(this.firstMissing() ?? "control"),
        this.render(),
        p("#exp-run").focus({ preventScroll: !0 }));
    }
    firstMissing() {
      return U.find((e) => !this.state.experiment.records[e]);
    }
    selectCond(e) {
      (this.stop(), (this.cond = e), (this.sim = null), this.trails.clear());
      for (let n of this.stage.querySelectorAll("[data-cond]")) {
        let i = n.dataset.cond === e;
        n.setAttribute("aria-checked", String(i));
        let o = !!this.state.experiment.records[n.dataset.cond];
        n.classList.toggle("done", o);
      }
      ((p("#exp-light").hidden = e !== "light"),
        (p("#exp-record").disabled = !0),
        (p("#exp-run").textContent = "관찰 시작"),
        (this.live.textContent = this.hint(e)),
        this.draw());
    }
    hint(e) {
      return e === "control"
        ? "대조군: 아무 자극도 주지 않고 개체가 어떻게 흩어지는지 봅니다. 다른 두 조건과 비교하는 기준입니다."
        : e === "light"
          ? "빛을 왼쪽에 켭니다. 관찰 중에 빛 방향을 바꿔 개체가 다시 방향을 트는지 볼 수 있습니다. 바꾼 뒤에는 5초를 더 지켜봐야 기록할 수 있어요."
          : "오른쪽 위 지점에서 먹이 신호(화학 물질)가 퍼집니다. 농도가 높아지면 계속 가고, 낮아지면 방향을 바꾸는 규칙입니다.";
    }
    run() {
      let e = Ft(this.state, this.cond);
      if (!e) return;
      ((this.sim = e),
        this.trails.clear(),
        (p("#exp-record").disabled = !0),
        (p("#exp-run").textContent = "다시 관찰"),
        (p("#exp-light").textContent = "빛을 오른쪽으로"),
        (this.lastStepAt = performance.now()),
        cancelAnimationFrame(this.raf));
      let n = () => {
        if (!this.sim) return;
        let i = performance.now(),
          o = 1e3 / v.stepsPerSecond,
          s = 0;
        for (; i - this.lastStepAt >= o && this.sim.step < v.maxSteps && s < 3;)
          (ze(this.sim), (this.lastStepAt += o), s++);
        (s && (this.updateLive(), this.draw()),
          this.sim.step < v.maxSteps && (this.raf = requestAnimationFrame(n)));
      };
      ((this.raf = requestAnimationFrame(n)), this.updateLive(), this.draw());
    }
    fastForward(e) {
      if (this.sim) {
        for (let n = 0; n < e && this.sim.step < v.maxSteps; n++) ze(this.sim);
        (this.updateLive(), this.draw());
      }
    }
    stop() {
      cancelAnimationFrame(this.raf);
    }
    updateLive() {
      let e = this.sim;
      if (!e) return;
      let n = Ie(e),
        i = (e.step / v.stepsPerSecond).toFixed(1),
        o = (v.recordAfter / v.stepsPerSecond).toFixed(0),
        s;
      e.cond === "light"
        ? ((s = `${i}초 \xB7 빛은 ${e.lightSide === "left" ? "왼쪽" : "오른쪽"} \xB7 빛 쪽 절반 ${H(n.lightHalf)} \xB7 방향 일치 ${n.alignment.toFixed(2)}`),
          (p("#exp-light").textContent =
            e.lightSide === "left" ? "빛을 오른쪽으로" : "빛을 왼쪽으로"))
        : e.cond === "food"
          ? (s = `${i}초 \xB7 먹이 근처 ${H(n.nearFood)} \xB7 평균 거리 ${n.meanFoodDist.toFixed(2)}`)
          : (s = `${i}초 \xB7 오른쪽 절반 ${H(n.lightHalf)} \xB7 먹이 근처 ${H(n.nearFood)} \xB7 방향 일치 ${n.alignment.toFixed(2)}`);
      let a = we(e),
        r = a === 0,
        c = p("#exp-light");
      c.disabled = !Rt(e);
      let u = p("#exp-record");
      u.disabled === r &&
        ((u.disabled = !r),
        r && (p("#exp-announce").textContent = "기록할 수 있습니다."));
      let m = Math.ceil(a / v.stepsPerSecond);
      this.live.textContent = `${s}${r ? " — 기록할 수 있습니다." : e.switches ? ` — 빛을 바꾼 뒤 ${o}초를 지켜봐야 기록할 수 있어요 (${m}초 남음).` : ` — ${o}초 이상 관찰하면 기록할 수 있어요 (${m}초 남음).`}`;
    }
    record() {
      if (!this.sim) return;
      let e = jt(this.state, this.sim);
      if (!e.ok) return this.host.toast(e.reason);
      (this.host.toast(e.msg ?? "기록했습니다."),
        (p("#exp-announce").textContent = e.msg ?? ""),
        this.host.save(),
        this.render());
      let n = this.firstMissing();
      n
        ? this.selectCond(n)
        : (this.stop(),
          this.selectCond(this.cond),
          p('[data-exp="complete"]')?.focus({ preventScroll: !0 }));
    }
    complete() {
      let e = Bt(this.state);
      if (!e.ok) return this.host.toast(e.reason);
      ((this.timing.completedAt = performance.now()),
        this.stop(),
        (this.stage.hidden = !0),
        (this.endingDismissed = !1),
        this.host.save(),
        this.host.renderAll(),
        p("#exp-done h3")?.focus?.());
    }
    render() {
      let e = this.state,
        n = b(e, A.requires),
        i = et(e);
      if (!n) {
        ((this.stage.hidden = !0),
          w(
            this.head,
            `<h3>최종 실험 \xB7 ${A.name}</h3>
        <p class="small muted">실험실에서 ${$(T(A.requires), "을/를")} 발견하면 바로 시작할 수 있습니다 (에너지 필요 없음). 먹이사슬 균형을 관찰한 뒤 포식 원생생물과 조합해 보세요.</p>`,
          ),
          w(this.recs, ""),
          w(this.done, ""));
        return;
      }
      if (e.finalResearchDone) {
        ((this.stage.hidden = !0),
          w(this.head, ""),
          w(this.recs, ""),
          w(this.done, this.doneHtml()));
        return;
      }
      w(
        this.head,
        `<h3>최종 실험 \xB7 ${A.name}</h3>
      <p class="small">작은 가상 개체 16마리를 세 가지 조건에서 관찰하고 비교합니다. 조건마다 ${v.recordAfter / v.stepsPerSecond}초 이상 지켜본 뒤 기록하세요. <strong>에너지는 필요 없습니다.</strong></p>
      <p class="small muted">기록 ${i}/3</p>
      ${this.stage.hidden ? '<button type="button" class="btn primary wide" data-exp="open" data-fk="exp-open">최종 실험 시작</button>' : ""}`,
      );
      let o = e.experiment.records,
        s = We(o);
      (w(
        this.recs,
        i === 0
          ? ""
          : `<h4>관찰 기록</h4><ul class="exp-recs">${U.filter((a) => o[a])
              .map(
                (a) => `<li><strong>${he[a]}</strong><br>${R(Ct(o[a]))}</li>`,
              )
              .join("")}</ul>
          ${s ? `<p class="cause">${R(s)}</p>` : ""}
          ${i === 3 ? `<button type="button" class="btn primary wide" data-exp="complete" data-fk="exp-complete" ${tt(e).ok ? "" : "disabled"}>실험 결과 정리</button>` : ""}`,
      ),
        w(this.done, ""));
    }
    doneHtml() {
      let n = this.state.experiment.records,
        i = We(n);
      return this.endingDismissed || this.state.chapter.entered
        ? `<h3>최종 실험 <span class="status-pill done">완료</span></h3>
        <p class="small">이번 시뮬레이션의 실험을 마쳤습니다. 새 시뮬레이션을 시작하면 기원 데이터 +${nt(this.state)}를 얻습니다.</p>
        <button type="button" class="btn wide" data-exp="rebirth" data-fk="exp-rebirth2">새 시뮬레이션 시작</button>`
        : `<h3 tabindex="-1">실험 완료 — 초기 감각 반응을 관찰했습니다</h3>
      ${i ? `<p class="cause">${R(i)}</p>` : '<p class="small">이전 저장에서 최종 연구를 완료한 기록입니다. 세 조건의 실험 측정값은 남아 있지 않습니다.</p>'}
      <div class="ending-copy small">
        <p><strong>무엇을 본 걸까요?</strong> 빛 쪽으로 방향을 트는 반응을 <em>주광성</em>, 화학 물질의 농도를 따라가는 반응을 <em>화학주성</em>이라고 합니다. 먹이 신호 실험의 규칙(농도가 오르면 직진, 내리면 방향 전환)은 세균이 실제로 쓰는 방식을 단순하게 흉내 낸 것입니다.</p>
        <p class="caveat"><strong>단순화 안내</strong> 이 실험은 교육용 작은 모형이며, 세계 탭 생태계의 집단 수치와는 별개입니다. 모든 생물이 이렇게 행동하는 것은 아니고, 감각이 처음 생긴 과정을 보여 주지도 않습니다.</p>
        <p><strong>첫 번째 장을 마쳤습니다.</strong> 여기서 마치거나 아래의 ‘다세포와 얕은 바다’로 이어갈 수 있습니다. 재시작 없이 새 생명을 탐험하세요. 첫 장 재시작 보상은 한 번만 받으며 현재 받을 수 있는 기원 데이터는 +${nt(this.state)}입니다.</p>
      </div>
      <div class="ending-actions">
        <button type="button" class="btn" data-exp="stay" data-fk="exp-stay">여기서 마치기</button>
        <button type="button" class="btn primary" data-exp="rebirth" data-fk="exp-rebirth">새 시뮬레이션 시작</button>
      </div>`;
    }
    resize() {
      if (this.stage.hidden) return;
      let e = Math.min(2, window.devicePixelRatio || 1),
        n = Math.max(
          200,
          Math.round(this.canvas.getBoundingClientRect().width),
        );
      ((this.canvas.width = Math.round(n * e)),
        (this.canvas.height = Math.round(n * e)),
        this.canvas.getContext("2d").setTransform(e, 0, 0, e, 0, 0),
        this.draw());
    }
    draw() {
      if (this.stage.hidden) return;
      let e = this.canvas.getContext("2d"),
        n = this.canvas.width / Math.min(2, window.devicePixelRatio || 1),
        i = n;
      ((e.fillStyle = "#0f2a33"), e.fillRect(0, 0, n, i));
      let o = this.sim,
        s = o?.cond ?? this.cond;
      if (s === "light") {
        let r = o?.lightSide ?? "left",
          c = r === "left" ? 0 : n,
          u = e.createLinearGradient(c, 0, n - c, 0);
        (u.addColorStop(0, "rgba(255, 226, 140, 0.55)"),
          u.addColorStop(0.5, "rgba(255, 226, 140, 0.06)"),
          u.addColorStop(1, "rgba(255, 226, 140, 0)"),
          (e.fillStyle = u),
          e.fillRect(0, 0, n, i),
          (e.fillStyle = "#ffe28c"),
          e.beginPath(),
          e.arc(r === "left" ? 14 : n - 14, i / 2, 8, 0, Math.PI * 2),
          e.fill());
      }
      if (s === "food") {
        let r = v.food.x * n,
          c = v.food.y * i,
          u = e.createRadialGradient(r, c, 2, r, c, n * 0.45);
        (u.addColorStop(0, "rgba(140, 220, 120, 0.55)"),
          u.addColorStop(1, "rgba(140, 220, 120, 0)"),
          (e.fillStyle = u),
          e.fillRect(0, 0, n, i),
          (e.strokeStyle = "rgba(200, 255, 190, 0.7)"),
          e.setLineDash([3, 3]),
          e.beginPath(),
          e.arc(r, c, v.nearFoodRadius * n, 0, Math.PI * 2),
          e.stroke(),
          e.setLineDash([]));
      }
      if (
        ((e.strokeStyle = "rgba(255,255,255,0.15)"),
        e.beginPath(),
        e.moveTo(n / 2, 0),
        e.lineTo(n / 2, i),
        e.stroke(),
        !o)
      ) {
        ((e.fillStyle = "rgba(235,245,245,0.85)"),
          (e.font = "600 13px system-ui, sans-serif"),
          (e.textAlign = "center"),
          e.fillText("관찰 시작을 누르세요", n / 2, i / 2));
        return;
      }
      let a = !this.host.reducedMotion();
      o.agents.forEach((r, c) => {
        let u = r.x * n,
          m = r.y * i;
        if (a) {
          let l = this.trails.get(c) ?? [];
          (l.push([u, m]),
            l.length > 12 && l.shift(),
            this.trails.set(c, l),
            (e.strokeStyle = "rgba(160, 220, 230, 0.25)"),
            e.beginPath(),
            l.forEach(([d, h], M) => (M ? e.lineTo(d, h) : e.moveTo(d, h))),
            e.stroke());
        }
        (e.save(),
          e.translate(u, m),
          e.rotate(r.h),
          (e.fillStyle = "#9fe0ea"),
          e.beginPath(),
          e.ellipse(0, 0, 6, 3.2, 0, 0, Math.PI * 2),
          e.fill(),
          (e.fillStyle = "#0f2a33"),
          e.beginPath(),
          e.arc(3.5, 0, 1.2, 0, Math.PI * 2),
          e.fill(),
          e.restore());
      });
    }
  };
  var Vt = {
    concept: "진화·생태 개념",
    species: "생물",
    environment: "서식지",
    base: "시작 재료",
    recipe: "조합 발견",
    observation: "생태계 관찰",
  };
  function zt(t) {
    return Vt[t];
  }
  function bn(t) {
    return `<p>${R(t.scienceDetail)}</p>${t.scienceCaveat ? `<p class="caveat"><strong>단순화 안내</strong> ${R(t.scienceCaveat)}</p>` : ""}`;
  }
  function He(t, e) {
    let n = e.title
        ? `<p class="ex-title"><strong>${R(t.name)}</strong> <span class="muted small">${Vt[t.kind]}</span></p>`
        : "",
      i =
        e.species && t.species
          ? `<dl class="ex-species"><dt>무엇을 먹나</dt><dd>${R(t.species.diet)}</dd><dt>에너지를 얻는 법</dt><dd>${R(t.species.energySource)}</dd><dt>주변에 주는 영향</dt><dd>${R(t.species.impact)}</dd></dl>`
          : "";
    return `${n}<p class="ex-plain">${R(t.plainSummary)}</p>
    ${e.brief ? "" : `<p class="ex-game"><span class="ex-label">게임 속 역할</span>${R(t.inGameEffect)}</p>`}
    ${i}
    <details class="ex-more"><summary data-fk="more-${R(e.key)}">더 알아보기</summary>${e.brief ? `<p class="ex-game"><span class="ex-label">게임 속 역할</span>${R(t.inGameEffect)}</p>` : ""}${bn(t)}</details>`;
  }
  var z = (t) =>
      `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${t}</svg>`,
    ae = {
      world: z(
        '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.6 2.4 3.8 5.2 3.8 8.5s-1.2 6.1-3.8 8.5c-2.6-2.4-3.8-5.2-3.8-8.5S9.4 5.9 12 3.5z"/>',
      ),
      lab: z(
        '<path d="M9.5 3.5h5"/><path d="M10.5 3.5v6L5 19a1.5 1.5 0 0 0 1.3 2.2h11.4A1.5 1.5 0 0 0 19 19l-5.5-9.5v-6"/><path d="M7.5 15h9"/>',
      ),
      evo: z(
        '<path d="M12 21V11"/><path d="M12 11 7 6"/><path d="M12 11l5-5"/><circle cx="7" cy="5" r="1.6"/><circle cx="17" cy="5" r="1.6"/><circle cx="12" cy="21" r="0.6"/><path d="M12 15l-3.5-2.5"/>',
      ),
      log: z(
        '<path d="M5 4.5h10.5a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h10.5"/><path d="M9 8h6"/>',
      ),
      probe: z(
        '<path d="M12 3v6"/><path d="M8.5 9h7l-1.5 4h-4z"/><path d="M12 13v8"/><path d="M5 18.5c2-1 3-1 3.5 0"/><path d="M15.5 18.5c.5-1 1.5-1 3.5 0"/>',
      ),
      plus: z('<path d="M12 5v14M5 12h14"/>'),
      x: z('<path d="M6 6l12 12M18 6 6 18"/>'),
      lock: z(
        '<rect x="5.5" y="10.5" width="13" height="9.5" rx="1.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
      ),
      restart: z(
        '<path d="M4.5 12a7.5 7.5 0 1 0 2.3-5.4"/><path d="M4.5 4.5v3.8h3.8"/>',
      ),
      eye: z(
        '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
      ),
    };
  var q = [
      { id: "world", label: "세계", icon: ae.world },
      { id: "lab", label: "실험실", icon: ae.lab },
      { id: "evo", label: "진화", icon: ae.evo },
      { id: "log", label: "기록", icon: ae.log },
    ],
    gn = 10;
  function vn() {
    try {
      let t = "__originLab_probe";
      return (
        window.localStorage.setItem(t, "1"),
        window.localStorage.removeItem(t),
        window.localStorage
      );
    } catch {
      return null;
    }
  }
  var Ge = class {
    constructor(e) {
      this.tab = "world";
      this.slots = [null, null];
      this.selectedSpecies = null;
      this.selectedCodex = null;
      this.placeHabitat = "ocean";
      this.badges = new Set();
      this.toastTimer = 0;
      this.discoveryCard = null;
      this.lastDraw = 0;
      ((this.storage = vn()), (this.state = le(e)));
      let n = null;
      if (this.storage) {
        let i = Pt(this.storage);
        i.status === "ok"
          ? ((this.state = i.state), i.notes?.length && (n = i.notes.join(" ")))
          : i.status === "rejected" &&
            (n = `${i.reason} 기존 저장은 백업해 두고 새 실험을 시작합니다.`);
      } else
        n =
          "이 브라우저에서는 저장할 수 없습니다. 진행은 창을 닫으면 사라집니다.";
      ((this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)")),
        (this.renderer = new Pe(
          p("#world-canvas"),
          () => this.reduced.matches,
        )),
        (this.loop = new Ee(
          {
            now: () => performance.now(),
            request: (i) => requestAnimationFrame(i),
            cancel: (i) => cancelAnimationFrame(i),
          },
          () => this.onTick(),
          () => this.onFrame(),
        )),
        I.some((i) => b(this.state, i)) ||
          ((this.tab = "lab"), (document.body.dataset.tab = "lab")),
        (this.exp = new _e(this, p("#exp-card"))),
        this.buildTabs(),
        this.wire(),
        this.renderAll(),
        this.renderer.resize(),
        this.draw(!0),
        n && this.toast(n, 6e3));
    }
    start() {
      this.loop.start();
    }
    onTick() {
      if (this.storage && storageManager(this.storage).blocked) return;
      let e = new Set(this.state.discovered),
        n = Kt(this.state);
      for (let i of this.state.discovered) e.has(i) || this.onNewDiscovery(i);
      (n.extinct.length && this.badge("world"),
        this.state.tick % gn === 0 && this.save(),
        this.renderAll(),
        this.reduced.matches && this.draw(!0));
    }
    onFrame() {
      this.reduced.matches ||
        performance.now() - this.lastDraw < 33 ||
        this.draw();
    }
    draw(e = !1) {
      (!e && this.tab !== "world" && !this.isWide()) ||
        ((this.lastDraw = performance.now()),
        this.renderer.draw(
          this.state,
          performance.now(),
          this.selectedSpecies,
        ));
    }
    isWide() {
      return window.matchMedia("(min-width: 1024px)").matches;
    }
    save() {
      const ok = this.storage ? Je(this.storage, this.state) : false;
      this.renderStorageStatus?.();
      return ok;
    }
    reducedMotion() {
      return this.reduced.matches;
    }
    onNewDiscovery(e) {
      let n = B[e];
      n &&
        ((this.discoveryCard = e),
        n.kind === "observation" &&
          (this.toast(
            `관찰 기록: ${$(n.name, "을/를")} 실험실 재료로 쓸 수 있습니다.`,
          ),
          this.badge("lab")),
        I.includes(e) && this.badge("world"),
        e === A.requires && this.badge("evo"));
    }
    badge(e) {
      this.tab === e ||
        this.isWide() ||
        (this.badges.add(e), this.renderTabs());
    }
    buildTabs() {
      for (let e of q) {
        let n = p(`#tab-${e.id}`);
        n.innerHTML = `${e.icon}<span>${e.label}</span>`;
      }
      this.renderTabs();
    }
    setTab(e, n = !1) {
      ((this.tab = e),
        this.badges.delete(e),
        (document.body.dataset.tab = e),
        this.renderTabs(),
        e === "world" &&
          requestAnimationFrame(() => {
            (this.renderer.resize(), this.draw(!0));
          }),
        n && p(`#panel-${e}`).focus({ preventScroll: !0 }),
        window.scrollTo({ top: 0 }));
    }
    renderTabs() {
      for (let e of q) {
        let n = p(`#tab-${e.id}`),
          i = e.id === this.tab;
        (n.setAttribute("aria-selected", String(i)), (n.tabIndex = i ? 0 : -1));
        let o = n.querySelector(".badge");
        this.badges.has(e.id) && !o
          ? ((o = document.createElement("span")),
            (o.className = "badge"),
            o.setAttribute("aria-label", "새 소식"),
            n.appendChild(o))
          : !this.badges.has(e.id) && o && o.remove();
      }
    }
    wire() {
      (p(".tabbar").addEventListener("click", (n) => {
        let i = n.target.closest("[data-tab]");
        i && this.setTab(i.dataset.tab);
      }),
        p(".tabbar").addEventListener("keydown", (n) => {
          let i = q.findIndex((s) => s.id === this.tab),
            o = -1;
          (n.key === "ArrowRight" && (o = (i + 1) % q.length),
            n.key === "ArrowLeft" && (o = (i + q.length - 1) % q.length),
            n.key === "Home" && (o = 0),
            n.key === "End" && (o = q.length - 1),
            o >= 0 &&
              (n.preventDefault(),
              this.setTab(q[o].id),
              p(`#tab-${q[o].id}`).focus()));
        }),
        p("#probe").addEventListener("click", () => {
          (_t(this.state),
            this.renderHUD(),
            this.renderWorld(),
            this.renderEvo());
        }));
      let e = p("#world-canvas");
      (e.addEventListener("click", (n) => {
        let i = e.getBoundingClientRect(),
          o = this.renderer.pick(n.clientX - i.left, n.clientY - i.top);
        o && this.selectSpecies(o);
      }),
        p("#species-card").addEventListener("click", (n) => {
          let i = n.target,
            o = i.closest("[data-select]");
          if (o) return this.selectSpecies(o.dataset.select);
          let s = i.closest("[data-place]");
          if (s) {
            let [a, r] = s.dataset.place.split("@");
            (this.act(Ze(this.state, a, r)),
              (this.selectedSpecies = a),
              this.renderAll());
          }
        }),
        p("#detail-card").addEventListener("click", (n) => {
          let i = n.target.closest("[data-place]");
          if (i) {
            let [o, s] = i.dataset.place.split("@");
            (this.act(Ze(this.state, o, s)), this.renderAll());
          }
        }),
        p("#env-card").addEventListener("click", (n) => {
          let i = n.target.closest("[data-inject]");
          i &&
            (this.act(
              Ht(this.state, i.dataset.inject),
              "영양분을 주입했습니다.",
            ),
            this.renderAll());
        }),
        p("#inventory").addEventListener("click", (n) => {
          let i = n.target.closest("[data-item]");
          i && this.pickItem(i.dataset.item);
        }),
        p("#slot-a").addEventListener("click", () => this.clearSlot(0)),
        p("#slot-b").addEventListener("click", () => this.clearSlot(1)),
        p("#combine").addEventListener("click", () => this.doCombine()),
        p("#evo-body").addEventListener("click", (n) => {
          let i = n.target.closest("[data-act]");
          if (!i) return;
          let [o, s] = i.dataset.act.split(":");
          if (
            (o === "run" && this.act(Gt(this.state, s)),
            o === "theory" &&
              this.act(Nt(this.state, s), "이론을 정리했습니다."),
            o === "perm" &&
              this.act(Ot(this.state, s), "영구 연구를 완료했습니다."),
            o === "rebirth")
          )
            return this.confirmRebirth();
          (this.save(), this.renderAll());
        }),
        p("#log-body").addEventListener("change", (n) => {
          let i = n.target;
          (i.dataset.act === "brief" &&
            ((this.state.settings.briefCards = i.checked),
            this.save(),
            this.renderLab(),
            this.toast(
              i.checked
                ? "발견 카드는 쉬운 한 줄만 먼저 보여 줍니다."
                : "발견 카드에 게임 속 역할까지 보여 줍니다.",
            )),
            i.id === "import-file" &&
              i.files?.[0] &&
              (i.files[0].text().then((o) => this.importSaveText(o)),
              (i.value = "")));
        }),
        p("#disc-card").addEventListener("click", (n) => {
          n.target.closest('[data-act="close-card"]') &&
            ((this.discoveryCard = null),
            this.renderLab(),
            p("#combine").focus({ preventScroll: !0 }));
        }),
        p("#log-body").addEventListener("click", (n) => {
          let i = n.target,
            o = i.closest("[data-codex]");
          (o && ((this.selectedCodex = o.dataset.codex), this.renderLog()),
            i.closest('[data-act="reset"]') && this.confirmReset(),
            i.closest('[data-act="export"]') && this.exportSave(),
            i.closest('[data-act="import"]') && p("#import-file").click());
        }),
        window.addEventListener("resize", () => {
          (this.renderer.resize(), this.draw(!0));
        }),
        document.addEventListener("visibilitychange", () => {
          document.visibilityState === "hidden" && this.save();
        }),
        window.addEventListener("pagehide", () => this.save()));
    }
    act(e, n) {
      return e.ok
        ? ((e.msg || n) && this.toast(e.msg ?? n), !0)
        : (this.toast(e.reason), !1);
    }
    toast(e, n = 2600) {
      let i = p("#toast");
      ((i.textContent = e),
        i.classList.add("show"),
        window.clearTimeout(this.toastTimer),
        (this.toastTimer = window.setTimeout(
          () => i.classList.remove("show"),
          n,
        )));
    }
    pickItem(e) {
      (this.slots[0] === null
        ? (this.slots[0] = e)
        : this.slots[1] === null
          ? (this.slots[1] = e)
          : (this.slots = [e, null]),
        this.renderLab());
    }
    clearSlot(e) {
      ((this.slots[e] = null), this.renderLab());
    }
    doCombine() {
      let [e, n] = this.slots,
        i = p("#mix-result");
      if (((i.className = "mix-result"), !e || !n)) {
        i.textContent = "재료 두 개를 먼저 고르세요.";
        return;
      }
      let o = yt(this.state, e, n);
      (o.kind === "new"
        ? (i.classList.add("new"),
          (i.textContent = `새 발견: ${T(o.out)}!${o.insight ? ` 통찰 +${o.insight}.` : ""} 아래 카드에서 무엇인지 볼 수 있어요.`),
          this.onNewDiscovery(o.out),
          (this.slots = [null, null]),
          this.save())
        : o.kind === "known"
          ? ((i.textContent = `이미 발견한 조합입니다: ${T(o.out)}. 보상은 처음 한 번만 받습니다.`),
            (this.slots = [null, null]))
          : o.kind === "fail"
            ? (i.classList.add("fail"),
              (i.textContent = `${$(T(e), "과/와")} ${T(n)}: 반응이 없습니다. 재료는 그대로 남아 있습니다.`),
              (this.slots = [null, null]))
            : (i.textContent = o.reason),
        this.renderAll());
    }
    selectSpecies(e) {
      this.selectedSpecies = e;
      let n = g[e];
      (n.habitats.includes(this.placeHabitat) ||
        (this.placeHabitat = n.habitats[0]),
        this.renderWorld(),
        this.draw(!0));
    }
    confirm(e, n, i, o) {
      let s = p("#confirm");
      ((p("#confirm-title").textContent = e),
        (p("#confirm-body").innerHTML = n),
        (p("#confirm-ok").textContent = i),
        (s.returnValue = ""),
        (s.onclose = () => {
          s.returnValue === "ok" ? o() : this.toast("취소했습니다.");
        }),
        s.showModal(),
        p("#confirm-cancel").focus());
    }
    confirmRebirth() {
      let e = nt(this.state);
      this.confirm(
        "시뮬레이션을 재시작할까요?",
        `<p>기원 데이터 <strong>+${e}</strong>를 얻고 ${this.state.rebirths + 2}회차를 시작합니다.</p>
       <ul class="keep-list"><li>유지: 발견 도감 ${this.state.discovered.length}/${Y.length}, 통찰\xB7이론, 영구 연구, 기원 데이터, 최종 실험 기록, 장 해금</li>
       <li>초기화: 진화 에너지, 모든 종 인구, 환경, 관찰 진행, 장비</li></ul>
       <p class="small muted">재시작은 생태계 실험을 위한 선택입니다. 첫 장 보상은 한 번만 받으며, 두 번째 장은 반복 없이 바로 탐험할 수 있습니다.</p>`,
        "재시작",
        () => {
          this.act(Ut(this.state, !0)) &&
            ((this.selectedSpecies = null),
            (this.exp.endingDismissed = !1),
            (this.exp.timing = {}),
            this.save(),
            this.renderAll(),
            this.draw(!0),
            this.toast(`기원 데이터 +${e}. 영구 연구를 고를 수 있습니다.`));
        },
      );
    }
    exportSave() {
      let e = new Blob([Ye(this.state)], { type: "application/json" }),
        n = document.createElement("a");
      ((n.href = URL.createObjectURL(e)),
        (n.download = `origin-lab-save-${new Date().toISOString().slice(0, 10)}.json`),
        document.body.appendChild(n),
        n.click(),
        n.remove(),
        setTimeout(() => URL.revokeObjectURL(n.href), 1e3),
        this.toast("저장 파일을 내보냈습니다."));
    }
    renderAll() {
      (this.renderHUD(),
        this.renderWorld(),
        this.renderLab(),
        this.renderEvo(),
        this.exp.render(),
        this.renderLog(),
        this.renderChapter(),
        this.renderStorageStatus());
    }
    renderHUD() {
      let e = this.state;
      ((p("#hud-energy").textContent = be(e.energy)),
        (p("#hud-rate").textContent = `+${Q(e.energyPerSec)}/초`),
        (p("#hud-insight").textContent = be(e.insight)),
        (p("#hud-disc").textContent = `${e.discovered.length}/${Y.length}`),
        (p("#hud-run").textContent =
          `${e.rebirths + 1}회차 \xB7 ${ot(e.tick)}`),
        (p("#probe-gain").textContent = `+${ye(e)} 에너지`));
    }
    renderWorld() {
      let e = this.state,
        n = p("#env-card"),
        i = C.filter((d) => V(e, d)),
        o = Qe(e);
      w(
        n,
        `<h3>환경</h3>
      <div class="bars"><div class="bar-row"><span>산소</span><div class="bar o2" role="presentation"><i data-w="o2"></i></div><span class="bar-val" data-v="o2"></span></div></div>
      ${i
        .map(
          (
            d,
          ) => `<div class="hab-block"><div class="hab-head"><strong>${D[d]}</strong>
          <button type="button" class="btn small" data-inject="${d}" data-dis="inj-${d}" data-fk="inj-${d}">영양분 주입 <span class="cost">−${o}</span></button></div>
          <div class="bars">
            <div class="bar-row"><span>영양분</span><div class="bar nu"><i data-w="nu-${d}"></i></div><span class="bar-val" data-v="nu-${d}"></span></div>
            <div class="bar-row"><span>유기물</span><div class="bar org"><i data-w="org-${d}"></i></div><span class="bar-val" data-v="org-${d}"></span></div>
          </div></div>`,
        )
        .join("")}
      ${i.length < 2 ? '<p class="note">연안 서식지는 실험실에서 연안 환경을 발견하면 열립니다.</p>' : ""}`,
      );
      let s = { o2: Q(e.env.oxygen) },
        a = { o2: e.env.oxygen / 100 },
        r = {};
      for (let d of i)
        ((s[`nu-${d}`] = Q(e.env.hab[d].nutrients)),
          (s[`org-${d}`] = Q(e.env.hab[d].organic)),
          (a[`nu-${d}`] = e.env.hab[d].nutrients / 100),
          (a[`org-${d}`] = e.env.hab[d].organic / 100),
          (r[`inj-${d}`] = e.energy < o || e.env.hab[d].nutrients >= 99.5));
      re(n, { text: s, width: a, disabled: r });
      let c = p("#species-card"),
        u = I.filter((d) => b(e, d));
      w(
        c,
        `<h3>생물 <span class="muted small">(${u.length}/${I.length} 발견)</span></h3>
      ${
        u.length === 0
          ? '<p class="empty">아직 세계에 들일 생물이 없습니다. 실험실에서 첫 생물을 발견하면 여기서 배치할 수 있습니다. 발견만으로는 배치되지 않습니다.</p>'
          : `<div class="sp-list">${u
              .map((d) => {
                let h = g[d],
                  M = h.habitats.filter((x) => V(e, x));
                return `<div class="sp-row" aria-current="${this.selectedSpecies === d}">
                  <button type="button" class="sp-name" data-select="${d}" data-fk="sel-${d}" aria-expanded="${this.selectedSpecies === d}">
                    <span class="sp-swatch" style="background:${h.color}"></span><span>${h.name}</span></button>
                  <div class="sp-pop">${h.habitats.map((x) => `${D[x]} <span data-v="pop-${d}-${x}"></span>/${h.K[x]}`).join(" \xB7 ")}</div>
                  <div class="sp-actions">${M.map((x) => `<button type="button" class="btn" data-place="${d}@${x}" data-dis="pl-${d}-${x}" data-fk="pl-${d}-${x}">${D[x]}에 <span data-v="plv-${d}-${x}"></span><span class="cost">−${h.cost}</span></button>`).join("")}${M.length < h.habitats.length ? '<span class="muted small">서식지를 먼저 발견하세요.</span>' : ""}</div>
                </div>`;
              })
              .join("")}</div>`
      }`,
      );
      let m = {},
        l = {};
      for (let d of u)
        for (let h of g[d].habitats)
          ((m[`pop-${d}-${h}`] = it(e.pops[d][h])),
            (m[`plv-${d}-${h}`] = e.pops[d][h] > 0 ? "보충" : "배치"),
            (l[`pl-${d}-${h}`] = !De(e, d, h).ok));
      (re(c, { text: m, disabled: l }), this.renderDetail());
    }
    renderDetail() {
      let e = this.state,
        n = p("#detail-card"),
        i = this.selectedSpecies;
      if (!i || !b(e, i)) {
        w(
          n,
          '<h3>관찰</h3><p class="empty">세계 화면의 생물이나 목록의 이름을 누르면 개체 수, 먹이, 감소 원인을 볼 수 있습니다.</p>',
        );
        return;
      }
      let o = g[i],
        s = o.habitats.filter((c) => V(e, c));
      w(
        n,
        `<h3><span class="sp-swatch" style="display:inline-block;background:${o.color}"></span> ${o.name}</h3>
      ${s
        .map(
          (c) => `<h4>${D[c]}</h4>
        <dl>
          <dt>개체 수</dt><dd><span data-v="d-pop-${c}"></span> / ${o.K[c]}</dd>
          <dt>먹이 충족</dt><dd data-v="d-fed-${c}"></dd>
          <dt>산소 적합</dt><dd data-v="d-env-${c}"></dd>
          <dt>최근 변화</dt><dd data-v="d-trend-${c}"></dd>
        </dl>
        <p class="cause" data-v="d-cause-${c}"></p>
        <button type="button" class="btn wide" data-place="${i}@${c}" data-dis="d-pl-${c}" data-fk="d-pl-${c}"><span data-v="d-plv-${c}"></span> <span class="cost">−${o.cost}</span></button>`,
        )
        .join("")}
      <h4>이 생물은</h4>
      <div class="ex">${He(B[i], { species: !0, key: `sp-${i}` })}</div>`,
      );
      let a = {},
        r = {};
      for (let c of s) {
        let u = e.loss[P(i, c)],
          m = e.pops[i][c];
        ((a[`d-pop-${c}`] = it(m)),
          (a[`d-fed-${c}`] = m > 0 && u ? `${Math.round(u.fed * 100)}%` : "—"),
          (a[`d-env-${c}`] =
            m > 0 && u
              ? `${Math.round(u.envFit * 100)}%`
              : o.o2Min > -50
                ? `산소 ${o.o2Min} 이상 필요`
                : "산소 무관"));
        let l = u ? u.births - u.predation - u.starvation - u.natural : 0;
        a[`d-trend-${c}`] =
          m <= 0
            ? "없음"
            : l > 0.05
              ? `증가 (+${Q(l)}/초)`
              : l < -0.05
                ? `감소 (${Q(l)}/초)`
                : "안정";
        let d = m > 0 && l < -0.05 ? ke(e, i, c) : null;
        ((a[`d-cause-${c}`] =
          m <= 0
            ? `${D[c]}에 ${$(o.name, "이/가")} 없습니다. 아래 버튼으로 도입할 수 있습니다.`
            : (d ?? "뚜렷한 감소 원인이 없습니다.")),
          (a[`d-plv-${c}`] =
            m > 0
              ? `${D[c]}에 보충`
              : `${D[c]}에 ${m === 0 && e.claimed.includes(`place:${i}`) ? "재도입" : "배치"}`),
          (r[`d-pl-${c}`] = !De(e, i, c).ok));
      }
      re(n, { text: a, disabled: r });
    }
    renderLab() {
      let e = this.state,
        [n, i] = this.slots,
        o = p("#slot-a"),
        s = p("#slot-b");
      ((o.textContent = n ? T(n) : "재료 1"),
        (s.textContent = i ? T(i) : "재료 2"),
        o.classList.toggle("filled", !!n),
        s.classList.toggle("filled", !!i),
        o.setAttribute(
          "aria-label",
          n
            ? `첫 번째 재료: ${T(n)}. 누르면 비웁니다.`
            : "첫 번째 재료 칸 (비어 있음)",
        ),
        s.setAttribute(
          "aria-label",
          i
            ? `두 번째 재료: ${T(i)}. 누르면 비웁니다.`
            : "두 번째 재료 칸 (비어 있음)",
        ),
        (p("#combine").disabled = !(n && i)));
      let a = $t(e);
      p("#mix-hint").textContent =
        a > 0
          ? `지금 가진 재료로 찾을 수 있는 새 조합: ${a}개. 숫자 표시는 그 재료가 들어간 미발견 조합 수입니다.`
          : e.discovered.length >= Y.length
            ? "모든 항목을 발견했습니다."
            : "지금 재료로는 새 조합이 없습니다. 세계에서 생태계를 관찰하면 새 재료가 생깁니다.";
      let r = [
        ["시작 재료", Y.filter((l) => l.kind === "base")],
        [
          "발견물",
          Y.filter(
            (l) => l.kind !== "base" && l.kind !== "observation" && b(e, l.id),
          ),
        ],
        ["관찰", Y.filter((l) => l.kind === "observation" && b(e, l.id))],
      ];
      w(
        p("#inventory"),
        `<h3>재료 <span class="muted small">(${e.discovered.length}/${Y.length})</span></h3>
      ${r
        .filter(([, l]) => l.length)
        .map(
          ([l, d]) =>
            `<h4>${l}</h4><div class="chips">${d
              .map((h) => {
                let M = St(e, h.id),
                  x = n === h.id || i === h.id;
                return `<button type="button" class="chip${h.kind === "observation" ? " obs" : ""}" data-item="${h.id}" data-fk="it-${h.id}" aria-pressed="${x}">${R(h.name)}${M ? `<span class="dot" aria-label="미발견 조합 ${M}개">${M}</span>` : ""}</button>`;
              })
              .join("")}</div>`,
        )
        .join("")}`,
      );
      let c = p("#disc-card"),
        u = this.discoveryCard,
        m = u ? B[u] : null;
      ((c.hidden = !m),
        w(
          c,
          m
            ? `<div class="disc-head"><span class="status-pill done">새 발견</span><button type="button" class="btn small" data-act="close-card" data-fk="close-card" aria-label="발견 카드 닫기">닫기</button></div>
           ${He(m, { title: !0, brief: e.settings.briefCards, key: `disc-${m.id}` })}`
            : "",
        ));
    }
    renderEvo() {
      let e = this.state,
        n = p("#evo-body"),
        i = ee
          .map((r) => {
            let c = e.runUpgrades[r.id] ?? 0,
              u = c >= r.max,
              m = de(r, c);
            return `<div class="row"><div class="row-main"><strong>${r.name} <span class="muted small">${c}/${r.max}</span></strong><span>${r.desc}</span></div>
        <button type="button" class="btn" data-act="run:${r.id}" data-dis="run-${r.id}" data-fk="run-${r.id}">${u ? "최대" : `구매 <span class="cost">${be(m)}</span>`}</button></div>`;
          })
          .join(""),
        o = te
          .map((r) => {
            let c = e.theories.includes(r.id);
            return `<div class="row"><div class="row-main"><strong>${r.name}</strong><span>${r.desc}</span></div>
        <button type="button" class="btn" data-act="theory:${r.id}" data-dis="th-${r.id}" data-fk="th-${r.id}">${c ? "정리함" : `통찰 <span class="cost">${r.cost}</span>`}</button></div>`;
          })
          .join(""),
        s = J.map((r) => {
          let c = e.perms[r.id] ?? 0,
            u = Ae(r.id, c);
          return `<div class="row"><div class="row-main"><strong>${r.name} <span class="muted small">${c}/${r.costs.length}</span></strong><span>${r.desc}</span></div>
        <button type="button" class="btn" data-act="perm:${r.id}" data-dis="pm-${r.id}" data-fk="pm-${r.id}">${u === null ? "최대" : `기원 <span class="cost">${u}</span>`}</button></div>`;
        }).join("");
      w(
        n,
        `<div class="card">
        <h3>시뮬레이션 재시작</h3>
        <p class="small">${e.finalResearchDone ? `지금 재시작하면 기원 데이터 <strong>+${nt(e)}</strong>. 발견 도감과 영구 연구는 유지됩니다.` : "최종 실험을 마친 시뮬레이션만 재시작할 수 있습니다. 재시작은 선택이며, 하지 않아도 계속 플레이할 수 있습니다."}</p>
        <button type="button" class="btn wide" data-act="rebirth" data-dis="rebirth" data-fk="rebirth">${ae.restart} 재시작</button>
      </div>
      <div class="card"><h3>실험 장비 <span class="muted small">(이번 회차만)</span></h3>${i}</div>
      <div class="card"><h3>이론 <span class="muted small">(통찰 \xB7 영구)</span></h3>${o}</div>
      <div class="card"><h3>영구 연구 <span class="muted small">(기원 데이터 <span data-v="od"></span>)</span></h3>${s}</div>`,
      );
      let a = { rebirth: !e.finalResearchDone };
      for (let r of ee) {
        let c = e.runUpgrades[r.id] ?? 0;
        a[`run-${r.id}`] = c >= r.max || e.energy < de(r, c);
      }
      for (let r of te)
        a[`th-${r.id}`] = e.theories.includes(r.id) || e.insight < r.cost;
      for (let r of J) {
        let c = Ae(r.id, e.perms[r.id] ?? 0);
        a[`pm-${r.id}`] = c === null || e.originData < c;
      }
      re(n, { text: { od: String(e.originData) }, disabled: a });
    }
    renderLog() {
      let e = this.state,
        n = p("#log-body"),
        i = this.selectedCodex,
        o = i ? B[i] : null,
        s = i ? b(e, i) : !1,
        a = e.log
          .slice(-40)
          .reverse()
          .map(
            (r) =>
              `<li class="${r.kind}"><time>${ot(r.tick)}</time>${R(r.text)}</li>`,
          )
          .join("");
      (n.dataset.built ||
        ((n.innerHTML =
          '<div class="card" id="obs-card"></div><div class="card" id="codex-card"></div><div class="card" id="logs-card"></div><div class="card" id="save-card"></div>'),
        (n.dataset.built = "1")),
        w(
          p("#obs-card", n),
          `<h3>관찰 진행</h3>
        ${this.obsRow("oxygen_accumulation", `광합성 종이 살아 있고 산소 ${S.obsOxygen.o2} 이상을 ${S.obsOxygen.ticks}초 유지`, S.obsOxygen.ticks)}
        ${this.obsRow("trophic_balance", `광합성\xB7초식\xB7포식 생물이 모두 ${S.obsTrophic.minPop} 이상, 산소 ${S.obsTrophic.o2} 이상을 ${S.obsTrophic.ticks}초 유지`, S.obsTrophic.ticks)}`,
        ),
        w(
          p("#codex-card", n),
          `<h3>발견 도감 <span class="muted small">(${e.discovered.length}/${Y.length})</span></h3>
        <div class="codex">${Y.map((r) => {
          let c = b(e, r.id);
          return `<button type="button" class="${c ? "" : "unknown"}" data-codex="${r.id}" data-fk="cx-${r.id}" aria-pressed="${i === r.id}">${c ? R(r.name) : "???"}</button>`;
        }).join("")}</div>
        <div class="codex-desc" aria-live="polite">${o ? (s ? He(o, { title: !0, species: !0, key: `cx-${o.id}` }) : `<p><strong>???</strong> \xB7 <span class="muted">${zt(o.kind)}</span><br>아직 발견하지 않았습니다.</p>`) : '<p class="muted">항목을 누르면 쉬운 설명 \xB7 게임 속 역할 \xB7 더 알아보기를 볼 수 있어요.</p>'}</div>
        <p class="note">조합 규칙은 게임을 위한 상징적 단순화입니다. 실제 생명의 기원이나 그 순서를 그대로 보여 주지 않습니다.</p>`,
        ),
        w(
          p("#logs-card", n),
          `<h3>실험 기록</h3><ol class="log-list">${a}</ol>`,
        ),
        w(
          p("#save-card", n),
          `<h3>설정 \xB7 저장</h3>
        <label class="switch"><input type="checkbox" data-act="brief" data-fk="brief" ${e.settings.briefCards ? "checked" : ""}> <span>발견 설명 간략히 (쉬운 한 줄만 먼저 보기)</span></label>
        <p class="small muted">진행은 이 브라우저에 자동 저장됩니다 (10초마다, 창을 닫을 때). 저장은 브라우저와 파일 위치(주소)마다 따로일 수 있어요. 다른 위치\xB7브라우저로 옮길 때는 내보내기/가져오기를 쓰세요.</p>
        <div class="sp-actions">
          <button type="button" class="btn" data-act="export" data-fk="export">저장 내보내기 (JSON)</button>
          <button type="button" class="btn" data-act="import" data-fk="import">가져오기</button>
        </div>
        <input type="file" accept="application/json,.json" id="import-file" hidden>
        <p class="note">v0.1 구판 파일에는 내보내기 기능이 없어, 다른 위치에서 하던 v0.1 진행을 자동으로 옮겨 오지는 못합니다.</p>
        <button type="button" class="btn danger" data-act="reset" data-fk="reset">저장 모두 지우기</button>`,
        ),
        re(n, {
          text: {
            "obs-oxygen_accumulation": this.obsText(
              "oxygen_accumulation",
              S.obsOxygen.ticks,
            ),
            "obs-trophic_balance": this.obsText(
              "trophic_balance",
              S.obsTrophic.ticks,
            ),
          },
          width: {
            "obs-oxygen_accumulation": b(e, "oxygen_accumulation")
              ? 1
              : e.obsCounter.oxygen_accumulation / S.obsOxygen.ticks,
            "obs-trophic_balance": b(e, "trophic_balance")
              ? 1
              : e.obsCounter.trophic_balance / S.obsTrophic.ticks,
          },
        }));
    }
    obsRow(e, n, i) {
      return `<div class="row" style="display:block"><strong class="small">${T(e)}</strong>
      <div class="small muted">${n}</div>
      <div class="progress"><i data-w="obs-${e}"></i></div>
      <div class="small" data-v="obs-${e}"></div></div>`;
    }
    obsText(e, n) {
      if (b(this.state, e))
        return "관찰 완료 — 실험실 재료로 사용할 수 있습니다.";
      let i = Math.min(n, this.state.obsCounter[e]);
      return i > 0 ? `조건 유지 중 ${i}/${n}초` : "조건을 만족하지 않습니다.";
    }
  };
  /* CHAPTER_MODULE */
  var Wt = new URLSearchParams(location.search),
    st = Number(Wt.get("seed")),
    xn = Number.isFinite(st) && st > 0 ? Math.floor(st) : 1729,
    ge = new Ge(xn);
  ge.start();
  Wt.get("debug") === "1" &&
    (window.__originLab = {
      app: ge,
      core: {
        le,
        yt,
        Ze,
        Ht,
        Kt,
        Bt,
        Ut,
        nt,
        Ft,
        jt,
        Rt,
        It,
        U,
        Se,
        Y,
        I,
        C,
        g,
        enterChapter,
        observeChapter,
        chapterAction,
      },
      get state() {
        return ge.state;
      },
      advance(t) {
        ge.loop.advance(t);
      },
      stop() {
        ge.loop.stop();
      },
    });
})();
