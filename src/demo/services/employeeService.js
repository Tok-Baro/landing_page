import { orgEmployees } from '../data/sampleData';

let _employees = [...orgEmployees];

// Mock: 향후 api.get('/employees') 등으로 교체
export const employeeService = {
  async getAll() {
    return [..._employees];
  },

  async getById(id) {
    return _employees.find((e) => e.id === id) || null;
  },

  async create(data) {
    const newEmp = {
      id: `emp-${Date.now()}`,
      status: 'pending',
      compliance: 0,
      avgVDT: 0,
      todayVDT: '-',
      lastActive: '-',
      phone: '',
      extension: '',
      memo: '',
      ...data,
    };
    _employees = [..._employees, newEmp];
    return newEmp;
  },

  async update(id, data) {
    _employees = _employees.map((e) => (e.id === id ? { ...e, ...data } : e));
    return _employees.find((e) => e.id === id);
  },

  async remove(id) {
    _employees = _employees.filter((e) => e.id !== id);
    return { success: true };
  },

  async updateMemo(id, memo) {
    _employees = _employees.map((e) => (e.id === id ? { ...e, memo } : e));
    return _employees.find((e) => e.id === id);
  },
};

export default employeeService;
