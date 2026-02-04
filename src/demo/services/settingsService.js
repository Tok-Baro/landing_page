// Mock: 향후 api.get('/settings/profile') 등으로 교체
export const settingsService = {
  async getProfile() {
    return {
      name: '김관리자',
      email: 'admin@company.com',
      phone: '010-1234-5678',
      role: '최고 관리자',
    };
  },

  async updateProfile(data) {
    return { ...data };
  },

  async changePassword(current, next) {
    return { success: true };
  },

  async getNotificationSettings() {
    return {
      emailEnabled: true,
      pushEnabled: true,
      inAppEnabled: true,
      riskAlert: true,
      policyChange: true,
      reportReady: true,
      weeklyDigest: false,
      quietStart: '22:00',
      quietEnd: '08:00',
    };
  },

  async updateNotificationSettings(data) {
    return { ...data };
  },

  async getCompanyInfo() {
    return {
      name: '(주) 똑바로테크',
      industry: 'IT / 소프트웨어',
      address: '서울특별시 강남구 테헤란로 123',
    };
  },

  async updateCompanyInfo(data) {
    return { ...data };
  },
};

export default settingsService;
