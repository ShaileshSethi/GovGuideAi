# 06_AI_LOGIC.md

# AI Logic

The AI is the core of GovGuide AI.

Its job is not just to answer questions but to understand the user's situation and generate a structured government action plan.

---

## Step 1: Understand the User

The AI should accept natural language queries.

Examples:

- I lost my Aadhaar card
- I got married
- I need a passport
- My child was born
- I changed my address

The user should never need to know the exact government service name.

---

## Step 2: Detect Intent

Identify the user's goal.

Examples:

"I lost my wallet"

↓

Intent:

Replace important government documents

---

"I got married"

↓

Intent:

Update personal records

---

"I want to study abroad"

↓

Intent:

Obtain travel and identity documents

---

## Step 3: Find Relevant Services

Search the knowledge base for one or more matching government services.

One query may return multiple services.

Example:

"I got married"

Returns:

- Aadhaar Update
- PAN Update
- Passport Update

---

## Step 4: Generate the Response

For each service, provide:

- Service Name
- Why it's needed
- Required Documents
- Application Steps
- Fees
- Processing Time
- Official Links

Always present the information in a structured format.

---

## AI Rules

- Keep responses short and easy to understand.
- Use bullet points instead of long paragraphs.
- Never invent document requirements.
- Only recommend services found in the knowledge base.
- If unsure, ask a follow-up question instead of guessing.

---

## Example Response

User:

"I need a passport."

AI:

Summary

"You need four documents before applying."

Service:

Passport

Documents:

- Aadhaar Card
- PAN Card
- Birth Certificate
- Passport Photo

Processing Time:

2–3 Weeks

Fee:

₹1500

Official Apply Link

Application Steps

---

## Future Improvements

- Multilingual support
- Voice input
- OCR document verification
- Personalized recommendations
- Complaint assistance