import { t } from '@lingui/macro';
import { Stack } from '@mantine/core';
import {
  IconBellCheck,
  IconBellExclamation,
  IconCircleCheck,
  IconCircleX,
  IconTrash
} from '@tabler/icons-react';
import { useMemo } from 'react';

import { api } from '../App';
import { PageDetail } from '../components/nav/PageDetail';
import { PanelGroup } from '../components/nav/PanelGroup';
import { ApiEndpoints } from '../enums/ApiEndpoints';
import { useTable } from '../hooks/UseTable';
import { apiUrl } from '../states/ApiState';
import { NotificationTable } from '../tables/notifications/NotificationsTable';

export default function NotificationsPage() {
  const unreadTable = useTable('unreadnotifications');
  const readTable = useTable('readnotifications');

  const notificationPanels = useMemo(() => {
    return [
      {
        name: 'unread',
        label: t`Notifications`,
        icon: <IconBellExclamation size="18" />,
        content: (
          <NotificationTable
            params={{ read: false }}
            tableState={unreadTable}
            actions={(record) => [
              {
                title: t`Mark as read`,
                color: 'green',
                icon: <IconCircleCheck />,
                onClick: () => {
                  let url = apiUrl(ApiEndpoints.notifications_list, record.pk);
                  api
                    .patch(url, {
                      read: true
                    })
                    .then((response) => {
                      unreadTable.refreshTable();
                    });
                }
              }
            ]}
          />
        )
      },
      {
        name: 'history',
        label: t`History`,
        icon: <IconBellCheck size="18" />,
        content: (
          <NotificationTable
            params={{ read: true }}
            tableState={readTable}
            actions={(record) => [
              {
                title: t`Mark as unread`,
                icon: <IconCircleX />,
                onClick: () => {
                  let url = apiUrl(ApiEndpoints.notifications_list, record.pk);

                  api
                    .patch(url, {
                      read: false
                    })
                    .then((response) => {
                      readTable.refreshTable();
                    });
                }
              },
              {
                title: t`Delete`,
                color: 'red',
                icon: <IconTrash />,
                onClick: () => {
                  api
                    .delete(apiUrl(ApiEndpoints.notifications_list, record.pk))
                    .then((response) => {
                      readTable.refreshTable();
                    });
                }
              }
            ]}
          />
        )
      }
    ];
  }, [unreadTable, readTable]);

  return (
    <>
      <Stack>
        <PageDetail title={t`Notifications`} />
        <PanelGroup pageKey="notifications" panels={notificationPanels} />
      </Stack>
    </>
  );
}
