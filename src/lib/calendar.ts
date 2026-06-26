export async function getFreeBusy(accessToken: string, daysRemaining: number) {
  try {
    const timeMin = new Date().toISOString();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysRemaining);
    const timeMax = endDate.toISOString();

    const response = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeMin,
        timeMax,
        items: [{ id: "primary" }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Calendar API error: ${response.statusText}`);
    }

    const data = await response.json();
    const busyPeriods = data.calendars.primary.busy as { start: string; end: string }[];
    
    // Total hours in the period
    const totalHours = daysRemaining * 24;
    // Assume user sleeps 8 hours, 16 hours waking
    const wakingHours = daysRemaining * 16;
    
    // Calculate total busy hours
    let busyHours = 0;
    for (const period of busyPeriods) {
      const start = new Date(period.start).getTime();
      const end = new Date(period.end).getTime();
      busyHours += (end - start) / (1000 * 60 * 60);
    }
    
    const freeHours = Math.max(0, wakingHours - busyHours);
    return freeHours;
  } catch (error) {
    console.error("Error fetching free/busy from calendar", error);
    // Fallback if it fails (e.g., token expired)
    return null;
  }
}
