// Mock AI Service for evaluating sign language practice
export interface AIAssessmentResult {
  score: number;
  isCorrect: boolean;
  feedback: string;
}

export const aiService = {
  // Simulate uploading a video blob and analyzing it
  evaluateVideo: async (videoBlob: Blob): Promise<AIAssessmentResult> => {
    // Simulate API network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Randomize result for demo purposes
    // In production, this would send `videoBlob` to a backend API
    const score = Math.floor(Math.random() * 30) + 70; // Random score between 70 and 100
    const isCorrect = score >= 80;

    let feedback = "";
    if (score >= 90) {
      feedback = "Tuyệt vời! Động tác tay của bạn rất chuẩn xác.";
    } else if (score >= 80) {
      feedback = "Khá tốt. Hãy chú ý hơn đến tốc độ thực hiện.";
    } else {
      feedback = "Chưa chính xác lắm. Hãy xem lại video mẫu và thử lại nhé.";
    }

    return {
      score,
      isCorrect,
      feedback,
    };
  },
};
