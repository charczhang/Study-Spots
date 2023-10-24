# Generated by Django 4.2.6 on 2023-10-24 03:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('studyspots', '0007_remove_studyspace_crookedness_ratings'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='location',
            name='coordinates',
        ),
        migrations.AddField(
            model_name='location',
            name='lat',
            field=models.DecimalField(decimal_places=7, default=0.0, max_digits=10),
        ),
        migrations.AddField(
            model_name='location',
            name='lng',
            field=models.DecimalField(decimal_places=7, default=0.0, max_digits=10),
        ),
    ]