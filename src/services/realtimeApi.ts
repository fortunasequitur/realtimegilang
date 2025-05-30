import React from 'react';
import { VisitData, ConversionData, StatsSummary, StatsData, TeamPerformance } from '@/types';

// Mock data generators
const countries = [
  { code: 'US', flag: '🇺🇸', name: 'United States' },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'DE', flag: '🇩🇪', name: 'Germany' },
  { code: 'FR', flag: '🇫🇷', name: 'France' },
  { code: 'IT', flag: '🇮🇹', name: 'Italy' },
  { code: 'ES', flag: '🇪🇸', name: 'Spain' },
  { code: 'CA', flag: '🇨🇦', name: 'Canada' },
  { code: 'AU', flag: '🇦🇺', name: 'Australia' },
  { code: 'JP', flag: '🇯🇵', name: 'Japan' },
  { code: 'BR', flag: '🇧🇷', name: 'Brazil' },
];

const osTypes = ['Windows', 'MacOS', 'Android', 'iOS', 'Linux'];
const referrerTypes = ['Facebook', 'Instagram', 'Threads', 'X', 'Direct'];
const subIds = ['sub001', 'sub002', 'sub003', 'sub004', 'sub005', 'sub006', 'sub007', 'sub008'];

// Storage for live data (max 10 items each)
let liveClicks: VisitData[] = [];
let liveConversions: ConversionData[] = [];

const generateRandomIP = () => {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

const generateRandomVisit = (): VisitData => {
  const country = countries[Math.floor(Math.random() * countries.length)];
  const os = osTypes[Math.floor(Math.random() * osTypes.length)];
  const referrer = referrerTypes[Math.floor(Math.random() * referrerTypes.length)];
  const subId = subIds[Math.floor(Math.random() * subIds.length)];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    subsource: subId,
    ip: generateRandomIP(),
    country: country.code,
    os: os,
    referrer: referrer,
  };
};

const generateRandomConversion = (): ConversionData => {
  const country = countries[Math.floor(Math.random() * countries.length)];
  const subId = subIds[Math.floor(Math.random() * subIds.length)];
  const payout = (Math.random() * 10 + 0.5).toFixed(2);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    time: new Date().toISOString(),
    subid: subId,
    payout: payout,
    country: country.code,
  };
};

// Simulate real-time data generation
setInterval(() => {
  // Add new click (30% chance every 2 seconds)
  if (Math.random() < 0.3) {
    const newVisit = generateRandomVisit();
    liveClicks.unshift(newVisit);
    if (liveClicks.length > 10) {
      liveClicks = liveClicks.slice(0, 10);
    }
  }
  
  // Add new conversion (10% chance every 2 seconds)
  if (Math.random() < 0.1) {
    const newConversion = generateRandomConversion();
    liveConversions.unshift(newConversion);
    if (liveConversions.length > 10) {
      liveConversions = liveConversions.slice(0, 10);
    }
  }
}, 2000);

// Initialize with some sample data
for (let i = 0; i < 5; i++) {
  liveClicks.push(generateRandomVisit());
  if (i < 3) {
    liveConversions.push(generateRandomConversion());
  }
}

export const realtimeApi = {
  getLiveClicks: async (): Promise<VisitData[]> => {
    try {
      const response = await fetch('https://sobatdigital.online/api/visits_json.php');
      if (!response.ok) {
        throw new Error('Failed to fetch live clicks');
      }
      const data = await response.json();
      
      // Transform the API response to match our VisitData type and limit to 10 rows
      return data
        .slice(0, 10) // Only take the first 10 items
        .map((item: any) => {
          // Normalize country code to uppercase and ensure it's a valid code
          let countryCode = (item.country || 'US').toUpperCase();
          // If the country code is not in our list, default to 'US'
          if (!countries.some(c => c.code === countryCode)) {
            countryCode = 'US';
          }
          
          return {
            id: item.id || Math.random().toString(36).substr(2, 9),
            timestamp: item.timestamp || new Date().toISOString(),
            subsource: item.subsource || 'unknown',
            ip: item.ip || generateRandomIP(),
            country: countryCode,
            os: item.os || 'Unknown',
            referrer: item.referrer || 'Direct'
          };
        });
    } catch (error) {
      console.error('Error fetching live clicks from external API:', error);
      // Fallback to mock data if API fails (already limited to 10 in the mock data)
      return [...liveClicks];
    }
  },

  getLiveConversions: async (): Promise<ConversionData[]> => {
    try {
      const response = await fetch('https://sobatdigital.online/api/get_conversions.php');
      if (!response.ok) {
        throw new Error('Failed to fetch live conversions');
      }
      const data = await response.json();
      // Ambil tanggal hari ini UTC (YYYY-MM-DD)
      const todayUTC = new Date().toISOString().slice(0, 10);
      // Filter dan transformasi data
      return data
        .filter((item: any) => {
          const t = item.time || item.timestamp;
          if (!t) return false;
          // Ambil tanggal dari string waktu (YYYY-MM-DD)
          const dateStr = t.slice(0, 10);
          return dateStr === todayUTC;
        })
        .slice(0, 10)
        .map((item: any) => {
          let countryCode = (item.country || '').toUpperCase().trim();
          // Hanya izinkan kode negara 2 huruf A-Z
          if (!/^[A-Z]{2}$/.test(countryCode)) {
            countryCode = '';
          }
          return {
            id: item.id || Math.random().toString(36).substr(2, 9),
            time: item.time || item.timestamp || new Date().toISOString(),
            subid: item.subid || item.subsource || 'unknown',
            payout: item.payout ? String(item.payout) : '0.00',
            country: countryCode,
          };
        });
    } catch (error) {
      console.error('Error fetching live conversions from external API:', error);
      // Fallback ke mock jika gagal
      return [...liveConversions];
    }
  },

  getStatsSummary: (): Promise<StatsSummary> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          totalClicks: 45280,
          totalUnique: 32150,
          totalConversions: 1420,
          totalEarning: 8950.50,
        });
      }, 500);
    });
  },

  getStatsData: (startDate: string, endDate: string): Promise<StatsData[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const mockData: StatsData[] = subIds.map(subid => ({
          subid,
          clicks: Math.floor(Math.random() * 1000) + 100,
          unique: Math.floor(Math.random() * 800) + 80,
          conversions: Math.floor(Math.random() * 50) + 5,
          earnings: parseFloat((Math.random() * 500 + 50).toFixed(2)),
        }));
        resolve(mockData);
      }, 800);
    });
  },

  getTeamPerformance: (): Promise<TeamPerformance[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const mockData: TeamPerformance[] = subIds.map((subid, index) => ({
          rank: index + 1,
          subid,
          clicks: Math.floor(Math.random() * 2000) + 500,
          unique: Math.floor(Math.random() * 1500) + 400,
          conversions: Math.floor(Math.random() * 100) + 20,
          earnings: parseFloat((Math.random() * 1000 + 200).toFixed(2)),
          countries: [
            {
              country: 'GB',
              clicks: Math.floor(Math.random() * 800) + 200,
              unique: Math.floor(Math.random() * 800) + 200,
              conversions: Math.floor(Math.random() * 40) + 8,
              earnings: parseFloat((Math.random() * 400 + 80).toFixed(2)),
            },
            {
              country: 'AU',
              clicks: Math.floor(Math.random() * 600) + 150,
              unique: Math.floor(Math.random() * 600) + 150,
              conversions: Math.floor(Math.random() * 30) + 6,
              earnings: parseFloat((Math.random() * 300 + 60).toFixed(2)),
            },
            {
              country: 'US',
              clicks: Math.floor(Math.random() * 400) + 100,
              unique: Math.floor(Math.random() * 400) + 100,
              conversions: Math.floor(Math.random() * 20) + 4,
              earnings: parseFloat((Math.random() * 200 + 40).toFixed(2)),
            },
            {
              country: 'DE',
              clicks: Math.floor(Math.random() * 200) + 50,
              unique: Math.floor(Math.random() * 200) + 50,
              conversions: Math.floor(Math.random() * 10) + 2,
              earnings: parseFloat((Math.random() * 100 + 20).toFixed(2)),
            },
          ],
        })).sort((a, b) => b.conversions - a.conversions);
        
        // Add rank based on sorted data
        mockData.forEach((item, index) => {
          item.rank = index + 1;
        });
        
        resolve(mockData);
      }, 600);
    });
  },

  getCountryFlag: (countryCode: string): string => {
    const country = countries.find(c => c.code === countryCode);
    return country ? country.flag : '🌍';
  },

  getOSIcon: (os: string): string => {
    const icons: { [key: string]: string } = {
      'Windows': '/images/window.svg',
      'MacOS': '/images/mac.svg',
      'Android': '/images/android.svg',
      'iOS': '/images/apple.svg',
      'Linux': '🐧', // Tetap menggunakan emoji untuk Linux karena belum ada SVG-nya
    };
    return icons[os] || '💻';
  },

  getReferrerIcon: (referrer: string): string => {
    const icons: { [key: string]: string } = {
      'Facebook': '/images/socials/facebook.svg',
      'Instagram': '/images/socials/instagram.svg',
      'Threads': '/images/socials/threads.svg',
      'X': '❌', // Tetap menggunakan emoji untuk X karena belum ada SVG-nya
      'Direct': '/images/socials/browser.svg',
    };
    return icons[referrer] || '/images/socials/browser.svg';
  },
};
