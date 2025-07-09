import { VisitData, ConversionData, StatsSummary, StatsData, TeamPerformance } from '@/types';

// Note: This is a frontend-only implementation that simulates MySQL integration
// In a real application, these would be API calls to your backend server

class MySQLApiService {
  // Tidak perlu baseUrl lagi, langsung hardcode endpoint PHP

  async getLiveClicks(): Promise<VisitData[]> {
    try {
      const response = await fetch('https://shortlink.hirely.biz.id/api/visits.php');
      return await response.json();
    } catch (error) {
      console.error('Error fetching live clicks:', error);
      return [];
    }
  }

  async getLiveConversions(): Promise<ConversionData[]> {
    try {
      const response = await fetch('https://shortlink.hirely.biz.id/api/get_conversions.php');
      return await response.json();
    } catch (error) {
      console.error('Error fetching live conversions:', error);
      return [];
    }
  }

  async getStatsSummary(): Promise<StatsSummary> {
    try {
      const response = await fetch('https://shortlink.hirely.biz.id/api/stats_summary.php');
      return await response.json();
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
      const response = await fetch(`https://shortlink.hirely.biz.id/api/stats_json.php?start=${startDate}&end=${endDate}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats data:', error);
      return [];
    }
  }

  async getTeamPerformance(startDate: string, endDate: string): Promise<TeamPerformance[]> {
    try {
      const response = await fetch(`https://shortlink.hirely.biz.id/api/team_performance.php?start=${startDate}&end=${endDate}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching team performance:', error);
      return [];
    }
  }

  async getConversionsByDate(startDate: string, endDate: string): Promise<ConversionData[]> {
    try {
      const response = await fetch(`https://shortlink.hirely.biz.id/api/conversions_json.php?start=${startDate}&end=${endDate}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching conversions by date:', error);
      return [];
    }
  }

  getCountryFlag(countryCode: string): string {
    if (!countryCode) return '🌍';
    const code = countryCode.toUpperCase();
    if (code.length !== 2) return '🌍';
    return String.fromCodePoint(
      127397 + code.charCodeAt(0),
      127397 + code.charCodeAt(1)
    );
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
