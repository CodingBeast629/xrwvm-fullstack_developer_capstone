from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('djangoapp/', include('djangoapp.urls')),

    # Home page
    path('', TemplateView.as_view(template_name="Home.html")),

    # About page
    path('about/', TemplateView.as_view(template_name="About.html")),

    # Contact page
    path('contact/', TemplateView.as_view(template_name="Contact.html")),

    # Login page (React)
    path('login/', TemplateView.as_view(template_name="index.html")),

    # Register page (React)  <<< THIS IS THE ONE YOU ARE MISSING
    path('register/', TemplateView.as_view(template_name="index.html")),
    
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
