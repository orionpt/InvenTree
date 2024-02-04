import { t } from '@lingui/macro';
import { Text } from '@mantine/core';
import { ReactNode, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { AddItemButton } from '../../components/buttons/AddItemButton';
import { Thumbnail } from '../../components/images/Thumbnail';
import { ApiEndpoints } from '../../enums/ApiEndpoints';
import { ModelType } from '../../enums/ModelType';
import { UserRoles } from '../../enums/Roles';
import { useSupplierPartFields } from '../../forms/CompanyForms';
import { openDeleteApiForm, openEditApiForm } from '../../functions/forms';
import { getDetailUrl } from '../../functions/urls';
import { useCreateApiFormModal } from '../../hooks/UseForm';
import { useTable } from '../../hooks/UseTable';
import { apiUrl } from '../../states/ApiState';
import { useUserState } from '../../states/UserState';
import { TableColumn } from '../Column';
import {
  DescriptionColumn,
  LinkColumn,
  NoteColumn,
  PartColumn
} from '../ColumnRenderers';
import { InvenTreeTable } from '../InvenTreeTable';
import { RowDeleteAction, RowEditAction } from '../RowActions';
import { TableHoverCard } from '../TableHoverCard';

/*
 * Construct a table listing supplier parts
 */

export function SupplierPartTable({ params }: { params: any }): ReactNode {
  const table = useTable('supplierparts');

  const user = useUserState();
  const navigate = useNavigate();

  // Construct table columns for this table
  const tableColumns: TableColumn[] = useMemo(() => {
    return [
      {
        accessor: 'part',
        switchable: 'part' in params,
        sortable: true,
        render: (record: any) => PartColumn(record?.part_detail)
      },
      {
        accessor: 'supplier',
        sortable: true,
        render: (record: any) => {
          let supplier = record?.supplier_detail ?? {};

          return supplier?.pk ? (
            <Thumbnail
              src={supplier?.thumbnail ?? supplier.image}
              text={supplier.name}
            />
          ) : (
            '-'
          );
        }
      },
      {
        accessor: 'SKU',
        title: t`Supplier Part`,
        sortable: true
      },
      DescriptionColumn({}),
      {
        accessor: 'manufacturer',

        sortable: true,
        render: (record: any) => {
          let manufacturer = record?.manufacturer_detail ?? {};

          return manufacturer?.pk ? (
            <Thumbnail
              src={manufacturer?.thumbnail ?? manufacturer.image}
              text={manufacturer.name}
            />
          ) : (
            '-'
          );
        }
      },
      {
        accessor: 'MPN',

        sortable: true,
        title: t`MPN`,
        render: (record: any) => record?.manufacturer_part_detail?.MPN
      },
      {
        accessor: 'in_stock',
        sortable: true
      },
      {
        accessor: 'packaging',
        sortable: true
      },
      {
        accessor: 'pack_quantity',
        sortable: true,

        render: (record: any) => {
          let part = record?.part_detail ?? {};

          let extra = [];

          if (part.units) {
            extra.push(
              <Text key="base">
                {t`Base units`} : {part.units}
              </Text>
            );
          }

          return (
            <TableHoverCard
              value={record.pack_quantity}
              extra={extra}
              title={t`Pack Quantity`}
            />
          );
        }
      },
      LinkColumn(),
      NoteColumn(),
      {
        accessor: 'available',
        sortable: true,

        render: (record: any) => {
          let extra = [];

          if (record.availablility_updated) {
            extra.push(
              <Text>
                {t`Updated`} : {record.availablility_updated}
              </Text>
            );
          }

          return <TableHoverCard value={record.available} extra={extra} />;
        }
      }
    ];
  }, [params]);

  const addSupplierPartFields = useSupplierPartFields({
    partPk: params?.part,
    supplierPk: params?.supplier,
    hidePart: true
  });
  const { modal: addSupplierPartModal, open: openAddSupplierPartForm } =
    useCreateApiFormModal({
      url: ApiEndpoints.supplier_part_list,
      title: t`Add Supplier Part`,
      fields: addSupplierPartFields,
      onFormSuccess: table.refreshTable,
      successMessage: t`Supplier part created`
    });

  // Table actions
  const tableActions = useMemo(() => {
    // TODO: Hide actions based on user permissions

    return [
      <AddItemButton
        tooltip={t`Add supplier part`}
        onClick={openAddSupplierPartForm}
      />
    ];
  }, [user]);

  const editSupplierPartFields = useSupplierPartFields({
    hidePart: true,
    partPk: params?.part
  });

  // Row action callback
  const rowActions = useCallback(
    (record: any) => {
      return [
        RowEditAction({
          hidden: !user.hasChangeRole(UserRoles.purchase_order),
          onClick: () => {
            record.pk &&
              openEditApiForm({
                url: ApiEndpoints.supplier_part_list,
                pk: record.pk,
                title: t`Edit Supplier Part`,
                fields: editSupplierPartFields,
                onFormSuccess: table.refreshTable,
                successMessage: t`Supplier part updated`
              });
          }
        }),
        RowDeleteAction({
          hidden: !user.hasDeleteRole(UserRoles.purchase_order),
          onClick: () => {
            record.pk &&
              openDeleteApiForm({
                url: ApiEndpoints.supplier_part_list,
                pk: record.pk,
                title: t`Delete Supplier Part`,
                successMessage: t`Supplier part deleted`,
                onFormSuccess: table.refreshTable,
                preFormWarning: t`Are you sure you want to remove this supplier part?`
              });
          }
        })
      ];
    },
    [user, editSupplierPartFields]
  );

  return (
    <>
      {addSupplierPartModal}
      <InvenTreeTable
        url={apiUrl(ApiEndpoints.supplier_part_list)}
        tableState={table}
        columns={tableColumns}
        props={{
          params: {
            ...params,
            part_detail: true,
            supplier_detail: true,
            manufacturer_detail: true
          },
          rowActions: rowActions,
          tableActions: tableActions,
          onRowClick: (record: any) => {
            if (record?.pk) {
              navigate(getDetailUrl(ModelType.supplierpart, record.pk));
            }
          }
        }}
      />
    </>
  );
}
