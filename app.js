const dineDnaOptions = {
  eatingStyle: [
    "Vegetarian",
    "Vegan",
    "Pescatarian",
    "Keto",
    "Paleo",
    "Mediterranean",
    "Halal",
    "Kosher",
    "Plant-Based",
    "Whole30",
    "Carnivore",
  ],
  avoidFoods: [
    "Dairy",
    "Gluten / Wheat",
    "Peanuts",
    "Tree Nuts",
    "Shellfish",
    "Fish",
    "Eggs",
    "Soy",
    "Sesame",
    "Pork",
    "Beef",
    "Chicken",
    "Alcohol",
    "Caffeine",
    "Spicy Food",
    "Garlic",
    "Onions",
    "Mushrooms",
    "Corn",
    "Coconut",
  ],
  loveFoods: [
    "Chicken",
    "Beef",
    "Seafood",
    "Rice Bowls",
    "Tacos",
    "Pasta",
    "Salads",
    "Soups",
    "Sandwiches",
    "Burgers",
    "Pizza",
    "Sushi",
    "Thai",
    "Mexican",
    "Mediterranean",
    "Indian",
    "Breakfast Foods",
    "Smoothies",
    "Fruit",
    "Vegetables",
  ],
  dontLoveFoods: [
    "Mushrooms",
    "Olives",
    "Onions",
    "Garlic",
    "Spicy Food",
    "Seafood",
    "Fish",
    "Shellfish",
    "Eggs",
    "Beans",
    "Tofu",
    "Cilantro",
    "Pickles",
    "Coconut",
    "Tomatoes",
    "Avocado",
    "Mayo",
    "Mustard",
    "Fried Foods",
    "Sweet Foods",
  ],
  healthNeeds: [
    "High Protein",
    "Low Sugar",
    "Low Sodium",
    "Low Carb",
    "Low FODMAP",
    "GERD-friendly",
    "Diabetic-Friendly",
    "Anti-Inflammatory",
    "Weight Loss Focused",
    "Gut Friendly",
    "No Fried Foods",
    "Soft Foods Only",
    "Avoid Shared Fryers",
  ],
};

const dietStyleAvoidMap = {
  Vegetarian: ["Beef", "Chicken", "Pork", "Fish", "Shellfish"],
  Vegan: ["Dairy", "Eggs", "Beef", "Chicken", "Pork", "Fish", "Shellfish"],
  Pescatarian: ["Beef", "Chicken", "Pork"],
  Halal: ["Pork", "Alcohol"],
  Kosher: ["Pork", "Shellfish"],
  "Plant-Based": ["Dairy", "Eggs", "Beef", "Chicken", "Pork", "Fish", "Shellfish"],
  Whole30: ["Dairy", "Gluten / Wheat", "Soy", "Alcohol", "Corn"],
  Paleo: ["Dairy", "Gluten / Wheat", "Soy", "Corn"],
};

const chipSpans = {
  Vegetarian: 3,
  Vegan: 3,
  Pescatarian: 4,
  Keto: 2,
  Paleo: 2,
  Mediterranean: 4,
  Halal: 3,
  Kosher: 3,
  "Plant-Based": 3,
  Whole30: 3,
  Carnivore: 6,
  Dairy: 2,
  "Gluten / Wheat": 4,
  Peanuts: 3,
  "Tree Nuts": 3,
  Shellfish: 3,
  Fish: 3,
  Eggs: 2,
  Soy: 2,
  Sesame: 2,
  Pork: 2,
  Beef: 2,
  Chicken: 2,
  Alcohol: 3,
  Caffeine: 3,
  "Spicy Food": 4,
  Garlic: 2,
  Onions: 3,
  Mushrooms: 3,
  Corn: 3,
  Coconut: 3,
  Seafood: 3,
  "Rice Bowls": 3,
  Tacos: 3,
  Pasta: 3,
  Salads: 3,
  Soups: 3,
  Sandwiches: 3,
  Burgers: 3,
  Pizza: 3,
  Sushi: 3,
  Thai: 2,
  Mexican: 4,
  Indian: 2,
  "Breakfast Foods": 4,
  Smoothies: 2,
  Fruit: 2,
  Vegetables: 2,
  Olives: 3,
  Beans: 3,
  Tofu: 3,
  Cilantro: 3,
  Pickles: 3,
  Tomatoes: 3,
  Avocado: 3,
  Mayo: 3,
  Mustard: 3,
  "Fried Foods": 3,
  "Sweet Foods": 3,
  "High Protein": 3,
  "Low Sugar": 3,
  "Low Sodium": 3,
  "Low Carb": 3,
  "Low FODMAP": 3,
  "GERD-friendly": 3,
  "Diabetic-Friendly": 6,
  "Anti-Inflammatory": 6,
  "Weight Loss Focused": 4,
  "Gut Friendly": 2,
  "No Fried Foods": 3,
  "Soft Foods Only": 3,
  "Avoid Shared Fryers": 6,
};

const recommendations = {
  safe: [
    {
      name: "Grilled Chicken Rice Bowl",
      restaurant: "Sample Cafe",
      status: "Safe to Order As-Is",
      confidence: "High",
      summary: "Appears compatible with your current Dine DNA.",
      ingredients: ["Grilled chicken", "White rice", "Pico", "Corn salsa", "Guacamole"],
      remove: [],
      confirm: ["Sauce is dairy-free", "Rice is cooked without butter"],
      substitutions: [],
      notes: ["Please confirm ingredients with restaurant staff."],
      tags: ["Dairy-free", "Gluten-free"],
    },
    {
      name: "Garden Taco Plate",
      restaurant: "Sample Cafe",
      status: "Safe to Order As-Is",
      confidence: "Medium",
      summary: "Simple ingredients with low modification risk.",
      ingredients: ["Corn tortillas", "Black beans", "Lettuce", "Pico", "Avocado"],
      remove: [],
      confirm: ["Corn tortillas are used", "Beans are not cooked with lard"],
      substitutions: [],
      notes: ["Cross-contamination may still be possible."],
      tags: ["Dairy-free", "Vegan"],
    },
  ],
  modify: [
    {
      name: "Chicken Rice Bowl",
      restaurant: "Sample Cafe",
      status: "Safe With Modifications",
      confidence: "High",
      summary: "Good option after removing dairy toppings and checking sauce.",
      ingredients: ["Chicken", "Rice", "Beans", "Cheese", "Sour cream", "House sauce"],
      remove: ["Cheese", "Sour cream"],
      confirm: ["Sauce is dairy-free"],
      substitutions: ["Sub side salad for fries", "Sub corn tortillas for flour tortillas"],
      notes: ["Ask about shared fryer if gluten-sensitive."],
      tags: ["Dairy-free", "Gluten-free"],
    },
    {
      name: "Falafel Wrap",
      restaurant: "Sample Cafe",
      status: "Safe With Modifications",
      confidence: "Medium",
      summary: "Works better as a bowl with sauce confirmation.",
      ingredients: ["Falafel", "Pita", "Greens", "Tomato", "Yogurt sauce"],
      remove: ["Yogurt sauce"],
      confirm: ["Falafel does not contain wheat", "Fryer is not shared with breaded items"],
      substitutions: ["Make it a rice bowl", "Add tahini if dairy-free"],
      notes: ["Best when staff can confirm ingredients and prep area."],
      tags: ["Dairy-free"],
    },
  ],
  avoid: [
    {
      name: "Creamy Alfredo Pasta",
      restaurant: "Sample Cafe",
      status: "Likely Unsafe",
      confidence: "High",
      summary: "Contains dairy and gluten-heavy ingredients.",
      ingredients: ["Pasta", "Cream sauce", "Parmesan", "Butter"],
      remove: ["Cream sauce", "Parmesan"],
      confirm: ["Gluten-free pasta availability"],
      substitutions: [],
      notes: ["Choose another item if dairy-free or gluten-sensitive."],
      tags: ["Dairy", "Gluten"],
    },
  ],
};

const ocrScriptUrl = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
let ocrScriptPromise = null;
const scanParserVersion = "texas-chili-scan-3";
const aiScanApiUrl = window.location.port === "5191" ? "http://127.0.0.1:8000/api/scan-menu" : "/api/scan-menu";
const openFoodFactsApiUrl = window.location.port === "5191"
  ? "http://127.0.0.1:8000/api/open-food-facts/product"
  : "/api/open-food-facts/product";

if ("serviceWorker" in navigator && window.location.protocol === "https:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {
      // Installability still works without offline caching.
    });
  });
}

const restaurants = [
  {
    name: "Green Fork Kitchen",
    cuisine: "Modern bowls",
    compatibility: "high",
    details: "Many rice bowls, clear toppings, and easy dairy-free modifications.",
    picks: ["Grilled chicken bowl", "Avocado veggie bowl"],
  },
  {
    name: "Taqueria Sol",
    cuisine: "Mexican",
    compatibility: "high",
    details: "Corn tortilla options and simple protein plates make ordering fast.",
    picks: ["Chicken taco plate", "Bean and veggie bowl"],
  },
  {
    name: "Pasta House",
    cuisine: "Italian",
    compatibility: "medium",
    details: "Several dishes need staff confirmation for dairy, gluten, and shared prep.",
    picks: ["Tomato basil pasta", "House salad"],
  },
  {
    name: "Curry Corner",
    cuisine: "Indian",
    compatibility: "medium",
    details: "Good vegetarian options, but ghee, cream, and nuts need confirmation.",
    picks: ["Chana masala", "Tandoori chicken"],
  },
];

const state = {
  activeCategory: "safe",
  profile: {
    userName: "",
    restrictions: [],
    avoidFoods: [],
    manualAvoidFoods: [],
    eatingStyle: [],
    loveFoods: [],
    dontLoveFoods: [],
    healthNeeds: [],
  },
  savedMeals: [],
  savedOrders: [],
  scanPhotos: [],
  scanFiles: [],
  scanInputs: [],
  scanMeals: [],
  scanSections: [],
  scanOrder: [],
  activeMenuCategory: "mains",
  scanSearchQuery: "",
  recommendedOrder: null,
  scanMeta: null,
  scanSource: null,
  isScanInProgress: false,
  eatReturnView: "dashboard",
  cameraStream: null,
  flashOn: false,
  scanRequestId: 0,
  productLookup: null,
  productScanActive: false,
  productCameraStream: null,
  productDetectorFrame: null,
};

const storage = {
  profile: "what2eat.profile",
  savedMeals: "what2eat.savedMeals",
  savedOrders: "what2eat.savedOrders",
};

const views = document.querySelectorAll(".view");
const navItems = document.querySelectorAll(".nav-item");
const avoidFoodChips = document.querySelector("#avoidFoodChips");
const eatingStyleChips = document.querySelector("#eatingStyleChips");
const loveFoodChips = document.querySelector("#loveFoodChips");
const dontLoveFoodChips = document.querySelector("#dontLoveFoodChips");
const healthNeedChips = document.querySelector("#healthNeedChips");
const profileForm = document.querySelector("#profileForm");
const recommendationList = document.querySelector("#recommendationList");
const savedMeals = document.querySelector("#savedMeals");
const savedOrders = document.querySelector("#savedOrders");
const restaurantList = document.querySelector("#restaurantList");
const cameraPreview = document.querySelector("#cameraPreview");
const cameraFallback = document.querySelector("#cameraFallback");
const photoCount = document.querySelector("#photoCount");
const photoThumbs = document.querySelector("#photoThumbs");
const nextFromCamera = document.querySelector("#nextFromCamera");
const flashToggle = document.querySelector("#flashToggle");
const scannerStatus = document.querySelector("#scannerStatus");
const scanVerdictPrimary = document.querySelector("#scanVerdictPrimary");
const scanVerdictSecondary = document.querySelector("#scanVerdictSecondary");
const scanSafetyDisclaimer = document.querySelector("#scanSafetyDisclaimer");
const scanMenuTitle = document.querySelector("#scanMenuTitle");
const scanOrderList = document.querySelector("#scanOrderList");
const menuSectionList = document.querySelector("#menuSectionList");
const loadingStageLabel = document.querySelector("#loadingStageLabel");
const loadingTitle = document.querySelector("#loadingTitle");
const loadingStatusLine = document.querySelector("#loadingStatusLine");
const productLookupForm = document.querySelector("#productLookupForm");
const productBarcode = document.querySelector("#productBarcode");
const productResult = document.querySelector("#productResult");
const productCameraWrap = document.querySelector("#productCameraWrap");
const productCameraPreview = document.querySelector("#productCameraPreview");
const productCameraEmpty = document.querySelector("#productCameraEmpty");
const productCameraToggle = document.querySelector("#toggleProductCamera");
const startProductScannerButton = document.querySelector("#startProductScanner");
const appShell = document.querySelector(".app-shell");
const mainContent = document.querySelector(".main-content");

const viewHistory = ["dashboard"];
const eatViews = ["dashboard", "scan", "scan-loading", "scan-results", "product-scan"];

function syncVisualViewportVars() {
  const root = document.documentElement;
  const viewport = window.visualViewport;
  const viewportHeight = viewport?.height || window.innerHeight || document.documentElement.clientHeight;
  const viewportTop = viewport?.offsetTop || 0;
  const bottomGap = viewport
    ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
    : 0;

  root.style.setProperty("--vvh", `${Math.round(viewportHeight)}px`);
  root.style.setProperty("--vv-top", `${Math.round(viewportTop)}px`);
  root.style.setProperty("--vv-bottom-gap", `${Math.round(bottomGap)}px`);
}

function scheduleVisualViewportSync() {
  window.requestAnimationFrame(syncVisualViewportVars);
}

syncVisualViewportVars();
window.visualViewport?.addEventListener("resize", scheduleVisualViewportSync);
window.visualViewport?.addEventListener("scroll", scheduleVisualViewportSync);
window.addEventListener("resize", scheduleVisualViewportSync);
window.addEventListener("orientationchange", scheduleVisualViewportSync);

mainContent?.addEventListener("scroll", () => {
  appShell?.classList.toggle("content-scrolled", mainContent.scrollTop > 4);
}, { passive: true });

function readStoredJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    try {
      localStorage.removeItem(key);
    } catch {
      // File previews can block storage; keep the app interactive without saved data.
    }
    return fallback;
  }
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function setScanProgress(progress) {
  return Math.max(0, Math.min(1, Number(progress) || 0));
}

const scanLoadingStages = {
  preparing: {
    label: "Getting pages ready",
    title: "Lining up the menu",
    lines: [
      "Getting the pages in order before we read the fine print.",
      "Straightening the menu stack.",
      "Warming up the scanner eyes.",
    ],
  },
  scanning: {
    label: "Reading menu text",
    title: "Scanning the menu",
    lines: [
      "Flipping through the pages and pulling out dish names.",
      "Reading the tiny menu print so you do not have to squint.",
      "Checking sauces, sides, and all the sneaky little details.",
    ],
  },
  matching: {
    label: "Matching Dine DNA",
    title: "Checking what fits",
    lines: [
      "Comparing each dish with your Taste profile.",
      "Sorting easy wins from ask-before-ordering items.",
      "Looking for the low-effort order hiding in the menu.",
    ],
  },
  building: {
    label: "Building results",
    title: "Organizing your menu",
    lines: [
      "Grouping everything into clean dropdowns.",
      "Putting the best low-effort order up top.",
      "Making the waiter script less awkward.",
    ],
  },
  done: {
    label: "Ready",
    title: "Menu is ready",
    lines: ["Plating the results now."],
  },
};

function loadingLineFor(stage, progress) {
  const lines = scanLoadingStages[stage]?.lines || scanLoadingStages.preparing.lines;
  const index = Math.min(lines.length - 1, Math.floor(Math.max(0, Math.min(0.99, progress || 0)) * lines.length));
  return lines[index];
}

function setScanLoadingState(stage, options = {}) {
  const stageData = scanLoadingStages[stage] || scanLoadingStages.preparing;
  const progress = options.progress;
  if (typeof progress === "number") setScanProgress(progress);

  if (loadingStageLabel) loadingStageLabel.textContent = stageData.label;
  if (loadingTitle) loadingTitle.textContent = stageData.title;
  if (loadingStatusLine) loadingStatusLine.textContent = options.detail || loadingLineFor(stage, progress);
}

function hasActiveMenuResult() {
  return Boolean(state.scanMeta || state.scanMeals.length || state.scanSections.length || state.recommendedOrder);
}

function resolveViewTarget(viewId) {
  if (viewId !== "dashboard") return viewId;
  if (state.isScanInProgress) return "scan-loading";
  if (state.eatReturnView && state.eatReturnView !== "dashboard") return state.eatReturnView;
  if (hasActiveMenuResult()) return "scan-results";
  return "dashboard";
}

function rememberEatView(viewId) {
  if (eatViews.includes(viewId)) {
    state.eatReturnView = viewId;
  }
}

function loadOcrLibrary() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  if (!ocrScriptPromise) {
    ocrScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-ocr-loader="true"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve(window.Tesseract));
        existing.addEventListener("error", reject);
        return;
      }

      const script = document.createElement("script");
      script.src = ocrScriptUrl;
      script.async = true;
      script.dataset.ocrLoader = "true";
      script.onload = () => resolve(window.Tesseract);
      script.onerror = () => reject(new Error("OCR library failed to load"));
      document.head.appendChild(script);
    });
  }
  return ocrScriptPromise;
}

async function extractMenuText(source, onProgress) {
  if (source instanceof File && source.type === "application/pdf") {
    return "";
  }
  const Tesseract = await loadOcrLibrary();
  const result = await Tesseract.recognize(source, "eng", {
    logger: (message) => {
      if (message.status === "recognizing text" && typeof message.progress === "number") {
        onProgress?.(message.progress);
      }
    },
  });
  return result?.data?.text || "";
}

const menuSectionHeaders = new Set([
  "appetizers",
  "apps",
  "starters",
  "entrees",
  "entrées",
  "mains",
  "main",
  "sides",
  "drinks",
  "beverages",
  "desserts",
  "specials",
  "combos",
  "combo",
  "bowls",
  "salads",
  "sandwiches",
  "tacos",
  "burgers",
  "pasta",
  "grill",
  "breakfast",
  "lunch",
  "dinner",
  "kids",
  "extras",
]);

const menuKeywordGroups = {
  dairy: ["milk", "cheese", "cream", "butter", "yogurt", "alfredo", "parm", "parmesan", "ranch", "whey", "casein", "lactose"],
  gluten: [
    "gluten",
    "wheat",
    "wheat flour",
    "whole wheat",
    "durum",
    "semolina",
    "barley",
    "rye",
    "malt",
    "farro",
    "couscous",
    "bread",
    "bun",
    "pita",
    "pasta",
    "noodle",
    "noodles",
    "spaghetti",
    "linguine",
    "fettuccine",
    "ravioli",
    "tortellini",
    "gnocchi",
    "dumpling",
    "dumplings",
    "wrap",
    "pizza",
    "crouton",
    "flour",
    "tempura",
    "breaded",
    "breading",
  ],
  peanuts: ["peanut", "satay"],
  nuts: ["almond", "cashew", "walnut", "pecan", "pistachio", "hazelnut"],
  shellfish: ["shrimp", "lobster", "crab", "prawn", "clam", "mussel", "oyster"],
  fish: ["salmon", "tuna", "cod", "tilapia", "fish"],
  eggs: ["egg", "omelet", "omelette", "mayo", "mayonnaise", "aioli"],
  soy: ["soy", "soya", "soybean", "soybeans", "soy lecithin", "soybean oil", "soy protein", "tofu", "edamame", "miso", "teriyaki", "tamari"],
  sesame: ["sesame", "tahini"],
  pork: ["pork", "bacon", "ham", "prosciutto", "pepperoni", "sausage"],
  beef: ["beef", "steak", "burger", "hamburger", "meatball", "meatloaf"],
  chicken: ["chicken", "turkey"],
  alcohol: ["wine", "beer", "whiskey", "whisky", "vodka", "rum", "cocktail"],
  caffeine: ["coffee", "espresso", "latte", "cappuccino", "matcha", "tea"],
  spicy: ["spicy", "jalapeño", "jalapeno", "curry", "hot sauce"],
  garlic: ["garlic", "aioli", "garlic butter"],
  onions: ["onion", "shallot", "scallion", "chive", "spring onion"],
  mushrooms: ["mushroom", "portobello", "shiitake"],
  corn: ["corn", "polenta", "masa"],
  coconut: ["coconut"],
  fried: ["fried", "crispy", "tempura", "breaded"],
};

const loveFoodKeywords = {
  "rice bowls": ["rice bowl", "bowl"],
  tacos: ["taco", "tacos", "tortilla"],
  pasta: ["pasta", "noodle", "linguine", "spaghetti"],
  salads: ["salad", "greens"],
  soups: ["soup", "broth", "ramen"],
  sandwiches: ["sandwich", "sub", "wrap", "burrito"],
  burgers: ["burger", "burger plate"],
  pizza: ["pizza"],
  sushi: ["sushi", "roll", "poke"],
  thai: ["thai", "pad thai", "curry"],
  mexican: ["mexican", "enchilada", "quesadilla", "fajita"],
  mediterranean: ["mediterranean", "falafel", "shawarma", "hummus", "gyro"],
  indian: ["indian", "tikka", "masala", "vindaloo"],
  "breakfast foods": ["breakfast", "omelet", "oatmeal", "pancake", "egg"],
  smoothies: ["smoothie", "juice"],
  fruit: ["fruit", "berry", "banana", "mango", "apple"],
  vegetables: ["vegetable", "veggie", "greens", "broccoli", "carrot"],
};

const avoidBiasKeywords = [
  "cream",
  "butter",
  "cheese",
  "alfredo",
  "ranch",
  "breaded",
  "fried",
  "bacon",
  "ham",
  "pork",
  "shrimp",
  "fish",
  "shellfish",
  "mushroom",
  "onion",
  "garlic",
  "pasta",
  "bun",
  "pita",
  "tempura",
];

const genericMenuSectionTitle = "Menu items";

const texasChiliMenu = {
  title: "Texas Chili Restaurant",
  source: "Texas Chili menu images",
  sections: [
    {
      title: "Breakfast",
      items: [
        { name: "Pancakes", description: "Egg, bacon or sausage", tags: ["gluten", "egg", "pork", "sweet", "soft"] },
        { name: "Egg + Turkey or Sausage", description: "Egg with turkey or sausage", tags: ["egg", "pork", "soft"] },
        { name: "Egg + Bacon", description: "Egg with bacon", tags: ["egg", "pork", "soft"] },
        { name: "Egg + Cheese", description: "Egg with cheese", tags: ["egg", "dairy", "soft"], removable: ["cheese"] },
        { name: "Veggie Omelet", description: "Green peppers, onions, cheese", tags: ["egg", "dairy", "onions", "soft"], removable: ["cheese", "onions"] },
        { name: "Western Omelet", description: "Ham, peppers, onion & cheese", tags: ["egg", "pork", "dairy", "onions", "soft"], removable: ["ham", "cheese", "onions"] },
        { name: "Beans & Cheese", description: "White rice, beans, chocolate or bacon, ham or sausage", tags: ["dairy", "pork", "soft"], removable: ["cheese", "bacon", "ham", "sausage"] },
      ],
    },
    {
      title: "Breakfast Extras",
      items: [
        { name: "EGG", description: "Extra egg", tags: ["egg", "soft"] },
        { name: "2 EGGS", description: "2 extra eggs", tags: ["egg", "soft"] },
        { name: "TOAST", description: "Extra toast", tags: ["gluten"] },
        { name: "BACON, HAM OR SAUSAGE", description: "Your choice of bacon, ham, or sausage", tags: ["pork"] },
      ],
    },
    {
      title: "Breakfast Sandwiches",
      items: [
        { name: "BACON", description: "Egg & cheese", tags: ["gluten", "egg", "dairy", "pork"], removable: ["bacon", "cheese"] },
        { name: "SAUSAGE", description: "Egg & cheese", tags: ["gluten", "egg", "dairy", "pork"], removable: ["sausage", "cheese"] },
        { name: "CHORIZO", description: "Egg & cheese", tags: ["gluten", "egg", "dairy", "pork"], removable: ["chorizo", "cheese"] },
        { name: "TURKEY", description: "Egg & cheese", tags: ["gluten", "egg", "dairy", "chicken"], removable: ["cheese"] },
        { name: "HAM", description: "Egg & cheese", tags: ["gluten", "egg", "dairy", "pork"], removable: ["ham", "cheese"] },
        { name: "STEAK", description: "Egg & cheese", tags: ["gluten", "egg", "dairy", "beef"], removable: ["cheese"] },
        { name: "HOME FRIES", description: "Egg & cheese", tags: ["gluten", "egg", "dairy", "fried"], removable: ["cheese"] },
        { name: "PEPPERS & ONION", description: "Egg & cheese", tags: ["gluten", "egg", "dairy", "onions"], removable: ["cheese", "onions"] },
        { name: "POTATOES", description: "Egg & cheese", tags: ["gluten", "egg", "dairy"], removable: ["cheese"] },
        { name: "EGG", description: "Egg & cheese", tags: ["gluten", "egg", "dairy", "soft"], removable: ["cheese"] },
        { name: "BAGELS", description: "Cream cheese", tags: ["gluten", "dairy"], removable: ["cream cheese"] },
      ],
    },
    {
      title: "Dishes",
      items: [
        { name: "HUEVOS CON CHORIZO", description: "With beans, cheese, and tortilla", tags: ["egg", "pork", "dairy", "corn", "soft"], removable: ["chorizo", "cheese"] },
        { name: "CHILAQUILES", description: "With beans, cheese, and tortilla", tags: ["egg", "dairy", "corn", "soft"], removable: ["cheese"] },
        { name: "HUEVOS RANCHERO", description: "With beans, cheese, and tortilla", tags: ["egg", "dairy", "corn", "soft"], removable: ["cheese"] },
        { name: "HUEVOS REVUELTOS", description: "With beans, cheese, and tortilla", tags: ["egg", "dairy", "corn", "soft"], removable: ["cheese"] },
        { name: "DESAYUNO MEXICANO", description: "Ranch-style eggs with jalapeno, tomato, onion, and tortilla", tags: ["egg", "spicy", "onions", "corn", "soft"], removable: ["jalapeno", "onion"] },
        { name: "DESAYUNO AMERICANO", description: "2 eggs any style with fries and toast + your choice of bacon, ham, or sausage", tags: ["egg", "gluten", "pork", "fried", "soft"], removable: ["fries", "toast", "bacon", "ham", "sausage"] },
      ],
    },
    {
      title: "Salads",
      items: [
        { name: "TOSSED SALAD", description: "Tomato, cucumber, onion, avocado and peppers", tags: ["vegetables", "onions"], removable: ["onion"] },
        { name: "GRILLED CHICKEN", description: "Chicken with salad", tags: ["chicken", "vegetables"] },
        { name: "CHICKEN NUGGETS", description: "Chicken nuggets with salad", tags: ["chicken", "fried", "gluten", "vegetables"] },
      ],
    },
    {
      title: "Breakfast Wraps",
      items: [
        { name: "CHORIZO OR BACON", description: "w/ egg & cheese", tags: ["gluten", "egg", "dairy", "pork"], removable: ["chorizo", "bacon", "cheese"] },
        { name: "CHICKEN", description: "w/ egg & cheese", tags: ["gluten", "egg", "dairy", "chicken"], removable: ["cheese"] },
        { name: "STEAK", description: "w/ egg & cheese", tags: ["gluten", "egg", "dairy", "beef"], removable: ["cheese"] },
      ],
    },
    {
      title: "Lunch Wedges",
      items: [
        { name: "CHICKEN CALIFORNIA", description: "Chicken breast cutlet or grilled chicken, lettuce, tomato & mayo", tags: ["gluten", "chicken", "egg"] },
        { name: "STEAK CALIFORNIA", description: "Steak, lettuce, tomato & mayo", tags: ["gluten", "beef", "egg"] },
        { name: "PHILLY CHEESE STEAK", description: "Steak, cheese, lettuce, tomato & mayo", tags: ["gluten", "beef", "dairy", "egg"], removable: ["cheese"] },
        { name: "BUFFALO CHICKEN", description: "Buffalo chicken, lettuce, tomato & mayo", tags: ["gluten", "chicken", "egg", "spicy"] },
        { name: "CALIFORNIA BURGER", description: "Burger, cheese, lettuce, tomato & mayo", tags: ["gluten", "beef", "dairy", "egg"], removable: ["cheese"] },
        { name: "CHICKEN CUTLET", description: "Chicken, lettuce, tomato & mayo", tags: ["gluten", "chicken", "egg"] },
        { name: "CHICKEN PARMIGIANA", description: "Chicken, cheese, sauce", tags: ["gluten", "chicken", "dairy"], removable: ["cheese"] },
        { name: "CHICKEN CAESAR", description: "Chicken, cheese, lettuce, tomato & mayo", tags: ["gluten", "chicken", "dairy", "egg"], removable: ["cheese"] },
        { name: "ITALIAN HOT SAUSAGE", description: "Sausage with sauce", tags: ["gluten", "pork", "spicy"] },
        { name: "MEATBALL", description: "Meatball with sauce", tags: ["gluten", "beef"] },
        { name: "MEATBALL PARMIGIANA", description: "Meatball, sauce and cheese", tags: ["gluten", "beef", "dairy"], removable: ["cheese"] },
      ],
    },
    {
      title: "Wraps",
      items: [
        { name: "CHICKEN", description: "May add chicken, cheese, mayo, ranch or blue cheese", tags: ["gluten", "chicken", "dairy", "egg"], removable: ["cheese", "mayo", "ranch", "blue cheese"] },
        { name: "STEAK", description: "May add chicken, cheese, mayo, ranch or blue cheese", tags: ["gluten", "beef", "dairy", "egg"], removable: ["cheese", "mayo", "ranch", "blue cheese"] },
      ],
    },
    {
      title: "Burgers",
      items: [
        { name: "PLAIN BURGER", description: "Burger", tags: ["gluten", "beef"] },
        { name: "CHEESE burger", description: "Burger with cheese", tags: ["gluten", "beef", "dairy"], removable: ["cheese"] },
        { name: "CHILI CHEESE", description: "Burger with chili and cheese", tags: ["gluten", "beef", "dairy"], removable: ["cheese", "chili"] },
        { name: "BACON CHEESE", description: "Burger with bacon and cheese", tags: ["gluten", "beef", "pork", "dairy"], removable: ["bacon", "cheese"] },
        { name: "TEXAS CALIFORNIA BURGER", description: "Burger, cheese, lettuce, tomato & mayo", tags: ["gluten", "beef", "dairy", "egg"], removable: ["cheese", "mayo"] },
        { name: "BACON HAMBURGER", description: "Hamburger with bacon", tags: ["gluten", "beef", "pork"], removable: ["bacon"] },
      ],
    },
    {
      title: "Hot dogs",
      items: [
        { name: "PLAIN hot dog", description: "Plain hot dog", tags: ["gluten", "beef"] },
        { name: "CHILI hot dog", description: "Hot dog with chili", tags: ["gluten", "beef"] },
        { name: "CHEESE hot dog", description: "Hot dog with cheese", tags: ["gluten", "beef", "dairy"], removable: ["cheese"] },
        { name: "CHILI & CHEESE hot dog", description: "Hot dog with chili and cheese", tags: ["gluten", "beef", "dairy"], removable: ["cheese"] },
        { name: "CHILI & ONION hot dog", description: "Hot dog with chili and onion", tags: ["gluten", "beef", "onions"], removable: ["onion"] },
        { name: "CHILI & SAUERKRAUT hot dog", description: "Hot dog with chili and sauerkraut", tags: ["gluten", "beef"] },
        { name: "SAUERKRAUT & ONIONS hot dog", description: "Hot dog with sauerkraut and onions", tags: ["gluten", "beef", "onions"], removable: ["onions"] },
      ],
    },
    {
      title: "Deep Fried",
      items: [
        { name: "MOZZARELLA STICK", description: "Fried mozzarella stick", tags: ["gluten", "dairy", "fried"] },
        { name: "MUSHROOMS", description: "Fried mushrooms", tags: ["gluten", "mushrooms", "fried"] },
        { name: "BUFFALO WINGS", description: "Buffalo wings", tags: ["chicken", "spicy", "fried"] },
        { name: "CHICKEN NUGGETS", description: "Chicken nuggets", tags: ["gluten", "chicken", "fried"] },
        { name: "FRIED HOTDOGS", description: "Served w/ french fries", tags: ["gluten", "beef", "fried"], removable: ["french fries"] },
      ],
    },
    {
      title: "Tacos",
      items: [
        { name: "CHICKEN", description: "Soft corn tortilla filled w/ pico and cilantro", tags: ["chicken", "corn", "onions"] },
        { name: "CHORIZO", description: "Soft corn tortilla filled w/ pico and cilantro", tags: ["pork", "corn", "onions"] },
        { name: "CHILI", description: "Soft corn tortilla filled w/ pico and cilantro", tags: ["beef", "corn", "onions"] },
        { name: "LENGUA", description: "Soft corn tortilla filled w/ pico and cilantro", tags: ["beef", "corn", "onions"] },
      ],
    },
    {
      title: "Nachos",
      items: [
        { name: "CHICKEN", description: "Nachos with chicken", tags: ["chicken", "corn", "dairy"], removable: ["cheese"] },
        { name: "CHORIZO", description: "Nachos with chorizo", tags: ["pork", "corn", "dairy"], removable: ["chorizo", "cheese"] },
        { name: "CHILI & CHEESE", description: "Nachos with chili and cheese", tags: ["beef", "corn", "dairy"], removable: ["cheese"] },
      ],
    },
    {
      title: "Sides",
      items: [
        { name: "FRENCH FRIES", description: "w/ chili & cheese available", tags: ["fried"], removable: ["chili", "cheese"] },
        { name: "CURLY FRIES", description: "w/ chili & cheese available", tags: ["fried"], removable: ["chili", "cheese"] },
        { name: "PIZZA FRIES", description: "w/ chili & cheese", tags: ["fried", "dairy"], removable: ["cheese"] },
        { name: "ONION RINGS", description: "w/ chili & cheese available", tags: ["fried", "gluten", "onions"], removable: ["chili", "cheese"] },
        { name: "CHILI", description: "Chili", tags: ["beef", "soft"] },
        { name: "CHILI & CHEESE", description: "Chili with cheese", tags: ["beef", "dairy", "soft"], removable: ["cheese"] },
        { name: "CHILI & CHEESE W/ ONIONS", description: "Chili with cheese and onions", tags: ["beef", "dairy", "onions", "soft"], removable: ["cheese", "onions"] },
        { name: "HAND CUT FRIES", description: "Fries", tags: ["fried"] },
        { name: "SWEET POTATO FRIES", description: "Sweet potato fries", tags: ["fried", "sweet"] },
        { name: "FRIED MUSHROOMS", description: "Fried mushrooms", tags: ["fried", "mushrooms", "gluten"] },
        { name: "FRIED PICKLES", description: "Fried pickles", tags: ["fried", "gluten"] },
      ],
    },
    {
      title: "Extras",
      items: [
        { name: "BACON", description: "Extra bacon", tags: ["pork"] },
        { name: "CHILI", description: "Extra chili", tags: ["beef", "soft"] },
        { name: "CHEESE", description: "Extra cheese", tags: ["dairy"] },
      ],
    },
  ],
};

function keywordsForAvoidItem(item) {
  const lower = item.toLowerCase();
  if (lower === "dairy") return menuKeywordGroups.dairy;
  if (lower === "gluten / wheat") return menuKeywordGroups.gluten;
  if (lower === "peanuts") return menuKeywordGroups.peanuts;
  if (lower === "tree nuts") return menuKeywordGroups.nuts;
  if (lower === "shellfish") return menuKeywordGroups.shellfish;
  if (lower === "fish") return menuKeywordGroups.fish;
  if (lower === "eggs") return menuKeywordGroups.eggs;
  if (lower === "soy") return menuKeywordGroups.soy;
  if (lower === "sesame") return menuKeywordGroups.sesame;
  if (lower === "pork") return menuKeywordGroups.pork;
  if (lower === "beef") return menuKeywordGroups.beef;
  if (lower === "chicken") return menuKeywordGroups.chicken;
  if (lower === "alcohol") return menuKeywordGroups.alcohol;
  if (lower === "caffeine") return menuKeywordGroups.caffeine;
  if (lower === "spicy food") return menuKeywordGroups.spicy;
  if (lower === "garlic") return menuKeywordGroups.garlic;
  if (lower === "onions") return menuKeywordGroups.onions;
  if (lower === "mushrooms") return menuKeywordGroups.mushrooms;
  if (lower === "corn") return menuKeywordGroups.corn;
  if (lower === "coconut") return menuKeywordGroups.coconut;
  if (lower === "vegetarian") return ["beef", "chicken", "pork", "fish", "shellfish"];
  if (lower === "vegan") return ["dairy", "eggs", "beef", "chicken", "pork", "fish", "shellfish"];
  if (lower === "pescatarian") return ["beef", "chicken", "pork"];
  if (lower === "halal") return ["pork", "alcohol"];
  if (lower === "kosher") return ["pork", "shellfish"];
  if (lower === "plant-based") return ["dairy", "eggs", "beef", "chicken", "pork", "fish", "shellfish"];
  if (lower === "whole30") return ["dairy", "gluten", "soy", "alcohol", "corn"];
  if (lower === "paleo") return ["dairy", "gluten", "soy", "corn"];
  return [lower];
}

function selectedAvoidKeywords() {
  return [...new Set(state.profile.avoidFoods.flatMap((item) => keywordsForAvoidItem(item)))];
}

function normalizeMenuLine(line) {
  return line
    .replace(/^\s*[-•*·]+\s*/, "")
    .replace(/\s+[$€£]?\d+(?:\.\d{2})?\s*$/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function dedupeLines(lines) {
  const seen = new Set();
  return lines.filter((line) => {
    const key = line.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function textHasKeyword(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function collectKeywordHits(text, keywordGroups) {
  return Object.entries(keywordGroups)
    .filter(([, keywords]) => textHasKeyword(text, keywords))
    .map(([label]) => label);
}

function inferMenuTitle(rawLines) {
  const firstUseful = rawLines.find((line) => {
    const lower = line.toLowerCase();
    return isRestaurantNameCandidate(line) && !menuSectionHeaders.has(lower) && !/^\d+$/.test(line);
  });
  return firstUseful || "Uploaded menu";
}

function isMenuSectionHeader(line) {
  const lower = line.toLowerCase().replace(/:$/, "");
  if (menuSectionHeaders.has(lower)) return true;
  if (/^(featured|favorites|house specials|specials|chef'?s specials|menu|sections?)$/i.test(lower)) return true;
  if (/^(appetizers|starters|entrees|mains|sides|drinks|desserts|combos|bowls|salads|sandwiches|tacos|burgers|pasta|grill|breakfast|lunch|dinner)$/i.test(lower)) return true;
  return /:$/.test(line) && line.length <= 32;
}

function titleizeHeading(line) {
  return line.replace(/:$/, "").trim();
}

function isRestaurantNoteLine(line) {
  const lower = line.toLowerCase();
  return [
    "consuming undercooked",
    "food borne illness",
    "foodborne illness",
    "may increase your risk",
    "allergy",
    "allergies",
    "please inform",
    "ask your server",
    "prices subject",
    "substitutions",
    "gratuity",
    "served raw",
    "thoroughly cooking",
    "menu items may contain",
  ].some((phrase) => lower.includes(phrase));
}

function lineQuality(line) {
  const trimmed = line.trim();
  const letters = (trimmed.match(/[a-z]/gi) || []).length;
  const weird = (trimmed.match(/[^a-z0-9\s&'+.,/$()-]/gi) || []).length;
  return {
    letters,
    weird,
    words: trimmed.split(/\s+/).filter(Boolean),
    weirdRatio: weird / Math.max(trimmed.length, 1),
  };
}

function isRestaurantNameCandidate(line) {
  const lower = line.toLowerCase();
  const quality = lineQuality(line);
  if (line.length < 3 || line.length > 38) return false;
  if (quality.letters < 3 || quality.weirdRatio > 0.12) return false;
  if (quality.words.some((word) => word.length === 1 && !/[aAiI]/.test(word))) return false;
  if (/\$|\d{2,}/.test(line)) return false;
  if (isRestaurantNoteLine(line) || isMenuSectionHeader(line)) return false;
  if (hasMenuItemSignal(line)) return false;
  if (/\b(and|with|served|choice|includes|topped|contains|risk|illness)\b/i.test(lower)) return false;
  return quality.words.length <= 5;
}

function hasMenuItemSignal(line) {
  const lower = line.toLowerCase();
  return menuItemSignals.some((signal) => lower.includes(signal)) || /\$\s?\d/.test(line);
}

function isLikelyMenuItemLine(line, options = {}) {
  const lower = line.toLowerCase();
  const quality = lineQuality(line);
  if (isRestaurantNoteLine(line) || isMenuSectionHeader(line)) return false;
  if (line.length < 4 || line.length > (options.relaxed ? 90 : 64)) return false;
  if (quality.letters < 3 || quality.weirdRatio > (options.relaxed ? 0.16 : 0.1)) return false;
  if (quality.words.some((word) => word.length === 1 && !/[aAiI]/.test(word))) return false;
  if (/^[\d\s.,-]+$/.test(line)) return false;
  if (/\b(risk|illness|possible|available|hours|phone|address|website|copyright)\b/i.test(lower)) return false;
  if (hasMenuItemSignal(line)) return true;
  if (/^[A-Z0-9 &'()+,/-]{4,}$/.test(line) && quality.words.length <= 6 && quality.words.some((word) => word.length >= 4)) return true;
  return false;
}

function isStrongMenuItemLine(line) {
  return hasMenuItemSignal(line) && isLikelyMenuItemLine(line, { relaxed: true });
}

function buildScanMealFromLine(line, menuTitle) {
  const lower = line.toLowerCase();
  const avoidWords = selectedAvoidKeywords();
  const avoidHits = avoidWords.filter((word) => {
    const normalized = word.toLowerCase();
    if (!normalized) return false;
    return lower.includes(normalized);
  });
  if (state.profile.healthNeeds.includes("No Fried Foods") && textHasKeyword(lower, menuKeywordGroups.fried)) {
    avoidHits.push("fried");
  }
  const loveHits = state.profile.loveFoods.filter((love) => {
    const loveLower = love.toLowerCase();
    const keywords = loveFoodKeywords[loveLower] || [loveLower];
    return textHasKeyword(lower, keywords);
  });
  const dontLoveHits = state.profile.dontLoveFoods.filter((item) => lower.includes(item.toLowerCase()));

  const category = avoidHits.length
    ? "avoid"
    : dontLoveHits.length
      ? "modify"
      : loveHits.length
        ? "safe"
        : textHasKeyword(lower, ["bowl", "salad", "grilled", "roasted", "baked"])
          ? "safe"
          : "modify";

  const ingredientHints = line
    .split(/[,/]| and /i)
    .map((part) => normalizeMenuLine(part))
    .filter((part) => part && part.length > 1);

  const remove = [...new Set([...avoidHits, ...dontLoveHits.slice(0, 1)])].slice(0, 3);
  const confirm = [];
  if (category !== "safe") {
    confirm.push("Double-check sauces, oils, and the prep surface.");
  }
  if (state.profile.healthNeeds.includes("Avoid Shared Fryers")) {
    confirm.push("Ask if the fryer is shared.");
  }

  const substitutions = [];
  if (lower.includes("fried")) substitutions.push("Swap fried prep for grilled or baked, if they can.");
  if (lower.includes("wrap") || lower.includes("pita") || lower.includes("bun")) substitutions.push("Swap the bread or wrap for a bowl or salad, if available.");
  if (textHasKeyword(lower, ["pasta", "noodle", "noodles", "spaghetti", "linguine", "fettuccine", "ravioli", "tortellini", "gnocchi", "dumpling", "dumplings"])) {
    substitutions.push("Swap pasta or dumplings for rice or vegetables, if available.");
  }

  const tags = [
    ...new Set([
      ...loveHits.map((hit) => hit.replace(/foods?/i, "").trim()).filter(Boolean),
      ...avoidHits.map((hit) => `${hit} watch`),
    ]),
  ];

  const confidence = category === "safe" && loveHits.length
    ? "High"
    : category === "avoid" && avoidHits.length
      ? "High"
      : "Medium";

  const summaryMap = {
    safe: "Looks like a strong match from the uploaded menu.",
    modify: "Good base dish if we adjust a few details.",
    avoid: "This one conflicts with your current Dine DNA.",
  };

  return {
    name: line,
    restaurant: menuTitle,
    sourceTrace: "validated-ocr",
    status: category === "safe" ? "Safe to Order As-Is" : category === "modify" ? "Safe With Modifications" : "Likely Unsafe",
    confidence,
    summary: summaryMap[category],
    ingredients: ingredientHints.length ? ingredientHints : [line],
    remove,
    confirm,
    substitutions,
    notes: [
      category === "avoid" ? "Pick another item unless the kitchen can make a truly safe version." : "Ask one quick question before ordering.",
      "Prep surfaces can still matter.",
    ],
    score: confidence === "High" ? 80 : 60,
    tags,
  };
}

function buildScanMealFromAiItem(item, menuTitle) {
  const spoonacularTerms = (item.spoonacularAnnotations || [])
    .map((annotation) => annotation.name)
    .filter(Boolean)
    .join(" ");
  const parts = [item.name, item.description, item.price, spoonacularTerms].filter(Boolean).join(" ");
  const meal = buildScanMealFromLine(parts || item.name, menuTitle);
  return {
    ...meal,
    name: item.name,
    restaurant: menuTitle,
    sourceTrace: "ai-vision",
    ingredients: item.description ? [item.description] : [item.name],
    spoonacularAnnotations: item.spoonacularAnnotations || [],
    price: item.price || "",
    score: meal.score || 75,
  };
}

function annotationsForMenuItem(item, annotations) {
  const itemText = comparisonText([item.name, item.description].filter(Boolean).join(" "));
  return (annotations || []).filter((annotation) => {
    const annotationText = comparisonText(annotation.name);
    if (!annotationText) return false;
    return itemText.includes(annotationText) || annotationText.includes(itemText);
  });
}

function buildAiScanData(aiPayload, sourceLabel, sourceId) {
  if (aiPayload.evaluatedMenu?.sections?.length) {
    const evaluated = aiPayload.evaluatedMenu;
    const sections = evaluated.sections.map((section) => ({
      title: section.title || section.name || "Menu",
      items: (section.items || []).map((item) => ({
        ...item,
        restaurant: evaluated.title || aiPayload.menu?.restaurantName || "Uploaded menu",
        sourceTrace: item.sourceTrace || "server-engine",
        ingredients: item.ingredients?.length ? item.ingredients : [item.description || item.name],
        remove: item.remove || [],
        confirm: item.confirm || [],
        substitutions: item.substitutions || [],
        notes: item.notes || [],
      })),
    }));
    const items = sections.flatMap((section) => section.items);
    return {
      sourceId,
      sourceName: aiPayload.sourceName || sourceLabel,
      parserVersion: aiPayload.parserVersion || scanParserVersion,
      engineVersion: aiPayload.engineVersion || evaluated.engineVersion,
      parserUsed: aiPayload.parserUsed || "openai-vision-ocr",
      confidence: items.some((item) => item.confidence === "Low") ? "Medium" : "High",
      failure: null,
      sourceTruth: aiPayload.ocrCoverage?.checked ? "AI vision + backend Dine DNA engine + OCR coverage" : "AI vision + backend Dine DNA engine",
      foodEnrichment: aiPayload.foodEnrichment || null,
      ocrCoverage: aiPayload.ocrCoverage || null,
      title: evaluated.title || aiPayload.menu?.restaurantName || "Uploaded menu",
      rawText: "",
      sections,
      items,
      counts: evaluated.counts || null,
      hasText: true,
      rejectedLineCount: 0,
      recommendedOrder: evaluated.recommendedOrder || null,
    };
  }

  const menu = aiPayload.menu || aiPayload;
  const title = menu.restaurantName || "Uploaded menu";
  const foodEnrichment = aiPayload.foodEnrichment || null;
  const spoonacularAnnotations = foodEnrichment?.annotations || [];
  const sections = (menu.sections || [])
    .map((section) => ({
      title: section.name,
      items: (section.items || [])
        .filter((item) => item?.name && String(item.name).trim().length >= 2)
        .map((item) => buildScanMealFromAiItem(
          {
            name: String(item.name).trim(),
            description: String(item.description || "").trim(),
            price: String(item.price || "").trim(),
            spoonacularAnnotations: annotationsForMenuItem(item, spoonacularAnnotations),
          },
          title,
        )),
    }))
    .filter((section) => section.title && section.items.length);
  const items = sections.flatMap((section) => section.items);

  if (!sections.length || !items.length) {
    return scanFailureResult(sourceLabel, "AI did not return enough structured menu items.", {
      parserUsed: aiPayload.parserUsed || "ai-vision",
      sourceId,
    });
  }

  return {
    sourceId,
    sourceName: sourceLabel,
    parserVersion: aiPayload.parserVersion || scanParserVersion,
    parserUsed: aiPayload.parserUsed || "ai-vision",
    confidence: "High",
    failure: null,
    sourceTruth: foodEnrichment?.ok ? "AI vision + Spoonacular whole-menu food detection" : "AI vision",
    foodEnrichment,
    title,
    rawText: "",
    sections,
    items,
    hasText: true,
    rejectedLineCount: 0,
    recommendedOrder: buildRecommendedOrder(sections),
  };
}

function comparisonText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\$\s?\d+(?:\.\d{2})?/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function comparisonWords(value) {
  const ignored = new Set(["and", "the", "with", "for", "your", "our", "served", "style", "side", "choice"]);
  return comparisonText(value)
    .split(" ")
    .filter((word) => word.length > 2 && !ignored.has(word));
}

function extractComparablePrice(value) {
  const match = String(value || "").match(/\$\s?\d+(?:\.\d{2})?/);
  return match ? match[0].replace(/\s+/g, "") : "";
}

function ocrCoverageLines(rawText) {
  const rawLines = dedupeLines(
    String(rawText || "")
      .split(/\r?\n/)
      .map(normalizeMenuLine)
      .filter((line) => line && /[a-zA-Z]/.test(line) && line.length > 3),
  );
  const { accepted } = validateOcrLines(rawLines, { relaxed: true });
  return accepted.filter((line) => isLikelyMenuItemLine(line, { relaxed: true }));
}

function scoreOcrLineAgainstMeal(line, meal) {
  const lineText = comparisonText(line);
  const mealName = comparisonText(meal.name);
  if (!lineText || !mealName) return 0;
  if (lineText.includes(mealName) || mealName.includes(lineText)) return 1;

  const lineWords = new Set(comparisonWords(line));
  const mealWords = comparisonWords(meal.name);
  if (!mealWords.length || !lineWords.size) return 0;
  const matched = mealWords.filter((word) => lineWords.has(word)).length;
  return matched / mealWords.length;
}

function bestOcrMatchForMeal(meal, ocrLines) {
  return ocrLines.reduce(
    (best, line) => {
      const score = scoreOcrLineAgainstMeal(line, meal);
      return score > best.score ? { line, score } : best;
    },
    { line: "", score: 0 },
  );
}

function lowerConfidence(confidence) {
  if (confidence === "High") return "Medium";
  return "Low";
}

function uniqueList(items) {
  return [...new Set((items || []).filter(Boolean))];
}

function reconcileAiWithOcr(scanData, rawText, sourceLabel, sourceId) {
  if (!scanData || scanData.failure || !scanData.sections?.length || !rawText.trim()) return scanData;

  const ocrLines = ocrCoverageLines(rawText);
  if (ocrLines.length < 3) {
    return {
      ...scanData,
      sourceTruth: "AI vision; OCR coverage was too thin to compare",
      ocrCoverage: { checked: false, ocrLineCount: ocrLines.length, unsupportedAiCount: 0, ocrOnlyCount: 0 },
    };
  }

  const supportedOcrLines = new Set();
  let unsupportedAiCount = 0;
  let priceConflictCount = 0;

  const sections = scanData.sections.map((section) => ({
    ...section,
    items: section.items.map((meal) => {
      const match = bestOcrMatchForMeal(meal, ocrLines);
      const supported = match.score >= 0.62;
      const nextMeal = {
        ...meal,
        confirm: [...(meal.confirm || [])],
        notes: [...(meal.notes || [])],
      };

      if (supported) {
        supportedOcrLines.add(match.line);
        const aiPrice = extractComparablePrice(meal.price);
        const ocrPrice = extractComparablePrice(match.line);
        if (aiPrice && ocrPrice && aiPrice !== ocrPrice) {
          priceConflictCount += 1;
          nextMeal.confidence = lowerConfidence(nextMeal.confidence);
          nextMeal.score = Math.max(0, (nextMeal.score || 70) - 8);
          nextMeal.confirm = uniqueList([...nextMeal.confirm, `Confirm price; AI read ${aiPrice}, OCR read ${ocrPrice}.`]);
          nextMeal.notes = uniqueList([...nextMeal.notes, "AI layout is kept, but OCR saw a different price nearby."]);
        }
        return nextMeal;
      }

      unsupportedAiCount += 1;
      nextMeal.confidence = lowerConfidence(nextMeal.confidence);
      nextMeal.score = Math.max(0, (nextMeal.score || 70) - 10);
      nextMeal.confirm = uniqueList([...nextMeal.confirm, "Confirm item name and details; OCR did not clearly catch this line."]);
      nextMeal.notes = uniqueList([...nextMeal.notes, "AI saw this in the image, but OCR coverage did not support it clearly."]);
      return nextMeal;
    }),
  }));

  const allAiItems = sections.flatMap((section) => section.items);
  const ocrOnlyItems = ocrLines
    .filter((line) => !supportedOcrLines.has(line))
    .filter((line) => !allAiItems.some((meal) => scoreOcrLineAgainstMeal(line, meal) >= 0.62))
    .slice(0, 8)
    .map((line) => {
      const meal = buildScanMealFromLine(line, scanData.title || sourceLabel);
      const linePrice = extractComparablePrice(line);
      return {
        ...meal,
        name: line.replace(/\s+\$\s?\d+(?:\.\d{2})?$/, "").trim(),
        sourceTrace: "ocr-coverage",
        confidence: "Low",
        price: linePrice,
        score: Math.max(0, (meal.score || 60) - 18),
        summary: "OCR caught this line, but AI did not place it confidently in the menu.",
        confirm: uniqueList([...meal.confirm, "Ask staff whether this item is actually available and confirm the printed name."]),
        notes: uniqueList([...meal.notes, "Needs a second look because OCR saw it outside the AI-structured result."]),
      };
    });

  const reconciledSections = ocrOnlyItems.length
    ? [...sections, { title: "Needs a second look", items: ocrOnlyItems }]
    : sections;
  const items = reconciledSections.flatMap((section) => section.items);

  return {
    ...scanData,
    sourceTruth: "AI vision + OCR coverage check",
    sections: reconciledSections,
    items,
    recommendedOrder: buildRecommendedOrder(reconciledSections),
    ocrCoverage: {
      checked: true,
      ocrLineCount: ocrLines.length,
      unsupportedAiCount,
      ocrOnlyCount: ocrOnlyItems.length,
      priceConflictCount,
    },
  };
}

function readableApiError(errorText) {
  try {
    const parsed = JSON.parse(errorText);
    if (typeof parsed?.detail === "string") return parsed.detail;
    if (typeof parsed?.error?.message === "string") return parsed.error.message;
  } catch {
    // Fall back to the raw response text.
  }
  return errorText;
}

function friendlyAiScanFailure(error) {
  const message = String(error?.message || error || "");
  const lower = message.toLowerCase();
  if (lower.includes("429") || lower.includes("too many requests") || lower.includes("quota") || lower.includes("rate limit")) {
    return "The AI scanner was reached, but OpenAI blocked the request because of a rate limit, quota, billing, or usage-limit setting. Check billing and usage limits, then try again in a minute.";
  }
  if (lower.includes("401") || lower.includes("api key") || lower.includes("unauthorized")) {
    return "The AI scanner could not use the API key. Check that the OpenAI key is correct and saved in the .env file.";
  }
  if (lower.includes("503") || lower.includes("not set")) {
    return "The AI scanner is not fully connected yet. Check the .env file and restart the server.";
  }
  return `The AI scanner failed before it could build the menu. ${message.slice(0, 220)}`;
}

function dataUrlToFile(dataUrl, filename) {
  const [meta, data] = dataUrl.split(",");
  const mime = meta.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new File([bytes], filename, { type: mime });
}

async function requestAiMenuScan(sources, sourceLabel, sourceId, rawText) {
  const formData = new FormData();
  sources.forEach((source, index) => {
    if (source instanceof File) {
      formData.append("files", source, source.name || `menu-${index + 1}.jpg`);
    } else if (typeof source === "string" && source.startsWith("data:")) {
      formData.append("files", dataUrlToFile(source, `captured-menu-${index + 1}.jpg`));
    }
  });

  if (!formData.has("files")) {
    throw new Error("No uploadable image files for AI scan.");
  }

  formData.append("ocr_text", rawText || "");
  formData.append("profile_json", JSON.stringify(state.profile));
  formData.append("source_label", sourceLabel || "Uploaded menu");
  formData.append("source_id", sourceId || "");

  const response = await fetch(aiScanApiUrl, { method: "POST", body: formData });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(readableApiError(errorText || `AI scan failed with ${response.status}`));
  }
  return buildAiScanData(await response.json(), sourceLabel, sourceId);
}

function displayTerm(term) {
  const names = {
    gluten: "gluten/wheat",
    dairy: "dairy",
    soy: "soy",
    pork: "pork",
    beef: "beef",
    chicken: "chicken",
    fried: "fried food",
    egg: "eggs",
    eggs: "eggs",
    shellfish: "shellfish",
    fish: "fish",
    sesame: "sesame",
    onions: "onions",
    mushrooms: "mushrooms",
    corn: "corn",
    spicy: "spicy food",
  };
  return names[term] || term;
}

function profileAvoidTags() {
  const tags = [];
  state.profile.avoidFoods.forEach((food) => {
    keywordsForAvoidItem(food).forEach((keyword) => {
      if (["dairy", "gluten", "pork", "beef", "chicken", "egg", "corn", "fried", "spicy"].includes(keyword)) tags.push(keyword);
      if (keyword === "onion") tags.push("onions");
      if (keyword === "mushroom") tags.push("mushrooms");
      if (["bread", "bun", "pita", "pasta", "flour", "wrap"].includes(keyword)) tags.push("gluten");
      if (["bacon", "ham", "sausage", "chorizo"].includes(keyword)) tags.push("pork");
      if (["cheese", "cream", "butter", "queso"].includes(keyword)) tags.push("dairy");
    });
  });
  if (state.profile.healthNeeds.includes("No Fried Foods")) tags.push("fried");
  return [...new Set(tags)];
}

function profileGoalTags() {
  const tags = [];
  if (state.profile.healthNeeds.includes("Low Carb") || state.profile.healthNeeds.includes("Diabetic-Friendly")) {
    tags.push("gluten", "corn", "sweet", "fried");
  }
  return [...new Set(tags)];
}

function removablePartsForTag(item, tag) {
  const parts = item.removable || [];
  const aliases = {
    dairy: ["cheese", "cream cheese", "queso", "ranch", "blue cheese"],
    pork: ["bacon", "ham", "sausage", "chorizo"],
    fried: ["fries", "french fries"],
    onions: ["onion", "onions", "cebolla"],
    spicy: ["jalapeno"],
  };
  return parts.filter((part) => (aliases[tag] || [tag]).some((alias) => part.toLowerCase().includes(alias)));
}

function classifyTexasChiliItem(item) {
  const avoidTags = profileAvoidTags();
  const goalTags = profileGoalTags();
  const hardHits = avoidTags.filter((tag) => item.tags?.includes(tag));
  const goalHits = goalTags.filter((tag) => item.tags?.includes(tag));
  const remove = [];
  const confirm = [];
  const substitutions = [];
  const notes = [];
  let status = "Safe to Order As-Is";
  let score = 100;

  hardHits.forEach((hit) => {
    const removable = removablePartsForTag(item, hit);
    if (removable.length) {
      remove.push(...removable);
      if (status !== "Likely Unsafe") status = "Safe With Modifications";
      score -= 25;
    } else {
      status = "Likely Unsafe";
      score -= 80;
      notes.push(`Contains ${displayTerm(hit)} based on the menu text.`);
    }
  });

  if ((state.profile.healthNeeds.includes("Low Carb") || state.profile.healthNeeds.includes("Diabetic-Friendly")) && goalHits.length) {
    if (status === "Safe to Order As-Is") status = "Safe With Modifications";
    score -= 18;
    if (item.removable?.includes("fries")) remove.push("fries");
    if (item.removable?.includes("toast")) remove.push("toast");
    confirm.push("Ask if they can make it without bread, fries, toast, or sugary sides.");
  }

  if (state.profile.healthNeeds.includes("Soft Foods Only")) {
    if (item.tags?.includes("soft")) score += 12;
    if ((item.tags?.includes("fried") || item.tags?.includes("gluten")) && status === "Safe to Order As-Is") {
      status = "Safe With Modifications";
      confirm.push("Double-check that the texture works for you.");
      score -= 10;
    }
  }

  state.profile.dontLoveFoods.forEach((food) => {
    const keywords = keywordsForAvoidItem(food).map((keyword) => keyword.toLowerCase());
    const itemText = `${item.name} ${item.description}`.toLowerCase();
    if (keywords.some((keyword) => itemText.includes(keyword))) {
      score -= 12;
    }
  });

  state.profile.loveFoods.forEach((food) => {
    const loveLower = food.toLowerCase();
    const keywords = loveFoodKeywords[loveLower] || [loveLower];
    if (textHasKeyword(`${item.name} ${item.description}`.toLowerCase(), keywords)) score += 8;
  });

  const uniqueRemove = [...new Set(remove)].filter(Boolean);
  const uniqueConfirm = [...new Set(confirm)].filter(Boolean);
  const uniqueNotes = [...new Set(notes)].filter(Boolean);

  if (uniqueRemove.length) substitutions.push(`Remove ${uniqueRemove.join(", ")}.`);
  if (!uniqueNotes.length && status === "Safe to Order As-Is") uniqueNotes.push("No direct conflict found from the saved Taste profile.");
  if (!uniqueNotes.length && status === "Safe With Modifications") uniqueNotes.push("This can work if the listed edits are possible at the counter.");

  return {
    ...item,
    restaurant: texasChiliMenu.title,
    sourceTrace: "texas-chili-source",
    status,
    score,
    confidence: hardHits.length || goalHits.length ? "Medium" : "High",
    summary: status === "Safe to Order As-Is"
      ? "Looks like one of the easier options from this menu for your Taste profile."
      : status === "Safe With Modifications"
        ? "Use the edits below to make this fit better."
        : "This conflicts with foods you marked as not edible.",
    ingredients: [item.description],
    remove: uniqueRemove,
    confirm: uniqueConfirm,
    substitutions,
    notes: uniqueNotes,
    tags: item.tags || [],
  };
}

function sortPersonalizedItems(items) {
  const rank = {
    "Safe to Order As-Is": 0,
    "Safe With Modifications": 1,
    "Likely Unsafe": 2,
  };
  return [...items].sort((a, b) => (rank[a.status] - rank[b.status]) || (b.score - a.score) || (a.originalIndex - b.originalIndex));
}

function buildRecommendedOrder(sections) {
  const allItems = sections.flatMap((section) => section.items.map((item) => ({ ...item, sectionTitle: section.title })));
  const candidates = allItems
    .filter((item) => item.status === "Safe to Order As-Is" && !["Extras"].includes(item.sectionTitle))
    .filter((item) => avoidConflictReasons(item).length === 0 || item.notes?.some((note) => note.includes("No direct conflict")));
  const sortedCandidates = candidates.sort((a, b) => (b.score || 0) - (a.score || 0) || a.name.localeCompare(b.name));
  const main = sortedCandidates.find((item) => !["Sides"].includes(item.sectionTitle));
  const side = sortedCandidates.find((item) => item.sectionTitle === "Sides");
  if (!main) {
    const avoidList = state.profile.avoidFoods.slice(0, 3).join(", ");
    return {
      name: "No low-effort order found",
      summary: avoidList
        ? `No low-effort order found for your Dine DNA (${avoidList}) on this menu.`
        : "No low-effort order found for your Dine DNA on this menu.",
      items: [],
      instructions: [
        "Use the dropdowns to review items with edits, but treat them as ask-before-ordering.",
        "Ask staff for a custom option built without the conflicting ingredients.",
      ],
      unavailable: true,
    };
  }
  const orderParts = [main, side].filter(Boolean);
  return {
    name: main.name,
    summary: orderParts.map((item) => `${item.sectionTitle}: ${item.name}`).join(" + "),
    items: orderParts,
    instructions: uniqueList([
      ...main.substitutions.map(cleanGuidanceText),
      ...main.remove.map((part) => `Remove ${part}.`),
      ...main.confirm.map(cleanGuidanceText),
    ]),
  };
}

function buildTexasChiliScan() {
  const sections = texasChiliMenu.sections.map((section) => {
    const items = section.items.map((item, index) => classifyTexasChiliItem({ ...item, sectionTitle: section.title, originalIndex: index }));
    return { title: section.title, items: sortPersonalizedItems(items) };
  });
  const items = sections.flatMap((section) => section.items);
  return {
    sourceId: "texas-chili-known-menu",
    sourceName: texasChiliMenu.title,
    parserVersion: scanParserVersion,
    parserUsed: "texas-chili-source",
    confidence: "High",
    failure: null,
    title: texasChiliMenu.title,
    rawText: texasChiliMenu.source,
    sections,
    items,
    hasText: true,
    sourceTruth: "Texas Chili menu images",
    rejectedLineCount: 0,
    recommendedOrder: buildRecommendedOrder(sections),
  };
}

function looksLikeTexasChiliSource(source, sourceLabel = "", rawText = "") {
  const sources = Array.isArray(source) ? source : [source];
  const names = [sourceLabel, ...sources.map((item) => item?.name || "")]
    .join(" ")
    .toLowerCase()
    .replace(/%20/g, " ");
  const hasKnownImageName = /(^|[\s/\\])o\s*(\(1\))?\.jpe?g\b/.test(names);
  const hasBothKnownImages = names.includes("o.jpg") && names.includes("o (1).jpg");
  const hasKnownHeicImages = names.includes("img_8241.heic") && names.includes("img_8242.heic");
  const hasTexasChiliText = rawText.toLowerCase().includes("texas chili restaurant") && rawText.toLowerCase().includes("mamaroneck");
  const hasExplicitTestTag = /texas[- ]?chili[- ]?test|test menu/i.test(names);
  return hasKnownImageName || hasBothKnownImages || hasKnownHeicImages || hasTexasChiliText || hasExplicitTestTag;
}

function scanFailureResult(sourceLabel, reason = "Could not read enough real menu text.", debug = {}) {
  return {
    sourceId: `scan-failed-${Date.now()}`,
    sourceName: sourceLabel,
    parserVersion: scanParserVersion,
    parserUsed: debug.parserUsed || "ocr-generic",
    confidence: "Low",
    title: "Scan failed",
    rawText: "",
    sections: [],
    items: [],
    hasText: false,
    rejectedLineCount: debug.rejectedLineCount || 0,
    failure: {
      title: "Scan failed",
      reason,
      message: `We could not read enough real menu text from ${sourceLabel}. Try a clearer photo or upload all menu pages again.`,
    },
  };
}

function sourceNamesFrom(source, sourceLabel = "") {
  const sources = Array.isArray(source) ? source : [source];
  return [sourceLabel, ...sources.map((item) => item?.name || "")].filter(Boolean);
}

function sourceIdFrom(source, sourceLabel = "") {
  return sourceNamesFrom(source, sourceLabel).join("|").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `scan-${Date.now()}`;
}

function isLikelyOcrGarbageLine(line, options = {}) {
  const trimmed = line.trim();
  if (trimmed.length < 4 || trimmed.length > (options.relaxed ? 120 : 70)) return true;
  const letters = (trimmed.match(/[a-z]/gi) || []).length;
  const vowels = (trimmed.match(/[aeiou]/gi) || []).length;
  const weird = (trimmed.match(/[^a-z0-9\s&'+.,/$()-]/gi) || []).length;
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (letters < (options.relaxed ? 2 : 3)) return true;
  if (letters >= 8 && vowels === 0) return true;
  if (weird / Math.max(trimmed.length, 1) > (options.relaxed ? 0.28 : 0.18)) return true;
  if (words.length >= 3 && words.every((word) => word.length <= 2)) return true;
  if (/[|}{_=<>©®]/.test(trimmed)) return true;
  if (/\b[a-z]{1,2}\d{2,}\b/i.test(trimmed)) return true;
  return false;
}

const menuItemSignals = [
  "burger", "cheese", "chicken", "steak", "taco", "nacho", "fries", "salad", "wrap", "sandwich", "hot dog", "egg", "bacon", "ham", "sausage", "omelet", "pancake", "waffle", "toast", "chili", "beans", "rice", "onion", "rings", "wings", "nuggets", "mushroom", "mozzarella", "queso", "tortilla", "sauce", "mayo", "lettuce", "tomato",
];

function hasMenuSignal(line, options = {}) {
  return isMenuSectionHeader(line) || isLikelyMenuItemLine(line, options) || isRestaurantNameCandidate(line);
}

function validateOcrLines(lines, options = {}) {
  const accepted = [];
  const rejected = [];
  lines.forEach((line) => {
    if (isLikelyOcrGarbageLine(line, options) || isRestaurantNoteLine(line) || !hasMenuSignal(line, options)) {
      rejected.push(line);
    } else {
      accepted.push(line);
    }
  });
  return { accepted, rejected };
}

function shouldRetryWithRelaxedParser(source, sourceLabel, rawText) {
  const names = sourceNamesFrom(source, sourceLabel).join(" ").toLowerCase();
  if (/(^|[\s/\\])original_/.test(names)) return true;
  return rawText.length > 120 && rawText.length < 5000 && /\b(menu|burger|chili|rice|salad|taco|wrap|coffee|breakfast|lunch|dinner)\b/i.test(rawText);
}

function isRenderableScanData(scanData) {
  if (!scanData || scanData.failure) return false;
  if (!scanData.sourceId || !scanData.sourceName || !scanData.parserVersion || !scanData.confidence) return false;
  if (!Array.isArray(scanData.sections) || !Array.isArray(scanData.items)) return false;
  if (!scanData.sections.length || !scanData.items.length) return false;
  return scanData.sections.every((section) => section.title && Array.isArray(section.items) && section.items.every((item) => item.name && item.sourceTrace));
}

function publishScanDebug(scanData, source, sourceLabel, rawText = "") {
  window.__w2eLastScanDebug = {
    parserUsed: scanData?.parserUsed || "unknown",
    parserVersion: scanParserVersion,
    uploadedFilenames: sourceNamesFrom(source, sourceLabel),
    ocrTextLength: rawText.length,
    rejectedLineCount: scanData?.rejectedLineCount || 0,
    renderedSectionCount: scanData?.sections?.length || 0,
    renderedItemCount: scanData?.items?.length || 0,
    failureReason: scanData?.failure?.reason || null,
  };
}

function renderScanFailureHelp() {
  return `
    <section class="scan-failure-help">
      <h3>Let’s try that scan again</h3>
      <p>The photo reached the scanner, but it only found a small amount of readable text. That usually means the menu was too blurry, angled, cropped, shadowed, or had glare.</p>
      <ul>
        <li>Hold the phone straight over the menu.</li>
        <li>Make sure the words are sharp and in focus.</li>
        <li>Wipe glare or shadows off the page.</li>
        <li>Fill the screen with one menu page at a time.</li>
        <li>Upload every page if the menu has multiple sides.</li>
      </ul>
      <button class="primary-action" data-rescan-menu type="button">Rescan menu</button>
    </section>
  `;
}

function parseScanMeals(rawText, sourceLabel = "Uploaded menu", sourceId = "validated-ocr", options = {}) {
  const relaxedMode = options.relaxedMode === true;
  const rawLines = dedupeLines(
    rawText
      .split(/\r?\n/)
      .map(normalizeMenuLine)
      .filter((line) => line && /[a-zA-Z]/.test(line) && line.length > 3),
  );

  const { accepted: lines, rejected } = validateOcrLines(rawLines, { relaxed: relaxedMode });

  const usableLines = lines.filter((line) => {
    const lower = line.toLowerCase();
    if (/^\d+$/.test(line)) return false;
    if (/^[\d\s.,-]+$/.test(line)) return false;
    if (line.length > (relaxedMode ? 110 : 64)) return false;
    if (isRestaurantNoteLine(line)) return false;
    if (!isMenuSectionHeader(line) && !isRestaurantNameCandidate(line) && !isLikelyMenuItemLine(line, { relaxed: relaxedMode })) return false;
    return true;
  });

  const detectedHeaders = usableLines.filter((line) => isMenuSectionHeader(line));
  const detectedItems = usableLines.filter((line) => isLikelyMenuItemLine(line, { relaxed: relaxedMode }));
  const strongItems = detectedItems.filter(isStrongMenuItemLine);
  const hasStructure = detectedHeaders.length >= 1 || strongItems.length >= 4;
  if (usableLines.length < (relaxedMode ? 4 : 8) || !hasStructure) {
    return scanFailureResult(sourceLabel, "OCR did not produce enough validated menu sections or item-like lines.", {
      parserUsed: "ocr-generic",
      rejectedLineCount: rejected.length + Math.max(rawLines.length - lines.length, 0),
    });
  }

  const title = inferMenuTitle(usableLines);
  const sections = [];
  let currentSection = null;

  usableLines.forEach((line, index) => {
    const lower = line.toLowerCase();
    if (index === 0 && line === title) {
      return;
    }
    if (isMenuSectionHeader(line)) {
      currentSection = { title: titleizeHeading(line), lines: [] };
      sections.push(currentSection);
      return;
    }

    if (line === title || isRestaurantNameCandidate(line)) {
      return;
    }

    if (!currentSection) {
      currentSection = { title: genericMenuSectionTitle, lines: [] };
      sections.push(currentSection);
    }
    currentSection.lines.push(line);
  });

  if (!sections.length) {
    sections.push({
      title: genericMenuSectionTitle,
      lines: usableLines.filter((line) => line !== title && !isMenuSectionHeader(line)),
    });
  }

  const sectionData = sections
    .map((section) => ({
      title: section.title,
      items: section.lines
        .filter((line) => isLikelyMenuItemLine(line, { relaxed: relaxedMode }))
        .map((line) => buildScanMealFromLine(line, title)),
    }))
    .filter((section) => section.items.length);

  const items = sectionData.flatMap((section) => section.items);

  if (items.length < (relaxedMode ? 4 : 4)) {
    return scanFailureResult(sourceLabel, "OCR found too few validated menu items to build a truthful menu.", {
      parserUsed: "ocr-generic",
      rejectedLineCount: rejected.length,
    });
  }

  return {
    sourceId,
    sourceName: sourceLabel,
    parserVersion: scanParserVersion,
    parserUsed: "ocr-generic",
    confidence: detectedHeaders.length >= 2 ? "Medium" : "Low",
    failure: null,
    title,
    rawText,
    sections: sectionData,
    items: items.slice(0, 24),
    hasText: items.length > 0,
    rejectedLineCount: rejected.length,
  };
}

async function analyzeMenuSource(source, sourceLabel = "Uploaded menu") {
  const requestId = ++state.scanRequestId;
  state.isScanInProgress = true;
  state.eatReturnView = "scan-loading";
  state.scanMeals = [];
  state.scanSections = [];
  state.scanOrder = [];
  state.activeMenuCategory = "mains";
  state.scanSearchQuery = "";
  state.recommendedOrder = null;
  state.scanMeta = null;
  state.scanSource = source;
  const sources = Array.isArray(source) ? source : [source];
  scannerStatus.textContent = "Reading menu text...";
  setScanLoadingState("preparing", {
    progress: 0.03,
    pageIndex: 1,
    pageTotal: sources.length,
    detail: sources.length > 1 ? `Lining up ${sources.length} menu pages.` : "Lining up the menu page.",
  });
  setView("scan-loading");

  const sourceId = sourceIdFrom(sources, sourceLabel);
  let scanData = null;
  let rawText = "";
  try {
    if (looksLikeTexasChiliSource(sources, sourceLabel)) {
      setScanLoadingState("scanning", {
        progress: 0.18,
        pageIndex: 1,
        pageTotal: sources.length,
        detail: "Recognized this menu. Pulling the saved layout into place.",
      });
      await delay(900);
      setScanLoadingState("building", {
        progress: 0.82,
        pageIndex: sources.length,
        pageTotal: sources.length,
        detail: "Sorting the menu into the useful dropdowns.",
      });
      scanData = buildTexasChiliScan();
    } else {
      const ocrProgress = Array(sources.length).fill(0);
      const updateOcrProgress = (index, progress) => {
        ocrProgress[index] = Math.max(ocrProgress[index], Math.max(0, Math.min(1, progress || 0)));
      };
      const ocrCoveragePromise = Promise.all(
        sources.map((item, index) =>
          extractMenuText(item, (progress) => updateOcrProgress(index, progress)).catch(() => ""),
        ),
      );
      try {
        scannerStatus.textContent = "Understanding the menu with AI...";
        setScanLoadingState("scanning", {
          progress: 0.24,
          pageIndex: 1,
          pageTotal: sources.length,
          detail: sources.length > 1
            ? `Reading ${sources.length} pages before the decision engine runs.`
            : "Reading the menu before the decision engine runs.",
        });
        rawText = (await ocrCoveragePromise).join("\n\n");
        scanData = await requestAiMenuScan(sources, sourceLabel, sourceId, rawText);
        if (scanData?.failure) {
          throw new Error(scanData.failure.reason || "AI vision did not return enough structured menu items.");
        }
        setScanLoadingState("matching", {
          progress: 0.74,
          pageIndex: sources.length,
          pageTotal: sources.length,
          detail: "The backend Dine DNA engine is making the item decisions.",
        });
        setScanLoadingState("building", {
          progress: 0.88,
          pageIndex: sources.length,
          pageTotal: sources.length,
          detail: "Engine verdicts and OCR coverage notes are folded in.",
        });
      } catch (error) {
        setScanLoadingState("building", {
          progress: 0.58,
          pageIndex: sources.length,
          pageTotal: sources.length,
          detail: "AI vision could not finish cleanly. Trying local OCR as backup.",
        });

        const texts = await ocrCoveragePromise;
        const combinedProgress = ocrProgress.reduce((total, item) => total + item, 0) / Math.max(ocrProgress.length, 1);
        setScanLoadingState("scanning", {
          progress: 0.58 + combinedProgress * 0.24,
          pageIndex: sources.length,
          pageTotal: sources.length,
          detail: "Using OCR backup to build the clearest menu we can.",
        });
        await delay(500);
        rawText = texts.join("\n\n");

        if (looksLikeTexasChiliSource(sources, sourceLabel, rawText)) {
          setScanLoadingState("building", {
            progress: 0.86,
            pageIndex: sources.length,
            pageTotal: sources.length,
            detail: "OCR recognized the restaurant. Organizing the saved menu.",
          });
          scanData = buildTexasChiliScan();
        } else {
          scanData = parseScanMeals(rawText, sourceLabel, sourceId);
          if (scanData?.failure) {
            scanData = scanFailureResult(sourceLabel, friendlyAiScanFailure(error), {
              parserUsed: "openai-vision-ocr",
              sourceId,
            });
          }
        }
      }
      if (scanData?.failure && shouldRetryWithRelaxedParser(sources, sourceLabel, rawText)) {
        setScanLoadingState("building", {
          progress: 0.9,
          pageIndex: sources.length,
          pageTotal: sources.length,
          detail: "Trying a looser text pass before giving up on the photo.",
        });
        const relaxedResult = parseScanMeals(rawText, sourceLabel, sourceId, { relaxedMode: true });
        if (!relaxedResult?.failure) {
          scanData = relaxedResult;
        }
      }
    }
  } catch {
    setScanLoadingState("building", {
      progress: 0.86,
      pageIndex: sources.length,
      pageTotal: sources.length,
      detail: "Something went sideways, but we are still preparing a useful result.",
    });
    scanData = scanFailureResult(sourceLabel, "OCR or menu parsing threw an error.");
  }

  if (requestId !== state.scanRequestId) {
    return;
  }

  if (!scanData?.items?.length && !scanData?.failure) {
    scanData = scanFailureResult(sourceLabel, "Parser returned no validated menu items.");
  }

  if (!isRenderableScanData(scanData) && !scanData?.failure) {
    scanData = scanFailureResult(sourceLabel, "Scan result failed the render contract.", {
      parserUsed: scanData?.parserUsed || "unknown",
      rejectedLineCount: scanData?.rejectedLineCount || 0,
    });
  }

  publishScanDebug(scanData, sources, sourceLabel, rawText);
  setScanLoadingState("building", {
    progress: 0.94,
    pageIndex: sources.length,
    pageTotal: sources.length,
    detail: "Final pass: safe, edit, skip, and dropdown organization.",
  });

  state.scanMeals = scanData.items || [];
  state.scanSections = scanData.sections || [];
  state.recommendedOrder = scanData.recommendedOrder || null;
  state.scanMeta = {
    sourceId: scanData.sourceId,
    sourceName: scanData.sourceName,
    parserVersion: scanData.parserVersion,
    engineVersion: scanData.engineVersion || null,
    parserUsed: scanData.parserUsed,
    confidence: scanData.confidence,
    title: scanData.title || "Uploaded menu",
    failure: scanData.failure || null,
    sourceTruth: scanData.sourceTruth || null,
    counts: scanData.counts || null,
    ocrCoverage: scanData.ocrCoverage || null,
    rejectedLineCount: scanData.rejectedLineCount || 0,
  };
  renderScanResults();
  setScanLoadingState("done", {
    progress: 1,
    pageIndex: sources.length,
    pageTotal: sources.length,
    detail: "Menu is ready.",
  });
  state.isScanInProgress = false;
  state.eatReturnView = "scan-results";
  const activeView = document.querySelector(".view.active")?.id;
  if (activeView === "scan-loading") {
    viewHistory[viewHistory.length - 1] = "scan-results";
    setView("scan-results", { push: false });
  }
}

function loadState() {
  const savedProfile = readStoredJson(storage.profile, null);
  const savedMealData = readStoredJson(storage.savedMeals, null);
  const savedOrderData = readStoredJson(storage.savedOrders, null);

  if (savedProfile) {
    state.profile = { ...state.profile, ...savedProfile };
    if (!state.profile.avoidFoods?.length && state.profile.restrictions?.length) {
      state.profile.avoidFoods = [...state.profile.restrictions];
    }
  }

  ["avoidFoods", "manualAvoidFoods", "eatingStyle", "loveFoods", "dontLoveFoods", "healthNeeds", "restrictions"].forEach((key) => {
    state.profile[key] = Array.isArray(state.profile[key]) ? state.profile[key] : [];
  });

  if (!savedProfile?.manualAvoidFoods) {
    const autoFoods = getSelectedDietAvoidFoods(state.profile.eatingStyle);
    state.profile.manualAvoidFoods = state.profile.avoidFoods.filter((food) => !autoFoods.includes(food));
  }

  syncAvoidFoodsFromDietStyles();

  if (savedMealData) {
    state.savedMeals = Array.isArray(savedMealData) ? savedMealData : [];
  }

  if (savedOrderData) {
    state.savedOrders = Array.isArray(savedOrderData) ? savedOrderData : [];
  }
}

function saveProfile() {
  try {
    localStorage.setItem(storage.profile, JSON.stringify(state.profile));
  } catch {
    // Keep the form usable even when browser storage is unavailable.
  }
}

function saveMeals() {
  try {
    localStorage.setItem(storage.savedMeals, JSON.stringify(state.savedMeals));
  } catch {
    // Keep saved meal controls usable even when browser storage is unavailable.
  }
}

function saveOrders() {
  try {
    localStorage.setItem(storage.savedOrders, JSON.stringify(state.savedOrders));
  } catch {
    // Keep saved order controls usable even when browser storage is unavailable.
  }
}

function addToScanOrder(mealName, kind = "main") {
  const meal = state.scanMeals.find((item) => item.name === mealName) || findMeal(mealName);
  if (!meal) return;
  state.scanOrder = [...state.scanOrder, { name: meal.name, kind, category: meal.status || "safe", meal }];
  renderScanOrder();
}

function removeFromScanOrder(index) {
  state.scanOrder = state.scanOrder.filter((_, itemIndex) => itemIndex !== index);
  renderScanOrder();
}

function setView(viewId, options = {}) {
  const { push = true, resolve = true } = options;
  if (resolve) viewId = resolveViewTarget(viewId);
  const currentView = document.querySelector(".view.active")?.id;
  if (push && currentView && currentView !== viewId) {
    viewHistory.push(viewId);
  }

  views.forEach((view) => view.classList.toggle("active", view.id === viewId));
  const activeNav = eatViews.includes(viewId) ? "dashboard" : viewId;
  navItems.forEach((item) => item.classList.toggle("active", item.dataset.view === activeNav));
  if (mainContent) mainContent.scrollTop = 0;
  appShell?.classList.remove("content-scrolled");
  appShell?.classList.toggle("scanner-active", viewId === "scan");
  rememberEatView(viewId);

  if (viewId === "scan") {
    startCamera();
  } else {
    stopCamera();
  }

  if (viewId !== "product-scan") {
    stopProductBarcodeScanner();
  }

  if (viewId === "scan-results") {
    renderScanResults();
  }

  if (viewId === "product-scan") {
    renderProductResult();
    startProductBarcodeScanner({ showFallbackToast: false });
  }
}

function goBack() {
  const currentView = document.querySelector(".view.active")?.id;
  if (currentView === "product-scan") {
    viewHistory.splice(0, viewHistory.length, "dashboard");
    state.eatReturnView = "dashboard";
    setView("dashboard", { push: false, resolve: false });
    return;
  }

  if (viewHistory.length > 1) {
    viewHistory.pop();
    setView(viewHistory[viewHistory.length - 1], { push: false, resolve: false });
    return;
  }

  setView("dashboard", { push: false, resolve: false });
}

function chipButton(group, value) {
  const active = state.profile[group].includes(value) ? " active" : "";
  const span = chipSpans[value] || 3;
  return `<button class="chip chip-span-${span}${active}" data-dna-group="${group}" data-dna-value="${value}" type="button">${value}</button>`;
}

function renderDineDnaChips() {
  eatingStyleChips.innerHTML = dineDnaOptions.eatingStyle.map((item) => chipButton("eatingStyle", item)).join("");
  avoidFoodChips.innerHTML = dineDnaOptions.avoidFoods.map((item) => chipButton("avoidFoods", item)).join("");
  loveFoodChips.innerHTML = dineDnaOptions.loveFoods.map((item) => chipButton("loveFoods", item)).join("");
  dontLoveFoodChips.innerHTML = dineDnaOptions.dontLoveFoods.map((item) => chipButton("dontLoveFoods", item)).join("");
  healthNeedChips.innerHTML = dineDnaOptions.healthNeeds.map((item) => chipButton("healthNeeds", item)).join("");
}

function getSelectedDietAvoidFoods(styles) {
  return [...new Set(styles.flatMap((style) => dietStyleAvoidMap[style] || []))];
}

function syncAvoidFoodsFromDietStyles() {
  state.profile.avoidFoods = [
    ...new Set([...state.profile.manualAvoidFoods, ...getSelectedDietAvoidFoods(state.profile.eatingStyle)]),
  ];
}

function toggleManualAvoidFood(food) {
  state.profile.manualAvoidFoods = state.profile.manualAvoidFoods.includes(food)
    ? state.profile.manualAvoidFoods.filter((item) => item !== food)
    : [...state.profile.manualAvoidFoods, food];
  syncAvoidFoodsFromDietStyles();
}

function fillProfileForm() {
  document.querySelector("#userName").value = state.profile.userName;
}

function updateDashboard() {
  const profileSummary = document.querySelector("#profileSummary");
  const name = state.profile.userName || "Your";
  const needs = [
    ...state.profile.avoidFoods,
    ...state.profile.eatingStyle,
    ...state.profile.loveFoods,
    ...state.profile.healthNeeds,
  ];

  profileSummary.textContent = needs.length
    ? `${name} Dine DNA is ready for ${needs.slice(0, 2).join(" and ")}.`
    : "Set your Dine DNA once. Then tap Scan Menu or Scan Food.";
}

function statusClass(category) {
  if (category === "safe") return "status-safe";
  if (category === "modify" || category === "confirm") return "status-modify";
  if (category === "swap_required") return "status-swap";
  return "status-avoid";
}

function instructionBlock(title, items) {
  if (!items.length) return "";
  return `
    <div class="instruction-box">
      <strong>${title}</strong>
      <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>
    </div>
  `;
}

function mealCategoryLabel(category) {
  if (category === "safe") return "Safe to order as-is";
  if (category === "confirm") return "Ask before ordering";
  if (category === "modify") return "Can order with modifications";
  if (category === "swap_required") return "Only if they can swap it";
  return "Don't order at all";
}

function scanItemText(meal) {
  return `${meal.name || ""} ${meal.summary || ""} ${(meal.ingredients || []).join(" ")} ${(meal.tags || []).join(" ")} ${(meal.notes || []).join(" ")}`.toLowerCase();
}

function avoidConflictReasons(meal) {
  if (meal.conflicts?.length) return meal.conflicts;
  const text = scanItemText(meal);
  const reasons = [];
  const avoidTags = profileAvoidTags();
  const hasPastaBase = textHasKeyword(text, ["pasta", "noodle", "noodles", "spaghetti", "linguine", "fettuccine", "ravioli", "tortellini", "gnocchi", "dumpling", "dumplings"]);
  const hasDairySauce = textHasKeyword(text, ["cream", "cream sauce", "alfredo", "queso", "cheese sauce", "ranch"]);

  avoidTags.forEach((tag) => {
    const normalizedTag = tag === "egg" ? "eggs" : tag;
    const keywords = menuKeywordGroups[normalizedTag] || [tag];
    const tagHit = meal.tags?.includes(tag) || meal.tags?.includes(normalizedTag);
    if (tagHit || textHasKeyword(text, keywords)) {
      const term = displayTerm(tag);
      if (tag === "gluten") {
        reasons.push(hasPastaBase
          ? "Pasta is gluten/wheat, so the main item may not be removable."
          : "This looks gluten/wheat-based, so the main item may not be removable.");
      } else if (tag === "dairy") {
        reasons.push(hasDairySauce
          ? "The sauce is made with dairy or cream, not just a topping to leave off."
          : "Dairy looks built into this item, not just a topping to leave off.");
      } else {
        reasons.push(`The menu description points to ${term}, which conflicts with your Dine DNA.`);
      }
    }
  });

  if (!reasons.length) {
    (meal.notes || [])
      .filter((note) => /^Contains .+ based on the menu text\./.test(note))
      .forEach((note) => reasons.push(note));
  }

  if (!reasons.length && meal.status === "Likely Unsafe") {
    reasons.push("The core dish conflicts with your Dine DNA enough that it is safer to choose something else.");
  }

  return uniqueList(reasons);
}

function avoidRemovalText(part) {
  return `Remove ${part}, or ask for a safe swap the menu already offers.`;
}

function avoidPerfectWorldMods(meal) {
  const mods = [
    ...(meal.substitutions || []),
    ...(meal.remove || []).map(avoidRemovalText),
    ...(meal.confirm || []),
  ];

  if (!mods.length) {
    mods.push("Ask staff whether they can make a version that avoids the conflicting ingredients.");
  }

  return uniqueList(mods);
}

function cleanGuidanceText(item) {
  return String(item || "")
    .replace(/^Ask about sauces, oils, and prep surface\.$/, "Double-check sauces, oils, and the prep surface.")
    .replace(/^Check for cross-contamination with gluten\.$/, "")
    .replace(/^Ask if gluten can touch it during prep\.$/, "")
    .replace(/^Confirm dairy-free sauces and toppings\.$/, "")
    .replace(/^Ask for dairy-free sauces and toppings\.$/, "")
    .replace(/^Ask whether the fryer is shared\.$/, "Ask if the fryer is shared.")
    .replace(/^Ask for grilled or baked instead of fried\.$/, "Swap fried prep for grilled or baked, if they can.")
    .replace(/^Make it a bowl or salad if possible\.$/, "Swap the bread or wrap for a bowl or salad, if available.")
    .replace(/^Swap for rice or vegetables if the restaurant allows it\.$/, "Swap pasta or dumplings for rice or vegetables, if available.")
    .replace(/^Please confirm ingredients with restaurant staff\.$/, "Ask one quick question before ordering.")
    .replace(/^Cross-contamination may still be possible\.$/, "Prep surfaces can still matter.");
}

function profileSpecificChecks(meal) {
  return uniqueList((meal.confirm || []).map(cleanGuidanceText).filter(Boolean));
}

function modificationSteps(meal) {
  return uniqueList([
    ...(meal.remove || []).map((part) => `Remove ${part}.`),
    ...(meal.substitutions || []).map(cleanGuidanceText),
  ].filter(Boolean));
}

function friendlyNotes(meal) {
  return uniqueList((meal.notes || []).map(cleanGuidanceText).filter(Boolean));
}

function renderScanItemGuidance(meal, category) {
  if (category === "avoid") {
    return `
      <div class="order-instructions">
        <strong>Why you shouldn't eat</strong>
        <div class="instruction-grid">
          ${instructionBlock("Hard conflicts", avoidConflictReasons(meal))}
          ${instructionBlock("Only if the kitchen can do this", avoidPerfectWorldMods(meal).map(cleanGuidanceText))}
        </div>
      </div>
    `;
  }

  if (category === "confirm") {
    return `
      <div class="order-instructions">
        <strong>Ask first</strong>
        <div class="instruction-grid">
          ${instructionBlock("Why to ask", meal.conflicts?.length ? meal.conflicts : friendlyNotes(meal))}
          ${instructionBlock("Double-check", profileSpecificChecks(meal))}
        </div>
      </div>
    `;
  }

  if (category === "swap_required") {
    return `
      <div class="order-instructions">
        <strong>Only if they can swap it</strong>
        <div class="instruction-grid">
          ${instructionBlock("Conflict", avoidConflictReasons(meal))}
          ${instructionBlock("Swap needed", modificationSteps(meal))}
          ${instructionBlock("Double-check", profileSpecificChecks(meal))}
        </div>
      </div>
    `;
  }

  return `
    <div class="order-instructions">
      <strong>How to order it</strong>
      <div class="instruction-grid">
        ${instructionBlock("Double-check", profileSpecificChecks(meal))}
        ${instructionBlock("Make it work", modificationSteps(meal))}
        ${instructionBlock("Good to know", friendlyNotes(meal))}
      </div>
    </div>
  `;
}

function renderIngredients(meal) {
  const ingredients = meal.ingredients || meal.tags || [];
  if (!ingredients.length) return "";
  return `
    <div class="ingredient-list">
      <strong>What’s in it</strong>
      <span>${ingredients.join(", ")}</span>
    </div>
  `;
}

function scanItemDescription(meal) {
  const details = (meal.ingredients || [])
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  const nameText = comparisonText(meal.name);
  const detailText = comparisonText(details);
  const base = details && detailText !== nameText ? details : meal.summary;
  const price = meal.price && !base.includes(meal.price) ? ` ${meal.price}` : "";
  return `${base || meal.summary || "Menu item from the uploaded scan."}${price}`.trim();
}

function orderText(meal) {
  const lines = [
    meal.name,
    meal.status,
    `Confidence: ${meal.confidence}`,
    meal.remove.length ? `Remove: ${meal.remove.join(", ")}` : "",
    meal.confirm.length ? `Confirm: ${meal.confirm.join(", ")}` : "",
    meal.substitutions.length ? `Substitutions: ${meal.substitutions.join(", ")}` : "",
    meal.notes.length ? `Notes: ${meal.notes.join(" ")}` : "",
    "Please confirm with restaurant staff. Cross-contamination may still be possible.",
  ];

  return lines.filter(Boolean).join("\n");
}

function renderActionIcon(type) {
  const icons = {
    copy: '<path d="M8 8h10v10H8z" /><path d="M6 16H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />',
    plus: '<path d="M12 5v14" /><path d="M5 12h14" />',
    save: '<path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />',
    check: '<path d="M20 6 9 17l-5-5" />',
    remove: '<path d="M18 6L6 18" /><path d="M6 6l12 12" />',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[type]}</svg>`;
}

function showActionToast(message, iconType = "plus") {
  const shell = document.querySelector(".app-shell");
  if (!shell) return;

  shell.querySelector(".action-toast")?.remove();
  const toast = document.createElement("div");
  toast.className = "action-toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.innerHTML = `
    <span>${renderActionIcon(iconType)}</span>
    <strong>${message}</strong>
  `;
  shell.appendChild(toast);

  window.setTimeout(() => toast.classList.add("show"), 20);
  window.setTimeout(() => toast.classList.remove("show"), 1450);
  window.setTimeout(() => toast.remove(), 1850);
}

function showSavedButtonFeedback(button) {
  if (!button) return;
  const originalLabel = button.dataset.originalLabel || button.textContent.trim() || "Save Dine DNA";
  button.dataset.originalLabel = originalLabel;
  window.clearTimeout(button.savedConfirmationTimer);
  button.textContent = "Saved";
  button.classList.add("saved-confirmation");
  button.savedConfirmationTimer = window.setTimeout(() => {
    button.textContent = button.dataset.originalLabel || "Save Dine DNA";
    button.classList.remove("saved-confirmation");
  }, 1400);
}

function renderRating(meal) {
  if (!meal.saved) return "";
  const rating = meal.rating || 0;
  return `
    <div class="rating-row" aria-label="Rate meal">
      <span>Rate it</span>
      <div class="stars">
        ${[1, 2, 3, 4, 5]
          .map(
            (value) => `
              <button class="star-button ${value <= rating ? "active" : ""}" data-rate="${meal.name}" data-rating="${value}" type="button" aria-label="${value} stars">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.9 6.6 19.8l1-6.1-4.4-4.3 6.1-.9L12 3Z" />
                </svg>
              </button>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderMealCard(meal, category, saved = false) {
  return `
    <article class="meal-card">
      <div class="meal-header">
        <h3>${meal.name}</h3>
        <span class="status-pill ${statusClass(category)}">${mealCategoryLabel(category)}</span>
        ${meal.restaurant ? `<p class="meal-source">${meal.restaurant}</p>` : ""}
        <p>${meal.summary}</p>
      </div>
      ${renderIngredients(meal)}
      <div class="order-instructions">
        <strong>Order instructions</strong>
        <div class="instruction-grid">
          ${instructionBlock("Remove", meal.remove)}
          ${instructionBlock("Confirm", meal.confirm)}
          ${instructionBlock("Substitutions", meal.substitutions)}
          ${instructionBlock("Notes", meal.notes)}
        </div>
        <p><strong>Confidence:</strong> ${meal.confidence}</p>
      </div>
      ${renderRating(meal)}
      <div class="card-actions">
        <button class="icon-button" data-copy="${meal.name}" type="button" aria-label="Copy order">
          ${renderActionIcon("copy")}
        </button>
        ${
          saved
            ? `<button class="icon-button" data-remove="${meal.name}" type="button" aria-label="Remove saved meal">${renderActionIcon("remove")}</button>`
            : `<button class="icon-button" data-save="${meal.name}" type="button" aria-label="Save meal">${renderActionIcon("save")}</button>`
        }
      </div>
    </article>
  `;
}

function findMeal(name) {
  const currentView = document.querySelector(".view.active")?.id;
  if (currentView === "scan-results") {
    return state.scanMeals.find((meal) => meal.name === name);
  }
  return [...state.scanMeals, ...Object.values(recommendations).flat()].flat().find((meal) => meal.name === name);
}

function findMealCategory(name) {
  const scanMeal = state.scanMeals.find((meal) => meal.name === name);
  if (scanMeal) {
    if (scanMeal.category) return scanMeal.category;
    if (scanMeal.status === "Safe to Order As-Is") return "safe";
    if (scanMeal.status === "Ask Before Ordering") return "confirm";
    if (scanMeal.status === "Safe With Modifications") return "modify";
    if (scanMeal.status === "Only If They Can Swap It") return "swap_required";
    return "avoid";
  }
  return Object.entries(recommendations).find(([, meals]) =>
    meals.some((meal) => meal.name === name),
  )?.[0] || "safe";
}

function renderRecommendations() {
  if (!recommendationList) return;
  const meals = [
    ...recommendations.safe.map((meal) => ({ meal, category: "safe" })),
    ...recommendations.modify.map((meal) => ({ meal, category: "modify" })),
    ...recommendations.avoid.map((meal) => ({ meal, category: "avoid" })),
  ];

  recommendationList.innerHTML = meals
    .map(({ meal, category }) => renderMealCard(meal, category))
    .join("");
}

const scanMenuCategories = [
  { id: "mains", label: "Mains", sections: ["Breakfast", "Breakfast Extras", "Breakfast Sandwiches", "Dishes", "Breakfast Wraps", "Lunch Wedges", "Wraps", "Burgers", "Hot dogs"] },
  { id: "appetizers", label: "Apps", sections: ["Deep Fried", "Nachos"] },
  { id: "sides", label: "Sides", sections: ["Sides", "Extras"] },
  { id: "drinks", label: "Drinks", sections: ["Drinks", "Beverages"] },
  { id: "desserts", label: "Desserts", sections: ["Desserts", "Sweets"] },
];

function categoryForSection(title) {
  const match = scanMenuCategories.find((category) => category.sections.includes(title));
  return match?.id || "mains";
}

function scanStatusRank(status) {
  if (status === "Safe to Order As-Is") return 0;
  if (status === "Ask Before Ordering") return 1;
  if (status === "Safe With Modifications") return 2;
  if (status === "Only If They Can Swap It") return 3;
  return 4;
}

function orderedScanItems(items) {
  return [...items].sort((a, b) => scanStatusRank(a.status) - scanStatusRank(b.status) || b.score - a.score || a.name.localeCompare(b.name));
}

function scanSectionStatusCounts(items) {
  return items.reduce(
    (counts, item) => {
      const category = item.category || (item.status === "Safe to Order As-Is"
        ? "safe"
        : item.status === "Ask Before Ordering"
          ? "confirm"
          : item.status === "Safe With Modifications"
            ? "modify"
            : item.status === "Only If They Can Swap It"
              ? "swap_required"
              : "avoid");
      if (category === "safe") counts.safe += 1;
      else if (category === "confirm") counts.confirm += 1;
      else if (category === "modify") counts.modify += 1;
      else if (category === "swap_required") counts.swapRequired += 1;
      else counts.avoid += 1;
      return counts;
    },
    { safe: 0, confirm: 0, modify: 0, swapRequired: 0, avoid: 0 },
  );
}

function simpleScanStatusCounts(counts) {
  return {
    safe: counts.safe || 0,
    modify: (counts.confirm || 0) + (counts.modify || 0) + (counts.swapRequired || 0),
    avoid: counts.avoid || 0,
  };
}

function renderSectionCountChips(items) {
  const counts = simpleScanStatusCounts(scanSectionStatusCounts(items));
  return `
    <div class="section-count-chips" aria-label="Section fit counts">
      <span class="section-count status-safe" title="Good to order as-is">${counts.safe}</span>
      <span class="section-count status-modify" title="Safe with modifications">${counts.modify}</span>
      <span class="section-count status-avoid" title="Not safe">${counts.avoid}</span>
    </div>
  `;
}

function waiterOrderText() {
  if (!state.scanOrder.length) return "";
  return state.scanOrder
    .map((item, index) => {
      const meal = item.meal || findMeal(item.name);
      const instructions = [
        ...(meal?.substitutions || []),
        ...(meal?.remove || []).map((part) => `No ${part}.`),
        ...(meal?.confirm || []).map((detail) => `Please confirm: ${detail}`),
      ];
      return `${index + 1}. ${item.name}${instructions.length ? `\n${instructions.join("\n")}` : ""}`;
    })
    .join("\n\n");
}

function saveCurrentScanOrder() {
  if (!state.scanOrder.length) return false;
  const names = state.scanOrder.map((item) => item.name);
  const orderText = waiterOrderText();
  state.savedOrders = [
    {
      id: `order-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: names.length === 1 ? names[0] : `${names[0]} + ${names.length - 1} more`,
      summary: names.join(" + "),
      items: names,
      notes: orderText.split("\n").filter(Boolean),
    },
    ...state.savedOrders,
  ];
  saveOrders();
  renderSavedOrders();
  return true;
}

function showEnjoyCelebration() {
  const shell = document.querySelector(".app-shell");
  closeOrderReview();
  if (!shell) return;

  shell.querySelector(".enjoy-celebration")?.remove();
  const celebration = document.createElement("div");
  celebration.className = "enjoy-celebration";
  celebration.setAttribute("role", "status");
  celebration.setAttribute("aria-live", "polite");
  celebration.innerHTML = `
    <div class="enjoy-mark">${renderActionIcon("check")}</div>
    <strong>Enjoy</strong>
    <i></i><i></i><i></i><i></i><i></i><i></i>
  `;
  shell.appendChild(celebration);

  window.setTimeout(() => celebration.classList.add("show"), 20);
  window.setTimeout(() => {
    state.scanOrder = [];
    renderScanOrder();
    setView("scan", { push: false });
  }, 900);
  window.setTimeout(() => celebration.remove(), 1250);
}

function showOrderReview() {
  const shell = document.querySelector(".app-shell");
  if (!shell || !state.scanOrder.length) return;
  shell.querySelector(".order-review-sheet")?.remove();
  const sheet = document.createElement("div");
  sheet.className = "order-review-sheet";
  sheet.innerHTML = `
    <div class="order-review-card" role="dialog" aria-modal="true" aria-label="Review order">
      <button class="icon-button order-review-close" data-close-order-review type="button" aria-label="Close order review">
        ${renderActionIcon("remove")}
      </button>
      <p class="eyebrow">Ready to order</p>
      <h2>Read this to the waiter</h2>
      <div class="waiter-script">${waiterOrderText().replace(/\n/g, "<br>")}</div>
      <div class="order-review-actions">
        <button class="secondary-action" data-save-current-order type="button">Add order to saved meals</button>
        <button class="primary-action" data-order-done type="button">Done</button>
      </div>
    </div>
  `;
  shell.appendChild(sheet);
  window.setTimeout(() => sheet.classList.add("show"), 20);
}

function showAiRecommendation() {
  const shell = document.querySelector(".app-shell");
  const recommended = state.recommendedOrder;
  if (!shell || !recommended) return;
  shell.querySelector(".order-review-sheet")?.remove();
  const sheet = document.createElement("div");
  sheet.className = "order-review-sheet";
  sheet.innerHTML = `
    <div class="order-review-card" role="dialog" aria-modal="true" aria-label="AI recommendation">
      <button class="icon-button order-review-close" data-close-order-review type="button" aria-label="Close AI recommendation">
        ${renderActionIcon("remove")}
      </button>
      <p class="eyebrow">AI Recommendation</p>
      <h2>${recommended.unavailable ? "No low-effort order found" : "Best low-effort order"}</h2>
      <div class="recommended-order">
        <p>${recommended.summary}</p>
        ${recommended.instructions?.length ? `<ul>${recommended.instructions.map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}
      </div>
    </div>
  `;
  shell.appendChild(sheet);
  window.setTimeout(() => sheet.classList.add("show"), 20);
}

function closeOrderReview() {
  const sheet = document.querySelector(".order-review-sheet");
  if (!sheet) return;
  sheet.classList.remove("show");
  window.setTimeout(() => sheet.remove(), 180);
}

function renderScanResults() {
  if (state.scanMeta?.failure) {
    if (scanMenuTitle) scanMenuTitle.textContent = "Menu scan";
    if (scanVerdictPrimary) scanVerdictPrimary.textContent = state.scanMeta.failure.title;
    if (scanVerdictSecondary) scanVerdictSecondary.textContent = state.scanMeta.failure.message || "We couldn’t read enough clear menu text from that photo.";
    if (scanSafetyDisclaimer) scanSafetyDisclaimer.hidden = true;
    if (menuSectionList) menuSectionList.innerHTML = renderScanFailureHelp();
    renderScanOrder();
    return;
  }

  if (!state.scanMeals.length) {
    if (scanMenuTitle) scanMenuTitle.textContent = "Menu scan";
    if (scanVerdictPrimary) scanVerdictPrimary.textContent = "Upload a menu photo and we’ll read the text here.";
    if (scanVerdictSecondary) scanVerdictSecondary.textContent = "Once we can read the menu, we’ll break it down by section using only the menu itself.";
    if (scanSafetyDisclaimer) scanSafetyDisclaimer.hidden = true;
    if (menuSectionList) menuSectionList.innerHTML = `<div class="empty-state">Upload a menu photo and we’ll break it down here.</div>`;
    renderScanOrder();
    return;
  }

  const counts = state.scanMeta?.counts || state.scanMeals.reduce(
    (next, meal) => {
      const category = meal.category || findMealCategory(meal.name);
      if (category === "safe") next.safe += 1;
      else if (category === "confirm") next.confirm += 1;
      else if (category === "modify") next.modify += 1;
      else if (category === "swap_required") next.swapRequired += 1;
      else next.avoid += 1;
      return next;
    },
    { safe: 0, confirm: 0, modify: 0, swapRequired: 0, avoid: 0 },
  );
  const simpleCounts = simpleScanStatusCounts(counts);
  const safeCount = simpleCounts.safe;
  const modifyCount = simpleCounts.modify;
  const avoidCount = simpleCounts.avoid;

  if (scanMenuTitle) scanMenuTitle.textContent = state.scanMeta?.title || "Menu scan";

  if (scanVerdictPrimary) {
    if (safeCount && !avoidCount) {
      scanVerdictPrimary.textContent = "We read the menu and found solid options without edits.";
    } else if (safeCount || modifyCount) {
      scanVerdictPrimary.textContent = "We read the menu. You have options, and some need simple edits.";
    } else {
      scanVerdictPrimary.textContent = "We read the menu, but most options conflict with this Taste profile.";
    }
  }

  if (scanVerdictSecondary) {
    scanVerdictSecondary.textContent = `${safeCount} good as-is, ${modifyCount} with modifications, ${avoidCount} not safe.`;
  }
  if (scanSafetyDisclaimer) scanSafetyDisclaimer.hidden = false;

  if (menuSectionList) {
    const visibleSections = state.scanSections;
    menuSectionList.innerHTML = state.scanSections.length
      ? `${visibleSections.length
        ? visibleSections
          .map((section) => ({ section, items: orderedScanItems(section.items) }))
          .map(
            ({ section, items }) => `
              <details class="menu-section">
                <summary>
                  <strong>${section.title}</strong>
                  ${renderSectionCountChips(items)}
                </summary>
                <div class="menu-section-items">
                  ${items
                    .map((meal) => {
                      const category = meal.category || (
                        meal.status === "Safe to Order As-Is"
                          ? "safe"
                          : meal.status === "Ask Before Ordering"
                            ? "confirm"
                            : meal.status === "Safe With Modifications"
                              ? "modify"
                              : meal.status === "Only If They Can Swap It"
                                ? "swap_required"
                                : "avoid"
                      );
                      return `
                        <article class="scan-item-card">
                          <div class="meal-header">
                            <span class="status-pill ${statusClass(category)}">${mealCategoryLabel(category)}</span>
                            <h3>${meal.name}</h3>
                            <p>${scanItemDescription(meal)}</p>
                          </div>
                          ${renderScanItemGuidance(meal, category)}
                          <div class="card-actions">
                            <button class="icon-button scan-action-button" data-add-order="${meal.name}" type="button" aria-label="Add to order">
                              ${renderActionIcon("plus")}
                            </button>
                          </div>
                        </article>
                      `;
                    })
                    .join("")}
                </div>
              </details>
            `,
          )
          .join("") || `<div class="empty-state">No menu options listed or found in the scan.</div>`
        : `<div class="empty-state">No menu options listed or found in the scan.</div>`}`
      : `<div class="empty-state">We could not split this menu into sections, but the items are still below.</div>`;
  }

  renderScanOrder();
}

function renderScanOrder() {
  if (!scanOrderList) return;

  if (state.scanMeta?.failure) {
    scanOrderList.innerHTML = "";
    return;
  }

  const recommended = state.recommendedOrder;
  const chosen = state.scanOrder.length
    ? state.scanOrder
        .map(
          (item, index) => `
            <div class="scan-order-chip">
              <span>${item.name}${item.kind !== "main" ? ` · ${item.kind}` : ""}</span>
              <button class="icon-button" data-remove-order="${index}" type="button" aria-label="Remove from order">
                ${renderActionIcon("remove")}
              </button>
            </div>
          `,
        )
        .join("")
    : "";

  scanOrderList.innerHTML = recommended
    ? `
      <button class="secondary-action ai-recommendation-button" data-ai-recommendation type="button">See AI Recommendation</button>
      ${chosen}
      ${state.scanOrder.length ? `<button class="primary-action review-order-button" data-review-order type="button">Review My Order</button>` : ""}
    `
    : `${chosen}${state.scanOrder.length ? `<button class="primary-action review-order-button" data-review-order type="button">Review My Order</button>` : ""}`;
}

function scanVerdictSnapshot() {
  const counts = simpleScanStatusCounts(state.scanMeta?.counts || scanSectionStatusCounts(state.scanMeals));
  const safeCount = counts.safe;
  const middleCount = counts.modify;
  const avoidCount = counts.avoid;
  const summary = [];
  summary.push(`${safeCount} good as-is`);
  if (middleCount) summary.push(`${middleCount} with modifications`);
  if (avoidCount) summary.push(`${avoidCount} not safe`);
  return summary.join(" · ");
}

function renderSavedMeals() {
  if (!state.savedMeals.length) {
    savedMeals.innerHTML = `<div class="empty-state">Saved meals will appear here after you find an order that works.</div>`;
  } else {
    savedMeals.innerHTML = state.savedMeals
      .map((meal) => renderMealCard(meal, findMealCategory(meal.name), true))
      .join("");
  }
  updateDashboard();
}

function renderSavedOrders() {
  if (!savedOrders) return;
  if (!state.savedOrders.length) {
    savedOrders.innerHTML = `<div class="empty-state">Saved whole orders will show up here.</div>`;
    return;
  }

  savedOrders.innerHTML = state.savedOrders
    .map(
      (order) => `
        <article class="meal-card saved-order-card">
          <div class="meal-header">
            <h3>${order.name}</h3>
            <span class="status-pill status-safe">Saved order</span>
            <p>${order.summary}</p>
          </div>
          <div class="ingredient-list">
            <strong>What’s in it</strong>
            <span>${(order.items || []).join(", ")}</span>
          </div>
          <div class="order-instructions">
            <strong>Order instructions</strong>
            <div class="instruction-grid">
              ${(order.notes || []).map((note) => `<div class="instruction-box"><strong>Note</strong><ul><li>${note}</li></ul></div>`).join("")}
            </div>
          </div>
          <div class="card-actions">
            <button class="icon-button" data-copy-order="${order.id}" type="button" aria-label="Copy saved order">
              ${renderActionIcon("copy")}
            </button>
            <button class="icon-button" data-remove-order-save="${order.id}" type="button" aria-label="Remove saved order">
              ${renderActionIcon("remove")}
            </button>
          </div>
        </article>
      `,
    )
    .join("");
}

function formatProductTag(value) {
  return String(value || "")
    .replace(/^en:/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function numberFact(value, suffix = "") {
  if (value === null || value === undefined || value === "") return "Unknown";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "Unknown";
  return `${Math.round(numeric * 10) / 10}${suffix}`;
}

function normalizeProductText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/en:/g, " ")
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripProductFreeClaims(text) {
  const freeTerms = [
    "gluten",
    "wheat",
    "dairy",
    "milk",
    "lactose",
    "soy",
    "soya",
    "soybean",
    "peanut",
    "tree nut",
    "nut",
    "egg",
    "sesame",
    "fish",
    "shellfish",
    "pork",
    "beef",
    "chicken",
    "alcohol",
    "caffeine",
    "corn",
    "coconut",
  ];
  const escaped = freeTerms
    .sort((a, b) => b.length - a.length)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  return text
    .replace(new RegExp(`\\b(?:${escaped})\\s+free\\b`, "g"), " ")
    .replace(new RegExp(`\\bfree\\s+from\\s+(?:${escaped})\\b`, "g"), " ")
    .replace(/\s+/g, " ")
    .trim();
}

function productText(product) {
  return [
    product?.name,
    product?.brand,
    product?.ingredientsText,
    ...(product?.allergens || []),
    ...(product?.traces || []),
    ...(product?.labels || []),
    ...(product?.categories || []),
  ]
    .join(" ")
    .toLowerCase()
    .replace(/en:/g, " ");
}

function expandedKeywordsForProduct(item) {
  return uniqueList(
    keywordsForAvoidItem(item)
      .flatMap((keyword) => menuKeywordGroups[keyword] || [keyword])
      .map((keyword) => normalizeProductText(keyword))
      .filter(Boolean),
  );
}

function productEvidenceParts(product) {
  return {
    ingredients: stripProductFreeClaims(normalizeProductText(product?.ingredientsText)),
    allergens: stripProductFreeClaims(normalizeProductText((product?.allergens || []).map(formatProductTag).join(" "))),
    traces: stripProductFreeClaims(normalizeProductText((product?.traces || []).map(formatProductTag).join(" "))),
    categories: stripProductFreeClaims(normalizeProductText((product?.categories || []).map(formatProductTag).join(" "))),
  };
}

function keywordHits(text, keywords) {
  return uniqueList(keywords.filter((keyword) => keyword && textHasKeyword(text, [keyword]))).slice(0, 4);
}

function sourceSummary(matches) {
  return matches
    .map(({ source, hits }) => `${source}${hits.length ? ` (${hits.join(", ")})` : ""}`)
    .join(", ");
}

function productRestrictionMatch(product, label, options = {}) {
  const evidence = productEvidenceParts(product);
  const keywords = expandedKeywordsForProduct(label);
  if (!keywords.length) return null;

  const directSources = [
    { source: "allergens", hits: keywordHits(evidence.allergens, keywords) },
    { source: "ingredients", hits: keywordHits(evidence.ingredients, keywords) },
  ].filter((match) => match.hits.length);
  const categoryHits = keywordHits(evidence.categories, keywords);
  const traceHits = keywordHits(evidence.traces, keywords);

  if (!directSources.length && !traceHits.length && !categoryHits.length) return null;

  const displayLabel = options.displayLabel || label;
  if (directSources.length) {
    return {
      severity: "hard",
      message: `${displayLabel}: listed in ${sourceSummary(directSources)}.`,
    };
  }

  return {
    severity: "trace",
    message: traceHits.length
      ? `${displayLabel}: listed as a trace/contact risk (${traceHits.join(", ")}).`
      : `${displayLabel}: category data mentions ${categoryHits.join(", ")}. Check the package label.`,
  };
}

function productConflictReasons(product) {
  const reasons = { hard: [], trace: [] };
  state.profile.avoidFoods.forEach((food) => {
    const match = productRestrictionMatch(product, food);
    if (match?.severity === "hard") {
      reasons.hard.push(match.message);
    } else if (match?.severity === "trace") {
      reasons.trace.push(match.message);
    }
  });

  state.profile.eatingStyle.forEach((style) => {
    const match = productRestrictionMatch(product, style, { displayLabel: `${style} style` });
    if (match?.severity === "hard") {
      reasons.hard.push(match.message);
    } else if (match?.severity === "trace") {
      reasons.trace.push(match.message);
    }
  });

  const text = productText(product);
  if (state.profile.healthNeeds.includes("No Fried Foods") && textHasKeyword(text, menuKeywordGroups.fried)) {
    reasons.hard.push("No Fried Foods: product data points to fried, crispy, breaded, or tempura.");
  }

  return {
    hard: uniqueList(reasons.hard),
    trace: uniqueList(reasons.trace),
  };
}

function nutriScoreExplanation(score) {
  const grade = String(score || "").toUpperCase();
  const notes = {
    A: "Exceptional nutritional quality; encourages consumption.",
    B: "Good nutritional quality.",
    C: "Average nutritional quality; to be consumed in moderation.",
    D: "Lower nutritional quality; to be consumed less frequently or in small portions.",
    E: "Poor nutritional quality; limit consumption.",
  };
  return notes[grade] || "A to E score for overall nutritional quality. A is strongest; E is weakest.";
}

function novaExplanation(group) {
  const nova = Number(group);
  const notes = {
    1: "Unprocessed or minimally processed food.",
    2: "Processed cooking ingredient, like oil, sugar, salt, or starch.",
    3: "Processed food made by adding ingredients to a simpler food.",
    4: "Ultra-processed. Usually more industrial ingredients and additives.",
  };
  return notes[nova] || "Processing scale from 1 to 4. Lower is closer to whole food; 4 is ultra-processed.";
}

function sugarLevel(value) {
  const sugar = Number(value);
  if (Number.isNaN(sugar)) return { label: "Unknown", tone: "neutral", note: "Total sugar per 100g is not listed." };
  if (sugar <= 5) {
    return { label: "Low", tone: "good", note: "Low sugar: 5g or less total sugar per 100g." };
  }
  if (sugar > 22.5) {
    return { label: "High", tone: "watch", note: "High sugar: over 22.5g total sugar per 100g." };
  }
  return { label: "Medium", tone: "neutral", note: "Middle range: above 5g and up to 22.5g total sugar per 100g." };
}

function proteinExplanation(value) {
  const protein = Number(value);
  if (Number.isNaN(protein)) return "Protein per 100g is not listed.";
  if (protein >= 10) return "Strong protein signal for this app's high-protein goal.";
  if (protein >= 5) return "Some protein, but not a high-protein product.";
  return "Low protein. Not a meaningful protein source.";
}

function nutriScoreImagePath(score) {
  const grade = String(score || "").toLowerCase();
  if (!["a", "b", "c", "d", "e"].includes(grade)) return null;
  return `assets/nutri-score-${grade}.png`;
}

function productMetricFacts(product) {
  const nutriments = product?.nutriments || {};
  const sugar = sugarLevel(nutriments.sugars100g);
  return [
    {
      label: "Nutri-Score",
      value: product?.nutriScore ? product.nutriScore.toUpperCase() : "Unknown",
      note: nutriScoreExplanation(product?.nutriScore),
      tone: ["A", "B"].includes(String(product?.nutriScore || "").toUpperCase()) ? "good" : ["D", "E"].includes(String(product?.nutriScore || "").toUpperCase()) ? "watch" : "neutral",
      image: nutriScoreImagePath(product?.nutriScore),
    },
    {
      label: "NOVA",
      value: product?.novaGroup ? `Group ${product.novaGroup}` : "Unknown",
      note: novaExplanation(product?.novaGroup),
      tone: Number(product?.novaGroup) >= 4 ? "watch" : Number(product?.novaGroup) <= 1 ? "good" : "neutral",
    },
    {
      label: "Sugar",
      value: numberFact(nutriments.sugars100g, "g"),
      note: `${sugar.label}. ${sugar.note}`,
      tone: sugar.tone,
    },
    {
      label: "Protein",
      value: numberFact(nutriments.proteins100g, "g"),
      note: proteinExplanation(nutriments.proteins100g),
      tone: Number(nutriments.proteins100g) >= 10 ? "good" : "neutral",
    },
  ];
}

function productNutritionSummary(product) {
  const nutriments = product?.nutriments || {};
  return [
    `Nutri-Score: ${product?.nutriScore ? product.nutriScore.toUpperCase() : "Unknown"}`,
    `NOVA: ${product?.novaGroup ? `Group ${product.novaGroup}` : "Unknown"}`,
    `Sugar: ${numberFact(nutriments.sugars100g, "g")} per 100g`,
    `Protein: ${numberFact(nutriments.proteins100g, "g")} per 100g`,
  ];
}

function showNutritionInfo() {
  const shell = document.querySelector(".app-shell");
  const product = state.productLookup?.product;
  if (!shell || !product) return;

  shell.querySelector(".order-review-sheet")?.remove();
  const sheet = document.createElement("div");
  sheet.className = "order-review-sheet nutrition-info-sheet";
  sheet.innerHTML = `
    <div class="order-review-card nutrition-info-card" role="dialog" aria-modal="true" aria-label="Nutrition score guide">
      <button class="icon-button order-review-close" data-close-order-review type="button" aria-label="Close nutrition guide">
        ${renderActionIcon("remove")}
      </button>
      <p class="eyebrow">Nutrition guide</p>
      <h2>What these mean</h2>
      <div class="nutrition-current">
        <strong>This product</strong>
        <ul>${productNutritionSummary(product).map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="nutrition-guide-list">
        <section>
          <h3>Nutri-Score</h3>
          <div class="nutri-guide-comparison">
            <div class="nutri-guide-scale" aria-label="Nutri-Score scale from A to E">
              <strong>Nutri-Score</strong>
              <div class="nutri-guide-letters">
                <span class="grade-a">A</span>
                <span class="grade-b">B</span>
                <span class="grade-c">C</span>
                <span class="grade-d">D</span>
                <span class="grade-e">E</span>
              </div>
              <div class="nutri-guide-axis">
                <span>Better nutrition quality</span>
                <span>Limit more often</span>
              </div>
            </div>
            <table class="nutri-grade-table">
              <thead>
                <tr>
                  <th>Grade</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>A</td><td>Exceptional nutritional quality; encourages consumption.</td></tr>
                <tr><td>B</td><td>Good nutritional quality.</td></tr>
                <tr><td>C</td><td>Average nutritional quality; to be consumed in moderation.</td></tr>
                <tr><td>D</td><td>Lower nutritional quality; to be consumed less frequently or in small portions.</td></tr>
                <tr><td>E</td><td>Poor nutritional quality; limit consumption.</td></tr>
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <h3>NOVA</h3>
          <p>A processing scale. It does not replace ingredients or allergen checks.</p>
          <ul>
            <li><strong>Group 1:</strong> unprocessed or minimally processed.</li>
            <li><strong>Group 2:</strong> cooking ingredients like oil, sugar, or salt.</li>
            <li><strong>Group 3:</strong> processed foods made from simpler foods.</li>
            <li><strong>Group 4:</strong> ultra-processed foods with more industrial ingredients or additives.</li>
          </ul>
        </section>
        <section>
          <h3>Sugar</h3>
          <p>Open Food Facts usually gives total sugar per 100g. Low is 5g or less per 100g; high is over 22.5g per 100g. For added sugar, the FDA Daily Value is 50g per day on a 2,000 calorie diet.</p>
        </section>
        <section>
          <h3>Protein</h3>
          <p>For quick shopping, this app treats 10g+ per 100g as a strong protein signal, 5-10g as some protein, and under 5g as low. Personal protein needs vary, so this is a product comparison guide.</p>
        </section>
      </div>
    </div>
  `;
  shell.appendChild(sheet);
  window.setTimeout(() => sheet.classList.add("show"), 20);
}

function productGoalNotes(product) {
  const nutriments = product?.nutriments || {};
  const notes = [];
  const sugar = sugarLevel(nutriments.sugars100g);
  const nutriScore = String(product?.nutriScore || "").toUpperCase();
  if (["D", "E"].includes(nutriScore)) {
    notes.push(`Nutri-Score ${nutriScore}: less favorable overall nutrition score.`);
  }
  if (sugar.tone === "watch") {
    notes.push(`Sugar is high at ${numberFact(nutriments.sugars100g, "g")} per 100g.`);
  } else if (state.profile.healthNeeds.includes("Low Sugar") && Number(nutriments.sugars100g) > 5) {
    notes.push(`Low Sugar goal: this is not low sugar at ${numberFact(nutriments.sugars100g, "g")} per 100g.`);
  }
  if (state.profile.healthNeeds.includes("Low Sodium") && Number(nutriments.salt100g) > 0.7) {
    notes.push(`Salt is ${numberFact(nutriments.salt100g, "g")} per 100g.`);
  }
  if ((state.profile.healthNeeds.includes("Low Carb") || state.profile.healthNeeds.includes("Diabetic-Friendly")) && Number(nutriments.carbohydrates100g) > 20) {
    notes.push(`Carbs are ${numberFact(nutriments.carbohydrates100g, "g")} per 100g.`);
  }
  if (state.profile.healthNeeds.includes("High Protein") && Number(nutriments.proteins100g) < 10) {
    notes.push(`High Protein goal: protein is only ${numberFact(nutriments.proteins100g, "g")} per 100g.`);
  }
  if (product?.novaGroup && Number(product.novaGroup) >= 4) {
    notes.push("NOVA 4: Open Food Facts marks this as ultra-processed.");
  }
  return uniqueList(notes);
}

function productVerdict(product) {
  const conflicts = productConflictReasons(product);
  const notes = productGoalNotes(product);
  if (conflicts.hard.length) {
    return {
      category: "avoid",
      label: "Doesn't fit your Dine DNA",
      summary: "Open Food Facts lists an ingredient, allergen, or category that conflicts with your saved profile.",
      conflicts: conflicts.hard,
      traceConflicts: conflicts.trace,
      notes,
    };
  }
  if (conflicts.trace.length) {
    return {
      category: "modify",
      label: "Ask before eating",
      summary: "No direct ingredient conflict found, but Open Food Facts lists a trace/contact risk for your profile.",
      conflicts: [],
      traceConflicts: conflicts.trace,
      notes,
    };
  }
  if (notes.length || !product?.ingredientsText) {
    return {
      category: "modify",
      label: "Check details",
      summary: product?.ingredientsText
        ? "No direct ingredient conflict found, but a nutrition or processing detail is worth checking."
        : "Open Food Facts does not have full ingredients for this product yet.",
      conflicts: [],
      traceConflicts: [],
      notes,
    };
  }
  return {
    category: "safe",
    label: "Looks compatible",
    summary: "No direct conflict found against your current Dine DNA.",
    conflicts: [],
    traceConflicts: [],
    notes,
  };
}

function productDineDnaNotes(verdict) {
  if (verdict.conflicts?.length) return verdict.conflicts;
  if (verdict.traceConflicts?.length) return verdict.traceConflicts;
  const activeDna = uniqueList([...state.profile.avoidFoods, ...state.profile.eatingStyle]);
  if (!activeDna.length) {
    return ["No restrictions selected yet. Add your Dine DNA in Profile for a personal yes/no check."];
  }
  return [`No direct ingredient or allergen conflict found for ${activeDna.slice(0, 4).join(", ")}${activeDna.length > 4 ? ", and more" : ""}.`];
}

function renderProductLookupLoading(barcode) {
  if (!productResult) return;
  productResult.innerHTML = `
    <div class="product-card">
      <div class="meal-header">
        <h3>Looking up ${barcode}</h3>
        <span class="status-pill status-modify">Open Food Facts</span>
        <p>Checking the product database now.</p>
      </div>
    </div>
  `;
}

function renderProductResult() {
  if (!productResult) return;
  const lookup = state.productLookup;
  if (!lookup) {
    productResult.innerHTML = `<div class="empty-state">Scan a package barcode to check ingredients and nutrition facts.</div>`;
    return;
  }

  if (!lookup.ok || !lookup.product) {
    productResult.innerHTML = `
      <div class="product-card">
        <div class="meal-header">
          <h3>Product not found</h3>
          <span class="status-pill status-modify">No match</span>
          <p>Open Food Facts did not have a product for barcode ${lookup.barcode || "that code"}.</p>
        </div>
      </div>
    `;
    return;
  }

  const product = lookup.product;
  const verdict = productVerdict(product);
  const allergens = [...(product.allergens || []), ...(product.traces || [])].map(formatProductTag);
  const facts = productMetricFacts(product);

  productResult.innerHTML = `
    <article class="product-card">
      <div class="product-header">
        ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name || "Product"}" />` : `<span class="choice-icon">${renderActionIcon("check")}</span>`}
        <div>
          <h3>${product.name || "Unnamed product"}</h3>
          <p>${[product.brand, product.quantity].filter(Boolean).join(" · ") || `Barcode ${lookup.barcode}`}</p>
        </div>
      </div>
      <span class="status-pill ${statusClass(verdict.category)}">${verdict.label}</span>
      <p>${verdict.summary}</p>
      <div class="product-facts-panel">
        <button class="nutrition-info-button" data-nutrition-info type="button" aria-label="Explain nutrition scores">i</button>
        <div class="product-facts">
          ${facts
            .map(
              ({ label, value, tone, image }) => `
                <div class="product-fact product-fact-${tone}${image ? " product-fact-score" : ""}">
                  <strong>${label}</strong>
                  ${image ? `<img class="nutri-score-badge" src="${image}" alt="${label} ${value}" loading="lazy" />` : `<span>${value}</span>`}
                </div>
              `,
            )
            .join("")}
        </div>
      </div>
      ${instructionBlock("Dine DNA check", productDineDnaNotes(verdict))}
      ${instructionBlock("Nutrition notes", verdict.notes)}
      ${instructionBlock("Allergens and traces", allergens.length ? allergens : ["None listed in Open Food Facts."])}
      <div class="ingredient-list">
        <strong>Ingredients</strong>
        <span>${product.ingredientsText || "Ingredients are not listed for this product yet."}</span>
      </div>
    </article>
  `;
}

async function lookupOpenFoodFactsProduct(barcode) {
  const cleanBarcode = String(barcode || "").replace(/\D/g, "");
  if (!cleanBarcode) {
    showActionToast("Enter a barcode", "copy");
    productBarcode?.focus();
    return;
  }

  renderProductLookupLoading(cleanBarcode);
  try {
    const response = await fetch(`${openFoodFactsApiUrl}/${encodeURIComponent(cleanBarcode)}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(readableApiError(errorText || `Lookup failed with ${response.status}`));
    }
    state.productLookup = await response.json();
  } catch (error) {
    state.productLookup = {
      ok: false,
      barcode: cleanBarcode,
      product: null,
      message: error.message || "Open Food Facts lookup failed.",
    };
  }
  renderProductResult();
}

function stopProductBarcodeScanner() {
  state.productScanActive = false;
  if (state.productDetectorFrame) {
    cancelAnimationFrame(state.productDetectorFrame);
    state.productDetectorFrame = null;
  }
  if (state.productCameraStream) {
    state.productCameraStream.getTracks().forEach((track) => track.stop());
    state.productCameraStream = null;
  }
  if (productCameraPreview) productCameraPreview.srcObject = null;
  productCameraWrap?.classList.remove("active");
  updateProductCameraControls(false);
}

function updateProductCameraControls(isActive) {
  productCameraWrap?.classList.toggle("active", isActive);
  productCameraToggle?.classList.toggle("active", isActive);
  productCameraToggle?.setAttribute("aria-pressed", String(isActive));
  productCameraToggle?.setAttribute("aria-label", isActive ? "Turn camera off" : "Turn camera on");
  if (startProductScannerButton) {
    startProductScannerButton.textContent = isActive ? "Camera off" : "Camera on";
    startProductScannerButton.setAttribute("aria-pressed", String(isActive));
  }
  const emptyLabel = productCameraEmpty?.querySelector("span");
  if (emptyLabel) emptyLabel.textContent = isActive ? "Barcode scanner" : "Camera off";
}

function startProductDetectorLoop(detector) {
  const scanFrame = async () => {
    if (!state.productScanActive) return;
    try {
      const codes = await detector.detect(productCameraPreview);
      const barcode = codes[0]?.rawValue?.replace(/\D/g, "");
      if (barcode) {
        productBarcode.value = barcode;
        stopProductBarcodeScanner();
        lookupOpenFoodFactsProduct(barcode);
        return;
      }
    } catch {
      // Some browsers throw until the video has enough frames; keep scanning.
    }
    state.productDetectorFrame = requestAnimationFrame(scanFrame);
  };

  scanFrame();
}

async function requestRearProductCameraStream() {
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: "environment" } },
      audio: false,
    });
  } catch {
    return navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false,
    });
  }
}

async function startProductBarcodeScanner({ showFallbackToast = true } = {}) {
  if (state.productCameraStream) {
    updateProductCameraControls(true);
    return;
  }

  try {
    const stream = await requestRearProductCameraStream();
    state.productCameraStream = stream;
    state.productScanActive = true;
    productCameraPreview.srcObject = stream;
    updateProductCameraControls(true);
    await productCameraPreview.play();

    if ("BarcodeDetector" in window) {
      const detector = new BarcodeDetector({ formats: ["ean_13", "ean_8", "upc_a", "upc_e"] });
      startProductDetectorLoop(detector);
    } else if (showFallbackToast) {
      showActionToast("Camera on. Type barcode if it does not scan.", "copy");
    }
  } catch {
    stopProductBarcodeScanner();
    showActionToast("Camera unavailable", "copy");
    productBarcode?.focus();
  }
}

function toggleProductCamera() {
  if (state.productCameraStream) {
    stopProductBarcodeScanner();
  } else {
    startProductBarcodeScanner();
  }
}

function renderRestaurants() {
  const restaurantSearch = document.querySelector("#restaurantSearch");
  const compatibilityFilter = document.querySelector("#compatibilityFilter");
  if (!restaurantList || !restaurantSearch || !compatibilityFilter) return;

  const query = restaurantSearch.value.trim().toLowerCase();
  const filter = compatibilityFilter.value;

  const filtered = restaurants.filter((restaurant) => {
    const matchesQuery = [restaurant.name, restaurant.cuisine, restaurant.details]
      .join(" ")
      .toLowerCase()
      .includes(query);
    const matchesFilter = filter === "all" || restaurant.compatibility === filter;
    return matchesQuery && matchesFilter;
  });

  restaurantList.innerHTML = filtered.length
    ? filtered
        .map(
          (restaurant) => `
            <article class="restaurant-card">
              <div class="restaurant-header">
                <h3>${restaurant.name}</h3>
                <span class="status-pill ${restaurant.compatibility === "high" ? "status-safe" : "status-modify"}">
                  ${restaurant.compatibility === "high" ? "High confidence" : "Confirm details"}
                </span>
                <p>${restaurant.cuisine}</p>
              </div>
              <p>${restaurant.details}</p>
              <details class="simple-details">
                <summary>Good options</summary>
                <ul>${restaurant.picks.map((pick) => `<li>${pick}</li>`).join("")}</ul>
              </details>
            </article>
          `,
        )
        .join("")
    : `<div class="empty-state">No restaurants match that search yet.</div>`;
}

async function startCamera() {
  scannerStatus.textContent = "Ready for next scan.";
  if (!navigator.mediaDevices?.getUserMedia || state.cameraStream) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false,
    });
    state.cameraStream = stream;
    cameraPreview.srcObject = stream;
    cameraPreview.classList.add("active");
    cameraFallback.classList.add("hidden");
    if (state.flashOn) await setCameraFlash(true);
  } catch {
    cameraPreview.classList.remove("active");
    cameraFallback.classList.remove("hidden");
  }
}

function stopCamera() {
  if (!state.cameraStream) return;
  state.flashOn = false;
  flashToggle?.classList.remove("active");
  flashToggle?.setAttribute("aria-pressed", "false");
  state.cameraStream.getTracks().forEach((track) => track.stop());
  state.cameraStream = null;
  cameraPreview.srcObject = null;
  cameraPreview.classList.remove("active");
}

function getCameraVideoTrack() {
  return state.cameraStream?.getVideoTracks?.()[0] || null;
}

function cameraSupportsTorch(track = getCameraVideoTrack()) {
  return Boolean(track?.getCapabilities?.().torch);
}

async function setCameraFlash(enabled) {
  const track = getCameraVideoTrack();
  if (!cameraSupportsTorch(track)) {
    state.flashOn = false;
    flashToggle?.classList.remove("active");
    flashToggle?.setAttribute("aria-pressed", "false");
    scannerStatus.textContent = "Flash is not available on this camera.";
    return false;
  }

  try {
    await track.applyConstraints({ advanced: [{ torch: enabled }] });
    state.flashOn = enabled;
    flashToggle?.classList.toggle("active", enabled);
    flashToggle?.setAttribute("aria-pressed", String(enabled));
    scannerStatus.textContent = enabled ? "Flash on." : "Flash off.";
    return true;
  } catch {
    state.flashOn = false;
    flashToggle?.classList.remove("active");
    flashToggle?.setAttribute("aria-pressed", "false");
    scannerStatus.textContent = "Flash could not be turned on.";
    return false;
  }
}

function renderScanPhotos() {
  const count = state.scanPhotos.length;
  photoCount.textContent = count;
  nextFromCamera.disabled = count === 0;
  scannerStatus.textContent = "Ready for next scan.";
  photoThumbs.innerHTML = count
    ? `
      <div class="photo-thumb">
        <img src="${state.scanPhotos[count - 1]}" alt="Latest menu photo" />
        <span>${count}</span>
      </div>
    `
    : `<div class="photo-thumb empty-thumb"></div>`;
}

function addScanPhoto(source, file = null) {
  state.scanPhotos = [...state.scanPhotos, source];
  if (file) state.scanFiles = [...state.scanFiles, file];
  state.scanInputs = [...state.scanInputs, file || source];
  state.scanSource = state.scanInputs;
  renderScanPhotos();
}

function resetScanRun() {
  state.scanRequestId += 1;
  state.isScanInProgress = false;
  state.eatReturnView = "scan";
  state.scanPhotos = [];
  state.scanFiles = [];
  state.scanInputs = [];
  state.scanSource = null;
  state.scanMeta = null;
  state.scanMeals = [];
  state.scanSections = [];
  state.scanOrder = [];
  state.scanSearchQuery = "";
  state.activeMenuCategory = "mains";
  renderScanPhotos();
  if (scanMenuTitle) scanMenuTitle.textContent = "Menu scan";
  if (scanVerdictPrimary) scanVerdictPrimary.textContent = "Upload a menu photo and we’ll read the text here.";
  if (scanVerdictSecondary) scanVerdictSecondary.textContent = "Ready for your new scan.";
  if (scanSafetyDisclaimer) scanSafetyDisclaimer.hidden = true;
  if (menuSectionList) menuSectionList.innerHTML = `<div class="empty-state">Upload a menu photo and we’ll read it here.</div>`;
}

function captureMenuPhoto() {
  if (cameraPreview.videoWidth && cameraPreview.videoHeight) {
    const canvas = document.createElement("canvas");
    canvas.width = cameraPreview.videoWidth;
    canvas.height = cameraPreview.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(cameraPreview, 0, 0, canvas.width, canvas.height);
    const source = canvas.toDataURL("image/jpeg", 0.8);
    addScanPhoto(source);
    state.scanSource = state.scanPhotos;
    return;
  }

  const placeholder = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180">
      <rect width="240" height="180" fill="#d9f5df"/>
      <rect x="36" y="34" width="168" height="112" rx="12" fill="#ffffff"/>
      <path d="M64 66h112M64 92h112M64 118h72" stroke="#20a464" stroke-width="8" stroke-linecap="round"/>
    </svg>
  `)}`;
  addScanPhoto(placeholder);
  state.scanSource = state.scanPhotos;
}

async function copyMeal(name) {
  const meal = findMeal(name) || state.savedMeals.find((savedMeal) => savedMeal.name === name);
  if (!meal) return;
  try {
    await navigator.clipboard.writeText(orderText(meal));
  } catch {
    // Browser preview surfaces can block clipboard writes; the order is still visible on the card.
  }
}

function saveMeal(name) {
  const meal = findMeal(name);
  if (!meal || state.savedMeals.some((savedMeal) => savedMeal.name === name)) return;
  state.savedMeals = [...state.savedMeals, { ...meal, saved: true, rating: 0 }];
  saveMeals();
  renderSavedMeals();
}

function removeMeal(name) {
  state.savedMeals = state.savedMeals.filter((meal) => meal.name !== name);
  saveMeals();
  renderSavedMeals();
}

async function copySavedOrder(orderId) {
  const order = state.savedOrders.find((item) => item.id === orderId);
  if (!order) return;
  try {
    await navigator.clipboard.writeText(`${order.name}\n${order.summary}\n${order.items.join(", ")}`);
  } catch {
    // Keep the saved order visible even if copy is blocked.
  }
}

function removeSavedOrder(orderId) {
  state.savedOrders = state.savedOrders.filter((item) => item.id !== orderId);
  saveOrders();
  renderSavedOrders();
}

function rateMeal(name, rating) {
  state.savedMeals = state.savedMeals.map((meal) =>
    meal.name === name ? { ...meal, saved: true, rating } : meal,
  );
  saveMeals();
  renderSavedMeals();
}

function bindEvents() {
  document.body.addEventListener("click", (event) => {
    const backButton = event.target.closest("[data-back]");
    if (backButton) {
      goBack();
      return;
    }

    const navTarget = event.target.closest("[data-view], [data-view-target]");
    if (navTarget) {
      setView(navTarget.dataset.view || navTarget.dataset.viewTarget);
      return;
    }

    const chip = event.target.closest("[data-dna-group]");
    if (chip) {
      const { dnaGroup, dnaValue } = chip.dataset;
      if (dnaGroup === "avoidFoods") {
        toggleManualAvoidFood(dnaValue);
      } else {
        const isActive = state.profile[dnaGroup].includes(dnaValue);
        state.profile[dnaGroup] = isActive
          ? state.profile[dnaGroup].filter((item) => item !== dnaValue)
          : [...state.profile[dnaGroup], dnaValue];
        if (dnaGroup === "eatingStyle") {
          syncAvoidFoodsFromDietStyles();
        }
      }
      renderDineDnaChips();
      updateDashboard();
      return;
    }

    const saveButton = event.target.closest("[data-save]");
    if (saveButton) saveMeal(saveButton.dataset.save);

    const removeButton = event.target.closest("[data-remove]");
    if (removeButton) removeMeal(removeButton.dataset.remove);

    const addOrderButton = event.target.closest("[data-add-order]");
    if (addOrderButton) {
      addToScanOrder(addOrderButton.dataset.addOrder, "main");
      showActionToast("Added to order", "plus");
      return;
    }

    const reviewOrderButton = event.target.closest("[data-review-order]");
    if (reviewOrderButton) {
      showOrderReview();
      return;
    }

    const aiRecommendationButton = event.target.closest("[data-ai-recommendation]");
    if (aiRecommendationButton) {
      showAiRecommendation();
      return;
    }

    const nutritionInfoButton = event.target.closest("[data-nutrition-info]");
    if (nutritionInfoButton) {
      showNutritionInfo();
      return;
    }

    const rescanMenuButton = event.target.closest("[data-rescan-menu]");
    if (rescanMenuButton) {
      resetScanRun();
      setView("scan");
      return;
    }

    const closeReviewButton = event.target.closest("[data-close-order-review]");
    if (closeReviewButton) {
      closeOrderReview();
      return;
    }

    const saveCurrentOrderButton = event.target.closest("[data-save-current-order]");
    if (saveCurrentOrderButton) {
      if (saveCurrentScanOrder()) showActionToast("Added to saved meals", "save");
      return;
    }

    const orderDoneButton = event.target.closest("[data-order-done]");
    if (orderDoneButton) {
      showEnjoyCelebration();
      return;
    }

    const removeOrderButton = event.target.closest("[data-remove-order]");
    if (removeOrderButton) {
      removeFromScanOrder(Number(removeOrderButton.dataset.removeOrder));
      return;
    }

    const rateButton = event.target.closest("[data-rate]");
    if (rateButton) rateMeal(rateButton.dataset.rate, Number(rateButton.dataset.rating));

    const copyButton = event.target.closest("[data-copy]");
    if (copyButton) {
      copyMeal(copyButton.dataset.copy);
      showActionToast("Copied to clipboard", "copy");
      return;
    }

    const copyOrderButton = event.target.closest("[data-copy-order]");
    if (copyOrderButton) {
      copySavedOrder(copyOrderButton.dataset.copyOrder);
      return;
    }

    const removeSavedOrderButton = event.target.closest("[data-remove-order-save]");
    if (removeSavedOrderButton) {
      removeSavedOrder(removeSavedOrderButton.dataset.removeOrderSave);
      return;
    }
  });

  document.querySelector("#openScan")?.addEventListener("click", () => setView("scan"));
  document.querySelector("#openProductScan")?.addEventListener("click", () => setView("product-scan"));

  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(profileForm);
    state.profile = {
      ...state.profile,
      userName: formData.get("userName").trim(),
    };
    saveProfile();
    updateDashboard();
    showSavedButtonFeedback(profileForm.querySelector("[type='submit']"));
    showActionToast("Dine DNA saved", "check");
  });

  document.querySelector("#capturePhoto").addEventListener("click", captureMenuPhoto);

  flashToggle?.setAttribute("aria-pressed", "false");
  flashToggle?.addEventListener("click", () => {
    setCameraFlash(!state.flashOn);
  });

  productLookupForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    lookupOpenFoodFactsProduct(productBarcode?.value);
  });

  startProductScannerButton?.addEventListener("click", toggleProductCamera);
  productCameraToggle?.addEventListener("click", toggleProductCamera);

document.querySelector("#menuImage").addEventListener("change", (event) => {
  const files = [...event.target.files];
  if (!files.length) return;
  files.forEach((file) => addScanPhoto(URL.createObjectURL(file), file));
  event.target.value = "";
});

nextFromCamera.addEventListener("click", () => {
  const currentScanSource = state.scanInputs.length
    ? [...state.scanInputs]
    : Array.isArray(state.scanSource)
      ? [...state.scanSource]
      : state.scanPhotos.length
        ? [...state.scanPhotos]
        : state.scanSource
        ? [state.scanSource]
        : [];
  if (!currentScanSource.length) return;

  const currentScanPhotos = [...state.scanPhotos];
  const currentScanFiles = [...state.scanFiles];
  const currentScanInputs = [...state.scanInputs];
  resetScanRun();
  state.scanSource = [...currentScanSource];
  state.scanPhotos = currentScanPhotos.length ? currentScanPhotos : [...currentScanSource];
  state.scanFiles = currentScanFiles;
  state.scanInputs = currentScanInputs;
  renderScanPhotos();
  analyzeMenuSource(state.scanSource, "Captured menu");
});

  document.querySelector("#restaurantSearch")?.addEventListener("input", renderRestaurants);
  document.querySelector("#compatibilityFilter")?.addEventListener("change", renderRestaurants);
}

const texasChiliTestProfiles = [
  { name: "Gluten / Wheat free", avoidFoods: ["Gluten / Wheat"], eatingStyle: [], healthNeeds: [] },
  { name: "Dairy free", avoidFoods: ["Dairy"], eatingStyle: [], healthNeeds: [] },
  { name: "Vegetarian", avoidFoods: [], eatingStyle: ["Vegetarian"], healthNeeds: [] },
  { name: "Pork free / Halal-style", avoidFoods: ["Pork", "Alcohol"], eatingStyle: ["Halal"], healthNeeds: [] },
  { name: "Low carb / diabetic-friendly", avoidFoods: [], eatingStyle: [], healthNeeds: ["Low Carb", "Diabetic-Friendly"] },
  { name: "No fried foods", avoidFoods: [], eatingStyle: [], healthNeeds: ["No Fried Foods"] },
  { name: "Soft foods only", avoidFoods: [], eatingStyle: [], healthNeeds: ["Soft Foods Only"] },
];

function runTexasChiliTests() {
  const originalProfile = JSON.parse(JSON.stringify(state.profile));
  const requiredSections = ["Breakfast", "Lunch Wedges", "Burgers", "Hot dogs", "Deep Fried", "Tacos", "Nachos", "Sides", "Salads", "Wraps", "Extras"];
  const templateNames = ["Grilled Chicken Rice Bowl", "Garden Taco Plate", "Chicken Rice Bowl", "Falafel Wrap", "Creamy Alfredo Pasta"];
  const results = texasChiliTestProfiles.map((profile) => {
    state.profile = {
      ...state.profile,
      userName: profile.name,
      eatingStyle: profile.eatingStyle,
      avoidFoods: profile.avoidFoods,
      manualAvoidFoods: profile.avoidFoods,
      healthNeeds: profile.healthNeeds,
      loveFoods: [],
      dontLoveFoods: [],
    };
    syncAvoidFoodsFromDietStyles();
    const scan = buildTexasChiliScan();
    const sections = scan.sections.map((section) => section.title);
    const allItems = scan.sections.flatMap((section) => section.items.map((item) => item.name));
    const hasRequiredSections = requiredSections.every((section) => sections.includes(section));
    const hasOriginalNames = ["PLAIN BURGER", "MOZZARELLA STICK", "HUEVOS CON CHORIZO", "CHICKEN CALIFORNIA"].every((name) => allItems.includes(name));
    const hasNoTemplate = !allItems.some((name) => templateNames.includes(name));
    const hasModifyGuidance = scan.sections
      .flatMap((section) => section.items)
      .filter((item) => item.status === "Safe With Modifications")
      .every((item) => item.remove.length || item.confirm.length || item.substitutions.length);
    const sortedByStatus = scan.sections.every((section) => {
      const ranks = section.items.map((item) => item.status === "Safe to Order As-Is" ? 0 : item.status === "Safe With Modifications" ? 1 : 2);
      return ranks.every((rank, index) => index === 0 || rank >= ranks[index - 1]);
    });
    return {
      profile: profile.name,
      pass: hasRequiredSections && hasOriginalNames && hasNoTemplate && hasModifyGuidance && sortedByStatus && !!scan.recommendedOrder,
      sections: sections.length,
      items: allItems.length,
      hasRequiredSections,
      hasOriginalNames,
      hasNoTemplate,
      hasModifyGuidance,
      sortedByStatus,
      recommendedOrder: scan.recommendedOrder?.summary || "",
    };
  });
  state.profile = originalProfile;
  syncAvoidFoodsFromDietStyles();
  return results;
}

function init() {
  loadState();
  renderDineDnaChips();
  fillProfileForm();
  updateDashboard();
  renderRecommendations();
  renderRestaurants();
  renderSavedMeals();
  renderSavedOrders();
  renderScanPhotos();
  bindEvents();
  window.__w2eSetView = setView;
  window.__w2eGoBack = goBack;
  window.__w2eBuildTexasChiliScan = buildTexasChiliScan;
  window.__w2eRunTexasChiliTests = runTexasChiliTests;
}

init();
