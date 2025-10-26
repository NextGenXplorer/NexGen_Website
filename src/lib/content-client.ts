import { Instagram, Github, Youtube, LucideIcon, Send, MessageCircle, Smartphone } from 'lucide-react';
import content from '../data/content.json';

export interface SocialLink {
  name: string;
  url: string;
  handle: string;
  Icon: LucideIcon;
}

const iconMap: { [key: string]: LucideIcon } = {
  YouTube: Youtube,
  Instagram: Instagram,
  GitHub: Github,
  Telegram: Send,
  'Telegram Group': Send,
  'Telegram Channel': Send,
  'WhatsApp Channel': MessageCircle,
  'Google Play Store': Smartphone,
};

const authorIconMap: { [key: string]: LucideIcon } = {
  dynamic_nithi_: Instagram,
  '_.appu_kannadiga': Instagram,
  'mithun.gowda.b': Instagram,
};

export const channelInfo = content.channelInfo;

export const socials: SocialLink[] = content.socials.map((social) => ({
  ...social,
  Icon: iconMap[social.name] || Instagram,
}));

export const authors: SocialLink[] = content.authors.map((author) => ({
  ...author,
  Icon: authorIconMap[author.name] || Instagram,
}));
