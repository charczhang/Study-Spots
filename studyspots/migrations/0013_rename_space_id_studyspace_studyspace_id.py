# Generated by Django 4.2.6 on 2023-10-31 23:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('studyspots', '0012_alter_location_lat_alter_location_lng'),
    ]

    operations = [
        migrations.RenameField(
            model_name='studyspace',
            old_name='space_id',
            new_name='studyspace_id',
        ),
    ]
