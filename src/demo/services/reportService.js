import { orgDivisions, orgEmployees } from '../data/sampleData';

const _generatedReports = [
  { id: 1, name: '월간 건강 현황 리포트', type: 'monthly', period: '2024년 12월', createdAt: '2025-01-15', creator: '자동 생성', format: 'PDF', size: '2.4MB' },
  { id: 2, name: '법적 준수 리포트', type: 'legal', period: '2024년 4분기', createdAt: '2025-01-10', creator: '김관리자', format: 'PDF', size: '5.1MB' },
  { id: 3, name: '월간 건강 현황 리포트', type: 'monthly', period: '2024년 11월', createdAt: '2024-12-15', creator: '자동 생성', format: 'Excel', size: '1.8MB' },
];

const _scheduledReports = [
  { id: 1, name: '월간 건강 현황', colorKey: 'green', schedule: '매월 1일 09:00 자동 발송', recipient: 'admin@company.com' },
  { id: 2, name: '분기 법적 준수', colorKey: 'blue', schedule: '매 분기 1일 자동 생성', recipient: 'legal@company.com' },
];

const getAllNodeIds = (node) => {
  let ids = [node.id];
  if (node.children) {
    for (const child of node.children) {
      ids = ids.concat(getAllNodeIds(child));
    }
  }
  return ids;
};

// Mock: 향후 api.get('/reports') 등으로 교체
export const reportService = {
  async getTemplates() {
    return [
      { id: 'legal', name: '중대재해처벌법 대응 리포트', desc: 'VDT 작업 관리 현황 및 예방 조치 증빙' },
      { id: 'monthly', name: '월간 건강 현황 리포트', desc: '전사 건강 지표 요약 및 개선 권고' },
    ];
  },

  async getDivisions() {
    return JSON.parse(JSON.stringify(orgDivisions));
  },

  async getSchedules() {
    return [..._scheduledReports];
  },

  async getGeneratedReports() {
    return [..._generatedReports];
  },

  async generate(params) {
    const { typeName, periodLabel, format } = params;
    return {
      id: Date.now(),
      name: typeName,
      type: params.selectedType,
      period: periodLabel,
      createdAt: new Date().toISOString().slice(0, 10),
      creator: '김관리자',
      format,
      size: format === 'PDF' ? '3.2MB' : '1.5MB',
    };
  },

  async getDivisionStats() {
    return orgDivisions.map((div) => {
      const allIds = getAllNodeIds(div);
      const emps = orgEmployees.filter((e) => allIds.includes(e.departmentId) && e.status !== 'pending');
      const activeEmps = emps.filter((e) => e.status === 'active' || e.status === 'warning');
      const avgCompliance = emps.length > 0 ? Math.round(emps.reduce((s, e) => s + e.compliance, 0) / emps.length) : 0;
      const avgVDT = emps.length > 0 ? (emps.reduce((s, e) => s + e.avgVDT, 0) / emps.length).toFixed(1) : '0';
      const riskCount = emps.filter((e) => e.compliance < 60).length;
      return { id: div.id, name: div.name, total: emps.length, active: activeEmps.length, avgCompliance, avgVDT, riskCount };
    });
  },
};

export default reportService;
