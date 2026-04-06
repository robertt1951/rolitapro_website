import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { record } = await req.json()

    // Your Tactical String: RP|Name|Event|Time|URL
    const tacticalString = `RP|${record.name || 'User'}|"New Table Entry"|${new Date().toLocaleTimeString()}|https://rolitapro.com`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'RolitaPro <onboarding@resend.dev>',
        // Sending to both Gmail and Verizon Phone
        to: ['rtarver51@gmail.com', 'YOUR_10_DIGIT_NUMBER@vtext.com'], 
        subject: 'RP Alert',
        text: tacticalString,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
