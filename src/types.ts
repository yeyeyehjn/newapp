export type CaseStatus = '审理中' | '待开庭' | '已结案' | '待签名';

export type CaseCategory = '国际贸易纠纷' | '股权投资纠纷' | '建设工程纠纷' | '知识产权纠纷' | '金融借款合同' | '海商海事纠纷';

export type ArbitratorRole = '首席' | '独任' | '边裁';

export interface TimelineNode {
  title: string;
  time: string;
  status: 'completed' | 'processing' | 'pending';
  operator?: string;
  remark?: string;
}

export interface EvidenceNode {
  id: string;
  name: string;
  submitter: string;
  time: string;
  size: string;
  ext: string;
  url?: string;
}

export interface HearingSchedule {
  id: string;
  hearingTime: string;
  location: string;
  status: '待开庭' | '已结束';
  notes?: string;
}

export interface Case {
  id: string;
  caseNo: string;
  title: string;
  claimant: string;
  claimantAgent?: string;
  respondent: string;
  respondentAgent?: string;
  disputeAmount: number; // In CNY
  status: CaseStatus;
  category: CaseCategory;
  role: ArbitratorRole;
  startDate: string;
  formationDate?: string;
  secretary?: string;
  closeDate?: string;
  rules: string;
  commission: string;
  description: string;
  timeline: TimelineNode[];
  evidence: EvidenceNode[];
  hearings: HearingSchedule[];
}

export type TaskType = 'review' | 'sign' | 'schedule';

export interface Task {
  id: string;
  caseId: string;
  caseNo: string;
  caseTitle: string;
  type: TaskType;
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'completed';
  severity: 'urgent' | 'normal' | 'low';
  details?: {
    awardText?: string;
    hearingChoices?: string[];
    reviewDocs?: { id: string; name: string; type: string }[];
  };
}

export interface ArbitratorProfile {
  name: string;
  avatar: string;
  idNo: string;
  specialties: string[];
  resolvedCount: number;
  activeCount: number;
  avgResolveDays: number;
  ranking: string;
}
