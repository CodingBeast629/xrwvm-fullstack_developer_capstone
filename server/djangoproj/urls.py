from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('djangoapp/', include('djangoapp.urls')),

    # ✅ Regular Django template pages
    path('', TemplateView.as_view(template_name="Home.html"), name='home'),
    path('about/', TemplateView.as_view(template_name="About.html"), name='about'),
    path('contact/', TemplateView.as_view(template_name="Contact.html"), name='contact'),

    # ✅ React SPA entry (index.html) for React-managed routes
    path('dealers/', TemplateView.as_view(template_name="index.html"), name='dealers'),
    path('dealer/<int:dealer_id>/', TemplateView.as_view(template_name="index.html"), name='dealer'),
    path('login/', TemplateView.as_view(template_name="index.html"), name='login'),
    path('register/', TemplateView.as_view(template_name="index.html"), name='register'),
    path('postreview/<int:dealer_id>/', TemplateView.as_view(template_name="index.html"), name='postreview'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)