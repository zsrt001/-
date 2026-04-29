import { randomInt } from "crypto";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { supabaseRest } from "../lib/supabaseAdmin";

type RedeemCodeType = "internal_test" | "sale";

type RedeemCodeInsert = {
  code: string;
  status: "unused";
  type: RedeemCodeType;
};

type RedeemCodeRow = {
  code: string;
  status: string;
  type: RedeemCodeType;
};

const codeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const codePrefix = "SA-2026";
const defaultInternalTestCount = 20;
const defaultSaleCount = 100;
const maxAttempts = 5000;

function loadEnvFile(filename: string) {
  const filepath = resolve(process.cwd(), filename);

  if (!existsSync(filepath)) {
    return;
  }

  const content = readFileSync(filepath, "utf8");

  content.split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      return;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

function createCode() {
  let suffix = "";

  for (let index = 0; index < 4; index += 1) {
    suffix += codeAlphabet[randomInt(codeAlphabet.length)];
  }

  return `${codePrefix}-${suffix}`;
}

async function insertRedeemCodes(rows: RedeemCodeInsert[]) {
  return supabaseRest<RedeemCodeRow[]>("redeem_codes", {
    body: rows,
    method: "POST",
    prefer: "resolution=ignore-duplicates,return=representation",
    searchParams: {
      on_conflict: "code",
      select: "code,status,type"
    }
  });
}

async function generateCodeGroup(type: RedeemCodeType, count: number) {
  const insertedCodes: RedeemCodeRow[] = [];
  const generatedCodes = new Set<string>();
  let attempts = 0;

  while (insertedCodes.length < count) {
    attempts += 1;

    if (attempts > maxAttempts) {
      throw new Error(`Failed to generate enough unique ${type} codes.`);
    }

    const remainingCount = count - insertedCodes.length;
    const batchSize = Math.min(Math.max(remainingCount * 2, 20), 80);
    const batch: RedeemCodeInsert[] = [];

    while (batch.length < batchSize) {
      const code = createCode();

      if (generatedCodes.has(code)) {
        continue;
      }

      generatedCodes.add(code);
      batch.push({
        code,
        status: "unused",
        type
      });
    }

    const insertedRows = await insertRedeemCodes(batch);
    insertedCodes.push(...insertedRows.slice(0, remainingCount));
  }

  return insertedCodes;
}

async function main() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  const internalTestCodes = await generateCodeGroup(
    "internal_test",
    defaultInternalTestCount
  );
  const saleCodes = await generateCodeGroup("sale", defaultSaleCount);
  const allCodes = [...internalTestCodes, ...saleCodes];

  console.log(`Generated ${allCodes.length} redeem codes.`);
  console.log(`internal_test: ${internalTestCodes.length}`);
  console.log(`sale: ${saleCodes.length}`);
  console.log(allCodes.map((item) => `${item.code},${item.type}`).join("\n"));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
