// Zod validation schemas for all forms

import { z } from 'zod';

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  subject: z.string().max(200, 'Subject is too long').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message is too long'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

// Login form validation
export const loginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

// Profile form validation
export const profileFormSchema = z.object({
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(5000, 'Bio is too long'),
  currentRole: z.string().max(200, 'Current role is too long').optional(),
  education: z.string().max(500, 'Education is too long').optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Social link form validation
export const socialLinkFormSchema = z.object({
  platform: z.enum([
    'instagram',
    'spotify',
    'apple-music',
    'linkedin',
    'youtube',
    'facebook',
    'twitter',
    'tiktok',
    'bandcamp',
    'other',
  ]),
  url: z.string().url('Invalid URL format'),
  displayName: z.string().max(100, 'Display name is too long').optional(),
});

export type SocialLinkFormValues = z.infer<typeof socialLinkFormSchema>;

// Music entry form validation
export const musicFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description is too long'),
  releaseDate: z.string().min(1, 'Release date is required'),
  projectType: z.enum(['solo', 'band', 'collaboration', 'other']),
  coverImage: z.any().optional(),
});

export type MusicFormValues = z.infer<typeof musicFormSchema>;

// Streaming link validation
export const streamingLinkSchema = z.object({
  platform: z.enum(['spotify', 'apple-music', 'youtube-music', 'bandcamp', 'soundcloud', 'other']),
  url: z.string().url('Invalid URL format'),
});

export type StreamingLinkValues = z.infer<typeof streamingLinkSchema>;

// Video form validation
export const videoFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  url: z.string().url('Invalid URL format'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description is too long'),
  category: z.enum(['performance', 'behind-the-scenes', 'interview', 'rehearsal', 'other']),
  thumbnailUrl: z.string().url('Invalid URL format').optional(),
});

export type VideoFormValues = z.infer<typeof videoFormSchema>;

// Event form validation
export const eventFormSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().max(20, 'Time format is too long').optional(),
  venue: z.string().min(1, 'Venue is required').max(200, 'Venue name is too long'),
  city: z.string().min(1, 'City is required').max(100, 'City name is too long'),
  state: z.string().max(100, 'State/province is too long').optional(),
  country: z.string().max(100, 'Country is too long').optional(),
  eventType: z.enum(['concert', 'recital', 'festival', 'workshop', 'masterclass', 'other']),
  description: z.string().max(1000, 'Description is too long').optional(),
  ticketUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

// Post form validation
export const postFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(50, 'Content must be at least 50 characters').max(10000, 'Content is too long'),
  publishDate: z.string().min(1, 'Publish date is required'),
  status: z.enum(['draft', 'published']),
  featuredImage: z.any().optional(),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

// Image upload validation
export const imageUploadSchema = z.object({
  file: z
    .any()
    .refine((file) => file instanceof File, 'Must be a file')
    .refine((file) => file?.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file?.type),
      'Only .jpg, .png, and .webp formats are supported'
    ),
});

// Helper function to validate file before upload
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only .jpg, .png, and .webp formats are supported' };
  }

  return { valid: true };
};

// URL validation helpers
export const validateYouTubeUrl = (url: string): boolean => {
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return regex.test(url);
};

export const validateVimeoUrl = (url: string): boolean => {
  const regex = /^(https?:\/\/)?(www\.)?vimeo\.com\/\d+$/;
  return regex.test(url);
};

export const validateSpotifyUrl = (url: string): boolean => {
  const regex = /^(https?:\/\/)?(www\.)?open\.spotify\.com\/.+$/;
  return regex.test(url);
};

export const validateAppleMusicUrl = (url: string): boolean => {
  const regex = /^(https?:\/\/)?(www\.)?music\.apple\.com\/.+$/;
  return regex.test(url);
};
