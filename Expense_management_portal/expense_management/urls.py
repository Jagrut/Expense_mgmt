from django.conf.urls import url
from expense_management.views import Expense_Mgr

urlpatterns = [
    url('api/v1/expense', Expense_Mgr.as_view(), name='expenseapi'),
]
