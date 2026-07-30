import 'main.dart';

enum Language { en, fil }

String t(String path, [Map<String, String>? vars]) {
  final lang = settingsProvider.language == Language.fil ? _fil : _en;
  final keys = path.split('.');
  dynamic cur = lang;
  for (final k in keys) {
    if (cur is Map && cur.containsKey(k)) {
      cur = cur[k];
    } else {
      return path;
    }
  }
  if (cur is! String) return path;
  if (vars != null) {
    var s = cur;
    vars.forEach((k, v) => s = s.replaceAll('{$k}', v));
    return s;
  }
  return cur;
}

final _en = {
  'header': {'brand': 'DOST-ASTI', 'subtitle': 'Aquaculture Intelligence', 'map': 'Map', 'docs': 'Documentation', 'signIn': 'Sign In', 'register': 'Register', 'signOut': 'Sign Out'},
  'footer': {'brand': 'DOST-ASTI Aquaculture', 'contact': 'Contact Us', 'privacy': 'Privacy Policy', 'dost': 'DOST Official', 'tos': 'Terms of Service'},
  'settings': {'title': 'Settings', 'language': 'Language', 'notifications': 'Notifications'},
  'mapLegend': {'title': 'Threshold Guidelines', 'safeLabel': 'Safe:', 'safeDesc': 'Below 0.4 ppm NH₃', 'warningLabel': 'Warning:', 'warningDesc': '0.4–1.0 ppm NH₃', 'toxicLabel': 'Toxic:', 'toxicDesc': 'Above 1.0 ppm NH₃'},
  'ctaCard': {'title': 'Detailed Data Locked', 'desc': 'Create your free account to access and claim ponds, view detailed time-series predictions, and water quality trends.', 'button': 'Create Free Account'},
  'modal': {'readings': 'Latest Sensor Readings', 'forecast': 'Ammonia Forecast', 'close': 'Close', 'metricLabel': 'Metric:', 'ammonia': 'NH₃ (ppm)', 'temperature': 'Temp (°C)', 'ph': 'pH', 'dissolvedOxygen': 'DO (mg/L)', 'current': 'Current'},
  'authHeader': {'back': 'Back', 'noAccount': "Don't have an account?", 'hasAccount': 'Already have an account?'},
  'auth': {'signIn': 'Sign In', 'loginDesc': 'Access the Intelligence Portal with your authorized credentials.', 'continueAsGuest': 'Continue as Guest', 'email': 'Email Address', 'emailPlaceholder': 'name@agency.gov.ph', 'password': 'Password', 'forgotPassword': 'Forgot Password?', 'rememberDevice': 'Remember this device for 30 days', 'securityNotice': 'Authorized use only. All activities are monitored and logged for security purposes in compliance with RA 10173.', 'createAccount': 'Create Account', 'registerDesc': 'Register your organization to the national aquaculture portal.', 'registerButton': 'Register Account', 'completeRegistration': 'Complete Registration', 'version': 'DOST-ASTI Institutional Portal • Version 2.4.0', 'fullName': 'Full Name', 'fullNamePlaceholder': 'Juan Dela Cruz', 'organization': 'Organization/Agency', 'orgPlaceholder': 'Bureau of Fisheries and Aquatic Resources', 'emailOfficial': 'Official Email Address', 'confirmPassword': 'Confirm Password', 'reviewInfo': 'Review Your Information', 'verificationNotice': 'A verification link will be sent to your email. Please check your inbox.', 'fromForm': '(from form)'},
  'terms': {'prefix': 'I agree to the', 'and': 'and', 'suffix': 'regarding the collection of environmental and organizational data.'},
};

final _fil = {
  'header': {'brand': 'DOST-ASTI', 'subtitle': 'Intelihensiya sa Akwakultura', 'map': 'Mapa', 'docs': 'Dokumentasyon', 'signIn': 'Mag-sign In', 'register': 'Magrehistro', 'signOut': 'Mag-sign Out'},
  'footer': {'brand': 'DOST-ASTI Akwakultura', 'contact': 'Makipag-ugnayan', 'privacy': 'Patakaran sa Pagkapribado', 'dost': 'Opisyal ng DOST', 'tos': 'Mga Tuntunin ng Serbisyo'},
  'settings': {'title': 'Mga Setting', 'language': 'Wika', 'notifications': 'Mga Abiso'},
  'mapLegend': {'title': 'Mga Alituntunin sa Limitasyon', 'safeLabel': 'Ligtas:', 'safeDesc': 'Mas mababa sa 0.4 ppm NH₃', 'warningLabel': 'Babala:', 'warningDesc': '0.4–1.0 ppm NH₃', 'toxicLabel': 'Nakakalason:', 'toxicDesc': 'Higit sa 1.0 ppm NH₃'},
  'ctaCard': {'title': 'Naka-lock ang Detalyadong Datos', 'desc': 'Gumawa ng libreng account para ma-access at ma-claim ang mga pond, tingnan ang detalyadong taya ng panahon, at mga uso sa kalidad ng tubig.', 'button': 'Gumawa ng Libreng Account'},
  'modal': {'readings': 'Pinakabagong Pagbasa ng Sensor', 'forecast': 'Taya ng Amonya', 'close': 'Isara', 'metricLabel': 'Metric:', 'ammonia': 'NH₃ (ppm)', 'temperature': 'Temp (°C)', 'ph': 'pH', 'dissolvedOxygen': 'DO (mg/L)', 'current': 'Kasalukuyan'},
  'authHeader': {'back': 'Bumalik', 'noAccount': 'Wala pang account?', 'hasAccount': 'May account na?'},
  'auth': {'signIn': 'Mag-sign In', 'loginDesc': 'I-access ang Intelligence Portal gamit ang iyong awtorisadong kredensyal.', 'continueAsGuest': 'Magpatuloy bilang Panauhin', 'email': 'Email Address', 'emailPlaceholder': 'pangalan@ahensya.gov.ph', 'password': 'Password', 'forgotPassword': 'Nakalimutan ang Password?', 'rememberDevice': 'Tandaan ang device na ito sa loob ng 30 araw', 'securityNotice': 'Awtorisadong paggamit lamang. Lahat ng aktibidad ay binabantayan at nire-record para sa seguridad bilang pagsunod sa RA 10173.', 'createAccount': 'Gumawa ng Account', 'registerDesc': 'Irehistro ang iyong organisasyon sa pambansang aquaculture portal.', 'registerButton': 'Magrehistro ng Account', 'completeRegistration': 'Kumpletuhin ang Pagrehistro', 'version': 'DOST-ASTI Institutional Portal • Bersyon 2.4.0', 'fullName': 'Buong Pangalan', 'fullNamePlaceholder': 'Juan Dela Cruz', 'organization': 'Organisasyon/Ahensya', 'orgPlaceholder': 'Bureau of Fisheries and Aquatic Resources', 'emailOfficial': 'Opisyal na Email Address', 'confirmPassword': 'Kumpirmahin ang Password', 'reviewInfo': 'Suriin ang Iyong Impormasyon', 'verificationNotice': 'Ang verification link ay ipapadala sa iyong email. Pakitingnan ang iyong inbox.', 'fromForm': '(mula sa form)'},
  'terms': {'prefix': 'Sumasang-ayon ako sa', 'and': 'at', 'suffix': 'tungkol sa pagkolekta ng environmental at organizational na datos.'},
};
