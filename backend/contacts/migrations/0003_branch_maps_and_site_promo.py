# Generated manually for branch map embeds + SitePromo singleton

from django.db import migrations, models


def seed_site_promo(apps, schema_editor):
    SitePromo = apps.get_model("contacts", "SitePromo")
    SitePromo.objects.get_or_create(
        pk=1,
        defaults={
            "ticker_enabled": True,
        },
    )


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("contacts", "0002_alter_branch_address_en_alter_branch_name_en"),
    ]

    operations = [
        migrations.CreateModel(
            name="SitePromo",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("discount_ky", models.CharField(blank=True, max_length=220)),
                ("discount_ru", models.CharField(blank=True, max_length=220)),
                ("discount_en", models.CharField(blank=True, max_length=220)),
                ("limited_ky", models.CharField(blank=True, max_length=220)),
                ("limited_ru", models.CharField(blank=True, max_length=220)),
                ("limited_en", models.CharField(blank=True, max_length=220)),
                ("ticker_enabled", models.BooleanField(default=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "Site promo (home ticker)",
                "verbose_name_plural": "Site promo (home ticker)",
            },
        ),
        migrations.AddField(
            model_name="branch",
            name="google_maps_embed_url",
            field=models.TextField(
                blank=True,
                help_text="Google Maps → Share → Embed a map → copy the iframe src URL",
            ),
        ),
        migrations.AddField(
            model_name="branch",
            name="two_gis_embed_url",
            field=models.TextField(
                blank=True,
                help_text="2GIS widget/embed: copy the iframe src URL",
            ),
        ),
        migrations.RunPython(seed_site_promo, noop_reverse),
    ]
