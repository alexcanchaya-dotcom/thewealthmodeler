# AdSense prep (draft, no ad code, no publisher ID)

Status: draft for review. Nothing here loads ads, sets cookies or applies for anything.

## 1. Privacy page
A new section "Advertising, cookies and your choices (draft)" is added to `/privacy`, covering:
Google ads, cookies, third-party vendors, EEA consent, and opting out via Google Ads Settings
(adssettings.google.com), aboutads.info and youronlinechoices.eu.

The existing "Cookies and Third-Party Services" and "GDPR Compliance and Cookie Consent" paragraphs
(added 16 Dec 2025, commit 1cf9181) are left untouched. Two points to reconcile before merge:
- They say we "use Google AdSense" today; no ad code is live.
- They say consent is obtained "via a cookie consent banner"; no banner exists yet.

## 2. Cookie consent for EU/EEA visitors

Since Jan 2024 Google requires publishers serving ads to users in the EEA, UK and Switzerland to use a
**Google-certified CMP** integrated with the IAB TCF v2.2. Without one, EEA traffic gets limited ads only.

| | Google Privacy & messaging (Funding Choices) | Light self-built banner |
|---|---|---|
| Google-certified CMP | Yes (Google's own) | No. A homemade banner is not on the certified list, and certification is aimed at CMP vendors (IAB TCF registration, audits). Not realistic for one site. |
| Cost | Free | Free to build, but non-compliant for EEA ads |
| Needs | AdSense account + site approved; publisher ID in script | Nothing |
| TCF string, Consent Mode v2 | Handled | Would need to be built and certified |
| Effort | Configure message in AdSense UI, add Google's tag | Code, legal upkeep, still not accepted |
| Revenue in EEA | Personalised ads possible with consent | Limited/non-personalised ads only |

**Recommendation: Google's certified consent message (Privacy & messaging).**
Reasons: it is free; it is the only option here that satisfies Google's certified-CMP requirement for
EEA/UK ads; it produces the TCF v2.2 string and Consent Mode signals automatically; it shows only to
visitors in regions that need it; and it avoids maintaining legal UI ourselves. A self-built banner
cannot be certified in practice, so it would cap EEA ads at limited ads.
(Third-party certified CMPs such as Cookiebot or Usercentrics also work but usually cost money; ruled out.)

### Order of steps (all need Al, none done here)
1. Al applies for AdSense himself (not done by us).
2. After approval: in AdSense → Privacy & messaging, create a European regulations (GDPR) message for
   thewealthmodeler.com, with "Manage options" and "Do not consent" buttons.
3. Add the AdSense script with the publisher ID in a separate PR (also enables the consent message), plus a
   footer "Privacy and cookie settings" link that reopens the message (`googlefc.callbackQueue` →
   `googlefc.showRevocationMessage()`).
4. Reconcile the privacy page wording, add `ads.txt` with the publisher line.
5. Check Vercel Web Analytics stays cookieless (it is), so it needs no consent.
