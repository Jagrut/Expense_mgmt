from django.conf.urls import url
from expense_management.views import ExpenseMgr

urlpatterns = [
    url('api/v1/expense', ExpenseMgr.as_view(), name='expenseapi'),
]
