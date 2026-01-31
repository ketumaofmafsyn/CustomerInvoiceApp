using System;
using Volo.Abp.Application.Dtos;

namespace CustomerInvoiceApp.Application.Contracts.Customers
{
    public class CustomerDto : AuditedEntityDto<Guid>
    {
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string BillingAddress { get; set; } = null!;
    }
}
