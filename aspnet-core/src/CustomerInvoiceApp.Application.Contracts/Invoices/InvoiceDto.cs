using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace CustomerInvoiceApp.Application.Contracts.Invoices;

public class InvoiceDto : AuditedEntityDto<Guid>
{
    public Guid CustomerId { get; set; }
    public string Number { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public DateTime DueDate { get; set; }
    public string Status { get; set; } = string.Empty;

    // ✅ References the DTO above
    public List<LineItemDto> LineItems { get; set; } = new();

    public decimal SubTotal { get; set; }
    public decimal Tax { get; set; }
    public decimal GrandTotal { get; set; }
}
