
import { PersonaPack } from "./PersonaPack.js";

export function buildHeartPrompt(characterName, userMessage) {
  const persona = PersonaPack[characterName] || {};
  return `คุณคือ ${persona.name || "AI"} เพื่อนของผู้ใช้ ช่วยตอบกลับด้วยโทน "${persona.tone}" และบุคลิก "${persona.personality}". ผู้ใช้พูดว่า: "${userMessage}"`;
}
