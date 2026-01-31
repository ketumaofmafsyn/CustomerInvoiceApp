using System;
using Volo.Abp.Application.Dtos;

namespace CustomerInvoiceApp.Application.Contracts.Invoices;

public class LineItemDto : EntityDto<Guid>
{
    public Guid InvoiceId { get; set; }
    public string Description { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }

    // ✅ MUST be decimal
    public decimal LineTotal { get; set; }
}
