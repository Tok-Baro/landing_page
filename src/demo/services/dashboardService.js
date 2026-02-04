import { departmentData, weeklyTrendData, orgEmployees } from '../data/sampleData';

// Mock: 향후 api.get('/dashboard/stats') 등으로 교체
export const dashboardService = {
  async getStats() {
    const active = orgEmployees.filter((e) => e.status === 'active' || e.status === 'warning');
    const avgVDT = active.length > 0
      ? (active.reduce((s, e) => s + e.avgVDT, 0) / active.length).toFixed(1)
      : '0';
    const avgCompliance = active.length > 0
      ? Math.round(active.reduce((s, e) => s + e.compliance, 0) / active.length)
      : 0;
    const riskCount = active.filter((e) => e.compliance < 60).length;

    return {
      activeCount: active.length,
      avgVDT,
      avgCompliance,
      riskCount,
    };
  },

  async getDepartmentChart() {
    return departmentData;
  },

  async getWeeklyTrend() {
    return weeklyTrendData;
  },

  async getRiskEmployees() {
    return orgEmployees.filter((e) => e.compliance > 0 && e.compliance < 60);
  },

  async getAllEmployees() {
    return [...orgEmployees];
  },
};

export default dashboardService;
