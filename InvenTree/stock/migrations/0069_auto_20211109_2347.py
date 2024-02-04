# Generated by Django 3.2.5 on 2021-11-09 23:47

import re

from django.db import migrations


def update_serials(apps, schema_editor):
    """
    Rebuild the integer serial number field for existing StockItem objects
    """

    StockItem = apps.get_model('stock', 'stockitem')

    for item in StockItem.objects.all():  # pragma: no cover

        if item.serial is None:
            # Skip items without existing serial numbers
            continue

        serial = 0

        result = re.match(r"^(\d+)", str(item.serial))

        if result and len(result.groups()) == 1:
            try:
                serial = int(result.groups()[0])
            except Exception:
                serial = 0

        # Ensure the integer value is not too large for the database field
        if serial > 0x7fffffff:
            serial = 0x7fffffff

        item.serial_int = serial
        item.save()


class Migration(migrations.Migration):

    dependencies = [
        ('stock', '0068_stockitem_serial_int'),
    ]

    operations = [
        migrations.RunPython(
            update_serials,
            reverse_code=migrations.RunPython.noop,
        )
    ]
