from django.shortcuts import get_object_or_404, render

from .models import Review, Wine

def home(request):
    return render(request, "expense_management/html/bootstrap1.html", {"data": json.dumps(list_of_dicts, cls=DjangoJSONEncoder)})
