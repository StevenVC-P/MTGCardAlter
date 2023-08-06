import html2canvas from 'html2canvas';

export const convertToImage = async (element) => {
  const canvas = await html2canvas(element);
  return canvas.toDataURL('image/png');
};