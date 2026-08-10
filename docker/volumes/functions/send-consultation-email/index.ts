import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const YOUR_EMAIL = Deno.env.get("NOTIFY_EMAIL")!;

// Gensler brand
const GENSLER_RED = "#D0021B";
const LOGO_DATA_URI = "data:image/png;base64,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";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://timberplus.gensler.com",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS });

  try {
    const {
      pdfBase64, fileName,
      submitterName, submitterEmail,
      projectLocation, score,
      company, city, projectType, helpType, message
    } = await req.json();

    // SUPABASE_URL may be an internal Docker host (kong:8000); keep it for API calls
    // but use SUPABASE_PUBLIC_URL for any URLs that leave the server (e.g. email links)
    const internalUrl = Deno.env.get("SUPABASE_URL")!;
    const publicUrl = Deno.env.get("SUPABASE_PUBLIC_URL") || internalUrl;

    const supabase = createClient(internalUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Upload PDF to Storage (if provided)
    let pdfLinkHtml = `<p style="color:#6b7280;font-size:14px;">No PDF attached — form submitted without completing scoring tool.</p>`;

    if (pdfBase64) {
      const pdfBytes = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));
      const { error: uploadError } = await supabase.storage
        .from("consultation-reports")
        .upload(fileName, pdfBytes, { contentType: "application/pdf", upsert: true });

      if (uploadError) throw new Error("Upload failed: " + uploadError.message);

      const { data: signed } = await supabase.storage
        .from("consultation-reports")
        .createSignedUrl(fileName, 60 * 60 * 24 * 7);

      if (signed?.signedUrl) {
        // Replace the internal origin with the publicly reachable one
        const signedUrl = signed.signedUrl.replace(
          new URL(internalUrl).origin,
          new URL(publicUrl).origin
        );
        pdfLinkHtml = `
          <a href="${signedUrl}" style="display:inline-block;background:${GENSLER_RED};color:white;padding:12px 24px;text-decoration:none;border-radius:4px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">
            Download Feasibility Report PDF
          </a>
          <p style="color:#999;font-size:12px;margin-top:8px;font-family:Arial,sans-serif;">Link expires in 7 days.</p>`;
      }
    }

    // Table row helper — skips empty values
    const row = (label: string, value: string) => value ? `
      <tr>
        <td style="padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:bold;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
        <td style="padding:8px 12px;border:1px solid #e5e7eb;font-size:13px;vertical-align:top;">${value}</td>
      </tr>` : '';

    // Shared header block — thin red brand bar + logo, used on both emails
    const emailHeader = (eyebrow: string) => `
      <div style="background:${GENSLER_RED};height:6px;line-height:6px;font-size:0;">&nbsp;</div>
      <div style="padding:22px 28px 16px 28px;background:#ffffff;">
        <img src="${LOGO_DATA_URI}" width="99" height="23" alt="Gensler" style="display:block;border:0;" />
        <p style="color:${GENSLER_RED};margin:12px 0 0 0;font-size:12px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;">${eyebrow}</p>
      </div>`;

    // ── EMAIL 1: Notify YOU with full contact form details + PDF ──────────
    const notifyRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Timber+ <onboarding@resend.dev>",
        to: [YOUR_EMAIL],
        reply_to: submitterEmail,
        subject: `Timber+ Consultation — ${submitterName} · ${projectLocation || city} · ${score}%`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#171717;">
            <div style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
              ${emailHeader('Timber+ &middot; New Consultation Request')}
              <div style="padding:12px 28px 24px 28px;background:#ffffff;">

                <h2 style="font-size:15px;margin:12px 0 12px 0;color:${GENSLER_RED};">Contact Details</h2>
                <table style="border-collapse:collapse;width:100%;">
                  ${row('Name', submitterName)}
                  ${row('Email', submitterEmail)}
                  ${row('Company', company)}
                  ${row('City', city)}
                  ${row('Project Type', projectType)}
                  ${row('How can we help?', helpType)}
                </table>

                ${message ? `
                <h2 style="font-size:15px;margin:24px 0 8px 0;color:${GENSLER_RED};">Their Message</h2>
                <div style="background:#f9fafb;border:1px solid #e5e7eb;border-left:3px solid ${GENSLER_RED};border-radius:4px;padding:14px 16px;font-size:14px;line-height:1.6;white-space:pre-wrap;">${message}</div>
                ` : ''}

                <h2 style="font-size:15px;margin:24px 0 12px 0;color:${GENSLER_RED};">Feasibility Score</h2>
                <table style="border-collapse:collapse;width:100%;">
                  ${row('Score', score + '%')}
                  ${row('Project Location', projectLocation || city)}
                </table>

                <h2 style="font-size:15px;margin:24px 0 8px 0;color:${GENSLER_RED};">Feasibility Report</h2>
                ${pdfLinkHtml}

              </div>
            </div>
            <p style="font-size:11px;color:#9ca3af;text-align:center;margin-top:12px;font-family:Arial,sans-serif;">
              Reply to this email to respond directly to ${submitterName} at ${submitterEmail}.
            </p>
          </div>
        `,
      }),
    });

    if (!notifyRes.ok) {
      const errText = await notifyRes.text();
      throw new Error("Resend error (notify): " + errText);
    }

    // ── EMAIL 2: Thank-you to the submitter ───────────────────────────────
    const thankYouRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Gensler Timber+ <onboarding@resend.dev>",
        to: [submitterEmail],
        reply_to: YOUR_EMAIL,
        subject: "Thank you for contacting Gensler — Timber+ Consultation",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#171717;">
            <div style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
              ${emailHeader('Timber+ Consultation')}
              <div style="padding:14px 32px 32px 32px;background:#f9fafb;">
                <p style="font-size:16px;margin-top:0;">Hi ${submitterName},</p>
                <p style="font-size:15px;line-height:1.6;">Thank you for reaching out to the Gensler mass timber team. We have received your consultation request and will be in touch shortly.</p>
                <p style="font-size:15px;line-height:1.6;">In the meantime, feel free to explore the <strong>Mass Timber Digest</strong> for research, case studies, and design guidance on mass timber construction.</p>
                <div style="background:#ffffff;border:1px solid #e5e7eb;border-left:4px solid ${GENSLER_RED};border-radius:6px;padding:20px;margin:24px 0;">
                  <p style="margin:0 0 4px 0;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Your Feasibility Score</p>
                  <p style="margin:0;font-size:32px;font-weight:300;color:${GENSLER_RED};">${score}%</p>
                  <p style="margin:4px 0 0 0;font-size:13px;color:#6b7280;">${projectLocation || city}</p>
                </div>
                <p style="font-size:15px;line-height:1.6;">A member of our team will review your project details and respond to this email directly.</p>
                <p style="font-size:15px;margin-bottom:0;">Warm regards,<br><strong>Gensler — Mass Timber Practice</strong></p>
              </div>
            </div>
            <p style="font-size:11px;color:#9ca3af;text-align:center;margin-top:16px;font-family:Arial,sans-serif;">
              All feasibility scores are conceptual and based on Mass Timber Digest research.
            </p>
          </div>
        `,
      }),
    });

    if (!thankYouRes.ok) {
      console.warn("Thank-you email failed:", await thankYouRes.text());
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});

