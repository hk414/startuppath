const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CalendarEventRequest {
  summary: string
  description: string
  startTime: string
  endTime: string
  attendees: string[]
  calendarId?: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { summary, description, startTime, endTime, attendees, calendarId = 'primary' } = await req.json() as CalendarEventRequest
    
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY')
    if (!googleApiKey) {
      throw new Error('Google API key not configured')
    }

    console.log('Creating calendar event:', { summary, startTime, endTime, attendees })

    // Create Google Calendar event using API key
    const event = {
      summary,
      description,
      start: {
        dateTime: startTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: endTime,
        timeZone: 'UTC',
      },
      attendees: attendees.map(email => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: crypto.randomUUID(),
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    }

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?conferenceDataVersion=1&key=${googleApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Google Calendar API error:', error)
      throw new Error(`Google Calendar API error: ${error}`)
    }

    const calendarEvent = await response.json()
    console.log('Calendar event created successfully:', calendarEvent.id)

    return new Response(
      JSON.stringify({
        success: true,
        eventId: calendarEvent.id,
        htmlLink: calendarEvent.htmlLink,
        meetLink: calendarEvent.conferenceData?.entryPoints?.[0]?.uri,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error creating calendar event:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})