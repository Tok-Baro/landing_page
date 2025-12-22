import { Link } from "react-router-dom";
import { toklogo, mainchar } from "../assets/images";
import "../App.css";

export const Home = () => {
  return (
    <div>
      <header className="hero">
        <nav className="navbar">
          <div className="logo-container">
            <Link to="/">
              <img src={toklogo} alt="Tokbaro Logo" className="logo" />
            </Link>
            <span className="brand-name"> </span>
          </div>
        </nav>
        <div className="hero-content">
          <div className="hero-text">
            <span className="badge">Coming Soon</span>
            <h1>
              스마트폰 하나로 시작하는
              <br />
              올바른 습관
            </h1>
            <p>
              고가의 장비 없이, 당신의 스마트폰과 이어폰만으로
              <br />
              목과 손목의 피로를 줄이고, 생활 습관을 형성하세요
            </p>
          </div>
          <div className="hero-image">
            <img
              src={mainchar}
              alt="Tokbaro Character"
              className="character-img"
            />
          </div>
        </div>
      </header>
      <section className="problem-section">
        <div className="container">
          <h2>왜 '똑바로'인가요?</h2>
          <div className="problem-grid">
            <div className="problem-card">
              <h3>🐢 늘어나는 스마트폰 사용시간</h3>
              <p>
                스마트폰 과몰입으로 인한 목에 피로 증가.
                <br />
                생활 습관 형성이 필요합니다.
              </p>
            </div>
            <div className="problem-card">
              <h3>💸 부담스러운 비용</h3>
              <p>
                기존 웨어러블 기기의 높은 가격과
                <br />
                불편한 착용감을 해결했습니다.
              </p>
            </div>
            <div className="problem-card">
              <h3>📉 작심삼일 교정</h3>
              <p>
                수동적인 알림은 그만.
                <br />
                무의식적인 행동 변화를 유도합니다.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="solution-section">
        <div className="container">
          <h2>똑바로의 솔루션</h2>
          <div className="solution-grid">
            <div className="solution-item">
              <div className="icon">📱</div>
              <h3>Visual Nudge</h3>
              <p>
                다이나믹 아일랜드와 라이브 액티비티를 통해
                <br />
                콘텐츠 몰입을 방해하지 않습니다.
              </p>
            </div>
            <div className="solution-item">
              <div className="icon">🎧</div>
              <h3>No Extra Hardware</h3>
              <p>
                별도의 장비 없이
                <br />
                이미 가지고 있는 스마트폰과 이어폰만 있으면 됩니다.
              </p>
            </div>
            <div className="solution-item">
              <div className="icon">💪</div>
              <h3>Active Coaching</h3>
              <p>
                목과 손목의 피로를 감지하여
                <br />
                실시간으로 스트레칭을 코칭합니다.
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="container">
          <div className="footer-info">
            <div className="footer-logo">
              <img
                src={toklogo}
                alt="Tokbaro Logo"
                className="footer-logo-img"
              />
              <span className="footer-brand">똑바로 (Tokbaro)</span>
            </div>
            <div className="business-info">
              <p>
                <strong>
                  상호명: 똑바로 (Tokbaro) | 대표자: 정수현 | 사업자 등록번호:
                  640-65-00753
                </strong>
              </p>
              <p>
                <strong>주소:</strong> 서울특별시 종로구 동숭길 64, 5층
                S49호(동숭동), 03085
              </p>
              <p>
                <strong>이메일:</strong> tokbaro.connect@gmail.com
              </p>
              <p className="legal-links">
                <Link to="/privacy">개인정보처리방침</Link> |{" "}
                <Link to="/terms">이용약관</Link>
              </p>
            </div>
            <p className="copyright">© 2025 Tokbaro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
