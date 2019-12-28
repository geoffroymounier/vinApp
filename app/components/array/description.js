const caracteristiques = {
  price : {
    label:"Prix"
  }
}
const regions = [
  "--FRANCE-- " ,
  "Alsace",
  "Beaujolais",
  "Bourgogne",
  "Bordeaux",
  "Champagne",
  "Corse",
  "Languedoc",
  "Loire",
  "Provence",
  "Roussillon",
  "Vallée du Rhône",
  "Afrique du Sud",
  "Allemagne",
  "Argentine",
  "Autriche",
  "Australie",
  "Chili",
  "Croatie",
  "Espagne",
  "Italie",
  "Liban",
  "Portugal",
  "Nouvelle-Zélande"
]

const pastillesValues = ["Apéro",
  "Barbecue",
  "Occasion",
  "En Amoureux",
  "Été",
  "Plat d'Hiver",
  "Plat Salé",
  "Soirée",
  "Dessert"
]


// const pastillesValues = [
//   {label:"Apéro",color:"#530000"},
//   {label:"Barbecue",color:"#530000"},
//   {label:"Occasion",color:"#530000"},
//   {label:"En Amoureux",color:"#530000"},
//   {label:"Été",color:"#530000"},
//   {label:"Plat d'Hiver",color:"#530000"},
//   {label:"Autour d'un dîner",color:"#530000"}
// ]
const terrains = ["Marnes","Argiles"]
const typologie = ["Vin Tranquille","Effervescent","Vin Moelleux/Liquoreux","Vin Doux Naturel"]
const colors = {
  red : {label:"Rouge",color:"#E82D49"},
  white : {label:"Blanc",color:"#FFC401"},
  rose : {label:"Rosé",color:"#F89BA4"},
}

const cepageValues = {
    placeholder:"Cepage :",
    values: ["Pinot Noir","Pinot Gris"]
}

const dialog = {
  appelation : {
    title:"Appelation",
    message:"Entrez l'appelation de ce vin",
    placeholder:"Appelation"
  },
  domain : {
    title:"Domaine",
    message:"Entrez le domaine de ce vin",
    placeholder:"Domaine"
  }
}


const accordsValues = {
  aperitif:{
    icon: require("../../assets/aperitif.png"),
    color:'#353536',
    label:"Apéritif",
    values: [
      "Charcuterie",
      "Chèvre Frais",
      "Rillettes de Maquereau",
      "Rillettes de Thon",
      "Fromage Frais",
      "Pan Con Tomate",
      "Quiches Légumes",
      "Crevettes Mayonnaise",
      "Terrines",
      "Saumon Fumé",
      "Pizza"
    ]
  },
  legumes:{
    icon: require("../../assets/legume.png"),
    label:"Légumes",
    color:'#006600',
    values: [
      "Asperges",
      "Aubergines",
      "Champignons",
      "Courgettes",
      "Cêpes",
      "Epinards",
      "Endives Cuites",
      "Girolles",
      "Haricots Verts",
      "Fenouil",
      "Avocat",
      "Tomate",
      "Sauce Tomate",
      "Tian de Légumes",
      "Légumes Grillés",
      "Poivrons"
    ]

  },
  viandes:{
    icon: require("../../assets/viande.png"),
    label:"Viandes",
    color:'#660018',
    values: [
      "Tartare",
      "Viande Rouge Grillée",
      "Viande Rouge en Sauce",
      "Viande Rouge Rôtie",
      "Confit de Canard",
      "Magret de Canard",
      "Gibier",
      "Boudin Noir",
      "Veau",
      "Filet Mignon",
      "Saucisse de Toulouse",
      "Tournedos Rossigni",
      "Volaille Rôtie",
      "Volaille Crême"
    ]

  },
  poissons:{
    icon: require("../../assets/poisson.png"),
    label:"Poissons",
    color:'#001a66',
    values: [
      "Poisson Grillé",
      "Poisson Façon Meunière",
      "Poisson Sauce Crème",
      "Poisson Sauce Vierge",
      "Saint Jacques Snacké",
      "Saint Jacques Crème",
      "Poisson à Chair Blanche",
      "Poisson Gras",
      "Fruits de Mer",
      "Moules à la Crème",
      "Huîtres",
      "Sardines Grillées"
    ]
  },
  fromages:{
    icon: require("../../assets/fromage.png"),
    label:"Fromages",
    color:'#feb120',
    values: [
      "Abondance",
      "Beaufort",
      "Comté",
      "Gruyère Suisse",
      "Chèvre Frais",
      "Chabichou",
      "Crottin",
      "Pouligny Saint-Pierre",
      "Rocamadour",
      "Selles-sur-Cher",
      "Bleu",
      "Roquefort",
      "Osso-Iraty",
      "Tome de Brebis",
      "Brillat Savarin",
      "Brie",
      "Camembert",
      "Epoisse",
      "Livarot",
      "Mont d'Or",
      "Reblochon",
      "Munster",
      "Tome de Vache",
      "Vieux Gouda",
    ]
  },
  desserts:{
    icon: require("../../assets/dessert.png"),
    color:'#ff66d9',
    label:"Dessert",
    values: [
      "Chocolat",
      "Citron",
      "Charlotte aux Poires",
      "Tarte aux Pommes",
      "Tarte aux Abricots",
      "Poire Pochée"
    ]
  },
  cuisine_monde:{
    icon: require("../../assets/cuisine_monde.png"),
    color:'#994d00',
    label:"Cuisine du monde",
    values: [
      "Asiatique",
      "Sushis",
      "Indien",
      "Couscous de Légumes"
    ]
  }
}
const json = {
  vue : {
    label:"Vue",
    icon: require("../../assets/eye.png"),
    values: {
      red:[
        "Limpide",
        "Trouble",
        "Brillant",
        "Pâle",
        "Intense",
        "Ambré",
        "Larmes",
        "Bulles",
        "Rubis",
        "Pourpre",
        "Grenat",
        "Acajou"
      ],
      rose:[
        "Limpide",
        "Trouble",
        "Brillant",
        "Pâle",
        "Intense",
        "Ambré",
        "Rosé",
        "Orangé",
        "Larmes",
        "Bulles",
      ],
      white:[
        "Paille",
        "Jaune Citron",
        "Jaune Or",
        "Limpide",
        "Trouble",
        "Brillant",
        "Pâle",
        "Intense",
        "Larmes",
        "Bulles"
      ]
    }
  },
  nez : {
    label:"Nez",
    icon: require("../../assets/nose.png"),
    values: {
      red:[
        "Groseille",
        "Cerise",
        "Fraise",
        "Framboise",
        "Cassis",
        "Myrtille",
        "Mûre",
        "Cerise Noire",
        "Prune",
        "Noix",
        "Amande",
        "Rose",
        "Violette",
        "Pivoine",
        "Bourgeon de Cassis",
        "Champignon",
        "Truffe",
        "Cannelle",
        "Vanille",
        "Poivre",
        "Chêne",
        "Eucalyptus",
        "Cuir",
        "Chocolat Noir",
        "Café",
        "Caramel",
        "Note Fumée",
      ],
      rose:[
        "Groseille",
        "Cerise",
        "Fraise",
        "Framboise",
        "Pamplemousse",
        "Pomme",
        "Amande",
        "Rose",
        "Violette",
        "Fleurs séchées",
        "Poivron Vert",
        "Poivre"
      ],
        white:[
          "Citron",
          "Pamplemousse",
          "Orange",
          "Ananas",
          "Litchi",
          "Melon",
          "Muscat",
          "Pomme",
          "Poire",
          "Abricot",
          "Pêche",
          "Amande",
          "Noix",
          "Aubépine",
          "Acacia",
          "Tilleul",
          "Miel",
          "Rose",
          "Violette",
          "Fleur d'oranger",
          "Champignon",
          "Herbe Fraîche",
          "Fougère",
          "Anis",
          "Vanille",
          "Cannelle",
          "Clou de Girofle",
          "Safran",
          "Beurre",
          "Pain Grillé",
          "Amande Grillée",
          "Noisette",
          "Café",
          "Caramel",
          "Note Fumée",
      ]
    }
  },

  bouche : {
    label:"Bouche",
    icon: require("../../assets/mouth.png"),
    values: {
      red:[
        "Groseille",
        "Cerise",
        "Fraise",
        "Framboise",
        "Cassis",
        "Myrtille",
        "Mûre",
        "Cerise Noire",
        "Prune",
        "Noix",
        "Amande",
        "Rose",
        "Violette",
        "Pivoine",
        "Bourgeon de Cassis",
        "Champignon",
        "Truffe",
        "Cannelle",
        "Vanille",
        "Poivre",
        "Chêne",
        "Eucalyptus",
        "Cuir",
        "Chocolat Noir",
        "Café",
        "Caramel",
        "Note Fumée",
      ],
      rose:[
        "Groseille",
        "Cerise",
        "Fraise",
        "Framboise",
        "Pamplemousse",
        "Pomme",
        "Amande",
        "Rose",
        "Violette",
        "Fleurs séchées",
        "Poivron Vert",
        "Poivre"
      ],
        white:[
          "Citron",
          "Pamplemousse",
          "Orange",
          "Ananas",
          "Litchi",
          "Melon",
          "Muscat",
          "Pomme",
          "Poire",
          "Abricot",
          "Pêche",
          "Amande",
          "Noix",
          "Aubépine",
          "Acacia",
          "Tilleul",
          "Miel",
          "Rose",
          "Violette",
          "Fleur d'oranger",
          "Champignon",
          "Herbe Fraîche",
          "Fougère",
          "Anis",
          "Vanille",
          "Cannelle",
          "Clou de Girofle",
          "Safran",
          "Beurre",
          "Pain Grillé",
          "Amande Grillée",
          "Noisette",
          "Café",
          "Caramel",
          "Note Fumée",
      ]
    }
  },

}
export {caracteristiques,typologie,colors,cepageValues,dialog,json,regions,terrains,accordsValues,pastillesValues}
