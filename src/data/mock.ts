export type Commitment = {
  id: string;
  title: string;
  daysRemaining: number;
  riskScore: number;
  opportunityLoss: number;
  category: "Exam" | "Assignment" | "Placement" | "Scholarship";
};

export const sampleCommitments: Commitment[] = [
  { id: "1", title: "Data Structures Final", daysRemaining: 3, riskScore: 82, opportunityLoss: 0, category: "Exam" },
  { id: "2", title: "Amazon SDE Intern App", daysRemaining: 5, riskScore: 65, opportunityLoss: 50000, category: "Placement" },
  { id: "3", title: "Machine Learning Project", daysRemaining: 12, riskScore: 30, opportunityLoss: 0, category: "Assignment" },
  { id: "4", title: "Tata Scholarship App", daysRemaining: 2, riskScore: 95, opportunityLoss: 100000, category: "Scholarship" },
];
