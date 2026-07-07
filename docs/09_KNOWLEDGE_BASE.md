# 09_KNOWLEDGE_BASE.md

# Knowledge Base

GovGuide AI should use a structured knowledge base containing verified government service information.

The AI should retrieve information from this knowledge base instead of generating facts from memory.

---

# Storage Format

Store the knowledge base as JSON files.

Example:

/data/
    passport.json
    aadhaar.json
    pan.json
    driving_license.json
    voter_id.json

This makes it easy to update services independently.

---

# Service Structure

Each service should contain:

- Service Name
- Description
- Eligibility
- Required Documents
- Application Steps
- Processing Time
- Application Fee
- Official Apply Link
- Official Information Link
- Common Mistakes
- FAQs

---

# Required Documents

Each document should include:

- Document Name
- Mandatory (Yes/No)
- Why it is required
- Where to obtain it
- Issuing Authority
- Official Website

---

# AI Retrieval Flow

User Query

↓

AI detects intent

↓

Search matching service JSON

↓

Retrieve structured data

↓

Generate easy-to-read response

---

# Initial Services

The MVP should include:

- Passport
- Aadhaar
- PAN Card
- Driving Licence
- Voter ID
- Birth Certificate
- Marriage Certificate
- Income Certificate
- Caste Certificate
- Domicile Certificate
- Police Clearance Certificate

---

# Future Expansion

Adding a new service should only require creating a new JSON file following the same structure.

No backend code changes should be necessary.

---

# Accuracy

Always prioritize official government information.

If required information is missing, clearly state that it is unavailable instead of guessing.

The AI should never invent document requirements or application steps.