import React, { useState, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { getCountryFlag } from '../utils/countryUtils';

interface CountryCodeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

interface CountryCode {
  code: string;
  name: string;
  continent: string;
}

// Organized country codes by continent
const countryCodes: CountryCode[] = [
  // North America
  { code: '1', name: 'United States / Canada', continent: 'North America' },
  { code: '52', name: 'Mexico', continent: 'North America' },

  // South America
  { code: '55', name: 'Brazil', continent: 'South America' },
  { code: '57', name: 'Colombia', continent: 'South America' },
  { code: '54', name: 'Argentina', continent: 'South America' },

  // Europe
  { code: '44', name: 'United Kingdom', continent: 'Europe' },
  { code: '49', name: 'Germany', continent: 'Europe' },
  { code: '33', name: 'France', continent: 'Europe' },
  { code: '39', name: 'Italy', continent: 'Europe' },
  { code: '34', name: 'Spain', continent: 'Europe' },
  { code: '31', name: 'Netherlands', continent: 'Europe' },
  { code: '46', name: 'Sweden', continent: 'Europe' },
  { code: '48', name: 'Poland', continent: 'Europe' },

  // Asia
  { code: '81', name: 'Japan', continent: 'Asia' },
  { code: '82', name: 'South Korea', continent: 'Asia' },
  { code: '86', name: 'China', continent: 'Asia' },
  { code: '91', name: 'India', continent: 'Asia' },
  { code: '62', name: 'Indonesia', continent: 'Asia' },
  { code: '60', name: 'Malaysia', continent: 'Asia' },
  { code: '63', name: 'Philippines', continent: 'Asia' },
  { code: '84', name: 'Vietnam', continent: 'Asia' },
  { code: '66', name: 'Thailand', continent: 'Asia' },
  { code: '65', name: 'Singapore', continent: 'Asia' },

  // Middle East
  { code: '970', name: 'Palestine', continent: 'Middle East' },
  { code: '966', name: 'Saudi Arabia', continent: 'Middle East' },
  { code: '971', name: 'United Arab Emirates', continent: 'Middle East' },
  { code: '972', name: 'Occupied Palestine', continent: 'Middle East' },
  { code: '90', name: 'Turkey', continent: 'Middle East' },

  // Africa
  { code: '20', name: 'Egypt', continent: 'Africa' },
  { code: '27', name: 'South Africa', continent: 'Africa' },
  { code: '234', name: 'Nigeria', continent: 'Africa' },
  { code: '254', name: 'Kenya', continent: 'Africa' },

  // Oceania
  { code: '61', name: 'Australia', continent: 'Oceania' },
  { code: '64', name: 'New Zealand', continent: 'Oceania' },

  // Other
  { code: '7', name: 'Russia', continent: 'Other' },
].sort((a, b) => {
  // First sort by continent
  if (a.continent !== b.continent) {
    return a.continent.localeCompare(b.continent);
  }
  // Then sort by country name within the same continent
  return a.name.localeCompare(b.name);
});

export const CountryCodeSelector: React.FC<CountryCodeSelectorProps> = ({ value, onChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filter countries based on search query
  const filteredCountries = useMemo(() => {
    if (!searchQuery) return countryCodes;
    
    const query = searchQuery.toLowerCase();
    return countryCodes.filter(country => 
      country.name.toLowerCase().includes(query) || 
      country.code.includes(query) ||
      getCountryFlag(country.code).includes(query)
    );
  }, [searchQuery]);

  // Group filtered countries by continent
  const groupedFilteredCountries = useMemo(() => {
    return filteredCountries.reduce((acc, country) => {
      if (!acc[country.continent]) {
        acc[country.continent] = [];
      }
      acc[country.continent].push(country);
      return acc;
    }, {} as Record<string, CountryCode[]>);
  }, [filteredCountries]);

  // Find current country name
  const currentCountry = countryCodes.find(c => c.code === value);
  const displayValue = currentCountry 
    ? `${getCountryFlag(currentCountry.code)} +${currentCountry.code} ${currentCountry.name}`
    : '';

  return (
    <div className="relative">
      <div className="flex flex-col">
        <div className="relative">
          <div 
            className="select-input flex items-center cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="flex-grow truncate">{displayValue}</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[300px] overflow-hidden">
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search country..."
                    className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    autoFocus
                  />
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="overflow-y-auto max-h-[250px]">
                {Object.entries(groupedFilteredCountries).map(([continent, countries]) => (
                  countries.length > 0 && (
                    <div key={continent}>
                      <div className="px-3 py-1.5 bg-gray-50 text-xs font-medium text-gray-500">
                        {continent}
                      </div>
                      {countries.map((country) => (
                        <div
                          key={`${country.code}-${country.name}`}
                          className={`px-3 py-2 cursor-pointer hover:bg-orange-50 flex items-center ${
                            value === country.code ? 'bg-orange-50' : ''
                          }`}
                          onClick={() => {
                            onChange(country.code);
                            setIsOpen(false);
                            setSearchQuery('');
                          }}
                        >
                          <span className="mr-2">{getCountryFlag(country.code)}</span>
                          <span className="flex-grow">
                            {country.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            +{country.code}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                ))}
                {Object.values(groupedFilteredCountries).flat().length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500 text-center">
                    No countries found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};