using System;
using Volo.Abp.Domain.Entities;

namespace CustomerInvoiceApp.Invoices
{
    public class LineItem : Entity<Guid>
    {
        public Guid InvoiceId { get; set; }
        public string Description { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }

        public decimal LineTotal => Quantity * UnitPrice;

        public LineItem(Guid id, Guid invoiceId, string description, int quantity, decimal unitPrice)
            : base(id)
        {
            InvoiceId = invoiceId;
            Description = description;
            Quantity = quantity;
            UnitPrice = unitPrice;
        }
    }
}
