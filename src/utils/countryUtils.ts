/**
 * Convert country code to flag emoji
 * This works because flag emojis are made of two regional indicator symbols
 * Each regional indicator symbol is an alphabet letter offset by 127397
 */
export const getCountryFlag = (countryCode: string): string => {
  // Special case for combined regions and custom flags
  if (countryCode === '1') {
    return '🇺🇸 🇨🇦'; // US and Canada
  }
  if (countryCode === '972') {
    return '🖕'; // Middle finger for Israel
  }

  // Convert 2-letter country code to flag emoji
  const countryToCode: Record<string, string> = {
    '1': 'US',      // United States/Canada
    '44': 'GB',     // United Kingdom
    '49': 'DE',     // Germany
    '33': 'FR',     // France
    '39': 'IT',     // Italy
    '34': 'ES',     // Spain
    '31': 'NL',     // Netherlands
    '46': 'SE',     // Sweden
    '48': 'PL',     // Poland
    '81': 'JP',     // Japan
    '82': 'KR',     // South Korea
    '86': 'CN',     // China
    '91': 'IN',     // India
    '62': 'ID',     // Indonesia
    '60': 'MY',     // Malaysia
    '63': 'PH',     // Philippines
    '84': 'VN',     // Vietnam
    '66': 'TH',     // Thailand
    '65': 'SG',     // Singapore
    '966': 'SA',    // Saudi Arabia
    '971': 'AE',    // UAE
    '970': 'PS',    // Palestine
    '90': 'TR',     // Turkey
    '20': 'EG',     // Egypt
    '27': 'ZA',     // South Africa
    '234': 'NG',    // Nigeria
    '254': 'KE',    // Kenya
    '61': 'AU',     // Australia
    '64': 'NZ',     // New Zealand
    '7': 'RU',      // Russia
    '52': 'MX',     // Mexico
    '55': 'BR',     // Brazil
    '57': 'CO',     // Colombia
    '54': 'AR',     // Argentina
  };

  const code = countryToCode[countryCode];
  if (!code) return '';

  // Convert the country code to regional indicator symbols
  return code
    .toUpperCase()
    .split('')
    .map(char => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('');
}; 