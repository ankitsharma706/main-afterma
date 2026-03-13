import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { label: "Dashboard",       path: "/dashboard" },
    { label: "Care Journey",    path: "/carejourney" },
    { label: "Mental Wellness", path: "/mentalwellness" },
    { label: "Care Connect",    path: "/careconnect" },
    { label: "MomKart",         path: "/momkart" },
    { label: "Safe Recipes",    path: "/recipes" },
    { label: "Learning Centre", path: "/learning" },
  ];

  const supportLinks = [
    { label: "Help Center",            path: "/help" },
    { label: "Safety & Privacy",       path: "/privacy" },
    { label: "Community Guidelines",   path: "/community-guidelines" },
    { label: "Clinical Compliance",    path: "/compliance" },
    { label: "Data Protection Policy", path: "/data-policy" },
    { label: "Contact Support",        path: "/support" },
    { label: "Nearby Care",            path: "/nearby-care" },
  ];

  const socials = [
    {
      href: "https://instagram.com",
      icon: "📸",
      iconBg: "from-[#E8438C] to-[#D63E82]",
      name: "Instagram",
      handle: "@afterma.care",
      hoverBorder: "hover:border-pink-300",
      hoverBg: "hover:bg-[#FCE8F3]",
    },
    {
      href: "https://youtube.com",
      icon: "▶",
      iconBg: "from-[#FF7070] to-[#E03030]",
      name: "YouTube",
      handle: "AfterMa Channel",
      hoverBorder: "hover:border-red-300",
      hoverBg: "hover:bg-red-50",
    },
    {
      href: "https://linkedin.com",
      icon: "in",
      iconBg: "from-[#4E8FD4] to-[#2E6CB0]",
      name: "LinkedIn",
      handle: "AfterMa Official",
      hoverBorder: "hover:border-blue-300",
      hoverBg: "hover:bg-blue-50",
    },
    {
      href: "mailto:hello@afterma.care",
      icon: "✉",
      iconBg: "from-[#3DB87A] to-[#2A9E64]",
      name: "Email Support",
      handle: "hello@afterma.care",
      hoverBorder: "hover:border-green-300",
      hoverBg: "hover:bg-green-50",
    },
  ];

  return (
    /* Outer wrapper — same page-pink as HTML's --bg-page */
    <div className="w-full bg-transparent pt-2 mt-16 lg:mt-24 px-4 lg:px-6 pb-6">
      {/* White rounded card — same as .footer-card */}
      <div className="relative bg-white rounded-3xl px-8 md:px-14 pt-12 pb-8 shadow-[0_8px_48px_rgba(180,80,130,0.13)] overflow-hidden border border-pink-100">

        {/* Decorative blobs matching ::before / ::after */}
        <div className="absolute -top-20 -right-12 w-[340px] h-[260px] rounded-full bg-[radial-gradient(circle,rgba(232,67,140,0.07)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-20 -left-10 w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(78,143,212,0.06)_0%,transparent_70%)] pointer-events-none" />

        {/* GRID */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1.1fr] gap-12 lg:gap-14 mb-0">

          {/* ── COL 1 · BRAND ── */}
          <div>
            {/* Wordmark */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-[38px] h-[38px] rounded-[10px] bg-gradient-to-br from-[#E8438C] to-[#D63E82] flex items-center justify-center text-[18px] shadow-[0_4px_14px_rgba(214,62,130,0.3)] shrink-0">
                🌸
              </div>
              <div>
                <div className="text-[20px] font-extrabold text-[#1A1A2E] tracking-tight leading-none">AfterMa</div>
                <div className="text-[9.5px] font-semibold tracking-[1.4px] uppercase text-[#9490A8] mt-0.5">Safe Healing Journey</div>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-[13.5px] font-normal text-[#4A4560] leading-[1.8] max-w-[270px] mb-6">
              Supporting women through every stage of motherhood with care, trust, and community. You are never alone on this journey.
            </p>

            {/* Trust pills */}
            <div className="flex flex-wrap gap-[7px] mb-6">
              <span className="inline-flex items-center gap-1 px-3 py-[5px] rounded-full text-[11px] font-semibold bg-[#FCE8F3] text-[#D63E82]">🛡️ Clinically Guided</span>
              <span className="inline-flex items-center gap-1 px-3 py-[5px] rounded-full text-[11px] font-semibold bg-[#E8F5EE] text-[#2A8A58]">🌿 Community Driven</span>
              <span className="inline-flex items-center gap-1 px-3 py-[5px] rounded-full text-[11px] font-semibold bg-[#E8F1FC] text-[#2E6CB0]">🔒 Data Safe</span>
              <span className="inline-flex items-center gap-1 px-3 py-[5px] rounded-full text-[11px] font-semibold bg-[#FEF8DC] text-[#9A7810]">⚡ Always With You</span>
            </div>

            {/* About / devs card */}
            <div className="bg-gradient-to-br from-[#FCE8F3] to-[#FDF0F8] border border-[rgba(232,67,140,0.15)] rounded-2xl p-4">
              <div className="text-[10.5px] font-bold uppercase tracking-[1px] text-[#D63E82] mb-3">💙 Built with love by</div>
              <div className="flex flex-col gap-[11px]">
                {[
                  { name: "Akash", role: "Lead Developer · Platform Architect",    bg: "from-[#E8438C] to-[#D63E82]" },
                  { name: "Ankit", role: "Full Stack Developer · Care Systems",    bg: "from-[#4E8FD4] to-[#3A74C0]" },
                  { name: "Ayush", role: "UI/UX Engineer · Design Systems",        bg: "from-[#3DB87A] to-[#2A9E64]" },
                ].map((dev, i) => (
                  <div key={i} className="flex items-center gap-[10px]">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${dev.bg} flex items-center justify-center text-[13px] font-extrabold text-white shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.12)]`}>
                      {dev.name[0]}
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[#1A1A2E] leading-none">{dev.name}</div>
                      <div className="text-[11px] text-[#9490A8] font-normal mt-[1px]">{dev.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── COL 2 · QUICK LINKS ── */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-4 h-[2.5px] rounded bg-[#E8438C]" />
              <span className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#9490A8]">Navigate</span>
            </div>
            <div className="text-[15px] font-extrabold text-[#1A1A2E] mb-[18px]">Quick Links</div>
            <ul className="flex flex-col gap-[10px]">
              {quickLinks.map(({ label, path }) => (
                <li key={label}>
                  <button
                    onClick={() => navigate(path)}
                    className="flex items-center gap-[7px] text-[13.5px] font-medium text-[#4A4560] hover:text-[#E8438C] transition-colors group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[rgba(220,200,215,0.7)] group-hover:bg-[#F472B0] transition-colors shrink-0" />
                    {label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate("/plus")}
                  className="flex items-center gap-[7px] text-[13.5px] font-medium text-[#4A4560] hover:text-[#E8438C] transition-colors group"
                >
                  <span className="w-1 h-1 rounded-full bg-[rgba(220,200,215,0.7)] group-hover:bg-[#F472B0] transition-colors shrink-0" />
                  AfterMa Plus
                  <span className="inline-flex items-center bg-[#F5C842] text-[#7A5800] text-[9.5px] font-extrabold px-[7px] py-[2px] rounded-full tracking-[0.3px] ml-0.5">✦ PLUS</span>
                </button>
              </li>
            </ul>
          </div>

          {/* ── COL 3 · SUPPORT ── */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-4 h-[2.5px] rounded bg-[#3DB87A]" />
              <span className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#9490A8]">Resources</span>
            </div>
            <div className="text-[15px] font-extrabold text-[#1A1A2E] mb-[18px]">Support & Resources</div>
            <ul className="flex flex-col gap-[10px]">
              {supportLinks.map(({ label, path }) => (
                <li key={label}>
                  <button
                    onClick={() => navigate(path)}
                    className="flex items-center gap-[7px] text-[13.5px] font-medium text-[#4A4560] hover:text-[#E8438C] transition-colors group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[rgba(220,200,215,0.7)] group-hover:bg-[#F472B0] transition-colors shrink-0" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COL 4 · SOCIAL ── */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-4 h-[2.5px] rounded bg-[#4E8FD4]" />
              <span className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#9490A8]">Community</span>
            </div>
            <div className="text-[15px] font-extrabold text-[#1A1A2E] mb-[18px]">Stay Connected</div>
            <div className="flex flex-col gap-2">
              {socials.map(({ href, icon, iconBg, name, handle, hoverBorder, hoverBg }) => (
                <a
                  key={name}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noreferrer"
                  className={`flex items-center gap-[11px] px-[14px] py-[10px] bg-[#FAFAFA] border border-[rgba(220,200,215,0.45)] rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_16px_rgba(180,80,130,0.07)] ${hoverBorder} ${hoverBg}`}
                >
                  <div className={`w-[30px] h-[30px] rounded-lg bg-gradient-to-br ${iconBg} flex items-center justify-center text-white text-[14px] font-black shrink-0`}>
                    {icon}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[#1A1A2E] leading-none">{name}</div>
                    <div className="text-[11px] text-[#9490A8] font-normal mt-[1px]">{handle}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>{/* /grid */}

        {/* DIVIDER */}
        <div className="mt-10 h-px bg-gradient-to-r from-transparent via-[rgba(220,200,215,0.45)] via-50% to-transparent" />

        {/* BOTTOM ROW */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-[9px]">
            <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#E8438C] to-[#D63E82] flex items-center justify-center text-[12px] shadow-[0_2px_8px_rgba(214,62,130,0.25)]">
              💗
            </div>
            <span className="text-[12.5px] text-[#9490A8] font-medium">
              <strong className="text-[#4A4560] font-bold">© {new Date().getFullYear()} AfterMa.</strong> Built with care for mothers and sisters everywhere.
            </span>
          </div>

          <nav className="flex items-center gap-1 flex-wrap">
            {[
              { label: "Terms of Service",   path: "/terms" },
              { label: "Privacy Policy",     path: "/privacy" },
              { label: "Medical Disclaimer", path: "/disclaimer" },
            ].map(({ label, path }, i, arr) => (
              <span key={label} className="flex items-center gap-1">
                <button
                  onClick={() => navigate(path)}
                  className="text-[12px] font-semibold text-[#9490A8] px-[10px] py-1 rounded-full hover:bg-[#FCE8F3] hover:text-[#D63E82] transition-all"
                >
                  {label}
                </button>
                {i < arr.length - 1 && <span className="w-[3px] h-[3px] rounded-full bg-[rgba(220,200,215,0.7)]" />}
              </span>
            ))}
          </nav>
        </div>

      </div>{/* /footer-card */}
    </div>
  );
};

export default Footer;
