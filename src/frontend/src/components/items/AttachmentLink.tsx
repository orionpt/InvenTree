import { Group, Text } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';
import {
  IconFile,
  IconFileTypeCsv,
  IconFileTypeDoc,
  IconFileTypePdf,
  IconFileTypeXls,
  IconFileTypeZip
} from '@tabler/icons-react';
import { ReactNode } from 'react';

/**
 * Return an icon based on the provided filename
 */
export function attachmentIcon(attachment: string): ReactNode {
  const sz = 18;
  let suffix = attachment.split('.').pop()?.toLowerCase() ?? '';
  switch (suffix) {
    case 'pdf':
      return <IconFileTypePdf size={sz} />;
    case 'csv':
      return <IconFileTypeCsv size={sz} />;
    case 'xls':
    case 'xlsx':
      return <IconFileTypeXls size={sz} />;
    case 'doc':
    case 'docx':
      return <IconFileTypeDoc size={sz} />;
    case 'zip':
    case 'tar':
    case 'gz':
    case '7z':
      return <IconFileTypeZip size={sz} />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'bmp':
    case 'tif':
    case 'webp':
      return <IconPhoto size={sz} />;
    default:
      return <IconFile size={sz} />;
  }
}

/**
 * Render a link to a file attachment, with icon and text
 * @param attachment : string - The attachment filename
 */
export function AttachmentLink({
  attachment
}: {
  attachment: string;
}): ReactNode {
  return (
    <Group position="left" spacing="sm">
      {attachmentIcon(attachment)}
      <Text>{attachment.split('/').pop()}</Text>
    </Group>
  );
}
