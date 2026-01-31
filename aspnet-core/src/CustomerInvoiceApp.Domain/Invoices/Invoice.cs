using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Entities.Auditing;

namespace CustomerInvoiceApp.Invoices
{
    public class Invoice : FullAuditedAggregateRoot<Guid>
    {
        public Guid CustomerId { get; set; }
        public string Number { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public string Status { get; set; } = "Draft";

        public List<LineItem> LineItems { get; set; } = new();

        public Invoice(Guid id, Guid customerId, string number, DateTime invoiceDate, DateTime dueDate)
            : base(id)
        {
            CustomerId = customerId;
            Number = number;
            InvoiceDate = invoiceDate;
            DueDate = dueDate;
            Status = "Draft";
            LineItems = new List<LineItem>();
        }

        public void AddLineItem(LineItem item) => LineItems.Add(item);

        public void UpdateDates(DateTime invoiceDate, DateTime dueDate)
        {
            InvoiceDate = invoiceDate;
            DueDate = dueDate;
        }

        public void UpdateStatus(string status) => Status = status;
    }
}
