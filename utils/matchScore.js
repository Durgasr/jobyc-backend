import OpenAI from "openai";

import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("config", ".env") });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// Function to calculate cosine similarity
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Main AI function to calculate match score
export async function getMatchScore(resumeText, jobDescription) {
  try {
    // Step 1: Create embeddings for both texts
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: [resumeText, jobDescription],
    });

    // Step 2: Extract vectors
    const resumeVector = response.data[0].embedding;
    const jobVector = response.data[1].embedding;

    // Step 3: Compute similarity (0 → 1)
    const similarity = cosineSimilarity(resumeVector, jobVector);

    // Step 4: Convert to percentage (0 → 100)
    const matchScore = Math.round(similarity * 100);

    return matchScore;
  } catch (error) {
    console.error("Error calculating match score:", error);
    return 0;
  }
}
