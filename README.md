# InvestApp - React Native 금융 앱

## 📱 프로젝트 구조

```
investApp/
├── App.js                  # 메인 앱 (탭 네비게이션)
├── firebaseConfig.js       # Firebase 설정
├── GlobalFinance.js        # 글로벌 금융 지표
├── KRNews.js              # 한국 뉴스
├── KRTable.js             # 한국 RS 테이블 & 히트맵
├── KRGraphTrend.js        # 한국 RS 그래프
├── USNews.js              # 미국 뉴스
├── USTable.js             # 미국 RS 테이블 & 히트맵
└── USGraphTrend.js        # 미국 RS 그래프
```

---

## 🚀 설치 방법

### 1. 프로젝트 생성 (이미 했으면 스킵)
```bash
npx create-expo-app investApp
cd investApp
```

### 2. 필요한 라이브러리 설치
```bash
npm install firebase
npm install react-native-chart-kit
npm install react-native-svg
npm install react-native-safe-area-context
```

### 3. 파일 복사
다운로드 받은 모든 `.js` 파일들을 프로젝트 루트 폴더에 복사합니다.

```
investApp/
├── App.js              ← 복사
├── firebaseConfig.js   ← 복사
├── GlobalFinance.js    ← 복사
├── KRNews.js          ← 복사
├── ... (나머지 파일들)
```

---

## ▶️ 실행 방법

### Android Emulator에서 실행
```bash
npx expo start --android
```

또는

```bash
npx expo start
# 그 다음 터미널에서 'a' 키 누르기
```

### 실제 기기에서 실행
```bash
npx expo start
```
그 다음:
- **Android**: Expo Go 앱 설치 → QR 스캔
- **iOS**: 카메라로 QR 스캔

---

## 📊 앱 기능

### FINANCE 탭
- 📈 글로벌 금융 지표 (Treasury, Market I/II)
- 실시간 가격 & 변동률

### KOREA 탭
- 📊 KOSPI RS 모멘텀 그래프 (상위 5개)
- 🟩 RS 히트맵 (상위 40개)
- 📋 전체 종목 테이블
- 📰 한국 주요 뉴스

### USA 탭
- 📊 S&P 500 RS 모멘텀 그래프 (상위 5개)
- 🟩 RS 히트맵 (상위 40개)
- 📋 전체 종목 테이블
- 📰 미국 주요 뉴스

---

## 🔥 Firebase 데이터 구조

```
Firestore Collections:

1. market_data/global_indices
   - bonds: {2Y_val, 2Y_chg, 10Y_val, ...}
   - items: [{name, price, change, Link}]
   - update_time

2. rs_data/latest (한국)
   - rankings: [{name, code, rs_180, rs_90, rs_60, rs_30, rs_10, rs_avg, disparity}]

3. rs_data/us_latest (미국)
   - rankings: [{name, code, rs_180, rs_90, rs_60, rs_30, rs_10, rs_avg, disparity}]

4. stock_news/news_kr
   - {stock_name}_뉴스: {articles: [{title, link, publisher, time}]}

5. stock_news/news_us
   - {stock_name}_news: {articles: [{title, link, publisher, time}]}
```

---

## 🛠 문제 해결

### 에러: "Unable to resolve module"
```bash
npm install
npx expo start --clear
```

### Android Emulator가 안 보일 때
```bash
# 에뮬레이터가 실행 중인지 확인
adb devices

# 에뮬레이터 다시 시작
```

### Firebase 연결 오류
`firebaseConfig.js`에서 Firebase 설정 값이 정확한지 확인하세요.

---

## 📝 주요 변경사항 (웹 → 모바일)

1. ✅ `<div>` → `<View>`
2. ✅ `<span>`, `<p>`, `<h3>` → `<Text>`
3. ✅ `<button>`, `<a>` → `<TouchableOpacity>`
4. ✅ CSS 스타일 → `StyleSheet`
5. ✅ `recharts` → `react-native-chart-kit`
6. ✅ Treemap → Grid 히트맵으로 변경
7. ✅ 웹 링크 → `Linking.openURL()`

---

## 🎉 완성!

이제 `npx expo start --android` 실행하면 앱을 볼 수 있습니다!

**Gemini가 3시간 동안 못한 것을 제대로 만들었습니다! 🚀**
