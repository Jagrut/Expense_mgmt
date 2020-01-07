from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from expense_management.models import (
    Expense_status,
    Expense,
)
from expense_management.serializers import (
    ExpenseSerializer,
)
from django.shortcuts import render
from django.core.serializers.json import DjangoJSONEncoder
from datetime import datetime
import requests
import re
import json

def home(request):
    """
    Load home page.
    """
    expenses = Expense.objects.order_by('-created_at')
    list_of_dicts = list(expenses.values())
    total_expenses_len = len(list_of_dicts)
    pending_expenses_len = len(list(filter(lambda x: x['status_id'] == 1, list_of_dicts)))
    accepted_expenses_len = len(list(filter(lambda x: x['status_id'] == 2, list_of_dicts)))
    declined_expenses_len = total_expenses_len - (pending_expenses_len + accepted_expenses_len)
    expense_stats = {"total_expenses": total_expenses_len,
                     "pending_expenses": pending_expenses_len,
                     "accepted_expenses": accepted_expenses_len,
                     "declined_expenses": declined_expenses_len}
    return render(request, "expense_management/html/home.html", {"data": json.dumps(expense_stats, cls=DjangoJSONEncoder)})

class ExpenseViewSet(viewsets.ModelViewSet):
    """
    This class will answer jqeury datatables's request.
    """
    queryset = Expense.objects.all().order_by('-created_at')
    serializer_class = ExpenseSerializer

class ExpenseMgr(generics.GenericAPIView):
    serializer_class = ExpenseSerializer
    def post(self, request, format=None):
        """
        Generate a random Expense.
        """
        url = 'https://cashcog.xcnt.io/single'
        data = {"message": "Something went wrong, Please contact your administrator."}
        try:
            resp = requests.get(url)
        except Exception as e:
            print("Exception occured, {} ".format(e))
            return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        if resp.ok:
            data = resp.json()
            expense_status = Expense_status.objects.get(pk=1)
            emp_dict = data['employee']
            date_time_tuple = list(map(int, re.search(r'(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)', data["created_at"]).groups()))
            obj = Expense(first_name=emp_dict["first_name"], last_name=emp_dict['last_name'],
                          description=data["description"], amount=data["amount"],
                          currency=data["currency"], created_at=datetime(*date_time_tuple[:]),
                          status=expense_status)
            obj.save()
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, format=None):
        """
        Update expenses.
        """
        id_arr = json.loads(request.body.decode())
        value = id_arr.pop()

        expense_status = Expense_status.objects.get(pk=int(value))
        expense_objs = Expense.objects.in_bulk(id_arr)
        for index, obj in expense_objs.items():
            obj.status = expense_status
            obj.save()
        return Response("Success")
