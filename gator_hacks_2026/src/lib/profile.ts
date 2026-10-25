import { z } from "zod";

export const interestOptions = [
  "Nature",
  "Health",
  "Education",
  "Housing",
  "Jobs",
  "Transportation",
  "Public safety",
  "Civil rights",
] as const;

export const genderOptions = [
  "Woman",
  "Man",
  "Non-binary",
  "Prefer not to say",
] as const;

export const profileInputSchema = z
  .object({
    tags: z
      .array(z.enum(interestOptions))
      .max(interestOptions.length)
      .transform((tags) => [...new Set(tags)]),
    age: z.number().int().min(1).max(120).nullable(),
    location: z.string().trim().max(300).nullable(),
    locationId: z.string().trim().max(100).nullable(),
    gender: z.enum(genderOptions).nullable(),
  })
  .strict();

export type ProfileInput = z.infer<typeof profileInputSchema>;

export type StoredProfile = {
  id: string;
  tags: string[];
  age: number | null;
  location: string | null;
  location_id: string | null;
  gender: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: StoredProfile;
        Insert: {
          id: string;
          tags?: string[];
          age?: number | null;
          location?: string | null;
          location_id?: string | null;
          gender?: string | null;
        };
        Update: Partial<Omit<StoredProfile, "created_at" | "updated_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
