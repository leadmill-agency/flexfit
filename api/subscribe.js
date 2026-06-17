// Vercel serverless function — bridges the site's custom forms → beehiiv API.
//
// The beehiiv API key is a SECRET: it stays server-side here, read from env.
// Set these in Vercel → Project → Settings → Environment Variables:
//   BEEHIIV_API_KEY          (regenerate it in beehiiv; never hardcode / never paste in chat)
//   BEEHIIV_PUBLICATION_ID   (looks like  pub_xxxxxxxx ; not secret)
//
// Optional: create custom fields in beehiiv (Settings → Custom Fields) named
//   First Name · Phone · Interest · Preferred Time
// so the extra fields attach to subscribers. If they don't exist, this function
// retries without them so the email is still captured.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const API_KEY = process.env.BEEHIIV_API_KEY;
  const PUB_ID = process.env.BEEHIIV_PUBLICATION_ID;
  if (!API_KEY || !PUB_ID) {
    res.status(500).json({ error: 'Server not configured (missing BEEHIIV env vars)' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  // Honeypot: a bot filled the hidden field → silently accept and drop.
  if (body['bot-field']) { res.status(200).json({ success: true }); return; }

  const email = String(body.email || '').trim();
  if (!email) { res.status(400).json({ error: 'Email required' }); return; }

  const customFields = [];
  const add = (name, value) => { if (value) customFields.push({ name, value: String(value) }); };
  add('First Name', body.name);
  add('Phone', body.phone);
  add('Interest', body.interest);
  add('Preferred Time', body.time);

  const subscribe = (withCustom) => fetch(
    `https://api.beehiiv.com/v2/publications/${PUB_ID}/subscriptions`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: false,
        utm_source: 'website',
        utm_medium: 'form',
        utm_campaign: body['form-name'] || 'website',
        ...(withCustom && customFields.length ? { custom_fields: customFields } : {})
      })
    }
  );

  try {
    let r = await subscribe(true);
    if (!r.ok && customFields.length) {
      // Likely a custom field isn't set up in beehiiv — retry with just the email so it's not lost.
      console.error('beehiiv (with custom fields) failed', r.status, await r.text().catch(() => ''));
      r = await subscribe(false);
    }
    if (!r.ok) {
      console.error('beehiiv subscribe failed', r.status, await r.text().catch(() => ''));
      res.status(502).json({ error: 'Subscribe failed' });
      return;
    }
    res.status(200).json({ success: true });
  } catch (e) {
    console.error('beehiiv request error', e);
    res.status(502).json({ error: 'Subscribe failed' });
  }
};
