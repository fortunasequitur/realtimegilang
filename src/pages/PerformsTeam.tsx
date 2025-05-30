import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { mysqlApi } from '@/services/mysqlApi';
import { TeamPerformance, CountryBreakdown } from '@/types';
import { format, startOfWeek, endOfWeek, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { CountryFlag } from '@/components/CountryFlag';

const PerformsTeam = () => {
  const [teamData, setTeamData] = useState<TeamPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [startDate, setStartDate] = useState(format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'));
  const [preset, setPreset] = useState('thisweek');

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    setIsLoading(true);
    try {
      const data = await mysqlApi.getTeamPerformance(startDate, endDate);
      setTeamData(data);
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetChange = (value: string) => {
    setPreset(value);
    const today = new Date();
    
    switch (value) {
      case 'today':
        setStartDate(format(today, 'yyyy-MM-dd'));
        setEndDate(format(today, 'yyyy-MM-dd'));
        break;
      case 'thisweek':
        setStartDate(format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd'));
        setEndDate(format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd'));
        break;
      case 'last7days':
        setStartDate(format(subDays(today, 7), 'yyyy-MM-dd'));
        setEndDate(format(today, 'yyyy-MM-dd'));
        break;
      case 'thismonth':
        setStartDate(format(startOfMonth(today), 'yyyy-MM-dd'));
        setEndDate(format(endOfMonth(today), 'yyyy-MM-dd'));
        break;
      case 'lastmonth':
        const lastMonth = subMonths(today, 1);
        setStartDate(format(startOfMonth(lastMonth), 'yyyy-MM-dd'));
        setEndDate(format(endOfMonth(lastMonth), 'yyyy-MM-dd'));
        break;
    }
  };

  const handleLoad = async () => {
    await fetchTeamData();
  };

  const toggleRow = (subid: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(subid)) {
      newExpanded.delete(subid);
    } else {
      newExpanded.add(subid);
    }
    setExpandedRows(newExpanded);
  };

  const currentWeekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'MMM dd');
  const currentWeekEnd = format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'MMM dd, yyyy');

  // Tambahkan validasi agar tidak error jika teamData bukan array
  const safeTeamData = Array.isArray(teamData) ? teamData : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Performs Team</h1>
        <Badge variant="outline" className="text-sm">
          Week: {currentWeekStart} - {currentWeekEnd}
        </Badge>
      </div>

      {/* Summary Cards - Moved to top */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Team Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${teamData.reduce((sum, team) => sum + team.earnings, 0).toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">This week</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamData.reduce((sum, team) => sum + team.conversions, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">All team members</div>
          </CardContent>
        </Card>
      </div>

      {/* Date Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Date Filter</CardTitle>
          <CardDescription>Select date range to view team performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Preset</label>
              <Select value={preset} onValueChange={handlePresetChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="thisweek">This Week</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="thismonth">This Month</SelectItem>
                  <SelectItem value="lastmonth">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <Button onClick={handleLoad} disabled={isLoading} className="lg:col-span-2">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading...
                </>
              ) : (
                'Load'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Team Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>
            Team performance ranked by conversions (Monday - Sunday UTC+0)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>SUB ID</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Unique</TableHead>
                  <TableHead className="text-right">
                    <span className="md:hidden">Conv</span>
                    <span className="hidden md:inline">Conversions</span>
                  </TableHead>
                  <TableHead className="text-right">Earnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeTeamData.map((team) => (
                  <React.Fragment key={team.subid}>
                    <TableRow className="hover:bg-accent/50">
                      <TableCell className="text-center">
                        <Badge 
                          variant={team.rank <= 3 ? "default" : "secondary"}
                          className={
                            team.rank === 1 ? "bg-yellow-500 text-white" :
                            team.rank === 2 ? "bg-gray-400 text-white" :
                            team.rank === 3 ? "bg-amber-600 text-white" : ""
                          }
                        >
                          #{team.rank}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRow(team.subid)}
                            className="p-1 h-6 w-6 text-xs"
                          >
                            {expandedRows.has(team.subid) ? '−' : '+'}
                          </Button>
                          <Badge variant="outline">{team.subid}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{team.clicks.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{team.unique.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-semibold">{team.conversions.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                        ${team.earnings.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    
                    {expandedRows.has(team.subid) && (
                      team.countries?.map((country) => (
                        <TableRow key={country.country} className="bg-muted/30">
                          <TableCell /> {/* Kosong untuk Rank */}
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <CountryFlag countryCode={country.country} className="w-5 h-4" />
                              <span className="font-medium">{country.country}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-bold text-primary">{country.clicks}</TableCell>
                          <TableCell className="text-right font-bold">{country.unique}</TableCell>
                          <TableCell className="text-right font-bold">{country.conversions}</TableCell>
                          <TableCell className="text-right font-bold text-green-600 dark:text-green-400">
                            ${country.earnings.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformsTeam;
