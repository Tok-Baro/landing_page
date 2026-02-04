import { useState, useEffect } from 'react';
import {
  User, Mail, Lock, Bell, BellOff, Smartphone, Monitor, Clock,
  Building2, Upload, Save, Eye, EyeOff
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import settingsService from '../services/settingsService';

const Toggle = ({ checked, onChange: onToggle }) => (
  <button
    onClick={() => onToggle(!checked)}
    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
      checked ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-500'
    }`}
  >
    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
      checked ? 'translate-x-[22px]' : 'translate-x-0.5'
    }`} />
  </button>
);

const SettingsPage = () => {
  const addToast = useToast();

  // --- 관리자 프로필 ---
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', role: '' });
  const [showPwSection, setShowPwSection] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });

  // --- 알림 설정 ---
  const [notifSettings, setNotifSettings] = useState({
    emailEnabled: true, pushEnabled: true, inAppEnabled: true,
    riskAlert: true, policyChange: true, reportReady: true, weeklyDigest: false,
    quietStart: '22:00', quietEnd: '08:00',
  });

  // --- 회사 정보 ---
  const [company, setCompany] = useState({ name: '', industry: '', address: '' });

  useEffect(() => {
    const load = async () => {
      const [prof, notif, comp] = await Promise.all([
        settingsService.getProfile(),
        settingsService.getNotificationSettings(),
        settingsService.getCompanyInfo(),
      ]);
      setProfile(prof);
      setNotifSettings(notif);
      setCompany(comp);
    };
    load();
  }, []);

  const handleSaveProfile = () => {
    addToast('프로필이 저장되었습니다', 'success');
  };

  const handleChangePassword = () => {
    if (!pw.current || !pw.next || !pw.confirm) {
      addToast('모든 비밀번호 필드를 입력해주세요', 'error');
      return;
    }
    if (pw.next !== pw.confirm) {
      addToast('새 비밀번호가 일치하지 않습니다', 'error');
      return;
    }
    if (pw.next.length < 8) {
      addToast('비밀번호는 8자 이상이어야 합니다', 'error');
      return;
    }
    setPw({ current: '', next: '', confirm: '' });
    setShowPwSection(false);
    addToast('비밀번호가 변경되었습니다', 'success');
  };

  const handleSaveNotif = () => {
    addToast('알림 설정이 저장되었습니다', 'success');
  };

  const handleSaveCompany = () => {
    addToast('회사 정보가 저장되었습니다', 'success');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">설정</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">계정, 알림, 회사 정보를 관리합니다</p>
      </div>

      {/* ─── 관리자 프로필 ─── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
              <User size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">관리자 프로필</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">계정 정보 및 비밀번호를 관리합니다</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {/* Avatar + Name */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-2xl font-bold">김</span>
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">역할</p>
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{profile.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">이름</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">이메일</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">연락처</label>
              <div className="relative">
                <Smartphone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="pt-2">
            {!showPwSection ? (
              <button
                onClick={() => setShowPwSection(true)}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Lock size={16} />
                비밀번호 변경
              </button>
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Lock size={16} /> 비밀번호 변경
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'current', label: '현재 비밀번호' },
                    { key: 'next', label: '새 비밀번호' },
                    { key: 'confirm', label: '새 비밀번호 확인' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{field.label}</label>
                      <div className="relative">
                        <input
                          type={showPw ? 'text' : 'password'}
                          value={pw[field.key]}
                          onChange={(e) => setPw((prev) => ({ ...prev, [field.key]: e.target.value }))}
                          className="w-full pr-9 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="••••••••"
                        />
                        {field.key === 'current' && (
                          <button
                            type="button"
                            onClick={() => setShowPw(!showPw)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleChangePassword}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                  >
                    변경하기
                  </button>
                  <button
                    onClick={() => { setShowPwSection(false); setPw({ current: '', next: '', confirm: '' }); }}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={handleSaveProfile} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700">
              <Save size={16} /> 프로필 저장
            </button>
          </div>
        </div>
      </div>

      {/* ─── 알림 설정 ─── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <Bell size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">알림 설정</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">알림 채널 및 수신 항목을 설정합니다</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Channels */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">알림 채널</h4>
            <div className="space-y-3">
              {[
                { key: 'emailEnabled', icon: Mail, label: '이메일 알림', desc: '중요 알림을 이메일로 수신합니다' },
                { key: 'pushEnabled', icon: Smartphone, label: '푸시 알림', desc: '모바일 기기로 실시간 알림을 받습니다' },
                { key: 'inAppEnabled', icon: Monitor, label: '인앱 알림', desc: '대시보드 내 알림 패널에 표시됩니다' },
              ].map((ch) => (
                <div key={ch.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <ch.icon size={18} className="text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{ch.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{ch.desc}</p>
                    </div>
                  </div>
                  <Toggle
                    checked={notifSettings[ch.key]}
                    onChange={(v) => setNotifSettings((s) => ({ ...s, [ch.key]: v }))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Notification Types */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">수신 항목</h4>
            <div className="space-y-3">
              {[
                { key: 'riskAlert', label: '위험군 알림', desc: 'VDT 초과, 휴식 미준수 등 위험 감지 시' },
                { key: 'policyChange', label: '정책 변경 알림', desc: '정책이 생성/수정/삭제될 때' },
                { key: 'reportReady', label: '리포트 완료 알림', desc: '자동/수동 리포트 생성이 완료될 때' },
                { key: 'weeklyDigest', label: '주간 요약 리포트', desc: '매주 월요일 전사 건강 현황 요약' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <Toggle
                    checked={notifSettings[item.key]}
                    onChange={(v) => setNotifSettings((s) => ({ ...s, [item.key]: v }))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Quiet Hours */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <BellOff size={16} /> 방해금지 시간
            </h4>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <Clock size={18} className="text-gray-500 dark:text-gray-400" />
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={notifSettings.quietStart}
                  onChange={(e) => setNotifSettings((s) => ({ ...s, quietStart: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 dark:text-white"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">~</span>
                <input
                  type="time"
                  value={notifSettings.quietEnd}
                  onChange={(e) => setNotifSettings((s) => ({ ...s, quietEnd: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">이 시간 동안 알림을 보내지 않습니다</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSaveNotif} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700">
              <Save size={16} /> 알림 설정 저장
            </button>
          </div>
        </div>
      </div>

      {/* ─── 회사 정보 ─── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <Building2 size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">회사 정보</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">서비스에 표시되는 회사 기본 정보입니다</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">회사 로고</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg font-bold">똑</span>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Upload size={16} /> 로고 변경
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">회사명</label>
              <input
                type="text"
                value={company.name}
                onChange={(e) => setCompany((c) => ({ ...c, name: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">업종</label>
              <input
                type="text"
                value={company.industry}
                onChange={(e) => setCompany((c) => ({ ...c, industry: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">주소</label>
              <input
                type="text"
                value={company.address}
                onChange={(e) => setCompany((c) => ({ ...c, address: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={handleSaveCompany} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700">
              <Save size={16} /> 회사 정보 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
