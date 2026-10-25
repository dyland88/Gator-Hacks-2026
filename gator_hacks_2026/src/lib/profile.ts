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

export const interestDescriptions: Record<
  (typeof interestOptions)[number],
  string
> = {
  Nature: "Parks, conservation, trees, water, and environmental protection",
  Health: "Public health, sanitation, healthcare, and community wellbeing",
  Education: "Schools, libraries, learning, and educational programs",
  Housing:
    "Housing, zoning, land use, real property, and historic property policy",
  Jobs: "Employment, workers, businesses, and the local economy",
  Transportation: "Transit, roads, parking, towing, cycling, and walking",
  "Public safety":
    "Police, fire services, emergency response, and public safety rules",
  "Civil rights": "Equal treatment, accessibility, voting, and civil liberties",
};

export const genderOptions = [
  "Woman",
  "Man",
  "Non-binary",
  "Prefer not to say",
] as const;

export const lifeCircumstanceOptions = [
  "Student",
  "Renter",
  "Homeowner",
  "Parent or guardian",
  "Caregiver",
  "Employed",
  "Job seeker",
  "Small-business owner",
  "Retired",
  "Veteran",
  "Person with a disability",
] as const;

export const lifeCircumstancesSchema = z
  .array(z.enum(lifeCircumstanceOptions))
  .max(lifeCircumstanceOptions.length)
  .transform((values) => [...new Set(values)]);

export const profileInputSchema = z
  .object({
    tags: z
      .array(z.enum(interestOptions))
      .max(interestOptions.length)
      .transform((tags) => [...new Set(tags)]),
    age: z.number().int().min(1).max(120).nullable(),
    lifeCircumstances: lifeCircumstancesSchema.default([]),
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
  life_circumstances: string[];
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
          life_circumstances?: string[];
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
