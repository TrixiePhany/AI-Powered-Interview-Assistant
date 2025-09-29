export interface CandidateRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  internship?: string;
  status: "in-progress" | "completed";  
  score?: number;                       
  qas: {
    id: string;
    question: string;
    answer?: string;
    difficulty: "easy" | "medium" | "hard";
  }[];
  summary?: string;                     
}
