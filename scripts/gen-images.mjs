import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

function save(rel, body) {
  const path = join(root, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(
    path,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">${body}</svg>`,
  );
}

function square(rel, body) {
  const path = join(root, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(
    path,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">${body}</svg>`,
  );
}

save(
  "public/images/artworks/plane.svg",
  `<rect width="800" height="1000" fill="#E7D7C8"/><rect x="70" y="120" width="420" height="620" fill="#1F3A5F"/><rect x="280" y="300" width="450" height="480" fill="#C4553A" opacity="0.92"/><rect x="140" y="640" width="520" height="90" fill="#F2E6CF"/>`,
);
save(
  "public/images/artworks/window.svg",
  `<rect width="800" height="1000" fill="#F4F1EA"/><rect x="90" width="90" height="1000" fill="#D5E2EA"/><rect x="250" width="70" height="1000" fill="#9BB8C9"/><rect x="430" width="160" height="1000" fill="#1D1D1F"/><rect x="640" width="40" height="1000" fill="#C9D6DE"/>`,
);
save(
  "public/images/artworks/navy.svg",
  `<rect width="800" height="1000" fill="#0B2344"/><rect x="0" y="430" width="800" height="28" fill="#E2B857"/><rect x="120" y="160" width="220" height="220" fill="#16385F"/><rect x="420" y="620" width="260" height="180" fill="#123055"/>`,
);
save(
  "public/images/artworks/fold.svg",
  `<rect width="800" height="1000" fill="#F7F3EC"/><polygon points="0,0 800,0 0,1000" fill="#E6D5C3"/><polygon points="800,180 800,1000 180,1000" fill="#8C3B32"/><polygon points="260,80 620,420 300,760" fill="#F3E1C4" opacity="0.9"/>`,
);
save(
  "public/images/artworks/edge.svg",
  `<rect width="800" height="1000" fill="#F6F4F1"/><line x1="80" y1="120" x2="700" y2="860" stroke="#1D1D1F" stroke-width="8"/><rect x="520" y="180" width="120" height="120" fill="#B8312B"/>`,
);
save(
  "public/images/artworks/grain.svg",
  `<rect width="800" height="1000" fill="#E4E7E2"/>${Array.from({ length: 28 }, (_, i) => `<rect x="60" y="${80 + i * 32}" width="${520 + (i % 4) * 40}" height="6" fill="#5E6B62" opacity="${0.35 + (i % 5) * 0.1}"/>`).join("")}`,
);
save(
  "public/images/artworks/white.svg",
  `<rect width="800" height="1000" fill="#F7F7F5"/><circle cx="400" cy="500" r="180" fill="#E6E6E2"/><circle cx="400" cy="500" r="8" fill="#9A9A96"/>`,
);
save(
  "public/images/artworks/study.svg",
  `<rect width="800" height="1000" fill="#F3F0EA"/><circle cx="300" cy="380" r="140" fill="none" stroke="#5C584F" stroke-width="6"/><circle cx="460" cy="540" r="180" fill="none" stroke="#8A8175" stroke-width="4"/><circle cx="250" cy="680" r="70" fill="none" stroke="#1D1D1F" stroke-width="5"/>`,
);
save(
  "public/images/artworks/e06.svg",
  `<rect width="800" height="1000" fill="#F6EDE8"/><rect x="100" y="200" width="280" height="520" fill="#CC3F5C"/><rect x="420" y="320" width="260" height="400" fill="#F5DFB5"/><rect x="200" y="700" width="400" height="40" fill="#03569B"/>`,
);
save(
  "public/images/artworks/e07.svg",
  `<rect width="800" height="1000" fill="#CBD7E8"/><rect x="80" y="140" width="640" height="40" fill="#FFCB58"/><rect x="120" y="280" width="200" height="480" fill="#F5DFB5"/><rect x="400" y="220" width="280" height="560" fill="#A5B8C7" opacity="0.7"/>`,
);
save(
  "public/images/artworks/e08.svg",
  `<rect width="800" height="1000" fill="#1A1A22"/><rect x="60" y="180" width="680" height="120" fill="#5C68A3"/><rect x="100" y="380" width="500" height="80" fill="#A5B8C7"/><circle cx="620" cy="700" r="90" fill="#262626"/>`,
);
save(
  "public/images/artworks/e09.svg",
  `<rect width="800" height="1000" fill="#2E1450"/><rect x="140" y="160" width="520" height="680" fill="#CC3F5C"/><rect x="200" y="280" width="180" height="180" fill="#FFCB58"/><rect x="420" y="520" width="160" height="220" fill="#03569B"/>`,
);
save(
  "public/images/artworks/e10.svg",
  `<rect width="800" height="1000" fill="#E8D4C4"/><rect x="0" y="0" width="160" height="1000" fill="#D38E6E"/><rect x="200" y="0" width="80" height="1000" fill="#E76C56"/><rect x="360" y="0" width="200" height="1000" fill="#F5DFB5"/><rect x="640" y="0" width="100" height="1000" fill="#D38E6E"/>`,
);
save(
  "public/images/artworks/e11.svg",
  `<rect width="800" height="1000" fill="#FFF6E0"/><circle cx="400" cy="420" r="220" fill="#FFCB58"/><circle cx="400" cy="420" r="120" fill="#F9EFBD"/><rect x="180" y="700" width="440" height="60" fill="#92C683"/>`,
);
save(
  "public/images/artworks/e12.svg",
  `<rect width="800" height="1000" fill="#1D1D1F"/><rect x="120" y="160" width="560" height="680" fill="#FFE40F"/><rect x="200" y="260" width="400" height="480" fill="#FFCB58"/><rect x="280" y="360" width="240" height="280" fill="#92C683"/>`,
);

save(
  "public/images/posters/edge.svg",
  `<rect width="800" height="1000" fill="#F3EBE3"/><rect x="0" y="0" width="800" height="280" fill="#0D2E52"/><rect x="80" y="360" width="300" height="460" fill="#C4553A"/><rect x="420" y="480" width="280" height="340" fill="#1F3A5F"/><rect x="80" y="860" width="200" height="16" fill="#F6CD52"/>`,
);
save(
  "public/images/posters/winter.svg",
  `<rect width="800" height="1000" fill="#EEF1F4"/>${Array.from({ length: 12 }, (_, i) => `<rect x="0" y="${i * 84}" width="800" height="${28 + (i % 3) * 8}" fill="${i % 2 ? "#D5DDE6" : "#F7F8FA"}"/>`).join("")}<rect x="90" y="760" width="220" height="8" fill="#0D2E52"/>`,
);
save(
  "public/images/posters/alley.svg",
  `<rect width="800" height="1000" fill="#E9D7C4"/><rect x="70" y="80" width="180" height="240" fill="#8C4A32"/><rect x="280" y="140" width="140" height="180" fill="#F3E6D4"/><rect x="450" y="90" width="250" height="300" fill="#C46A45"/><rect x="120" y="420" width="560" height="420" fill="#6E3B2E"/><rect x="200" y="500" width="160" height="220" fill="#F6E7D4"/>`,
);
save(
  "public/images/posters/tide.svg",
  `<rect width="800" height="1000" fill="#D7E4EA"/><path d="M0 620 C160 540 240 700 400 640 C560 580 640 720 800 660 L800 1000 L0 1000 Z" fill="#1F4E68"/><path d="M0 760 C180 700 300 820 480 760 C640 710 700 800 800 760 L800 1000 L0 1000 Z" fill="#0D2E52"/><circle cx="620" cy="220" r="70" fill="#F6CD52"/>`,
);
save(
  "public/images/posters/pending.svg",
  `<rect width="800" height="1000" fill="#F5F5F7"/><rect x="100" y="160" width="600" height="680" fill="#FFFFFF" stroke="#E0E0E0"/><rect x="160" y="240" width="220" height="280" fill="#0D2E52"/><rect x="420" y="360" width="200" height="200" fill="#F6CD52"/>`,
);
save(
  "public/images/posters/plain.svg",
  `<rect width="800" height="1000" fill="#F5F5F7"/><rect x="140" y="220" width="520" height="560" fill="#E7E7EA"/><rect x="220" y="320" width="200" height="280" fill="#0D2E52"/>`,
);

square("public/images/artists/seorin.svg", `<rect width="800" height="800" fill="#F3E6DC"/><circle cx="400" cy="400" r="220" fill="#C96B58"/>`);
square("public/images/artists/doyun.svg", `<rect width="800" height="800" fill="#E4EAF0"/><rect x="180" y="140" width="440" height="520" fill="#1F3A5F"/>`);
square("public/images/artists/eungyeol.svg", `<rect width="800" height="800" fill="#E7EFE6"/><path d="M120 620 C220 300 420 180 680 260 L680 620 Z" fill="#3E6B4F"/>`);

console.log("images written");
