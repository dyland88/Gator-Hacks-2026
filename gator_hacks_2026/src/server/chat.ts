import { z } from "zod";

import { GemmaProviderError, type GenerateGemmaTextInput } from "./ai/gemma";

const messageSchema = z.object({
  role: z.enum(["user", "model"]),
  content: z.string().trim().min(1).max(8_000),
});

export const chatInputSchema = z
  .object({
    messages: z.array(messageSchema).min(1).max(12),
  })
  .superRefine(({ messages }, context) => {
    const totalCharacters = messages.reduce(
      (total, message) => total + message.content.length,
      0,
    );

    if (messages.at(-1)?.role !== "user") {
      context.addIssue({
        code: "custom",
        message: "The final chat message must be from the user.",
        path: ["messages"],
      });
    }

    messages.forEach((message, index) => {
      if (message.role === "user" && message.content.length > 2_000) {
        context.addIssue({
          code: "custom",
          message: "User messages must be 2,000 characters or fewer.",
          path: ["messages", index, "content"],
        });
      }
    });

    if (totalCharacters > 12_000) {
      context.addIssue({
        code: "custom",
        message: "The conversation is too long.",
        path: ["messages"],
      });
    }
  });

export const legalSeagullSystemInstruction = `You are Legal Seagull, a neutral civic information assistant. Explain United States legislation in clear, concise language without partisan advocacy. Distinguish carefully between proposed, passed, enacted, failed, and effective legislation. You do not currently have access to Legal Seagull's live legislation database, external tools, or the user's stored profile. Never claim that you looked up a bill or know its current status unless that information appears in the conversation. When asked about a specific bill without enough source material, ask for its jurisdiction, bill number, or text and explain the current retrieval limitation. Identify uncertainty instead of guessing. Do not present information as legal advice.`;

type ChatInput = z.infer<typeof chatInputSchema>;
type GenerateText = (
  input: GenerateGemmaTextInput,
) => Promise<{ text: string; model: string }>;

export class ChatServiceError extends Error {
  readonly code: "unavailable" | "rate_limited";

  constructor(code: "unavailable" | "rate_limited", cause?: unknown) {
    super(
      code === "rate_limited"
        ? "Legal Seagull is receiving too many requests. Please try again shortly."
        : "Legal Seagull could not answer right now. Please try again.",
      { cause },
    );
    this.name = "ChatServiceError";
    this.code = code;
  }
}

export async function createChatReply(
  input: ChatInput,
  generateText: GenerateText,
) {
  try {
    const response = await generateText({
      messages: input.messages,
      systemInstruction: legalSeagullSystemInstruction,
      temperature: 0.3,
      maxOutputTokens: 1_024,
    });

    return {
      message: { role: "model" as const, content: response.text },
      model: response.model,
    };
  } catch (error) {
    if (error instanceof GemmaProviderError && error.retryable) {
      throw new ChatServiceError("rate_limited", error);
    }

    throw new ChatServiceError("unavailable", error);
  }
}
