import { z } from "zod";

export const identitySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().regex(/[+\d][\d\s\-()]{6,}/, "Phone number required"),
});

export type Identity = z.infer<typeof identitySchema>;
