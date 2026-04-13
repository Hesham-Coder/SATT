export type SupportedLocale = "ar" | "en";

export type LocalizedText = {
  ar: string;
  en: string;
};

export type ConferenceCategory = {
  key: string;
  label: LocalizedText;
};

export type ConferenceTags = {
  ar: string[];
  en: string[];
};

export type Conference = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  shortDescription: LocalizedText;
  date: string;
  location: LocalizedText;
  category: ConferenceCategory;
  images: string[];
  videos: string[];
  tags: ConferenceTags;
  createdAt: string;
};

export type ConferenceFormValues = {
  id?: string;
  title: LocalizedText;
  description: LocalizedText;
  shortDescription: LocalizedText;
  date: string;
  location: LocalizedText;
  category: ConferenceCategory;
  images: string[];
  videos: string[];
  tags: ConferenceTags;
};
