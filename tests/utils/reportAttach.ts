import { test } from '@playwright/test';

export function attachFileToReport(filePath: string, name?: string) {
  const fileType = filePath.split('.').pop();
  const attachmentName = name || `attachment.${fileType}`;
  
  test.info().attachments.push({
    name: attachmentName,
    path: filePath,
    contentType: `application/${fileType}`,
  });
}
