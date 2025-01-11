import { IMGFLIP_USERNAME, IMGFLIP_PASSWORD } from '../config/constants';
import type { MemeTemplate } from '../types';

const API_URL = 'https://api.imgflip.com';

export async function getTemplates(): Promise<MemeTemplate[]> {
  const response = await fetch(`${API_URL}/get_memes`);
  const data = await response.json();
  return data.data.memes;
}

export async function generateMeme(
  templateId: string,
  texts: string[]
): Promise<string> {
  const formData = new FormData();
  formData.append('template_id', templateId);
  formData.append('username', IMGFLIP_USERNAME);
  formData.append('password', IMGFLIP_PASSWORD);
  
  texts.forEach((text, index) => {
    formData.append(`boxes[${index}][text]`, text);
  });

  const response = await fetch(`${API_URL}/caption_image`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error_message);
  }

  return data.data.url;
}