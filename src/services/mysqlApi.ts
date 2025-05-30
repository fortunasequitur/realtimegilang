
import { VisitData, ConversionData, StatsSummary, StatsData, TeamPerformance } from '@/types';

// Note: This is a frontend-only implementation that simulates MySQL integration
// In a real application, these would be API calls to your backend server

class MySQLApiService {
  private baseUrl = process.env.VITE_API_URL || 'http://localhost:3001/api';

  // Simulate API calls - replace with actual HTTP requests to your backend
  async getLiveClicks(): Promise<VisitData[]> {
    try {
      // const response = await fetch(`${this.baseUrl}/visits/recent`);
      // return await response.json();
      
      // For now, return mock data (replace with actual API call)
      return this.getMockVisits();
    } catch (error) {
      console.error('Error fetching live clicks:', error);
      return this.getMockVisits();
    }
  }

  async getLiveConversions(): Promise<ConversionData[]> {
    try {
      // const response = await fetch(`${this.baseUrl}/conversions/recent`);
      // return await response.json();
      
      return this.getMockConversions();
    } catch (error) {
      console.error('Error fetching live conversions:', error);
      return this.getMockConversions();
    }
  }

  async getStatsSummary(): Promise<StatsSummary> {
    try {
      // const response = await fetch(`${this.baseUrl}/stats/summary`);
      // return await response.json();
      
      return {
        totalClicks: 45280,
        totalUnique: 32150,
        totalConversions: 1420,
        totalEarning: 8950.50,
      };
    } catch (error) {
      console.error('Error fetching stats summary:', error);
      return {
        totalClicks: 0,
        totalUnique: 0,
        totalConversions: 0,
        totalEarning: 0,
      };
    }
  }

  async getStatsData(startDate: string, endDate: string): Promise<StatsData[]> {
    try {
      // const response = await fetch(`${this.baseUrl}/stats?start=${startDate}&end=${endDate}`);
      // return await response.json();
      
      return this.getMockStatsData();
    } catch (error) {
      console.error('Error fetching stats data:', error);
      return [];
    }
  }

  async getTeamPerformance(): Promise<TeamPerformance[]> {
    try {
      // const response = await fetch(`${this.baseUrl}/team-performance`);
      // return await response.json();
      
      return this.getMockTeamPerformance();
    } catch (error) {
      console.error('Error fetching team performance:', error);
      return [];
    }
  }

  // Mock data methods (replace these with actual database queries in your backend)
  private getMockVisits(): VisitData[] {
    const countries = ['US', 'GB', 'DE', 'FR', 'IT'];
    const osTypes = ['Windows', 'MacOS', 'Android', 'iOS'];
    const referrers = ['Facebook', 'Instagram', 'Threads', 'X', 'Direct'];
    const subIds = ['sub001', 'sub002', 'sub003', 'sub004'];

    return Array.from({ length: 10 }, (_, i) => ({
      id: `visit_${i + 1}`,
      timestamp: new Date(Date.now() - i * 300000).toISOString(),
      subsource: subIds[Math.floor(Math.random() * subIds.length)],
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
      country: countries[Math.floor(Math.random() * countries.length)],
      os: osTypes[Math.floor(Math.random() * osTypes.length)],
      referrer: referrers[Math.floor(Math.random() * referrers.length)],
    }));
  }

  private getMockConversions(): ConversionData[] {
    const countries = ['US', 'GB', 'DE', 'FR'];
    const subIds = ['sub001', 'sub002', 'sub003'];

    return Array.from({ length: 5 }, (_, i) => ({
      id: `conv_${i + 1}`,
      time: new Date(Date.now() - i * 600000).toISOString(),
      subid: subIds[Math.floor(Math.random() * subIds.length)],
      payout: (Math.random() * 10 + 1).toFixed(2),
      country: countries[Math.floor(Math.random() * countries.length)],
    }));
  }

  private getMockStatsData(): StatsData[] {
    const subIds = ['sub001', 'sub002', 'sub003', 'sub004', 'sub005'];
    
    return subIds.map(subid => ({
      subid,
      clicks: Math.floor(Math.random() * 1000) + 100,
      unique: Math.floor(Math.random() * 800) + 80,
      conversions: Math.floor(Math.random() * 50) + 5,
      earnings: parseFloat((Math.random() * 500 + 50).toFixed(2)),
    }));
  }

  private getMockTeamPerformance(): TeamPerformance[] {
    const subIds = ['sub001', 'sub002', 'sub003', 'sub004'];
    
    return subIds.map((subid, index) => ({
      rank: index + 1,
      subid,
      clicks: Math.floor(Math.random() * 2000) + 500,
      unique: Math.floor(Math.random() * 1500) + 400,
      conversions: Math.floor(Math.random() * 100) + 20,
      earnings: parseFloat((Math.random() * 1000 + 200).toFixed(2)),
    }));
  }

  getCountryFlag(countryCode: string): string {
    const flags: { [key: string]: string } = {
      'US': '🇺🇸', 'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷', 'IT': '🇮🇹',
      'ES': '🇪🇸', 'CA': '🇨🇦', 'AU': '🇦🇺', 'JP': '🇯🇵', 'BR': '🇧🇷'
    };
    return flags[countryCode] || '🌍';
  }

  getOSIcon(os: string): string {
    const icons: { [key: string]: string } = {
      'Windows': '🪟', 'MacOS': '🍎', 'Android': '🤖', 'iOS': '📱', 'Linux': '🐧'
    };
    return icons[os] || '💻';
  }

  getReferrerIcon(referrer: string): string {
    const icons: { [key: string]: string } = {
      'Facebook': '📘', 'Instagram': '📷', 'Threads': '🧵', 'X': '❌', 'Direct': '🌐'
    };
    return icons[referrer] || '🌐';
  }
}

export const mysqlApi = new MySQLApiService();
