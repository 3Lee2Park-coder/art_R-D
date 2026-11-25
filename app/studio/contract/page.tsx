"use client";

import { useEffect, useState } from "react";
import {
  COMPANY_INQUIRY_EMAIL,
  COMPANY_INQUIRY_MAILTO,
  COMPANY_INQUIRY_MAILTO_PLAIN,
} from "@/lib/constants";
import { useTitle } from "@/components/ui";
import "./landing.css";

export default function StudioContractPage() {
  const [navOpen, setNavOpen] = useState(false);
  useTitle("For Galleries — RestArt");

  useEffect(() => {
    document.documentElement.dataset.contractLanding = "1";
    return () => {
      delete document.documentElement.dataset.contractLanding;
    };
  }, []);

  return (
    <div className="contract-landing">

  <header className="topbar">
    <div className="wrap nav">
      <a className="brand" href="#top" aria-label="RestArt 홈"><span className="brand-mark" aria-hidden="true"></span><span>RestArt<small>ART & EXPERIENCE</small></span></a>
      <button type="button" className="mobile-toggle" aria-label={navOpen ? "메뉴 닫기" : "메뉴 열기"} aria-expanded={navOpen} onClick={() => setNavOpen((v) => !v)}>{navOpen ? "×" : "☰"}</button>
      <nav className={navOpen ? "nav-links open" : "nav-links"} aria-label="주요 메뉴" onClick={() => setNavOpen(false)}>
        <a href="#why">필요한 이유</a>
        <a href="#how">이용 흐름</a>
        <a href="#features">주요 기능</a>
        <a href="#data">리포트 예시</a>
        <a href="#faq">FAQ</a>
      </nav>
      <div className="nav-actions">
        <a className="text-link" href="https://restart-official.com/">일반 관람객 페이지 ↗</a>
        <a className="button button-dark" href="#contact">도입 상담 <span className="arrow">↗</span></a>
      </div>
    </div>
  </header>

  <main id="top">
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">FOR GALLERIES · EXHIBITION INTELLIGENCE</span>
          <h1>전시가 끝난 뒤에도,<br /><em>관람객의 반응</em>은<br />남습니다.</h1>
          <p>작품 기록부터 관심과 문의, 구역별 반응까지. 전시장 안에서 만들어진 관람 데이터를 연결해 다음 전시와 고객 관계를 더 깊이 이해하도록 돕습니다.</p>
          <div className="hero-actions">
            <a className="button button-light" href="#contact">RestArt와 이야기하기 <span className="arrow">↗</span></a>
            <a className="button button-outline" href="#data">리포트 살펴보기 <span className="arrow">↓</span></a>
          </div>
          <div className="hero-note">전시 참여 기록 기반 · 갤러리 운영자와 큐레이터를 위한 서비스</div>
        </div>

        <div className="dashboard-shell" aria-label="가상 데이터로 구성한 전시 리포트 예시">
          <div className="dash-top"><div><div className="dash-brand">RestArt <span style={{fontWeight: "500", color: "#899594"}}>/ GALLERY REPORT</span></div><div className="dash-label">EXHIBITION INTELLIGENCE</div></div><span className="sample-tag">SAMPLE DATA</span></div>
          <div className="dash-heading"><div><div className="dash-label">EXHIBITION OVERVIEW</div><h3>빛과 시선, 공간의 기록</h3></div><div className="dash-date">2026. 10. 01 — 10. 21</div></div>
          <div className="metric-grid">
            <div className="metric"><span>참여 세션</span><strong>48</strong><small>서비스 참여 기준</small></div>
            <div className="metric"><span>작품 기록</span><strong>126</strong><small>촬영 이벤트</small></div>
            <div className="metric"><span>관심 등록</span><strong>19</strong><small>명시적 선택</small></div>
            <div className="metric"><span>작품 문의</span><strong>07</strong><small>문의 제출</small></div>
          </div>
          <div className="dash-lower">
            <div className="dash-card"><h4>구역별 작품 기록</h4>
              <div className="bar-row"><span>ZONE A</span><div className="bar-track"><i className="bar-fill" style={{width: "82%"}}></i></div><b>34</b></div>
              <div className="bar-row"><span>ZONE B</span><div className="bar-track"><i className="bar-fill" style={{width: "62%"}}></i></div><b>26</b></div>
              <div className="bar-row"><span>ZONE C</span><div className="bar-track"><i className="bar-fill" style={{width: "48%"}}></i></div><b>20</b></div>
              <div className="bar-row"><span>ZONE D</span><div className="bar-track"><i className="bar-fill" style={{width: "35%"}}></i></div><b>14</b></div>
            </div>
            <div className="dash-card"><h4>작품 반응 TOP</h4>
              <div className="rank-row"><span className="art-thumb"></span><span>작품 A</span><strong>18</strong></div>
              <div className="rank-row"><span className="art-thumb"></span><span>작품 B</span><strong>14</strong></div>
              <div className="rank-row"><span className="art-thumb"></span><span>작품 C</span><strong>11</strong></div>
            </div>
          </div>
          <div className="dash-foot"><span>참여 기록을 바탕으로 한 예시 화면입니다.</span><span>REPORT PREVIEW ↗</span></div>
        </div>
      </div>
    </section>

    <section className="section problem" id="why">
      <div className="wrap">
        <div className="section-head">
          <div><span className="eyebrow">WHY RESTART</span><h2>방문객 수를 넘어,<br /><em>무엇이 기억되었는지</em>를.</h2></div>
          <p className="intro">전시가 끝나면 관람객은 돌아가고, 현장의 기억도 흩어집니다. 어떤 작품이 기록되었는지, 누가 관심을 표현했는지, 어떤 구역에서 반응이 나타났는지 다시 살펴볼 수 있다면 다음 전시를 준비하는 관점도 달라집니다.</p>
        </div>
        <div className="problem-grid">
          <article className="problem-card"><span className="problem-number">01</span><div><h3>관람객의 반응을 알기 어렵습니다</h3><p>입장객 수만으로는 어떤 작품이 관람객의 시선을 끌었는지 확인하기 어렵습니다.</p></div></article>
          <article className="problem-card"><span className="problem-number">02</span><div><h3>관심과 문의가 흩어집니다</h3><p>작품에 대한 질문과 연락처, 후속 소통의 단서가 여러 채널에 나뉘어 남습니다.</p></div></article>
          <article className="problem-card"><span className="problem-number">03</span><div><h3>다음 전시의 근거가 부족합니다</h3><p>작품 배치와 안내를 개선하고 싶어도 현장 경험을 데이터로 되짚기 어렵습니다.</p></div></article>
        </div>
      </div>
    </section>

    <section className="section dark-section" id="how">
      <div className="wrap">
        <div className="section-head">
          <div><span className="eyebrow">HOW IT WORKS</span><h2>전시 준비부터<br /><em>다음 기획까지</em> 연결합니다.</h2></div>
          <p className="intro">갤러리는 전시 정보를 등록하고, 관람객은 QR을 통해 기록을 남깁니다. RestArt는 그 기록을 작품과 전시 공간에 연결해 갤러리가 확인할 수 있는 형태로 정리합니다.</p>
        </div>
        <div className="steps">
          <article className="step"><h3>전시 정보 등록</h3><p>전시 기본 정보와 포스터, 작품 목록, 배치도를 등록합니다.</p><span className="step-pill">EXHIBITION SETUP</span></article>
          <article className="step"><h3>작품·구역 데이터 검수</h3><p>작품과 구역의 연결을 확인하고, 필요한 정보는 운영자가 보완합니다.</p><span className="step-pill">HUMAN REVIEW</span></article>
          <article className="step"><h3>관람객의 기록 축적</h3><p>관람객은 QR로 진입해 작품을 촬영하고 리플릿과 관심 기록을 남깁니다.</p><span className="step-pill">VISITOR EXPERIENCE</span></article>
          <article className="step"><h3>리포트와 다음 인사이트</h3><p>작품·고객·구역 반응을 살펴보고 다음 전시 운영의 참고 자료로 활용합니다.</p><span className="step-pill">GALLERY REPORT</span></article>
        </div>
      </div>
    </section>

    <section className="section features" id="features">
      <div className="wrap">
        <div className="section-head">
          <div><span className="eyebrow">WHAT YOU CAN LEARN</span><h2>하나의 전시를<br /><em>네 가지 관점</em>으로.</h2></div>
          <p className="intro">단순한 숫자 나열이 아닌, 관람객과 작품 그리고 공간 사이에 남은 기록을 구분해서 보여줍니다.</p>
        </div>
        <div className="feature-grid">
          <article className="feature-card"><span className="feature-no">01</span><div className="feature-icon">◎</div><h3>고객 인텔리전스</h3><p>전시별 참여 고객과 전체 고객을 구분해 확인하고, 고객별 방문 전시와 관심 작품, 문의 이력을 연결합니다.</p></article>
          <article className="feature-card"><span className="feature-no">02</span><div className="feature-icon">✳</div><h3>작품 반응 분석</h3><p>작품 촬영 기록, 명시적 관심 등록, 문의, 추천 노출을 구분해 작품별 반응을 살펴봅니다.</p></article>
          <article className="feature-card"><span className="feature-no">03</span><div className="feature-icon">⌁</div><h3>구역별 공간 반응</h3><p>구역과 작품 배치에 연결된 기록을 살펴보고, 촬영 기록 기반 구역 전환과 체류 추정치를 확인합니다.</p></article>
          <article className="feature-card"><span className="feature-no">04</span><div className="feature-icon">↗</div><h3>전시 개선 인사이트</h3><p>전시 목표와 관측 지표를 비교하고, 근거와 데이터 한계를 함께 표시한 개선 가설을 제공합니다.</p></article>
        </div>
      </div>
    </section>

    <section className="section showcase" id="data">
      <div className="wrap showcase-grid">
        <div className="showcase-copy">
          <span className="eyebrow">INSIDE THE REPORT</span>
          <h2>전시가 남긴 기록을<br /><em>한눈에 살펴보세요.</em></h2>
          <p>작품 기록과 리플릿, 연락처 확보 고객을 구분하고, 작품·구역별 데이터를 함께 확인할 수 있습니다. 고객 상세와 전시별 리포트가 연결되어 있어 분석에서 다음 행동으로 이어지는 구조를 지향합니다.</p>
          <ul className="showcase-list">
            <li>전시 참여 및 작품 기록 추이</li>
            <li>연락처 확보 고객과 전시별 유입 출처</li>
            <li>작품 기록·관심·문의 반응 비교</li>
            <li>구역별 기록 및 촬영 순서 기반 전환</li>
          </ul>
        </div>
        <div className="report-preview" aria-label="가상 데이터로 구성한 리포트 미리보기">
          <div className="report-header"><div><b>Exhibition Overview</b><small>전시 리포트 · 예시 데이터</small></div><span>DEMO PREVIEW</span></div>
          <div className="report-stats">
            <div className="report-stat"><label>참여 세션</label><strong>48</strong></div>
            <div className="report-stat"><label>연락처 확보 고객</label><strong>21</strong></div>
            <div className="report-stat"><label>작품 기록</label><strong>126</strong></div>
          </div>
          <div className="report-main">
            <div className="report-panel"><h4>시간대별 참여 기록</h4><div className="mini-bars"><span style={{height: "38%"}}></span><span style={{height: "56%"}}></span><span style={{height: "45%"}}></span><span style={{height: "83%"}}></span><span style={{height: "68%"}}></span><span style={{height: "95%"}}></span><span style={{height: "61%"}}></span><span style={{height: "74%"}}></span><span style={{height: "50%"}}></span></div><div className="legend"><span>오전</span><span>오후</span><span>저녁</span></div></div>
            <div className="report-panel"><h4>운영 검토 포인트</h4>
              <div className="insight"><span className="insight-mark">↗</span><span>작품 기록이 상대적으로 많이 모인 구역을 확인하세요.</span></div>
              <div className="insight"><span className="insight-mark">◎</span><span>관심 등록과 문의가 이어진 작품을 살펴보세요.</span></div>
              <div className="insight"><span className="insight-mark">⌁</span><span>기록이 부족한 구역은 안내·배치 조건을 함께 검토하세요.</span></div>
            </div>
          </div>
          <div className="report-disclaimer">※ 화면과 수치는 기능 설명을 위한 가상 데이터입니다. 실제 갤러리 성과를 나타내지 않습니다.</div>
        </div>
      </div>
    </section>

    <section className="section trust">
      <div className="wrap trust-grid">
        <div className="trust-copy"><span className="eyebrow">MEASURE WITH CONTEXT</span><h2>데이터의 의미와<br /><em>한계까지 투명하게.</em></h2><p>좋은 리포트는 숫자를 크게 보여주는 것보다, 그 숫자가 무엇을 의미하는지 정확히 설명하는 데서 시작합니다. RestArt는 참여 기록과 추정치를 구분해 해석하도록 설계합니다.</p></div>
        <div className="trust-points">
          <div className="trust-item"><b>참여 데이터 기준</b><span>서비스에 참여한 세션 기준입니다. 전시장 전체 입장객 수와 동일하지 않습니다.</span></div>
          <div className="trust-item"><b>기록과 관심의 구분</b><span>촬영 기록은 관심 등록이나 구매 의사로 자동 해석하지 않습니다.</span></div>
          <div className="trust-item"><b>추정치의 명시</b><span>체류 시간과 구역 전환은 촬영 기록에서 추정하며 실제 이동 경로가 아닙니다.</span></div>
          <div className="trust-item"><b>사람의 검수</b><span>작품과 구역 데이터는 자동 생성 결과를 사람이 검토·보완하는 방식을 지향합니다.</span></div>
        </div>
      </div>
    </section>

    <section className="section audience">
      <div className="wrap">
        <div className="section-head"><div><span className="eyebrow">MADE FOR GALLERIES</span><h2>갤러리의 규모보다<br /><em>운영 방식에 맞게.</em></h2></div><p className="intro">전시와 관람객을 더 잘 이해하고 싶은 갤러리, 큐레이터, 전시 운영 조직을 위한 서비스 방향입니다.</p></div>
        <div className="audience-grid">
          <article className="audience-card"><span className="label">01 / GALLERY</span><h3>상업 갤러리</h3><p>전시별 작품 반응과 잠재 고객의 관심 단서를 확인하고, 후속 관계를 이어가고 싶은 갤러리.</p></article>
          <article className="audience-card"><span className="label">02 / CURATOR</span><h3>큐레이터·전시 기획자</h3><p>작품 배치와 구역 구성, 관람객의 반응을 다음 전시 기획의 참고 자료로 활용하고 싶은 팀.</p></article>
          <article className="audience-card"><span className="label">03 / EXHIBITION</span><h3>전시 공간·기관</h3><p>반복적으로 전시를 운영하며 관람객 경험과 공간 운영을 꾸준히 살펴보고 싶은 조직.</p></article>
        </div>
      </div>
    </section>

    <section className="section faq" id="faq">
      <div className="wrap faq-grid">
        <div><span className="eyebrow">QUESTIONS</span><h2>도입 전에<br /><em>궁금한 점.</em></h2></div>
        <div className="faq-list">
          <details><summary>RestArt는 갤러리 CRM인가요?</summary><p>현재 소개하는 핵심은 전시 참여 데이터와 작품·구역 반응을 연결하는 갤러리 인텔리전스입니다. 일반적인 영업 CRM, 재고·회계·판매 관리 전체를 제공한다고 설명하지 않습니다.</p></details>
          <details><summary>전시장에 방문한 모든 관람객이 분석되나요?</summary><p>아닙니다. 리포트는 RestArt 관람 경험에 참여해 기록을 남긴 세션을 기반으로 합니다. 전시장 전체 입장객을 대표하는 통계로 해석해서는 안 됩니다.</p></details>
          <details><summary>작품에 얼마나 오래 머물렀는지 정확히 알 수 있나요?</summary><p>촬영 시각과 작품·구역 연결을 바탕으로 체류를 추정하는 방향입니다. 실제 감상 시간이나 실내 위치를 직접 측정하는 기능으로 표현하지 않으며, 근거가 부족한 경우 추정 불가로 처리해야 합니다.</p></details>
          <details><summary>어떤 자료를 준비해야 하나요?</summary><p>기본적으로 전시 정보, 포스터, 작품 목록, 배치도 자료를 기준으로 설계되어 있습니다. 실제 도입 시 파일 형식과 필수 항목은 전시 환경을 확인한 뒤 안내합니다.</p></details>
          <details><summary>지금 바로 실제 서비스를 도입할 수 있나요?</summary><p>이 페이지는 서비스 방향과 기능을 설명하는 영업용 시안입니다. 실제 데이터 연동, 운영 정책, 도입 가능 범위와 일정은 상담을 통해 별도로 확인해야 합니다.</p></details>
        </div>
      </div>
    </section>

    <section className="contact" id="contact">
      <div className="wrap contact-inner">
        <div><span className="eyebrow">LET&apos;S TALK ABOUT YOUR NEXT EXHIBITION</span><h2>다음 전시를 준비하는<br /><em>새로운 관점.</em></h2><p>갤러리의 전시 운영 방식과 필요한 데이터를 들려주세요.</p></div>
        <div className="contact-actions"><a className="button button-light" href={COMPANY_INQUIRY_MAILTO}>도입 상담 문의하기 <span className="arrow">↗</span></a><small>{COMPANY_INQUIRY_EMAIL}</small></div>
      </div>
    </section>
  </main>

  <footer>
    <div className="wrap footer-inner">
      <div><div className="footer-brand">RestArt</div><div className="copyright">© RestArt. Art & Experience.</div></div>
      <div className="footer-links"><a href="https://restart-official.com/">일반 관람객 사이트</a><a href="#top">페이지 맨 위로 ↑</a><a href={COMPANY_INQUIRY_MAILTO_PLAIN}>문의하기</a></div>
    </div>
  </footer>

  

    </div>
  );
}
