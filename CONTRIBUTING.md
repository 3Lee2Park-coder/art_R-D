# 함께 작업하는 방법

이 저장소는 RestArt 프로토타입입니다. 원격은 `https://github.com/3Lee2Park-coder/art_R-D.git` 입니다.

지금 화면이 들어 있는 브랜치는 `cursor/restart-prototype-ddca` 입니다. `main` 은 초기 커밋만 있습니다. 새 작업은 `main` 이 아니라 이 프로토타입 브랜치의 최신 커밋에서 시작합니다. 프로토타입을 기준으로 삼아도 된다고 팀이 정하면, 그다음부터는 `main` 으로 합칩니다.

## 처음 받을 때

```bash
git clone https://github.com/3Lee2Park-coder/art_R-D.git
cd art_R-D
git checkout cursor/restart-prototype-ddca
npm install
npm run dev
```

브라우저는 `http://localhost:3000` 으로 엽니다. 의존성을 받은 뒤에는 같은 브랜치에서 `git pull` 만 하면 됩니다.

## 작업을 시작하기 전에

1. 누가 어느 화면을 맡는지 먼저 정합니다. 같은 파일을 동시에 고치면 나중에 합치기 어렵습니다.
2. 최신 코드를 받습니다.

```bash
git checkout cursor/restart-prototype-ddca
git pull
```

3. 그 자리에서 자기 브랜치를 만듭니다. 브랜치 하나에는 화면 하나, 또는 고칠 문제 하나만 담습니다.

```bash
git checkout -b minhyeok/login-center
```

이름 예: `minhyeok/exhibition-poster`, `seorin/leaflet-ticket`.

`main` 과 `cursor/restart-prototype-ddca` 에는 직접 커밋하지 않습니다. 그 브랜치는 모두가 받는 줄입니다.

## 커밋

저장할 내용이 모이면 커밋합니다. 동작하는 단위로 나누고, 메시지는 무엇을 바꿨는지보다 왜 바꿨는지를 한 문장으로 적습니다.

```bash
git status
git add app/login/page.tsx
git commit -m "Center the login form so the column sits in the middle of the screen."
git push -u origin HEAD
```

올리지 않을 것:

- `.env`, 비밀번호, 토큰
- `node_modules`, `.next` (이미 무시됩니다)
- 아직 화면에 연결하지 않은 실험 파일

`AGENTS.md` 는 `npm run dev` 가 다시 만들기 때문에, 생겼다면 작업과 함께 커밋합니다.

## 올리기

푸시한 뒤 GitHub에서 Pull Request를 엽니다. 대상 브랜치는 지금 기준으로 `cursor/restart-prototype-ddca` 입니다.

PR에는 바뀐 화면, 확인한 주소, 아직 안 본 경우를 적습니다. 리뷰하는 사람은 `npm run dev` 로 그 주소를 직접 엽니다. 디자인 배치의 기준은 `DESIGN_v2.md` 입니다. `DESIGN-apple.md` 는 참고용이고, 색과 글꼴은 따르지 않습니다.

코멘트가 오면 같은 브랜치에 이어서 커밋하고 다시 푸시합니다. PR은 자동으로 갱신됩니다.

## 합칠 때

리뷰가 끝나면 GitHub의 병합 버튼으로 넣습니다. 넣은 뒤 작업 브랜치는 지웁니다.

이미 푸시한 브랜치를 `git push --force` 로 덮어쓰지 않습니다. 다른 사람이 그 커밋을 받아 두었을 수 있습니다. 히스토리를 고쳐야 하면 팀에 먼저 말하고, 공유 브랜치에서는 하지 않습니다.

## 다른 사람 작업과 겹쳤을 때

푸시가 거절되면 원격이 앞서 있는 것입니다.

```bash
git pull
```

같은 줄이 둘 다 바뀌어 있으면 Git이 충돌로 표시합니다. 파일을 열어 양쪽 의도를 남기고, 화면을 다시 확인한 다음 커밋합니다. 어느 쪽을 지울지 모르겠으면 커밋하지 말고 그 파일의 작성자에게 묻습니다.

최신 프로토타입을 내 브랜치에 반영할 때는:

```bash
git checkout cursor/restart-prototype-ddca
git pull
git checkout minhyeok/login-center
git merge cursor/restart-prototype-ddca
```

## 화면과 리플릿을 건드릴 때

- 배치, 글자, 간격은 `DESIGN_v2.md` 를 따릅니다.
- 리플릿 배경은 `public/leaflets/Leaflets-ticket.png` 입니다. 글자 위치는 `vertical-exhibition-ticket.css` 의 퍼센트입니다. 배경을 바꾸면 위치 파일도 같이 갱신합니다.
- 포스터와 작품 이미지는 `public/images/` 에 두고, 주소는 `data/*.json` 에 적습니다.
- 값을 화면에 심어 두지 않습니다. 전시 이름, 날짜, 장소는 JSON에서 옵니다.
