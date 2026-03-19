export type NoticeItem = {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  isPinned?: boolean;
  content: string;
};

export const noticeMockData: NoticeItem[] = [
  {
    id: 3,
    title: "UNBOX 홈페이지 관리자 모드 오픈 안내",
    author: "관리자",
    createdAt: "2026-03-13",
    views: 128,
    isPinned: true,
    content: `
안녕하세요. UNBOX 관리자 페이지가 오픈되었습니다.

이번 버전에서는 아래 기능이 포함됩니다.

1. 공지사항 관리
2. 활동갤러리 관리
3. Q&A 관리
4. FAQ 관리

추가 기능은 순차적으로 업데이트될 예정입니다.
    `.trim(),
  },
  {
    id: 2,
    title: "3월 활동 일정 공지",
    author: "관리자",
    createdAt: "2026-03-10",
    views: 54,
    content: `
3월 주요 활동 일정입니다.

- AI 활용 수업
- 코딩 재능기부 수업
- 플로깅 활동

자세한 일정은 추후 다시 공지하겠습니다.
    `.trim(),
  },
  {
    id: 1,
    title: "홈페이지 점검 안내",
    author: "관리자",
    createdAt: "2026-03-07",
    views: 31,
    content: `
보다 안정적인 서비스 제공을 위해 홈페이지 점검이 진행됩니다.

점검 시간 중 일부 서비스 이용이 제한될 수 있습니다.
이용에 불편을 드려 죄송합니다.
    `.trim(),
  },
];