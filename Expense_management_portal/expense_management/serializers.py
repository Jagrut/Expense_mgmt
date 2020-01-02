from rest_framework import serializers
from expense_management.models import (
    Expense_status,
    Expense,
)
class ExpenseStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense_status
        fields = (
            'id', 'status',
        )

class ExpenseSerializer(serializers.ModelSerializer):
    status = serializers.ReadOnlyField(source='status.status')
    DT_RowId = serializers.SerializerMethodField()
    DT_RowAttr = serializers.SerializerMethodField()

    def get_DT_RowId(self, expense):
        return '%d' % expense.pk

    def get_DT_RowAttr(self, expense):
        return {'data-pk': expense.pk}

    class Meta:
        model = Expense
        fields = (
            'DT_RowId', 'DT_RowAttr', 'first_name', 'last_name', 'description', 'amount',
            'currency', 'created_at', 'status',
        )


