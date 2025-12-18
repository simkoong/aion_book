# 배포 가이드 (Deployment Guide)

이 문서는 **아이온 책모임 (Aion Book Club)** 앱을 배포하는 방법을 설명합니다.
가장 추천하는 방법은 **Vercel**을 사용하는 것입니다. 설정이 간편하고 Vite 프로젝트에 최적화되어 있습니다.

## 방법 1: Vercel 배포 (추천)
Vercel은 GitHub 저장소와 연동하여 코드를 푸시할 때마다 자동으로 배포해 줍니다.

### 1단계: GitHub에 코드 올리기
1. GitHub에 새 저장소(Repository)를 만듭니다.
2. 현재 프로젝트를 GitHub에 푸시합니다.
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <당신의_GITHUB_저장소_URL>
   git push -u origin main
   ```

### 2단계: Vercel에 프로젝트 연결
1. [Vercel](https://vercel.com)에 로그인합니다 (GitHub 계정 사용 권장).
2. **"Add New..."** -> **"Project"**를 클릭합니다.
3. 방금 올린 GitHub 저장소를 찾아 **"Import"**를 누릅니다.
4. `Framework Preset`이 **Vite**로 자동 설정되어 있는지 확인합니다.
5. **"Deploy"** 버튼을 누릅니다.

완료되면 Vercel이 제공하는 도메인(예: `aion-book-club.vercel.app`)으로 바로 접속할 수 있습니다.

---

## 방법 2: GitHub Pages 배포
GitHub Pages는 무료이지만, SPA(React) 라우팅을 위해 약간의 추가 설정이 필요합니다.

### 1단계: 설정 변경
`vite.config.js` 파일을 열어 `base` 설정을 추가합니다. (저장소 이름이 `aion-book`이라면)
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/aion-book/', // 저장소 이름과 동일하게 설정
})
```

### 2단계: 패키지 설치
`gh-pages` 패키지를 설치합니다.
```bash
npm install gh-pages --save-dev
```

### 3단계: script 추가
`package.json`의 `scripts` 부분에 다음을 추가합니다.
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist",
  ...
}
```

### 4단계: 배포 실행
```bash
npm run deploy
```
배포가 완료되면 `https://<아이디>.github.io/<저장소이름>/` 에서 확인할 수 있습니다.
