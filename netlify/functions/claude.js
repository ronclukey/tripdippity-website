// Netlify Function: secure proxy for Anthropic Claude API
// Path: /netlify/functions/claude.js
// Called from browser as: /.netlify/functions/claude
//
// The browser sends { model, max_tokens, messages } in the request body.
// This function adds the API key from a secure environment variable (never visible to browser)
// and forwards to api.anthropic.com, then returns the response.

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed. Use POST." })
    };
  }

  // Verify the API key is configured on the server
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Server is not configured with ANTHROPIC_API_KEY." })
    };
  }

  // Parse the body the browser sent
  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid JSON in request body." })
    };
  }

  // Basic validation — make sure required fields are present
  if (!body.model || !body.messages) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing required fields: model and messages." })
    };
  }

  // Forward to Anthropic with the API key attached
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: body.model,
        max_tokens: body.max_tokens || 1024,
        messages: body.messages,
        ...(body.system && { system: body.system })
      })
    });

    const data = await response.json();

    // Pass through Anthropic's response (whether success or error)
    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (err) {
    // Network or other unexpected error
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to reach Anthropic API.", detail: err.message })
    };
  }
};
