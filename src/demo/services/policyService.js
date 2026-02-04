import { orgDivisions, orgEmployees } from '../data/sampleData';

const DEFAULT_POLICY = {
  workTime: 50,
  breakTime: 10,
  snoozeLimit: 2,
  alertMode: 'standard',
  workStart: '09:00',
  workEnd: '18:00',
  lunchExclude: true,
  workDays: [true, true, true, true, true, false, false],
  preAlertMin: 5,
  postAlertMin: 5,
};

const getAllNodeIds = (node) => {
  let ids = [node.id];
  if (node.children) {
    for (const child of node.children) {
      ids = ids.concat(getAllNodeIds(child));
    }
  }
  return ids;
};

// Mock: 향후 api.get('/policies') 등으로 교체
export const policyService = {
  async getCompanyPolicy() {
    return { ...DEFAULT_POLICY };
  },

  async updateCompanyPolicy(data) {
    return { ...DEFAULT_POLICY, ...data };
  },

  async getOverrides() {
    return {};
  },

  async updateOverride(deptId, data) {
    return { deptId, ...data };
  },

  async getDivisions() {
    return JSON.parse(JSON.stringify(orgDivisions));
  },

  async getEmployeeCounts() {
    const counts = {};
    for (const div of orgDivisions) {
      const allIds = getAllNodeIds(div);
      counts[div.id] = orgEmployees.filter((e) => allIds.includes(e.departmentId)).length;
      if (div.children) {
        for (const team of div.children) {
          const teamIds = getAllNodeIds(team);
          counts[team.id] = orgEmployees.filter((e) => teamIds.includes(e.departmentId)).length;
        }
      }
    }
    return counts;
  },

  getDefaultPolicy() {
    return { ...DEFAULT_POLICY };
  },
};

export default policyService;
