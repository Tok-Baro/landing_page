import { Link } from "react-router-dom";
import { toklogo } from "../assets/images";
import "../App.css";

export const Privacy = () => {
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
            <h1>개인정보처리방침</h1>
            <p>법률 자문중</p>
          </div>
        </div>
      </header>
      <section className="content container">
        <p>법률 자문중</p>
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
          </div>
          <p className="copyright">© 2025 Tokbaro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
