using CustomerInvoiceApp.Application.Contracts.Invoices;
using CustomerInvoiceApp.Application.Contracts.Customers;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace CustomerInvoiceApp.Application.Contracts.Customers
{
    public interface ICustomerAppService :
        ICrudAppService<CustomerDto, Guid, PagedAndSortedResultRequestDto, CreateUpdateCustomerDto>
    {
        Task<List<InvoiceDto>> GetInvoicesForCustomerAsync(Guid customerId);
    }
}
