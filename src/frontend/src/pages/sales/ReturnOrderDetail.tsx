import { t } from '@lingui/macro';
import { LoadingOverlay, Stack } from '@mantine/core';
import { IconInfoCircle, IconNotes, IconPaperclip } from '@tabler/icons-react';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { PageDetail } from '../../components/nav/PageDetail';
import { PanelGroup, PanelType } from '../../components/nav/PanelGroup';
import { NotesEditor } from '../../components/widgets/MarkdownEditor';
import { ApiEndpoints } from '../../enums/ApiEndpoints';
import { useInstance } from '../../hooks/UseInstance';
import { apiUrl } from '../../states/ApiState';
import { AttachmentTable } from '../../tables/general/AttachmentTable';

/**
 * Detail page for a single ReturnOrder
 */
export default function ReturnOrderDetail() {
  const { id } = useParams();

  const { instance: order, instanceQuery } = useInstance({
    endpoint: ApiEndpoints.return_order_list,
    pk: id,
    params: {
      customer_detail: true
    }
  });

  const orderPanels: PanelType[] = useMemo(() => {
    return [
      {
        name: 'detail',
        label: t`Order Details`,
        icon: <IconInfoCircle />
      },
      {
        name: 'attachments',
        label: t`Attachments`,
        icon: <IconPaperclip />,
        content: (
          <AttachmentTable
            endpoint={ApiEndpoints.return_order_attachment_list}
            model="order"
            pk={Number(id)}
          />
        )
      },
      {
        name: 'notes',
        label: t`Notes`,
        icon: <IconNotes />,
        content: (
          <NotesEditor
            url={apiUrl(ApiEndpoints.return_order_list, id)}
            data={order.notes ?? ''}
            allowEdit={true}
          />
        )
      }
    ];
  }, [order, id]);

  return (
    <>
      <Stack spacing="xs">
        <LoadingOverlay visible={instanceQuery.isFetching} />
        <PageDetail
          title={t`Return Order` + `: ${order.reference}`}
          subtitle={order.description}
          imageUrl={order.customer_detail?.image}
          breadcrumbs={[{ name: t`Sales`, url: '/sales/' }]}
        />
        <PanelGroup pageKey="returnorder" panels={orderPanels} />
      </Stack>
    </>
  );
}
