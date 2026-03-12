export default {
  async fetch(request, env) {
    
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    try {
      console.log('API KEY:', env.OPENROUTER_API_KEY ? 'ADA' : 'KOSONG');
      
      const body = await request.json();

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
          model: 'arcee-ai/arcee-trinity:free',
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

      return new Response(JSON.stringify({
        content: [{ type: 'text', text }]
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch(e) {
      return new Response(JSON.stringify({
        content: [{ type: 'text', text: 'Worker error: ' + e.message }]
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};
