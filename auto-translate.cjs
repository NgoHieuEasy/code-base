const fs = require("fs");
const path = require("path");
const { globSync } = require("glob");
const translate = require("google-translate-api-x");

const SRC_DIR = "src";
const LOCALES_DIR = path.join(__dirname, "public", "locales");

const BASE_LANG = "en";
const TARGET_LANGS = ["vi", "ko", "tr", "zh-CN"];

const TRANSLATE_REGEX = /t\(['"`]([^'"`]+)['"`]\)/g;

/* -------------------- Utils -------------------- */

function setNestedKey(obj, path, value) {
  const keys = path.split(".");
  const lastKey = keys.pop();
  const lastObj = keys.reduce((acc, k) => {
    acc[k] = acc[k] || {};
    return acc[k];
  }, obj);
  lastObj[lastKey] = value;
}

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, k) => acc && acc[k], obj);
}

function filterByKeys(data, validKeys) {
  const result = {};
  for (const key of validKeys) {
    const value = getNestedValue(data, key);
    if (value !== undefined) {
      setNestedKey(result, key, value);
    }
  }
  return result;
}

function cleanKeyToText(key) {
  return key.split(".").pop().replace(/_/g, " ");
}

function readJSON(file) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/* -------------------- Main -------------------- */

async function run() {
  console.log("\n🔍 Quét toàn bộ file .tsx ...");

  const files = globSync(`${SRC_DIR}/**/*.tsx`);
  const usedKeys = new Set();

  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf8");
    let match;
    while ((match = TRANSLATE_REGEX.exec(content))) {
      usedKeys.add(match[1]);
    }
  });

  const keys = [...usedKeys];

  if (!keys.length) {
    console.log("❌ Không tìm thấy key nào.");
    return;
  }

  if (!fs.existsSync(LOCALES_DIR)) {
    fs.mkdirSync(LOCALES_DIR, { recursive: true });
  }

  /* ---------- EN (SOURCE OF TRUTH) ---------- */

  const enPath = path.join(LOCALES_DIR, `${BASE_LANG}.json`);
  let enData = readJSON(enPath);

  console.log("\n🇺🇸 Cập nhật en.json");

  keys.forEach((key) => {
    const existing = getNestedValue(enData, key);
    if (!existing) {
      setNestedKey(enData, key, cleanKeyToText(key));
      console.log(`  ➕ ${key}`);
    }
  });

  // ❌ XÓA KEY KHÔNG DÙNG
  enData = filterByKeys(enData, keys);
  writeJSON(enPath, enData);

  console.log("🧹 Đã dọn rác en.json");

  /* ---------- OTHER LANGUAGES ---------- */

  for (const lang of TARGET_LANGS) {
    console.log(`\n🌐 Dịch sang ${lang.toUpperCase()}`);

    const filePath = path.join(LOCALES_DIR, `${lang}.json`);
    let langData = readJSON(filePath);

    for (const key of keys) {
      const currentValue = getNestedValue(langData, key);
      const sourceText = getNestedValue(enData, key);

      if (!currentValue || currentValue.includes("_")) {
        try {
          const res = await translate(sourceText, {
            from: BASE_LANG,
            to: lang,
            forceTo: true,
          });
          setNestedKey(langData, key, res.text);
          console.log(`  🌍 ${key} → ${res.text}`);
        } catch (err) {
          console.error(`  ❌ Lỗi dịch key: ${key}`);
        }
      }
    }

    // ❌ XÓA KEY KHÔNG DÙNG
    langData = filterByKeys(langData, keys);
    writeJSON(filePath, langData);

    console.log(`🧹 Đã dọn rác ${lang}.json`);
  }

  console.log("\n🚀 HOÀN TẤT DỊCH & CLEAN I18N\n");
}

run();
