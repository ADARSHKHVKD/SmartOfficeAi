from django.urls import path

from .views import (
    testGemini,
    aiChat
)


urlpatterns = [

    path('test/', testGemini),

    path('chat/', aiChat),

]