import {
  GoogleGenAI,
  ThinkingLevel,
  type Content,
  type GenerateContentParameters,
  type GenerateContentResponse,
} from "@google/genai";

export const DEFAULT_GEMMA_MODEL = "gemma-4-26b-a4b-it";

export type GemmaMessage = {
  role: "user" | "model";
  content: string;
};

export type GenerateGemmaTextInput = {
  messages: GemmaMessage[];
  systemInstruction: string;
  temperature?: number;
  maxOutputTokens?: number;
};

type GenerateContent = (
  parameters: GenerateContentParameters,
) => Promise<GenerateContentResponse>;

type GenerateContentStream = (
  parameters: GenerateContentParameters,
) => Promise<AsyncIterable<GenerateContentResponse>>;

type GemmaClientOptions = {
  apiKey: string;
  model?: string;
  timeoutMs?: number;
  retryDelayMs?: number;
  generateContent?: GenerateContent;
  generateContentStream?: GenerateContentStream;
};

export class GemmaProviderError extends Error {
  readonly retryable: boolean;

  constructor(message: string, retryable: boolean, cause?: unknown) {
    super(message, { cause });
    this.name = "GemmaProviderError";
    this.retryable = retryable;
  }
}

export function createGemmaClient(options: GemmaClientOptions) {
  const model = options.model ?? DEFAULT_GEMMA_MODEL;
  const timeoutMs = options.timeoutMs ?? 30_000;
  const retryDelayMs = options.retryDelayMs ?? 300;
  const ai = options.generateContent
    ? null
    : new GoogleGenAI({ apiKey: options.apiKey });
  const generateContent =
    options.generateContent ??
    ((parameters: GenerateContentParameters) =>
      ai!.models.generateContent(parameters));

  const generateContentStream =
    options.generateContentStream ??
    ((parameters: GenerateContentParameters) =>
      ai!.models.generateContentStream(parameters));

  function buildParameters(input: GenerateGemmaTextInput) {
    return {
      model,
      contents: input.messages.map((message): Content => ({
        role: message.role,
        parts: [{ text: message.content }],
      })),
      config: {
        systemInstruction: input.systemInstruction,
        temperature: input.temperature ?? 0.3,
        maxOutputTokens: input.maxOutputTokens ?? 1_024,
        thinkingConfig: model.startsWith("gemma-4-")
          ? { thinkingLevel: ThinkingLevel.MINIMAL }
          : undefined,
        abortSignal: AbortSignal.timeout(timeoutMs),
        httpOptions: { timeout: timeoutMs },
      },
    } satisfies GenerateContentParameters;
  }

  return {
    model,
    async *streamText(input: GenerateGemmaTextInput) {
      let yielded = false;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const stream = await generateContentStream(buildParameters(input));
          for await (const chunk of stream) {
            const text = chunk.text;
            if (text) {
              yielded = true;
              yield text;
            }
          }
          if (!yielded) {
            throw new GemmaProviderError(
              "Gemma returned an empty response.",
              false,
            );
          }
          return;
        } catch (error) {
          if (error instanceof GemmaProviderError) throw error;

          const retryable = isRetryableProviderError(error);
          if (yielded || !retryable || attempt === 1) {
            throw new GemmaProviderError(
              "Gemma could not complete the request.",
              retryable,
              error,
            );
          }

          await wait(retryDelayMs);
        }
      }
    },
    async generateText(input: GenerateGemmaTextInput) {
      const contents: Content[] = input.messages.map((message) => ({
        role: message.role,
        parts: [{ text: message.content }],
      }));

      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const response = await generateContent({
            model,
            contents,
            config: {
              systemInstruction: input.systemInstruction,
              temperature: input.temperature ?? 0.3,
              maxOutputTokens: input.maxOutputTokens ?? 1_024,
              thinkingConfig: model.startsWith("gemma-4-")
                ? { thinkingLevel: ThinkingLevel.MINIMAL }
                : undefined,
              abortSignal: AbortSignal.timeout(timeoutMs),
              httpOptions: { timeout: timeoutMs },
            },
          });
          const text = response.text?.trim();

          if (!text) {
            throw new GemmaProviderError(
              "Gemma returned an empty response.",
              false,
            );
          }

          return { text, model };
        } catch (error) {
          if (error instanceof GemmaProviderError) throw error;

          const retryable = isRetryableProviderError(error);
          if (!retryable || attempt === 1) {
            throw new GemmaProviderError(
              "Gemma could not complete the request.",
              retryable,
              error,
            );
          }

          await wait(retryDelayMs);
        }
      }

      throw new GemmaProviderError(
        "Gemma could not complete the request.",
        false,
      );
    },
  };
}

function isRetryableProviderError(error: unknown) {
  if (!(error instanceof Error)) return false;

  const providerError = error as Error & {
    status?: number;
    code?: number | string;
  };
  const status =
    typeof providerError.status === "number"
      ? providerError.status
      : typeof providerError.code === "number"
        ? providerError.code
        : Number(providerError.code);

  if ([429, 500, 502, 503, 504].includes(status)) return true;

  const message = providerError.message.toLowerCase();
  return (
    message.includes("timeout") ||
    message.includes("timed out") ||
    message.includes("rate limit") ||
    message.includes("temporarily unavailable")
  );
}

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
