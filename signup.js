// TestFlight waitlist form on the home page. Posts straight to Supabase with
// the public anon key: the beta_signups table only lets visitors insert, so
// nothing here can read the list (moodtune-backend db/beta_signups.sql).
(() => {
  const SUPABASE_URL = "https://hbgkjvotluwykxgqgspz.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZ2tqdm90bHV3eWt4Z3Fnc3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMDc4OTMsImV4cCI6MjA5NTU4Mzg5M30.MGLMj2yQCtfaHkgVgcF8LY1YeJLHpv3cs15LNj2KHBE";

  // Mirrors the table's CHECK constraints.
  const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  const SOURCE = /^[a-z0-9_-]{1,40}$/;

  const form = document.getElementById("signup");
  if (!form) return;
  const input = form.querySelector('input[name="email"]');
  const trap = form.querySelector('input[name="company"]');
  const button = form.querySelector("button");
  const status = document.getElementById("signup-status");

  const utm = (new URLSearchParams(location.search).get("utm_source") || "").toLowerCase();
  const source = SOURCE.test(utm) ? utm : "website";

  const say = (text, kind) => {
    status.textContent = text;
    status.dataset.kind = kind || "";
  };

  const done = (email) => {
    form.classList.add("is-done");
    say("You're on the list. We'll email a TestFlight invite to " + email + ".", "ok");
    // The focused button is now hidden; keep keyboard focus on the message.
    status.tabIndex = -1;
    status.focus();
  };

  // The button ships disabled so the form can't submit without this script.
  button.disabled = false;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = input.value.trim().toLowerCase();

    // Bots fill every field; people never see this one.
    if (trap.value) return done(email);

    if (email.length > 254 || !EMAIL.test(email)) {
      say("That doesn't look like an email address.", "error");
      input.focus();
      return;
    }

    button.disabled = true;
    say("Adding you…");
    try {
      const res = await fetch(SUPABASE_URL + "/rest/v1/beta_signups", {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: "Bearer " + SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ email, source }),
        // Don't leave the button stuck if the network stalls.
        signal: AbortSignal.timeout ? AbortSignal.timeout(10000) : undefined,
      });
      // 409: already signed up. Same message, so the form can't be used to
      // check whether an address is on the list.
      if (res.ok || res.status === 409) return done(email);
      throw new Error("HTTP " + res.status);
    } catch (err) {
      console.error("Beta signup failed:", err);
      say("Something went wrong. Try again, or email hello@getmoodtune.com.", "error");
    } finally {
      button.disabled = false;
    }
  });
})();
