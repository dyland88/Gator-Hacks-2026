import {
  type GenerateContentParameters,
  type GenerateContentResponse,
} from "@google/genai";
import { describe, expect, it, vi } from "vitest";

import { createGemmaClient } from "./gemma";

describe("createGemmaClient", () => {
  it("maps conversation messages and returns normalized text", async () => {
    const generateContent = vi.fn(
      async (_parameters: GenerateContentParameters) =>
        ({ text: "  A clear answer.  " }) as GenerateContentResponse,
    );
    const client = createGemmaClient({
      apiKey: "test-key",
      model: "test-gemma",
      generateContent,
    });

    const result = await client.generateText({
      messages: [
        { role: "user", content: "What does this bill do?" },
        { role: "model", content: "Please share the bill." },
        { role: "user", content: "Here is the text." },
      ],
      systemInstruction: "Be neutral.",
      temperature: 0.2,
      maxOutputTokens: 500,
    });

    expect(result).toEqual({ text: "A clear answer.", model: "test-gemma" });
    expect(generateContent).toHaveBeenCalledOnce();
    expect(generateContent.mock.calls[0]?.[0]).toMatchObject({
      model: "test-gemma",
      contents: [
        { role: "user", parts: [{ text: "What does this bill do?" }] },
        { role: "model", parts: [{ text: "Please share the bill." }] },
        { role: "user", parts: [{ text: "Here is the text." }] },
      ],
      config: {
        systemInstruction: "Be neutral.",
        temperature: 0.2,
        maxOutputTokens: 500,
      },
    });
  });

  it("retries one temporary provider failure", async () => {
    const temporaryError = Object.assign(new Error("Service unavailable"), {
      status: 503,
    });
    const generateContent = vi
      .fn<
        (
          parameters: GenerateContentParameters,
        ) => Promise<GenerateContentResponse>
      >()
      .mockRejectedValueOnce(temporaryError)
      .mockResolvedValueOnce({ text: "Recovered" } as GenerateContentResponse);
    const client = createGemmaClient({
      apiKey: "test-key",
      retryDelayMs: 0,
      generateContent,
    });

    await expect(
      client.generateText({
        messages: [{ role: "user", content: "Try again" }],
        systemInstruction: "Answer.",
      }),
    ).resolves.toMatchObject({ text: "Recovered" });
    expect(generateContent).toHaveBeenCalledTimes(2);
  });

  it("uses minimal thinking for Gemma 4", async () => {
    const generateContent = vi.fn(
      async (_parameters: GenerateContentParameters) =>
        ({ text: "A complete answer." }) as GenerateContentResponse,
    );
    const client = createGemmaClient({
      apiKey: "test-key",
      model: "gemma-4-26b-a4b-it",
      generateContent,
    });

    await client.generateText({
      messages: [{ role: "user", content: "Explain this bill." }],
      systemInstruction: "Be clear.",
    });

    expect(generateContent.mock.calls[0]?.[0]).toMatchObject({
      config: { thinkingConfig: { thinkingLevel: "MINIMAL" } },
    });
  });

  it("does not retry a permanent provider failure", async () => {
    const permanentError = Object.assign(new Error("Bad request"), {
      status: 400,
    });
    const generateContent = vi.fn(
      async (_parameters: GenerateContentParameters) => {
        throw permanentError;
      },
    );
    const client = createGemmaClient({
      apiKey: "test-key",
      retryDelayMs: 0,
      generateContent,
    });

    await expect(
      client.generateText({
        messages: [{ role: "user", content: "Invalid request" }],
        systemInstruction: "Answer.",
      }),
    ).rejects.toMatchObject({ retryable: false });
    expect(generateContent).toHaveBeenCalledOnce();
  });

  it("streams text chunks and skips empty ones", async () => {
    const generateContentStream = vi.fn(async () =>
      (async function* () {
        yield { text: "Hello " } as GenerateContentResponse;
        yield { text: "" } as GenerateContentResponse;
        yield { text: "there." } as GenerateContentResponse;
      })(),
    );
    const client = createGemmaClient({
      apiKey: "test-key",
      model: "test-gemma",
      generateContentStream,
    });

    const chunks: string[] = [];
    for await (const chunk of client.streamText({
      messages: [{ role: "user", content: "Hi" }],
      systemInstruction: "Be kind.",
    })) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(["Hello ", "there."]);
  });
});
