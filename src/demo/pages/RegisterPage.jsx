import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Monitor, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import authService from '../services/authService';

const STEPS = ['계정 정보', '회사 정보', '완료'];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    companyName: '',
    industry: '',
    employeeCount: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const validateStep0 = () => {
    if (!form.name.trim()) return '이름을 입력해주세요.';
    if (!form.email.trim()) return '이메일을 입력해주세요.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return '올바른 이메일 형식이 아닙니다.';
    if (form.password.length < 8) return '비밀번호는 8자 이상이어야 합니다.';
    if (form.password !== form.passwordConfirm) return '비밀번호가 일치하지 않습니다.';
    return '';
  };

  const validateStep1 = () => {
    if (!form.companyName.trim()) return '회사명을 입력해주세요.';
    return '';
  };

  const handleNext = () => {
    if (step === 0) {
      const err = validateStep0();
      if (err) { setError(err); return; }
    }
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
    }
    setError('');
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await authService.register({
        name: form.name,
        email: form.email,
        password: form.password,
        companyName: form.companyName,
      });
      setStep(2);
    } catch (err) {
      setError(err.message);
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const pwStrength = (() => {
    const p = form.password;
    if (p.length === 0) return { level: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { level: 1, label: '약함', color: 'bg-red-500' };
    if (score === 2) return { level: 2, label: '보통', color: 'bg-yellow-500' };
    if (score === 3) return { level: 3, label: '강함', color: 'bg-green-500' };
    return { level: 4, label: '매우 강함', color: 'bg-emerald-400' };
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-6">
      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center">
            <Monitor size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">똑바로</h1>
            <p className="text-indigo-300 text-xs font-medium">for Business</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  i < step ? 'bg-indigo-500 text-white' :
                  i === step ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30' :
                  'bg-white/10 text-slate-500'
                }`}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${
                  i <= step ? 'text-slate-300' : 'text-slate-600'
                }`}>{s}</span>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px ${i < step ? 'bg-indigo-500' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 0: Account info */}
          {step === 0 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">계정 정보</h3>
                <p className="text-slate-400 text-sm">관리자 계정을 생성합니다</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">이름</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">이메일</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@company.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">비밀번호</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="8자 이상"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors pr-12"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* Password strength */}
                {form.password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((l) => (
                        <div key={l} className={`h-1 flex-1 rounded-full transition-colors ${l <= pwStrength.level ? pwStrength.color : 'bg-white/10'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">비밀번호 강도: <span className="text-slate-400">{pwStrength.label}</span></p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">비밀번호 확인</label>
                <div className="relative">
                  <input
                    type={showPwConfirm ? 'text' : 'password'}
                    name="passwordConfirm"
                    value={form.passwordConfirm}
                    onChange={handleChange}
                    placeholder="비밀번호 재입력"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors pr-12"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwConfirm(!showPwConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPwConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.passwordConfirm && form.password !== form.passwordConfirm && (
                  <p className="text-xs text-red-400 mt-1">비밀번호가 일치하지 않습니다</p>
                )}
              </div>
            </div>
          )}

          {/* Step 1: Company info */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">회사 정보</h3>
                <p className="text-slate-400 text-sm">서비스에 등록할 회사 정보를 입력하세요</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">회사명 <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="(주)테크스타트"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">업종</label>
                <select
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
                >
                  <option value="" className="bg-slate-800">선택해주세요</option>
                  <option value="IT/소프트웨어" className="bg-slate-800">IT/소프트웨어</option>
                  <option value="금융" className="bg-slate-800">금융</option>
                  <option value="제조" className="bg-slate-800">제조</option>
                  <option value="유통/물류" className="bg-slate-800">유통/물류</option>
                  <option value="교육" className="bg-slate-800">교육</option>
                  <option value="의료/바이오" className="bg-slate-800">의료/바이오</option>
                  <option value="공공/정부" className="bg-slate-800">공공/정부</option>
                  <option value="기타" className="bg-slate-800">기타</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">직원 수</label>
                <select
                  name="employeeCount"
                  value={form.employeeCount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
                >
                  <option value="" className="bg-slate-800">선택해주세요</option>
                  <option value="1-10" className="bg-slate-800">1~10명</option>
                  <option value="11-50" className="bg-slate-800">11~50명</option>
                  <option value="51-200" className="bg-slate-800">51~200명</option>
                  <option value="201-500" className="bg-slate-800">201~500명</option>
                  <option value="501+" className="bg-slate-800">501명 이상</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Complete */}
          {step === 2 && (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                <Check size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">가입 완료!</h3>
              <p className="text-slate-400 mb-8">
                <span className="text-indigo-400 font-medium">{form.companyName}</span> 계정이 생성되었습니다.<br />
                대시보드에서 서비스를 시작하세요.
              </p>
              <button
                onClick={() => navigate('/', { replace: true })}
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2 mx-auto shadow-lg shadow-indigo-500/25"
              >
                대시보드로 이동
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Error */}
          {error && step < 2 && (
            <div className="mt-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Navigation buttons */}
          {step < 2 && (
            <div className="mt-6 flex gap-3">
              {step > 0 && (
                <button
                  onClick={() => { setStep((s) => s - 1); setError(''); }}
                  className="px-5 py-3 border border-white/10 text-slate-300 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  이전
                </button>
              )}
              <button
                onClick={step === 1 ? handleSubmit : handleNext}
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : step === 1 ? (
                  <>
                    가입하기
                    <Check size={18} />
                  </>
                ) : (
                  <>
                    다음
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Login link */}
        {step < 2 && (
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                로그인
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
