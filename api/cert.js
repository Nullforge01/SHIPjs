import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, timeSec, xp, lessonsCompleted } = req.body;
    
    if (!name || timeSec == null || xp == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate cert ID
    const id = Math.random().toString(36).substring(2, 10).toUpperCase();
    const date = new Date().toISOString();
    
    const certData = {
      id,
      name,
      date,
      timeSec,
      xp,
      lessonsCompleted,
      issuedBy: 'Wild Lirt Studio',
      verified: true
    };

    // Store in Vercel KV for 10 years
    await kv.set(`cert:${id}`, certData, { ex: 60 * 60 * 24 * 365 * 10 });

    return res.status(200).json({ 
      success: true, 
      id,
      verifyUrl: `https://shipjs.dev/verify.html?id=${id}`
    });

  } catch (error) {
    console.error('Cert generation error:', error);
    return res.status(500).json({ error: 'Failed to generate certificate' });
  }
}
