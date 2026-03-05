import { Download, Eye, FileText, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usersAPI } from "../services/api";

const loadHtml2pdf = () => import("html2pdf.js").then((m) => m.default || m);

const HealthReportModal = ({ profile, patientId, onClose }) => {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    const buildReport = async () => {
      try {
        setLoading(true);

        /* ───────── Fetch Template ───────── */
        const templateRes = await fetch("/patient_medical_report.html");
        let template = await templateRes.text();

        /* ───────── Fetch Data ───────── */
        const targetId = patientId || profile?._id;

        let userData = profile || {};
        let summaryData = {};

        if (targetId) {
          try {
            const res = await usersAPI.getReportData(targetId);

            if (res?.status === "success") {
              userData = { ...profile, ...res.data.user };
              summaryData = res.data.summary || {};
            }
          } catch (err) {
            console.warn("Backend API unavailable, using local data");
          }
        }

        /* ───────── Compute values ───────── */

        const now = new Date();

        const age = userData?.Dob
          ? new Date().getFullYear() - new Date(userData.Dob).getFullYear()
          : userData?.age || "N/A";

        const dateStr = now.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

        /* ───────── Inject Template Values ───────── */

        template = template

          /* patient */
          .replace(/Priya Sharma/g, userData.full_name || "Patient")
          .replace(/14 March 1995/g, userData.Dob ? new Date(userData.Dob).toLocaleDateString() : "N/A")
          .replace(/Age 30/g, `Age ${age}`)
          .replace(/B\+/g, userData.blood_group || "Not Set")

          /* report metadata */
          .replace(
            /#AM-IN-2026-0226/g,
            `#AM-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`
          )
          .replace(/26 February 2026/g, dateStr)
          .replace(/Apollo Hospitals, New Delhi/g, "AfterMa Health Platform")

          /* cycle */
          .replace(/Luteal/g, userData.phase || userData.maternity_stage || "Monitoring")
          .replace(/Day 22/g, `Day ${summaryData?.cycle_day || "N/A"}`)

          /* vitals */
          .replace(
            /5 <span style="font-size:14px; color:var\(--accent\);">\/10<\/span>/g,
            `${summaryData?.mood_score || 5} <span style="font-size:14px; color:#e8325a;">/10</span>`
          )
          .replace(
            /5 <span style="font-size:14px; color:var\(--accent-gold\);">\/10<\/span>/g,
            `${summaryData?.energy_score || 5} <span style="font-size:14px; color:#f0a500;">/10</span>`
          )
          .replace(
            /2 <span style="font-size:14px; color:var\(--accent-teal\);">\/10<\/span>/g,
            `${summaryData?.pain_intensity || 2} <span style="font-size:14px; color:#0d9488;">/10</span>`
          )
          .replace(
            /6 <span style="font-size:13px; color:var\(--ink-muted\);">hrs\/night<\/span>/g,
            `${summaryData?.sleep_hours || 6} <span style="font-size:13px; color:#8a9bb0;">hrs/night</span>`
          )
          .replace(
            /5 <span style="font-size:13px; color:var\(--ink-muted\);">cups\/day<\/span>/g,
            `${summaryData?.water_intake || 5} <span style="font-size:13px; color:#8a9bb0;">cups/day</span>`
          )

          /* labs */
          .replace(/10\.8 g\/dL/g, `${userData.haemoglobin_level || "N/A"} g/dL`)
          .replace(/9 ng\/mL/g, `${userData.ferritin_level || userData.serum_ferritin_level || "N/A"} ng/mL`)
          .replace(/2\.8 µIU\/mL/g, `${userData.thyroid_level || "N/A"} µIU/mL`)
          .replace(/18 ng\/mL/g, `${userData.vitamin_d3_level || "N/A"} ng/mL`)
          .replace(/88 mg\/dL/g, `${userData.glucose_level || "N/A"} mg/dL`);

        /* ───────── Inject Medications Dynamically ───────── */

        if (userData.current_medications?.length) {
          const medsHTML = userData.current_medications
            .slice(0, 3)
            .map(
              (m) => `
          <div class="lab-card">
            <div class="lab-icon" style="background:#fee2e2;">💊</div>
            <div style="flex:1;">
              <div class="lab-label">${m.category}</div>
              <div class="lab-value" style="font-size:13px;">${m.name} ${m.dose}</div>
              <div class="lab-ref">${m.frequency} · ${m.duration}</div>
            </div>
          </div>
        `
            )
            .join("");

          template = template.replace(
            /<!-- MEDICATIONS_DYNAMIC -->/,
            medsHTML
          );
        }

        /* ───────── Fix html2canvas global CSS variables ───────── */
        template = template.replace(/:root {/g, ":root, .page {");

        setHtml(template);
      } catch (err) {
        console.error(err);
        setHtml(
          `<p style="padding:40px;font-family:sans-serif;">Failed to load report: ${err.message}</p>`
        );
      } finally {
        setLoading(false);
      }
    };

    buildReport();
  }, [profile, patientId]);

  /* ───────── PDF Download ───────── */

  const handleDownloadJSON = async () => {
    try {
      const targetId = patientId || profile?._id;
      const res = await fetch(`/api/healthsummary/download/${targetId}`);
      const data = await res.json();
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `afterma-health-summary-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download JSON");
      console.error(err);
    }
  };

  const handleDownloadPDF = async () => {
    if (!iframeRef.current?.contentDocument) return;

    setGenerating(true);

    try {
      const html2pdf = await loadHtml2pdf();

      const doc = iframeRef.current.contentDocument;
      const element = doc.querySelector(".page");

      // IMPORTANT: html2pdf clones the targeted element out of its document context.
      // To prevent all CSS and fonts from breaking during PDF generation from an iframe,
      // we must inject the <style> and <link> tags directly into the .page element.
      const styleWrapper = doc.createElement("div");
      const styles = doc.querySelectorAll("style, link[rel='stylesheet']");
      styles.forEach((s) => styleWrapper.appendChild(s.cloneNode(true)));
      element.prepend(styleWrapper);

      const options = {
        margin: 0,
        filename: `afterma-health-summary-${Date.now()}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 3,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      };

      await html2pdf().set(options).from(element).save();

      // Clean up styles immediately after generation
      element.removeChild(styleWrapper);
    } catch (err) {
      alert("PDF generation failed");
      console.error(err);
    }

    setGenerating(false);
  };

  /* ───────── UI ───────── */

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-black/70 backdrop-blur-sm">

      {/* HEADER */}

      <div className="h-16 bg-white flex items-center justify-between px-6 border-b">

        <div className="flex items-center gap-3">
          <FileText size={18} />
          <div>
            <p className="font-bold text-sm">Health Summary Report</p>
            <p className="text-xs text-gray-400">AfterMa Clinical Portal</p>
          </div>
        </div>

        <div className="flex gap-3">

          {/* View */}

          <button
            onClick={() => iframeRef.current?.contentWindow?.print()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm"
          >
            <Eye size={14} />
            View PDF
          </button>

          {/* Download */}

          <button
            onClick={handleDownloadPDF}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm"
          >
            {generating ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Generating
              </>
            ) : (
              <>
                <Download size={14} />
                Download
              </>
            )}
          </button>

          {/* Download JSON */}

          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm"
          >
            <Download size={14} />
            Download JSON
          </button>

          {/* Close */}

          <button onClick={onClose}>
            <X />
          </button>

        </div>
      </div>

      {/* CONTENT */}

      <div className="flex-1 bg-gray-100">

        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            id="afterma-report-iframe"
            title="AfterMa Report"
            srcDoc={html}
            className="w-full h-full border-none"
          />
        )}

      </div>
    </div>
  );
};

export default HealthReportModal;