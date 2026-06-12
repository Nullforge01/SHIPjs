import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Certificate ID required' });
    }

    const certData = await kv.get(`cert:${id.toUpperCase()}`);

    if (!certData) {
      return res.status(404).json({ 
        valid: false, 
        error: 'Certificate not found' 
      });
    }

    return res.status(200).json({
      valid: true,
      certificate: {
        id: certData.id,
        name: certData.name,
        date: certData.date,
        timeSec: certData.timeSec,
        xp: certData.xp,
        lessonsCompleted: certData.lessonsCompleted,
        issuedBy: certData.issuedBy
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ 
      valid: false, 
      error: 'Verification failed' 
    });
  }
}
