import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { record } = await req.json()

    // Crafting your Tactical String: RP|Name|Message|Time|URL
    const tacticalString = `RP|${record.name || 'New Entry'}|"New lead in RolitaPro"|${new Date().toLocaleTimeString()}|https://rolitapro.com`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'RolitaPro <onboarding@resend.dev>', // You can customize this later with your domain
        to: ['YOUR_PHONE_NUMBER@vtext.com'], // Replace with your actual number
        subject: 'New Table Entry',
        text: tacticalString,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
