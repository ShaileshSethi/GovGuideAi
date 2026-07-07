# 05_DATABASE.md

# Database Structure

The application should use a structured knowledge base instead of relying only on AI.

The AI should retrieve information from this data and present it in a user-friendly format.

---

## Service

Each government service should contain:

- id
- name
- description
- category
- estimated_processing_time
- application_fee
- official_apply_link
- official_information_link
- eligibility
- application_steps

---

## Required Documents

Each service contains a list of required documents.

Each document should include:

- name
- mandatory (true/false)
- purpose
- where_to_get
- issuing_authority
- official_link

---

## Common Mistakes

Each service should include common reasons for application rejection.

Examples:

- Name mismatch
- Missing document
- Expired proof
- Incorrect photo size

---

## Example Structure

Service

Passport

↓

Documents

- Aadhaar Card
- PAN Card
- Birth Certificate
- Passport Photo

↓

Application Steps

1. Gather documents
2. Fill application form
3. Pay fee
4. Book appointment
5. Visit Passport Seva Kendra
6. Track application

---

## Initial Services

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

## Future Expansion

The database should be easy to extend by adding new services without changing the application logic.

Each service should follow the same structure for consistency.