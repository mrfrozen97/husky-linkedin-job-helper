import pandas as pd
import json
from collections import defaultdict

# =========================
# 1. LOAD FILE
# =========================

df = pd.read_excel(
    "../data/LCA_Disclosure_Data_FY2025_Q1.xlsx",
    dtype=str,
    engine="openpyxl"
)
# =========================
# 2. CLEAN COLUMNS
# =========================

df = df[df["EMPLOYER_NAME"].notna()]
df = df[df["EMPLOYER_NAME"].str.strip() != ""]

# =========================
# 3. FILTER LEVEL I WAGES
# =========================

df = df[df["PW_WAGE_LEVEL"] == "I"]

# =========================
# 4. COUNT PER EMPLOYER
# =========================

company_counts = defaultdict(int)

for name in df["EMPLOYER_NAME"]:
    company_counts[name.strip()] += 1

# =========================
# 5. SORT
# =========================

company_counts = dict(
    sorted(company_counts.items(), key=lambda x: x[1], reverse=True)
)

# =========================
# 6. SAVE JSON
# =========================

with open("level1_wage_companies.json", "w") as f:
    json.dump(company_counts, f, indent=1)

print("Done.")
print("Total companies:", len(company_counts))