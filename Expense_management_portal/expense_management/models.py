from django.db import models
import uuid

# Create your models here.
class Expense_status(models.Model):
    status = models.TextField()
    class Meta:
        verbose_name = 'ExpenseStatus'
        verbose_name_plural = 'ExpenseStatuses'

class Employee(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    employee_uuid = models.UUIDField(default=uuid.uuid4)
    class Meta:
        verbose_name = 'Employee'
        verbose_name_plural = 'Employees'   

class Expense(models.Model):
    expense_uuid = models.UUIDField(default=uuid.uuid4)
    description = models.TextField()
    amount = models.IntegerField()
    currency = models.CharField(max_length=5)
    created_at = models.DateField()
    status = models.ForeignKey(Expense_status, on_delete=models.DO_NOTHING,
                               verbose_name='ExpenseStatus', related_name='expenses')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, default=1,
                                 verbose_name='Employee', related_name='employees')
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Expense'
        verbose_name_plural = 'Expenses'
