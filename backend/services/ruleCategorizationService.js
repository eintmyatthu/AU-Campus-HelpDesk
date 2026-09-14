const { Category, Priority } = require("@prisma/client");

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function contains(text, phrase) {
  const normalizedPhrase = normalize(phrase);
  return ` ${text} `.includes(` ${normalizedPhrase} `);
}

const CATEGORY_RULES = [
  {
    category: Category.PRINTER,
    terms: [
      ["printer", 4],
      ["printing", 4],
      ["cannot print", 4],
      ["paper jam", 5],
      ["toner", 4],
      ["scanner", 3]
    ]
  },
  {
    category: Category.CLASSROOM_EQUIPMENT,
    terms: [
      ["projector", 5],
      ["classroom display", 5],
      ["microphone", 4],
      ["smart board", 4],
      ["hdmi", 4],
      ["av equipment", 4],
      ["lecture room equipment", 4]
    ]
  },
  {
    category: Category.ACCOUNT_ACCESS,
    terms: [
      ["forgot password", 5],
      ["reset password", 5],
      ["password", 3],
      ["account locked", 5],
      ["locked account", 5],
      ["cannot login", 4],
      ["cannot log in", 4],
      ["cannot sign in", 4],
      ["authentication", 3],
      ["authenticator", 3],
      ["mfa", 3],
      ["microsoft account", 3]
    ]
  },
  {
    category: Category.NETWORK,
    terms: [
      ["wifi", 5],
      ["wi fi", 5],
      ["wireless", 4],
      ["internet", 4],
      ["network", 4],
      ["ethernet", 4],
      ["dns", 4],
      ["vpn", 4],
      ["connectivity", 3],
      ["cannot connect", 2],
      ["connection timeout", 3]
    ]
  },
  {
    category: Category.HARDWARE,
    terms: [
      ["hardware", 4],
      ["keyboard", 4],
      ["mouse", 4],
      ["monitor", 4],
      ["battery", 3],
      ["power button", 4],
      ["will not turn on", 5],
      ["blue screen", 5],
      ["broken device", 4],
      ["physical damage", 5]
    ]
  },
  {
    category: Category.SOFTWARE,
    terms: [
      ["software", 4],
      ["application", 3],
      ["app", 3],
      ["install", 3],
      ["installation", 3],
      ["update error", 4],
      ["crash", 4],
      ["crashes", 4],
      ["freezes", 4],
      ["not responding", 4],
      ["vscode", 5],
      ["visual studio code", 5],
      ["browser", 3]
    ]
  }
];

const URGENT_TERMS = [
  "campus wide",
  "entire campus",
  "university wide",
  "all users",
  "all students",
  "multiple buildings",
  "security breach",
  "data breach",
  "critical campus outage"
];

const HIGH_TERMS = [
  "cannot attend class",
  "class cannot start",
  "class is blocked",
  "exam in progress",
  "cannot work",
  "unable to work",
  "completely unavailable",
  "completely down",
  "no workaround",
  "blocking my work"
];

const LOW_TERMS = [
  "minor issue",
  "cosmetic",
  "workaround available",
  "still usable",
  "occasionally",
  "intermittent",
  "not urgent"
];

function determineCategory(text) {
  let selectedCategory = Category.OTHER;
  let highestScore = 0;

  for (const rule of CATEGORY_RULES) {
    let score = 0;

    for (const [term, weight] of rule.terms) {
      if (contains(text, term)) {
        score += weight;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      selectedCategory = rule.category;
    }
  }

  return selectedCategory;
}

function determinePriority(text) {
  if (URGENT_TERMS.some((term) => contains(text, term))) {
    return Priority.URGENT;
  }

  if (HIGH_TERMS.some((term) => contains(text, term))) {
    return Priority.HIGH;
  }

  if (LOW_TERMS.some((term) => contains(text, term))) {
    return Priority.LOW;
  }

  return Priority.MEDIUM;
}

async function categorizeTicket(title, description) {
  const text = normalize(`${title} ${description}`);

  return {
    category: determineCategory(text),
    priority: determinePriority(text)
  };
}

module.exports = {
  categorizeTicket,
  determineCategory,
  determinePriority
};
