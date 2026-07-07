# 08_BACKEND_API.md

# Backend API

The backend is responsible for receiving the user's query, sending it to the AI, retrieving relevant government service data, and returning a structured response.

---

## Main Endpoint

### POST /api/generate

Accepts a natural language query.

Example Request

{
  "query": "I want to apply for a passport."
}

---

## Response

The response should always follow this structure.

{
  "summary": "...",
  "services": [],
  "next_steps": [],
  "tips": []
}

---

## Service Object

Each service should include:

- name
- description
- required_documents
- application_steps
- processing_time
- application_fee
- official_apply_link
- official_information_link

---

## AI Workflow

1. Receive user query.
2. Detect user intent.
3. Search the knowledge base.
4. Send relevant context to the LLM.
5. Generate a structured response.
6. Return JSON to the frontend.

---

## Error Handling

If no matching service is found:

Return a friendly message asking the user to clarify their request.

Example:

"Are you applying for a new passport or renewing an existing one?"

Never return technical errors to the user.

---

## Performance

- Keep API responses fast.
- Validate all inputs.
- Cache common queries if possible.
- Return clean JSON for easy frontend rendering.

---

## Security

- Never expose API keys.
- Store secrets in environment variables.
- Validate user input before sending it to the AI.
- Only return trusted government information.
