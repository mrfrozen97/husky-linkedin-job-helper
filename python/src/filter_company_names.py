import pandas as pd
import re
from collections import defaultdict
import json

# =========================
# 1. LOAD FILE SAFELY
# =========================

df = pd.read_csv(
    "../data/Employer Information.csv",
    encoding="utf-16",
    sep="\t",
    engine="python",
    on_bad_lines="skip",
    dtype=str
)

# =========================
# 2. CLEAN EMPLOYER COLUMN
# =========================

df = df[df["Employer (Petitioner) Name"].notna()]
df = df[df["Employer (Petitioner) Name"].str.strip() != ""]

# =========================
# 3. CONVERT APPROVAL COLUMNS TO NUMERIC
# =========================

approval_cols = [
    "New Employment Approval",
    "Continuation Approval",
    "Change of Employer Approval",
    "New Concurrent Approval",
    "Change with Same Employer Approval"
]

for col in approval_cols:
    df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

# =========================
# 4. CALCULATE TOTAL APPROVALS
# =========================

df["Total Approvals"] = df[approval_cols].sum(axis=1)

# =========================
# 5. NORMALIZE COMPANY NAMES
# =========================

def normalize_company(name):
    name = name.lower()

    # remove punctuation
    name = re.sub(r"[.,&\-]", " ", name)

    # remove legal suffixes
    name = re.sub(
        r"\b(inc|llc|ltd|corp|corporation|company|co|pllc|pc|limited|services|service|group|holdings|technologies|technology)\b",
        "",
        name
    )

    # remove common USCIS patterns
    name = re.sub(r"\bdba\b.*", "", name)

    name = re.sub(r"\s+", " ", name)

    return name.strip()

company_counts = defaultdict(int)

for _, row in df.iterrows():
    normalized = normalize_company(row["Employer (Petitioner) Name"])
    company_counts[normalized] += row["Total Approvals"]

# =========================
# 6. REMOVE VERY SMALL SPONSORS (OPTIONAL)
# =========================

MIN_THRESHOLD = 3  # change if needed

filtered = {
    k: int(v)
    for k, v in company_counts.items()
    if v >= MIN_THRESHOLD
}

# =========================
# 7. SORT BY TOTAL APPROVALS (DESC)
# =========================

filtered_sorted = dict(
    sorted(filtered.items(), key=lambda x: x[1], reverse=True)
)

# =========================
# 8. SAVE JSON
# =========================

with open("h1b_companies.json", "w") as f:
    json.dump(filtered_sorted, f, indent=1)

print("Done.")
print("Total companies:", len(filtered_sorted))