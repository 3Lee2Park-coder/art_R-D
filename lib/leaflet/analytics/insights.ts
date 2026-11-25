/**
 * 전시 개선 인사이트 (5i). 규칙만. LLM 없음.
 */

import type { InterestsAnalytics } from "@/lib/leaflet/analytics/interests";
import type {
  ZoneAnalyticsRow,
  ZoneTransition,
  ZonesAnalytics,
} from "@/lib/leaflet/analytics/zones";
import type { ExhibitionGoals } from "@/lib/types";

export type GoalProgressRow = {
  label: string;
  actual: number;
  target: number | null;
  /** null → 「추정 불가」 */
  achievementPct: number | null;
};

export type InsightCard = {
  tag: string;
  title: string;
  observation: string;
  hypothesis?: string;
  experiment?: string;
  suggestion?: string;
  metricRef: string;
};

export type InsightsAnalytics = {
  objectives: string[];
  goalRows: GoalProgressRow[];
  /** 체크인 분모 없음 → 참여율 카드 제외. 절대 세션 비교도 HTML 문장과 다르면 숨김 */
  cards: InsightCard[];
};

function achievement(actual: number, target: number | null): number | null {
  if (target == null || target <= 0) return null;
  return Math.round((actual / target) * 100);
}

export function buildInsightsAnalytics(input: {
  goals: ExhibitionGoals | null;
  interests: InterestsAnalytics;
  zones: ZonesAnalytics;
}): InsightsAnalytics {
  const objectives = input.goals?.objectives ?? [];
  const targets = input.goals?.targets ?? {
    records: null,
    interests: null,
    inquiries: null,
  };

  const goalRows: GoalProgressRow[] = [
    {
      label: "작품 기록",
      actual: input.interests.totalRecords,
      target: targets.records,
      achievementPct: achievement(input.interests.totalRecords, targets.records),
    },
    {
      label: "관심 등록",
      actual: input.interests.totalInterests,
      target: targets.interests,
      achievementPct: achievement(
        input.interests.totalInterests,
        targets.interests,
      ),
    },
    {
      label: "작품 문의",
      actual: input.interests.totalInquiries,
      target: targets.inquiries,
      achievementPct: achievement(
        input.interests.totalInquiries,
        targets.inquiries,
      ),
    },
  ];

  const cards: InsightCard[] = [];
  const zoneRows = input.zones.empty ? [] : input.zones.rows;

  // 고유 체크인 미수집 → HTML 「체크인 대비 참여율」 카드 숨김.
  // 구역 절대 세션 비교 문장은 HTML과 다르므로 PM 확인 전 숨김.

  const dense = densestZone(zoneRows);
  if (dense && dense.occupancyPct != null) {
    cards.push({
      tag: "작품 밀도 검토",
      title: `${dense.name}의 벽면 점유율이 ${dense.occupancyPct}%입니다.`,
      observation: `${dense.name}은 등록 작품 폭 합계가 벽면 가로 길이의 ${dense.occupancyPct}%를 차지합니다.`,
      hypothesis:
        "작품 간 여백, 작품 크기 조합, 시야 겹침 또는 소개문 가시성이 관람과 기록에 영향을 주었는지 살펴볼 수 있습니다.",
      experiment:
        "작품 간격 또는 배치 수를 조정한 뒤 유효 표본이 충분한 다음 전시에서 반응을 비교합니다.",
      metricRef:
        "확인 지표: 벽면 점유율, 작품별 평균 작품 감상, 작품 기록 및 관심 등록 · 공간 구조와 작품 구성이 함께 바뀌면 원인 구분이 어려움",
    });
  }

  const topTransition = input.zones.transitions[0];
  if (topTransition && topTransition.count > 0) {
    cards.push({
      tag: "관람 흐름 검토",
      title: `가장 자주 관찰된 연속 기록 구역 전환은 ${topTransition.route}입니다.`,
      observation: `${topTransition.count}회(${topTransition.sharePct}%)의 연속 작품 기록에서 이 구역 전환이 나타났습니다.`,
      hypothesis:
        "해당 구역 사이의 작품 배치나 관람 흐름이 연결되어 있을 수 있지만, 미촬영 작품과 되돌아가는 움직임은 기록에 나타나지 않습니다.",
      experiment:
        "다음 전시에서 작품 안내 순서, 작품 배치 또는 구역 표기를 조정하고 전후 기록 순서 분포를 비교합니다.",
      metricRef:
        "확인 지표: 최초 기록 구역, 연속 Zone 전환 횟수·비율, 구역별 기록 참여 · 실제 보행 동선과 구분",
    });
  }

  const topSimilar = input.interests.similarRows[0];
  if (topSimilar && topSimilar.exposureCount > 0) {
    cards.push({
      tag: "추천 작품 성과",
      title: `${topSimilar.title}이(가) 가장 자주 “가장 닮은 작품”으로 추천되었습니다.`,
      observation: `${topSimilar.exposureCount}회 추천, 추천 후 관심 등록 ${topSimilar.interestAfter}회(${topSimilar.interestRate ?? 0}%), 추천 작품 문의 ${topSimilar.inquiryAfter}건입니다.`,
      suggestion:
        "추천 알고리즘 버전별로 추천 노출, 관심 등록, 문의를 비교하고, 추천 이유와 추천 후보군을 함께 검토합니다.",
      metricRef:
        "확인 지표: 추천 노출 수, 추천 후 관심 등록률, 추천 작품 문의율 · 추천이 구매 의사를 뜻하지 않음",
    });
  }

  return { objectives, goalRows, cards };
}

function densestZone(rows: ZoneAnalyticsRow[]): ZoneAnalyticsRow | null {
  const withPct = rows.filter((r) => r.occupancyPct != null);
  if (withPct.length === 0) return null;
  return [...withPct].sort(
    (a, b) => (b.occupancyPct ?? 0) - (a.occupancyPct ?? 0),
  )[0]!;
}

/** 테스트·표시용: 전환 목록에서 1위 */
export function topTransition(
  transitions: ZoneTransition[],
): ZoneTransition | null {
  return transitions[0] ?? null;
}
