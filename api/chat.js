module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    console.log('API KEY:', apiKey ? 'ADA' : 'KOSONG');

    const body = req.body;
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://siggymultiverse-ai.vercel.app',
        'X-Title': 'Siggy Chat'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          { role: 'system', content: body.system || '' },
          ...body.messages
        ],
        max_tokens: 350
      })
    });

    const data = await response.json();
    console.log('OpenRouter:', JSON.stringify(data));
    const text = data.choices?.[0]?.message?.content || 'error: ' + JSON.stringify(data.error);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({
      content: [{ type: 'text', text }]
    });

  } catch(e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({
      content: [{ type: 'text', text: 'Worker error: ' + e.message }]
    });
  }
}
