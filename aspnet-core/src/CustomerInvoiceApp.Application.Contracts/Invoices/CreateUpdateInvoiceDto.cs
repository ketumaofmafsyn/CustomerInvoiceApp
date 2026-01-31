using System;
using System.Collections.Generic;

namespace CustomerInvoiceApp.Application.Contracts.Invoices
{
    public class CreateUpdateInvoiceDto
    {
        public Guid CustomerId { get; set; }
        public string Number { get; set; } = null!;
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public string Status { get; set; } = null!;
        public List<CreateUpdateLineItemDto> LineItems { get; set; } = new();
    }

    public class CreateUpdateLineItemDto
    {
        public string Description { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
