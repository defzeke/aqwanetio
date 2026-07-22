import { useSettings } from "./settings-context";

const dict = {
  en: {
    header: {
      brand: "DOST-ASTI",
      subtitle: "Aquaculture Intelligence",
      map: "Map",
      docs: "Documentation",
      signIn: "Sign In",
      register: "Register",
      signOut: "Sign Out",
    },
    footer: {
      brand: "DOST-ASTI Aquaculture",
      copyright: "© {year} DOST-ASTI. All Rights Reserved.",
      contact: "Contact Us",
      privacy: "Privacy Policy",
      dost: "DOST Official",
      tos: "Terms of Service",
    },
    settings: {
      title: "Settings",
      darkMode: "Dark Mode",
      language: "Language",
      notifications: "Notifications",
    },
    mapLegend: {
      title: "Map Legend",
      safe: "Safe (< 1.0 ppm)",
      critical: "Critical (> 1.0 ppm)",
    },
    ctaCard: {
      title: "Detailed Data Locked",
      desc: "Create your free account to access and claim ponds, view detailed time-series predictions, and water quality trends.",
      button: "Create Free Account",
    },
    modal: {
      readings: "Latest Sensor Readings",
      forecast: "Ammonia Forecast",
      close: "Close",
      metricLabel: "Metric:",
      ammonia: "NH₃ (ppm)",
      temperature: "Temp (°C)",
      ph: "pH",
      dissolvedOxygen: "DO (mg/L)",
      current: "Current",
    },
    authHeader: {
      back: "Back",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
    },
    auth: {
      signIn: "Sign In",
      loginDesc: "Access the Intelligence Portal with your authorized credentials.",
      continueAsGuest: "Continue as Guest",
      email: "Email Address",
      emailPlaceholder: "name@agency.gov.ph",
      password: "Password",
      forgotPassword: "Forgot Password?",
      rememberDevice: "Remember this device for 30 days",
      securityNotice: "Authorized use only. All activities are monitored and logged for security purposes in compliance with RA 10173.",
      createAccount: "Create Account",
      registerDesc: "Register your organization to the national aquaculture portal.",
      registerButton: "Register Account",
      completeRegistration: "Complete Registration",
      version: "DOST-ASTI Institutional Portal \u2022 Version 2.4.0",
      fullName: "Full Name",
      fullNamePlaceholder: "Juan Dela Cruz",
      organization: "Organization/Agency",
      orgPlaceholder: "Bureau of Fisheries and Aquatic Resources",
      emailOfficial: "Official Email Address",
      confirmPassword: "Confirm Password",
      reviewInfo: "Review Your Information",
      verificationNotice: "A verification link will be sent to your email. Please check your inbox.",
      fromForm: "(from form)",
    },
    terms: {
      prefix: "I agree to the",
      and: "and",
      suffix: "regarding the collection of environmental and organizational data.",
    },
  },
  fil: {
    header: {
      brand: "DOST-ASTI",
      subtitle: "Intelihensiya sa Akwakultura",
      map: "Mapa",
      docs: "Dokumentasyon",
      signIn: "Mag-sign In",
      register: "Magrehistro",
      signOut: "Mag-sign Out",
    },
    footer: {
      brand: "DOST-ASTI Akwakultura",
      copyright: "© {year} DOST-ASTI. Nakalaan ang Lahat ng Karapatan.",
      contact: "Makipag-ugnayan",
      privacy: "Patakaran sa Pagkapribado",
      dost: "Opisyal ng DOST",
      tos: "Mga Tuntunin ng Serbisyo",
    },
    settings: {
      title: "Mga Setting",
      darkMode: "Madilim na Mode",
      language: "Wika",
      notifications: "Mga Abiso",
    },
    mapLegend: {
      title: "Alamat ng Mapa",
      safe: "Ligtas (< 1.0 ppm)",
      critical: "Mapanganib (> 1.0 ppm)",
    },
    ctaCard: {
      title: "Naka-lock ang Detalyadong Datos",
      desc: "Gumawa ng libreng account para ma-access at ma-claim ang mga pond, tingnan ang detalyadong taya ng panahon, at mga uso sa kalidad ng tubig.",
      button: "Gumawa ng Libreng Account",
    },
    modal: {
      readings: "Pinakabagong Pagbasa ng Sensor",
      forecast: "Taya ng Amonya",
      close: "Isara",
      metricLabel: "Metric:",
      ammonia: "NH₃ (ppm)",
      temperature: "Temp (°C)",
      ph: "pH",
      dissolvedOxygen: "DO (mg/L)",
      current: "Kasalukuyan",
    },
    authHeader: {
      back: "Bumalik",
      noAccount: "Wala pang account?",
      hasAccount: "May account na?",
    },
    auth: {
      signIn: "Mag-sign In",
      loginDesc: "I-access ang Intelligence Portal gamit ang iyong awtorisadong kredensyal.",
      continueAsGuest: "Magpatuloy bilang Panauhin",
      email: "Email Address",
      emailPlaceholder: "pangalan@ahensya.gov.ph",
      password: "Password",
      forgotPassword: "Nakalimutan ang Password?",
      rememberDevice: "Tandaan ang device na ito sa loob ng 30 araw",
      securityNotice: "Awtorisadong paggamit lamang. Lahat ng aktibidad ay binabantayan at nire-record para sa seguridad bilang pagsunod sa RA 10173.",
      createAccount: "Gumawa ng Account",
      registerDesc: "Irehistro ang iyong organisasyon sa pambansang aquaculture portal.",
      registerButton: "Magrehistro ng Account",
      completeRegistration: "Kumpletuhin ang Pagrehistro",
      version: "DOST-ASTI Institutional Portal \u2022 Bersyon 2.4.0",
      fullName: "Buong Pangalan",
      fullNamePlaceholder: "Juan Dela Cruz",
      organization: "Organisasyon/Ahensya",
      orgPlaceholder: "Bureau of Fisheries and Aquatic Resources",
      emailOfficial: "Opisyal na Email Address",
      confirmPassword: "Kumpirmahin ang Password",
      reviewInfo: "Suriin ang Iyong Impormasyon",
      verificationNotice: "Ang verification link ay ipapadala sa iyong email. Pakitingnan ang iyong inbox.",
      fromForm: "(mula sa form)",
    },
    terms: {
      prefix: "Sumasang-ayon ako sa",
      and: "at",
      suffix: "tungkol sa pagkolekta ng environmental at organizational na datos.",
    },
  },
};

type Dict = typeof dict.en;

function resolve(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let cur: unknown = obj;
  for (const key of keys) {
    if (typeof cur !== "object" || cur === null) return path;
    cur = (cur as Record<string, unknown>)[key];
  }
  return typeof cur === "string" ? cur : path;
}

export function useTranslation() {
  const { language } = useSettings();
  const lang = language === "fil" ? dict.fil : dict.en;
  const t = (path: string, vars?: Record<string, string | number>) => {
    let str = resolve(lang as unknown as Record<string, unknown>, path);
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(`{${k}}`, String(v));
      }
    }
    return str;
  };
  return { t, language };
}

export type { Dict };
