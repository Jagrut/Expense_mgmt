from django.db import models

# Create your models here.
class Expense_status(models.Model):
    status = models.TextField()
    class Meta:
        verbose_name = 'ExpenseStatus'
        verbose_name_plural = 'ExpenseStatuses'

class Expense(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    description = models.TextField()
    amount = models.IntegerField()
    currency = models.CharField(max_length=5)
    created_at = models.DateField()
    status = models.ForeignKey(Expense_status, on_delete=models.DO_NOTHING,
                               verbose_name='ExpenseStatus', related_name='expenses')
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Expense'
        verbose_name_plural = 'Expenses'
