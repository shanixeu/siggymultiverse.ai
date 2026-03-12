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
      const apiKey = process.env.OPENROUTER_API_KEY || env.OPENROUTER_API_KEY;
      console.log('API KEY:', apiKey ? 'ADA' : 'KOSONG');
      
      const body = await request.json();
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTT
