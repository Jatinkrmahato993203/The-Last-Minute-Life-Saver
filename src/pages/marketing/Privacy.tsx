export function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-display mb-12 text-ink">Privacy Policy</h1>
      
      <div className="space-y-8 text-ink/80 text-sm leading-relaxed font-sans">
        <section>
          <h2 className="text-lg font-bold text-ink mb-4">1. Data Collection</h2>
          <p>
            Oracle requests read-only access to your Google Calendar to determine free and busy slots. We do not store the content of your events, only the blocked time intervals.
          </p>
        </section>
        
        <section>
          <h2 className="text-lg font-bold text-ink mb-4">2. Processing</h2>
          <p>
            Your calendar availability, combined with your manually entered tasks, is processed locally or in memory to compute your risk score. 
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink mb-4">3. DPDP Compliance</h2>
          <p>
            In accordance with the Digital Personal Data Protection Act, we only process data for which you have provided explicit consent. You may revoke this consent and delete your account at any time from your settings.
          </p>
        </section>
      </div>
    </div>
  );
}
